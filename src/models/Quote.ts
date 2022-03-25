import { Decimal } from 'decimal.js';
import { QuoteJSON, CurrencyCode } from '../interfaces';

/**
 * Zumo exchange rate quote used in making exchanges.
 */
export class Quote {
  /** @internal */
  json: QuoteJSON;

  /** Identifier. */
  id: string;

  /** Epoch timestamp representing expiration time of this quote. */
  expireTime: number;

  /** Seconds until expiration time for active quotes, null for historical quotes. */
  expiresIn: number | null;

  /** Deposit currency. */
  fromCurrency: CurrencyCode;

  /** Target currency. */
  toCurrency: CurrencyCode;

  /** Value of 1 unit of deposit currency in target currency. */
  depositAmount: Decimal;

  /** Value of 1 unit of deposit currency in target currency. */
  value: Decimal;

  /** @internal */
  constructor(json: QuoteJSON) {
    this.json = json;
    this.id = json.id;
    this.expireTime = json.expireTime;
    this.expiresIn = json.expiresIn;
    this.fromCurrency = json.fromCurrency as CurrencyCode;
    this.toCurrency = json.toCurrency as CurrencyCode;
    this.depositAmount = new Decimal(json.depositAmount);
    this.value = new Decimal(json.value);
  }
}
