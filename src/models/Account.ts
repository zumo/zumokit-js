import { Decimal } from 'decimal.js';
import { AccountCryptoProperties } from './AccountCryptoProperties';
import { AccountFiatProperties } from './AccountFiatProperties';
import { Card } from './Card';
import {
  CurrencyType,
  CurrencyCode,
  Network,
  AccountType,
  AccountJSON,
  CustodyType,
} from '../interfaces';

/** Account details. */
export class Account {
  /** @internal */
  json: AccountJSON;

  /** Unique account identifier. */
  id: string;

  /** Account currency type. */
  currencyType: CurrencyType;

  /** Account currency code. */
  currencyCode: CurrencyCode;

  /** Account network type. */
  network: Network;

  /** Account type. */
  type: AccountType;

  /** Custody type. */
  custodyType: CustodyType;

  /** Account balance. */
  balance: Decimal;

  /** Account ledger balance. */
  ledgerBalance: Decimal;

  /** Account available balance, i.e. ledger balance minus pending transactions. */
  availableBalance: Decimal;

  /** Overdraft limit. */
  overdraftLimit: Decimal;

  /** Account has associated nominated account. */
  hasNominatedAccount: boolean;

  /** Account crypto properties if account is a crypto account, otherwise null. */
  cryptoProperties: AccountCryptoProperties | null;

  /** Account fiat properties if account is a fiat account, otherwise null. */
  fiatProperties: AccountFiatProperties | null;

  /** Cards associated with this account. */
  cards: Array<Card>;

  /** @internal */
  constructor(json: AccountJSON) {
    this.json = json;
    this.id = json.id;
    this.currencyType = json.currencyType as CurrencyType;
    this.currencyCode = json.currencyCode as CurrencyCode;
    this.network = json.network as Network;
    this.type = json.type as AccountType;
    this.custodyType = json.custodyType as CustodyType;
    this.balance = new Decimal(json.balance);
    this.ledgerBalance = new Decimal(json.ledgerBalance);
    this.availableBalance = new Decimal(json.availableBalance);
    this.overdraftLimit = new Decimal(json.overdraftLimit);
    this.hasNominatedAccount = !!json.hasNominatedAccount;
    this.cryptoProperties = json.cryptoProperties
      ? new AccountCryptoProperties(json.cryptoProperties)
      : null;
    this.fiatProperties = json.fiatProperties
      ? new AccountFiatProperties(json.fiatProperties)
      : null;
    this.cards = json.cards.map((cardJson) => new Card(cardJson));
  }
}
