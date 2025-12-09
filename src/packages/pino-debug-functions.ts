import pino from 'pino';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

// Conditionally require pino-debug only in development to avoid worker thread issues
let pinoDebug: any;
try {
  if (process.env.NODE_ENV !== 'production' && !(process as any).pkg) {
    pinoDebug = require('pino-debug');
  }
} catch (error) {
  // pino-debug not available or causes issues
}

export class PinoDebugFunctions {
  private readonly packageName = 'pino-debug';

  /**
   * Setup debug logging with pino-debug
   * Enables debug statements to be logged through pino
   */
  public async setupDebugLogging(namespace: string = 'app'): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'setupDebugLogging',
      packageName: this.packageName,
      parameters: { namespace },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // For production/bundled builds, use simple logging instead of pino-debug
      if (!pinoDebug) {
        const result = {
          success: true,
          data: {
            message: 'Debug logging simulated (pino-debug not available in bundled build)',
            namespace,
            debugMessages: [
              `${namespace}:main - Application started with debug logging`,
              `${namespace}:database - Database connection established`,
              `${namespace}:api - API endpoints registered`
            ]
          },
          timestamp: new Date().toISOString(),
          duration: Date.now() - context.startTime
        };

        // Log the messages using regular logger
        logger.info(`${namespace}:main Application started with debug logging`);
        logger.info(`${namespace}:database Database connection established`);
        logger.info(`${namespace}:api API endpoints registered`);

        logFunctionEnd(context, result);
        return result;
      }

      // Create a dedicated logger for debug (development only)
      const debugLogger = pino({
        name: `${namespace}-debug`,
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname'
          }
        }
      });

      // Setup pino-debug to capture debug statements
      pinoDebug(debugLogger, {
        map: {
          [`${namespace}:*`]: 'debug',
          [`${namespace}:error:*`]: 'error',
          [`${namespace}:warn:*`]: 'warn',
          [`${namespace}:info:*`]: 'info'
        }
      });

      // Enable debug for the specified namespace
      process.env.DEBUG = `${namespace}:*`;

      // Create debug instances to demonstrate
      const debug = require('debug');
      const appDebug = debug(`${namespace}:main`);
      const dbDebug = debug(`${namespace}:database`);
      const apiDebug = debug(`${namespace}:api`);

      // Generate some debug messages
      appDebug('Application started with debug logging');
      dbDebug('Database connection established');
      apiDebug('API endpoints registered');

      const result: PackageResponse = {
        success: true,
        data: {
          namespace,
          debugEnabled: true,
          loggerName: debugLogger.bindings().name,
          debugEnvironment: process.env.DEBUG,
          demonstrationMessages: [
            `${namespace}:main - Application started with debug logging`,
            `${namespace}:database - Database connection established`, 
            `${namespace}:api - API endpoints registered`
          ],
          capabilities: [
            'Debug statement capture',
            'Namespace filtering',
            'Log level mapping',
            'Pino integration'
          ]
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { namespace, debugEnabled: true });
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
