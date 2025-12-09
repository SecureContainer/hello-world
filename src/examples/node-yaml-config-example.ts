import { NodeYamlConfigFunctions } from '../packages/node-yaml-config-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of node-yaml-config for YAML configuration loading
 */
export class NodeYamlConfigExample {
  private yamlConfigFunctions: NodeYamlConfigFunctions;

  constructor() {
    this.yamlConfigFunctions = new NodeYamlConfigFunctions();
  }

  /**
   * Demonstrates YAML configuration loading and management
   */
  public async demonstrateYamlConfig(): Promise<void> {
    logger.info('=== Node-YAML-Config Simple Configuration Loading Example ===');

    try {
      // Step 1: Create a sample configuration file
      const sampleConfigPath = 'demo-config.yml';
      
      logger.info({
        configPath: sampleConfigPath,
        action: 'creating_sample'
      }, 'Creating sample YAML configuration file');

      const createResult = await this.yamlConfigFunctions.createSampleConfig(sampleConfigPath);

      logger.info({
        success: createResult.success,
        duration: createResult.duration
      }, 'Sample Config Creation completed');

      if (createResult.success) {
        logger.info({
          outputPath: createResult.data?.outputPath,
          fileSize: createResult.data?.fileSize,
          linesCount: createResult.data?.linesCount,
          sectionsIncluded: createResult.data?.sectionsIncluded
        }, 'Sample configuration file created successfully');

        // Step 2: Load the configuration file
        const loadResult = await this.yamlConfigFunctions.loadConfig(sampleConfigPath);

        logger.info({
          success: loadResult.success,
          duration: loadResult.duration
        }, 'Configuration Loading completed');

        if (loadResult.success) {
          logger.info({
            configPath: loadResult.data?.configPath,
            environment: loadResult.data?.environment,
            keyCount: loadResult.data?.analysis?.keyCount,
            hasNestedObjects: loadResult.data?.analysis?.hasNestedObjects,
            topLevelKeys: loadResult.data?.analysis?.keys
          }, 'Configuration loaded and analyzed successfully');

          // Display some specific configuration values
          const config = loadResult.data?.config;
          if (config) {
            logger.info({
              appName: config.app?.name,
              appVersion: config.app?.version,
              appPort: config.app?.port,
              dbHost: config.database?.host,
              dbPort: config.database?.port,
              logLevel: config.logging?.level,
              cacheEnabled: config.cache?.enabled,
              featuresCount: Array.isArray(config.features) ? config.features.length : 0
            }, 'Configuration values extracted successfully');

            // Show API endpoints
            if (config.api?.endpoints) {
              logger.info({
                apiBaseUrl: config.api?.baseUrl,
                apiTimeout: config.api?.timeout,
                availableEndpoints: Object.keys(config.api.endpoints),
                endpointCount: Object.keys(config.api.endpoints).length
              }, 'API configuration loaded');
            }

            // Show database pool settings
            if (config.database?.pool) {
              logger.info({
                poolMin: config.database.pool.min,
                poolMax: config.database.pool.max,
                sslEnabled: config.database.ssl
              }, 'Database pool configuration loaded');
            }
          }
        }

        // Step 3: Demonstrate environment-specific loading (will use default since we don't have env-specific config)
        const envLoadResult = await this.yamlConfigFunctions.loadConfig(sampleConfigPath, 'development');

        if (envLoadResult.success) {
          logger.info({
            environment: envLoadResult.data?.environment,
            configType: envLoadResult.data?.analysis?.type,
            sameAsDefault: JSON.stringify(envLoadResult.data?.config) === JSON.stringify(loadResult.data?.config)
          }, 'Environment-specific configuration loaded');
        }
      }

    } catch (error) {
      logger.error({ error }, 'Node-YAML-Config demonstration failed');
    }
  }

  /**
   * Run the node-yaml-config example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting Node-YAML-Config Example');
    await this.demonstrateYamlConfig();
    logger.info('Completed Node-YAML-Config Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
