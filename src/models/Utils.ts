import { ZumoKitError } from './ZumoKitError';
import { Network } from '../types';
import { Utils as IUtils } from '../interfaces';

declare global {
  interface Window {
    ZumoCoreModule: any;
  }
}

class Utils implements IUtils {
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
   * Validates Ethereum address.
   * @param address Ethereum address
   */
  isValidEthAddress(address: string): boolean {
    return this.utilsImpl.isValidEthAddress(address);
  }

  /**
   * Validates Bitcoin address on a given network.
   * @param address Bitcoin address
   * @param network network type, either 'MAINNET' or 'TESTNET'
   */
  isValidBtcAddress(address: string, network: Network): boolean {
    return this.utilsImpl.isValidBtcAddress(address, network);
  }
}

export { Utils };
