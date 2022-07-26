import { Decimal } from 'decimal.js';
import {
  TransactionCryptoPropertiesJSON,
  Dictionary,
  CurrencyCode,
} from '../interfaces';

/**
 * Transaction crypto properties.
 * <p>
 * See {@link Transaction}.
 * */
export class TransactionCryptoProperties {
  /** @internal */
  json: TransactionCryptoPropertiesJSON;

  /** Transaction hash or null. */
  txHash: string | null;

  /**
   * Ethereum transaction nonce if greater than 0 and
   * it is Ethereum transaction, otherwise returns null.
   */
  nonce: number | null;

  /** Wallet address of sender, */
  fromAddress: string;

  /** Wallet address of receiver or null, if it is Ethereum contract deploy. */
  toAddress: string | null;

  /** Transaction data or null. */
  data: string | null;

  /** Ethereum gas price if it is Ethereum transaction, otherwise null. */
  gasPrice: Decimal | null;

  /** Ethereum gas limit if it is Ethereum transaction, otherwise null. */
  gasLimit: number | null;

  /** Amount in fiat currencies at the time of the transaction submission. */
  fiatFee: Dictionary<CurrencyCode, number> | null;

  /** Fee in fiat currencies at the time of the transaction submission. */
  fiatAmount: Dictionary<CurrencyCode, number> | null;

  /** @internal */
  constructor(json: TransactionCryptoPropertiesJSON) {
    this.json = json;
    this.txHash = json.txHash;
    this.nonce = json.nonce;
    this.fromAddress = json.fromAddress;
    this.toAddress = json.toAddress;
    this.data = json.data;
    this.gasPrice = json.gasPrice ? new Decimal(json.gasPrice) : null;
    this.gasLimit = json.gasLimit;
    this.fiatFee = json.fiatFee;
    this.fiatAmount = json.fiatAmount;
  }
}
