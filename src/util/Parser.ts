import Decimal from 'decimal.js';
import Account from '../models/Account';
// eslint-disable-next-line import/no-cycle
import Transaction from '../models/Transaction';
// eslint-disable-next-line import/no-cycle
import Exchange from '../models/Exchange';
import ExchangeRate from '../models/ExchangeRate';
import ExchangeSettings from '../models/ExchangeSettings';
import FeeRates from '../models/FeeRates';
import {
  AccountJSON,
  TransactionJSON,
  ExchangeJSON,
  FeeRatesJSON,
  ExchangeRateJSON,
  ExchangeSettingsJSON,
  CurrencyCode,
  TimeInterval,
  Dictionary,
} from '../types';

/** @internal */
export default class Parser {
  static parseAccounts(accounts: Array<AccountJSON>) {
    return accounts.map((json) => new Account(json));
  }

  static parseTransactions(transactions: Array<TransactionJSON>) {
    return transactions.map((json) => new Transaction(json));
  }

  static parseExchanges(exchanges: Array<ExchangeJSON>) {
    return exchanges.map((json) => new Exchange(json));
  }

  static parseFiatMap(fiatMapJSON: Record<string, string>) {
    const fiatMap: Dictionary<CurrencyCode, Decimal> = {};
    Object.keys(fiatMapJSON).forEach((currencyCode) => {
      fiatMap[currencyCode as CurrencyCode] = new Decimal(fiatMapJSON[currencyCode]);
    });
    return fiatMap;
  }

  static parseFeeRates(feeRatesMapJSON: Record<string, FeeRatesJSON>) {
    const feeRatesMap: Dictionary<CurrencyCode, FeeRates> = {};
    Object.keys(feeRatesMapJSON).forEach((currencyCode) => {
      feeRatesMap[currencyCode as CurrencyCode] = new FeeRates(feeRatesMapJSON[currencyCode]);
    });
    return feeRatesMap;
  }

  static parseExchangeRates(exchangeRateMapJSON: Record<string, Record<string, ExchangeRateJSON>>) {
    const exchangeRatesMap: Dictionary<CurrencyCode, Dictionary<CurrencyCode, ExchangeRate>> = {};
    Object.keys(exchangeRateMapJSON).forEach((depositCurrency) => {
      const innerMap: Dictionary<CurrencyCode, ExchangeRate> = {};
      Object.keys(exchangeRateMapJSON[depositCurrency]).forEach((withdrawCurrency) => {
        innerMap[withdrawCurrency as CurrencyCode] = new ExchangeRate(
          exchangeRateMapJSON[depositCurrency][withdrawCurrency]
        );
      });
      exchangeRatesMap[depositCurrency as CurrencyCode] = innerMap;
    });
    return exchangeRatesMap;
  }

  static parseExchangeSettings(
    exchangeSettingsMapJSON: Record<string, Record<string, ExchangeSettingsJSON>>
  ) {
    const exchangeSettingsMap: Dictionary<
      CurrencyCode,
      Dictionary<CurrencyCode, ExchangeSettings>
    > = {};
    Object.keys(exchangeSettingsMapJSON).forEach((depositCurrency) => {
      const innerMap: Dictionary<CurrencyCode, ExchangeSettings> = {};
      Object.keys(exchangeSettingsMapJSON[depositCurrency]).forEach((withdrawCurrency) => {
        innerMap[withdrawCurrency as CurrencyCode] = new ExchangeSettings(
          exchangeSettingsMapJSON[depositCurrency][withdrawCurrency]
        );
      });
      exchangeSettingsMap[depositCurrency as CurrencyCode] = innerMap;
    });
    return exchangeSettingsMap;
  }

  static parseHistoricalExchangeRates(
    exchangeRateMapJSON: Record<string, Record<string, Record<string, Array<ExchangeRateJSON>>>>
  ) {
    const exchangeRateMap: Dictionary<
      TimeInterval,
      Dictionary<CurrencyCode, Dictionary<CurrencyCode, Array<ExchangeRate>>>
    > = {};
    Object.keys(exchangeRateMapJSON).forEach((timeInterval) => {
      const outerMap: Dictionary<CurrencyCode, Dictionary<CurrencyCode, Array<ExchangeRate>>> = exchangeRateMapJSON[timeInterval];
      Object.keys(outerMap).forEach((depositCurrency) => {
        const innerMap: Dictionary<CurrencyCode, Array<ExchangeRate>> =
          (outerMap[depositCurrency as CurrencyCode] as Dictionary<CurrencyCode, Array<ExchangeRate>>);
        Object.keys(innerMap).forEach(
          (withdrawCurrency) => {
            const array: Array<ExchangeRateJSON> = (exchangeRateMapJSON[timeInterval][depositCurrency][withdrawCurrency] as Array<ExchangeRateJSON>);
            (exchangeRateMap as any)[timeInterval as TimeInterval][depositCurrency as CurrencyCode][
              withdrawCurrency as CurrencyCode
            ] = array.map((exchangeRateJSON) => new ExchangeRate(exchangeRateJSON));
          }
        );
      });
    });
    return exchangeRateMap;
  }
}
