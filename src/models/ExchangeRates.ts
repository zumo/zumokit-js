import { ExchangeRate } from './ExchangeRate';
import { Dictionary, CurrencyCode, ExchangeRateJSON } from '../interfaces';

/**
 * Exchange rates are contained in a mapping between from currency,
 * to currency and exchange rates.
 */
export type ExchangeRates = Dictionary<
  CurrencyCode,
  Dictionary<CurrencyCode, ExchangeRate>
>;

/** @internal */
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
