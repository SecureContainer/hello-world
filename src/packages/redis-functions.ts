// Real Redis package import
import { createClient, RedisClientType } from 'redis';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

export class RedisFunctions {
  private readonly packageName = 'redis';
  private connectionUrl: string;

  constructor() {
    // Get Redis URL from environment variable, fallback to default
    this.connectionUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  }

  /**
   * Simple Redis connection test - checks if Redis package works and URL is correct
   */
  public async testRedisConnection(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testRedisConnection',
      packageName: this.packageName,
      parameters: { connectionUrl: this.connectionUrl },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      logger.info(`Testing Redis connection: ${this.connectionUrl}`);
      
      // Create Redis client
      const redisClient: RedisClientType = createClient({
        url: this.connectionUrl,
        socket: {
          connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000')
        }
      });

      let connected = false;
      let error: string | null = null;

      try {
        // Try to connect
        await redisClient.connect();
        
        // Simple ping test
        const pingResult = await redisClient.ping();
        connected = pingResult === 'PONG';
        
        // Close connection
        await redisClient.quit();
        
      } catch (connError) {
        error = (connError as Error).message;
        connected = false;
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          connectionUrl: this.connectionUrl,
          connected,
          error,
          message: connected 
            ? '✅ Redis package works and connection URL is correct!' 
            : `❌ Redis package installed but connection failed: ${error}. Check if Redis server is running and URL is correct.`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { connected, packageWorking: true });
      return result;

    } catch (error) {
      const result: PackageResponse = {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return result;
    }
  }
}