import { ExchangeRate } from './ExchangeRate';
import { Dictionary, CurrencyCode } from '../types/exported';

/**
 * Exchange rates are contained in a mapping between from currency,
 * to currency and exchange rates.
 */
export type ExchangeRates = Dictionary<
  CurrencyCode,
  Dictionary<CurrencyCode, ExchangeRate>
>;
