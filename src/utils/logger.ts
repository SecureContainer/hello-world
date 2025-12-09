import pino from 'pino';

/**
 * Logger configuration interface
 */
interface LoggerConfig {
  level?: string;
  prettyPrint?: boolean;
  name?: string;
}

/**
 * Function execution context for logging
 */
export interface FunctionContext {
  functionName: string;
  packageName: string;
  parameters?: Record<string, any>;
  startTime: number;
}

/**
 * Create a configured pino logger instance
 * @param config Logger configuration options
 * @returns Configured pino logger
 */
export const createLogger = (config: LoggerConfig = {}) => {
  // For bundled builds, avoid pino-pretty transport which requires worker threads
  if (process.env.NODE_ENV === 'production' || (process as any).pkg) {
    return pino({
      name: config.name || 'PackageTest',
      level: config.level || 'info',
      timestamp: pino.stdTimeFunctions.isoTime
    });
  }

  // Development mode with pretty printing
  return pino({
    name: config.name || 'PackageTest',
    level: config.level || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(config.prettyPrint && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    })
  });
};

/**
 * Default logger instance
 */
export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

/**
 * Log the start of a function execution
 * @param context Function execution context
 */
export const logFunctionStart = (context: FunctionContext): void => {
  logger.info({
    functionName: context.functionName,
    packageName: context.packageName,
    parameters: context.parameters,
    timestamp:  pino.stdTimeFunctions.isoTime
  }, `Starting ${context.packageName} function: ${context.functionName}`);
};

/**
 * Log the end of a function execution
 * @param context Function execution context
 * @param result Function execution result
 * @param error Optional error if function failed
 */
export const logFunctionEnd = (
  context: FunctionContext,
  result?: any,
  error?: Error
): void => {
  const duration = Date.now() - context.startTime;
  
  if (error) {
    logger.error({
      functionName: context.functionName,
      packageName: context.packageName,
      duration,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      timestamp: new Date().toISOString()
    }, `Error in ${context.packageName} function: ${context.functionName}`);
  } else {
    logger.info({
      functionName: context.functionName,
      packageName: context.packageName,
      duration,
      result: typeof result === 'object' ? '[Object]' : result,
      timestamp: new Date().toISOString()
    }, `Completed ${context.packageName} function: ${context.functionName} in ${duration}ms`);
  }
};

/**
 * Decorator function to automatically log function execution
 * @param packageName Name of the package being used
 */
export const withLogging = (packageName: string) => {
  return <T extends (...args: any[]) => any>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> => {
    const method = descriptor.value!;

    descriptor.value = ((...args: any[]) => {
      const context: FunctionContext = {
        functionName: propertyName,
        packageName,
        parameters: args.length > 0 ? { args } : undefined,
        startTime: Date.now()
      };

      logFunctionStart(context);

      try {
        const result = method.apply(target, args);
        
        // Handle both sync and async functions
        if (result instanceof Promise) {
          return result
            .then((res) => {
              logFunctionEnd(context, res);
              return res;
            })
            .catch((error) => {
              logFunctionEnd(context, undefined, error);
              throw error;
            });
        } else {
          logFunctionEnd(context, result);
          return result;
        }
      } catch (error) {
        logFunctionEnd(context, undefined, error as Error);
        throw error;
      }
    }) as T;

    return descriptor;
  };
};
