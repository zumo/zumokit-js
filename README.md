# ZumoKit Web SDK

![npm (tag)](https://img.shields.io/npm/v/zumokit/next)

ZumoKit is a state of the art wallet architecture underpinning our flagship product [Zumo](https://www.zumo.money/) that provides secure transfer and exchange of fiat and cryptocurrency funds.

## Docs

Refer to ZumoKit SDK developer [documentation](https://developers.zumo.money/docs) and [reference](https://zumo.github.io/zumokit-js/) for usage details.

## Installation

ZumoKit is distributed through NPM repository and it has a peer dependency on [decimal.js](https://github.com/MikeMcl/decimal.js/), which also has to be installed:

```
npm install node-fetch@^2.6.2 ws@^8.5.4 decimal.js@^10.2.0 zumokit
```

## Usage

Entry point to ZumoKit SDK is `loadZumoKit` function. This function returns a Promise that resolves with a newly created ZumoKit object once ZumoKit SDK has loaded. Behind the scenes, it will load ZumoKit WebAssembly module. ZumoKit requires node environment to work as expected and it will not work in in a browser environment.

Refer to ZumoKit SDK developer [documentation](https://developers.zumo.money/docs) and [reference](https://zumo.github.io/zumokit-js/) for usage details.

Replace API_KEY, API_URL, TRANSACTION_SERVICE_URL, CARD_SERVICE_URL, NOTIFICATION_SERVICE_URL, EXCHANGE_SERVICE_URL and CUSTODY_SERVICE_URL in the examples below with credentials provided to you by your [account manager](mailto:support@zumo.money).

```js
import { loadZumoKit } from 'zumokit';

const zumokit = await loadZumoKit(
  API_KEY,
  API_URL,
  TRANSACTION_SERVICE_URL,
  CARD_SERVICE_URL,
  NOTIFICATION_SERVICE_URL,
  EXCHANGE_SERVICE_URL,
  CUSTODY_SERVICE_URL
);

console.log(zumoKit.version);
```

## TypeScript support

This package exports TypeScript declarations for ZumoKit type aliases and interfaces via named exports. For example:

```typescript
import { CurrencyCode, AccountType, Network } from 'zumokit';
```

## Example

The [example project](https://github.com/zumo/zumokit-js/tree/master/example) demonstrates the expected user flow, including authentication process, wallet creation and transaction submission.
