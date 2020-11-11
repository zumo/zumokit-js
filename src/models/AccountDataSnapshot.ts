import { AccountDataSnapshotJSON } from '../interfaces';
import { Account } from './Account';
import { Transaction } from './Transaction';

/** Account data. */
export class AccountDataSnapshot {
  /** @internal */
  json: AccountDataSnapshotJSON;

  /** Account. */
  account: Account;

  /** Account's transactions. */
  transactions: Array<Transaction>;

  /** @internal */
  constructor(json: AccountDataSnapshotJSON) {
    this.json = json;
    this.account = new Account(json.account);
    this.transactions = json.transactions.map(
      (transactionJson) => new Transaction(transactionJson)
    );
  }
}
