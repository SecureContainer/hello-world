/**
 * Common types and interfaces used across the application
 */

/**
 * Base response interface for all package functions
 */
export interface PackageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  duration: number;
}


/**
 * Database connection configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

/**
 * Redis connection configuration
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  database?: number;
}

/**
 * MongoDB connection configuration
 */
export interface MongoConfig {
  uri: string;
  database: string;
  options?: Record<string, any>;
}

/**
 * WebSocket server configuration
 */
export interface WebSocketConfig {
  port: number;
  host?: string;
  path?: string;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  maxSize?: number;
  ttl?: number;
}

/**
 * File processing configuration
 */
export interface FileConfig {
  encoding?: BufferEncoding;
  maxSize?: number;
}

/**
 * YAML configuration structure
 */
export interface YamlConfig {
  [key: string]: any;
}

/**
 * Environment variables interface
 */
export interface EnvironmentVariables {
  NODE_ENV?: string;
  LOG_LEVEL?: string;
  DATABASE_URL?: string;
  REDIS_URL?: string;
  MONGODB_URI?: string;
  PORT?: string;
  [key: string]: string | undefined;
}

/**
 * Function execution result
 */
export interface ExecutionResult<T = any> {
  result: T;
  executionTime: number;
  success: boolean;
  error?: Error;
}
