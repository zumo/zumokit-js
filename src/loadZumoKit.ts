import {loadZumoCore} from './loadZumoCore';
import ZumoKit from './ZumoKit';

declare global {
  interface Window { ZumoKit: any; loadZumoKit: any; }
}

/**
 * Entry point to ZumoKit Web SDK.
 * <p>
 * This function returns a Promise that resolves with a newly created ZumoKit object
 * once ZumoKit SDK has loaded. Behind the scenes, it will load ZumoKit WebAssebly module
 * for you by inserting the zumocore.js script tag. ZumoKit requires browser environment
 * to work as expected and it will not work in in a server environment.
 * */
const loadZumoKit = (apiKey: string, apiRoot: string, txServiceUrl: string) => {
  return new Promise<ZumoKit>((resolve, reject) => {
    if (window.ZumoKit) {
      resolve(window.ZumoKit);
      return;
    }

    loadZumoCore().then(() => {
      window.ZumoKit = new ZumoKit(apiKey, apiRoot, txServiceUrl);
      resolve(window.ZumoKit);
    }).catch(reject);
  });
};

export { loadZumoKit };