import { Decimal } from 'decimal.js';
import { ComposedTransaction as IComposedTransaction } from '../interfaces';
import { Account } from './Account';
import { TransactionType, ComposedTransactionJSON } from '../types';

interface ComposedTransaction extends IComposedTransaction {}

class ComposedTransaction {
  json: ComposedTransactionJSON;

  constructor(json: ComposedTransactionJSON) {
    this.json = json;
    this.type = json.type as TransactionType;
    this.signedTransaction = json.signedTransaction;
    this.account = new Account(json.account);
    this.destination = json.destination;
    this.amount = json.amount ? new Decimal(json.amount) : null;
    this.data = json.data;
    this.fee = new Decimal(json.fee);
    this.nonce = json.nonce;
  }
}

export { ComposedTransaction };
