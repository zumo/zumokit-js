import { errorProxy } from './errorProxy';
import {
  Dictionary,
  CurrencyCode,
  TokenSet,
  ExchangeRateJSON,
  TimeInterval,
  HistoricalExchangeRatesJSON,
} from './types';
import User from './User';
import Utils from './Utils';
import ExchangeRate from './models/ExchangeRate';
import ZumoKitError from './ZumoKitError';
import ExchangeSettings from './models/ExchangeSettings';
import FeeRates from './models/FeeRates';

type HistoricalExchangeRates = Dictionary<
  TimeInterval,
  Dictionary<CurrencyCode, Dictionary<CurrencyCode, Array<ExchangeRate>>>
>;

/** @internal */
const parseHistoricalExchangeRates = (
  exchangeRateMapJSON: Record<string, Record<string, Record<string, Array<ExchangeRateJSON>>>>
) => {
  const exchangeRateMap: Dictionary<
    TimeInterval,
    Dictionary<CurrencyCode, Dictionary<CurrencyCode, Array<ExchangeRate>>>
  > = {};
  Object.keys(exchangeRateMapJSON).forEach((timeInterval) => {
    const outerMap: Dictionary<CurrencyCode, Dictionary<CurrencyCode, Array<ExchangeRate>>> = exchangeRateMapJSON[timeInterval];
    Object.keys(outerMap).forEach((depositCurrency) => {
      const innerMap: Dictionary<CurrencyCode, Array<ExchangeRate>> =
        (outerMap[depositCurrency as CurrencyCode] as Dictionary<CurrencyCode, Array<ExchangeRate>>);
      Object.keys(innerMap).forEach(
        (withdrawCurrency) => {
          const array: Array<ExchangeRateJSON> = (exchangeRateMapJSON[timeInterval][depositCurrency][withdrawCurrency] as Array<ExchangeRateJSON>);
          (exchangeRateMap as any)[timeInterval as TimeInterval][depositCurrency as CurrencyCode][
            withdrawCurrency as CurrencyCode
          ] = array.map((exchangeRateJSON) => new ExchangeRate(exchangeRateJSON));
        }
      );
    });
  });
  return exchangeRateMap;
}


/**
 * ZumoKit instance.
 * <p>
 * See <a href="https://developers.zumo.money/docs/guides/getting-started">Getting Started</a> guide for usage details.
 * */
export default class ZumoKit {
  private zumoCore: any;

  /** ZumoKit SDK semantic version tag if exists, commit hash otherwise. */
  version: string;

  /** @internal */
  constructor(apiKey: string, apiRoot: string, txServiceUrl: string) {
    this.version = window.ZumoCoreModule.ZumoCore.getVersion();

    const httpImpl = new window.ZumoCoreModule.HttpImplWrapper({
      request: async function (url: string, method: string, headers: any, data: string, callback: any) {
        let requestHeaders: Record<string, string> = {};
        const mapKeys = headers.keys();
        for (var i = 0; i < mapKeys.size(); i++) {
          const key = mapKeys.get(i);
          requestHeaders[key] = headers.get(key);
        }

        console.log("Requesting " + url);
        try {
          const response = await fetch(url, {
            method: method,
            headers: requestHeaders,
            body: data
          });

          const result = await response.text();
          callback.onSuccess(response.status, result);
        } catch (exception) {
          if (typeof exception === 'number') {
            callback.onNetworkError(window.ZumoCoreModule.getException(exception).message);
          } else {
            callback.onNetworkError(exception.message);
          }
        }
      }
    });

    let socket: WebSocket | null = null;
    let wsListener: any = null;
    function connectWebSocket() {
      socket = new WebSocket(txServiceUrl.replace("https", "wss"));

      socket.addEventListener('open', function (event) {
        wsListener && wsListener.onOpen(txServiceUrl);
      });

      socket.addEventListener('message', function (event) {
        wsListener && wsListener.onMessage(event.data);
      });

      socket.addEventListener('error', function (event) {
        wsListener && wsListener.onError('WebSocket error observed');
        socket?.close();
      });

      socket.addEventListener('close', function (event) {
        wsListener && wsListener.onClose(
          'WebSocket connection closed with exit code ' + event.code + ', additional info: ' + event.reason
        );

        // TODO: Reconnect via fuzzing back off generator
        console.log("Reconnecting in 5 seconds...");
        setTimeout(function () {
          connectWebSocket();
        }, 5000);
      });
    }
    connectWebSocket();

    const wsImpl = new window.ZumoCoreModule.WebSocketImplWrapper({
      send: function (message: string) {
        socket && socket.send(message);
      },
      subscribe: function (listener: any) {
        wsListener = listener;
      }
    });

    this.zumoCore = new window.ZumoCoreModule.ZumoCore(httpImpl, wsImpl, apiKey, apiRoot, txServiceUrl);
  }

