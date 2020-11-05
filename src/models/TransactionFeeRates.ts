import { TransactionFeeRate } from './TransactionFeeRate';
import { TransactionFeeRates as ITransactionFeeRates } from '../interfaces';
import { TransactionFeeRateJSON, CurrencyCode, Dictionary } from '../types';

export type TransactionFeeRates = ITransactionFeeRates;

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
