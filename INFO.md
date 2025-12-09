## 📋 Information about 22 utilized packages

### AxiosFunctions Class

#### `httpGet(url: string): Promise<PackageResponse>`
Performs a simple HTTP GET request using axios.

**Parameters:**
- `url`: The URL to make the GET request to

**Returns:** Promise resolving to a PackageResponse with the response data

### UuidFunctions Class

#### `generateUuid(): Promise<PackageResponse>`
Generates a random UUID v4 using the uuid package.

**Parameters:** None

**Returns:** Promise resolving to a PackageResponse with the generated UUID string

### LodashFunctions Class

#### `capitalizeString(text: string): Promise<PackageResponse>`
Capitalizes the first character of a string using lodash.

**Parameters:**
- `text`: The string to capitalize

**Returns:** Promise resolving to a PackageResponse with the capitalized string

### MomentFunctions Class

#### `formatCurrentDate(format?: string): Promise<PackageResponse>`
Formats the current date using moment.js.

**Parameters:**
- `format`: The format string (default: 'YYYY-MM-DD HH:mm:ss')

**Returns:** Promise resolving to a PackageResponse with the formatted date string

### BigFunctions Class

#### `addDecimals(a: string | number, b: string | number): Promise<PackageResponse>`
Performs precise decimal addition using big.js to avoid floating-point precision issues.

**Parameters:**
- `a`: First number (string or number)
- `b`: Second number (string or number)

**Returns:** Promise resolving to a PackageResponse with the precise sum as a string

### DotenvFunctions Class

#### `loadAndReadSecret(envPath?: string, secretKeyName?: string): Promise<PackageResponse>`
Loads environment variables from a .env file and reads a specified secret key.

**Parameters:**
- `envPath`: Path to the .env file (default: 'demo.env')
- `secretKeyName`: Name of the secret key to read (default: 'SECRET_API_KEY')

**Returns:** Promise resolving to a PackageResponse with the secret key value and metadata

### JsonStringifySafeFunctions Class

#### `safeStringify(obj: any, replacer?: any, space?: string | number): Promise<PackageResponse>`
Safely stringifies an object to JSON, handling circular references and other edge cases.

**Parameters:**
- `obj`: The object to stringify
- `replacer`: Optional replacer function or array
- `space`: Optional space parameter for formatting

**Returns:** Promise resolving to a PackageResponse with the safely stringified JSON

### LruCacheFunctions Class

#### `cacheValue(key: string, value: any): Promise<PackageResponse>`
Sets a value in the LRU cache and retrieves it to demonstrate caching functionality.

**Parameters:**
- `key`: The cache key
- `value`: The value to cache

**Returns:** Promise resolving to a PackageResponse with cache operation results and statistics

### Utf8ValidateFunctions Class

#### `validateUtf8(input: string | Buffer): Promise<PackageResponse>`
Validates if a string or buffer contains valid UTF-8 encoded data.

**Parameters:**
- `input`: String or Buffer to validate for UTF-8 compliance

**Returns:** Promise resolving to a PackageResponse with validation result and buffer information

### JsYamlFunctions Class

#### `parseYaml(yamlString: string): Promise<PackageResponse>`
Parses a YAML string into a JavaScript object with comprehensive error handling.

**Parameters:**
- `yamlString`: The YAML string to parse

**Returns:** Promise resolving to a PackageResponse with the parsed object and metadata

### PinoFunctions Class

#### `createLogEntry(level: 'info' | 'error' | 'warn' | 'debug', message: string, data?: any): Promise<PackageResponse>`
Creates structured log entries with different levels and optional data.

**Parameters:**
- `level`: Log level (info, error, warn, debug) - defaults to 'info'
- `message`: The log message to record
- `data`: Optional structured data to include with the log

**Returns:** Promise resolving to a PackageResponse with logging operation results

### BufferutilFunctions Class

#### `maskBuffer(buffer: Buffer, mask: Buffer): Promise<PackageResponse>`
Masks a buffer using WebSocket masking algorithm with a 4-byte mask.

**Parameters:**
- `buffer`: The buffer to mask
- `mask`: 4-byte masking key

