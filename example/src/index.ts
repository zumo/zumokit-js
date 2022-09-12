import './style.css';
import {
  loadZumoKit,
  ZumoKit,
  ExchangeRate,
  ExchangeSetting,
  TransactionFeeRate,
  TokenSet,
} from 'zumokit';
import Decimal from 'decimal.js';

declare let process: {
  env: {
    API_KEY: string;
    API_URL: string;
    TRANSACTION_SERVICE_URL: string;
    CARD_SERVICE_URL: string;
    NOTIFICATION_SERVICE_URL: string;
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
    process.env.NOTIFICATION_SERVICE_URL
  );

  // add custom logger
  zumokit.onLog(console.log, 'debug');

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

    console.log(user.id);
    console.log(user.hasWallet);
    console.log(user.accounts);

    // use account data listener to retrieve accounts with corresponding transactions
    user.addAccountDataListener(console.log);

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

    console.log(custodyAccount);

    const composedTransaction = await user.composeTransaction(
      custodyAccount.id,
      'e12bf081-371f-4604-8cfc-da8d0b89f70d',
      new Decimal('0.01')
    );
    console.log(composedTransaction);

    const wallet = await user.unlockWallet(process.env.USER_WALLET_PASSWORD);

    // compose new ETH transaction
    const ethAccount = user.getAccount(
      'ETH',
      'RINKEBY',
      'STANDARD',
      'NON-CUSTODY'
    );
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
    );
    const ethAmount = new Decimal('0.1');

    const composedExchange = await user.composeExchange(
      ethAccount.id,
      btcAccount.id,
      ethAmount,
      false // sendMax
    );
    console.log(composedExchange);

    zumokit.signOut();
  } catch (error) {
    console.error(error);
  }
})();
