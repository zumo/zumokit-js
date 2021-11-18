export type LogLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warning'
  | 'error'
  | 'critical'
  | 'off';

export type Dictionary<K extends string, T> = Partial<Record<K, T>>;

export type CurrencyType = 'CRYPTO' | 'FIAT';

export type CurrencyCode = 'ETH' | 'BTC' | 'BSV' | 'USD' | 'GBP' | 'EUR';

export type Network = 'MAINNET' | 'TESTNET' | 'RINKEBY' | 'ROPSTEN' | 'GOERLI';

export type AccountType = 'STANDARD' | 'COMPATIBILITY' | 'SEGWIT';

export type CardType = 'VIRTUAL' | 'PHYSICAL';

export type CardStatus =
  | 'CREATED'
  | 'ACTIVE'
  | 'BLOCKED'
  | 'SUSPENDED'
  | 'FROZEN'
  | 'EXPIRED'
  | 'CANCELLED';

export type TransactionType =
  | 'CRYPTO'
  | 'FIAT'
  | 'NOMINATED'
  | 'CARD';

export type TransactionDirection = 'INCOMING' | 'OUTGOING';

export type TransactionStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'RESUBMITTED'
  | 'CANCELLED'
  | 'PAUSED'
  | 'REJECTED'
  | 'AUTHORISED'
  | 'REVERSED';

export type ExchangeStatus =
  | 'PENDING'
  | 'WITHDRAWING'
  | 'CONFIRMED'
  | 'FAILED';

export type TimeInterval =
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'max';

/** Interface describes user tokens set, which is a parameter of {@link ZumoKit.signIn}. */
export interface TokenSet {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

/** Interface describes user address, which is a parameter of {@link User.makeFiatCustomer}. */
export interface Address {
  houseNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  /** country code in ISO 3166-1 Alpha-2 format, e.g. 'GB' */
  country: string;
  postCode: string;
  postTown: string;
}

/** Interface describes sensitive card details, retrieved via {@link User.revealCardDetails} method. */
export interface CardDetails {
  /**  Card PAN, e.g 4564 6545 7997 5454 */
  pan: string;
  /**  Card CVV2, e.g. 078 */
  cvv2: string;
}
