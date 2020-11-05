import { Decimal } from 'decimal.js';
import {
  TransactionCryptoPropertiesJSON,
  Dictionary,
  CurrencyCode,
} from '../types';
import { TransactionCryptoProperties as ITransactionCryptoProperties } from '../interfaces';

const parseFiatMap = (fiatMapJSON: Record<string, string>) => {
  const fiatMap: Dictionary<CurrencyCode, Decimal> = {};
  Object.keys(fiatMapJSON).forEach((currencyCode) => {
    fiatMap[currencyCode as CurrencyCode] = new Decimal(
      fiatMapJSON[currencyCode]
    );
  });
  return fiatMap;
};

interface TransactionCryptoProperties extends ITransactionCryptoProperties {}

class TransactionCryptoProperties {
  json: TransactionCryptoPropertiesJSON;

  constructor(json: TransactionCryptoPropertiesJSON) {
    this.json = json;
    this.txHash = json.txHash;
    this.nonce = json.nonce;
    this.fromAddress = json.fromAddress;
    this.toAddress = json.toAddress;
    this.data = json.data;
    this.gasPrice = json.gasPrice ? new Decimal(json.gasPrice) : null;
    this.gasLimit = json.gasLimit ? parseInt(json.gasLimit, 10) : null;
    this.fiatFee = parseFiatMap(json.fiatFee);
    this.fiatAmount = parseFiatMap(json.fiatAmount);
  }
}

export { TransactionCryptoProperties };
