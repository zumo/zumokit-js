import { ExchangeSetting } from './ExchangeSetting';
import { CurrencyCode, Dictionary } from '../types/exported';

/**
 * Exchange settings are contained in a mapping between from currency,
 * to currency and exchange settings.
 */
export type ExchangeSettings = Dictionary<
  CurrencyCode,
  Dictionary<CurrencyCode, ExchangeSetting>
>;
