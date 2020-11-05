import { Decimal } from 'decimal.js';
import { ExchangeRate } from './ExchangeRate';
import { ExchangeRates } from './ExchangeRates';
import { ExchangeSetting } from './ExchangeSetting';
import { ExchangeStatus, CurrencyCode } from '../types/exported';

/** Interface describing exchange details. */
export interface Exchange {
  /** Identifier */
  id: string;

  /** Exchange status. */
  status: ExchangeStatus;

  /** Currency from which exchange was made. */
  fromCurrency: CurrencyCode;

  /** Source {@link  Account Account} identifier. */
  fromAccountId: string;

  /** Outgoing {@link  Transaction Transaction} identifier. */
  outgoingTransactionId: string | null;

  /** Outgoing transaction fee. */
  outgoingTransactionFee: Decimal | null;

  /** Currency to which exchange was made. */
  toCurrency: CurrencyCode;

  /** Target {@link  Account Account} identifier. */
  toAccountId: string;

  /** Return {@link  Transaction Transaction} identifier. */
  returnTransactionId: string | null;

  /** Return {@link  Transaction Transaction} fee. */
  returnTransactionFee: Decimal;

  /** Amount in source account currency. */
  amount: Decimal;

  /**
   * Amount that user receives in target account currency, calculated as <code>amount X exchangeRate X (1 - feeRate) - returnTransactionFee</code>.
   * <p>
   * See {@link ExchangeSetting}.
   */
  returnAmount: Decimal;

  /**
   * Exchange fee in target account currency, calculated as <code>amount X exchangeRate X exchangeFeeRate</code>.
   * <p>
   * See {@link ExchangeSetting}.
   */
  exchangeFee: Decimal;

  /** Exchange rate used. */
  exchangeRate: ExchangeRate;

  /** Exchange settings used. */
  exchangeSetting: ExchangeSetting;

  /**
   * Exchange rates at the time exchange was made.
   * This can be used to display amounts in local currency to the user.
   */
  exchangeRates: ExchangeRates;

  /** Exchange nonce or null. Used to prevent double spend. */
  nonce: string | null;

  /** Epoch timestamp when transaction was submitted. */
  submittedAt: number;

  /** Epoch timestamp when transaction was confirmed or null if not yet confirmed. */
  confirmedAt: number | null;

  /** Alias of {@link submittedAt} timestamp. Provided for convenience to match {@link Transaction} record structure. */
  timestamp: number;
}
