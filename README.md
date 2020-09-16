# ZumoKit Web SDK

ZumoKit is a state of the art wallet architecture underpinning our flagship product [Zumo](https://www.zumo.money/) that provides secure transfer and exchange of fiat and cryptocurrency funds.

## Docs

Refer to ZumoKit SDK developer [documentation](https://developers.zumo.money/docs/intro/) and [reference](https://zumo.github.io/zumokit-js/) for usage details.

## Installation

Include the ZumoKit.js script on each page of your site — it should always be loaded directly from https://js.stripe.com, rather than included in a bundle or hosted yourself.

Additionaly, ZumoKit.js is dependent on [decimal.js](https://github.com/MikeMcl/decimal.js/), which has to be added separately.

```html
<script src="https://js.zumokit.com/2.1.0/decimal.js"></script>
<script src="https://js.zumokit.com/2.1.0/zumokit.js"></script>
```

### Installing ZumoKit.js as a module

ZumoKit is available as a node module:

```
npm install zumo/zumokit-js
```

Additionaly, ZumoKit.js is dependent on [decimal.js](https://github.com/MikeMcl/decimal.js/), which has to be added separately.

```
npm install decimal.js@^10.2.0
```

## Usage

Replace API_KEY, API_ROOT and TX_SERVICE_URL below with credentials provided to you by your [account manager](mailto:support@zumo.money).

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>ZumoKit Example</title>
  <script>
    window.addEventListener('load', async (event) => {
      const API_KEY = 'c1bd328ae4476b36d006f4ee1f546a5cd29037378cd7dc9529fe565db91e1532';
      const API_ROOT = 'https://kit.sandbox.zumo.money';
      const TX_SERVICE_URL = 'https://tx.sandbox.zumo.money';

      const zumoKit = await loadZumoKit(API_KEY, API_ROOT, TX_SERVICE_URL);
      console.log(zumoKit.version)
    });
  </script>
</head>

<body>
  <p>Check console output!</p>
  <script src="https://js.zumokit.com/2.1.0/decimal.js"></script>
  <script src="https://js.zumokit.com/2.1.0/zumokit.js"></script>
</body>

</html>
```

### Using ZumoKit.js as a module

This function returns a Promise that resolves with a newly created ZumoKit object once ZumoKit.js has loaded.

```js
import {loadZumoKit} from 'zumokit-js';

const API_KEY = 'c1bd328ae4476b36d006f4ee1f546a5cd29037378cd7dc9529fe565db91e1532';
const API_ROOT = 'https://kit.sandbox.zumo.money';
const TX_SERVICE_URL = 'https://tx.sandbox.zumo.money';

const zumokit = await loadZumoKit(API_KEY, API_ROOT, TX_SERVICE_URL);
console.log(zumoKit.version)
```

## TypeScript support

This package includes TypeScript declarations for ZumoKit.js.

## Example

The [example project](https://github.com/zumo/zumokit-js/tree/master/example) demonstrates the expected user flow, including authentication process, wallet creation and transaciton submission.