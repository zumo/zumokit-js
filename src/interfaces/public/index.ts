export type Dictionary<K extends string, T> = Partial<Record<K, T>>;

export type CurrencyType = 'CRYPTO' | 'FIAT';

export type CurrencyCode = 'BTC' | 'ETH' | 'USD' | 'GBP' | 'EUR';

export type Network = 'MAINNET' | 'TESTNET' | 'RINKEBY' | 'ROPSTEN' | 'GOERLI';

export type AccountType = 'STANDARD' | 'COMPATIBILITY' | 'SEGWIT';

export type TransactionType = 'CRYPTO' | 'EXCHANGE' | 'FIAT' | 'NOMINATED';

export type TransactionStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'RESUBMITTED'
  | 'CANCELLED'
  | 'PAUSED'
  | 'REJECTED';

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

/** Interface describes customer details, which is a parameter of {@link User.makeFiatCustomer}. */
export interface FiatCustomerData {
  firstName: string;
  middleName: string | null;
  lastName: string;
  /** date of birth in ISO 8601 format, e.g '2020-08-12' */
  dateOfBirth: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  /** country code in ISO 3166-1 Alpha-2 format, e.g. 'GB' */
  country: string;
  postCode: string;
  postTown: string;
}
