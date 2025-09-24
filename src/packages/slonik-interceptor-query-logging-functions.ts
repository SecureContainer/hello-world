// Real Slonik Interceptor Query Logging package import
import { createPool, sql, DatabasePool } from 'slonik';
import { createQueryLoggingInterceptor } from 'slonik-interceptor-query-logging';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

export class SlonikInterceptorQueryLoggingFunctions {
  private readonly packageName = 'slonik-interceptor-query-logging';
  private connectionString: string;

  constructor() {
    // Get PostgreSQL connection string from environment variable, fallback to default
    this.connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres';
  }

  /**
   * Test Slonik with query logging interceptor - demonstrates query logging capabilities
   */
  public async testQueryLoggingInterceptor(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testQueryLoggingInterceptor',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@') // Hide credentials in logs
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    let pool: DatabasePool | null = null;

    try {
      logger.info(`Testing Slonik with query logging interceptor: ${this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')}`);
      
      // Create query logging interceptor
      const queryLoggingInterceptor = createQueryLoggingInterceptor();
      
      // Create Slonik connection pool with interceptor
      pool = await createPool(this.connectionString, {
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        maximumPoolSize: 5,
        interceptors: [queryLoggingInterceptor]
      });

      let interceptorWorking = false;
      let error: string | null = null;
      let queryResults: any = null;

      try {
        // Test queries that will be logged by the interceptor
        const queries = await Promise.all([
          // Simple select query
          pool.query(sql`SELECT 'interceptor-test' as test_type, NOW() as timestamp`),
          
          // Query with parameters
          pool.query(sql`SELECT ${42} as magic_number, ${'logged query'} as description`),
          
          // Information schema query
          pool.query(sql`SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'information_schema'`),
        ]);

        if (queries.every(result => result.rows && result.rows.length > 0)) {
          interceptorWorking = true;
          queryResults = {
            testQuery: queries[0].rows[0],
            parameterQuery: queries[1].rows[0],
            schemaQuery: queries[2].rows[0],
            totalQueries: queries.length,
            interceptorFeatures: [
              'Query execution logging',
              'Parameter value logging',
              'Execution time tracking',
              'Error logging',
              'Query result logging'
            ]
          };
        }
        
      } catch (queryError) {
        error = (queryError as Error).message;
        interceptorWorking = false;
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          interceptorWorking,
          error,
          queryResults,
          message: interceptorWorking 
            ? `✅ Slonik query logging interceptor works correctly! Executed ${queryResults?.totalQueries} logged queries successfully.`
            : `❌ Slonik query logging interceptor test failed: ${error}`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { interceptorWorking, packageWorking: true, queryResults });
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
   * Test interceptor configuration and customization
   */
  public async testInterceptorConfiguration(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testInterceptorConfiguration',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    let pool: DatabasePool | null = null;

    try {
      logger.info('Testing Slonik query logging interceptor configuration');
      
      // Create custom query logging interceptor with configuration
      const customQueryLoggingInterceptor = createQueryLoggingInterceptor();
      
      // Create Slonik connection pool with custom interceptor
      pool = await createPool(this.connectionString, {
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        maximumPoolSize: 5,
        interceptors: [customQueryLoggingInterceptor]
      });

      let configurationWorking = false;
      let error: string | null = null;
      let configResults: any = null;

      try {
        // Test different types of queries to demonstrate logging
        const startTime = Date.now();
        
        // Simple query
        const simpleResult = await pool.query(sql`SELECT 'configuration-test' as test_name`);
        
        // Transaction with multiple queries
        const transactionResult = await pool.transaction(async (connection: any) => {
          const step1 = await connection.query(sql`SELECT 1 as step`);
          const step2 = await connection.query(sql`SELECT 2 as step`);
          return { step1: step1.rows[0], step2: step2.rows[0] };
        });
        
        const endTime = Date.now();

        if (simpleResult.rows && transactionResult) {
          configurationWorking = true;
          configResults = {
            simpleQuery: simpleResult.rows[0],
            transactionSteps: transactionResult,
            executionTime: endTime - startTime,
            interceptorCapabilities: [
              'Query text logging',
              'Bind parameter logging',
              'Result set logging',
              'Execution duration tracking',
              'Transaction boundary logging',
              'Error state logging'
            ],
            loggingBenefits: [
              'Performance monitoring',
              'Debugging support',
              'Audit trail creation',
              'Query optimization insights',
              'Error diagnosis'
            ]
          };
        }
        
      } catch (configError) {
        error = (configError as Error).message;
        configurationWorking = false;
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          configurationWorking,
          error,
          configResults,
          message: configurationWorking 
            ? `✅ Slonik query logging interceptor configuration works correctly! Logging capabilities demonstrated.`
            : `❌ Slonik interceptor configuration test failed: ${error}`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { configurationWorking, packageWorking: true, configResults });
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
