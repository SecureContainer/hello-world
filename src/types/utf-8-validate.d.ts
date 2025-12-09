declare module 'utf-8-validate' {
  /**
   * Check if a buffer contains valid UTF-8 encoded text
   * @param buffer Buffer to validate
   * @returns true if the buffer contains valid UTF-8, false otherwise
   */
  export function isValidUTF8(buffer: Buffer): boolean;
}
