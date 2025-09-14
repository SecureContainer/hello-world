import { v4 as uuidv4 } from 'uuid';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple UUID function for generating unique identifiers
 */
export class UuidFunctions {
  private readonly packageName = 'uuid';

  /**
   * Generates a random UUID v4
   * @returns Promise<PackageResponse> - Response containing the generated UUID
   */
  public async generateUuid(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'generateUuid',
      packageName: this.packageName,
      parameters: {},
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      const uuid = uuidv4();

      const result: PackageResponse = {
        success: true,
        data: uuid,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { uuid });
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
