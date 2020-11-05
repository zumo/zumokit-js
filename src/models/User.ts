import { errorProxy } from '../utility/errorProxy';
import { User as IUser } from '../interfaces';
import { Wallet } from './Wallet';
import { ZumoKitError } from './ZumoKitError';
import { Account } from './Account';
import { AccountFiatProperties } from './AccountFiatProperties';
import { AccountDataSnapshot } from './AccountDataSnapshot';
import {
  CurrencyCode,
  Network,
  AccountType,
  AccountJSON,
  AccountDataSnapshotJSON,
  FiatCustomerData,
} from '../types';

class User implements IUser {
  private userImpl: any;

  private accountDataListeners: Array<
    (state: Array<AccountDataSnapshot>) => void
  > = [];

  private accountDataListenersImpl: Array<any> = [];

  id: string;

  hasWallet: boolean;

  accounts: Array<Account>;

  constructor(userImpl: any) {
    this.userImpl = userImpl;
    this.id = userImpl.getId();
    this.hasWallet = userImpl.hasWallet();
    this.accounts = JSON.parse(userImpl.getAccounts()).map(
      (json: AccountJSON) => new Account(json)
    );

    this.addAccountDataListener((snapshots) => {
      this.accounts = snapshots.map((snapshot) => snapshot.account);
    });
  }

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
          },
        })
      );
    });
  }

  recoverWallet(mnemonic: string, password: string) {
    return errorProxy<Wallet>((resolve: any, reject: any) => {
      this.userImpl.recoverWallet(
        mnemonic,
        password,
        new window.ZumoCoreModule.WalletCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(wallet: any) {
            resolve(new Wallet(wallet));
          },
        })
      );
    });
  }

  unlockWallet(password: string) {
    return errorProxy<Wallet>((resolve: any, reject: any) => {
      this.userImpl.unlockWallet(
        password,
        new window.ZumoCoreModule.WalletCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(wallet: any) {
            resolve(new Wallet(wallet));
          },
        })
      );
    });
  }

  revealMnemonic(password: string) {
    return errorProxy<string>((resolve: any, reject: any) => {
      this.userImpl.revealMnemonic(
        password,
        new window.ZumoCoreModule.MnemonicCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(mnemonic: string) {
            resolve(mnemonic);
          },
        })
      );
    });
  }

  isRecoveryMnemonic(mnemonic: string): boolean {
    try {
      return this.userImpl.isRecoveryMnemonic(mnemonic);
    } catch (exception) {
      throw new ZumoKitError(window.ZumoCoreModule.getException(exception));
    }
  }

  getAccount(currencyCode: CurrencyCode, network: Network, type: AccountType) {
    const account = this.userImpl.getAccount(currencyCode, network, type);
    if (account.hasValue()) return new Account(JSON.parse(account.get()));
    return null;
  }

  isFiatCustomer(network: string): boolean {
    return this.userImpl.isFiatCustomer(network);
  }

  makeFiatCustomer(network: Network, customerData: FiatCustomerData) {
    return errorProxy<void>((resolve: any, reject: any) => {
      const middleName = new window.ZumoCoreModule.OptionalString();
      if (customerData.middleName) middleName.set(customerData.middleName);

      const addressLine2 = new window.ZumoCoreModule.OptionalString();
      if (customerData.addressLine2) middleName.set(customerData.addressLine2);

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
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess() {
            resolve();
          },
        })
      );
    });
  }

  createFiatAccount(network: Network, currencyCode: CurrencyCode) {
    return errorProxy<Account>((resolve: any, reject: any) => {
      this.userImpl.createFiatAccount(
        network,
        currencyCode,
        new window.ZumoCoreModule.AccountCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(account: string) {
            resolve(new Account(JSON.parse(account)));
          },
        })
      );
    });
  }

  getNominatedAccountFiatProperties(accountId: string) {
    return errorProxy<AccountFiatProperties>((resolve: any, reject: any) => {
      this.userImpl.getNominatedAccountFiatProperties(
        accountId,
        new window.ZumoCoreModule.AccountFiatPropertiesCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(accountFiatProperties: string) {
            resolve(
              new AccountFiatProperties(JSON.parse(accountFiatProperties))
            );
          },
        })
      );
    });
  }

  addAccountDataListener(
    listener: (snapshots: Array<AccountDataSnapshot>) => void
  ) {
    const listenerImpl = new window.ZumoCoreModule.AccountDataListenerWrapper({
      onDataChange(snapshots: string) {
        listener(
          JSON.parse(snapshots).map(
            (json: AccountDataSnapshotJSON) => new AccountDataSnapshot(json)
          )
        );
      },
    });

    this.userImpl.addAccountDataListener(listenerImpl);

    this.accountDataListeners.push(listener);
    this.accountDataListenersImpl.push(listenerImpl);
  }

  removeAccountDataListener(
    listener: (snapshots: Array<AccountDataSnapshot>) => void
  ) {
    let index;
    // eslint-disable-next-line no-cond-assign
    while ((index = this.accountDataListeners.indexOf(listener)) !== -1) {
      this.accountDataListeners.splice(index, 1);
      this.userImpl.removeAccountDataListener(
        this.accountDataListenersImpl.splice(index, 1)[0]
      );
    }
  }
}

export { User };
