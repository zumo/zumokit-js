import { HistoricalExchangeRates as IHistoricalExchangeRates } from '../interfaces';
import { ExchangeRate } from './ExchangeRate';
import {
  ExchangeRateJSON,
  CurrencyCode,
  Dictionary,
  TimeInterval,
} from '../types';

export type HistoricalExchangeRates = IHistoricalExchangeRates;

export const HistoricalExchangeRates = (
  historicalExchangeRatesJSON: Record<
    string,
    Record<string, Record<string, Array<ExchangeRateJSON>>>
  >
) => {
  const exchangeRateMap: HistoricalExchangeRates = {};
  Object.keys(historicalExchangeRatesJSON).forEach((timeInterval) => {
    const outerMap: Dictionary<
      CurrencyCode,
      Dictionary<CurrencyCode, Array<ExchangeRate>>
    > = historicalExchangeRatesJSON[timeInterval];
    Object.keys(outerMap).forEach((fromCurrency) => {
      const innerMap: Dictionary<CurrencyCode, Array<ExchangeRate>> = outerMap[
        fromCurrency as CurrencyCode
      ] as Dictionary<CurrencyCode, Array<ExchangeRate>>;
      Object.keys(innerMap).forEach((toCurrency) => {
        const array: Array<ExchangeRateJSON> = historicalExchangeRatesJSON[
          timeInterval
        ][fromCurrency][toCurrency] as Array<ExchangeRateJSON>;

        if (!exchangeRateMap[timeInterval as TimeInterval])
          exchangeRateMap[timeInterval as TimeInterval] = {};

        if (
          !(exchangeRateMap[timeInterval as TimeInterval] as Dictionary<
            CurrencyCode,
            Dictionary<CurrencyCode, Array<ExchangeRate>>
          >)[fromCurrency as CurrencyCode]
        )
          (exchangeRateMap[timeInterval as TimeInterval] as Dictionary<
            CurrencyCode,
            Dictionary<CurrencyCode, Array<ExchangeRate>>
          >)[fromCurrency as CurrencyCode] = {};

        ((exchangeRateMap[timeInterval as TimeInterval] as Dictionary<
          CurrencyCode,
          Dictionary<CurrencyCode, Array<ExchangeRate>>
        >)[fromCurrency as CurrencyCode] as Dictionary<
          CurrencyCode,
          Array<ExchangeRate>
        >)[toCurrency as CurrencyCode] = array.map(
          (exchangeRateJSON) => new ExchangeRate(exchangeRateJSON)
        );
      });
    });
  });
  return exchangeRateMap;
};
