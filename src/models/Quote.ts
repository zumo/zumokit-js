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

  /** Expiration in seconds at the time of quote creation, e.g. 60. */
  ttl: number;

  /** Epoch timestamp when quote was created. */
  createdAt: number;

  /** Epoch timestamp when quote will expire.  */
  expiresAt: number;

  /** Debit currency. */
  from: CurrencyCode;

  /** Credit currency. */
  to: CurrencyCode;

  /** Value of 1 unit of debit currency in credit currency. */
  price: Decimal;

  /** Fee rate in points of a percentage, e.g. "0.1" representing 0.1% */
  feeRate: Decimal;

  /** Amount to be debited from debit account. */
  debitAmount: Decimal;

  /** Amount that will be paid in fees. */
  feeAmount: Decimal;

  /** Amount to be credited to credit account. */
  creditAmount: Decimal;

  /** @internal */
  constructor(json: QuoteJSON) {
    this.json = json;
    this.id = json.id;
    this.ttl = json.ttl;
    this.createdAt = Math.round(new Date(json.createdAt).getTime() / 1000);
    this.expiresAt = Math.round(new Date(json.expiresAt).getTime() / 1000);
    this.from = json.from as CurrencyCode;
    this.to = json.to as CurrencyCode;
    this.price = new Decimal(json.price);
    this.feeRate = new Decimal(json.feeRate);
    this.debitAmount = new Decimal(json.debitAmount);
    this.feeAmount = new Decimal(json.feeAmount);
    this.creditAmount = new Decimal(json.creditAmount);
  }
}
