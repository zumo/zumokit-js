/**
 * Account's crypto related properties.
 * <p>
 * See {@link Account}.
 */
export interface AccountCryptoProperties {
  /** Account crypto address. */
  address: string;

  /** Hierarchical Deterministic (HD) account derivation path. */
  path: string;

  /** Ethereum account nonce if greater than 0 or null otherwise. */
  nonce: number | null;
}
