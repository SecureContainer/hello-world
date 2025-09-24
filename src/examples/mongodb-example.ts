import { MongoDBFunctions } from '../packages/mongodb-functions';
import { logger } from '../utils/logger';

export class MongoDBExample {
  private mongoDBFunctions: MongoDBFunctions;

  constructor() {
    this.mongoDBFunctions = new MongoDBFunctions();
  }

  public async demonstrateMongoDBOperations(): Promise<void> {
    logger.info('=== MongoDB Connection Test ===');

    try {
      const result = await this.mongoDBFunctions.testMongoDBConnection();

      if (result.success) {
        logger.info(`Connection URI: ${result.data?.connectionUri}`);
        logger.info(`Database Name: ${result.data?.databaseName}`);
        logger.info(`Package Installed: ${result.data?.packageInstalled ? '✅' : '❌'}`);
        logger.info(`Connection Status: ${result.data?.connected ? '✅ Connected' : '❌ Failed'}`);
        logger.info(`Message: ${result.data?.message}`);
        
        if (result.data?.serverInfo) {
          logger.info(`Server Version: ${result.data.serverInfo.version}`);
          logger.info(`Server Platform: ${result.data.serverInfo.platform}`);
        }
        
        if (!result.data?.connected && result.data?.error) {
          logger.info(`Details: ${result.data.error}`);
        }
      } else {
        logger.error(`MongoDB test failed: ${result.error}`);
      }

    } catch (error) {
      logger.error(`Error during MongoDB test: ${(error as Error).message}`);
    }

    logger.info('=== MongoDB Test Complete ===\n');
  }
}
