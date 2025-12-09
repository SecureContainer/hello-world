import { MongoClient, Db } from 'mongodb';
import { logger } from '../utils/logger';

/**
 * Singleton MongoDB Connection Manager
 * Provides a shared MongoDB connection for all services
 */
class MongoDBConnectionManager {
  private static instance: MongoDBConnectionManager;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private readonly CONNECTION_URI: string;
  private readonly DATABASE_NAME: string;

  private constructor() {
    this.CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.DATABASE_NAME = process.env.MONGODB_DATABASE || 'packagetest';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MongoDBConnectionManager {
    if (!MongoDBConnectionManager.instance) {
      MongoDBConnectionManager.instance = new MongoDBConnectionManager();
    }
    return MongoDBConnectionManager.instance;
  }

  /**
   * Connect to MongoDB (singleton connection)
   */
  public async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.isConnected && this.client && this.db) {
      return;
    }

    // If connection is in progress, wait for it
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Create new connection
    this.connectionPromise = this._connect();
    return this.connectionPromise;
  }

  private async _connect(): Promise<void> {
    try {
      logger.info('🔌 Connecting to MongoDB (shared connection)...');
      logger.info(`   URI: ${this.CONNECTION_URI.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@')}`);
      
      this.client = new MongoClient(this.CONNECTION_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });

      await this.client.connect();
      this.db = this.client.db(this.DATABASE_NAME);

      // Test connection
      await this.db.command({ ping: 1 });

      this.isConnected = true;
      logger.info(`✅ MongoDB connected successfully [Database: ${this.DATABASE_NAME}]`);
      logger.info('   📊 Shared connection available for all services');
    } catch (error) {
      this.isConnected = false;
      this.connectionPromise = null;
      logger.error(`❌ Failed to connect to MongoDB: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get MongoDB database instance
   */
  public getDatabase(): Db {
    if (!this.db || !this.isConnected) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Get MongoDB client instance
   */
  public getClient(): MongoClient {
    if (!this.client || !this.isConnected) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return this.client;
  }

  /**
   * Check if connected
   */
  public isConnectionActive(): boolean {
    return this.isConnected;
  }

  /**
   * Get database name
   */
  public getDatabaseName(): string {
    return this.DATABASE_NAME;
  }

  /**
   * Close MongoDB connection
   * Note: This should only be called when shutting down the entire application
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        this.isConnected = false;
        this.client = null;
        this.db = null;
        this.connectionPromise = null;
        logger.info('✅ MongoDB connection closed');
      } catch (error) {
        logger.error(`❌ Error closing MongoDB connection: ${(error as Error).message}`);
      }
    }
  }
}

// Export singleton instance
export const mongoConnection = MongoDBConnectionManager.getInstance();

