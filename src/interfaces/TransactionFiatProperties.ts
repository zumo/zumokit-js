import { AccountFiatProperties } from './AccountFiatProperties';

/**
 * Interface describing transaction fiat properties.
 * <p>
 * See {@link Transaction}.
 * */
export interface TransactionFiatProperties {
  /** Sender fiat account properties. */
  fromFiatAccount: AccountFiatProperties;

  /** Recipient fiat account properties. */
  toFiatAccount: AccountFiatProperties;
}
