import { AccountFiatProperties } from './AccountFiatProperties';
import { TransactionFiatPropertiesJSON } from '../types';
import { TransactionFiatProperties as ITransactionFiatProperties } from '../interfaces';

interface TransactionFiatProperties extends ITransactionFiatProperties {}

class TransactionFiatProperties {
  json: TransactionFiatPropertiesJSON;

  /** @internal */
  constructor(json: TransactionFiatPropertiesJSON) {
    this.json = json;
    this.fromFiatAccount = new AccountFiatProperties(json.fromFiatAccount);
    this.toFiatAccount = new AccountFiatProperties(json.toFiatAccount);
  }
}

export { TransactionFiatProperties };
