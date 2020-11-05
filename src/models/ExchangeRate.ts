import { Decimal } from 'decimal.js';
import { ExchangeRate as IExchangeRate } from '../interfaces';
import { CurrencyCode, ExchangeRateJSON } from '../types';

interface ExchangeRate extends IExchangeRate {}

class ExchangeRate {
  json: ExchangeRateJSON;

  constructor(json: ExchangeRateJSON) {
    this.json = json;
    this.id = json.id;
    this.fromCurrency = json.fromCurrency as CurrencyCode;
    this.toCurrency = json.toCurrency as CurrencyCode;
    this.value = new Decimal(json.value);
    this.validTo = json.validTo;
    this.timestamp = json.timestamp;
  }
}

export { ExchangeRate };
