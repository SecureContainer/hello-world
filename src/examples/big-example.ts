import { BigFunctions } from '../packages/big-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of big.js decimal arithmetic
 */
export class BigExample {
  private bigFunctions: BigFunctions;

  constructor() {
    this.bigFunctions = new BigFunctions();
  }

  /**
   * Demonstrates simple decimal arithmetic
   */
  public async demonstrateDecimalArithmetic(): Promise<void> {
    logger.info('=== Big.js Simple Decimal Arithmetic Example ===');
    
    try {
      // Demonstrate precise decimal addition
      const result = await this.bigFunctions.addDecimals('0.1', '0.2');

      logger.info({
        success: result.success,
        duration: result.duration
      }, 'Decimal Addition completed');

      if (result.success) {
        logger.info({
          firstNumber: '0.1',
          secondNumber: '0.2',
          preciseSum: result.data,
          jsSum: (0.1 + 0.2).toString() // Show the difference with regular JS arithmetic
        }, 'Decimal arithmetic result');
      }

      // Try with larger numbers
      const largeResult = await this.bigFunctions.addDecimals('999999999999999.99', '0.01');
      
      if (largeResult.success) {
        logger.info({
          firstNumber: '999999999999999.99',
          secondNumber: '0.01',
          preciseSum: largeResult.data
        }, 'Large number arithmetic result');
      }
    } catch (error) {
      logger.error({ error }, 'Decimal Arithmetic failed');
    }
  }

  /**
   * Run the big.js example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Big.js Example');
    await this.demonstrateDecimalArithmetic();
    logger.info('Completed Big.js Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
