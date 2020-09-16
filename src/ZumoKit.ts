import Parser from './util/Parser';
import { errorProxy } from './errorProxy';
import {
  Dictionary,
  CurrencyCode,
  ZumoKitConfig,
  TokenSet,
  StateJSON,
  TimeInterval,
  HistoricalExchangeRatesJSON,
} from './types';
import User from './User';
import Utils from './Utils';
import State from './models/State';
import ExchangeRate from './models/ExchangeRate';
import ZumoKitError from './ZumoKitError';

/** Record representing historical exchange rates. */
type HistoricalExchangeRates = Dictionary<
  TimeInterval,
  Dictionary<CurrencyCode, Dictionary<CurrencyCode, Array<ExchangeRate>>>
>;

/**
 * Once ZumoKit is initialized, this class provides access to {@link getUser | user retrieval}, {@link state | ZumoKit state object} and {@link getHistoricalExchangeRates | historical exchange rates}.
 * State change listeners can be  {@link addStateListener added} and {@link removeStateListener removed}.
 * <p>
 * See <a href="https://developers.zumo.money/docs/guides/getting-started">Getting Started</a> guide for usage details.
 * */
export default class ZumoKit {
  private zumoCore: any;

  private stateListeners: Array<(state: State) => void> = [];

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
      socket = new WebSocket(txServiceUrl);

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

    let zumoKit = this;
    var stateListenerImpl = new window.ZumoCoreModule.StateListenerWrapper({
      update: function (state: string) {
        zumoKit.notifyStateListeners(new State(JSON.parse(state)));
      }
    });

    this.zumoCore.addStateListener(stateListenerImpl);
  }

  /**
   * Get user corresponding to user token set.
   * Refer to <a href="https://developers.zumo.money/docs/setup/server#get-zumokit-user-token">Server</a> guide for details on how to get user token set.
   *
   * @param tokenSet   user token set
   */
  getUser(userTokenSet: TokenSet) {
    return errorProxy<User>((resolve: any, reject: any) => {
      this.zumoCore.getUser(
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
   * Fetch historical exchange rates for supported time intervals.
   * On success callback returns historical exchange rates are contained in a mapping between
   * time interval on a top level, from currency on second level, to currency on third level and
   * {@link ExchangeRate ExchangeRate} objects.
   */
  getHistoricalExchangeRates() {
    return errorProxy<HistoricalExchangeRates>((resolve: any, reject: any) => {
      this.zumoCore.getHistoricalExchangeRates(
        new window.ZumoCoreModule.HistoricalExchangeRatesCallbackWrapper({
        onError: function (error: string) {
          reject(new ZumoKitError((error)));
        },
        onSuccess: function (json: string) {
          resolve(Parser.parseHistoricalExchangeRates(JSON.parse(json) as HistoricalExchangeRatesJSON));
        }
      }));
    })
  }

  /**
   * Returns current ZumoKit state. Refer to
   * <a href="https://developers.zumo.money/docs/guides/zumokit-state">ZumoKit State</a>
   * guide for details.
   */
  getState(): State {
    return new State(JSON.parse(this.zumoCore.getState()));
  }

  /**
   * Returns crypto utility class.
   */
  getUtils(): Utils {
    return new Utils(this.zumoCore.getUtils());
  }

  /**
   * Listen to all state changes. Refer to <a href="https://developers.zumo.money/docs/guides/zumokit-state#listen-to-state-changes">ZumoKit State</a> guide for details.
   *
   * @param listener interface to listen to state changes
   */
  addStateListener(listener: (state: State) => void) {
    if (this.stateListeners.includes(listener))
      return;

    this.stateListeners.push(listener);
  }

  /**
   * Remove listener to state changes. Refer to <a href="https://developers.zumo.money/docs/guides/zumokit-state#remove-state-listener">ZumoKit State</a> guide for details.
   *
   * @param listener interface to listen to state changes
   */
  removeStateListener(listener: (state: State) => void) {
    if (!this.stateListeners.includes(listener))
      return;

    const index = this.stateListeners.indexOf(listener);
    this.stateListeners.splice(index, 1);
  }

  /** @internal */
  notifyStateListeners(state: State) {
    this.stateListeners.forEach(
      (listener: (state: State) => void) => listener(state)
    );
  }
}