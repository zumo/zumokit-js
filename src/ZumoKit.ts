import { errorProxy } from './errorProxy';
import {
  Dictionary,
  CurrencyCode,
  TokenSet,
  ExchangeRateJSON,
  ExchangeSettingJSON,
  TransactionFeeRateJSON,
  TimeInterval,
  HistoricalExchangeRatesJSON,
} from './types';
import User from './User';
import Utils from './Utils';
import ExchangeRate from './models/ExchangeRate';
import ZumoKitError from './ZumoKitError';
import ExchangeSetting from './models/ExchangeSetting';
import TransactionFeeRate from './models/TransactionFeeRate';

/** @internal */
const parseExchangeRates = (exchangeRateMapJSON: Record<string, Record<string, ExchangeRateJSON>>) => {
  const exchangeRates: Dictionary<CurrencyCode, Dictionary<CurrencyCode, ExchangeRate>> = {};
  Object.keys(exchangeRateMapJSON).forEach((depositCurrency) => {
    const innerMap: Dictionary<CurrencyCode, ExchangeRate> = {};
    Object.keys(exchangeRateMapJSON[depositCurrency]).forEach((toCurrency) => {
      innerMap[toCurrency as CurrencyCode] = new ExchangeRate(
        exchangeRateMapJSON[depositCurrency][toCurrency]
      );
    });
    exchangeRates[depositCurrency as CurrencyCode] = innerMap;
  });
  return exchangeRates;
}

/** @internal */
const parseExchangeSettings = (
  exchangeSettingsMapJSON: Record<string, Record<string, ExchangeSettingJSON>>
) => {
  const exchangeSettings: Dictionary<
    CurrencyCode,
    Dictionary<CurrencyCode, ExchangeSetting>
  > = {};
  Object.keys(exchangeSettingsMapJSON).forEach((depositCurrency) => {
    const innerMap: Dictionary<CurrencyCode, ExchangeSetting> = {};
    Object.keys(exchangeSettingsMapJSON[depositCurrency]).forEach((withdrawCurrency) => {
      innerMap[withdrawCurrency as CurrencyCode] = new ExchangeSetting(
        exchangeSettingsMapJSON[depositCurrency][withdrawCurrency]
      );
    });
    exchangeSettings[depositCurrency as CurrencyCode] = innerMap;
  });
  return exchangeSettings;
}

/** @internal */
const parseTransactionFeeRates = (transactionFeeRatesJSON: Record<string, TransactionFeeRateJSON>) => {
  const feeRates: Dictionary<CurrencyCode, TransactionFeeRate> = {};
  Object.keys(transactionFeeRatesJSON).forEach((currencyCode) => {
    feeRates[currencyCode as CurrencyCode] = new TransactionFeeRate(transactionFeeRatesJSON[currencyCode]);
  });
  return feeRates;
}


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
    Object.keys(outerMap).forEach((fromCurrency) => {
      const innerMap: Dictionary<CurrencyCode, Array<ExchangeRate>> =
        (outerMap[fromCurrency as CurrencyCode] as Dictionary<CurrencyCode, Array<ExchangeRate>>);

      if (!exchangeRateMap[timeInterval as TimeInterval])
        exchangeRateMap[timeInterval as TimeInterval] = {};

      if (!exchangeRateMap[timeInterval as TimeInterval][fromCurrency as CurrencyCode])
        exchangeRateMap[timeInterval as TimeInterval][fromCurrency as CurrencyCode] = {};

      Object.keys(innerMap).forEach(
        (toCurrency) => {
          const array: Array<ExchangeRateJSON> = (exchangeRateMapJSON[timeInterval][fromCurrency][toCurrency] as Array<ExchangeRateJSON>);
          (exchangeRateMap as any)[timeInterval as TimeInterval][fromCurrency as CurrencyCode][
            toCurrency as CurrencyCode
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

  private changeListeners: Array<() => void> = [];

  private changeListenersImpl: Array<any> = [];

  /** ZumoKit SDK semantic version tag if exists, commit hash otherwise. */
  version: string;

  /** Currently authenticated user. */
  currentUser: User = null;

  /** Crypto utilities. */
  utils: Utils;

  /** Mapping between currency pairs and available exchange rates. */
  exchangeRates: Dictionary<CurrencyCode, Dictionary<CurrencyCode, ExchangeRate>> = {};

  /** Mapping between currency pairs and available exchange settings. */
  exchangeSettings: Dictionary<CurrencyCode, Dictionary<CurrencyCode, ExchangeSetting>> = {};

  /** Mapping between cryptocurrencies and available transaction fee rates. */
  transactionFeeRates: Dictionary<CurrencyCode, TransactionFeeRate> = {};

  /** @internal */
  constructor(apiKey: string, apiUrl: string, txServiceUrl: string) {
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

    this.zumoCore = new window.ZumoCoreModule.ZumoCore(httpImpl, wsImpl, apiKey, apiUrl, txServiceUrl);

    this.utils = new Utils(this.zumoCore.getUtils());

    this.addChangeListener(() => {
      this.exchangeRates =
        parseExchangeRates(JSON.parse(this.zumoCore.getExchangeRates()));
      this.exchangeSettings =
        parseExchangeSettings(JSON.parse(this.zumoCore.getExchangeSettings()));
      this.transactionFeeRates =
        parseTransactionFeeRates(JSON.parse(this.zumoCore.getTransactionFeeRates()));
    })
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
        onError: (error: string) => {
          reject(new ZumoKitError(error));
        },
        onSuccess: (user: any) => {
          this.currentUser = new User(user);
          resolve(this.currentUser);
        }
      }));
    })
  };

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
   * Get exchange setting for selected currency pair.
   *
   * @param fromCurrency   currency code
   * @param toCurrency     currency code
   *
   * @return exchange setting or null
   */
  getExchangeSetting(fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
    const exchangeSettings = this.zumoCore.getExchangeSetting(fromCurrency, toCurrency);
    if (exchangeSettings.hasValue())
      return new ExchangeSetting(JSON.parse(exchangeSettings.get()));
    else
      return null;
  }

    /**
   * Get transaction fee rate for selected crypto currency.
   *
   * @param currency   currency code
   *
   * @return transaction fee rate or null
   */
  getTransactionFeeRate(currency: CurrencyCode) {
    const feeRate = this.zumoCore.getTransactionFeeRate(currency);
    if (feeRate.hasValue())
      return new TransactionFeeRate(JSON.parse(feeRate.get()));
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
          const historicalExchangeRatesJSON = JSON.parse(json) as HistoricalExchangeRatesJSON;
          resolve(parseHistoricalExchangeRates(historicalExchangeRatesJSON));
        }
      }));
    })
  }

  /**
   * Listen to changes in exchange rates, exchange settings or transaction fee rates.
   *
   * @param listener interface to listen to user changes
   */
  addChangeListener(listener: () => void) {
    let listenerImpl = new window.ZumoCoreModule.ChangeListenerWrapper({
      onChange: function () {
        listener();
      }
    });

    this.zumoCore.addChangeListener(listenerImpl);

    this.changeListeners.push(listener);
    this.changeListenersImpl.push(listenerImpl);
  }

  /**
   * Remove change listener.
   *
   * @param listener interface to listen to changes
   */
  removeChangeListener(listener: () => void) {
    let index;
    while ((index = this.changeListeners.indexOf(listener)) != -1) {
      this.changeListeners.splice(index, 1);
      this.zumoCore.removeChangeListener(this.changeListenersImpl.splice(index, 1)[0]);
    }
  }
}