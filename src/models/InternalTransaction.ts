import { Decimal } from 'decimal.js';
import {
  InternalTransactionJSON,
  Dictionary,
  CurrencyCode,
} from '../interfaces';

/**
 * Internal transaction details.
 * <p>
 * See {@link Transaction}.
 * */
export class InternalTransaction {
  /** @internal */
  json: InternalTransactionJSON;

  /** Sender user id or null if it is external user. */
  fromUserId: string | null;

  /** Sender user integrator id or null if it is external user. */
  fromUserIntegratorId: string | null;

  /** Sender account id or null if it is external user. */
  fromAccountId: string | null;

  /** Sender address. */
  fromAddress: string | null;

  /** Recipient user id or null if it is external user. */
  toUserId: string | null;

  /** Recipient user integrator id or null if it is external user. */
  toUserIntegratorId: string | null;

  /** Recipient account id or null if it is external user. */
  toAccountId: string | null;

  /** Recipient address. */
  toAddress: string | null;

  /** Amount in transaction currency or null if transaction is Ethereum contract deploy. */
  amount: Decimal | null;

  /** Fee in fiat currencies at the time of the transaction submission. */
  fiatAmount: Dictionary<CurrencyCode, number> | null;

  /** @internal */
  constructor(json: InternalTransactionJSON) {
    this.json = json;
    this.fromUserId = json.fromUserId;
    this.fromUserIntegratorId = json.fromUserIntegratorId;
    this.fromAccountId = json.fromAccountId;
    this.fromAddress = json.fromAddress;
    this.toUserId = json.toUserId;
    this.toUserIntegratorId = json.toUserIntegratorId;
    this.toAccountId = json.toAccountId;
    this.toAddress = json.toAddress;
    this.amount = json.amount ? new Decimal(json.amount) : null;
    this.fiatAmount = json.fiatAmount;
  }
}
