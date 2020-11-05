import { ZumoKitError } from '../models/ZumoKitError';

declare global {
  interface Window {
    ZumoCoreModule: any;
  }
}

export const errorProxy = <T extends unknown>(callback: any) => {
  return new Promise<T>((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (exception) {
      if (typeof exception === 'number')
        reject(new ZumoKitError(window.ZumoCoreModule.getException(exception)));
      else reject(exception);
    }
  });
};
