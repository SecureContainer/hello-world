import { JsonStringifySafeFunctions } from '../packages/json-stringify-safe-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of json-stringify-safe for safe JSON stringification
 */
export class JsonStringifySafeExample {
  private jsonFunctions: JsonStringifySafeFunctions;

  constructor() {
    this.jsonFunctions = new JsonStringifySafeFunctions();
  }

  /**
   * Demonstrates safe JSON stringification including circular references
   */
  public async demonstrateSafeStringify(): Promise<void> {
    logger.info('=== JSON Stringify Safe Example ===');
    
    try {
      // Test 1: Simple object
      const simpleObj = {
        name: 'John Doe',
        age: 30,
        city: 'New York',
        hobbies: ['reading', 'swimming', 'coding']
      };

      const simpleResult = await this.jsonFunctions.safeStringify(simpleObj, null, 2);

      logger.info({
        success: simpleResult.success,
        duration: simpleResult.duration
      }, 'Simple Object Stringification completed');

      if (simpleResult.success) {
        logger.info({
          objectType: 'simple',
          resultLength: (simpleResult.data as string).length
        }, 'Simple object stringified successfully');
      }

      // Test 2: Object with circular reference
      const circularObj: any = {
        name: 'Circular Object',
        value: 42
      };
      // Create circular reference
      circularObj.self = circularObj;
      circularObj.nested = {
        parent: circularObj,
        data: 'nested data'
      };

      const circularResult = await this.jsonFunctions.safeStringify(circularObj, null, 2);

      logger.info({
        success: circularResult.success,
        duration: circularResult.duration
      }, 'Circular Object Stringification completed');

      if (circularResult.success) {
        logger.info({
          objectType: 'circular',
          resultLength: (circularResult.data as string).length,
          hasCircularMarkers: (circularResult.data as string).includes('[Circular]')
        }, 'Circular object stringified safely');

        // Log a preview of the result (first 200 chars)
        const preview = (circularResult.data as string).substring(0, 200) + '...';
        logger.info({ preview }, 'Circular object JSON preview');
      }

      // Test 3: Object with undefined and function values
      const complexObj = {
        name: 'Complex Object',
        undefinedValue: undefined,
        nullValue: null,
        functionValue: function() { return 'test'; },
        date: new Date(),
        regex: /test/g
      };

      const complexResult = await this.jsonFunctions.safeStringify(complexObj, null, 2);

      if (complexResult.success) {
        logger.info({
          objectType: 'complex',
          resultLength: (complexResult.data as string).length
        }, 'Complex object stringified successfully');
      }

    } catch (error) {
      logger.error({ error }, 'Safe JSON Stringification failed');
    }
  }

  /**
   * Run the json-stringify-safe example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting JSON Stringify Safe Example');
    await this.demonstrateSafeStringify();
    logger.info('Completed JSON Stringify Safe Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
