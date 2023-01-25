import fetch from 'node-fetch';
import { WebSocket, MessageEvent, CloseEvent } from 'ws';
import {
  CurrencyCode,
  TokenSet,
  HistoricalExchangeRatesJSON,
  LogLevel,
} from './interfaces';
import { errorProxy } from './utility';
import {
  ExchangeRate,
  ExchangeRates,
  TransactionFeeRate,
  TransactionFeeRates,
  HistoricalExchangeRates,
} from './models';
import { User } from './User';
import { Utils } from './Utils';
import { ZumoKitError } from './ZumoKitError';

/**
 * ZumoKit instance. Refer to <a href="https://developers.zumo.money/docs/guides/initialize-zumokit">documentation</a> for usage details.
 * */
export class ZumoKit {
  private zumoCoreModule: any;

  private socket: WebSocket | null = null;
  
  private wsListener: any = null;

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

  /** Mapping between cryptocurrencies and available transaction fee rates. */
  transactionFeeRates: TransactionFeeRates = {};

  private async request(
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
          this.zumoCoreModule.getException(exception)
        );

        callback.onNetworkError(error.message);
      } else {
        const { message } = (exception as unknown) as any;
        callback.onNetworkError(message);
      }
    }
  }

  private connectWebSocket(url: string) {
    this.socket = new WebSocket(url);
    this.socket.on('open', () => {
      this.wsListener?.onOpen(url);
    });

    this.socket.on('message', (event: MessageEvent) => {
      this.wsListener?.onMessage(event.toString());
    });

    this.socket.on('error', () => {
      this.wsListener?.onError('WebSocket error observed');
      this.socket?.close();
    });

    this.socket.on('close', (event: CloseEvent) => {
      this.wsListener?.onClose(
        `WebSocket connection closed with exit code ${event.code}, additional info: ${event.reason}`
      );

      // TODO: Reconnect via fuzzing back off generator
      setTimeout(() => {
        this.connectWebSocket(url);
      }, 5000);
    });
  }

  private subscribe(listener: any) {
    this.wsListener = listener;
  }

  send(message: string) {
    this.socket?.send(message);
  }

  private createWebSocket(url: string) {
    const boundedConnectWebSocket = this.connectWebSocket.bind(this);
    const boundedSend = this.send.bind(this);
    const boundedSubscribe = this.subscribe.bind(this);
    return new this.zumoCoreModule.WebSocketWrapper({
      connect() {
        boundedConnectWebSocket(url);
      },
      send(message: string) {
        boundedSend(message);
      },
      subscribe(listener: any) {
        boundedSubscribe(listener);
      },
    });
  }

  /** @internal */
  constructor(
    zumoCoreModule: any,
    apiKey: string,
    apiUrl: string,
    transactionServiceUrl: string,
    cardServiceUrl: string,
    notificationServiceUrl: string,
    exchangeServiceUrl: string,
    custodyServiceUrl: string
  ) {
    this.zumoCoreModule = zumoCoreModule;

    this.version = zumoCoreModule.ZumoCore.getVersion();

    const boundedRequest = this.request.bind(this);
    const httpImpl = new zumoCoreModule.HttpProviderWrapper({
      async request(
        url: string,
        method: string,
        headers: any,
        data: string,
        callback: any
      ) {
        boundedRequest(url, method, headers, data, callback);
      },
    });

    const boundedCreateWebSocket= this.createWebSocket.bind(this);
    const wsFactory = new zumoCoreModule.WebSocketFactoryWrapper({
      createWebSocket(url: string) {
        return boundedCreateWebSocket(url);
      },
    });

    this.zumoCore = new zumoCoreModule.ZumoCore(
      httpImpl,
      wsFactory,
      apiKey,
      apiUrl,
      transactionServiceUrl,
      cardServiceUrl,
      notificationServiceUrl,
      exchangeServiceUrl,
      custodyServiceUrl
    );

    this.utils = new Utils(this.zumoCoreModule, this.zumoCore.getUtils());

    this.addChangeListener(() => {
      this.exchangeRates = ExchangeRates(
        JSON.parse(this.zumoCore.getExchangeRates())
      );
      this.transactionFeeRates = TransactionFeeRates(
        JSON.parse(this.zumoCore.getTransactionFeeRates())
      );
    });
  }

  /**
   * Sets log level for current logger.
   *
   * @param logLevel log level, e.g. 'debug' or 'info'
   */
  setLogLevel(logLevel: LogLevel) {
    this.zumoCoreModule.ZumoCore.setLogLevel(logLevel);
  }

  /**
   * Sets log handler for all ZumoKit related logs.
   *
   * @param listener interface to listen to changes
   * @param logLevel log level, e.g. 'debug' or 'info'
   */
  onLog(listener: (message: string) => void, logLevel: LogLevel) {
    this.zumoCoreModule.ZumoCore.onLog(
      new this.zumoCoreModule.LogListenerWrapper({
        onLog(message: string) {
          listener(message);
        },
      }),
      logLevel
    );
  }

  /**
   * Signs in user corresponding to user token set. Sets current user to the newly signed in user.
   * Refer to <a href="https://developers.zumo.money/docs/setup/server#get-zumokit-user-token">Server</a> guide for details on how to get user token set.
   *
   * @param tokenSet   user token set
   */
  signIn(userTokenSet: TokenSet) {
    return errorProxy<User>(
      this.zumoCoreModule,
      (resolve: any, reject: any) => {
        this.zumoCore.signIn(
          JSON.stringify(userTokenSet),
          new this.zumoCoreModule.UserCallbackWrapper({
            onError: (error: string) => {
              reject(new ZumoKitError(error));
            },
            onSuccess: (user: any) => {
              this.currentUser = new User(this.zumoCoreModule, user);
              resolve(this.currentUser);
            },
          })
        );
      }
    );
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
    return errorProxy<HistoricalExchangeRates>(
      this.zumoCoreModule,
      (resolve: any, reject: any) => {
        this.zumoCore.fetchHistoricalExchangeRates(
          new this.zumoCoreModule.HistoricalExchangeRatesCallbackWrapper({
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
      }
    );
  }

  /**
   * Listen to changes in current user’s sign in state, exchange rates, exchange settings or transaction fee rates.
   *
   * @param listener interface to listen to changes
   */
  addChangeListener(listener: () => void) {
    const listenerImpl = new this.zumoCoreModule.ChangeListenerWrapper({
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

  /**
   * Stops WebSocket connection to Zumo Enterprise services.
   */
  disconnect() {
    this.socket?.terminate();
  }
}
