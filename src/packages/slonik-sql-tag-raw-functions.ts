// Real Slonik SQL Tag Raw package import
import { createPool, sql, DatabasePool } from 'slonik';
import { raw } from 'slonik-sql-tag-raw';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

export class SlonikSqlTagRawFunctions {
  private readonly packageName = 'slonik-sql-tag-raw';
  private connectionString: string;

  constructor() {
    // Get PostgreSQL connection string from environment variable, fallback to default
    this.connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres';
  }

  /**
   * Test Slonik with raw SQL tag - demonstrates raw SQL capabilities
   */
  public async testRawSqlTag(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testRawSqlTag',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@') // Hide credentials in logs
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    let pool: DatabasePool | null = null;

    try {
      logger.info(`Testing Slonik with raw SQL tag: ${this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')}`);
      
      // Create Slonik connection pool
      pool = await createPool(this.connectionString, {
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        maximumPoolSize: 5,
      });

      let rawSqlWorking = false;
      let error: string | null = null;
      let rawResults: any = null;

      try {
        // Test raw SQL queries using the raw tag
        const queries = await Promise.all([
          // Simple raw SQL query
          pool.query(sql`SELECT ${raw('NOW()')} as current_time, 'raw-sql-test' as test_type`),
          
          // Raw SQL with dynamic table/column names (be careful in production!)
          pool.query(sql`SELECT COUNT(*) as count FROM ${raw('information_schema.tables')} WHERE table_schema = 'information_schema'`),
          
          // Raw SQL function call
          pool.query(sql`SELECT ${raw('CURRENT_DATABASE()')} as database_name, ${raw('CURRENT_USER')} as current_user`),
        ]);

        if (queries.every(result => result.rows && result.rows.length > 0)) {
          rawSqlWorking = true;
          rawResults = {
            timeQuery: queries[0].rows[0],
            countQuery: queries[1].rows[0],
            infoQuery: queries[2].rows[0],
            totalQueries: queries.length,
            rawSqlFeatures: [
              'Dynamic SQL injection',
              'Function name injection',
              'Table/column name injection',
              'Complex expression injection',
              'Raw SQL fragment composition'
            ],
            useCases: [
              'Dynamic table names',
              'Dynamic column names',
              'Complex SQL functions',
              'Database-specific syntax',
              'Performance-critical queries'
            ]
          };
        }
        
      } catch (queryError) {
        error = (queryError as Error).message;
        rawSqlWorking = false;
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          rawSqlWorking,
          error,
          rawResults,
          message: rawSqlWorking 
            ? `✅ Slonik raw SQL tag works correctly! Executed ${rawResults?.totalQueries} raw SQL queries successfully.`
            : `❌ Slonik raw SQL tag test failed: ${error}`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { rawSqlWorking, packageWorking: true, rawResults });
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
   * Test advanced raw SQL scenarios and safety considerations
   */
  public async testAdvancedRawSql(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testAdvancedRawSql',
      packageName: this.packageName,
      parameters: { 
        connectionString: this.connectionString.replace(/\/\/.*:.*@/, '//***:***@')
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    let pool: DatabasePool | null = null;

    try {
      logger.info('Testing advanced Slonik raw SQL scenarios');
      
      // Create Slonik connection pool
      pool = await createPool(this.connectionString, {
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '3000'),
        maximumPoolSize: 5,
      });

      let advancedWorking = false;
      let error: string | null = null;
      let advancedResults: any = null;

      try {
        // Test advanced raw SQL scenarios
        const startTime = Date.now();
        
        // Complex query with multiple raw fragments
        const complexQuery = await pool.query(sql`
          SELECT 
            ${raw('EXTRACT(EPOCH FROM NOW())')} as unix_timestamp,
            ${raw('pg_database_size(current_database())')} as db_size_bytes,
            ${raw('version()')} as postgres_version
        `);
        
        // Dynamic ORDER BY using raw
        const orderByColumn = 'table_name';
        const dynamicOrderQuery = await pool.query(sql`
          SELECT table_name, table_type 
          FROM information_schema.tables 
          WHERE table_schema = 'information_schema'
          ORDER BY ${raw(orderByColumn)}
          LIMIT 5
        `);
        
        // Raw SQL with computed expressions
        const computedQuery = await pool.query(sql`
          SELECT 
            ${42} as input_number,
            ${raw('42 * 2')} as computed_result,
            ${raw('CASE WHEN 42 > 40 THEN \'large\' ELSE \'small\' END')} as category
        `);
        
        const endTime = Date.now();

        if (complexQuery.rows && dynamicOrderQuery.rows && computedQuery.rows) {
          advancedWorking = true;
          advancedResults = {
            complexQuery: complexQuery.rows[0],
            dynamicOrder: dynamicOrderQuery.rows.slice(0, 3), // First 3 results
            computedQuery: computedQuery.rows[0],
            executionTime: endTime - startTime,
            advancedFeatures: [
              'Complex SQL expressions',
              'Dynamic column ordering',
              'Database function calls',
              'Conditional expressions',
              'Mathematical computations'
            ],
            safetyNotes: [
              'Always validate raw SQL input',
              'Avoid user input in raw fragments',
              'Use parameterized queries when possible',
              'Sanitize dynamic identifiers',
              'Test thoroughly in development'
            ]
          };
        }
        
      } catch (advancedError) {
        error = (advancedError as Error).message;
        advancedWorking = false;
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          advancedWorking,
          error,
          advancedResults,
          message: advancedWorking 
            ? `✅ Slonik advanced raw SQL scenarios work correctly! Complex queries executed successfully.`
            : `❌ Slonik advanced raw SQL test failed: ${error}`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { advancedWorking, packageWorking: true, advancedResults });
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
