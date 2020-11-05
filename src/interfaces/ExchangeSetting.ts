import { Decimal } from 'decimal.js';
import { Dictionary, Network, CurrencyCode } from '../types/exported';

/** Zumo exchange settings used in making exchanges. */
export interface ExchangeSetting {
  /** Identifier. */
  id: string;

  /** Currency code of outgoing transaction. */
  fromCurrency: CurrencyCode;

  /** Currency code of incoming transaction. */
  toCurrency: CurrencyCode;

  /**
   * Zumo Exchange Service wallet address for each network type.
   *
   * See {@link Network}.
   */
  exchangeAddress: Dictionary<Network, string>;

  /** Minimum amount that can be exchanged in outgoing transaction currency. */
  minExchangeAmount: Decimal;

  /** Fee rate that will be used for outgoing transaction. */
  outgoingTransactionFeeRate: Decimal;

  /** Exchange fee rate that will be charged once currency is exchanged. */
  exchangeFeeRate: Decimal;

  /** Fee that will charged for return transaction. */
  returnTransactionFee: Decimal;

  /** Epoch timestamp when the exchange settings were last updated. */
  timestamp: number;
}
