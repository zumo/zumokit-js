import { AccountCryptoProperties as IAccountCryptoProperties } from '../interfaces';
import { AccountCryptoPropertiesJSON } from '../types';

interface AccountCryptoProperties extends IAccountCryptoProperties {}

class AccountCryptoProperties {
  json: AccountCryptoPropertiesJSON;

  constructor(json: AccountCryptoPropertiesJSON) {
    this.json = json;
    this.address = json.address;
    this.path = json.path;
    this.nonce = json.nonce;
  }
}

export { AccountCryptoProperties };
