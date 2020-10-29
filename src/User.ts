
import { errorProxy } from './errorProxy';
import Wallet from './Wallet';
import ZumoKitError from './ZumoKitError';
import Account from './models/Account';
import AccountFiatProperties from './models/AccountFiatProperties';
import {
  CurrencyCode,
  Network,
  AccountType,
  AccountJSON,
  AccountDataSnapshotJSON,
  FiatCustomerData,
} from './types';
import AccountDataSnapshot from './models/AccountDataSnapshot';

/**
 * User class provides methods for managing user wallet and accounts.
 * <p>
 * User instance can be obtained via {@link ZumoKit.authUser} method.
 * <p>
 * See <a href="https://developers.zumo.money/docs/guides/manage-user-wallet">Manage User Wallet</a>,
 * <a href="https://developers.zumo.money/docs/guides/create-fiat-account">Create Fiat Account</a> and
 * <a href="https://developers.zumo.money/docs/guides/view-user-data">View User Data</a>
 * guides for usage details.
 */
export default class User {
  private userImpl: any;

  private accountDataListeners: Array<(state: Array<AccountDataSnapshot>) => void> = [];

  private accountDataListenersImpl: Array<any> = [];

  /** User dentifier. */
  id: string;

  /** Indicator if user has wallet. */
  hasWallet: boolean;

  /** User accounts. */
  accounts: Array<Account>;

  /** @internal */
  constructor(userImpl: any) {
    this.userImpl = userImpl;
    this.id = userImpl.getId();
    this.hasWallet = userImpl.hasWallet();
    this.accounts =
      JSON.parse(userImpl.getAccounts()).map((json: AccountJSON) => new Account(json));

    // listen to account changes
    this.addAccountDataListener((snapshots) => {
      this.accounts = snapshots.map((snapshot) => snapshot.account);
    });
  }

  /**
   * Create user wallet seeded by provided mnemonic and encrypted with user's password.
   * <p>
   * Mnemonic can be generated by {@link Utils.generateMnemonic} utility method.
   * @param  mnemonic       mnemonic seed phrase
   * @param  password       user provided password
   */
  createWallet(mnemonic: string, password: string) {
    return errorProxy<Wallet>((resolve: any, reject: any) => {
        this.userImpl.createWallet(
          mnemonic,
          password,
          new window.ZumoCoreModule.WalletCallbackWrapper({
          onError: (error: string) => {
            reject(new ZumoKitError(error));
          },
          onSuccess: (wallet: any) => {
            this.hasWallet = true;
            resolve(new Wallet(wallet));
          }
        }));
    });
  }

