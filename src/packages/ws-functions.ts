import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';
import WebSocket from 'ws';

/**
 * Simple ws function for WebSocket operations
 */
export class WsFunctions {
  private readonly packageName = 'ws';

  /**
   * Creates a simple WebSocket server and demonstrates basic functionality
   * @param port - Port number for the WebSocket server (default: from WS_PORT env or 8080)
   * @returns Promise<PackageResponse> - Response containing server information and demo results
   */
  public async createWebSocketDemo(port: number = parseInt(process.env.WS_PORT || '8080')): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'createWebSocketDemo',
      packageName: this.packageName,
      parameters: { port },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Create WebSocket server
      const wss = new WebSocket.Server({ port });
      
      let connectionCount = 0;
      const messages: Array<{timestamp: string, message: string, type: string}> = [];

      // Set up connection handler
      wss.on('connection', (ws) => {
        connectionCount++;
        const connectionId = connectionCount;
        
        logger.info({
          connectionId,
          totalConnections: wss.clients.size
        }, 'WebSocket client connected');

        // Send welcome message
        const welcomeMsg = JSON.stringify({
          type: 'welcome',
          message: `Welcome! You are connection #${connectionId}`,
          timestamp: new Date().toISOString(),
          connectionId
        });
        
        ws.send(welcomeMsg);
        messages.push({
          timestamp: new Date().toISOString(),
          message: welcomeMsg,
          type: 'sent'
        });

        // Handle incoming messages
        ws.on('message', (data) => {
          const message = data.toString();
          logger.info({
            connectionId,
            message: message.length > 100 ? message.substring(0, 100) + '...' : message
          }, 'WebSocket message received');

          messages.push({
            timestamp: new Date().toISOString(),
            message,
            type: 'received'
          });

          // Echo the message back
          const echoMsg = JSON.stringify({
            type: 'echo',
            originalMessage: message,
            timestamp: new Date().toISOString(),
            connectionId
          });
          
          ws.send(echoMsg);
          messages.push({
            timestamp: new Date().toISOString(),
            message: echoMsg,
            type: 'sent'
          });
        });

        // Handle connection close
        ws.on('close', () => {
          logger.info({
            connectionId,
            remainingConnections: wss.clients.size
          }, 'WebSocket client disconnected');
        });

        // Handle errors
        ws.on('error', (error) => {
          logger.error({
            connectionId,
            error: error.message
          }, 'WebSocket connection error');
        });
      });

      // Send a test message to demonstrate the server is working
      setTimeout(() => {
        if (wss.clients.size > 0) {
          const broadcastMsg = JSON.stringify({
            type: 'broadcast',
            message: 'This is a broadcast message to all connected clients',
            timestamp: new Date().toISOString(),
            clientCount: wss.clients.size
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          });

          messages.push({
            timestamp: new Date().toISOString(),
            message: broadcastMsg,
            type: 'broadcast'
          });
        }
      }, 100);

      // Close server after demo (to avoid keeping it running)
      setTimeout(() => {
        wss.close();
      }, 1000);

      const response: PackageResponse = {
        success: true,
        data: {
          serverPort: port,
          serverCreated: true,
          connectionCount,
          messagesExchanged: messages.length,
          messages: messages.slice(0, 5), // Show first 5 messages
          serverInfo: {
            address: wss.address(),
            clientsConnected: wss.clients.size,
            serverOptions: Object.keys(wss.options).length > 0 ? 'configured' : 'default'
          },
          demonstration: 'WebSocket server created, handled connections, and exchanged messages'
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        port,
        serverCreated: true,
        connectionCount,
        messagesCount: messages.length
      });
      return response;
    } catch (error) {
      const response: PackageResponse = {
        success: false,
        error: (error as Error).message,
        data: { port },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return response;
    }
  }
}
