import {loadZumoCore} from './loadZumoCore';
import ZumoKit from './ZumoKit';

declare global {
  interface Window { ZumoKit: any; loadZumoKit: any; }
}

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

window.loadZumoKit = loadZumoKit;

export { loadZumoKit };