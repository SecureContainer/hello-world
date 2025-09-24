import { Utf8ValidateFunctions } from '../packages/utf8-validate-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of UTF-8 validation
 */
export class Utf8ValidateExample {
  private utf8Functions: Utf8ValidateFunctions;

  constructor() {
    this.utf8Functions = new Utf8ValidateFunctions();
  }

  /**
   * Demonstrates UTF-8 validation with various inputs
   */
  public async demonstrateUtf8Validation(): Promise<void> {
    logger.info('=== UTF-8 Validate Simple Validation Example ===');
    
    try {
      // Test 1: Valid UTF-8 string
      const validStringResult = await this.utf8Functions.validateUtf8('Hello, World! 🌍');

      logger.info({
        success: validStringResult.success,
        duration: validStringResult.duration
      }, 'Valid UTF-8 String Validation completed');

      if (validStringResult.success) {
        logger.info({
          input: validStringResult.data?.originalInput,
          isValid: validStringResult.data?.isValidUtf8,
          bufferLength: validStringResult.data?.bufferLength
        }, 'Valid UTF-8 string result');
      }

      // Test 2: Valid UTF-8 with emojis and special characters
      const emojiResult = await this.utf8Functions.validateUtf8('🚀 Node.js TypeScript 💻 UTF-8 ✅');

      if (emojiResult.success) {
        logger.info({
          input: emojiResult.data?.originalInput,
          isValid: emojiResult.data?.isValidUtf8,
          bufferLength: emojiResult.data?.bufferLength
        }, 'Emoji UTF-8 string result');
      }

      // Test 3: Valid UTF-8 buffer from string
      const validBuffer = Buffer.from('Testing UTF-8 validation with buffer', 'utf8');
      const bufferResult = await this.utf8Functions.validateUtf8(validBuffer);

      if (bufferResult.success) {
        logger.info({
          inputType: bufferResult.data?.inputType,
          isValid: bufferResult.data?.isValidUtf8,
          bufferLength: bufferResult.data?.bufferLength,
          bufferPreview: bufferResult.data?.bufferPreview
        }, 'Valid UTF-8 buffer result');
      }

      // Test 4: Create an invalid UTF-8 buffer (manually crafted)
      const invalidBuffer = Buffer.from([0xFF, 0xFE, 0xFD]); // Invalid UTF-8 sequence
      const invalidResult = await this.utf8Functions.validateUtf8(invalidBuffer);

      if (invalidResult.success) {
        logger.info({
          inputType: invalidResult.data?.inputType,
          isValid: invalidResult.data?.isValidUtf8,
          bufferLength: invalidResult.data?.bufferLength,
          bufferPreview: invalidResult.data?.bufferPreview
        }, 'Invalid UTF-8 buffer result');
      }

      // Test 5: Empty string/buffer
      const emptyResult = await this.utf8Functions.validateUtf8('');

      if (emptyResult.success) {
        logger.info({
          input: 'empty string',
          isValid: emptyResult.data?.isValidUtf8,
          bufferLength: emptyResult.data?.bufferLength
        }, 'Empty string UTF-8 result');
      }

      // Test 6: Multi-language UTF-8 text
      const multiLangResult = await this.utf8Functions.validateUtf8('English, Español, Français, 中文, العربية, русский');

      if (multiLangResult.success) {
        logger.info({
          input: multiLangResult.data?.originalInput,
          isValid: multiLangResult.data?.isValidUtf8,
          bufferLength: multiLangResult.data?.bufferLength
        }, 'Multi-language UTF-8 result');
      }

    } catch (error) {
      logger.error({ error }, 'UTF-8 validation failed');
    }
  }

  /**
   * Run the UTF-8 validate example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting UTF-8 Validate Example');
    await this.demonstrateUtf8Validation();
    logger.info('Completed UTF-8 Validate Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
