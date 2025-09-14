/**
 * Production-ready TypeScript Node.js project with package functions
 * Main entry point that exports all package functions and utilities
 */

// Export types and interfaces
export * from './types';

// Export logging utilities
export * from './utils/logger';

// Initialize and export logger for immediate use
import { logger } from './utils/logger';
export { logger };

/**
 * Main application entry point
 */
export class PackageTestApp {
  constructor() {
    logger.info('PackageTest Application initialized');
  }

  /**
   * Get application information
   */
  public getAppInfo() {
    return {
      name: 'PackageTest',
      version: '1.0.0',
      description: 'Simple TypeScript Node.js project with basic package functions',
      implementedPackages: ['axios', 'uuid', 'lodash', 'moment', 'big.js', 'dotenv', 'json-stringify-safe', 'lru-cache', 'utf-8-validate', 'js-yaml', 'pino', 'bufferutil', 'nan', 'node-yaml-config', 'ws', 'pino-debug', 'redis', 'mongodb', 'pg', 'slonik', 'slonik-interceptor-query-logging', 'slonik-sql-tag-raw'],
      remainingPackages: [],
      timestamp: new Date().toISOString()
    };
  }
}

// Create and export default app instance
export const app = new PackageTestApp();

/**
 * Main execution block - runs demo when file is executed directly
 */
async function main() {
  try {
    // Load environment variables (dynamic import for ES module compatibility)
    const dotenv = await import('dotenv');
    dotenv.config({ path: 'demo.env' });
    
    logger.info('🚀 Starting PackageTest Application Demo');
    logger.info('📦 Running all package demonstrations...');
    
    // Import and run the demo
    const { runDemo } = await import('./demo');
    await runDemo();
    
  } catch (error) {
    logger.error({ error }, '❌ Application failed to start');
    process.exit(1);
  }
}

/**
 * Check if this file is being executed directly
 * Works for both CommonJS and ES modules
 */
function isMainModule(): boolean {
  // For CommonJS environments
  if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    try {
      return require.main === module;
    } catch {
      // If require.main or module is undefined, we're likely in ES module context
      return false;
    }
  }
  
  // For ES modules or when require/module are not available
  // We'll return false to avoid automatic execution in ES modules
  // Users can call main() explicitly if needed
  return false;
}

// Export main function for explicit calling
export { main };

// Run main function if this file is executed directly (CommonJS only)
if (isMainModule()) {
  main().catch((error) => {
    logger.error({ error }, '❌ Failed to start application');
    process.exit(1);
  });
}
