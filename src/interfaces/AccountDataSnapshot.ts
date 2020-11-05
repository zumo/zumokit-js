import { Account } from './Account';
import { Transaction } from './Transaction';

/** Interface describing account data. */
export interface AccountDataSnapshot {
  /** Account. */
  account: Account;

  /** Account's transactions. */
  transactions: Array<Transaction>;
}
