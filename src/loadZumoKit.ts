import { getZumoCore } from './utility/getZumoCore';
import { ZumoKit } from './ZumoKit';

/**
 * Entry point to ZumoKit Web SDK.
 * <p>
 * This function returns a Promise that resolves with a newly created ZumoKit object
 * once ZumoKit SDK has loaded. Behind the scenes, it will load ZumoKit WebAssembly
 * module. ZumoKit requires node environment to work as expected and it will not work
 * in a browser environment.
 *
 * @param apiKey                 ZumoKit API Key
 * @param apiUrl                 ZumoKit API URL
 * @param transactionServiceUrl  ZumoKit Transaction Service URL
 * @param cardServiceUrl         ZumoKit Card Service URL
 * @param notificationServiceUrl ZumoKit Notification Service URL
 * @param exchangeServiceUrl     ZumoKit Exchange Service URL
 * @param custodyServiceUrl      ZumoKit Custody Service URL
 *
 * @return ZumoKit instance
 * */
export const loadZumoKit = async (
  apiKey: string,
  apiUrl: string,
  transactionServiceUrl: string,
  cardServiceUrl: string,
  notificationServiceUrl: string,
  exchangeServiceUrl: string,
  custodyServiceUrl: string
) => {
  const zumoCoreModule = await getZumoCore();
  return new ZumoKit(
    zumoCoreModule,
    apiKey,
    apiUrl,
    transactionServiceUrl,
    cardServiceUrl,
    notificationServiceUrl,
    exchangeServiceUrl,
    custodyServiceUrl
  );
};
