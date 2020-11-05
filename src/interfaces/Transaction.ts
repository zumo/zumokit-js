import { Decimal } from 'decimal.js';
import { TransactionCryptoProperties } from './TransactionCryptoProperties';
import { TransactionFiatProperties } from './TransactionFiatProperties';
import {
  TransactionType,
  TransactionStatus,
  CurrencyCode,
  Network,
} from '../types/exported';
import { Exchange } from './Exchange';

/** Interface describing transaction details. */
export interface Transaction {
  /** Identifier. */
  id: string;

  /** Transaction type. */
  type: TransactionType;

  /** Currency code. */
  currencyCode: CurrencyCode;

  /** Sender integrator user identifier or null if it is external user. */
  fromUserId: string | null;

  /** Recipient integrator user identifier or null if it is external user. */
  toUserId: string | null;

  /** Sender account identifier if it is internal transaction or null otherwise. */
  fromAccountId: string | null;

  /** Recipient account identifier if it is internal transaction or null otherwise. */
  toAccountId: string | null;

  /** Network type. */
  network: Network;

  /** Transaction status. */
  status: TransactionStatus;

  /** Amount in transaction currency or null if transaction is Ethereum contract deploy. */
  amount: Decimal | null;

  /** Transaction fee in transaction currency or null, if not yet available. */
  fee: Decimal | null;

  /** Transaction nonce or null. Used to prevent double spend. */
  nonce: string | null;

  /**
   * Crypto properties if it is a crypto transaction, null otherwise.
   * <p>
   * See {@link TransactionType}.
   */
  cryptoProperties: TransactionCryptoProperties | null;

  /**
   * Fiat properties if it is a fiat transaction, null otherwise.
   * <p>
   * See {@link TransactionType}.
   */
  /** Fiat properties if it is crypto transaction, null otherwise. */
  fiatProperties: TransactionFiatProperties | null;

  /**
   * Exchange properties if it is a transaction associated with an exchange, null otherwise.
   * <p>
   * See {@link TransactionType}.
   */
  exchange: Exchange | null;

  /** Epoch timestamp when transaction was submitted or null for incoming transactions from outside of Zumo ecosystem. */
  submittedAt: number | null;

  /** Epoch timestamp when transaction was submitted or null if transaction was not confirmed yet. */
  confirmedAt: number | null;

  /** Epoch timestamp, minimum non-null value between submitted at and confirmed at timestamps. */
  timestamp: number;
}
