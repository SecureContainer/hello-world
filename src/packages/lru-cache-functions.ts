import { LRUCache } from 'lru-cache';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple LRU cache function for caching key-value pairs
 */
export class LruCacheFunctions {
  private readonly packageName = 'lru-cache';
  private cache: LRUCache<string, any>;

  constructor() {
    // Initialize cache with a maximum of 100 items
    this.cache = new LRUCache<string, any>({
      max: 100,
      ttl: 1000 * 60 * 5 // 5 minutes TTL
    });
  }

  /**
   * Sets a value in the cache and retrieves it to demonstrate caching
   * @param key - The cache key
   * @param value - The value to cache
   * @returns Promise<PackageResponse> - Response containing cache operation results
   */
  public async cacheValue(key: string, value: any): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'cacheValue',
      packageName: this.packageName,
      parameters: { key, valueType: typeof value },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      // Set the value in cache
      this.cache.set(key, value);
      
      // Immediately retrieve it to demonstrate it's cached
      const cachedValue = this.cache.get(key);
      
      // Get cache statistics
      const cacheStats = {
        size: this.cache.size,
        max: this.cache.max,
        has: this.cache.has(key),
        calculatedLength: this.cache.calculatedSize
      };

      const response: PackageResponse = {
        success: true,
        data: {
          key,
          originalValue: value,
          cachedValue,
          cacheHit: cachedValue !== undefined,
          cacheStats
        },
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { 
        key, 
        cached: true, 
        cacheSize: this.cache.size,
        cacheHit: true
      });
      return response;
    } catch (error) {
      const response: PackageResponse = {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, error as Error);
      return response;
    }
  }
}
