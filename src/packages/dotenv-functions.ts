import dotenv from 'dotenv';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple dotenv function for loading environment variables
 */
export class DotenvFunctions {
  private readonly packageName = 'dotenv';

  /**
   * Loads environment variables from .env file and reads a secret key
   * @param envPath - Path to the .env file (default: 'demo.env')
   * @param secretKeyName - Name of the secret key to read (default: 'SECRET_API_KEY')
   * @returns Promise<PackageResponse> - Response containing the secret key value
   */
  public async loadAndReadSecret(
    envPath: string = 'demo.env',
    secretKeyName: string = 'SECRET_API_KEY'
  ): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'loadAndReadSecret',
      packageName: this.packageName,
      parameters: { envPath, secretKeyName },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Load environment variables from the specified file (suppress console output)
      const originalConsoleLog = console.log;
      console.log = () => {}; // Temporarily suppress console.log
      
      const result = dotenv.config({ path: envPath });
      
      console.log = originalConsoleLog; // Restore console.log
      
      if (result.error) {
        throw new Error(`Failed to load .env file: ${result.error.message}`);
      }

      // Read the secret key
      const secretValue = process.env[secretKeyName];
      
      if (!secretValue) {
        throw new Error(`Secret key '${secretKeyName}' not found in environment variables`);
      }

      const response: PackageResponse = {
        success: true,
        data: {
          secretKeyName,
          secretValue,
          envPath,
          totalEnvVars: Object.keys(process.env).length
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        secretKeyName, 
        secretFound: true, 
        envPath,
        totalEnvVars: Object.keys(process.env).length 
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
