import { Db, Collection } from 'mongodb';
import { logger } from '../utils/logger';
import { mongoConnection } from './mongodb-connection';

interface PackageLog {
  packageName: string;
  status: 'success' | 'failed' | 'skipped';
  timestamp: Date;
  duration?: number;
  error?: string;
  details?: string;
  sessionId: string;
}

interface DemoSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  totalPackages: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  status: 'running' | 'completed' | 'failed';
}

export class DemoLogger {
  private db: Db | null = null;
  private packageLogsCollection: Collection<PackageLog> | null = null;
  private demoSessionsCollection: Collection<DemoSession> | null = null;
  private sessionId: string;
  private sessionStartTime: Date;
  private isConnected: boolean = false;

  private readonly PACKAGE_LOGS_COLLECTION = 'package_logs';
  private readonly DEMO_SESSIONS_COLLECTION = 'demo_sessions';

  constructor(sessionPrefix?: string) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    if (sessionPrefix) {
      this.sessionId = `${sessionPrefix}-session-${timestamp}-${randomId}`;
    } else {
      this.sessionId = `session-${timestamp}-${randomId}`;
    }

    this.sessionStartTime = new Date();
    logger.info(`📝 Session ID: ${this.sessionId}`);
  }

  /**
   * Initialize MongoDB connection for logging (uses shared connection)
   */
  public async connect(): Promise<void> {
    try {
      logger.info('📝 Initializing demo logger (using shared MongoDB connection)...');
      
      // Use shared MongoDB connection
      this.db = mongoConnection.getDatabase();
      this.packageLogsCollection = this.db.collection<PackageLog>(this.PACKAGE_LOGS_COLLECTION);
      this.demoSessionsCollection = this.db.collection<DemoSession>(this.DEMO_SESSIONS_COLLECTION);

      // Create indexes
      await this.packageLogsCollection.createIndex({ timestamp: -1 });
      await this.packageLogsCollection.createIndex({ sessionId: 1 });
      await this.packageLogsCollection.createIndex({ packageName: 1 });
      await this.demoSessionsCollection.createIndex({ startTime: -1 });

      this.isConnected = true;
      logger.info(`✅ Demo logger initialized [Session: ${this.sessionId}]`);
    } catch (error) {
      logger.error(`❌ Failed to initialize demo logger: ${(error as Error).message}`);
      // Don't throw - allow demo to continue without logging
      this.isConnected = false;
    }
  }

  /**
   * Start a new demo session
   */
  public async startSession(totalPackages: number = 22): Promise<void> {
    if (!this.isConnected || !this.demoSessionsCollection) {
      return;
    }

    try {
      const session: DemoSession = {
        sessionId: this.sessionId,
        startTime: this.sessionStartTime,
        totalPackages,
        successCount: 0,
        failedCount: 0,
        skippedCount: 0,
        status: 'running',
      };

      await this.demoSessionsCollection.insertOne(session);
      logger.info(`📊 Demo session started [${this.sessionId}] - Testing ${totalPackages} packages`);
    } catch (error) {
      logger.error(`❌ Failed to start demo session: ${(error as Error).message}`);
    }
  }

  /**
   * Log a package execution result
   */
  public async logPackage(
    packageName: string, 
    status: 'success' | 'failed' | 'skipped',
    duration?: number,
    error?: string,
    details?: string
  ): Promise<void> {
    if (!this.isConnected || !this.packageLogsCollection) {
      return;
    }

    try {
      const log: PackageLog = {
        packageName,
        status,
        timestamp: new Date(),
        duration,
        error,
        details,
        sessionId: this.sessionId,
      };

      await this.packageLogsCollection.insertOne(log);
      
      const statusEmoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⏭️';
      logger.info(`${statusEmoji} Logged: ${packageName} - ${status}${duration ? ` (${duration}ms)` : ''}`);
    } catch (error) {
      logger.error(`❌ Failed to log package ${packageName}: ${(error as Error).message}`);
    }
  }

  /**
   * End the demo session with final statistics
   */
  public async endSession(successCount: number, failedCount: number, skippedCount: number = 0): Promise<void> {
    if (!this.isConnected || !this.demoSessionsCollection) {
      return;
    }

    try {
      await this.demoSessionsCollection.updateOne(
        { sessionId: this.sessionId },
        {
          $set: {
            endTime: new Date(),
            successCount,
            failedCount,
            skippedCount,
            status: failedCount > 0 ? 'failed' : 'completed',
          },
        }
      );

      logger.info(`📊 Demo session completed [${this.sessionId}]`);
      logger.info(`   ✅ Success: ${successCount} | ❌ Failed: ${failedCount} | ⏭️  Skipped: ${skippedCount}`);
    } catch (error) {
      logger.error(`❌ Failed to end demo session: ${(error as Error).message}`);
    }
  }

  /**
   * Wrapper to execute and log a package example
   */
  public async executeAndLog<T>(
    packageName: string,
    executionFunction: () => Promise<T>,
    skipOnError: boolean = true
  ): Promise<{ success: boolean; duration: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      await executionFunction();
      const duration = Date.now() - startTime;
      await this.logPackage(packageName, 'success', duration);
      return { success: true, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = (error as Error).message;
      await this.logPackage(packageName, 'failed', duration, errorMessage);
      
      if (!skipOnError) {
        throw error;
      }
      
      return { success: false, duration, error: errorMessage };
    }
  }

  /**
   * Cleanup (doesn't close shared connection)
   */
  public async disconnect(): Promise<void> {
    // Just cleanup references, don't close shared connection
    this.db = null;
    this.packageLogsCollection = null;
    this.demoSessionsCollection = null;
    this.isConnected = false;
    logger.info('✅ Demo logger cleanup completed');
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Check if logger is connected
   */
  public isLoggerConnected(): boolean {
    return this.isConnected;
  }
}

export default DemoLogger;

