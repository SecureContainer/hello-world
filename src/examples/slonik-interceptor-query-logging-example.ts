import { SlonikInterceptorQueryLoggingFunctions } from '../packages/slonik-interceptor-query-logging-functions';
import { logger } from '../utils/logger';

export class SlonikInterceptorQueryLoggingExample {
  private slonikInterceptorFunctions: SlonikInterceptorQueryLoggingFunctions;

  constructor() {
    this.slonikInterceptorFunctions = new SlonikInterceptorQueryLoggingFunctions();
  }

  public async demonstrateQueryLoggingInterceptor(): Promise<void> {
    logger.info('=== Slonik Query Logging Interceptor Test ===');

    try {
      const result = await this.slonikInterceptorFunctions.testQueryLoggingInterceptor();

      if (result.success) {
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Interceptor Status: ${result.data?.interceptorWorking ? '✅ Working' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.queryResults) {
          const qr = result.data.queryResults;
          logger.info(`Test Query Result: ${JSON.stringify(qr.testQuery)}`);
          logger.info(`Parameter Query Result: ${JSON.stringify(qr.parameterQuery)}`);
          logger.info(`Schema Query Result: ${JSON.stringify(qr.schemaQuery)}`);
          logger.info(`Total Queries: ${qr.totalQueries}`);
          logger.info(`Interceptor Features: ${qr.interceptorFeatures.join(', ')}`);
        }
        
        if (!result.data?.interceptorWorking && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Slonik interceptor test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Slonik interceptor test: ${(error as Error).message}`);
    }

    logger.info('=== Slonik Query Logging Interceptor Test Complete ===\n');
  }

  public async demonstrateInterceptorConfiguration(): Promise<void> {
    logger.info('=== Slonik Interceptor Configuration Test ===');

    try {
      const result = await this.slonikInterceptorFunctions.testInterceptorConfiguration();

      if (result.success) {
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Configuration Status: ${result.data?.configurationWorking ? '✅ Working' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.configResults) {
          const cr = result.data.configResults;
          logger.info(`Simple Query: ${JSON.stringify(cr.simpleQuery)}`);
          logger.info(`Transaction Steps: ${JSON.stringify(cr.transactionSteps)}`);
          logger.info(`Execution Time: ${cr.executionTime}ms`);
          logger.info(`Interceptor Capabilities: ${cr.interceptorCapabilities.join(', ')}`);
          logger.info(`Logging Benefits: ${cr.loggingBenefits.join(', ')}`);
        }
        
        if (!result.data?.configurationWorking && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Slonik interceptor configuration test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Slonik interceptor configuration test: ${(error as Error).message}`);
    }

    logger.info('=== Slonik Interceptor Configuration Test Complete ===\n');
  }

  public async runExample(): Promise<void> {
    logger.info('Starting Slonik Interceptor Query Logging Example');
    await this.demonstrateQueryLoggingInterceptor();
    await this.demonstrateInterceptorConfiguration();
    logger.info('Completed Slonik Interceptor Query Logging Example');
  }
}
