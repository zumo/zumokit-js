import { ZumoKitErrorJSON } from '../types';
import { ZumoKitError as IZumoKitError } from '../interfaces';

interface ZumoKitError extends IZumoKitError {}

class ZumoKitError extends Error {
  constructor(error: ZumoKitErrorJSON | string) {
    if (typeof error === 'string' || error instanceof String) {
      // eslint-disable-next-line no-param-reassign
      error = JSON.parse(error as string) as ZumoKitErrorJSON;
    }

    super(error.message);

    this.type = error.type;
    this.code = error.code;
    this.message = error.message;
  }
}

export { ZumoKitError };
