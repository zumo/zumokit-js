import { AccountCryptoPropertiesJSON } from '../interfaces';

/**
 * Account's crypto related properties.
 * <p>
 * See {@link Account}.
 */
export class AccountCryptoProperties {
  /** @internal */
  json: AccountCryptoPropertiesJSON;

  /** Account crypto address. */
  address: string;

  /**
   * Account direct deposit crypto address, only applicable to custody accounts.
   * Should only be used to deposit funds from Zumo non-custody accounts.
   * */
  directDepositAddress: string | null;

  /** Hierarchical Deterministic (HD) account derivation path. */
  path: string;

  /** Ethereum account nonce if greater than 0 or null otherwise. */
  nonce: number | null;

  /** @internal */
  constructor(json: AccountCryptoPropertiesJSON) {
    this.json = json;
    this.address = json.address;
    this.directDepositAddress = json.directDepositAddress;
    this.path = json.path;
    this.nonce = json.nonce;
  }
}
