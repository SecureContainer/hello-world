import { LruCacheFunctions } from '../packages/lru-cache-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of LRU cache operations
 */
export class LruCacheExample {
  private lruFunctions: LruCacheFunctions;

  constructor() {
    this.lruFunctions = new LruCacheFunctions();
  }

  /**
   * Demonstrates simple cache operations
   */
  public async demonstrateCaching(): Promise<void> {
    logger.info('=== LRU Cache Simple Operations Example ===');
    
    try {
      // Test 1: Cache a string value
      const stringResult = await this.lruFunctions.cacheValue('user:123', {
        name: 'John Doe',
        email: 'john@example.com',
        lastLogin: new Date().toISOString()
      });

      logger.info({
        success: stringResult.success,
        duration: stringResult.duration
      }, 'String Value Caching completed');

      if (stringResult.success) {
        logger.info({
          key: stringResult.data?.key,
          cacheHit: stringResult.data?.cacheHit,
          cacheSize: stringResult.data?.cacheStats?.size,
          maxSize: stringResult.data?.cacheStats?.max
        }, 'User object cached successfully');
      }

      // Test 2: Cache a number value
      const numberResult = await this.lruFunctions.cacheValue('counter', 42);

      if (numberResult.success) {
        logger.info({
          key: numberResult.data?.key,
          originalValue: numberResult.data?.originalValue,
          cachedValue: numberResult.data?.cachedValue,
          cacheSize: numberResult.data?.cacheStats?.size
        }, 'Number cached successfully');
      }

      // Test 3: Cache an array
      const arrayResult = await this.lruFunctions.cacheValue('shopping-list', [
        'milk', 'bread', 'eggs', 'cheese'
      ]);

      if (arrayResult.success) {
        logger.info({
          key: arrayResult.data?.key,
          arrayLength: arrayResult.data?.cachedValue?.length,
          cacheSize: arrayResult.data?.cacheStats?.size
        }, 'Array cached successfully');
      }

      // Test 4: Cache a complex object
      const complexResult = await this.lruFunctions.cacheValue('app-config', {
        theme: 'dark',
        language: 'en',
        features: {
          notifications: true,
          analytics: false,
          beta: true
        },
        lastUpdated: Date.now()
      });

      if (complexResult.success) {
        logger.info({
          key: complexResult.data?.key,
          configTheme: complexResult.data?.cachedValue?.theme,
          featuresCount: Object.keys(complexResult.data?.cachedValue?.features || {}).length,
          finalCacheSize: complexResult.data?.cacheStats?.size
        }, 'Complex configuration cached successfully');
      }

    } catch (error) {
      logger.error({ error }, 'LRU Cache operations failed');
    }
  }

  /**
   * Run the LRU cache example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting LRU Cache Example');
    await this.demonstrateCaching();
    logger.info('Completed LRU Cache Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
