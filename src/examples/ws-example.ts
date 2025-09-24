import { WsFunctions } from '../packages/ws-functions';
import { logger } from '../utils/logger';

/**
 * Simple example usage of ws (WebSocket) package
 */
export class WsExample {
  private wsFunctions: WsFunctions;

  constructor() {
    this.wsFunctions = new WsFunctions();
  }

  /**
   * Demonstrates WebSocket server creation and basic functionality
   */
  public async demonstrateWebSocket(): Promise<void> {
    logger.info('=== WS Simple WebSocket Example ===');

    try {
      // Create WebSocket server demo
      const port = parseInt(process.env.WS_PORT || '8080');
      
      logger.info({
        port,
        action: 'creating_websocket_server'
      }, 'Starting WebSocket server demonstration');

      const wsResult = await this.wsFunctions.createWebSocketDemo(port);

      logger.info({
        success: wsResult.success,
        duration: wsResult.duration
      }, 'WebSocket Demo completed');

      if (wsResult.success) {
        logger.info({
          serverPort: wsResult.data?.serverPort,
          serverCreated: wsResult.data?.serverCreated,
          connectionCount: wsResult.data?.connectionCount,
          messagesExchanged: wsResult.data?.messagesExchanged,
          clientsConnected: wsResult.data?.serverInfo?.clientsConnected
        }, 'WebSocket server demonstration completed successfully');

        // Show server information
        logger.info({
          serverAddress: wsResult.data?.serverInfo?.address,
          serverOptions: wsResult.data?.serverInfo?.serverOptions,
          demonstration: wsResult.data?.demonstration
        }, 'WebSocket server information');

        // Show sample messages if any
        if (wsResult.data?.messages && wsResult.data.messages.length > 0) {
          logger.info({
            messageCount: wsResult.data.messages.length,
            sampleMessages: wsResult.data.messages.map((msg: any) => ({
              type: msg.type,
              timestamp: msg.timestamp,
              messagePreview: msg.message.length > 50 ? 
                msg.message.substring(0, 50) + '...' : msg.message
            }))
          }, 'Sample WebSocket messages');
        }

        // Demonstrate WebSocket capabilities
        logger.info({
          capabilities: [
            'Real-time bidirectional communication',
            'Connection management',
            'Message broadcasting',
            'Error handling',
            'Connection lifecycle events'
          ],
          useCase: 'Perfect for real-time applications, chat systems, live updates'
        }, 'WebSocket capabilities demonstrated');

      } else {
        logger.error({
          error: wsResult.error,
          port
        }, 'WebSocket server creation failed');
      }

    } catch (error) {
      logger.error({ error }, 'WebSocket demonstration failed');
    }
  }

  /**
   * Run the ws example
   */
  public async runExample(): Promise<void> {
    logger.info('Starting WS Example');
    await this.demonstrateWebSocket();
    logger.info('Completed WS Example');
  }
}

/**
 * Note: Disabled for bundled builds to prevent auto-execution
 */