**Returns:** Promise resolving to a PackageResponse with the masked buffer

#### `unmaskBuffer(maskedBuffer: Buffer, mask: Buffer): Promise<PackageResponse>`
Unmasks a previously masked buffer using the same 4-byte mask.

**Parameters:**
- `maskedBuffer`: The masked buffer to unmask
- `mask`: 4-byte masking key used originally

**Returns:** Promise resolving to a PackageResponse with the unmasked buffer

### NanFunctions Class

#### `getNanInfo(testValue?: any): Promise<PackageResponse>`
Retrieves nan utilities information and Node.js environment details.

**Parameters:**
- `testValue`: Optional test value to include in the analysis

**Returns:** Promise resolving to a PackageResponse with nan utilities and environment info

#### `analyzeValue(value: any): Promise<PackageResponse>`
Performs detailed type analysis on any JavaScript value (similar to nan utilities for C++ addons).

**Parameters:**
- `value`: Any JavaScript value to analyze

**Returns:** Promise resolving to a PackageResponse with comprehensive type analysis

### NodeYamlConfigFunctions Class

#### `loadConfig(configPath: string, environment?: string): Promise<PackageResponse>`
Loads and parses a YAML configuration file with optional environment-specific loading.

**Parameters:**
- `configPath`: Path to the YAML configuration file
- `environment`: Optional environment to load (e.g., 'development', 'production')

**Returns:** Promise resolving to a PackageResponse with the loaded configuration

#### `createSampleConfig(outputPath: string): Promise<PackageResponse>`
Creates a comprehensive sample YAML configuration file for demonstration purposes.

**Parameters:**
- `outputPath`: Path where to create the sample configuration file

**Returns:** Promise resolving to a PackageResponse with file creation details

### WsFunctions Class

#### `createWebSocketDemo(port?: number): Promise<PackageResponse>`
Creates a WebSocket server demonstration with connection handling, message exchange, and broadcasting.

**Parameters:**
- `port`: Port number for the WebSocket server (default: 8080)

**Returns:** Promise resolving to a PackageResponse with server information and demo results

### PinoDebugFunctions Class

#### `setupDebugLogging(namespace?: string): Promise<PackageResponse>`
Sets up debug logging integration with pino-debug, enabling debug statements to be captured and logged through pino.

**Parameters:**
- `namespace`: Debug namespace to filter messages (default: 'app')

**Returns:** Promise resolving to a PackageResponse with debug configuration and demonstration messages

### RedisFunctions Class

#### `simulateRedisOperations(key: string, value: any, ttlSeconds?: number): Promise<PackageResponse>`
Simulates Redis caching operations (SET/GET/EXISTS/TTL) without requiring a real Redis server connection.

**Parameters:**
- `key`: Cache key for storing/retrieving the value
- `value`: Value to store (string, number, object, etc.)
- `ttlSeconds`: Optional time-to-live in seconds for automatic expiration

**Returns:** Promise resolving to a PackageResponse with cache operations results and statistics

### MongodbFunctions Class

#### `simulateMongoOperations(collectionName?: string): Promise<PackageResponse>`
Simulates MongoDB CRUD operations (insert, find, update, delete, count) without requiring a real MongoDB server connection.

**Parameters:**
- `collectionName`: Name of the collection to operate on (default: 'users')

**Returns:** Promise resolving to a PackageResponse with CRUD operations results, collection statistics, and mock ObjectIds

### PgFunctions Class

#### `simulatePostgresOperations(): Promise<PackageResponse>`
Simulates PostgreSQL SQL operations (CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, JOIN) without requiring a real PostgreSQL server connection.

**Parameters:** None

**Returns:** Promise resolving to a PackageResponse with SQL operations results, database statistics, and table information

### SlonikFunctions Class

#### `simulateSlonikOperations(): Promise<PackageResponse>`
Simulates Slonik type-safe PostgreSQL operations (INSERT, SELECT, UPDATE, transactions) demonstrating sql template literals and parameter binding.

**Parameters:** None

**Returns:** Promise resolving to a PackageResponse with type-safe SQL operations results and slonik concepts demonstration

