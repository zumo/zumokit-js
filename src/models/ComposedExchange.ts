import { Decimal } from 'decimal.js';
import { ComposedExchange as IComposedExchange } from '../interfaces';
import { Account } from './Account';
import { ExchangeRate } from './ExchangeRate';
import { ExchangeSetting } from './ExchangeSetting';
import { ComposedExchangeJSON } from '../types';

interface ComposedExchange extends IComposedExchange {}

class ComposedExchange {
  json: ComposedExchangeJSON;

  constructor(json: ComposedExchangeJSON) {
    this.json = json;
    this.signedTransaction = json.signedTransaction;
    this.fromAccount = new Account(json.fromAccount);
    this.toAccount = new Account(json.toAccount);
    this.exchangeRate = new ExchangeRate(json.exchangeRate);
    this.exchangeSetting = new ExchangeSetting(json.exchangeSetting);
    this.exchangeAddress = json.exchangeAddress;
    this.amount = new Decimal(json.amount);
    this.outgoingTransactionFee = new Decimal(json.outgoingTransactionFee);
    this.returnAmount = new Decimal(json.returnAmount);
    this.exchangeFee = new Decimal(json.exchangeFee);
    this.returnTransactionFee = new Decimal(json.returnTransactionFee);
    this.nonce = json.nonce;
  }
}

export { ComposedExchange };
