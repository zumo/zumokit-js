import { Decimal } from 'decimal.js';
import { Wallet as IWallet } from '../interfaces';
import { errorProxy } from '../utility/errorProxy';
import { ZumoKitError } from './ZumoKitError';
import { Transaction } from './Transaction';
import { ComposedTransaction } from './ComposedTransaction';
import { Exchange } from './Exchange';
import { ComposedExchange } from './ComposedExchange';
import { ExchangeRate } from './ExchangeRate';
import { ExchangeSetting } from './ExchangeSetting';

class Wallet implements IWallet {
  walletImpl: any;

  constructor(walletImpl: any) {
    this.walletImpl = walletImpl;
  }

  composeEthTransaction(
    fromAccountId: string,
    gasPrice: Decimal,
    gasLimit: Decimal,
    destinationAddress: string | null,
    amount: Decimal | null,
    data: string | null,
    nonce: number | null,
    sendMax = false
  ) {
    return errorProxy<ComposedTransaction>((resolve: any, reject: any) => {
      const destinationAddressOptional = new window.ZumoCoreModule.OptionalString();
      if (destinationAddress)
        destinationAddressOptional.set(destinationAddress);

      const amountOptional = new window.ZumoCoreModule.OptionalDecimal();
      if (amount)
        amountOptional.set(
          new window.ZumoCoreModule.Decimal(amount.toString())
        );

      const dataOptional = new window.ZumoCoreModule.OptionalString();
      if (data) dataOptional.set(data);

      const nonceOptional = new window.ZumoCoreModule.OptionalInt64();
      if (nonce) nonceOptional.set(nonce);

      this.walletImpl.composeEthTransaction(
        fromAccountId,
        new window.ZumoCoreModule.Decimal(gasPrice.toString()),
        new window.ZumoCoreModule.Decimal(gasLimit.toString()),
        destinationAddressOptional,
        amountOptional,
        dataOptional,
        nonceOptional,
        sendMax,
        new window.ZumoCoreModule.ComposeTransactionCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(composedTransaction: string) {
            resolve(new ComposedTransaction(JSON.parse(composedTransaction)));
          },
        })
      );
    });
  }

  composeTransaction(
    fromAccountId: string,
    changeAccountId: string,
    destinationAddress: string,
    amount: Decimal | null,
    feeRate: Decimal,
    sendMax = false
  ) {
    return errorProxy<ComposedTransaction>((resolve: any, reject: any) => {
      const amountOptional = new window.ZumoCoreModule.OptionalDecimal();
      if (amount)
        amountOptional.set(
          new window.ZumoCoreModule.Decimal(amount.toString())
        );

      this.walletImpl.composeTransaction(
        fromAccountId,
        changeAccountId,
        destinationAddress,
        amountOptional,
        new window.ZumoCoreModule.Decimal(feeRate.toString()),
        sendMax,
        new window.ZumoCoreModule.ComposeTransactionCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(composedTransaction: string) {
            resolve(new ComposedTransaction(JSON.parse(composedTransaction)));
          },
        })
      );
    });
  }

  composeInternalFiatTransaction(
    fromAccountId: string,
    toAccountId: string,
    amount: Decimal | null,
    sendMax = false
  ) {
    return errorProxy<ComposedTransaction>((resolve: any, reject: any) => {
      const amountOptional = new window.ZumoCoreModule.OptionalDecimal();
      if (amount)
        amountOptional.set(
          new window.ZumoCoreModule.Decimal(amount.toString())
        );

      this.walletImpl.composeInternalFiatTransaction(
        fromAccountId,
        toAccountId,
        amountOptional,
        sendMax,
        new window.ZumoCoreModule.ComposeTransactionCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(composedTransaction: string) {
            resolve(new ComposedTransaction(JSON.parse(composedTransaction)));
          },
        })
      );
    });
  }

  composeTransactionToNominatedAccount(
    fromAccountId: string,
    amount: Decimal | null,
    sendMax = false
  ) {
    return errorProxy<ComposedTransaction>((resolve: any, reject: any) => {
      const amountOptional = new window.ZumoCoreModule.OptionalDecimal();
      if (amount)
        amountOptional.set(
          new window.ZumoCoreModule.Decimal(amount.toString())
        );

      this.walletImpl.composeTransactionToNominatedAccount(
        fromAccountId,
        amountOptional,
        sendMax,
        new window.ZumoCoreModule.ComposeTransactionCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(composedTransaction: string) {
            resolve(new ComposedTransaction(JSON.parse(composedTransaction)));
          },
        })
      );
    });
  }

  submitTransaction(composedTransaction: ComposedTransaction) {
    return errorProxy<Transaction>((resolve: any, reject: any) => {
      this.walletImpl.submitTransaction(
        JSON.stringify(composedTransaction.json),
        new window.ZumoCoreModule.SubmitTransactionCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(transaction: string) {
            resolve(new Transaction(JSON.parse(transaction)));
          },
        })
      );
    });
  }

  composeExchange(
    fromAccountId: string,
    toAccountId: string,
    exchangeRate: ExchangeRate,
    exchangeSetting: ExchangeSetting,
    amount: Decimal | null,
    sendMax = false
  ) {
    return errorProxy<ComposedExchange>((resolve: any, reject: any) => {
      const amountOptional = new window.ZumoCoreModule.OptionalDecimal();
      if (amount)
        amountOptional.set(
          new window.ZumoCoreModule.Decimal(amount.toString())
        );

      this.walletImpl.composeExchange(
        fromAccountId,
        toAccountId,
        JSON.stringify(exchangeRate.json),
        JSON.stringify(exchangeSetting.json),
        amountOptional,
        sendMax,
        new window.ZumoCoreModule.ComposeExchangeCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(composedExchange: string) {
            resolve(new ComposedExchange(JSON.parse(composedExchange)));
          },
        })
      );
    });
  }

  submitExchange(composedExchange: ComposedExchange) {
    return errorProxy<Exchange>((resolve: any, reject: any) => {
      this.walletImpl.submitExchange(
        JSON.stringify(composedExchange.json),
        new window.ZumoCoreModule.SubmitExchangeCallbackWrapper({
          onError(error: string) {
            reject(new ZumoKitError(error));
          },
          onSuccess(exchange: string) {
            resolve(new Exchange(JSON.parse(exchange)));
          },
        })
      );
    });
  }
}

export { Wallet };
