import { BufferutilFunctions } from '../packages/bufferutil-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of bufferutil WebSocket buffer operations
 */
export class BufferutilExample {
  private bufferutilFunctions: BufferutilFunctions;

  constructor() {
    this.bufferutilFunctions = new BufferutilFunctions();
  }

  /**
   * Demonstrates bufferutil masking and unmasking operations
   */
  public async demonstrateBufferOperations(): Promise<void> {
    logger.info('=== Bufferutil Simple WebSocket Buffer Operations Example ===');

    try {
      // Test 1: Simple text masking and unmasking
      const originalText = 'Hello WebSocket!';
      const originalBuffer = Buffer.from(originalText, 'utf8');
      const mask = Buffer.from([0x12, 0x34, 0x56, 0x78]); // 4-byte mask

      logger.info({
        originalText,
        originalBufferLength: originalBuffer.length,
        maskHex: mask.toString('hex')
      }, 'Starting buffer masking operation');

      // Mask the buffer
      const maskResult = await this.bufferutilFunctions.maskBuffer(originalBuffer, mask);

      logger.info({
        success: maskResult.success,
        duration: maskResult.duration
      }, 'Buffer Masking completed');

      if (maskResult.success) {
        logger.info({
          originalLength: maskResult.data?.originalBuffer?.length,
          maskedLength: maskResult.data?.maskedBuffer?.length,
          originalHex: maskResult.data?.originalBuffer?.hex,
          maskedHex: maskResult.data?.maskedBuffer?.hex,
          maskBytes: maskResult.data?.mask?.bytes
        }, 'Buffer masked successfully');

        // Now unmask the buffer
        const maskedBuffer = Buffer.from(maskResult.data?.maskedBuffer?.hex, 'hex');
        const unmaskResult = await this.bufferutilFunctions.unmaskBuffer(maskedBuffer, mask);

        if (unmaskResult.success) {
          logger.info({
            unmaskedText: unmaskResult.data?.unmaskedBuffer?.text,
            unmaskedHex: unmaskResult.data?.unmaskedBuffer?.hex,
            originalMatches: unmaskResult.data?.unmaskedBuffer?.text === originalText
          }, 'Buffer unmasked successfully');
        }
      }

      // Test 2: JSON data masking
      const jsonData = JSON.stringify({ message: 'WebSocket data', timestamp: Date.now() });
      const jsonBuffer = Buffer.from(jsonData, 'utf8');
      const jsonMask = Buffer.from([0xAB, 0xCD, 0xEF, 0x01]);

      const jsonMaskResult = await this.bufferutilFunctions.maskBuffer(jsonBuffer, jsonMask);

      if (jsonMaskResult.success) {
        logger.info({
          originalDataType: 'JSON',
          originalLength: jsonMaskResult.data?.originalBuffer?.length,
          maskedLength: jsonMaskResult.data?.maskedBuffer?.length
        }, 'JSON data masked successfully');

        // Unmask the JSON data
        const maskedJsonBuffer = Buffer.from(jsonMaskResult.data?.maskedBuffer?.hex, 'hex');
        const jsonUnmaskResult = await this.bufferutilFunctions.unmaskBuffer(maskedJsonBuffer, jsonMask);

        if (jsonUnmaskResult.success) {
          try {
            const parsedJson = JSON.parse(jsonUnmaskResult.data?.unmaskedBuffer?.text);
            logger.info({
              unmaskedDataType: 'JSON',
              parsedMessage: parsedJson.message,
              dataIntegrity: 'preserved'
            }, 'JSON data unmasked and parsed successfully');
          } catch (parseError) {
            logger.error({ parseError }, 'Failed to parse unmasked JSON');
          }
        }
      }

    } catch (error) {
      logger.error({ error }, 'Bufferutil demonstration failed');
    }
  }

  /**
   * Run the bufferutil example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Bufferutil Example');
    await this.demonstrateBufferOperations();
    logger.info('Completed Bufferutil Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
