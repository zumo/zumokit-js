import { Decimal } from 'decimal.js';
import { Account } from './Account';
import { TransactionType } from '../types/exported';

/**
 * Result of one of the transaction compose methods on {@link  Wallet Wallet} object.
 */
export interface ComposedTransaction {
  /**
   * Transaction type, 'FIAT', 'CRYPTO' or 'NOMINATED'.
   */
  type: TransactionType;

  /** Signed transaction for a crypto transaction, null otherwise. */
  signedTransaction: string | null;

  /** Account the composed transaction belongs to. */
  account: Account;

  /** Transaction destination, i.e. destination address for crypto transactions or user id for fiat transactions. */
  destination: string | null;

  /** Transaction amount in account currency. */
  amount: Decimal | null;

  /** Optional transaction data if available. */
  data: string | null;

  /** Maximum transaction fee. */
  fee: Decimal;

  /** Transaction nonce to prevent double spend. */
  nonce: string;
}
