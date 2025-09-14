import stringify from 'json-stringify-safe';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple json-stringify-safe function for safe JSON stringification
 */
export class JsonStringifySafeFunctions {
  private readonly packageName = 'json-stringify-safe';

  /**
   * Safely stringifies an object to JSON, handling circular references
   * @param obj - The object to stringify
   * @param replacer - Optional replacer function or array
   * @param space - Optional space parameter for formatting
   * @returns Promise<PackageResponse> - Response containing the stringified JSON
   */
  public async safeStringify(
    obj: any,
    replacer?: any,
    space?: string | number
  ): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'safeStringify',
      packageName: this.packageName,
      parameters: { 
        objType: typeof obj,
        hasReplacer: !!replacer,
        space 
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      const jsonString = stringify(obj, replacer, space);

      const response: PackageResponse = {
        success: true,
        data: jsonString,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        objType: typeof obj,
        resultLength: jsonString.length,
        hasCircularRefs: jsonString.includes('[Circular]')
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
