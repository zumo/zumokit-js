import { Decimal } from 'decimal.js';
import { CurrencyCode, TransactionCardPropertiesJSON } from '../interfaces';

/** Transaction details. */
export class TransactionCardProperties {
  /** @internal */
  json: TransactionCardPropertiesJSON;

  /** Card identifier.. */
  cardId: string;

  /** Transaction amount. */
  transactionAmount: Decimal;

  /** Transaction currency code in 3 letter ISO 4217 format. */
  transactionCurrency: string;

  /** Billing amount. */
  billingAmount: Decimal;
  
  /** Billing currency code. */
  billingCurrency: CurrencyCode;
  
  /** Exchange rate applied to any conversion between transaction & billing amount rounded to 6 decimal places. */
  exchangeRateValue: Decimal;
  
  /** The Merchant Category Code (MCC) for the card activity in ISO-18245 format. */
  mcc: string;
  
  /** The merchant name. */
  merchantName: string;
  
  /** The 3 letter ISO 3166 merchant country code. */
  merchantCountry: string;
 
  /** @internal */
  constructor(json: TransactionCardPropertiesJSON) {
    this.json = json;
    this.cardId = json.cardId;
    this.transactionAmount = new Decimal(json.transactionAmount);
    this.transactionCurrency = json.transactionCurrency;
    this.billingAmount = new Decimal(json.billingAmount);
    this.billingCurrency = json.billingCurrency as CurrencyCode;
    this.exchangeRateValue = new Decimal(json.exchangeRateValue);
    this.mcc = json.mcc;
    this.merchantName = json.merchantName;
    this.merchantCountry = json.merchantCountry;
  }
}
