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

  /** Crypto addresses from which funds where received, if any. */
  fromAddresses: Array<string>;

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
    this.status = json.status as CustodyOrderStatus;
    this.fromAddresses = json.fromAddresses;
    this.fromAccountId = json.fromAccountId;
    this.toAddress = json.toAddress;
    this.toAccountId = json.toAccountId;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }
}
