export interface AccountCryptoPropertiesJSON {
  address: string;
  path: string;
  nonce: number | null;
}

export interface AccountFiatPropertiesJSON {
  providerId: string | null;
  accountNumber: string | null;
  sortCode: string | null;
  bic: string | null;
  iban: string | null;
  customerName: string | null;
}

export interface CardJSON {
  id: string;
  accountId: string;
  cardType: string;
  cardStatus: string;
  limit: number;
  maskedPan: string;
  expiry: string;
  sca: boolean;
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
  cards: Array<CardJSON>;
}

export interface ExchangeRateJSON {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  value: string;
  timestamp: number;
}

export interface QuoteJSON {
  id: string;
  expireTime: number;
  expiresIn: number | null;
  fromCurrency: string;
  toCurrency: string;
  depositAmount: string;
  value: string;
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
  quote: QuoteJSON;
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
  fiatFee: Record<string, number> | null;
  fiatAmount: Record<string, number> | null;
}

export interface TransactionFiatPropertiesJSON {
  fromFiatAccount: AccountFiatPropertiesJSON;
  toFiatAccount: AccountFiatPropertiesJSON;
}

export interface TransactionCardPropertiesJSON {
  cardId: string;
  transactionAmount: string;
  transactionCurrency: string;
  billingAmount: string;
  billingCurrency: string;
  exchangeRateValue: string;
  mcc: string | null;
  merchantName: string | null;
  merchantCountry: string | null;
}

export interface TransactionAmountJSON {
  direction: string;
  userId: string | null;
  userIntegratorId: string | null;
  accountId: string | null;
  amount: string | null;
  fiatAmount: Record<string, number> | null;
  address: string | null;
  isChange: boolean;
  accountNumber: string | null;
  sortCode: string | null;
  bic: string | null;
  iban: string | null;
}

export interface InternalTransactionJSON {
  fromUserId: string | null;
  fromUserIntegratorId: string | null;
  fromAccountId: string | null;
  fromAddress: string | null;
  toUserId: string | null;
  toUserIntegratorId: string | null;
  toAccountId: string | null;
  toAddress: string | null;
  amount: string;
  fiatAmount: Record<string, number> | null;
}

export interface TransactionJSON {
  id: string;
  type: string;
  currencyCode: string;
  direction: string;
  network: string;
  status: string;
  amount: string | null;
  fee: string | null;
  nonce: string;
  senders: Array<TransactionAmountJSON>;
  recipients: Array<TransactionAmountJSON>;
  internalTransactions: Array<InternalTransactionJSON>;
  cryptoProperties: TransactionCryptoPropertiesJSON | null;
  fiatProperties: TransactionFiatPropertiesJSON | null;
  cardProperties: TransactionCardPropertiesJSON | null;
  exchange: ExchangeJSON | null;
  metadata: string | null;
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
  quote: QuoteJSON;
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
