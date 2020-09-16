/** @internal */
interface ZumoKitErrorJSON {
  type: string;
  code: string;
  message: string;
}

/**
 * ZumoKitError extension to Error class with type, code and message properties.
 * Refer to <a href="https://developers.zumo.money/docs/guides/handling-errors">Handling Errors</a>
 * guide for details on handling errors.
 */
export default class ZumoKitError extends Error {
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
  constructor(error: ZumoKitErrorJSON | string) {
    if (typeof error === 'string' || error instanceof String) {
      error = JSON.parse(error as string) as ZumoKitErrorJSON;
    }

    super(error.message);

    this.type = error.type;
    this.code = error.code;
    this.message = error.message;
  }
}
