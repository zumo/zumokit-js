import './style.css';
import {
  loadZumoKit,
  ZumoKit,
  ExchangeRate,
  ExchangeSetting,
  TransactionFeeRate,
} from 'zumokit';
import Decimal from 'decimal.js';

declare let process: {
  env: {
    API_KEY: string;
    API_URL: string;
    TRANSACTION_SERVICE_URL: string;
    CARD_SERVICE_URL: string;
    CLIENT_ZUMOKIT_AUTH_ENDPOINT: string;
    CLIENT_HEADERS: any;
    USER_WALLET_PASSWORD: string;
  };
};

(async () => {
  const zumokit: ZumoKit = await loadZumoKit(
    process.env.API_KEY,
    process.env.API_URL,
    process.env.TRANSACTION_SERVICE_URL,
    process.env.CARD_SERVICE_URL
  );

  // log version
  console.log(zumokit.version);

  // get user token set from client API
  const clientUrl = process.env.CLIENT_ZUMOKIT_AUTH_ENDPOINT;
  const clientHeaders = process.env.CLIENT_HEADERS;

  console.log(`Requesting ${clientUrl}`);
  const response = await fetch(clientUrl, {
    method: 'POST',
    headers: clientHeaders,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    return;
  }

  const userTokenSet = await response.json();

  try {
    // use userTokenSet to retrieve ZumoKit user
    const user = await zumokit.signIn(userTokenSet);

    console.log(user.id);
    console.log(user.hasWallet);
    console.log(user.accounts);

    // use account data listener to retrieve accounts with corresponding transactions
    user.addAccountDataListener(console.log);

    const wallet = await user.unlockWallet(process.env.USER_WALLET_PASSWORD);

    // compose new ETH transaction
    const ethAccount = user.getAccount('ETH', 'RINKEBY', 'STANDARD');
    console.log(ethAccount);

    const gasPrices = zumokit.transactionFeeRates.BTC as TransactionFeeRate;
    const gasLimit = 21000;
    const destinationAddress = '0xDa57228C976ba133b46B26066bBac337e62D8357';
    const amount = new Decimal('0.01');

    const composedTransaction = await wallet.composeEthTransaction(
      ethAccount.id,
      gasPrices.average,
      gasLimit,
      destinationAddress,
      amount
    );
    console.log(composedTransaction);

    // compose new exchange
    const btcAccount = user.getAccount('BTC', 'TESTNET', 'COMPATIBILITY');
    const exchangeRate = zumokit.getExchangeRate('ETH', 'BTC') as ExchangeRate;
    const exchangeSettings = zumokit.getExchangeSetting(
      'ETH',
      'BTC'
    ) as ExchangeSetting;
    const ethAmount = new Decimal('0.1');

    const composedExchange = await wallet.composeExchange(
      ethAccount.id,
      btcAccount.id,
      exchangeRate,
      exchangeSettings,
      ethAmount,
      false // sendMax
    );
    console.log(composedExchange);

    zumokit.signOut();
  } catch (error) {
    console.error(error);
  }
})();
