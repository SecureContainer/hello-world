import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';
import pino from 'pino';

/**
 * Simple pino function for structured logging
 */
export class PinoFunctions {
  private readonly packageName = 'pino';

  /**
   * Creates a simple log entry with structured data
   * @param level - Log level (info, error, warn, debug)
   * @param message - Log message
   * @param data - Optional structured data to include
   * @returns Promise<PackageResponse> - Response containing logging result
   */
  public async createLogEntry(
    level: 'info' | 'error' | 'warn' | 'debug' = 'info',
    message: string,
    data?: any
  ): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'createLogEntry',
      packageName: this.packageName,
      parameters: { level, message, hasData: !!data },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Create a temporary pino logger for demonstration
      const tempLogger = pino({
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard'
          }
        }
      });

      // Log the message with the specified level
      switch (level) {
        case 'info':
          tempLogger.info(data || {}, message);
          break;
        case 'error':
          tempLogger.error(data || {}, message);
          break;
        case 'warn':
          tempLogger.warn(data || {}, message);
          break;
        case 'debug':
          tempLogger.debug(data || {}, message);
          break;
      }

      const response: PackageResponse = {
        success: true,
        data: {
          level,
          message,
          structuredData: data,
          timestamp: new Date().toISOString(),
          loggerName: 'pino',
          hasTransport: true
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        level, 
        messageLength: message.length,
        hasData: !!data
      });
      return response;
    } catch (error) {
      const response: PackageResponse = {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return response;
    }
  }
}
