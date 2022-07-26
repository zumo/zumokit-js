import { Decimal } from 'decimal.js';
import {
  Dictionary,
  CurrencyCode,
  TransactionDirection,
  TransactionAmountJSON,
} from '../interfaces';

/**
 * Transaction amount details.
 * <p>
 * See {@link Transaction}.
 * */
export class TransactionAmount {
  /** @internal */
  json: TransactionAmountJSON;

  /** Direction, either 'SENT' or 'RECEIVED'. */
  direction: TransactionDirection;

  /** User id or null if it is external user. */
  userId: string | null;

  /** User integrator id or null if it is external user. */
  userIntegratorId: string | null;

  /** Account id or null if it is external user. */
  accountId: string | null;

  /** Amount in transaction currency or null if transaction is Ethereum contract deploy. */
  amount: Decimal | null;

  /** Amount in fiat currencies at the time of the transaction submission. */
  fiatAmount: Dictionary<CurrencyCode, number> | null;

  /** Blockchain address or null.  */
  address: string | null;

  /** Indicates if this amount represents change amount. */
  isChange: boolean;

  /** Fiat account number or null. */
  accountNumber: string | null;

  /** Fiat account sort code or null. */
  sortCode: string | null;

  /** Fiat account BIC or null. */
  bic: string | null;

  /** Fiat account IBAN or null. */
  iban: string | null;

  /** @internal */
  constructor(json: TransactionAmountJSON) {
    this.json = json;
    this.direction = json.direction as TransactionDirection;
    this.userId = json.userId;
    this.userIntegratorId = json.userIntegratorId;
    this.accountId = json.accountId;
    this.amount = json.amount ? new Decimal(json.amount) : null;
    this.fiatAmount = json.fiatAmount;
    this.address = json.address;
    this.isChange = json.isChange;
    this.accountNumber = json.accountNumber;
    this.sortCode = json.sortCode;
    this.bic = json.bic;
    this.iban = json.iban;
  }
}
