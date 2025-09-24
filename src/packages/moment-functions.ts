import moment from 'moment';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple moment function for date formatting
 */
export class MomentFunctions {
  private readonly packageName = 'moment';

  /**
   * Formats the current date using moment
   * @param format - The format string (default: 'YYYY-MM-DD HH:mm:ss')
   * @returns Promise<PackageResponse> - Response containing the formatted date
   */
  public async formatCurrentDate(format: string = 'YYYY-MM-DD HH:mm:ss'): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'formatCurrentDate',
      packageName: this.packageName,
      parameters: { format },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      const currentDate = moment();
      const formattedDate = currentDate.format(format);

      const result: PackageResponse = {
        success: true,
        data: formattedDate,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { format, formattedDate });
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
