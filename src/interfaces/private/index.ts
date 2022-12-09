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
  custodyType: string;
  balance: string;
  ledgerBalance: string;
  availableBalance: string;
  overdraftLimit: string;
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
  ttl: number;
  createdAt: string;
  expiresAt: string;
  debitCurrency: string;
  creditCurrency: string;
  price: string;
  feeRate: string;
  debitAmount: string;
  feeAmount: string;
  creditAmount: string;
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
  custodyOrderId: string | null;
}

export interface TradingPairLimitJSON {
  base: string;
  quote: string;
}

export interface TradingPairJSON {
  pair: string;
  base: string;
  quote: string;
  trading: boolean;
  min: TradingPairLimitJSON;
  max: TradingPairLimitJSON;
  feeRate: string;
}

export interface ComposedExchangeJSON {
  debitAccount: AccountJSON;
  creditAccount: AccountJSON;
  quote: QuoteJSON;
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

export interface CustodyOrderJSON {
  id: string;
  type: string;
  status: string;
  amount: string | null;
  feeInAmount: boolean;
  estimatedFees: string | null;
  fees: string | null;
  fromAddresses: Array<string> | null;
  fromAccountId: string | null;
  fromUserId: string | null;
  fromUserIntegratorId: string | null;
  toAddress: string | null;
  toAccountId: string | null;
  toUserId: string | null;
  toUserIntegratorId: string | null;
  createdAt: number;
  updatedAt: number;
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
  custodyOrder: CustodyOrderJSON | null;
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
  pair: string;
  side: string;
  price: string;
  amount: string;
  debitAccountId: string;
  debitTransactionId: string | null;
  creditAccountId: string;
  creditTransactionId: string | null;
  quote: QuoteJSON;
  rates: Record<string, Record<string, string>>;
  nonce: string | null;
  createdAt: string;
  updatedAt: string;
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
