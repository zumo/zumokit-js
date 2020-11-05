import { TransactionFeeRate } from './TransactionFeeRate';
import { CurrencyCode, Dictionary } from '../types/exported';

/**
 * Transaction fee rates are contained in a mapping between crypto currency and
 * tranfaction fee rate.
 */
export type TransactionFeeRates = Dictionary<CurrencyCode, TransactionFeeRate>;
