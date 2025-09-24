declare module 'pino-debug' {
  import { Logger } from 'pino';
  
  function pinoDebug(logger: Logger, options?: any): void;
  export = pinoDebug;
}
