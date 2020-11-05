import { ExchangeRate } from './ExchangeRate';
import { CurrencyCode, Dictionary, TimeInterval } from '../types/exported';

/**
 * Historical exchange rates are contained in a mapping between time interval,
 * from currency, to currency on third level and exchange rates.
 */
export type HistoricalExchangeRates = Dictionary<
  TimeInterval,
  Dictionary<CurrencyCode, Dictionary<CurrencyCode, Array<ExchangeRate>>>
>;
