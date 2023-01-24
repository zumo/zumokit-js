import {
  loadZumoKit,
  ZumoKit,
  TransactionFeeRate,
  TokenSet,
  Account,
} from 'zumokit';
import Decimal from 'decimal.js';

declare let process: {
  env: {
    API_KEY: string;
    API_URL: string;
    TRANSACTION_SERVICE_URL: string;
    CARD_SERVICE_URL: string;
    NOTIFICATION_SERVICE_URL: string;
    EXCHANGE_SERVICE_URL: string;
    CUSTODY_SERVICE_URL: string;
    USER_TOKEN: string;
    USER_WALLET_PASSWORD: string;
  };
};

(async () => {
  const zumokit: ZumoKit = await loadZumoKit(
    process.env.API_KEY,
    process.env.API_URL,
    process.env.TRANSACTION_SERVICE_URL,
    process.env.CARD_SERVICE_URL,
    process.env.NOTIFICATION_SERVICE_URL,
    process.env.EXCHANGE_SERVICE_URL,
    process.env.CUSTODY_SERVICE_URL
  );

  // add custom logger
  // zumokit.onLog(console.log, 'debug');

  // log version
  console.log(zumokit.version);

  // construct user token set
  const userTokenSet: TokenSet = {
    accessToken: process.env.USER_TOKEN,
    refreshToken: '',
    expiresIn: 86400,
  };

  try {
    // use user token set to retrieve ZumoKit user
    const user = await zumokit.signIn(userTokenSet);
    console.log(`Logged in with user with id ${user.id}`);

    // use account data listener to retrieve accounts with corresponding transactions
    user.addAccountDataListener((snapshots) =>
      console.log('Account data listener fired')
    );

    // compose new custody transaction
    let custodyAccount = user.getAccount(
      'ETH',
      'MAINNET',
      'STANDARD',
      'CUSTODY'
    );

    if (!custodyAccount) {
      custodyAccount = await user.createAccount('ETH');
    }
    console.log('Selected custody account:', custodyAccount);

    const composedTransaction = await user.composeTransaction(
      custodyAccount.id,
      'e12bf081-371f-4604-8cfc-da8d0b89f70d',
      new Decimal('0.01')
    );
    console.log(composedTransaction);

    // unlock wallet - required to compose crypto non-custodial transactions
    const wallet = await user.unlockWallet(process.env.USER_WALLET_PASSWORD);
    console.log('Wallet unlocked!');

    // compose new ETH transaction
    const ethAccount = user.getAccount(
      'ETH',
      'RINKEBY',
      'STANDARD',
      'NON-CUSTODY'
    ) as Account;
    console.log(ethAccount);

    const gasPrices = zumokit.transactionFeeRates.BTC as TransactionFeeRate;
    const gasLimit = 21000;
    const destinationAddress = '0xDa57228C976ba133b46B26066bBac337e62D8357';
    const amount = new Decimal('0.01');

    const composedEthTransaction = await wallet.composeEthTransaction(
      ethAccount.id,
      gasPrices.average,
      gasLimit,
      destinationAddress,
      amount
    );
    console.log(composedEthTransaction);

    // compose new exchange
    const btcAccount = user.getAccount(
      'BTC',
      'TESTNET',
      'COMPATIBILITY',
      'NON-CUSTODY'
    ) as Account;
    const ethAmount = new Decimal('0.1');
    const composedExchange = await user.composeExchange(
      ethAccount.id,
      btcAccount.id,
      ethAmount,
      false // sendMax
    );

    console.log(composedExchange);
  } catch (error) {
    console.error(error);
  }
})();
