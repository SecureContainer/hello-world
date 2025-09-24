import { AxiosFunctions } from '../packages/axios-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of axios GET request
 */
export class AxiosExample {
  private axiosFunctions: AxiosFunctions;

  constructor() {
    this.axiosFunctions = new AxiosFunctions();
  }

  /**
   * Demonstrates simple GET request functionality
   */
  public async demonstrateGetRequest(): Promise<void> {
    logger.info('=== Axios Simple GET Request Example ===');
    
    try {
      // Simple GET request to a public API
      const result = await this.axiosFunctions.httpGet(
        'https://jsonplaceholder.typicode.com/posts/1'
      );

      logger.info({
        success: result.success,
        duration: result.duration
      }, 'GET Request completed');

      if (result.success) {
        logger.info({
          title: result.data?.title,
          userId: result.data?.userId
        }, 'Response data');
      }
    } catch (error) {
      logger.error({ error }, 'GET Request failed');
    }
  }

  /**
   * Run the axios example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Axios Example');
    await this.demonstrateGetRequest();
    logger.info('Completed Axios Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
