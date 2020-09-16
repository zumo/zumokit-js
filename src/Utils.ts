import ZumoKitError from './ZumoKitError';
import { Network } from './types';
import Decimal from 'decimal.js';

declare global {
  interface Window { ZumoCoreModule: any; }
}

/**
 * Crypto utility class provides mnemonic phrase generation utility, Bitcoin & Ethereum
 * address validation utilities and Ethereum unit conversion methods.
 */
export default class Utils {
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