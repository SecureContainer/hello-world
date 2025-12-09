import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

// Import bufferutil functions
const bufferUtil = require('bufferutil');

/**
 * Simple bufferutil function for WebSocket buffer operations
 */
export class BufferutilFunctions {
  private readonly packageName = 'bufferutil';

  /**
   * Masks or unmasks a buffer using WebSocket masking algorithm
   * @param buffer - The buffer to mask/unmask
   * @param mask - 4-byte masking key
   * @returns Promise<PackageResponse> - Response containing the masked/unmasked buffer
   */
  public async maskBuffer(buffer: Buffer, mask: Buffer): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'maskBuffer',
      packageName: this.packageName,
      parameters: { 
        bufferLength: buffer.length,
        maskLength: mask.length,
        bufferPreview: buffer.toString('hex').substring(0, 16) + (buffer.length > 8 ? '...' : '')
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Validate mask is 4 bytes
      if (mask.length !== 4) {
        throw new Error('Mask must be exactly 4 bytes');
      }

      // Create a copy of the original buffer
      const maskedBuffer = Buffer.from(buffer);

      // Apply WebSocket masking using bufferutil
      bufferUtil.mask(maskedBuffer, mask, maskedBuffer, 0, maskedBuffer.length);

      const response: PackageResponse = {
        success: true,
        data: {
          originalBuffer: {
            length: buffer.length,
            hex: buffer.toString('hex'),
            preview: buffer.toString('utf8', 0, Math.min(20, buffer.length))
          },
          maskedBuffer: {
            length: maskedBuffer.length,
            hex: maskedBuffer.toString('hex'),
            preview: maskedBuffer.toString('utf8', 0, Math.min(20, maskedBuffer.length))
          },
          mask: {
            hex: mask.toString('hex'),
            bytes: Array.from(mask)
          },
          operation: 'mask'
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        bufferLength: buffer.length,
        maskApplied: true,
        operation: 'mask'
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

  /**
   * Unmasks a buffer (same operation as masking in WebSocket protocol)
   * @param maskedBuffer - The masked buffer to unmask
   * @param mask - 4-byte masking key used originally
   * @returns Promise<PackageResponse> - Response containing the unmasked buffer
   */
  public async unmaskBuffer(maskedBuffer: Buffer, mask: Buffer): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'unmaskBuffer',
      packageName: this.packageName,
      parameters: { 
        bufferLength: maskedBuffer.length,
        maskLength: mask.length
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Validate mask is 4 bytes
      if (mask.length !== 4) {
        throw new Error('Mask must be exactly 4 bytes');
      }

      // Create a copy of the masked buffer
      const unmaskedBuffer = Buffer.from(maskedBuffer);

      // Apply WebSocket unmasking (same as masking - XOR operation)
      bufferUtil.unmask(unmaskedBuffer, mask);

      const response: PackageResponse = {
        success: true,
        data: {
          maskedBuffer: {
            length: maskedBuffer.length,
            hex: maskedBuffer.toString('hex')
          },
          unmaskedBuffer: {
            length: unmaskedBuffer.length,
            hex: unmaskedBuffer.toString('hex'),
            text: unmaskedBuffer.toString('utf8')
          },
          mask: {
            hex: mask.toString('hex'),
            bytes: Array.from(mask)
          },
          operation: 'unmask'
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        bufferLength: maskedBuffer.length,
        maskRemoved: true,
        operation: 'unmask'
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
