import { PgFunctions } from '../packages/pg-functions';
import { logger } from '../utils/logger';

export class PgExample {
  private pgFunctions: PgFunctions;

  constructor() {
    this.pgFunctions = new PgFunctions();
  }

  public async demonstratePostgreSQLOperations(): Promise<void> {
    logger.info('=== PostgreSQL Connection Test ===');

    try {
      const result = await this.pgFunctions.testPostgreSQLConnection();

      if (result.success) {
        logger.info(`Connection String: ${result.data?.connectionString}`);
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Connection Status: ${result.data?.connected ? '✅ Connected' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.serverInfo) {
          logger.info(`Server Version: ${result.data.serverInfo.version}`);
          logger.info(`Database: ${result.data.serverInfo.database}`);
          logger.info(`User: ${result.data.serverInfo.user}`);
        }
        
        if (!result.data?.connected && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`PostgreSQL test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during PostgreSQL test: ${(error as Error).message}`);
    }

    logger.info('=== PostgreSQL Test Complete ===\n');
  }

  public async demonstrateConnectionPool(): Promise<void> {
    logger.info('=== PostgreSQL Connection Pool Test ===');

    try {
      const result = await this.pgFunctions.testConnectionPool();

      if (result.success) {
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Pool Status: ${result.data?.poolWorking ? '✅ Working' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.poolInfo) {
          logger.info(`Total Clients: ${result.data.poolInfo.totalClients}`);
          logger.info(`Idle Clients: ${result.data.poolInfo.idleClients}`);
          logger.info(`Waiting Clients: ${result.data.poolInfo.waitingClients}`);
          logger.info(`Queries Executed: ${result.data.poolInfo.queriesExecuted}`);
        }
        
        if (!result.data?.poolWorking && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`PostgreSQL pool test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during PostgreSQL pool test: ${(error as Error).message}`);
    }

    logger.info('=== PostgreSQL Pool Test Complete ===\n');
  }

  public async runExample(): Promise<void> {
    logger.info('Starting PostgreSQL Example');
    await this.demonstratePostgreSQLOperations();
    await this.demonstrateConnectionPool();
    logger.info('Completed PostgreSQL Example');
  }
}
