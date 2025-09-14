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

/**
 * Demo script to showcase simple package functions
 */
async function runDemo() {
  logger.info('🚀 Starting PackageTest Demo - 22 Packages Complete: Axios, UUID, Lodash, Moment, Big.js, Dotenv, JSON-Stringify-Safe, LRU-Cache, UTF-8-Validate, JS-YAML, Pino, Bufferutil, Nan, Node-YAML-Config, WS, Pino-Debug, Redis, MongoDB, PostgreSQL, Slonik, Slonik-Interceptor-Query-Logging & Slonik-SQL-Tag-Raw');
  
  try {
    // Run Axios example
    const axiosExample = new AxiosExample();
    await axiosExample.runExample();
    
    // Run UUID example
    const uuidExample = new UuidExample();
    await uuidExample.runExample();
    
    // Run Lodash example
    const lodashExample = new LodashExample();
    await lodashExample.runExample();
    
    // Run Moment example
    const momentExample = new MomentExample();
    await momentExample.runExample();
    
    // Run Big.js example
    const bigExample = new BigExample();
    await bigExample.runExample();
    
    // Run Dotenv example
    const dotenvExample = new DotenvExample();
    await dotenvExample.runExample();
    
    // Run JSON Stringify Safe example
    const jsonExample = new JsonStringifySafeExample();
    await jsonExample.runExample();
    
    // Run LRU Cache example
    const lruExample = new LruCacheExample();
    await lruExample.runExample();
    
    // Run UTF-8 Validate example
    const utf8Example = new Utf8ValidateExample();
    await utf8Example.runExample();
    
    // Run JS-YAML example
    const yamlExample = new JsYamlExample();
    await yamlExample.runExample();
    
    // Run Pino example
    const pinoExample = new PinoExample();
    await pinoExample.runExample();
    
    // Run Bufferutil example
    const bufferutilExample = new BufferutilExample();
    await bufferutilExample.runExample();
    
    // Run Nan example
    const nanExample = new NanExample();
    await nanExample.runExample();
    
    // Run Node-YAML-Config example
    const yamlConfigExample = new NodeYamlConfigExample();
    await yamlConfigExample.runExample();
    
    // Run WS example
    const wsExample = new WsExample();
    await wsExample.runExample();
    
    // Run Pino-Debug example
    const pinoDebugExample = new PinoDebugExample();
    await pinoDebugExample.runExample();

    // Run Redis example
    const redisExample = new RedisExample();
    await redisExample.demonstrateRedisOperations();

    // Run MongoDB example
    const mongoDBExample = new MongoDBExample();
    await mongoDBExample.demonstrateMongoDBOperations();

    // Run PostgreSQL example
    const pgExample = new PgExample();
    await pgExample.runExample();

    // Run Slonik example
    const slonikExample = new SlonikExample();
    await slonikExample.runExample();

    // Run Slonik Interceptor Query Logging example
    const slonikInterceptorExample = new SlonikInterceptorQueryLoggingExample();
    await slonikInterceptorExample.runExample();

    // Run Slonik SQL Tag Raw example
    const slonikRawExample = new SlonikSqlTagRawExample();
    await slonikRawExample.runExample();


    logger.info('🎉 ALL 22 PACKAGES IMPLEMENTED SUCCESSFULLY! 🎉');
    logger.info('✅ Demo completed successfully - Production-ready TypeScript Node.js project with comprehensive package integration');
  } catch (error) {
    logger.error({ error }, '❌ Demo failed');
    process.exit(1);
  }
}

// Export the runDemo function for use in other files
export { runDemo };
