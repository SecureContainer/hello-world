import _ from 'lodash';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple lodash function for string manipulation
 */
export class LodashFunctions {
  private readonly packageName = 'lodash';

  /**
   * Capitalizes the first character of a string using lodash
   * @param text - The string to capitalize
   * @returns Promise<PackageResponse> - Response containing the capitalized string
   */
  public async capitalizeString(text: string): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'capitalizeString',
      packageName: this.packageName,
      parameters: { text },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      const capitalizedText = _.capitalize(text);

      const result: PackageResponse = {
        success: true,
        data: capitalizedText,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { originalText: text, capitalizedText });
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
