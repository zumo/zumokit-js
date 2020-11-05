import { Decimal } from 'decimal.js';
import { Dictionary, CurrencyCode } from '../types/exported';

/**
 * Interface describing transaction crypto properties.
 * <p>
 * See {@link Transaction}.
 * */
export interface TransactionCryptoProperties {
  /** Transaction hash or null. */
  txHash: string | null;

  /**
   * Ethereum transaction nonce if greater than 0 and
   * it is Ethereum transaction, otherwise returns null.
   */
  nonce: string | null;

  /** Wallet address of sender, */
  fromAddress: string;

  /** Wallet address of receiver or null, if it is Ethereum contract deploy. */
  toAddress: string | null;

  /** Transaction data or null. */
  data: string | null;

  /** Ethereum gas price if it is Ethereum transaction, otherwise null. */
  gasPrice: Decimal | null;

  /** Ethereum gas limit if it is Ethereum transaction, otherwise null. */
  gasLimit: number | null;

  /** Amount in fiat currencies at the time of the transaction submission. */
  fiatFee: Dictionary<CurrencyCode, Decimal>;

  /** Fee in fiat currencies at the time of the transaction submission. */
  fiatAmount: Dictionary<CurrencyCode, Decimal>;
}
