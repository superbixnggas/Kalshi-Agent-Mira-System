// CoinGecko API service based on docs/coingecko_api_research.md
// Public API: No API key required for basic endpoints
// PRO API: Requires x-cg-pro-api-key header

const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  fully_diluted_valuation: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinGeckoTrending {
  coins: Array<{
    item: {
      id: string;
      coin_id: number;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      small: string;
      large: string;
      slug: string;
      price_btc: number;
      score: number;
      data: {
        price: number;
        price_btc: string;
        price_change_percentage_24h: {
          usd: number;
          btc: number;
        };
        market_cap: string;
        market_cap_btc: string;
        total_volume: string;
        total_volume_btc: string;
        sparkline: string;
        content: any;
      };
    };
  }>;
  nfts: any[];
  categories: any[];
}

export interface CoinGeckoSimplePrice {
  [key: string]: {
    [currency: string]: number;
  };
}

class CoinGeckoAPI {
  private baseUrl = BASE_URL;
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (this.apiKey) {
      headers['x-cg-pro-api-key'] = this.apiKey;
    }
    
    return headers;
  }

  // Rate limit handling
  private async fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...this.getHeaders(),
            ...options.headers,
          },
        });

        if (response.ok) {
          return response;
        }

        if (response.status === 429 && i < retries - 1) {
          // Rate limited, wait before retrying
          await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  // Get SOL market data (Primary endpoint for real-time SOL data)
  async getSolMarketData(): Promise<CoinGeckoMarket> {
    try {
      const url = `${this.baseUrl}/coins/markets?vs_currency=usd&ids=solana&order=market_cap_desc&per_page=1&page=1`;
      const response = await this.fetchWithRetry(url);
      const data: CoinGeckoMarket[] = await response.json();
      
      if (data.length === 0) {
        throw new Error('No SOL data found');
      }
      
      return data[0];
    } catch (error) {
      console.error('Error fetching SOL market data:', error);
      throw error;
    }
  }

  // Get simple price for SOL
  async getSolPrice(vs_currency = 'usd'): Promise<CoinGeckoSimplePrice> {
    try {
      const url = `${this.baseUrl}/simple/price?ids=solana&vs_currencies=${vs_currency}`;
      const response = await this.fetchWithRetry(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      throw error;
    }
  }

  // Get market chart data for SOL
  async getSolMarketChart(days: number = 7): Promise<any> {
    try {
      const url = `${this.baseUrl}/coins/solana/market_chart?vs_currency=usd&days=${days}`;
      const response = await this.fetchWithRetry(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching SOL market chart:', error);
      throw error;
    }
  }

  // Get trending coins (PRO API only)
  async getTrending(): Promise<CoinGeckoTrending> {
    if (!this.apiKey) {
      throw new Error('Trending endpoint requires PRO API key');
    }

    try {
      const url = `${this.baseUrl}/search/trending`;
      const response = await this.fetchWithRetry(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending data:', error);
      throw error;
    }
  }

  // Get multiple coins market data
  async getCoinsMarket(
    vs_currency = 'usd',
    ids?: string[],
    per_page = 100,
    page = 1
  ): Promise<CoinGeckoMarket[]> {
    try {
      const params = new URLSearchParams({
        vs_currency,
        order: 'market_cap_desc',
        per_page: per_page.toString(),
        page: page.toString(),
      });

      if (ids && ids.length > 0) {
        params.append('ids', ids.join(','));
      }

      const url = `${this.baseUrl}/coins/markets?${params.toString()}`;
      const response = await this.fetchWithRetry(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching coins market data:', error);
      throw error;
    }
  }

  // Get Solana ecosystem coins (filter by category)
  async getSolanaEcosystem(): Promise<CoinGeckoMarket[]> {
    try {
      // Get popular Solana ecosystem tokens
      const solanaTokens = [
        'solana',
        'bonk',
        'dogwifcoin',
        'wagyuswap',
        'raydium',
        'serum',
        'serum-dex-token',
        'orca',
        'saber',
        'mango',
        'mango-markets',
        'solanium',
        'jet-protocol',
        'friktion',
        'vari-blocks',
        'vault-finance',
      ];

      return await this.getCoinsMarket('usd', solanaTokens, 50, 1);
    } catch (error) {
      console.error('Error fetching Solana ecosystem data:', error);
      throw error;
    }
  }

  // Convert CoinGecko data to Khalsi format
  convertToKhalsiFormat(marketData: CoinGeckoMarket) {
    return {
      asset_id: `solana:${marketData.id}`,
      symbol: `${marketData.symbol.toUpperCase()}/USDC`,
      base: marketData.symbol.toUpperCase(),
      quote: 'USDC',
      decimals: 9,
      market: {
        current_price: marketData.current_price,
        price_change_24h: marketData.price_change_percentage_24h,
        volume_24h: marketData.total_volume,
        market_cap: marketData.market_cap,
        liquidity: marketData.market_cap * 0.1, // Estimated liquidity
        last_trade_at: marketData.last_updated,
      },
      computed_at: new Date().toISOString(),
      source: 'coingecko',
      version: 'v1',
      last_updated: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const coinGeckoAPI = new CoinGeckoAPI();