import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';
import WebSocket from 'ws';
import { createServer } from 'http';

/**
 * Simple ws function for WebSocket operations
 */
export class WsFunctions {
  private readonly packageName = 'ws';

  /**
   * Find an available port starting from the given port
   * @param startPort - Starting port to check
   * @returns Promise<number> - Available port number
   */
  private async findAvailablePort(startPort: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const server = createServer();
      
      const tryPort = (port: number) => {
        server.listen(port, () => {
          const actualPort = (server.address() as any)?.port || port;
          server.close(() => {
            resolve(actualPort);
          });
        });
        
        server.on('error', (err: any) => {
          if (err.code === 'EADDRINUSE' && port < startPort + 100) {
            // Try next port, max 100 attempts
            tryPort(port + 1);
          } else {
            reject(err);
          }
        });
      };
      
      tryPort(startPort);
    });
  }

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
      // Find available port
      const availablePort = await this.findAvailablePort(port);
      if (availablePort !== port) {
        logger.warn({ 
          requestedPort: port, 
          actualPort: availablePort 
        }, 'Requested port was busy, using alternative port');
      }

      // Create WebSocket server with available port
      const wss = new WebSocket.Server({ port: availablePort });
      
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

      // Properly close server after demo with cleanup
      const serverCleanup = () => {
        return new Promise<void>((resolve) => {
          // Close all client connections first
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.terminate();
            }
          });
          
          // Then close the server
          wss.close(() => {
            logger.info({ port: availablePort }, 'WebSocket server closed successfully');
            resolve();
          });
        });
      };

      // Schedule cleanup after demo
      setTimeout(async () => {
        await serverCleanup();
      }, 2000); // Increased timeout for better cleanup

      const response: PackageResponse = {
        success: true,
        data: {
          serverPort: availablePort,
          requestedPort: port,
          portChanged: availablePort !== port,
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
        requestedPort: port,
        actualPort: availablePort,
        serverCreated: true,
        connectionCount,
        messagesCount: messages.length
      });
      return response;
    } catch (error) {
      const errorMessage = (error as Error).message;
      const isPortError = errorMessage.includes('EADDRINUSE') || errorMessage.includes('address already in use');
      
      const response: PackageResponse = {
        success: false,
        error: isPortError 
          ? `Port ${port} is busy. Try using a different port or wait for the current process to release it.`
          : errorMessage,
        data: { 
          requestedPort: port,
          errorType: isPortError ? 'PORT_CONFLICT' : 'GENERAL_ERROR',
          suggestion: isPortError 
            ? 'Use a different WS_PORT environment variable or kill processes using port ' + port
            : 'Check server logs for more details'
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return response;
    }
  }
}
