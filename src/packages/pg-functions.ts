// Real PostgreSQL package import
import { Client, Pool } from 'pg';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

export class PgFunctions {
  private readonly packageName = 'pg';
  private connectionString: string;

  constructor() {
    // Get PostgreSQL connection string from environment variable, fallback to default
    this.connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres';
  }

  /**
   * Simple PostgreSQL connection test - checks if pg package works and connection string is correct
   */
  public async testPostgreSQLConnection(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testPostgreSQLConnection',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@') // Hide credentials in logs
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      logger.info(`Testing PostgreSQL connection: ${this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')}`);
      
      // Create PostgreSQL client
      const client = new Client({
        connectionString: this.connectionString,
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        query_timeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
      });

      let connected = false;
      let error: string | null = null;
      let serverInfo: any = null;

      try {
        // Try to connect
        await client.connect();
        
        // Simple query test to verify connection
        const result = await client.query('SELECT version(), current_database(), current_user');
        
        if (result.rows && result.rows.length > 0) {
          connected = true;
          
          // Extract server information
          const row = result.rows[0];
          serverInfo = {
            version: row.version ? row.version.split(' ')[0] + ' ' + row.version.split(' ')[1] : 'Unknown',
            database: row.current_database,
            user: row.current_user
          };
        }
        
        // Close connection
        await client.end();
        
      } catch (connError) {
        error = (connError as Error).message;
        connected = false;
        
        // Try to close connection even if there was an error
        try {
          await client.end();
        } catch (closeError) {
          // Ignore close errors
        }
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@'), // Hide credentials
          connected,
          error,
          serverInfo,
          message: connected 
            ? `✅ PostgreSQL package works and connection string is correct! ${serverInfo ? `(Server: ${serverInfo.version}, DB: ${serverInfo.database})` : ''}` 
            : `❌ PostgreSQL package installed but connection failed: ${error}. Check if PostgreSQL server is running and connection string is correct.`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { connected, packageWorking: true, serverInfo });
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

  /**
   * Test connection pool functionality
   */
  public async testConnectionPool(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testConnectionPool',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      logger.info('Testing PostgreSQL connection pool functionality');
      
      // Create connection pool
      const pool = new Pool({
        connectionString: this.connectionString,
        max: 5, // Maximum number of clients in the pool
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
      });

      let poolWorking = false;
      let error: string | null = null;
      let poolInfo: any = null;

      try {
        // Test pool with multiple concurrent queries
        const queries = [
          pool.query('SELECT 1 as test1'),
          pool.query('SELECT 2 as test2'),
          pool.query('SELECT NOW() as current_time')
        ];

        const results = await Promise.all(queries);
        
        if (results.every(result => result.rows && result.rows.length > 0)) {
          poolWorking = true;
          poolInfo = {
            totalClients: pool.totalCount,
            idleClients: pool.idleCount,
            waitingClients: pool.waitingCount,
            queriesExecuted: results.length
          };
        }
        
        // Close pool
        await pool.end();
        
      } catch (poolError) {
        error = (poolError as Error).message;
        poolWorking = false;
        
        // Try to close pool even if there was an error
        try {
          await pool.end();
        } catch (closeError) {
          // Ignore close errors
        }
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          poolWorking,
          error,
          poolInfo,
          message: poolWorking 
            ? `✅ PostgreSQL connection pool works correctly! Executed ${poolInfo?.queriesExecuted} concurrent queries.`
            : `❌ PostgreSQL connection pool test failed: ${error}`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { poolWorking, packageWorking: true, poolInfo });
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
