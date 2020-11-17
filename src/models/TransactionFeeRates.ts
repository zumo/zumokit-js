import { TransactionFeeRate } from './TransactionFeeRate';
import {
  CurrencyCode,
  Dictionary,
  TransactionFeeRateJSON,
} from '../interfaces';

/**
 * Transaction fee rates are contained in a mapping between crypto currency and
 * tranfaction fee rate.
 */
export type TransactionFeeRates = Dictionary<CurrencyCode, TransactionFeeRate>;

/** @internal */
export const TransactionFeeRates = (
  transactionFeeRatesJSON: Record<string, TransactionFeeRateJSON>
) => {
  const feeRates: Dictionary<CurrencyCode, TransactionFeeRate> = {};
  Object.keys(transactionFeeRatesJSON).forEach((currencyCode) => {
    feeRates[currencyCode as CurrencyCode] = new TransactionFeeRate(
      transactionFeeRatesJSON[currencyCode]
    );
  });
  return feeRates;
};