  /**
   * Recover user wallet with mnemonic seed phrase corresponding to user's wallet.
   * This can be used if user forgets his password or wants to change his wallet password.
   * @param  mnemonic       mnemonic seed phrase corresponding to user's wallet
   * @param  password       user provided password
   */
  recoverWallet(mnemonic: string, password: string) {
    return errorProxy<Wallet>((resolve: any, reject: any) => {
        this.userImpl.recoverWallet(
          mnemonic,
          password,
          new window.ZumoCoreModule.WalletCallbackWrapper({
          onError: function (error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess: function (wallet: any) {
            resolve(new Wallet(wallet));
          }
        }));
    });
  }

  /**
   * Unlock user wallet with user's password.
   * @param  password       user provided password
   */
  unlockWallet(password: string) {
    return errorProxy<Wallet>((resolve: any, reject: any) => {
        this.userImpl.unlockWallet(
          password,
          new window.ZumoCoreModule.WalletCallbackWrapper({
          onError: function (error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess: function (wallet: any) {
            resolve(new Wallet(wallet));
          }
        }));
    });
  }

  /**
   * Reveal mnemonic seed phrase used to seed user wallet.
   * @param  password       user provided password
   */
  revealMnemonic(password: string) {
    return errorProxy<string>((resolve: any, reject: any) => {
        this.userImpl.revealMnemonic(
          password,
          new window.ZumoCoreModule.MnemonicCallbackWrapper({
          onError: function (error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess: function (mnemonic: string) {
            resolve(mnemonic);
          }
        }));
    });
  }


  /**
   * Check if mnemonic seed phrase corresponds to user's wallet.
   * This is useful for validating seed phrase before trying to recover wallet.
   * @param  mnemonic       mnemonic seed phrase
   */
  isRecoveryMnemonic(mnemonic: string): boolean {
    try {
      return this.userImpl.isRecoveryMnemonic(mnemonic);
    } catch (exception) {
      throw new ZumoKitError(window.ZumoCoreModule.getException(exception));
    }
  }

  /**
   * Get account in specific currency, on specific network, with specific type.
   * @param  currencyCode   currency code, e.g. 'BTC', 'ETH' or 'GBP'
   * @param  network        network type, e.g. 'MAINNET', 'TESTNET' or 'RINKEBY'
   * @param  type           account type, e.g. 'STANDARD', 'COMPATIBILITY' or 'SEGWIT'
   */
  getAccount(currencyCode: CurrencyCode, network: Network, type: AccountType) {
    const account = this.userImpl.getAccount(currencyCode, network, type);
    if (account.hasValue())
      return new Account(JSON.parse(account.get()));
    else
      return null;
  }

  /**
   * Check if user is a fiat customer on 'MAINNET' or 'TESTNET' network.
   * @param  network 'MAINNET' or 'TESTNET'
   */
  isFiatCustomer(network: string): boolean {
    return this.userImpl.isFiatCustomer(network);
  }

  /**
   * Make user fiat customer on specified network by providing user's personal details.
   * @param  network        'MAINNET' or 'TESTNET'
   * @param  customerData    user's personal details.
   */
  makeFiatCustomer(network: Network, customerData: FiatCustomerData) {
    return errorProxy<void>((resolve: any, reject: any) => {
      let middleName = new window.ZumoCoreModule.OptionalString();
      if (customerData.middleName)
        middleName.set(customerData.middleName);

      let addressLine2 = new window.ZumoCoreModule.OptionalString();
      if (customerData.addressLine2)
        middleName.set(customerData.addressLine2);

      this.userImpl.makeFiatCustomer(
        network,
        customerData.firstName,
        middleName,
        customerData.lastName,
        customerData.dateOfBirth,
        customerData.email,
        customerData.phone,
        customerData.addressLine1,
        addressLine2,
        customerData.country,
        customerData.postCode,
        customerData.postTown,
        new window.ZumoCoreModule.SuccessCallbackWrapper({
          onError: function (error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess: function () {
            resolve();
          }
        })
      );
    });
  }

  /**
   * Create fiat account on specified network and currency code. User must already be fiat customer on specified network.
   * @param  network        'MAINNET' or 'TESTNET'
   * @param  currencyCode  country code in ISO 4217 format, e.g. 'GBP'
   */
  createFiatAccount(network: Network, currencyCode: CurrencyCode) {
    return errorProxy<Account>((resolve: any, reject: any) => {
      this.userImpl.createFiatAccount(
        network,
        currencyCode,
        new window.ZumoCoreModule.AccountCallbackWrapper({
          onError: function (error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess: function (account: string) {
            resolve(new Account(JSON.parse(account)));
          }
        })
      );
    });
  }

  /**
   * Get nominated account details for specified account if it exists.
   * Refer to
   * <a href="https://developers.zumo.money/docs/guides/send-transactions#bitcoin">Create Fiat Account</a>
   * for explanation about nominated account.
   * @param  accountId     {@link  Account Account} identifier
   */
  getNominatedAccountFiatProperties(accountId: string) {
    return errorProxy<AccountFiatProperties>((resolve: any, reject: any) => {
      this.userImpl.getNominatedAccountFiatProperties(
        accountId,
        new window.ZumoCoreModule.AccountFiatPropertiesCallbackWrapper({
          onError: function (error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess: function (accountFiatProperties: string) {
            resolve(new AccountFiatProperties(JSON.parse(accountFiatProperties)));
          }
        })
      );
    });
  }

  /**
   * Listen to all account data changes.
   *
   * @param listener interface to listen to user changes
   */
  addAccountDataListener(listener: (snapshots: Array<AccountDataSnapshot>) => void) {
    let listenerImpl = new window.ZumoCoreModule.AccountDataListenerWrapper({
      onDataChange: function (snapshots: string) {
        listener(
          JSON.parse(snapshots).map(
            (json: AccountDataSnapshotJSON) => new AccountDataSnapshot(json)
          )
        );
      }
    });

    this.userImpl.addAccountDataListener(listenerImpl);

    this.accountDataListeners.push(listener);
    this.accountDataListenersImpl.push(listenerImpl);
  }

  /**
   * Remove listener to state changes.
   *
   * @param listener interface to listen to state changes
   */
  removeAccountDataListener(listener: (snapshots: Array<AccountDataSnapshot>) => void) {
    let index;
    while ((index = this.accountDataListeners.indexOf(listener)) != -1) {
      this.accountDataListeners.splice(index, 1);
      this.userImpl.removeAccountDataListener(this.accountDataListenersImpl.splice(index, 1)[0]);
    }
  }
}