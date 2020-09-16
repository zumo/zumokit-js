import { Dictionary, CurrencyCode, StateJSON, Network } from '../types';
import Account from './Account';
import Transaction from './Transaction';
import Exchange from './Exchange';
import ExchangeRate from './ExchangeRate';
import ExchangeSettings from './ExchangeSettings';
import FeeRates from './FeeRates';
import Parser from '../util/Parser';

/** Record containing ZumoKit state. */
export default class State {
  /** Active user's accounts. */
  accounts: Array<Account>;

  /** Active user's transactions. */
  transactions: Array<Transaction>;

  /** Active user's exchanges. */
  exchanges: Array<Exchange>;

  /** Active user's token. */
  token: string;

  /** Active user's id. */
  activeUserId: string | null;

  /** Zumo exchange rates. */
  exchangeRates: Dictionary<CurrencyCode, Dictionary<CurrencyCode, ExchangeRate>> | null;

  /** Zumo exchange settings. */
  exchangeSettings: Dictionary<CurrencyCode, Dictionary<CurrencyCode, ExchangeSettings>> | null;

  /** Crypto transactions fee rates. */
  feeRates: Dictionary<CurrencyCode, FeeRates> | null;

  /** List of networks where active user is Modulr customer. */
  modulrCustomerOnNetworks: Array<Network>;

  /** @internal */
  constructor(json: StateJSON) {
    console.log(json);

    this.accounts = Parser.parseAccounts(json.accounts);
    this.transactions = Parser.parseTransactions(json.transactions);
    this.exchanges = Parser.parseExchanges(json.exchanges);
    this.token = json.token;
    this.activeUserId = json.activeUserId;
    this.exchangeRates = Parser.parseExchangeRates(json.exchangeRates);
    this.exchangeSettings = Parser.parseExchangeSettings(json.exchangeSettings);
    this.feeRates = Parser.parseFeeRates(json.feeRates);
    this.modulrCustomerOnNetworks = json.modulrCustomerOnNetworks.map(
      (network) => (network as Network)
    );
  }
}