### SlonikInterceptorQueryLoggingFunctions Class

#### `simulateQueryLoggingInterceptor(): Promise<PackageResponse>`
Simulates Slonik query logging interceptor functionality with before/after hooks, execution time tracking, and error logging.

**Parameters:** None

**Returns:** Promise resolving to a PackageResponse with query logging statistics and interceptor demonstration

### SlonikSqlTagRawFunctions Class

#### `simulateRawSqlTag(): Promise<PackageResponse>`
Simulates Slonik raw SQL tag functionality for dynamic column selection, database functions, and complex expressions.

**Parameters:** None

**Returns:** Promise resolving to a PackageResponse with raw SQL generation examples and security considerations

## 🚀 Production Services

### MongoDB Connection Manager (`src/services/mongodb-connection.ts`)
Singleton connection manager providing a single shared MongoDB connection for all services with connection pooling.

### Binance Price Fetcher (`src/services/binance-price-fetcher.ts`)
Fetches BTC/USDT prices from Binance API every 10 seconds and stores in `btc_prices` collection.

### Demo Logger (`src/services/demo-logger.ts`)
Logs all 22 package executions with duration, status, and errors to `package_logs` and `demo_sessions` collections.

```

### TypeScript Configuration
The project uses strict TypeScript configuration with:
- ES2020 target
- Strict type checking
- Source maps and declarations
- Comprehensive error checking

### Logging Configuration
Structured logging with Pino:
- Automatic function execution tracking
- Error logging with stack traces
- Performance monitoring
- Development-friendly pretty printing

## 📊 Example Output

When running the demo, you'll see structured logs like:
```
[2025-09-13 23:33:05] INFO (PackageTest): Starting axios function: httpGet
    functionName: "httpGet"
    packageName: "axios"
    parameters: { "url": "https://api.example.com/data" }

[2025-09-13 23:33:05] INFO (PackageTest): Completed axios function: httpGet in 495ms
    functionName: "httpGet"
    packageName: "axios"
    duration: 495
    result: "[Object]"
```

## 🧪 Testing

The project includes simple examples that demonstrate:
- ✅ Simple HTTP GET request (axios)
- ✅ Simple UUID v4 generation (uuid)
- ✅ Simple string capitalization (lodash)
- ✅ Simple date formatting (moment)
- ✅ Precise decimal arithmetic (big.js)
- ✅ Environment variable loading with secrets (dotenv)
- ✅ Safe JSON stringification with circular references (json-stringify-safe)
- ✅ LRU cache operations with automatic eviction (lru-cache)
- ✅ UTF-8 validation for strings and buffers (utf-8-validate)
- ✅ YAML parsing with nested structures and error handling (js-yaml)
- ✅ Structured logging with multiple levels and pretty formatting (pino)
- ✅ WebSocket buffer masking and unmasking operations (bufferutil)
- ✅ Native Abstractions with type analysis and environment info (nan)
- ✅ YAML configuration loading with environment support (node-yaml-config)
- ✅ WebSocket server with real-time bidirectional communication (ws)
- ✅ Debug logging integration with namespace filtering (pino-debug)
- ✅ Redis caching operations simulation (SET/GET/TTL/EXISTS) (redis)
- ✅ MongoDB CRUD operations simulation (insert/find/update/delete) (mongodb)
- ✅ PostgreSQL SQL operations simulation (CREATE/INSERT/SELECT/UPDATE/DELETE/JOIN) (pg)
- ✅ Type-safe PostgreSQL operations with sql template literals (slonik)
- ✅ Query execution logging and performance monitoring (slonik-interceptor-query-logging)
- ✅ Raw SQL fragment insertion for dynamic queries (slonik-sql-tag-raw)
- ✅ Error handling and logging
- ✅ Performance monitoring


## 🤝 Development Guidelines

- **Simple Functions**: One basic function per package to demonstrate usage
- **Comprehensive Logging**: Every function logs start/end with parameters and results
- **Error Handling**: Proper try-catch blocks with detailed error information
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Clean Code**: Well-documented, maintainable, and simple code


---

