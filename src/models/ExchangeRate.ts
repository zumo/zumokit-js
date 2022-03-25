import { Decimal } from 'decimal.js';
import { ExchangeRateJSON, CurrencyCode } from '../interfaces';

/**
 * Record containing Zumo exchange rates for information purposes only.
 * Can be used to display amounts in local currency to the user.
 */
export class ExchangeRate {
  /** @internal */
  json: ExchangeRateJSON;

  /** Identifier. */
  id: string;

  /** Currency from which exchange is being made. */
  fromCurrency: CurrencyCode;

  /** Currency to which exchange is being made. */
  toCurrency: CurrencyCode;

  /** Value of 1 unit of source currency in target currency. */
  value: Decimal;

  /** Epoch timestamp when the exchange rate was issued. */
  timestamp: number;

  /** @internal */
  constructor(json: ExchangeRateJSON) {
    this.json = json;
    this.id = json.id;
    this.fromCurrency = json.fromCurrency as CurrencyCode;
    this.toCurrency = json.toCurrency as CurrencyCode;
    this.value = new Decimal(json.value);
    this.timestamp = json.timestamp;
  }
}
