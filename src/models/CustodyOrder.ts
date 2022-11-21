import Decimal from 'decimal.js';
import {
  CustodyOrderType,
  CustodyOrderStatus,
  CustodyOrderJSON,
} from '../interfaces';

export class CustodyOrder {
  /** @internal */
  json: CustodyOrderJSON;

  /** Identifier */
  id: string;

  /** Custody order type. */
  type: CustodyOrderType;

  /** Custody order status. */
  status: CustodyOrderStatus;

  /** Custody order amount, null if not known yet. */
  amount: Decimal | null;

  /** Flag indicating if fees are included in order amount. */
  feeInAmount: boolean;

  /** Estimated custody order fees. */
  estimatedFees: Decimal | null;

  /** Actual custody order fees, null if not known yet. */
  fees: Decimal | null;

  /** Crypto addresses from which funds where received, if any. */
  fromAddresses: Array<string> | null;

  /** Debit {@link  Account Account} identifier, if applicable. */
  fromAccountId: string | null;

  /** Destination crypto address, if applicable. */
  toAddress: string | null;

  /** Credit {@link  Account Account} identifier, if applicable. */
  toAccountId: string | null;

  /** Epoch timestamp when custody order was created. */
  createdAt: number;

  /** Epoch timestamp when custody order was updated. */
  updatedAt: number;

  /** @internal */
  constructor(json: CustodyOrderJSON) {
    this.json = json;
    this.id = json.id;
    this.type = json.type as CustodyOrderType;
    this.status = json.status.toUpperCase() as CustodyOrderStatus;
    this.amount = json.amount ? new Decimal(json.amount) : null;
    this.feeInAmount = json.feeInAmount;
    this.estimatedFees = json.estimatedFees
      ? new Decimal(json.estimatedFees)
      : null;
    this.fees = json.fees ? new Decimal(json.fees) : null;
    this.fromAddresses = json.fromAddresses;
    this.fromAccountId = json.fromAccountId;
    this.toAddress = json.toAddress;
    this.toAccountId = json.toAccountId;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }
}
