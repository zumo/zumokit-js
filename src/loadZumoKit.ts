import { loadZumoCore } from './utility';
import { ZumoKit } from './ZumoKit';

/** @internal */
declare global {
  interface Window {
    ZumoKit: any;
    loadZumoKit: any;
  }
}

/**
 * Entry point to ZumoKit Web SDK.
 * <p>
 * This function returns a Promise that resolves with a newly created ZumoKit object
 * once ZumoKit SDK has loaded. Behind the scenes, it will load ZumoKit WebAssembly module
 * for you by inserting the zumocore.js script tag. ZumoKit requires browser environment
 * to work as expected and it will not work in in a server environment.
 *
 * @param apiKey                 ZumoKit API Key
 * @param apiUrl                 ZumoKit API URL
 * @param transactionServiceUrl  ZumoKit Transaction Service URL
 * @param cardServiceUrl         ZumoKit Card Service URL
 * @param notificationServiceUrl ZumoKit Notification Service URL
 * @param exchangeServiceUrl     ZumoKit Exchange Service URL
 *
 * @return ZumoKit instance
 * */
export const loadZumoKit = (
  apiKey: string,
  apiUrl: string,
  transactionServiceUrl: string,
  cardServiceUrl: string,
  notificationServiceUrl: string,
  exchangeServiceUrl: string
) => {
  return new Promise<ZumoKit>((resolve, reject) => {
    if (window.ZumoKit) {
      resolve(window.ZumoKit);
      return;
    }

    loadZumoCore()
      .then(() => {
        window.ZumoKit = new ZumoKit(
          apiKey,
          apiUrl,
          transactionServiceUrl,
          cardServiceUrl,
          notificationServiceUrl,
          exchangeServiceUrl
        );
        resolve(window.ZumoKit);
      })
      .catch(reject);
  });
};
