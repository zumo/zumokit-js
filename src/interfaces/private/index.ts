export interface AccountCryptoPropertiesJSON {
  address: string;
  path: string;
  nonce: number | null;
}

export interface AccountFiatPropertiesJSON {
  accountNumber: string | null;
  sortCode: string | null;
  bic: string | null;
  iban: string | null;
  customerName: string | null;
}

export interface AccountJSON {
  id: string;
  currencyType: string;
  currencyCode: string;
  network: string;
  type: string;
  balance: string;
  hasNominatedAccount: boolean;
  cryptoProperties: AccountCryptoPropertiesJSON;
  fiatProperties: AccountFiatPropertiesJSON;
}

export interface ExchangeRateJSON {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  value: string;
  validTo: number;
  timestamp: number;
}

export interface ExchangeSettingJSON {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeAddress: Record<string, string>;
  minExchangeAmount: string;
  outgoingTransactionFeeRate: string;
  exchangeFeeRate: string;
  returnTransactionFee: string;
  timestamp: number;
}

export interface ComposedTransactionJSON {
  type: string;
  signedTransaction: string | null;
  account: AccountJSON;
  destination: string | null;
  amount: string | null;
  data: string | null;
  fee: string;
  nonce: string;
}

export interface ComposedExchangeJSON {
  signedTransaction: string | null;
  fromAccount: AccountJSON;
  toAccount: AccountJSON;
  exchangeRate: ExchangeRateJSON;
  exchangeSetting: ExchangeSettingJSON;
  exchangeAddress: string | null;
  amount: string;
  outgoingTransactionFee: string;
  returnAmount: string;
  exchangeFee: string;
  returnTransactionFee: string;
  nonce: string;
}

export interface TransactionFeeRateJSON {
  slow: string;
  average: string;
  fast: string;
  slowTime: number;
  averageTime: number;
  fastTime: number;
  source: string;
}

export interface TransactionCryptoPropertiesJSON {
  txHash: string | null;
  nonce: number | null;
  fromAddress: string;
  toAddress: string | null;
  data: string | null;
  gasPrice: string | null;
  gasLimit: number | null;
  fiatFee: Record<string, string>;
  fiatAmount: Record<string, string>;
}

export interface TransactionFiatPropertiesJSON {
  fromFiatAccount: AccountFiatPropertiesJSON;
  toFiatAccount: AccountFiatPropertiesJSON;
}

export interface TransactionJSON {
  id: string;
  type: string;
  currencyCode: string;
  direction: string;
  fromUserId: string | null;
  toUserId: string | null;
  fromAccountId: string | null;
  toAccountId: string | null;
  network: string;
  status: string;
  amount: string | null;
  fee: string | null;
  nonce: string;
  cryptoProperties: TransactionCryptoPropertiesJSON | null;
  fiatProperties: TransactionFiatPropertiesJSON | null;
  exchange: ExchangeJSON | null;
  submittedAt: number | null;
  confirmedAt: number | null;
  timestamp: number;
}

export interface ExchangeJSON {
  id: string;
  status: string;
  fromCurrency: string;
  fromAccountId: string;
  outgoingTransactionId: string | null;
  outgoingTransactionFee: string | null;
  toCurrency: string;
  toAccountId: string;
  returnTransactionId: string | null;
  returnTransactionFee: string;
  amount: string;
  returnAmount: string;
  exchangeFee: string;
  exchangeRate: ExchangeRateJSON;
  exchangeSetting: ExchangeSettingJSON;
  exchangeRates: Record<string, Record<string, ExchangeRateJSON>>;
  nonce: string | null;
  submittedAt: number;
  confirmedAt: number | null;
  timestamp: number;
}

export interface AccountDataSnapshotJSON {
  account: AccountJSON;
  transactions: Array<TransactionJSON>;
}

export type HistoricalExchangeRatesJSON = Record<
  string,
  Record<string, Record<string, Array<ExchangeRateJSON>>>
>;

export type ZumoKitErrorJSON = {
  type: string;
  code: string;
  message: string;
};
