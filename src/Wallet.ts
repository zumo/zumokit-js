import { Decimal } from 'decimal.js';
import { errorProxy } from './utility';
import { ZumoKitError } from './ZumoKitError';
import { ComposedTransaction } from './models';

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
  private zumoCoreModule: any;

  private walletImpl: any;

  /** @internal */
  constructor(zumoCoreModule: any, walletImpl: any) {
    this.zumoCoreModule = zumoCoreModule;
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
    return errorProxy<ComposedTransaction>(
      this.zumoCoreModule,
      (resolve: any, reject: any) => {
        const destinationAddressOptional = new this.zumoCoreModule.OptionalString();
        if (destinationAddress)
          destinationAddressOptional.set(destinationAddress);

        const amountOptional = new this.zumoCoreModule.OptionalDecimal();
        if (amount)
          amountOptional.set(
            new this.zumoCoreModule.Decimal(amount.toString())
          );

        const dataOptional = new this.zumoCoreModule.OptionalString();
        if (data) dataOptional.set(data);

        const nonceOptional = new this.zumoCoreModule.OptionalInteger();
        if (nonce) nonceOptional.set(nonce);

        this.walletImpl.composeEthTransaction(
          fromAccountId,
          new this.zumoCoreModule.Decimal(gasPrice.toString()),
          gasLimit,
          destinationAddressOptional,
          amountOptional,
          dataOptional,
          nonceOptional,
          sendMax,
          new this.zumoCoreModule.ComposeTransactionCallbackWrapper({
            onError(error: string) {
              reject(new ZumoKitError(error));
            },
            onSuccess(composedTransaction: string) {
              resolve(new ComposedTransaction(JSON.parse(composedTransaction)));
            },
          })
        );
      }
    );
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
    return errorProxy<ComposedTransaction>(
      this.zumoCoreModule,
      (resolve: any, reject: any) => {
        const amountOptional = new this.zumoCoreModule.OptionalDecimal();
        if (amount)
          amountOptional.set(
            new this.zumoCoreModule.Decimal(amount.toString())
          );

        this.walletImpl.composeTransaction(
          fromAccountId,
          changeAccountId,
          destinationAddress,
          amountOptional,
          new this.zumoCoreModule.Decimal(feeRate.toString()),
          sendMax,
          new this.zumoCoreModule.ComposeTransactionCallbackWrapper({
            onError(error: string) {
              reject(new ZumoKitError(error));
            },
            onSuccess(composedTransaction: string) {
              resolve(new ComposedTransaction(JSON.parse(composedTransaction)));
            },
          })
        );
      }
    );
  }
}
