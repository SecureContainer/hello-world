import { PinoFunctions } from '../packages/pino-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of pino structured logging
 */
export class PinoExample {
  private pinoFunctions: PinoFunctions;

  constructor() {
    this.pinoFunctions = new PinoFunctions();
  }

  /**
   * Demonstrates pino logging with different levels and structured data
   */
  public async demonstratePinoLogging(): Promise<void> {
    logger.info('=== Pino Simple Logging Example ===');

    try {
      // Test 1: Simple info log
      const infoResult = await this.pinoFunctions.createLogEntry(
        'info',
        'Application started successfully'
      );

      logger.info({
        success: infoResult.success,
        duration: infoResult.duration
      }, 'Info Log Entry completed');

      if (infoResult.success) {
        logger.info({
          level: infoResult.data?.level,
          messageLength: infoResult.data?.message?.length,
          hasTransport: infoResult.data?.hasTransport
        }, 'Info log created successfully');
      }

      // Test 2: Info log with structured data
      const userData = {
        userId: 12345,
        action: 'user_profile_update',
        ip: '192.168.1.100',
        timestamp: new Date().toISOString()
      };

      const structuredResult = await this.pinoFunctions.createLogEntry(
        'info',
        'User profile updated successfully',
        userData
      );

      if (structuredResult.success) {
        logger.info({
          level: structuredResult.data?.level,
          hasStructuredData: !!structuredResult.data?.structuredData,
          userId: structuredResult.data?.structuredData?.userId
        }, 'Structured info log created successfully');
      }

    } catch (error) {
      logger.error({ error }, 'Pino logging demonstration failed');
    }
  }

  /**
   * Run the pino example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Pino Example');
    await this.demonstratePinoLogging();
    logger.info('Completed Pino Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
