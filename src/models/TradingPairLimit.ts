import { Decimal } from 'decimal.js';
import { TradingPairLimitJSON } from '../interfaces';

/** Trading pair limit */
export class TradingPairLimit {
  /** Trading limit in base currency */
  base: Decimal;

  /** Trading limit in quote currency */
  quote: Decimal;

  /** @internal */
  constructor(json: TradingPairLimitJSON) {
    this.base = new Decimal(json.base);
    this.quote = new Decimal(json.quote);
  }
}
