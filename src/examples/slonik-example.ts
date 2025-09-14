import { SlonikFunctions } from '../packages/slonik-functions';
import { logger } from '../utils/logger';

export class SlonikExample {
  private slonikFunctions: SlonikFunctions;

  constructor() {
    this.slonikFunctions = new SlonikFunctions();
  }

  public async demonstrateSlonikConnection(): Promise<void> {
    logger.info('=== Slonik Connection Test ===');

    try {
      const result = await this.slonikFunctions.testSlonikConnection();

      if (result.success) {
        logger.info(`Connection String: ${result.data?.connectionString}`);
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Connection Status: ${result.data?.connected ? '✅ Connected' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.serverInfo) {
          logger.info(`Server Version: ${result.data.serverInfo.version}`);
          logger.info(`Database: ${result.data.serverInfo.database}`);
          logger.info(`User: ${result.data.serverInfo.user}`);
          logger.info(`Timestamp: ${result.data.serverInfo.timestamp}`);
          logger.info(`Row Count: ${result.data.serverInfo.rowCount}`);
        }
        
        if (!result.data?.connected && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Slonik test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Slonik test: ${(error as Error).message}`);
    }

    logger.info('=== Slonik Connection Test Complete ===\n');
  }

  public async demonstrateTypedQueries(): Promise<void> {
    logger.info('=== Slonik Typed Queries Test ===');

    try {
      const result = await this.slonikFunctions.testSlonikTypedQueries();

      if (result.success) {
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Queries Status: ${result.data?.queriesWorking ? '✅ Working' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.queryResults) {
          const qr = result.data.queryResults;
          logger.info(`Calculation Result: ${JSON.stringify(qr.calculation)}`);
          logger.info(`Greeting Result: ${JSON.stringify(qr.greeting)}`);
          logger.info(`Current Time: ${JSON.stringify(qr.currentTime)}`);
          logger.info(`Transaction Result: ${JSON.stringify(qr.transaction)}`);
          logger.info(`Total Queries: ${qr.totalQueries}`);
          logger.info(`Features: ${qr.features.join(', ')}`);
        }
        
        if (!result.data?.queriesWorking && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Slonik typed queries test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Slonik typed queries test: ${(error as Error).message}`);
    }

    logger.info('=== Slonik Typed Queries Test Complete ===\n');
  }

  public async demonstrateSafetyFeatures(): Promise<void> {
    logger.info('=== Slonik Safety Features Test ===');

    try {
      const result = await this.slonikFunctions.testSlonikSafetyFeatures();

      if (result.success) {
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Safety Status: ${result.data?.safetyWorking ? '✅ Working' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.safetyResults) {
          const sr = result.data.safetyResults;
          logger.info(`SQL Injection Test: ${JSON.stringify(sr.sqlInjectionPrevented)}`);
          logger.info(`Query Validation: ${JSON.stringify(sr.queryValidation)}`);
          logger.info(`Safety Features: ${sr.safetyFeatures.join(', ')}`);
          logger.info(`Note: ${sr.demonstrationNote}`);
        }
        
        if (!result.data?.safetyWorking && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Slonik safety features test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Slonik safety features test: ${(error as Error).message}`);
    }

    logger.info('=== Slonik Safety Features Test Complete ===\n');
  }

  public async runExample(): Promise<void> {
    logger.info('Starting Slonik Example');
    await this.demonstrateSlonikConnection();
    await this.demonstrateTypedQueries();
    await this.demonstrateSafetyFeatures();
    logger.info('Completed Slonik Example');
  }
}
