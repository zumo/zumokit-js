import { Decimal } from 'decimal.js';
import { TransactionFeeRateJSON } from '../types';
import { TransactionFeeRate as ITransactionFeeRate } from '../interfaces';

interface TransactionFeeRate extends ITransactionFeeRate {}

class TransactionFeeRate {
  json: TransactionFeeRateJSON;

  constructor(json: TransactionFeeRateJSON) {
    this.json = json;
    this.slow = new Decimal(json.slow);
    this.average = new Decimal(json.average);
    this.fast = new Decimal(json.fast);
    this.slowTime = json.slowTime;
    this.averageTime = json.averageTime;
    this.fastTime = json.fastTime;
    this.source = json.source;
  }
}

export { TransactionFeeRate };
