import { Decimal } from 'decimal.js';
import { ExchangeSetting as IExchangeSetting } from '../interfaces';
import {
  Dictionary,
  Network,
  CurrencyCode,
  ExchangeSettingJSON,
} from '../types';

const parseExchangeAddressMap = (
  exchangeAddressMapJSON: Record<string, string>
) => {
  const exchangeAddressMap: Dictionary<Network, string> = {};
  Object.keys(exchangeAddressMapJSON).forEach((network) => {
    exchangeAddressMap[network as Network] = exchangeAddressMapJSON[network];
  });
  return exchangeAddressMap;
};

interface ExchangeSetting extends IExchangeSetting {}

class ExchangeSetting {
  json: ExchangeSettingJSON;

  constructor(json: ExchangeSettingJSON) {
    this.json = json;
    this.id = json.id;
    this.fromCurrency = json.fromCurrency as CurrencyCode;
    this.toCurrency = json.toCurrency as CurrencyCode;
    this.exchangeAddress = parseExchangeAddressMap(json.exchangeAddress);
    this.minExchangeAmount = new Decimal(json.minExchangeAmount);
    this.outgoingTransactionFeeRate = new Decimal(
      json.outgoingTransactionFeeRate
    );
    this.exchangeFeeRate = new Decimal(json.exchangeFeeRate);
    this.returnTransactionFee = new Decimal(json.returnTransactionFee);
    this.timestamp = json.timestamp;
  }
}

export { ExchangeSetting };
