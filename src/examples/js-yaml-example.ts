import { JsYamlFunctions } from "../packages/js-yaml-functions";
import { logger } from "../utils/logger";

/**
 * Simple example usage of js-yaml YAML parsing
 */
export class JsYamlExample {
  private yamlFunctions: JsYamlFunctions;

  constructor() {
    this.yamlFunctions = new JsYamlFunctions();
  }

  /**
   * Demonstrates simple YAML parsing
   */
  public async demonstrateYamlParsing(): Promise<void> {
    logger.info("=== JS-YAML Simple Parsing Example ===");

    try {
      // Simple YAML example
      const yamlString = 'name: John Doe\nage: 30\ncity: New York\nactive: true';

      const result = await this.yamlFunctions.parseYaml(yamlString);

      logger.info(
        {
          success: result.success,
          duration: result.duration,
        },
        "YAML Parsing completed"
      );

      if (result.success) {
        logger.info(
          {
            objectType: result.data?.objectType,
            keyCount: result.data?.keyCount,
            parsedName: result.data?.parsedObject?.name,
            parsedAge: result.data?.parsedObject?.age,
          },
          "YAML parsed successfully"
        );
      }
    } catch (error) {
      logger.error({ error }, "YAML parsing demonstration failed");
    }
  }

  /**
   * Run the js-yaml example
   */
  public async runExample(): Promise<void> {
    logger.info("Starting JS-YAML Example");
    await this.demonstrateYamlParsing();
    logger.info("Completed JS-YAML Example");
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
