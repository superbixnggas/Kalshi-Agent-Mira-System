import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ArrowPathIcon as RefreshIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KhalsiAvatar from '@/components/KhalsiAvatar';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useMarketData, usePredictionEngine } from '@/hooks/useMarketData';
import { TrendingToken, MarketOverview } from '@/data/marketData';

const DashboardPage: React.FC = () => {
  const [useLiveData, setUseLiveData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const {
    solPrediction,
    trendingTokens,
    marketOverview,
    loading,
    error,
    refreshData,
    isUsingLiveData,
  } = useMarketData(useLiveData);

  const { getMarketSentiment, getRiskLevel } = usePredictionEngine(solPrediction);

  // Auto-refresh every 30 seconds for live data
  useEffect(() => {
    if (useLiveData) {
      const interval = setInterval(() => {
        refreshData();
        setLastUpdate(new Date());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [useLiveData, refreshData]);

  const sentiment = getMarketSentiment();
  const riskLevel = getRiskLevel();

  const sentimentColor = {
    bullish: 'text-neon-green',
    bearish: 'text-red-400',
    neutral: 'text-neon-blue',
  }[sentiment];

  const riskColor = {
    low: 'text-neon-green',
    medium: 'text-neon-purple',
    high: 'text-red-400',
  }[riskLevel];

  // Generate mock chart data
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: marketOverview ? marketOverview.price * (0.98 + Math.random() * 0.04) : 185.43,
    volume: marketOverview ? marketOverview.volume_24h * (Math.random() * 0.5 + 0.75) / 24 : 5e6,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <KhalsiAvatar variant="dashboard" interactive />
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">
                Market overview dan analisis real-time Solana
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isUsingLiveData ? 'bg-neon-green animate-pulse' : 'bg-neon-purple'}`} />
              <span className="text-gray-400">
                {isUsingLiveData ? 'Live Data' : 'Demo Mode'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUseLiveData(!useLiveData)}
              className={useLiveData ? 'text-neon-green' : ''}
            >
              {useLiveData ? 'Demo Mode' : 'Live Mode'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center"
          >
            <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* SOL Price */}
          <Card variant="glass" glow>
            <CardHeader className="pb-2">
              <CardDescription>Solana (SOL)</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(marketOverview?.price || 185.43)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {marketOverview && marketOverview.price_change_24h >= 0 ? (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-neon-green mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-400 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  marketOverview && marketOverview.price_change_24h >= 0 
                    ? 'text-neon-green' 
                    : 'text-red-400'
                }`}>
                  {marketOverview ? `${marketOverview.price_change_24h.toFixed(2)}%` : '+2.15%'}
                </span>
                <span className="text-gray-400 text-sm ml-2">24h</span>
              </div>
            </CardContent>
          </Card>

          {/* Market Sentiment */}
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardDescription>Market Sentiment</CardDescription>
              <CardTitle className={`text-2xl capitalize ${sentimentColor}`}>
                {sentiment}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-neon-green mr-1" />
                <span className="text-sm text-gray-400">AI Analysis</span>
              </div>
            </CardContent>
          </Card>

          {/* Risk Level */}
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardDescription>Risk Level</CardDescription>
              <CardTitle className={`text-2xl capitalize ${riskColor}`}>
                {riskLevel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-400">
                Confidence: {solPrediction ? `${Math.round(solPrediction.predictions[1]?.confidence * 100)}%` : '78%'}
              </div>
            </CardContent>
          </Card>

          {/* Volume */}
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardDescription>24h Volume</CardDescription>
              <CardTitle className="text-2xl">
                ${formatVolume(marketOverview?.volume_24h || 123456789.50)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-neon-blue mr-1" />
                <span className="text-sm text-gray-400">Trading</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-neon-blue" />
                  SOL Price Chart (24h)
                </CardTitle>
                <CardDescription>
                  Grafik harga dan volume real-time dengan data CoinGecko
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D2E4A" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#8B5CF6" 
                        fontSize={12}
                        tick={{ fill: '#8B5CF6' }}
                      />
                      <YAxis 
                        stroke="#00D4FF" 
                        fontSize={12}
                        tick={{ fill: '#00D4FF' }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A1B2E', 
                          border: '1px solid #2D2E4A',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                        labelStyle={{ color: '#8B5CF6' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#00D4FF" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#00D4FF' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Khalsi Insights */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <KhalsiAvatar variant="mini" />
                  <span className="ml-2">Khalsi Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-dark-surface rounded-lg border border-neon-blue/30">
                    <p className="text-neon-blue font-medium mb-1">Market Update</p>
                    <p className="text-gray-300">
                      {marketOverview ? 
                        `SOL menunjukkan ${marketOverview.price_change_24h >= 0 ? 'kenaikan' : 'penurunan'} ${Math.abs(marketOverview.price_change_24h).toFixed(2)}% dalam 24 jam.` :
                        'Data sedang diperbarui...'
                      }
                    </p>
                  </div>
                  
                  {solPrediction && (
                    <div className="p-3 bg-dark-surface rounded-lg border border-neon-green/30">
                      <p className="text-neon-green font-medium mb-1">60min Prediction</p>
                      <p className="text-gray-300">
                        Probabilitas naik: <span className="text-neon-green font-bold">
                          {(solPrediction.predictions[1]?.probability_up * 100).toFixed(0)}%
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trending Tokens */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Trending Solana Tokens</CardTitle>
                <CardDescription>Top movers today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTokens.slice(0, 4).map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-2 rounded-lg hover:bg-dark-surface/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center text-xs font-bold text-neon-blue">
                          {token.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{token.symbol}</p>
                          <p className="text-gray-400 text-xs">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-medium">
                          ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}
                        </p>
                        <p className={`text-xs ${
                          token.price_change_24h >= 0 ? 'text-neon-green' : 'text-red-400'
                        }`}>
                          {token.price_change_24h >= 0 ? '+' : ''}{token.price_change_24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Last Update Time */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Terakhir diperbarui: {lastUpdate.toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;