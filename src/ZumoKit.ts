import {
  CurrencyCode,
  TokenSet,
  HistoricalExchangeRatesJSON,
} from './interfaces';
import { errorProxy } from './utility';
import {
  ExchangeRate,
  ExchangeRates,
  ExchangeSetting,
  ExchangeSettings,
  TransactionFeeRate,
  TransactionFeeRates,
  HistoricalExchangeRates,
} from './models';
import { User } from './User';
import { Utils } from './Utils';
import { ZumoKitError } from './ZumoKitError';

/**
 * ZumoKit instance.
 * <p>
 * See <a href="https://developers.zumo.money/docs/guides/getting-started">Getting Started</a> guide for usage details.
 * */
export class ZumoKit {
  private zumoCore: any;

  private changeListeners: Array<() => void> = [];

  private changeListenersImpl: Array<any> = [];

  /** ZumoKit SDK semantic version tag if exists, commit hash otherwise. */
  version: string;

  /** Currently signed-in user or null. */
  currentUser: User | null = null;

  /** Crypto utilities. */
  utils: Utils;

  /** Mapping between currency pairs and available exchange rates. */
  exchangeRates: ExchangeRates = {};

  /** Mapping between currency pairs and available exchange settings. */
  exchangeSettings: ExchangeSettings = {};

  /** Mapping between cryptocurrencies and available transaction fee rates. */
  transactionFeeRates: TransactionFeeRates = {};

  /** @internal */
  constructor(apiKey: string, apiUrl: string, txServiceUrl: string) {
    this.version = window.ZumoCoreModule.ZumoCore.getVersion();

    const httpImpl = new window.ZumoCoreModule.HttpImplWrapper({
      async request(
        url: string,
        method: string,
        headers: any,
        data: string,
        callback: any
      ) {
        const requestHeaders: Record<string, string> = {};
        const mapKeys = headers.keys();
        for (let i = 0; i < mapKeys.size(); i++) {
          const key = mapKeys.get(i);
          requestHeaders[key] = headers.get(key);
        }

        // eslint-disable-next-line no-console
        console.log(`Requesting ${url}`);
        try {
          const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: data,
          });

          const result = await response.text();
          callback.onSuccess(response.status, result);
        } catch (exception) {
          if (typeof exception === 'number') {
            const error = new ZumoKitError(
              window.ZumoCoreModule.getException(exception)
            );

            callback.onNetworkError(error.message);
          } else {
            callback.onNetworkError(exception.message);
          }
        }
      },
    });

    let socket: WebSocket | null = null;
    let wsListener: any = null;
    function connectWebSocket() {
      socket = new WebSocket(txServiceUrl.replace('https', 'wss'));

      socket.addEventListener('open', () => {
        wsListener?.onOpen(txServiceUrl);
      });

      socket.addEventListener('message', (event) => {
        wsListener?.onMessage(event.data);
      });

      socket.addEventListener('error', () => {
        wsListener?.onError('WebSocket error observed');
        socket?.close();
      });

      socket.addEventListener('close', (event) => {
        wsListener?.onClose(
          `WebSocket connection closed with exit code ${event.code}, additional info: ${event.reason}`
        );

        // TODO: Reconnect via fuzzing back off generator
        // eslint-disable-next-line no-console
        console.log('Reconnecting in 5 seconds...');
        setTimeout(() => {
          connectWebSocket();
        }, 5000);
      });
    }
    connectWebSocket();

    const wsImpl = new window.ZumoCoreModule.WebSocketImplWrapper({
      send(message: string) {
        socket?.send(message);
      },
      subscribe(listener: any) {
        wsListener = listener;
      },
    });

    this.zumoCore = new window.ZumoCoreModule.ZumoCore(
      httpImpl,
      wsImpl,
      apiKey,
      apiUrl,
      txServiceUrl
    );

    this.utils = new Utils(this.zumoCore.getUtils());

    this.addChangeListener(() => {
      this.exchangeRates = ExchangeRates(
        JSON.parse(this.zumoCore.getExchangeRates())
      );
      this.exchangeSettings = ExchangeSettings(
        JSON.parse(this.zumoCore.getExchangeSettings())
      );
      this.transactionFeeRates = TransactionFeeRates(
        JSON.parse(this.zumoCore.getTransactionFeeRates())
      );
    });
  }

  /**
   * Signs in user corresponding to user token set. Sets current user to the newly signed in user.
   * Refer to <a href="https://developers.zumo.money/docs/setup/server#get-zumokit-user-token">Server</a> guide for details on how to get user token set.
   *
   * @param tokenSet   user token set
   */
  signIn(userTokenSet: TokenSet) {
    return errorProxy<User>((resolve: any, reject: any) => {
      this.zumoCore.signIn(
        JSON.stringify(userTokenSet),
        new window.ZumoCoreModule.UserCallbackWrapper({
          onError: (error: string) => {
            reject(new ZumoKitError(error));
          },
          onSuccess: (user: any) => {
            this.currentUser = new User(user);
            resolve(this.currentUser);
          },
        })
      );
    });
  }

  /** Signs out current user. */
  signOut() {
    this.zumoCore.signOut();
    this.currentUser = null;
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
    const exchangeRate = this.zumoCore.getExchangeRate(
      fromCurrency,
      toCurrency
    );
    if (exchangeRate.hasValue())
      return new ExchangeRate(JSON.parse(exchangeRate.get()));
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
    const exchangeSettings = this.zumoCore.getExchangeSetting(
      fromCurrency,
      toCurrency
    );
    if (exchangeSettings.hasValue())
      return new ExchangeSetting(JSON.parse(exchangeSettings.get()));
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
    return null;
  }

  /**
   * Fetch historical exchange rates for supported time intervals.
   *
   * @return historical exchange rates
   */
  fetchHistoricalExchangeRates() {
    return errorProxy<HistoricalExchangeRates>((resolve: any, reject: any) => {
      this.zumoCore.fetchHistoricalExchangeRates(
        new window.ZumoCoreModule.HistoricalExchangeRatesCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(json: string) {
            const historicalExchangeRatesJSON = JSON.parse(
              json
            ) as HistoricalExchangeRatesJSON;
            resolve(HistoricalExchangeRates(historicalExchangeRatesJSON));
          },
        })
      );
    });
  }

  /**
   * Listen to changes in current user’s sign in state, exchange rates, exchange settings or transaction fee rates.
   *
   * @param listener interface to listen to changes
   */
  addChangeListener(listener: () => void) {
    const listenerImpl = new window.ZumoCoreModule.ChangeListenerWrapper({
      onChange() {
        listener();
      },
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
    // eslint-disable-next-line no-cond-assign
    while ((index = this.changeListeners.indexOf(listener)) !== -1) {
      this.changeListeners.splice(index, 1);
      this.zumoCore.removeChangeListener(
        this.changeListenersImpl.splice(index, 1)[0]
      );
    }
  }
}
