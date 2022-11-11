import { Decimal } from 'decimal.js';
import { ComposedExchangeJSON } from '../interfaces';
import { Account } from './Account';
import { Quote } from './Quote';

/** Result of the compose exchange method on {@link  Wallet Wallet} object. */
export class ComposedExchange {
  /** @internal */
  json: ComposedExchangeJSON;

  /** Debit account. */
  debitAccount: Account;

  /** Credit account. */
  creditAccount: Account;

  /** Exchange rate quote used when composing exchange. */
  quote: Quote;

  /** @internal */
  constructor(json: ComposedExchangeJSON) {
    this.json = json;
    this.debitAccount = new Account(json.debitAccount);
    this.creditAccount = new Account(json.creditAccount);
    this.quote = new Quote(json.quote);
  }
}
