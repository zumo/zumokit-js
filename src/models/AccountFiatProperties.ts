import { AccountFiatProperties as IAccountFiatProperties } from '../interfaces';
import { AccountFiatPropertiesJSON } from '../types';

interface AccountFiatProperties extends IAccountFiatProperties {}

class AccountFiatProperties {
  json: AccountFiatPropertiesJSON;

  constructor(json: AccountFiatPropertiesJSON) {
    this.json = json;
    this.accountNumber = json.accountNumber;
    this.sortCode = json.sortCode;
    this.bic = json.bic;
    this.iban = json.iban;
    this.customerName = json.customerName;
  }
}

export { AccountFiatProperties };
