import { Decimal } from 'decimal.js';
import { Account } from './Account';
import { ExchangeRate } from './ExchangeRate';
import { ExchangeSetting } from './ExchangeSetting';

/** Result of the compose exchange method on {@link  Wallet Wallet} object. */
export interface ComposedExchange {
  /** Signed transaction for a crypto transaction, null otherwise. */
  signedTransaction: string | null;

  /** Source account. */
  fromAccount: Account;

  /** Target account. */
  toAccount: Account;

  /** Exchange rate used composing exchange. */
  exchangeRate: ExchangeRate;

  /** Exchange settings used composing exchange. */
  exchangeSetting: ExchangeSetting;

  /**
   * Zumo Exchange Service wallet address where outgoing crypto funds were deposited,
   * null for exchanges from fiat currencies.
   */
  exchangeAddress: string | null;

  /** Exchange amount in source account currency. */
  amount: Decimal;

  /** Outgoing transaction fee. */
  outgoingTransactionFee: Decimal;

  /**
   * Amount that user receives, calculated as <code>value X exchangeRate X (1 - feeRate) - returnTransactionFee</code>.
   * <p>
   * See {@link ExchangeSetting}.
   */
  returnAmount: Decimal;

  /**
   * Exchange fee, calculated as <code>value X exchangeRate X exchangeFeeRate</code>.
   * <p>
   * See {@link ExchangeSetting}.
   */
  exchangeFee: Decimal;

  /**
   * Return transaction fee.
   * <p>
   * See {@link ExchangeSetting}.
   */
  returnTransactionFee: Decimal;

  /** Unique nonce used to prevent double spend. */
  nonce: string;
}
