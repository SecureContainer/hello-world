import { DotenvFunctions } from '../packages/dotenv-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of dotenv environment variable loading
 */
export class DotenvExample {
  private dotenvFunctions: DotenvFunctions;

  constructor() {
    this.dotenvFunctions = new DotenvFunctions();
  }

  /**
   * Demonstrates simple environment variable loading and secret reading
   */
  public async demonstrateEnvLoading(): Promise<void> {
    logger.info('=== Dotenv Simple Environment Loading Example ===');
    
    try {
      // Load environment variables and read a secret key
      const result = await this.dotenvFunctions.loadAndReadSecret();

      logger.info({
        success: result.success,
        duration: result.duration
      }, 'Environment Loading completed');

      if (result.success) {
        logger.info({
          secretKeyName: result.data?.secretKeyName,
          secretValue: result.data?.secretValue,
          envPath: result.data?.envPath,
          totalEnvVars: result.data?.totalEnvVars
        }, 'Secret key successfully loaded');

        // Also try reading other secret keys
        const jwtResult = await this.dotenvFunctions.loadAndReadSecret('demo.env', 'JWT_SECRET');
        
        if (jwtResult.success) {
          logger.info({
            secretKeyName: jwtResult.data?.secretKeyName,
            secretValue: jwtResult.data?.secretValue
          }, 'JWT secret successfully loaded');
        }

        // Try reading database password
        const dbResult = await this.dotenvFunctions.loadAndReadSecret('demo.env', 'DATABASE_PASSWORD');
        
        if (dbResult.success) {
          logger.info({
            secretKeyName: dbResult.data?.secretKeyName,
            secretValue: dbResult.data?.secretValue
          }, 'Database password successfully loaded');
        }
      }
    } catch (error) {
      logger.error({ error }, 'Environment Loading failed');
    }
  }

  /**
   * Run the dotenv example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Dotenv Example');
    await this.demonstrateEnvLoading();
    logger.info('Completed Dotenv Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
