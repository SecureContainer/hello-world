import { SlonikSqlTagRawFunctions } from '../packages/slonik-sql-tag-raw-functions';
import { logger } from '../utils/logger';

export class SlonikSqlTagRawExample {
  private slonikRawFunctions: SlonikSqlTagRawFunctions;

  constructor() {
    this.slonikRawFunctions = new SlonikSqlTagRawFunctions();
  }

  public async demonstrateRawSqlTag(): Promise<void> {
    logger.info('=== Slonik Raw SQL Tag Test ===');

    try {
      const result = await this.slonikRawFunctions.testRawSqlTag();

      if (result.success) {
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Raw SQL Status: ${result.data?.rawSqlWorking ? '✅ Working' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.rawResults) {
          const rr = result.data.rawResults;
          logger.info(`Time Query Result: ${JSON.stringify(rr.timeQuery)}`);
          logger.info(`Count Query Result: ${JSON.stringify(rr.countQuery)}`);
          logger.info(`Info Query Result: ${JSON.stringify(rr.infoQuery)}`);
          logger.info(`Total Queries: ${rr.totalQueries}`);
          logger.info(`Raw SQL Features: ${rr.rawSqlFeatures.join(', ')}`);
          logger.info(`Use Cases: ${rr.useCases.join(', ')}`);
        }
        
        if (!result.data?.rawSqlWorking && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Slonik raw SQL test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Slonik raw SQL test: ${(error as Error).message}`);
    }

    logger.info('=== Slonik Raw SQL Tag Test Complete ===\n');
  }

  public async demonstrateAdvancedRawSql(): Promise<void> {
    logger.info('=== Slonik Advanced Raw SQL Test ===');

    try {
      const result = await this.slonikRawFunctions.testAdvancedRawSql();

      if (result.success) {
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Advanced Status: ${result.data?.advancedWorking ? '✅ Working' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.advancedResults) {
          const ar = result.data.advancedResults;
          logger.info(`Complex Query: ${JSON.stringify(ar.complexQuery)}`);
          logger.info(`Dynamic Order Sample: ${JSON.stringify(ar.dynamicOrder)}`);
          logger.info(`Computed Query: ${JSON.stringify(ar.computedQuery)}`);
          logger.info(`Execution Time: ${ar.executionTime}ms`);
          logger.info(`Advanced Features: ${ar.advancedFeatures.join(', ')}`);
          logger.info(`Safety Notes: ${ar.safetyNotes.join(', ')}`);
        }
        
        if (!result.data?.advancedWorking && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`Slonik advanced raw SQL test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during Slonik advanced raw SQL test: ${(error as Error).message}`);
    }

    logger.info('=== Slonik Advanced Raw SQL Test Complete ===\n');
  }

  public async runExample(): Promise<void> {
    logger.info('Starting Slonik SQL Tag Raw Example');
    await this.demonstrateRawSqlTag();
    await this.demonstrateAdvancedRawSql();
    logger.info('Completed Slonik SQL Tag Raw Example');
  }
}
