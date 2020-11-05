import { Decimal } from 'decimal.js';
import { CurrencyCode } from '../types/exported';

/**
 * Zumo exchange rates used in making exchanges.
 * Can also be used to display amounts in local currency to the user.
 */
export interface ExchangeRate {
  /** Identifier. */
  id: string;

  /** Currency from which exchange is being made. */
  fromCurrency: CurrencyCode;

  /** Currency to which exchange is being made. */
  toCurrency: CurrencyCode;

  /** Value of 1 unit of source currency in target currency. */
  value: Decimal;

  /** Epoch timestamp representing expiration time of this exchange rate. */
  validTo: number;

  /** Epoch timestamp when the exchange rate was issued. */
  timestamp: number;
}
