import { Decimal } from 'decimal.js';
import { TradingPairLimit } from './TradingPairLimit';
import { TradingPairJSON, CurrencyCode } from '../interfaces';

/** Trading pair */
export class TradingPair {
  /** Trading pair, e.g. "BTC-GBP" */
  pair: string;

  /** Base currency, e.g. "BTC" */
  base: CurrencyCode;

  /** Quote currency, e.g. "GBP" */
  quote: CurrencyCode;

  /** Flag indicating it trading is currently enabled for this pair */
  trading: boolean;

  /** Minimum tradeable amounts in base and quote currency */
  min: TradingPairLimit;

  /** Minimum tradeable amounts in base and quote currency */
  max: TradingPairLimit;

  /** Fee rate in percentage points, e.g. 0.1 represents 0.1% */
  feeRate: Decimal;

  /** @internal */
  constructor(json: TradingPairJSON) {
    this.pair = json.pair;
    this.base = json.base as CurrencyCode;
    this.quote = json.quote as CurrencyCode;
    this.trading = json.trading;
    this.min = new TradingPairLimit(json.min);
    this.max = new TradingPairLimit(json.max);
    this.feeRate = new Decimal(json.feeRate);
  }
}
