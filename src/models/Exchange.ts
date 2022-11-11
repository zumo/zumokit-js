import { Decimal } from 'decimal.js';
import {
  ExchangeStatus,
  CurrencyCode,
  ExchangeSide,
  ExchangeJSON,
  Dictionary,
} from '../interfaces';
import { Quote } from './Quote';

/** Exchange details. */
export class Exchange {
  /** @internal */
  json: ExchangeJSON;

  /** Identifier */
  id: string;

  /** Exchange status. */
  status: ExchangeStatus;

  /** Exchange pair, e.g. "ETH-GBP". */
  pair: string;

  /**  Exchange side, "BUY" or "SELL". */
  side: ExchangeSide;

  /**  Exchange quote price. */
  price: Decimal;

  /** Amount in base currency. */
  amount: Decimal;

  /** Debit {@link  Account Account} identifier. */
  debitAccountId: string;

  /** Debit {@link  Transaction Transaction} identifier. */
  debitTransactionId: string | null;

  /** Credit {@link  Account Account} identifier. */
  creditAccountId: string;

  /** Credit {@link  Transaction Transaction} identifier. */
  creditTransactionId: string | null;

  /** Exchange rate quote used. */
  quote: Quote;

  /**
   * Exchange rates at the time exchange was made.
   * This can be used to display amounts in local currency to the user.
   */
  rates: Dictionary<CurrencyCode, Dictionary<CurrencyCode, Decimal>>;

  /** Exchange nonce or null. Used to prevent double spend. */
  nonce: string | null;

  /** Epoch timestamp when exchange was created. */
  createdAt: number;

  /** Epoch timestamp when exchange was updated */
  updatedAt: number;

  /** @internal */
  constructor(json: ExchangeJSON) {
    this.json = json;
    this.id = json.id;
    this.status = json.status as ExchangeStatus;
    this.pair = json.pair;
    this.side = json.side as ExchangeSide;
    this.price = new Decimal(json.price);
    this.amount = new Decimal(json.amount);
    this.debitAccountId = json.debitAccountId;
    this.debitTransactionId = json.debitTransactionId;
    this.creditAccountId = json.creditAccountId;
    this.creditTransactionId = json.creditTransactionId;
    this.quote = new Quote(json.quote);
    this.nonce = json.nonce;
    this.createdAt = Math.round(new Date(json.createdAt).getTime() / 1000);
    this.updatedAt = Math.round(new Date(json.updatedAt).getTime() / 1000);

    // convert rates from strings to decimals
    this.rates = {};
    Object.keys(json.rates).forEach((fromCurrency) => {
      const innerMap: Dictionary<CurrencyCode, Decimal> = {};
      Object.keys(json.rates[fromCurrency]).forEach((toCurrency) => {
        innerMap[toCurrency as CurrencyCode] = new Decimal(
          json.rates[fromCurrency][toCurrency]
        );
      });
      this.rates[fromCurrency as CurrencyCode] = innerMap;
    });
  }
}
