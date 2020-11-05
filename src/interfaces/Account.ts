import { Decimal } from 'decimal.js';
import { AccountCryptoProperties } from './AccountCryptoProperties';
import { AccountFiatProperties } from './AccountFiatProperties';
import {
  CurrencyType,
  CurrencyCode,
  Network,
  AccountType,
} from '../types/exported';

/** Interface describing account details. */
export interface Account {
  /** Unique account identifier. */
  id: string;

  /** Account currency type. */
  currencyType: CurrencyType;

  /** Account currency code. */
  currencyCode: CurrencyCode;

  /** Account network type. */
  network: Network;

  /** Account type. */
  type: AccountType;

  /** Account balance. */
  balance: Decimal;

  /** Account has associated nominated account. */
  hasNominatedAccount: boolean;

  /** Account crypto properties if account is a crypto account, otherwise null. */
  cryptoProperties: AccountCryptoProperties | null;

  /** Account fiat properties if account is a fiat account, otherwise null. */
  fiatProperties: AccountFiatProperties | null;
}