  /**
   * Authenticates user token set and returns corresponding user. On success user is set as active user.
   * Refer to <a href="https://developers.zumo.money/docs/setup/server#get-zumokit-user-token">Server</a> guide for details on how to get user token set.
   *
   * @param tokenSet   user token set
   */
  authUser(userTokenSet: TokenSet) {
    return errorProxy<User>((resolve: any, reject: any) => {
      this.zumoCore.authUser(
        JSON.stringify(userTokenSet),
        new window.ZumoCoreModule.UserCallbackWrapper({
        onError: function (error: string) {
          reject(new ZumoKitError(error));
        },
        onSuccess: function (user: any) {
          resolve(new User(user));
        }
      }));
    })
  };

   /**
    * Get active user if exists.
    *
    * @return active user or null
    */
  getActiveUser() {
    const activeUser = this.zumoCore.getActiveUser();
    return activeUser ? new User(activeUser) : null;
  }

  /**
   * Returns crypto utility class.
   */
  getUtils(): Utils {
    return new Utils(this.zumoCore.getUtils());
  }

  /**
   * Get exchange rate for selected currency pair.
   *
   * @param fromCurrency   currency code
   * @param toCurrency     currency code
   *
   * @return exchange rate or null
   */
  getExchangeRate(fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
    const exchangeRate = this.zumoCore.getExchangeRate(fromCurrency, toCurrency);
    if (exchangeRate.hasValue())
      return new ExchangeRate(JSON.parse(exchangeRate.get()));
    else
      return null;
  }

  /**
   * Get exchange settings for selected currency pair.
   *
   * @param fromCurrency   currency code
   * @param toCurrency     currency code
   *
   * @return exchange rate or null
   */
  getExchangeSettings(fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
    const exchangeSettings = this.zumoCore.getExchangeSettings(fromCurrency, toCurrency);
    if (exchangeSettings.hasValue())
      return new ExchangeSettings(JSON.parse(exchangeSettings.get()));
    else
      return null;
  }

    /**
   * Get exchange settings for selected currency pair.
   *
   * @param currency   currency code
   *
   * @return fee rates or null
   */
  getFeeRates(currency: CurrencyCode) {
    const feeRates = this.zumoCore.getFeeRates(currency);
    if (feeRates.hasValue())
      return new FeeRates(JSON.parse(feeRates.get()));
    else
      return null;
  }

  /**
   * Fetch historical exchange rates for supported time intervals.
   * On success callback returns historical exchange rates are contained in a mapping between
   * time interval on a top level, from currency on second level, to currency on third level and
   * {@link ExchangeRate ExchangeRate} objects.
   */
  fetchHistoricalExchangeRates() {
    return errorProxy<HistoricalExchangeRates>((resolve: any, reject: any) => {
      this.zumoCore.fetchHistoricalExchangeRates(
        new window.ZumoCoreModule.HistoricalExchangeRatesCallbackWrapper({
        onError: function (error: string) {
          reject(new ZumoKitError((error)));
        },
        onSuccess: function (json: string) {
          const exchangeRateMapJSON = JSON.parse(json) as HistoricalExchangeRatesJSON;
          resolve(parseHistoricalExchangeRates(exchangeRateMapJSON));
        }
      }));
    })
  }
}