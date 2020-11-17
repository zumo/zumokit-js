import { ExchangeSetting } from './ExchangeSetting';
import { CurrencyCode, Dictionary, ExchangeSettingJSON } from '../interfaces';

/**
 * Exchange settings are contained in a mapping between from currency,
 * to currency and exchange settings.
 */
export type ExchangeSettings = Dictionary<
  CurrencyCode,
  Dictionary<CurrencyCode, ExchangeSetting>
>;

/** @internal */
export const ExchangeSettings = (
  exchangeSettingsJSON: Record<string, Record<string, ExchangeSettingJSON>>
) => {
  const exchangeSettings: ExchangeSettings = {};
  Object.keys(exchangeSettingsJSON).forEach((depositCurrency) => {
    const innerMap: Dictionary<CurrencyCode, ExchangeSetting> = {};
    Object.keys(exchangeSettingsJSON[depositCurrency]).forEach(
      (withdrawCurrency) => {
        innerMap[withdrawCurrency as CurrencyCode] = new ExchangeSetting(
          exchangeSettingsJSON[depositCurrency][withdrawCurrency]
        );
      }
    );
    exchangeSettings[depositCurrency as CurrencyCode] = innerMap;
  });
  return exchangeSettings;
};
