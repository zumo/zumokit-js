import { Decimal } from 'decimal.js';
import { TransactionCryptoProperties } from './TransactionCryptoProperties';
import { TransactionFiatProperties } from './TransactionFiatProperties';
import { TransactionCardProperties } from './TransactionCardProperties';
import {
  TransactionType,
  TransactionDirection,
  TransactionStatus,
  CurrencyCode,
  Network,
  TransactionJSON,
  CustodyOrderJSON,
} from '../interfaces';
import { Exchange } from './Exchange';
import { TransactionAmount } from './TransactionAmount';
import { InternalTransaction } from './InternalTransaction';
import { CustodyOrder } from './CustodyOrder';

/** Transaction details. */
export class Transaction {
  /** @internal */
  json: TransactionJSON;

  /** Identifier. */
  id: string;

  /** Transaction type. */
  type: TransactionType;

  /** Currency code. */
  currencyCode: CurrencyCode;

  /**
   * Transaction direction relative to account data snapshot.
   * <p>
   * See {@link AccountDataSnapshot}.
   */
  direction: TransactionDirection;

  /** Network type. */
  network: Network;

  /** Transaction status. */
  status: TransactionStatus;

  /** Amount in transaction currency or null if transaction is Ethereum contract deploy. */
  amount: Decimal | null;

  /** Transaction fee in transaction currency or null, if not yet available. */
  fee: Decimal | null;

  /** Transaction nonce or null. Used to prevent double spend. */
  nonce: string | null;

  /** Transaction senders. */
  senders: Array<TransactionAmount>;

  /** Transaction recipients. */
  recipients: Array<TransactionAmount>;

  /** Internal transactions, e.g. ETH contract interaction side effects. */
  internalTransactions: Array<InternalTransaction>;

  /**
   * Custody order properties if it is a transaction associated with a custody order, null otherwise.
   */
  custodyOrder: CustodyOrder | null;

  /**
   * Crypto properties if it is a crypto transaction, null otherwise.
   * <p>
   * See {@link TransactionType}.
   */
  cryptoProperties: TransactionCryptoProperties | null;

  /**
   * Fiat properties if it is a fiat transaction, null otherwise.
   * <p>
   * See {@link TransactionType}.
   */
  fiatProperties: TransactionFiatProperties | null;

  /**
   * Card properties if it is a card transaction, null otherwise.
   * <p>
   * See {@link TransactionType}.
   */
  cardProperties: TransactionCardProperties | null;

  /**
   * Exchange properties if it is a transaction associated with an exchange, null otherwise.
   */
  exchange: Exchange | null;

  /**  Transaction metadata. */
  metadata: any;

  /** Epoch timestamp when transaction was submitted or null for incoming transactions from outside of Zumo ecosystem. */
  submittedAt: number | null;

  /** Epoch timestamp when transaction was submitted or null if transaction was not confirmed yet. */
  confirmedAt: number | null;

  /** Epoch timestamp, minimum non-null value between submitted at and confirmed at timestamps. */
  timestamp: number;

  /** @internal */
  constructor(json: TransactionJSON) {
    this.json = json;
    this.id = json.id;
    this.type = json.type as TransactionType;
    this.currencyCode = json.currencyCode as CurrencyCode;
    this.direction = json.direction as TransactionDirection;
    this.network = json.network as Network;
    this.status = json.status as TransactionStatus;
    this.amount = json.amount ? new Decimal(json.amount) : null;
    this.fee = json.fee ? new Decimal(json.fee) : null;
    this.nonce = json.nonce;
    this.senders = json.senders.map(
      (senderJson) => new TransactionAmount(senderJson)
    );
    this.recipients = json.recipients.map(
      (recipientJson) => new TransactionAmount(recipientJson)
    );
    this.internalTransactions = json.internalTransactions.map(
      (internalTransactionJson) =>
        new InternalTransaction(internalTransactionJson)
    );
    this.custodyOrder = json.custodyOrder
      ? new CustodyOrder(json.custodyOrder)
      : null;
    this.cryptoProperties = json.cryptoProperties
      ? new TransactionCryptoProperties(json.cryptoProperties)
      : null;
    this.fiatProperties = json.fiatProperties
      ? new TransactionFiatProperties(json.fiatProperties)
      : null;
    this.cardProperties = json.cardProperties
      ? new TransactionCardProperties(json.cardProperties)
      : null;
    this.exchange = json.exchange ? new Exchange(json.exchange) : null;
    this.metadata = json.metadata ? JSON.parse(json.metadata) : null;
    this.submittedAt = json.submittedAt;
    this.confirmedAt = json.confirmedAt;
    this.timestamp = json.timestamp;
  }
}
