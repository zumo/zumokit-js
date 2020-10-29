import './style.css';
import { loadZumoKit } from 'zumokit';
import { Decimal } from 'decimal.js';

(async () => {
  const zumokit = await loadZumoKit(
      process.env.API_KEY,
      process.env.API_URL,
      process.env.TX_SERVICE_URL
    );

  // log version
  console.log(zumokit.version);

  // get user token set from client API
  const clientUrl = process.env.CLIENT_ZUMOKIT_AUTH_ENDPOINT;
  const clientHeaders = process.env.CLIENT_HEADERS;

  console.log("Requesting " + clientUrl);
  const response = await fetch(clientUrl, {
    method: "POST",
    headers: clientHeaders
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    return;
  }

  const userTokenSet = await response.json();

  try {
    // use userTokenSet to retrieve ZumoKit user
    const user = await zumokit.authUser(userTokenSet);

    console.log(user.id);
    console.log(user.hasWallet);
    console.log(user.accounts);

    // use account data listener to retrieve accounts with corresponding transactions
    user.addAccountDataListener(console.log);

    const wallet = await user.unlockWallet("givemeeth");

    // compose new ETH transaction
    const ethAccount = user.getAccount("ETH", "RINKEBY", "STANDARD");
    console.log(ethAccount);

    const gasPrice = zumokit.transactionFeeRates.BTC.average;
    const gasLimit = new Decimal("21000");
    const destinationAddress = "0xDa57228C976ba133b46B26066bBac337e62D8357";
    const amount = new Decimal("0.01");
    const data = null;
    const nonce = null;

    const composedTransaction = await wallet.composeEthTransaction(
      ethAccount.id,
      gasPrice,
      gasLimit,
      destinationAddress,
      amount,
      data,
      nonce,
      false // sendMax
    );
    console.log(composedTransaction);

    // compose new exchange
    const btcAccount = user.getAccount("BTC", "TESTNET", "COMPATIBILITY");
    const exchangeRate = zumokit.exchangeRates.ETH.BTC;
    const exchangeSettings = zumokit.exchangeSettings.ETH.BTC;
    const ethAmount = new Decimal("0.1");

    const composedExchange = await wallet.composeExchange(
      ethAccount.id,
      btcAccount.id,
      exchangeRate,
      exchangeSettings,
      ethAmount,
      false // sendMax
    );
    console.log(composedExchange);

  } catch (error) {
    console.error(error);
  }
})();