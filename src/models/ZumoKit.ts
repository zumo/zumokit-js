import { ZumoKit as IZumoKit } from '../interfaces';
import { errorProxy } from '../utility/errorProxy';
import { ExchangeRate } from './ExchangeRate';
import { ExchangeRates } from './ExchangeRates';
import { ExchangeSetting } from './ExchangeSetting';
import { ExchangeSettings } from './ExchangeSettings';
import { TransactionFeeRate } from './TransactionFeeRate';
import { TransactionFeeRates } from './TransactionFeeRates';
import { HistoricalExchangeRates } from './HistoricalExchangeRates';
import { CurrencyCode, TokenSet, HistoricalExchangeRatesJSON } from '../types';
import { User } from './User';
import { Utils } from './Utils';
import { ZumoKitError } from './ZumoKitError';

class ZumoKit implements IZumoKit {
  private zumoCore: any;

  private changeListeners: Array<() => void> = [];

  private changeListenersImpl: Array<any> = [];

  version: string;

  currentUser: User | null = null;

  utils: Utils;

  exchangeRates: ExchangeRates = {};

  exchangeSettings: ExchangeSettings = {};

  transactionFeeRates: TransactionFeeRates = {};

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
            callback.onNetworkError(
              window.ZumoCoreModule.getException(exception).message
            );
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

  signOut() {
    this.zumoCore.signOut();
    this.currentUser = null;
  }

  getExchangeRate(fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
    const exchangeRate = this.zumoCore.getExchangeRate(
      fromCurrency,
      toCurrency
    );
    if (exchangeRate.hasValue())
      return new ExchangeRate(JSON.parse(exchangeRate.get()));
    return null;
  }

  getExchangeSetting(fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
    const exchangeSettings = this.zumoCore.getExchangeSetting(
      fromCurrency,
      toCurrency
    );
    if (exchangeSettings.hasValue())
      return new ExchangeSetting(JSON.parse(exchangeSettings.get()));
    return null;
  }

  getTransactionFeeRate(currency: CurrencyCode) {
    const feeRate = this.zumoCore.getTransactionFeeRate(currency);
    if (feeRate.hasValue())
      return new TransactionFeeRate(JSON.parse(feeRate.get()));
    return null;
  }

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

export { ZumoKit };
