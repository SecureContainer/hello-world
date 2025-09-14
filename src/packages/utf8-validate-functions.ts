import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

// Use require for utf-8-validate to avoid TypeScript issues
const isValidUTF8 = require('utf-8-validate');

/**
 * Simple utf-8-validate function for validating UTF-8 encoded buffers
 */
export class Utf8ValidateFunctions {
  private readonly packageName = 'utf-8-validate';

  /**
   * Validates if a buffer contains valid UTF-8 encoded data
   * @param input - String or Buffer to validate
   * @returns Promise<PackageResponse> - Response containing validation result
   */
  public async validateUtf8(input: string | Buffer): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'validateUtf8',
      packageName: this.packageName,
      parameters: { 
        inputType: typeof input,
        inputLength: input.length
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Convert string to buffer if needed
      const buffer = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
      
      // Validate UTF-8
      const isValid = isValidUTF8(buffer);

      const response: PackageResponse = {
        success: true,
        data: {
          isValidUtf8: isValid,
          inputType: typeof input,
          bufferLength: buffer.length,
          originalInput: typeof input === 'string' ? input : `<Buffer ${buffer.length} bytes>`,
          bufferPreview: buffer.length <= 50 ? buffer.toString('hex') : buffer.subarray(0, 25).toString('hex') + '...'
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        isValidUtf8: isValid,
        inputType: typeof input,
        bufferLength: buffer.length
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
