import { Decimal } from 'decimal.js';

/** Crypto transactions fee rates. */
export interface TransactionFeeRate {
  /** Fee rate resulting in slow confirmation time. */
  slow: Decimal;

  /** Fee rate resulting in average confirmation time. */
  average: Decimal;

  /** Fee rate resulting in fast confirmation time. */
  fast: Decimal;

  /** Slow confirmation time in hours. */
  slowTime: number;

  /** Average confirmation time in hours. */
  averageTime: number;

  /** Fast confirmation time in hours. */
  fastTime: number;

  /** Fee rate information provider. */
  source: string;
}
