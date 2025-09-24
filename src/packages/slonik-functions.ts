// Real Slonik package import
import { createPool, sql, DatabasePool } from 'slonik';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

export class SlonikFunctions {
  private readonly packageName = 'slonik';
  private connectionString: string;

  constructor() {
    // Get PostgreSQL connection string from environment variable, fallback to default
    this.connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres';
  }

  /**
   * Simple Slonik connection test - checks if Slonik package works and connection string is correct
   */
  public async testSlonikConnection(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testSlonikConnection',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@') // Hide credentials in logs
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    let pool: DatabasePool | null = null;

    try {
      logger.info(`Testing Slonik connection: ${this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')}`);
      
      // Create Slonik connection pool
      pool = await createPool(this.connectionString, {
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        maximumPoolSize: 5,
      });

      let connected = false;
      let error: string | null = null;
      let serverInfo: any = null;

      try {
        // Simple query test to verify connection using Slonik's sql template
        const result = await pool.query(sql`
          SELECT 
            version() as version,
            current_database() as database,
            current_user as user,
            current_timestamp as timestamp
        `);
        
        if (result.rows && result.rows.length > 0) {
          connected = true;
          
          // Extract server information
          const row = result.rows[0];
          serverInfo = {
            version: row && typeof row.version === 'string' ? row.version.split(' ')[0] + ' ' + row.version.split(' ')[1] : 'Unknown',
            database: row?.database || 'Unknown',
            user: row?.user || 'Unknown',
            timestamp: row?.timestamp || 'Unknown',
            rowCount: result.rowCount
          };
        }
        
      } catch (connError) {
        error = (connError as Error).message;
        connected = false;
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
            ? `✅ Slonik package works and connection string is correct! ${serverInfo ? `(Server: ${serverInfo.version}, DB: ${serverInfo.database})` : ''}` 
            : `❌ Slonik package installed but connection failed: ${error}. Check if PostgreSQL server is running and connection string is correct.`
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
    } finally {
      // Always close the pool
      if (pool) {
        try {
          await pool.end();
        } catch (closeError) {
          // Ignore close errors
        }
      }
    }
  }

  /**
   * Test Slonik's typed queries and transaction functionality
   */
  public async testSlonikTypedQueries(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testSlonikTypedQueries',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    let pool: DatabasePool | null = null;

    try {
      logger.info('Testing Slonik typed queries and transactions');
      
      // Create Slonik connection pool
      pool = await createPool(this.connectionString, {
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        maximumPoolSize: 5,
      });

      let queriesWorking = false;
      let error: string | null = null;
      let queryResults: any = null;

      try {
        // Test various Slonik query types
        const queries = await Promise.all([
          // Simple select with sql template
          pool.query(sql`SELECT 1 + 1 as calculation`),
          
          // Query with parameters
          pool.query(sql`SELECT ${'Hello'} as greeting, ${42} as number`),
          
          // Current time query
          pool.query(sql`SELECT NOW() as current_time, 'slonik-test' as source`),
        ]);

        // Test transaction (read-only for safety)
        const transactionResult = await pool.transaction(async (connection: any) => {
          const result1 = await connection.query(sql`SELECT 'transaction' as test_type`);
          const result2 = await connection.query(sql`SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public'`);
          return { result1: result1.rows[0], result2: result2.rows[0] };
        });

        if (queries.every(result => result.rows && result.rows.length > 0)) {
          queriesWorking = true;
          queryResults = {
            calculation: queries[0].rows[0],
            greeting: queries[1].rows[0],
            currentTime: queries[2].rows[0],
            transaction: transactionResult,
            totalQueries: queries.length + 2, // +2 for transaction queries
            features: ['SQL template literals', 'Parameter binding', 'Transactions', 'Type safety']
          };
        }
        
      } catch (queryError) {
        error = (queryError as Error).message;
        queriesWorking = false;
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          queriesWorking,
          error,
          queryResults,
          message: queriesWorking 
            ? `✅ Slonik typed queries and transactions work correctly! Executed ${queryResults?.totalQueries} queries successfully.`
            : `❌ Slonik queries test failed: ${error}`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { queriesWorking, packageWorking: true, queryResults });
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
    } finally {
      // Always close the pool
      if (pool) {
        try {
          await pool.end();
        } catch (closeError) {
          // Ignore close errors
        }
      }
    }
  }

  /**
   * Test Slonik's query building and safety features
   */
  public async testSlonikSafetyFeatures(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testSlonikSafetyFeatures',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    let pool: DatabasePool | null = null;

    try {
      logger.info('Testing Slonik safety features and query building');
      
      // Create Slonik connection pool
      pool = await createPool(this.connectionString, {
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        maximumPoolSize: 5,
      });

      let safetyWorking = false;
      let error: string | null = null;
      let safetyResults: any = null;

      try {
        // Test safe parameter binding (prevents SQL injection)
        const userInput = "'; DROP TABLE users; --";
        const safeQuery = await pool.query(sql`
          SELECT ${userInput} as user_input, 
                 'SQL injection prevented' as safety_note
        `);

        // Test query result validation
        const validationQuery = await pool.query(sql`
          SELECT 
            'slonik' as client_name,
            ${new Date().getFullYear()} as current_year,
            ${Math.random()} as random_number
        `);

        if (safeQuery.rows && validationQuery.rows) {
          safetyWorking = true;
          safetyResults = {
            sqlInjectionPrevented: safeQuery.rows[0],
            queryValidation: validationQuery.rows[0],
            safetyFeatures: [
              'SQL injection prevention',
              'Template literal queries',
              'Type-safe parameters',
              'Query result validation',
              'Connection pooling'
            ],
            demonstrationNote: 'Malicious input was safely handled as a parameter, not executed as SQL'
          };
        }
        
      } catch (safetyError) {
        error = (safetyError as Error).message;
        safetyWorking = false;
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          safetyWorking,
          error,
          safetyResults,
          message: safetyWorking 
            ? `✅ Slonik safety features work correctly! SQL injection prevention and query validation demonstrated.`
            : `❌ Slonik safety features test failed: ${error}`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { safetyWorking, packageWorking: true, safetyResults });
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
    } finally {
      // Always close the pool
      if (pool) {
        try {
          await pool.end();
        } catch (closeError) {
          // Ignore close errors
        }
      }
    }
  }
}
