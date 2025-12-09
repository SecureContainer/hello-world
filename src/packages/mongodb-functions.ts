// Real MongoDB package import
import { MongoClient, Db } from 'mongodb';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

export class MongoDBFunctions {
  private readonly packageName = 'mongodb';
  private connectionUri: string;
  private databaseName: string;

  constructor() {
    // Get MongoDB URI from environment variable, fallback to default
    this.connectionUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.databaseName = process.env.MONGODB_DATABASE || 'test';
  }

  /**
   * Simple MongoDB connection test - checks if MongoDB package works and URI is correct
   */
  public async testMongoDBConnection(): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'testMongoDBConnection',
      packageName: this.packageName,
      parameters: { 
        connectionUri: this.connectionUri.replace(/\/\/.*:.*@/, '//***:***@'), // Hide credentials in logs
        databaseName: this.databaseName 
      },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      logger.info(`Testing MongoDB connection: ${this.connectionUri.replace(/\/\/.*:.*@/, '//***:***@')}`);
      
      // Create MongoDB client
      const mongoClient = new MongoClient(this.connectionUri, {
        serverSelectionTimeoutMS: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
        connectTimeoutMS: parseInt(process.env.DB_CONNECTION_TIMEOUT || '3000'),
      });

      let connected = false;
      let error: string | null = null;
      let serverInfo: any = null;

      try {
        // Try to connect
        await mongoClient.connect();
        
        // Get database reference
        const db: Db = mongoClient.db(this.databaseName);
        
        // Simple ping test - run admin command to test connection
        const adminDb = mongoClient.db('admin');
        const pingResult = await adminDb.command({ ping: 1 });
        
        if (pingResult.ok === 1) {
          connected = true;
          
          // Get server info for additional details
          try {
            const buildInfo = await adminDb.command({ buildInfo: 1 });
            serverInfo = {
              version: buildInfo.version,
              platform: buildInfo.platform
            };
          } catch (infoError) {
            // Server info is nice to have but not critical
            logger.debug(`Could not retrieve server info: ${(infoError as Error).message}`);
          }
        }
        
        // Close connection
        await mongoClient.close();
        
      } catch (connError) {
        error = (connError as Error).message;
        connected = false;
        
        // Try to close connection even if there was an error
        try {
          await mongoClient.close();
        } catch (closeError) {
          // Ignore close errors
        }
      }

      const result: PackageResponse = {
        success: true,
        data: {
          packageInstalled: true,
          connectionUri: this.connectionUri.replace(/\/\/.*:.*@/, '//***:***@'), // Hide credentials
          databaseName: this.databaseName,
          connected,
          error,
          serverInfo,
          message: connected 
            ? `✅ MongoDB package works and connection URI is correct! ${serverInfo ? `(Server: MongoDB ${serverInfo.version})` : ''}` 
            : `❌ MongoDB package installed but connection failed: ${error}. Check if MongoDB server is running and URI is correct.`
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { connected, packageWorking: true, serverInfo });
      return result;

    } catch (error) {
      const result: PackageResponse = {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return result;
    }
  }
}
