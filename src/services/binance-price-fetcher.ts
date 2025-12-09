import { Db, Collection } from 'mongodb';
import axios from 'axios';
import { logger } from '../utils/logger';
import { mongoConnection } from './mongodb-connection';

interface BinanceResponse {
  symbol: string;
  price: string;
}

interface PriceDocument {
  symbol: string;
  price: string;
  priceNumeric: number;
  timestamp: Date;
  fetchedAt: Date;
}

export class BinancePriceFetcher {
  private db: Db | null = null;
  private collection: Collection<PriceDocument> | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private startingValue: number | null = null;

  private readonly COIN_PAIR: string;
  private readonly BINANCE_API_URL: string;
  private readonly FETCH_INTERVAL_MS = 10000; // 10 seconds
  private readonly COLLECTION_NAME = 'coin_prices';
  private readonly PRICE_CHANGE_THRESHOLD = 0.001; // App will shut down when prices moves more than the threshold (fraction of starting value) 

  constructor() {
    // Read COIN_PAIR from environment variable
    this.COIN_PAIR = process.env.COIN_PAIR || 'BTCUSDT';
    this.BINANCE_API_URL = `https://api.binance.com/api/v3/ticker/price?symbol=${this.COIN_PAIR}`;

    logger.info(`💰 Binance Price Fetcher initialized for ${this.COIN_PAIR}`);
  }

  /**
   * Initialize MongoDB connection (uses shared connection)
   */
  private async connectToDatabase(): Promise<void> {
    try {
      logger.info('🔗 Initializing Binance service (using shared MongoDB connection)...');
      
      // Use shared MongoDB connection
      this.db = mongoConnection.getDatabase();
      this.collection = this.db.collection<PriceDocument>(this.COLLECTION_NAME);

      // Create indexes for efficient querying
      await this.collection.createIndex({ timestamp: -1 });
      await this.collection.createIndex({ fetchedAt: -1 });

      const dbName = mongoConnection.getDatabaseName();
      logger.info(`✅ Binance service initialized [Database: ${dbName}, Collection: ${this.COLLECTION_NAME}]`);
    } catch (error) {
      console.log(error);
      logger.error(`❌ Failed to initialize Binance service: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Fetch Bitcoin price from Binance API
   */
  private async fetchPrice(): Promise<BinanceResponse> {
    try {
      const response = await axios.get<BinanceResponse>(this.BINANCE_API_URL, {
        timeout: 5000,
      });
      
      return response.data;
    } catch (error) {
      logger.error(`❌ Failed to fetch price from Binance: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Save price data to MongoDB
   */
  private async savePrice(data: BinanceResponse): Promise<void> {
    if (!this.collection) {
      throw new Error('MongoDB collection not initialized');
    }

    try {
      const document: PriceDocument = {
        symbol: data.symbol,
        price: data.price,
        priceNumeric: parseFloat(data.price),
        timestamp: new Date(),
        fetchedAt: new Date(),
      };

      await this.collection.insertOne(document);
      logger.info(`💾 Saved to DB: ${data.symbol} = $${data.price}`);
    } catch (error) {
      logger.error(`❌ Failed to save price to database: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Fetch and store price - main execution logic
   */
  private async fetchAndStore(): Promise<void> {
    try {
      const priceData = await this.fetchPrice();
      const currentPrice = parseFloat(priceData.price);
      logger.info(`📊 Fetched: ${priceData.symbol} = $${priceData.price}`);

      // Set starting value on first fetch
      if (this.startingValue === null) {
        this.startingValue = currentPrice;
        logger.info(`🎯 Starting value set: $${this.startingValue}`);
      } else {
        // Check if price has moved 1% from starting value
        const priceChange = Math.abs((currentPrice - this.startingValue) / this.startingValue);

        if (priceChange >= this.PRICE_CHANGE_THRESHOLD) {
          const percentChange = (priceChange * 100).toFixed(2);
          logger.info(`🚨 Price moved ${percentChange}% from starting value ($${this.startingValue} → $${currentPrice})`);
          logger.info(`✅ Exiting application (threshold: ${this.PRICE_CHANGE_THRESHOLD * 100}%)`);

          await this.savePrice(priceData);
          await this.stop();
          process.exit(0);
        }
      }

      await this.savePrice(priceData);
    } catch (error) {
      logger.error(`❌ Error in fetch and store cycle: ${(error as Error).message}`);
      // Don't throw - let the interval continue even if one fetch fails
    }
  }

  /**
   * Start the price fetching service
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('⚠️  Service is already running');
      return;
    }

    try {
      logger.info('🚀 Starting Binance BTC Price Fetcher Service...');
      
      await this.connectToDatabase();
      
      // Fetch immediately on start
      await this.fetchAndStore();
      
      // Then set up interval for subsequent fetches
      this.intervalId = setInterval(async () => {
        await this.fetchAndStore();
      }, this.FETCH_INTERVAL_MS);

      this.isRunning = true;
      logger.info(`✅ Service started - Fetching every ${this.FETCH_INTERVAL_MS / 1000} seconds`);
      logger.info('Press Ctrl+C to stop the service');
    } catch (error) {
      logger.error(`❌ Failed to start service: ${(error as Error).message}`);
      await this.stop();
      throw error;
    }
  }

  /**
   * Stop the price fetching service
   */
  public async stop(): Promise<void> {
    logger.info('🛑 Stopping Binance BTC Price Fetcher Service...');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Just cleanup references, don't close shared connection
    this.db = null;
    this.collection = null;
    this.isRunning = false;
    
    logger.info('✅ Binance service stopped');
  }

  /**
   * Get service status
   */
  public getStatus(): { isRunning: boolean; interval: number } {
    return {
      isRunning: this.isRunning,
      interval: this.FETCH_INTERVAL_MS,
    };
  }
}

export default BinancePriceFetcher;

