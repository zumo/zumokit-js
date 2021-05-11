import { ZumoKitError } from './ZumoKitError';
import { CurrencyCode, Network } from './interfaces';

declare global {
  interface Window {
    ZumoCoreModule: any;
  }
}

/**
 * Crypto utility interface describes methods for mnemonic phrase generation and
 * Bitcoin/Ethereum address validation.
 */
export class Utils {
  /** @internal */
  utilsImpl: any;

  /** @internal */
  constructor(utilsImpl: any) {
    this.utilsImpl = utilsImpl;
  }

  /**
   * Generates mnemonic seed phrase used in wallet creation process.
   * @param wordCount   12, 15, 18, 21 or 24
   */
  generateMnemonic(wordCount: number): string {
    try {
      return this.utilsImpl.generateMnemonic(wordCount);
    } catch (exception) {
      throw new ZumoKitError(window.ZumoCoreModule.getException(exception));
    }
  }

  /**
   * Validates Ethereum, Bitcoin or Bitcoin SV address.
   * @param currencyCode 'ETH', 'BTC or 'BSV'
   * @param address      blockchain address
   * @param network      network type
   */
  isValidAddress(currencyCode: CurrencyCode, address: string, network: Network): boolean {
    return this.utilsImpl.isValidAddress(currencyCode, address, network);
  }
}
