import { Decimal } from 'decimal.js';
import { Account as IAccount } from '../interfaces';
import { AccountCryptoProperties } from './AccountCryptoProperties';
import { AccountFiatProperties } from './AccountFiatProperties';
import {
  CurrencyType,
  CurrencyCode,
  Network,
  AccountType,
  AccountJSON,
} from '../types';

interface Account extends IAccount {}

class Account {
  json: AccountJSON;

  constructor(json: AccountJSON) {
    this.json = json;
    this.id = json.id;
    this.currencyType = json.currencyType as CurrencyType;
    this.currencyCode = json.currencyCode as CurrencyCode;
    this.network = json.network as Network;
    this.type = json.type as AccountType;
    this.balance = new Decimal(json.balance);
    this.hasNominatedAccount = !!json.hasNominatedAccount;
    this.cryptoProperties = json.cryptoProperties
      ? new AccountCryptoProperties(json.cryptoProperties)
      : null;
    this.fiatProperties = json.fiatProperties
      ? new AccountFiatProperties(json.fiatProperties)
      : null;
  }
}

export { Account };
