/**
 * Production-ready TypeScript Node.js project with package functions
 * Main entry point that exports all package functions and utilities
 */

// Export types and interfaces
export * from './types';

// Export logging utilities
export * from './utils/logger';

// Export package functions
export { AxiosFunctions } from './packages/axios-functions';
export { UuidFunctions } from './packages/uuid-functions';
export { LodashFunctions } from './packages/lodash-functions';
export { MomentFunctions } from './packages/moment-functions';
export { BigFunctions } from './packages/big-functions';
export { DotenvFunctions } from './packages/dotenv-functions';
export { JsonStringifySafeFunctions } from './packages/json-stringify-safe-functions';
export { LruCacheFunctions } from './packages/lru-cache-functions';
export { Utf8ValidateFunctions } from './packages/utf8-validate-functions';
export { JsYamlFunctions } from './packages/js-yaml-functions';
export { PinoFunctions } from './packages/pino-functions';
export { BufferutilFunctions } from './packages/bufferutil-functions';
export { NanFunctions } from './packages/nan-functions';
export { NodeYamlConfigFunctions } from './packages/node-yaml-config-functions';
export { WsFunctions } from './packages/ws-functions';
export { PinoDebugFunctions } from './packages/pino-debug-functions';
export { RedisFunctions } from './packages/redis-functions';
export { MongoDBFunctions } from './packages/mongodb-functions';
export { PgFunctions } from './packages/pg-functions';
export { SlonikFunctions } from './packages/slonik-functions';
export { SlonikInterceptorQueryLoggingFunctions } from './packages/slonik-interceptor-query-logging-functions';
export { SlonikSqlTagRawFunctions } from './packages/slonik-sql-tag-raw-functions';


// Export examples (for development and testing)
export { AxiosExample } from './examples/axios-example';
export { UuidExample } from './examples/uuid-example';
export { LodashExample } from './examples/lodash-example';
export { MomentExample } from './examples/moment-example';
export { BigExample } from './examples/big-example';
export { DotenvExample } from './examples/dotenv-example';
export { JsonStringifySafeExample } from './examples/json-stringify-safe-example';
export { LruCacheExample } from './examples/lru-cache-example';
export { Utf8ValidateExample } from './examples/utf8-validate-example';
export { JsYamlExample } from './examples/js-yaml-example';
export { PinoExample } from './examples/pino-example';
export { BufferutilExample } from './examples/bufferutil-example';
export { NanExample } from './examples/nan-example';
export { NodeYamlConfigExample } from './examples/node-yaml-config-example';
export { WsExample } from './examples/ws-example';
export { PinoDebugExample } from './examples/pino-debug-example';
export { RedisExample } from './examples/redis-example';
export { MongoDBExample } from './examples/mongodb-example';
export { PgExample } from './examples/pg-example';
export { SlonikExample } from './examples/slonik-example';
export { SlonikInterceptorQueryLoggingExample } from './examples/slonik-interceptor-query-logging-example';
export { SlonikSqlTagRawExample } from './examples/slonik-sql-tag-raw-example';


// Initialize and export logger for immediate use
import { logger } from './utils/logger';
export { logger };

/**
 * Main application entry point
 */
export class PackageTestApp {
  constructor() {
    logger.info('PackageTest Application initialized');
  }

  /**
   * Get application information
   */
  public getAppInfo() {
    return {
      name: 'PackageTest',
      version: '1.0.0',
      description: 'Simple TypeScript Node.js project with basic package functions',
      implementedPackages: ['axios', 'uuid', 'lodash', 'moment', 'big.js', 'dotenv', 'json-stringify-safe', 'lru-cache', 'utf-8-validate', 'js-yaml', 'pino', 'bufferutil', 'nan', 'node-yaml-config', 'ws', 'pino-debug', 'redis', 'mongodb', 'pg', 'slonik', 'slonik-interceptor-query-logging', 'slonik-sql-tag-raw'],
      remainingPackages: [],
      timestamp: new Date().toISOString()
    };
  }
}

// Export the app class for manual instantiation
// Note: No default instance created to avoid premature initialization

/**
 * Main execution block - runs demo when file is executed directly
 */
async function main() {
  try {
    // Create app instance only when main runs
    const app = new PackageTestApp();

    // Load environment variables
    require('dotenv').config({ path: 'demo.env' });

    // Get session prefix from command line argument (e.g., node dist/index.cjs TradingBot-12345)
    const sessionPrefix = process.argv[2];

    if (sessionPrefix) {
      logger.info(`🚀 Starting PackageTest Application Demo with session prefix: ${sessionPrefix}`);
    } else {
      logger.info('🚀 Starting PackageTest Application Demo');
    }
    logger.info('📦 Running all package demonstrations...');

    // Import and run the demo
    const { runDemo } = require('./demo');
    await runDemo(sessionPrefix);

  } catch (error) {
    logger.error({ error }, '❌ Application failed to start');
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
