import * as yaml from 'js-yaml';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple js-yaml function for parsing YAML strings
 */
export class JsYamlFunctions {
  private readonly packageName = 'js-yaml';

  /**
   * Parses a YAML string into a JavaScript object
   * @param yamlString - The YAML string to parse
   * @returns Promise<PackageResponse> - Response containing the parsed object
   */
  public async parseYaml(yamlString: string): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'parseYaml',
      packageName: this.packageName,
      parameters: { 
        yamlLength: yamlString.length,
        yamlPreview: yamlString.length > 100 ? yamlString.substring(0, 100) + '...' : yamlString
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Parse YAML string to JavaScript object
      const parsedObject = yaml.load(yamlString);

      const response: PackageResponse = {
        success: true,
        data: {
          originalYaml: yamlString,
          parsedObject,
          objectType: typeof parsedObject,
          isArray: Array.isArray(parsedObject),
          keyCount: parsedObject && typeof parsedObject === 'object' && !Array.isArray(parsedObject) 
            ? Object.keys(parsedObject).length 
            : undefined
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        success: true,
        objectType: typeof parsedObject,
        isArray: Array.isArray(parsedObject),
        yamlLength: yamlString.length
      });
      return response;
    } catch (error) {
      const response: PackageResponse = {
        success: false,
        error: (error as Error).message,
        data: {
          originalYaml: yamlString,
          yamlLength: yamlString.length
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return response;
    }
  }
}
