// Market data types according to docs/market_data_structure.md
export interface Prediction {
  horizon_minutes: number;
  probability_up: number;
  probability_down: number;
  predicted_price: number;
  predicted_range: {
    min: number;
    max: number;
  };
  trend_direction: 'bullish' | 'bearish' | 'sideways';
  confidence: number;
  sample_size: number;
  signals: string[];
}

export interface MarketData {
  current_price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap?: number;
  liquidity?: number;
  last_trade_at: string;
}

export interface SolPrediction {
  asset_id: string;
  symbol: string;
  base: string;
  quote: string;
  decimals: number;
  market: MarketData;
  predictions: Prediction[];
  computed_at: string;
  source: string;
  version: string;
  last_updated: string;
}

export interface TrendingToken {
  symbol: string;
  name: string;
  category: 'meme' | 'degen' | 'infra' | 'stable';
  price: number;
  price_change_24h: number;
  volume_24h: number;
  liquidity?: number;
  market_cap?: number;
  probability: number;
  trend_direction: 'bullish' | 'bearish' | 'sideways';
  confidence: number;
  sample_size: number;
  tags: string[];
  last_updated: string;
}

export interface MarketOverview {
  symbol: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  liquidity?: number;
  events_24h: number;
  key_levels: {
    support: number[];
    resistance: number[];
  };
  probabilities_by_horizon: Array<{
    horizon: number;
    probability: number;
  }>;
  updated_at: string;
}

export interface ChatMessage {
  message_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: Array<{ type: string; horizon_minutes?: number }>;
  context?: Record<string, any>;
  created_at: string;
  source: string;
  version: string;
}

export interface ChatSession {
  session_id: string;
  messages: ChatMessage[];
}

export interface Insight {
  insight_id: string;
  title: string;
  theme: 'momentum' | 'mean_reversion' | 'event' | 'liquidity';
  description: string;
  trigger_rules: {
    min_confidence: number;
    min_probability: number;
  };
  related_tokens: string[];
  metrics_snapshot: Record<string, number>;
  created_at: string;
  source: string;
  version: string;
}

// Mock data following docs/market_data_structure.md examples
export const mockSolPrediction: SolPrediction = {
  asset_id: 'solana:sol',
  symbol: 'SOL/USDC',
  base: 'SOL',
  quote: 'USDC',
  decimals: 9,
  market: {
    current_price: 185.43,
    price_change_24h: 2.15,
    volume_24h: 123456789.50,
    market_cap: 89000000000,
    liquidity: 45000000,
    last_trade_at: '2025-11-13T18:18:54Z'
  },
  predictions: [
    {
      horizon_minutes: 15,
      probability_up: 0.51,
      probability_down: 0.49,
      predicted_price: 186.05,
      predicted_range: { min: 184.8, max: 187.3 },
      trend_direction: 'sideways',
      confidence: 0.65,
      sample_size: 900,
      signals: ['momentum', 'sentiment']
    },
    {
      horizon_minutes: 60,
      probability_up: 0.62,
      probability_down: 0.38,
      predicted_price: 187.10,
      predicted_range: { min: 180.1, max: 190.2 },
      trend_direction: 'bullish',
      confidence: 0.78,
      sample_size: 1200,
      signals: ['momentum', 'sentiment']
    },
    {
      horizon_minutes: 240,
      probability_up: 0.58,
      probability_down: 0.42,
      predicted_price: 188.90,
      predicted_range: { min: 182.0, max: 195.0 },
      trend_direction: 'bullish',
      confidence: 0.72,
      sample_size: 1500,
      signals: ['momentum', 'sentiment']
    }
  ],
  computed_at: '2025-11-13T18:18:54Z',
  source: 'mock',
  version: 'v1',
  last_updated: '2025-11-13T18:18:54Z'
};

