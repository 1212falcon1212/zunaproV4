import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../common/redis';

const CACHE_KEY = 'currency:rates:TRY';
const CACHE_TTL = 3600; // 1 hour

interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>; // { USD: 0.029, EUR: 0.027, GBP: 0.023, ... }
}

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly redis: RedisService) {}

  /**
   * Get exchange rates with TRY as base currency.
   * Cached for 1 hour in Redis.
   */
  async getRates(): Promise<ExchangeRates> {
    // Check Redis cache
    const cached = await this.redis.getJson<ExchangeRates>(CACHE_KEY);
    if (cached) return cached;

    // Try Frankfurter API first (free, no key)
    let rates = await this.fetchFrankfurter();

    // Fallback: TCMB
    if (!rates) {
      rates = await this.fetchTCMB();
    }

    if (!rates) {
      this.logger.error('All currency API sources failed, using fallback rates');
      rates = this.fallbackRates();
    }

    // Cache
    await this.redis.setJson(CACHE_KEY, rates, CACHE_TTL);
    return rates;
  }

  /**
   * Convert amount from TRY to target currency
   */
  async convert(amountTRY: number, toCurrency: string): Promise<number> {
    if (toCurrency === 'TRY') return amountTRY;

    const rates = await this.getRates();
    const rate = rates.rates[toCurrency];
    if (!rate) {
      this.logger.warn(`No rate found for ${toCurrency}, returning TRY amount`);
      return amountTRY;
    }

    return Math.round(amountTRY * rate * 100) / 100;
  }

  /**
   * Convert a price object to all supported currencies
   */
  async convertToAllCurrencies(
    amountTRY: number,
    currencies: string[] = ['USD', 'EUR', 'GBP'],
  ): Promise<Record<string, number>> {
    const rates = await this.getRates();
    const result: Record<string, number> = { TRY: amountTRY };

    for (const cur of currencies) {
      if (cur === 'TRY') continue;
      const rate = rates.rates[cur];
      if (rate) {
        result[cur] = Math.round(amountTRY * rate * 100) / 100;
      }
    }

    return result;
  }

  // ─── Frankfurter API (ECB data, free) ────────────────────

  private async fetchFrankfurter(): Promise<ExchangeRates | null> {
    try {
      const res = await fetch(
        'https://api.frankfurter.app/latest?from=TRY&to=USD,EUR,GBP',
        { signal: AbortSignal.timeout(10000) },
      );

      if (!res.ok) {
        this.logger.warn(`Frankfurter API returned ${res.status}`);
        return null;
      }

      const data = await res.json() as {
        base: string;
        date: string;
        rates: Record<string, number>;
      };

      this.logger.log(`Currency rates fetched from Frankfurter: ${data.date}`);
      return {
        base: 'TRY',
        date: data.date,
        rates: data.rates,
      };
    } catch (err) {
      this.logger.warn('Frankfurter API failed', err);
      return null;
    }
  }

  // ─── TCMB XML Feed (Turkish Central Bank) ───────────────

  private async fetchTCMB(): Promise<ExchangeRates | null> {
    try {
      const res = await fetch(
        'https://www.tcmb.gov.tr/kurlar/today.xml',
        { signal: AbortSignal.timeout(10000) },
      );

      if (!res.ok) {
        this.logger.warn(`TCMB API returned ${res.status}`);
        return null;
      }

      const xml = await res.text();
      const rates: Record<string, number> = {};

      // Parse XML manually (simple regex for <Currency> blocks)
      const currencyBlocks = xml.match(/<Currency[^>]*>[\s\S]*?<\/Currency>/g) ?? [];

      for (const block of currencyBlocks) {
        const codeMatch = block.match(/Kod="([^"]+)"/);
        const forexBuyingMatch = block.match(/<ForexBuying>([\d.]+)<\/ForexBuying>/);

        if (codeMatch && forexBuyingMatch) {
          const code = codeMatch[1];
          const forexBuying = parseFloat(forexBuyingMatch[1]);

          if (forexBuying > 0) {
            // TCMB gives "1 USD = X TRY", we need "1 TRY = X USD"
            rates[code] = Math.round((1 / forexBuying) * 1_000_000) / 1_000_000;
          }
        }
      }

      this.logger.log(`Currency rates fetched from TCMB: ${Object.keys(rates).length} currencies`);
      return {
        base: 'TRY',
        date: new Date().toISOString().split('T')[0],
        rates,
      };
    } catch (err) {
      this.logger.warn('TCMB API failed', err);
      return null;
    }
  }

  // ─── Fallback rates (hardcoded, last resort) ────────────

  private fallbackRates(): ExchangeRates {
    return {
      base: 'TRY',
      date: new Date().toISOString().split('T')[0],
      rates: {
        USD: 0.029,
        EUR: 0.027,
        GBP: 0.023,
      },
    };
  }
}
