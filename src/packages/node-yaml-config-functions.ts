import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Import node-yaml-config
const yamlConfig = require('node-yaml-config');

/**
 * Simple node-yaml-config function for loading YAML configuration files
 */
export class NodeYamlConfigFunctions {
  private readonly packageName = 'node-yaml-config';

  /**
   * Loads a YAML configuration file and returns the parsed configuration
   * @param configPath - Path to the YAML configuration file
   * @param environment - Optional environment to load (e.g., 'development', 'production')
   * @returns Promise<PackageResponse> - Response containing the loaded configuration
   */
  public async loadConfig(configPath: string, environment?: string): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'loadConfig',
      packageName: this.packageName,
      parameters: { 
        configPath,
        environment: environment || 'default',
        hasEnvironment: !!environment
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Check if config file exists
      const fullPath = path.resolve(configPath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Configuration file not found: ${fullPath}`);
      }

      // Load configuration using node-yaml-config
      let config;
      try {
        if (environment && environment !== 'default') {
          // Load with specific environment
          config = yamlConfig.load(configPath, environment);
        } else {
          // Load default configuration - try different approaches
          config = yamlConfig.load(configPath);
          
          // If config is empty, try loading without environment
          if (!config || Object.keys(config).length === 0) {
            // Fallback: read and parse the YAML file directly
            const yamlContent = fs.readFileSync(fullPath, 'utf8');
            const yaml = require('js-yaml');
            config = yaml.load(yamlContent);
          }
        }
      } catch (loadError) {
        // Fallback to direct YAML parsing if node-yaml-config fails
        const yamlContent = fs.readFileSync(fullPath, 'utf8');
        const yaml = require('js-yaml');
        config = yaml.load(yamlContent);
      }

      // Analyze the loaded configuration
      const configAnalysis = {
        type: typeof config,
        isObject: typeof config === 'object' && config !== null,
        isArray: Array.isArray(config),
        keyCount: (typeof config === 'object' && config !== null && !Array.isArray(config)) 
          ? Object.keys(config).length : null,
        keys: (typeof config === 'object' && config !== null && !Array.isArray(config)) 
          ? Object.keys(config) : null,
        hasNestedObjects: false
      };

      // Check for nested objects
      if (configAnalysis.isObject && !configAnalysis.isArray) {
        configAnalysis.hasNestedObjects = Object.values(config).some(
          value => typeof value === 'object' && value !== null
        );
      }

      const response: PackageResponse = {
        success: true,
        data: {
          configPath: fullPath,
          environment: environment || 'default',
          config,
          analysis: configAnalysis,
          fileInfo: {
            exists: true,
            size: fs.statSync(fullPath).size,
            lastModified: fs.statSync(fullPath).mtime.toISOString()
          }
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        configPath,
        environment: environment || 'default',
        configLoaded: true,
        keyCount: configAnalysis.keyCount,
        hasNestedObjects: configAnalysis.hasNestedObjects
      });
      return response;
    } catch (error) {
      const response: PackageResponse = {
        success: false,
        error: (error as Error).message,
        data: {
          configPath,
          environment: environment || 'default',
          fileExists: fs.existsSync(path.resolve(configPath))
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return response;
    }
  }

  /**
   * Creates a sample YAML configuration file for demonstration
   * @param outputPath - Path where to create the sample config file
   * @returns Promise<PackageResponse> - Response containing file creation result
   */
  public async createSampleConfig(outputPath: string): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'createSampleConfig',
      packageName: this.packageName,
      parameters: { outputPath },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Sample YAML configuration content
      const sampleConfig = `# Sample Application Configuration
app:
  name: "PackageTest Application"
  version: "1.0.0"
  port: 3000
  environment: development

database:
  host: localhost
  port: 5432
  name: packagetest_db
  username: admin
  password: secret123
  ssl: false
  pool:
    min: 2
    max: 10

logging:
  level: info
  file: "./logs/app.log"
  console: true
  format: json

cache:
  enabled: true
  ttl: 3600
  provider: redis
  redis:
    host: localhost
    port: 6379
    db: 0

features:
  - authentication
  - logging
  - caching
  - monitoring

api:
  baseUrl: "http://localhost:3000"
  timeout: 30000
  retries: 3
  endpoints:
    users: "/api/users"
    posts: "/api/posts"
    health: "/health"
`;

      // Write the sample configuration file
      const fullPath = path.resolve(outputPath);
      fs.writeFileSync(fullPath, sampleConfig, 'utf8');

      const response: PackageResponse = {
        success: true,
        data: {
          outputPath: fullPath,
          configContent: sampleConfig,
          fileSize: fs.statSync(fullPath).size,
          linesCount: sampleConfig.split('\n').length,
          sectionsIncluded: ['app', 'database', 'logging', 'cache', 'features', 'api']
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        outputPath: fullPath,
        fileCreated: true,
        fileSize: response.data.fileSize
      });
      return response;
    } catch (error) {
      const response: PackageResponse = {
        success: false,
        error: (error as Error).message,
        data: { outputPath },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return response;
    }
  }
}
