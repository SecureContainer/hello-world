import { LodashFunctions } from '../packages/lodash-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of lodash string capitalization
 */
export class LodashExample {
  private lodashFunctions: LodashFunctions;

  constructor() {
    this.lodashFunctions = new LodashFunctions();
  }

  /**
   * Demonstrates simple string capitalization
   */
  public async demonstrateCapitalize(): Promise<void> {
    logger.info('=== Lodash Simple Capitalize Example ===');
    
    try {
      // Capitalize a simple string
      const result = await this.lodashFunctions.capitalizeString('hello world from lodash');

      logger.info({
        success: result.success,
        duration: result.duration
      }, 'String Capitalization completed');

      if (result.success) {
        logger.info({
          original: 'hello world from lodash',
          capitalized: result.data
        }, 'Capitalization result');
      }
    } catch (error) {
      logger.error({ error }, 'String Capitalization failed');
    }
  }

  /**
   * Run the lodash example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Lodash Example');
    await this.demonstrateCapitalize();
    logger.info('Completed Lodash Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