export const mockTrendingTokens: TrendingToken[] = [
  {
    symbol: 'BONK',
    name: 'Bonk',
    category: 'meme',
    price: 0.00003210,
    price_change_24h: 5.35,
    volume_24h: 98765432.10,
    liquidity: 12000000,
    market_cap: 2100000000,
    probability: 0.61,
    trend_direction: 'bullish',
    confidence: 0.72,
    sample_size: 1100,
    tags: ['momentum', 'sentiment'],
    last_updated: '2025-11-13T18:18:54Z'
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    category: 'meme',
    price: 2.12,
    price_change_24h: 3.80,
    volume_24h: 75432109.00,
    liquidity: 9500000,
    market_cap: 2120000000,
    probability: 0.57,
    trend_direction: 'sideways',
    confidence: 0.69,
    sample_size: 950,
    tags: ['momentum'],
    last_updated: '2025-11-13T18:18:54Z'
  },
  {
    symbol: 'SAMO',
    name: 'Samoyedcoin',
    category: 'meme',
    price: 0.0185,
    price_change_24h: -1.20,
    volume_24h: 15678900.00,
    liquidity: 4200000,
    market_cap: 150000000,
    probability: 0.48,
    trend_direction: 'bearish',
    confidence: 0.61,
    sample_size: 800,
    tags: ['sentiment'],
    last_updated: '2025-11-13T18:18:54Z'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    category: 'infra',
    price: 185.43,
    price_change_24h: 2.15,
    volume_24h: 123456789.50,
    liquidity: 45000000,
    market_cap: 89000000000,
    probability: 0.62,
    trend_direction: 'bullish',
    confidence: 0.78,
    sample_size: 1200,
    tags: ['momentum', 'sentiment'],
    last_updated: '2025-11-13T18:18:54Z'
  }
];

export const mockMarketOverview: MarketOverview = {
  symbol: 'SOL/USDC',
  price: 185.43,
  price_change_24h: 2.15,
  volume_24h: 123456789.50,
  market_cap: 89000000000,
  liquidity: 45000000,
  events_24h: 7,
  key_levels: {
    support: [180, 175],
    resistance: [190, 195]
  },
  probabilities_by_horizon: [
    { horizon: 15, probability: 0.51 },
    { horizon: 60, probability: 0.62 },
    { horizon: 240, probability: 0.58 }
  ],
  updated_at: '2025-11-13T18:18:54Z'
};

export const mockChatSession: ChatSession = {
  session_id: 'sess-abc',
  messages: [
    {
      message_id: 'msg-001',
      role: 'user',
      content: 'Apa probabilitas naik SOL dalam 60 menit?',
      context: {
        symbol: 'SOL/USDC',
        sol_price: 185.43,
        probability_60m: 0.62
      },
      created_at: '2025-11-13T18:18:54Z',
      source: 'interactive_ai',
      version: 'v1'
    },
    {
      message_id: 'msg-002',
      role: 'assistant',
      content: 'Berdasarkan data terbaru, probabilitas naik SOL dalam 60 menit adalah 62% dengan kepercayaan 0.78. Namun, rentang prediksi melebar ke 180.1–190.2, menandakan volatilitas moderat.',
      attachments: [{ type: 'predictions', horizon_minutes: 60 }],
      created_at: '2025-11-13T18:19:04Z',
      source: 'interactive_ai',
      version: 'v1'
    }
  ]
};

export const mockInsights: Insight[] = [
  {
    insight_id: 'ins-001',
    title: 'Momentum Terkuat 60 Menit',
    theme: 'momentum',
    description: 'Probabilitas naik SOL pada horizon 60 menit mencapai 62% dengan confidence 0.78, seiring lonjakan volume 24 jam.',
    trigger_rules: {
      min_confidence: 0.7,
      min_probability: 0.6
    },
    related_tokens: ['SOL'],
    metrics_snapshot: {
      sol_price: 185.43,
      volume_24h: 123456789.50,
      probability_60m: 0.62
    },
    created_at: '2025-11-13T18:18:54Z',
    source: 'explore_insights',
    version: 'v1'
  }
];