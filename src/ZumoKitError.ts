import { ZumoKitErrorJSON } from './interfaces';

/**
 * ZumoKitError extension to Error class with type, code and message properties.
 * Refer to <a href="https://developers.zumo.money/docs/guides/handling-errors">Handling Errors</a>
 * guide for details on handling errors.
 */
export class ZumoKitError extends Error {
  /**
   * Error type, such as api_connection_error, api_error, wallet_error etc.
   */
  type: string;

  /**
   * In case an error could be handled programmatically in addition to error type
   * error code is returned.
   */
  code: string;

  /**
   * Error message.
   */
  message: string;

  /** @internal */
  constructor(json: string) {
    const error = JSON.parse(json) as ZumoKitErrorJSON;

    super(error.message);
    this.name = 'ZumoKitError';
    this.type = error.type;
    this.code = error.code;
    this.message = error.message;
  }
}
