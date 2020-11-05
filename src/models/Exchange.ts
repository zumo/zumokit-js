import { Decimal } from 'decimal.js';
import { Exchange as IExchange } from '../interfaces';
import { ExchangeRate } from './ExchangeRate';
import { ExchangeRates } from './ExchangeRates';
import { ExchangeSetting } from './ExchangeSetting';
import { ExchangeStatus, CurrencyCode, ExchangeJSON } from '../types';

interface Exchange extends IExchange {}

class Exchange {
  json: ExchangeJSON;

  constructor(json: ExchangeJSON) {
    this.json = json;
    this.id = json.id;
    this.status = json.status as ExchangeStatus;
    this.fromCurrency = json.fromCurrency as CurrencyCode;
    this.fromAccountId = json.fromAccountId;
    this.outgoingTransactionId = json.outgoingTransactionId;
    this.outgoingTransactionFee = json.outgoingTransactionFee
      ? new Decimal(json.outgoingTransactionFee)
      : null;
    this.toCurrency = json.toCurrency as CurrencyCode;
    this.toAccountId = json.toAccountId;
    this.returnTransactionId = json.returnTransactionId;
    this.returnTransactionFee = new Decimal(json.returnTransactionFee);
    this.amount = new Decimal(json.amount);
    this.returnAmount = new Decimal(json.returnAmount);
    this.exchangeFee = new Decimal(json.exchangeFee);
    this.exchangeRate = new ExchangeRate(json.exchangeRate);
    this.exchangeSetting = new ExchangeSetting(json.exchangeSetting);
    this.exchangeRates = ExchangeRates(json.exchangeRates);
    this.nonce = json.nonce;
    this.submittedAt = json.submittedAt;
    this.confirmedAt = json.confirmedAt;
    this.timestamp = json.submittedAt;
  }
}

export { Exchange };
