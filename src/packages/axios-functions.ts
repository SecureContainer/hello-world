import axios, { AxiosResponse, AxiosError } from 'axios';
import { logger, logFunctionStart, logFunctionEnd, FunctionContext } from '../utils/logger';
import { PackageResponse } from '../types';

/**
 * Simple axios function for HTTP GET requests
 */
export class AxiosFunctions {
  private readonly packageName = 'axios';

  /**
   * Performs a simple HTTP GET request using axios
   * @param url - The URL to make the GET request to
   * @returns Promise<PackageResponse> - Response containing the data or error information
   */
  public async httpGet(url: string): Promise<PackageResponse> {
    const context: FunctionContext = {
      functionName: 'httpGet',
      packageName: this.packageName,
      parameters: { url },
      startTime: Date.now()
    };

    logFunctionStart(context);

    try {
      const response: AxiosResponse = await axios.get(url);

      const result: PackageResponse = {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, { status: response.status });
      return result;
    } catch (error) {
      const axiosError = error as AxiosError;
      const result: PackageResponse = {
        success: false,
        error: axiosError.message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - context.startTime
      };

      logFunctionEnd(context, undefined, axiosError);
      return result;
    }
  }
}
