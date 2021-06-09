# ZumoKit Web SDK

![npm (tag)](https://img.shields.io/npm/v/zumokit/next)

ZumoKit is a state of the art wallet architecture underpinning our flagship product [Zumo](https://www.zumo.money/) that provides secure transfer and exchange of fiat and cryptocurrency funds.

## Docs

Refer to ZumoKit SDK developer [documentation](https://developers.zumo.money/docs) and [reference](https://zumo.github.io/zumokit-js/) for usage details.

## Installation

### Standalone

Include the ZumoKit script on each page of your site — it should always be loaded directly from https://js.zumo.money, rather than included in a bundle or hosted yourself.

Additionally, ZumoKit is dependent on [decimal.js](https://github.com/MikeMcl/decimal.js/), which has to be added separately.

```html
<script src="https://js.zumo.money/3.0.0-beta.5/decimal.js"></script>
<script src="https://js.zumo.money/3.0.0-beta.5/zumokit.js"></script>
```

### ES6 Module

ZumoKit is distributed through NPM repository and it has a peer dependency on [decimal.js](https://github.com/MikeMcl/decimal.js/), which also has to be installed:

```
npm install decimal.js@^10.2.0 zumokit
```

## Usage

Entry point to ZumoKit SDK is `loadZumoKit` function. This function returns a Promise that resolves with a newly created ZumoKit object once ZumoKit SDK has loaded. Behind the scenes, it will load ZumoKit WebAssebly module for you by inserting the zumocore.js script tag. ZumoKit requires browser environment to work as expected and it will not work in in a server environment.

Refer to ZumoKit SDK developer [documentation](https://developers.zumo.money/docs) and [reference](https://zumo.github.io/zumokit-js/) for usage details.

Replace API_KEY, API_ROOT, TX_SERVICE_URL, CARD_SERVICE_URL and NOTIFICATION_SERVICE_URL in the examples below with credentials provided to you by your [account manager](mailto:support@zumo.money).

### HTML + JS

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>ZumoKit Example</title>
    <script>
      window.addEventListener("load", async (event) => {
        const zumokit = await loadZumoKit(
          API_KEY, 
          API_URL, 
          TRANSACTION_SERVICE_URL, 
          CARD_SERVICE_URL,
          NOTIFICATION_SERVICE_URL
        );

        console.log(zumokit.version);
      });
    </script>
  </head>

  <body>
    <p>Check console output!</p>
    <script src="https://js.zumo.money/3.0.0-beta.5/decimal.js"></script>
    <script src="https://js.zumo.money/3.0.0-beta.5/zumokit.js"></script>
  </body>
</html>
```

### ES6 Module

```js
import { loadZumoKit } from "zumokit";

const zumokit = await loadZumoKit(
  API_KEY, 
  API_URL, 
  TRANSACTION_SERVICE_URL, 
  CARD_SERVICE_URL,
  NOTIFICATION_SERVICE_URL
);

console.log(zumoKit.version);
```

## TypeScript support

This package exports TypeScript declarations for ZumoKit type aliases and interfaces via named exports. For example:

```typescript
import { CurrencyCode, AccountType, Network } from "zumokit";
```

## Example

The webpack [example project](https://github.com/zumo/zumokit-js/tree/master/example) demonstrates the expected user flow, including authentication process, wallet creation and transaction submission.
