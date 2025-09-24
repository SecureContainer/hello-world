import { UuidFunctions } from '../packages/uuid-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of UUID generation
 */
export class UuidExample {
  private uuidFunctions: UuidFunctions;

  constructor() {
    this.uuidFunctions = new UuidFunctions();
  }

  /**
   * Demonstrates simple UUID generation
   */
  public async demonstrateUuidGeneration(): Promise<void> {
    logger.info('=== UUID Simple Generation Example ===');
    
    try {
      // Generate a simple UUID
      const result = await this.uuidFunctions.generateUuid();

      logger.info({
        success: result.success,
        duration: result.duration
      }, 'UUID Generation completed');

      if (result.success) {
        logger.info({
          uuid: result.data,
          length: (result.data as string).length
        }, 'Generated UUID');
      }
    } catch (error) {
      logger.error({ error }, 'UUID Generation failed');
    }
  }

  /**
   * Run the UUID example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting UUID Example');
    await this.demonstrateUuidGeneration();
    logger.info('Completed UUID Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
