export type Dictionary<K extends string, T> = Partial<Record<K, T>>;

export type CurrencyType = 'CRYPTO' | 'FIAT';

export type CurrencyCode = 'BTC' | 'ETH' | 'USD' | 'GBP' | 'EUR';

export type Network = 'MAINNET' | 'TESTNET' | 'RINKEBY' | 'ROPSTEN' | 'GOERLI';

export type AccountType = 'STANDARD' | 'COMPATIBILITY' | 'SEGWIT';

export type CardType = 'VIRTUAL' | 'PHYSICAL';

export type CardStatus = 'CREATED' | 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';

export type TransactionType = 'CRYPTO' | 'EXCHANGE' | 'FIAT' | 'NOMINATED' | 'CARD';

export type TransactionDirection = 'INCOMING' | 'OUTGOING';

export type TransactionStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'RESUBMITTED'
  | 'CANCELLED'
  | 'PAUSED'
  | 'REJECTED'
  | 'REVERSED';

export type ExchangeStatus =
  | 'PENDING'
  | 'DEPOSITED'
  | 'CONFIRMED'
  | 'FAILED'
  | 'RESUBMITTED'
  | 'CANCELLED'
  | 'PAUSED'
  | 'REJECTED';

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

/** Interface describes user address, which is a parameter of {@link User.makeFiatCustomer} and {@link User.createCard}. */
export interface Address {
  addressLine1: string;
  addressLine2: string | null;
  /** country code in ISO 3166-1 Alpha-2 format, e.g. 'GB' */
  country: string;
  postCode: string;
  postTown: string;
}

/** Interface describes sensitive card details, retrieved via {@link User.revealCardDetails} method. */
export interface CardDetails {
  pan: string;
  cvv2: string;
  expiry: string;
}