import { NanFunctions } from '../packages/nan-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of nan (Native Abstractions for Node.js)
 */
export class NanExample {
  private nanFunctions: NanFunctions;

  constructor() {
    this.nanFunctions = new NanFunctions();
  }

  /**
   * Demonstrates nan utilities and type analysis
   */
  public async demonstrateNanUtilities(): Promise<void> {
    logger.info('=== Nan Simple Native Abstractions Example ===');

    try {
      // Test 1: Get nan environment information
      const nanInfoResult = await this.nanFunctions.getNanInfo();

      logger.info({
        success: nanInfoResult.success,
        duration: nanInfoResult.duration
      }, 'Nan Info Retrieval completed');

      if (nanInfoResult.success) {
        logger.info({
          nodeVersion: nanInfoResult.data?.environment?.nodeVersion,
          platform: nanInfoResult.data?.environment?.platform,
          architecture: nanInfoResult.data?.environment?.architecture,
          v8Version: nanInfoResult.data?.environment?.v8Version
        }, 'Node.js environment information retrieved');

        logger.info({
          newFunctionAvailable: nanInfoResult.data?.nanInfo?.hasNewFunction,
          utf8StringAvailable: nanInfoResult.data?.nanInfo?.hasUtf8StringFunction,
          callbackAvailable: nanInfoResult.data?.nanInfo?.hasCallbackFunction,
          asyncWorkerAvailable: nanInfoResult.data?.nanInfo?.hasAsyncWorkerFunction
        }, 'Nan utilities availability checked');
      }

      // Test 2: Analyze different types of values
      const testValues = [
        42,
        'Hello Nan!',
        true,
        null,
        undefined,
        [1, 2, 3],
        { name: 'test', value: 123 },
        new Date(),
        /test-regex/g
      ];

      for (const [index, testValue] of testValues.entries()) {
        const analysisResult = await this.nanFunctions.analyzeValue(testValue);

        if (analysisResult.success) {
          logger.info({
            testIndex: index + 1,
            originalValue: analysisResult.data?.originalValue,
            basicType: analysisResult.data?.analysis?.basicType,
            isNumber: analysisResult.data?.analysis?.isNumber,
            isString: analysisResult.data?.analysis?.isString,
            isObject: analysisResult.data?.analysis?.isObject,
            isArray: analysisResult.data?.analysis?.isArray,
            stringRepresentation: analysisResult.data?.analysis?.toString
          }, `Value analysis ${index + 1} completed`);
        }
      }

      // Test 3: Analyze complex object
      const complexObject = {
        id: 1001,
        name: 'Complex Test Object',
        metadata: {
          created: new Date(),
          tags: ['nan', 'nodejs', 'native'],
          active: true
        },
        calculate: function(x: number) { return x * 2; }
      };

      const complexResult = await this.nanFunctions.analyzeValue(complexObject);

      if (complexResult.success) {
        logger.info({
          objectType: complexResult.data?.analysis?.basicType,
          isObject: complexResult.data?.analysis?.isObject,
          objectKeys: complexResult.data?.analysis?.objectKeys,
          hasFunction: typeof complexObject.calculate === 'function'
        }, 'Complex object analysis completed');
      }

    } catch (error) {
      logger.error({ error }, 'Nan demonstration failed');
    }
  }

  /**
   * Run the nan example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Nan Example');
    await this.demonstrateNanUtilities();
    logger.info('Completed Nan Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
