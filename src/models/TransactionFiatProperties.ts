import { TransactionFiatPropertiesJSON } from '../interfaces';
import { AccountFiatProperties } from './AccountFiatProperties';

/**
 * Interface describing transaction fiat properties.
 * <p>
 * See {@link Transaction}.
 * */
export class TransactionFiatProperties {
  /** @internal */
  json: TransactionFiatPropertiesJSON;

  /** Sender fiat account properties. */
  fromFiatAccount: AccountFiatProperties;

  /** Recipient fiat account properties. */
  toFiatAccount: AccountFiatProperties;

  /** @internal */
  constructor(json: TransactionFiatPropertiesJSON) {
    this.json = json;
    this.fromFiatAccount = new AccountFiatProperties(json.fromFiatAccount);
    this.toFiatAccount = new AccountFiatProperties(json.toFiatAccount);
  }
}
