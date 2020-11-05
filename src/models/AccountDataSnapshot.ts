import { AccountDataSnapshotJSON } from '../types';
import { AccountDataSnapshot as IAccountDataSnapshot } from '../interfaces';
import { Account } from './Account';
import { Transaction } from './Transaction';

interface AccountDataSnapshot extends IAccountDataSnapshot {}

class AccountDataSnapshot {
  account: Account;

  transactions: Array<Transaction>;

  constructor(json: AccountDataSnapshotJSON) {
    this.account = new Account(json.account);
    this.transactions = json.transactions.map(
      (transactionJson) => new Transaction(transactionJson)
    );
  }
}

export { AccountDataSnapshot };
