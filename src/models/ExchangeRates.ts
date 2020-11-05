import { ExchangeRate } from './ExchangeRate';
import { ExchangeRates as IExchangeRates } from '../interfaces';
import { Dictionary, CurrencyCode, ExchangeRateJSON } from '../types';

export type ExchangeRates = IExchangeRates;

export const ExchangeRates = (
  exchangeRatesJSON: Record<string, Record<string, ExchangeRateJSON>>
) => {
  const exchangeRates: ExchangeRates = {};
  Object.keys(exchangeRatesJSON).forEach((depositCurrency) => {
    const innerMap: Dictionary<CurrencyCode, ExchangeRate> = {};
    Object.keys(exchangeRatesJSON[depositCurrency]).forEach((toCurrency) => {
      innerMap[toCurrency as CurrencyCode] = new ExchangeRate(
        exchangeRatesJSON[depositCurrency][toCurrency]
      );
    });
    exchangeRates[depositCurrency as CurrencyCode] = innerMap;
  });
  return exchangeRates;
};
