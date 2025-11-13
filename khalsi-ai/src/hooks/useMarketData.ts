import { useState, useEffect, useCallback } from 'react';
import { SolPrediction, TrendingToken, MarketOverview, mockSolPrediction, mockTrendingTokens, mockMarketOverview } from '@/data/marketData';
import { coinGeckoAPI } from '@/services/coinGeckoAPI';

// Types for probability calculation
interface VolumeData {
  timestamp: number;
  price: number;
  volume: number;
}

interface MarketIndicators {
  rvol: number; // Relative Volume
  vroc: number; // Volume Rate of Change
  obv: number;  // On-Balance Volume
  momentum: number;
  trend_strength: number;
}

export interface UseMarketDataReturn {
  solPrediction: SolPrediction | null;
  trendingTokens: TrendingToken[];
  marketOverview: MarketOverview | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  isUsingLiveData: boolean;
}

export const useMarketData = (useLiveData = false): UseMarketDataReturn => {
  const [solPrediction, setSolPrediction] = useState<SolPrediction | null>(null);
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>(mockTrendingTokens);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(mockMarketOverview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLiveData, setIsUsingLiveData] = useState(false);

  // Calculate market indicators based on volume and price data
  const calculateMarketIndicators = (volumeData: VolumeData[], currentPrice: number): MarketIndicators => {
    if (volumeData.length < 7) {
      return { rvol: 1, vroc: 0, obv: 0, momentum: 0, trend_strength: 0 };
    }

    // Calculate RVOL (Relative Volume)
    const recentVolumes = volumeData.slice(-7).map(d => d.volume);
    const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
    const currentVolume = volumeData[volumeData.length - 1]?.volume || 0;
    const rvol = currentVolume / avgVolume;

    // Calculate VROC (Volume Rate of Change)
    const previousVolume = volumeData[volumeData.length - 2]?.volume || 0;
    const vroc = previousVolume > 0 ? ((currentVolume - previousVolume) / previousVolume) * 100 : 0;

    // Calculate OBV (On-Balance Volume)
    let obv = 0;
    for (let i = 1; i < volumeData.length; i++) {
      if (volumeData[i].price > volumeData[i - 1].price) {
        obv += volumeData[i].volume;
      } else if (volumeData[i].price < volumeData[i - 1].price) {
        obv -= volumeData[i].volume;
      }
    }

    // Calculate momentum
    const priceChange = (currentPrice - volumeData[0].price) / volumeData[0].price;
    const momentum = priceChange * 100;

    // Calculate trend strength
    const priceChanges = volumeData.slice(1).map((d, i) => 
      (d.price - volumeData[i].price) / volumeData[i].price
    );
    const positiveChanges = priceChanges.filter(change => change > 0).length;
    const trend_strength = (positiveChanges / priceChanges.length) * 100;

    return { rvol, vroc, obv, momentum, trend_strength };
  };

  // Calculate realistic probability based on market indicators
  const calculateProbability = (
    indicators: MarketIndicators,
    horizon: number,
    currentPrice: number
  ): {
    probability_up: number;
    probability_down: number;
    confidence: number;
    predicted_price: number;
    predicted_range: { min: number; max: number };
    trend_direction: 'bullish' | 'bearish' | 'sideways';
    signals: string[];
  } => {
    let baseProb = 0.5;
    let confidence = 0.6;

    // RVOL impact (volume analysis)
    if (indicators.rvol > 2.0) {
      baseProb += 0.15; // Strong volume breakout
      confidence += 0.1;
    } else if (indicators.rvol > 1.5) {
      baseProb += 0.08; // Moderate volume increase
      confidence += 0.05;
    } else if (indicators.rvol < 0.7) {
      baseProb -= 0.1; // Low volume
      confidence -= 0.05;
    }

    // VROC impact (volume momentum)
    if (indicators.vroc > 50) {
      baseProb += 0.1; // Strong volume increase
      confidence += 0.08;
    } else if (indicators.vroc < -30) {
      baseProb -= 0.08; // Volume decrease
      confidence += 0.03;
    }

    // Momentum impact
    if (indicators.momentum > 5) {
      baseProb += 0.12; // Strong upward momentum
      confidence += 0.1;
    } else if (indicators.momentum < -5) {
      baseProb -= 0.12; // Strong downward momentum
      confidence += 0.1;
    }

    // Trend strength impact
    if (indicators.trend_strength > 70) {
      baseProb += 0.08;
      confidence += 0.12;
    } else if (indicators.trend_strength < 30) {
      baseProb += 0.05; // Consider it sideways
      confidence += 0.05;
    }

    // Horizon adjustments
    const horizonMultiplier = horizon === 15 ? 1.0 : horizon === 60 ? 0.95 : 0.9;
    baseProb *= horizonMultiplier;

    // Normalize probability
    baseProb = Math.max(0.1, Math.min(0.9, baseProb));
    const probability_up = baseProb;
    const probability_down = 1 - baseProb;

    // Determine trend direction
    let trend_direction: 'bullish' | 'bearish' | 'sideways';
    if (baseProb > 0.65) trend_direction = 'bullish';
    else if (baseProb < 0.35) trend_direction = 'bearish';
    else trend_direction = 'sideways';

    // Calculate predicted price
    const volatility = Math.max(0.01, Math.abs(indicators.momentum) / 100);
    const predicted_price = currentPrice * (1 + (baseProb - 0.5) * 0.05);
    const price_range = predicted_price * volatility * 0.5;
    
    const predicted_range = {
      min: predicted_price - price_range,
      max: predicted_price + price_range
    };

    // Generate signals
    const signals: string[] = [];
    if (indicators.rvol > 1.5) signals.push('momentum');
    if (indicators.vroc > 20) signals.push('volume_momentum');
    if (indicators.momentum > 3) signals.push('uptrend');
    if (indicators.momentum < -3) signals.push('downtrend');
    if (Math.abs(indicators.momentum) < 2) signals.push('sideways');
    if (indicators.trend_strength > 70) signals.push('strong_trend');

    return {
      probability_up,
      probability_down,
      confidence,
      predicted_price,
      predicted_range,
      trend_direction,
      signals
    };
  };

  const fetchLiveData = useCallback(async () => {
    if (!useLiveData) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch real SOL data from CoinGecko
      const solData = await coinGeckoAPI.getSolMarketData();
      const marketChartData = await coinGeckoAPI.getSolMarketChart(7); // 7 days of data for indicators
      
      // Convert chart data to VolumeData format
      const volumeData: VolumeData[] = [];
      if (marketChartData.prices && marketChartData.total_volumes) {
        for (let i = 0; i < Math.min(marketChartData.prices.length, marketChartData.total_volumes.length); i++) {
          const [timestamp, price] = marketChartData.prices[i];
          const [, volume] = marketChartData.total_volumes[i];
          volumeData.push({ timestamp, price, volume });
        }
      }

      // Calculate market indicators
      const indicators = calculateMarketIndicators(volumeData, solData.current_price);

      // Generate realistic predictions for different horizons
      const horizons = [15, 60, 240];
      const predictions = horizons.map(horizon => {
        const calc = calculateProbability(indicators, horizon, solData.current_price);
        return {
          horizon_minutes: horizon,
          ...calc
        };
      });

      const enhancedData: SolPrediction = {
        asset_id: `solana:${solData.id}`,
        symbol: `${solData.symbol.toUpperCase()}/USDC`,
        base: solData.symbol.toUpperCase(),
        quote: 'USDC',
        decimals: 9,
        market: {
          current_price: solData.current_price,
          price_change_24h: solData.price_change_percentage_24h,
          volume_24h: solData.total_volume,
          market_cap: solData.market_cap,
          liquidity: solData.market_cap * 0.1, // Estimated liquidity
          last_trade_at: solData.last_updated,
        },
        predictions,
        computed_at: new Date().toISOString(),
        source: 'coingecko_realtime',
        version: 'v2',
        last_updated: new Date().toISOString(),
      };

      setSolPrediction(enhancedData);

      // Update market overview with live data
      const updatedOverview: MarketOverview = {
        symbol: enhancedData.symbol,
        price: enhancedData.market.current_price,
        price_change_24h: enhancedData.market.price_change_24h,
        volume_24h: enhancedData.market.volume_24h,
        market_cap: enhancedData.market.market_cap || 0,
        liquidity: enhancedData.market.liquidity,
        events_24h: Math.floor(Math.random() * 10) + 3,
        key_levels: {
          support: [
            enhancedData.market.current_price * 0.97,
            enhancedData.market.current_price * 0.94,
          ],
          resistance: [
            enhancedData.market.current_price * 1.03,
            enhancedData.market.current_price * 1.06,
          ],
        },
        probabilities_by_horizon: enhancedData.predictions.map(p => ({
          horizon: p.horizon_minutes,
          probability: p.probability_up,
        })),
        updated_at: new Date().toISOString(),
      };

      setMarketOverview(updatedOverview);
      setIsUsingLiveData(true);

    } catch (err) {
      console.error('Error fetching live data:', err);
      setError('Gagal mengambil data real-time. Menggunakan data demo.');
      setSolPrediction(mockSolPrediction);
      setMarketOverview(mockMarketOverview);
      setIsUsingLiveData(false);
    } finally {
      setLoading(false);
    }
  }, [useLiveData]);

  const refreshData = useCallback(async () => {
    await fetchLiveData();
  }, [fetchLiveData]);

  // Auto-refresh every 30 seconds for live data
  useEffect(() => {
    if (useLiveData) {
      fetchLiveData();
      
      const interval = setInterval(fetchLiveData, 30000);
      return () => clearInterval(interval);
    } else {
      setSolPrediction(mockSolPrediction);
      setMarketOverview(mockMarketOverview);
      setIsUsingLiveData(false);
    }
  }, [fetchLiveData, useLiveData]);

  return {
    solPrediction,
    trendingTokens,
    marketOverview,
    loading,
    error,
    refreshData,
    isUsingLiveData,
  };
};

