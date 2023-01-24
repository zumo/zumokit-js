import { ZumoKitError } from '../ZumoKitError';

declare global {
  interface Window {
    ZumoCoreModule: any;
  }
}

export const errorProxy = <T extends unknown>(
  zumoCoreModule: any,
  callback: any
) => {
  return new Promise<T>((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (exception) {
      if (typeof exception === 'number')
        reject(new ZumoKitError(zumoCoreModule.getException(exception)));
      else reject(exception);
    }
  });
};
