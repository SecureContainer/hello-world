import { MomentFunctions } from '../packages/moment-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of moment date formatting
 */
export class MomentExample {
  private momentFunctions: MomentFunctions;

  constructor() {
    this.momentFunctions = new MomentFunctions();
  }

  /**
   * Demonstrates simple date formatting
   */
  public async demonstrateDateFormatting(): Promise<void> {
    logger.info('=== Moment Simple Date Formatting Example ===');
    
    try {
      // Format current date with default format
      const result = await this.momentFunctions.formatCurrentDate();

      logger.info({
        success: result.success,
        duration: result.duration
      }, 'Date Formatting completed');

      if (result.success) {
        logger.info({
          format: 'YYYY-MM-DD HH:mm:ss',
          formattedDate: result.data
        }, 'Formatted date result');
      }

      // Also try a different format
      const customResult = await this.momentFunctions.formatCurrentDate('MMMM Do YYYY, h:mm:ss a');
      
      if (customResult.success) {
        logger.info({
          format: 'MMMM Do YYYY, h:mm:ss a',
          formattedDate: customResult.data
        }, 'Custom formatted date result');
      }
    } catch (error) {
      logger.error({ error }, 'Date Formatting failed');
    }
  }

  /**
   * Run the moment example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Moment Example');
    await this.demonstrateDateFormatting();
    logger.info('Completed Moment Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