export interface UsePredictionEngineReturn {
  getProbabilityForHorizon: (horizon: number) => {
    probability: number;
    confidence: number;
    signal: string;
    range: { min: number; max: number };
  };
  getMarketSentiment: () => 'bullish' | 'bearish' | 'neutral';
  getRiskLevel: () => 'low' | 'medium' | 'high';
  getIndicators: () => MarketIndicators | null;
}

export const usePredictionEngine = (solPrediction: SolPrediction | null): UsePredictionEngineReturn => {
  const getProbabilityForHorizon = useCallback((horizon: number) => {
    if (!solPrediction) {
      return {
        probability: 0.5,
        confidence: 0.5,
        signal: 'neutral',
        range: { min: 0, max: 0 },
      };
    }

    const prediction = solPrediction.predictions.find(p => p.horizon_minutes === horizon);
    if (!prediction) {
      return {
        probability: 0.5,
        confidence: 0.5,
        signal: 'neutral',
        range: { min: 0, max: 0 },
      };
    }

    return {
      probability: prediction.probability_up,
      confidence: prediction.confidence,
      signal: prediction.trend_direction,
      range: prediction.predicted_range,
    };
  }, [solPrediction]);

  const getMarketSentiment = useCallback((): 'bullish' | 'bearish' | 'neutral' => {
    if (!solPrediction) return 'neutral';

    const bullishCount = solPrediction.predictions.filter(p => p.trend_direction === 'bullish').length;
    const bearishCount = solPrediction.predictions.filter(p => p.trend_direction === 'bearish').length;

    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  }, [solPrediction]);

  const getRiskLevel = useCallback((): 'low' | 'medium' | 'high' => {
    if (!solPrediction) return 'medium';

    const avgConfidence = solPrediction.predictions.reduce((sum, p) => sum + p.confidence, 0) / solPrediction.predictions.length;
    const volatility = solPrediction.predictions.reduce((sum, p) => {
      const range = p.predicted_range.max - p.predicted_range.min;
      return sum + range;
    }, 0) / solPrediction.predictions.length;

    if (avgConfidence > 0.8 && volatility < 0.05) return 'low';
    if (avgConfidence < 0.6 || volatility > 0.1) return 'high';
    return 'medium';
  }, [solPrediction]);

  const getIndicators = useCallback((): MarketIndicators | null => {
    // This would typically be calculated and stored
    // For now, return a mock indicator structure
    return {
      rvol: 1.2,
      vroc: 15,
      obv: 0,
      momentum: 3.5,
      trend_strength: 65
    };
  }, []);

  return {
    getProbabilityForHorizon,
    getMarketSentiment,
    getRiskLevel,
    getIndicators,
  };
};