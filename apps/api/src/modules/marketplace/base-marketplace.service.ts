import { Logger } from '@nestjs/common';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
}

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

export abstract class BaseMarketplaceService {
  protected readonly logger: Logger;

  private readonly requestTimestamps: number[] = [];
  private readonly rateLimitConfig: RateLimitConfig;
  private readonly retryConfig: RetryConfig;

  constructor(
    rateLimit: RateLimitConfig = { maxRequests: 50, windowMs: 10_000 },
    retry: RetryConfig = { maxRetries: 3, baseDelayMs: 1_000 },
  ) {
    this.logger = new Logger(this.constructor.name);
    this.rateLimitConfig = rateLimit;
    this.retryConfig = retry;
  }

  protected abstract getMarketplaceName(): string;

  /**
   * Waits if the current request window has been exhausted.
   * Cleans up timestamps outside the sliding window, then sleeps
   * for the remaining window time if the limit has been reached.
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.windowMs;

    // Prune timestamps outside the window
    while (
      this.requestTimestamps.length > 0 &&
      this.requestTimestamps[0] <= windowStart
    ) {
      this.requestTimestamps.shift();
    }

    if (this.requestTimestamps.length >= this.rateLimitConfig.maxRequests) {
      const oldest = this.requestTimestamps[0];
      const waitMs = this.rateLimitConfig.windowMs - (now - oldest);

      if (waitMs > 0) {
        this.logger.warn(
          `${this.getMarketplaceName()} rate limit reached, waiting ${waitMs}ms`,
        );
        await this.sleep(waitMs);
      }

      // Re-prune after sleeping
      const afterSleep = Date.now();
      const newWindowStart = afterSleep - this.rateLimitConfig.windowMs;
      while (
        this.requestTimestamps.length > 0 &&
        this.requestTimestamps[0] <= newWindowStart
      ) {
        this.requestTimestamps.shift();
      }
    }

    this.requestTimestamps.push(Date.now());
  }

  /**
   * Wraps `fetch` with:
   *  - Sliding-window rate limiting
   *  - Exponential-backoff retry on 429 and 5xx status codes
   */
  protected async rateLimitedFetch<T>(
    url: string,
    options: FetchOptions = {},
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.retryConfig.maxRetries; attempt++) {
      await this.enforceRateLimit();

      try {
        this.logger.debug(
          `${this.getMarketplaceName()} API ${options.method ?? 'GET'} ${url} (attempt ${attempt + 1})`,
        );

        const response = await fetch(url, {
          method: options.method ?? 'GET',
          headers: options.headers,
          body: options.body,
        });

        if (response.ok) {
          return (await response.json()) as T;
        }

        // Non-retryable error — throw immediately
        if (!RETRYABLE_STATUS_CODES.has(response.status)) {
          const errorBody = await response.text().catch(() => 'Unknown error');
          throw new Error(
            `${this.getMarketplaceName()} API error ${response.status}: ${errorBody}`,
          );
        }

        // Retryable error
        const errorBody = await response.text().catch(() => '');
        lastError = new Error(
          `${this.getMarketplaceName()} API error ${response.status}: ${errorBody}`,
        );

        this.logger.warn(
          `${this.getMarketplaceName()} retryable error ${response.status} on attempt ${attempt + 1}`,
        );
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.startsWith(`${this.getMarketplaceName()} API error`)
        ) {
          // Re-throw non-retryable errors that we threw above
          if (!lastError || lastError !== err) {
            throw err;
          }
        }

        lastError =
          err instanceof Error ? err : new Error(String(err));

        this.logger.warn(
          `${this.getMarketplaceName()} network error on attempt ${attempt + 1}: ${lastError.message}`,
        );
      }

      // Don't sleep after the last attempt
      if (attempt < this.retryConfig.maxRetries - 1) {
        const delayMs = this.retryConfig.baseDelayMs * Math.pow(2, attempt);
        this.logger.debug(`Retrying in ${delayMs}ms...`);
        await this.sleep(delayMs);
      }
    }

    throw (
      lastError ??
      new Error(
        `${this.getMarketplaceName()} request failed after ${this.retryConfig.maxRetries} retries`,
      )
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
