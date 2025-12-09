import { PinoDebugFunctions } from '../packages/pino-debug-functions';
import { logger } from '../utils/logger';

export class PinoDebugExample {
  private pinoDebugFunctions: PinoDebugFunctions;

  constructor() {
    this.pinoDebugFunctions = new PinoDebugFunctions();
  }

  public async demonstrateDebugLogging(): Promise<void> {
    logger.info('=== Pino-Debug Simple Debug Logging Example ===');

    try {
      // Setup debug logging with a custom namespace
      const result = await this.pinoDebugFunctions.setupDebugLogging('packagetest');

      logger.info(
        { 
          success: result.success, 
          duration: result.duration 
        }, 
        'Debug logging setup completed'
      );

      if (result.success) {
        logger.info(
          {
            namespace: result.data?.namespace,
            debugEnabled: result.data?.debugEnabled,
            loggerName: result.data?.loggerName,
            debugEnvironment: result.data?.debugEnvironment
          },
          'Debug logging configured successfully'
        );

        logger.info(
          {
            messageCount: result.data?.demonstrationMessages?.length,
            sampleMessages: result.data?.demonstrationMessages?.slice(0, 3)
          },
          'Debug messages generated'
        );

        logger.info(
          {
            capabilities: result.data?.capabilities,
            useCase: 'Perfect for development debugging, troubleshooting, and detailed logging'
          },
          'Pino-Debug capabilities demonstrated'
        );
      }

    } catch (error) {
      logger.error({ error }, 'Debug logging demonstration failed');
    }
  }

  public async runExample(): Promise<void> {
    logger.info('Starting Pino-Debug Example');
    await this.demonstrateDebugLogging();
    logger.info('Completed Pino-Debug Example');
  }
}

// Allow running this example directly
// Note: Disabled for bundled builds to prevent auto-execution
