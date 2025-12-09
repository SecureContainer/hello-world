import { AxiosExample } from './examples/axios-example';
import { UuidExample } from './examples/uuid-example';
import { LodashExample } from './examples/lodash-example';
import { MomentExample } from './examples/moment-example';
import { BigExample } from './examples/big-example';
import { DotenvExample } from './examples/dotenv-example';
import { JsonStringifySafeExample } from './examples/json-stringify-safe-example';
import { LruCacheExample } from './examples/lru-cache-example';
import { Utf8ValidateExample } from './examples/utf8-validate-example';
import { JsYamlExample } from './examples/js-yaml-example';
import { PinoExample } from './examples/pino-example';
import { BufferutilExample } from './examples/bufferutil-example';
import { NanExample } from './examples/nan-example';
import { NodeYamlConfigExample } from './examples/node-yaml-config-example';
import { WsExample } from './examples/ws-example';
import { PinoDebugExample } from './examples/pino-debug-example';
import { RedisExample } from './examples/redis-example';
import { MongoDBExample } from './examples/mongodb-example';
import { PgExample } from './examples/pg-example';
import { SlonikExample } from './examples/slonik-example';
import { SlonikInterceptorQueryLoggingExample } from './examples/slonik-interceptor-query-logging-example';
import { SlonikSqlTagRawExample } from './examples/slonik-sql-tag-raw-example';
import { logger } from './utils/logger';
import { BinancePriceFetcher } from './services/binance-price-fetcher';
import { DemoLogger } from './services/demo-logger';
import { mongoConnection } from './services/mongodb-connection';

/**
 * Demo script to showcase simple package functions
 */
async function runDemo(sessionPrefix?: string) {
  try {
    // Connect to MongoDB once (shared connection for all services)
    await mongoConnection.connect();

    // Initialize demo logger (uses shared connection)
    const demoLogger = new DemoLogger(sessionPrefix);
    await demoLogger.connect();
    await demoLogger.startSession(22);
    
    let successCount = 0;
    let failedCount = 0;
    
    logger.info('🚀 Starting PackageTest Demo - 22 Packages Complete');
    logger.info('📝 All package executions will be logged to MongoDB');
    logger.info('');
    // Run Axios example
    let result = await demoLogger.executeAndLog('axios', async () => {
      const axiosExample = new AxiosExample();
      await axiosExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run UUID example
    result = await demoLogger.executeAndLog('uuid', async () => {
      const uuidExample = new UuidExample();
      await uuidExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Lodash example
    result = await demoLogger.executeAndLog('lodash', async () => {
      const lodashExample = new LodashExample();
      await lodashExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Moment example
    result = await demoLogger.executeAndLog('moment', async () => {
      const momentExample = new MomentExample();
      await momentExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Big.js example
    result = await demoLogger.executeAndLog('big.js', async () => {
      const bigExample = new BigExample();
      await bigExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Dotenv example
    result = await demoLogger.executeAndLog('dotenv', async () => {
      const dotenvExample = new DotenvExample();
      await dotenvExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run JSON Stringify Safe example
    result = await demoLogger.executeAndLog('json-stringify-safe', async () => {
      const jsonExample = new JsonStringifySafeExample();
      await jsonExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run LRU Cache example
    result = await demoLogger.executeAndLog('lru-cache', async () => {
      const lruExample = new LruCacheExample();
      await lruExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run UTF-8 Validate example
    result = await demoLogger.executeAndLog('utf-8-validate', async () => {
      const utf8Example = new Utf8ValidateExample();
      await utf8Example.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run JS-YAML example
    result = await demoLogger.executeAndLog('js-yaml', async () => {
      const yamlExample = new JsYamlExample();
      await yamlExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Pino example
    result = await demoLogger.executeAndLog('pino', async () => {
      const pinoExample = new PinoExample();
      await pinoExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Bufferutil example
    result = await demoLogger.executeAndLog('bufferutil', async () => {
      const bufferutilExample = new BufferutilExample();
      await bufferutilExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Nan example
    result = await demoLogger.executeAndLog('nan', async () => {
      const nanExample = new NanExample();
      await nanExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Node-YAML-Config example
    result = await demoLogger.executeAndLog('node-yaml-config', async () => {
      const yamlConfigExample = new NodeYamlConfigExample();
      await yamlConfigExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run WS example
    result = await demoLogger.executeAndLog('ws', async () => {
      const wsExample = new WsExample();
      await wsExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;
    
    // Run Pino-Debug example
    result = await demoLogger.executeAndLog('pino-debug', async () => {
      const pinoDebugExample = new PinoDebugExample();
      await pinoDebugExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;

    // Run Redis example
    result = await demoLogger.executeAndLog('redis', async () => {
      const redisExample = new RedisExample();
      await redisExample.demonstrateRedisOperations();
    });
    if (result.success) successCount++; else failedCount++;

    // Run MongoDB example
    result = await demoLogger.executeAndLog('mongodb', async () => {
      const mongoDBExample = new MongoDBExample();
      await mongoDBExample.demonstrateMongoDBOperations();
    });
    if (result.success) successCount++; else failedCount++;

    // Run PostgreSQL example
    result = await demoLogger.executeAndLog('pg', async () => {
      const pgExample = new PgExample();
      await pgExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;

    // Run Slonik example
    result = await demoLogger.executeAndLog('slonik', async () => {
      const slonikExample = new SlonikExample();
      await slonikExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;

    // Run Slonik Interceptor Query Logging example
    result = await demoLogger.executeAndLog('slonik-interceptor-query-logging', async () => {
      const slonikInterceptorExample = new SlonikInterceptorQueryLoggingExample();
      await slonikInterceptorExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;

    // Run Slonik SQL Tag Raw example
    result = await demoLogger.executeAndLog('slonik-sql-tag-raw', async () => {
      const slonikRawExample = new SlonikSqlTagRawExample();
      await slonikRawExample.runExample();
    });
    if (result.success) successCount++; else failedCount++;

    // End demo session with statistics
    await demoLogger.endSession(successCount, failedCount, 0);
    
    logger.info('');
    logger.info('🎉 ALL 22 PACKAGES TESTED! 🎉');
    logger.info(`✅ Success: ${successCount} | ❌ Failed: ${failedCount}`);
    logger.info('✅ Demo completed - All logs stored in MongoDB');
    logger.info('');
    
    // Cleanup demo logger (doesn't close shared connection)
    await demoLogger.disconnect();
    
    // Start Binance Price Fetcher Service (uses same shared connection)
    logger.info('📊 Starting Binance BTC Price Fetcher Service...');
    const binancePriceFetcher = new BinancePriceFetcher();
    await binancePriceFetcher.start();
    
    // Note: MongoDB connection remains open for Binance service
    // It will be closed when the process exits
  } catch (error) {
    logger.error({ error }, '❌ Demo failed');
    await mongoConnection.disconnect();
    process.exit(1);
  }
}

// Export the runDemo function for use in other files
export { runDemo };

