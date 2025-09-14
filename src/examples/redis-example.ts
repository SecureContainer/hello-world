import { RedisFunctions } from '../packages/redis-functions';
import { logger } from '../utils/logger';

export class RedisExample {
  private redisFunctions: RedisFunctions;

  constructor() {
    this.redisFunctions = new RedisFunctions();
  }

  public async demonstrateRedisOperations(): Promise<void> {
    logger.info('=== Redis Connection Test ===');

    try {
      const result = await this.redisFunctions.testRedisConnection();

      if (result.success) {
        logger.info(`Connection URL: ${result.data?.connectionUrl}`);
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Connection Status: ${result.data?.connected ? '✅ Connected' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (!result.data?.connected && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Redis test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Redis test: ${(error as Error).message}`);
    }

    logger.info('=== Redis Test Complete ===\n');
  }
}