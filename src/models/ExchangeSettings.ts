import { ExchangeSetting } from './ExchangeSetting';
import { ExchangeSettings as IExchangeSettings } from '../interfaces';
import { ExchangeSettingJSON, CurrencyCode, Dictionary } from '../types';

export type ExchangeSettings = IExchangeSettings;

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
