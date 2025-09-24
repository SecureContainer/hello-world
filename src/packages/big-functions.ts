import Big from 'big.js';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple big.js function for precise decimal arithmetic
 */
export class BigFunctions {
  private readonly packageName = 'big.js';

  /**
   * Performs precise decimal addition using big.js
   * @param a - First number (string or number)
   * @param b - Second number (string or number)
   * @returns Promise<PackageResponse> - Response containing the precise sum
   */
  public async addDecimals(a: string | number, b: string | number): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'addDecimals',
      packageName: this.packageName,
      parameters: { a, b },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      const bigA = new Big(a);
      const bigB = new Big(b);
      const result = bigA.plus(bigB);
      const resultString = result.toString();

      const response: PackageResponse = {
        success: true,
        data: resultString,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { a, b, result: resultString });
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
