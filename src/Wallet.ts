import { Decimal } from 'decimal.js';
import { errorProxy } from './utility';
import { ZumoKitError } from './ZumoKitError';
import { ComposedTransaction, ComposedExchange } from './models';

/**
 * User wallet interface describes methods for transfer and exchange of fiat and cryptocurrency funds.
 * <p>
 * User wallet instance can be obtained by {@link User.createWallet creating}, {@link User.unlockWallet unlocking} or {@link User.recoverWallet recovering} user wallet.
 * <p>
 * Sending a transaction or making an exchange is a two step process. First a transaction or
 * exchange has to be composed via one of the compose methods, then {@link  ComposedTransaction ComposedTransaction} or
 * {@link  ComposedExchange ComposedExchange} can be submitted.
 */
export class Wallet {
  walletImpl: any;

  /** @internal */
  constructor(walletImpl: any) {
    this.walletImpl = walletImpl;
  }

  /**
   * Compose Ethereum transaction asynchronously.
   * Refer to <a href="https://developers.zumo.money/docs/guides/send-transactions#ethereum">Send Transactions</a>
   * guide for usage details.
   *
   * @param fromAccountId        {@link  Account Account} identifier
   * @param gasPrice             gas price in gwei
   * @param gasLimit             gas limit
   * @param destinationAddress   destination wallet address
   * @param amount               amount in ETH
   * @param data                 data in string format or null (defaults to null)
   * @param nonce                next transaction nonce or null (defaults to null)
   * @param sendMax              send maximum possible funds to destination (defaults to false)
   */
  composeEthTransaction(
    fromAccountId: string,
    gasPrice: Decimal,
    gasLimit: number,
    destinationAddress: string | null,
    amount: Decimal | null,
    data: string | null = null,
    nonce: number | null = null,
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

      const nonceOptional = new window.ZumoCoreModule.OptionalInteger();
      if (nonce) nonceOptional.set(nonce);

      this.walletImpl.composeEthTransaction(
        fromAccountId,
        new window.ZumoCoreModule.Decimal(gasPrice.toString()),
        gasLimit,
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

  /**
   * Compose BTC or BSV transaction asynchronously.
   * Refer to <a href="https://developers.zumo.money/docs/guides/send-transactions#bitcoin">Send Transactions</a>
   * guide for usage details.
   *
   * @param fromAccountId       {@link  Account Account} identifier
   * @param changeAccountId     change {@link  Account Account} identifier, which can be the same as fromAccountId
   * @param destinationAddress  destination wallet address
   * @param amount              amount in BTC or BSV
   * @param feeRate             fee rate in satoshis/byte
   * @param sendMax             send maximum possible funds to destination (defaults to false)
   */
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
}
