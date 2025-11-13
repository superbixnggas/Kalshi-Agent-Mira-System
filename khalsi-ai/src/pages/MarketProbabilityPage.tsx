import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ArrowPathIcon as RefreshIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CpuChipIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import KhalsiAvatar from '@/components/KhalsiAvatar';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useMarketData, usePredictionEngine } from '@/hooks/useMarketData';

const MarketProbabilityPage: React.FC = () => {
  const [selectedHorizon, setSelectedHorizon] = useState(60);
  const [chartType, setChartType] = useState<'probability' | 'confidence'>('probability');
  
  const {
    solPrediction,
    loading,
    error,
    refreshData,
    isUsingLiveData,
  } = useMarketData(true); // Always use live data for this page

  const { getProbabilityForHorizon } = usePredictionEngine(solPrediction);

  const currentPrediction = getProbabilityForHorizon(selectedHorizon);

  // Generate chart data based on selected horizon
  const generateChartData = () => {
    if (!solPrediction) return [];
    
    const data = [];
    const steps = 24; // 24 data points
    
    for (let i = 0; i <= steps; i++) {
      const timeValue = (i / steps) * selectedHorizon;
      const hours = Math.floor(timeValue / 60);
      const minutes = timeValue % 60;
      
      const timeLabel = selectedHorizon <= 60 
        ? `${Math.floor(timeValue)}m`
        : hours > 0 
          ? `${hours}h ${Math.floor(minutes)}m`
          : `${Math.floor(timeValue)}m`;
      
      // Simulate probability curve with some noise
      const baseProb = currentPrediction.probability;
      const trend = Math.sin((i / steps) * Math.PI * 0.5) * 0.1; // Gentle curve
      const noise = (Math.random() - 0.5) * 0.05;
      const probability = Math.max(0, Math.min(1, baseProb + trend + noise));
      
      data.push({
        time: timeLabel,
        probability: probability * 100,
        confidence: currentPrediction.confidence * 100,
        upper: probability * 100 + (1 - currentPrediction.confidence) * 20,
        lower: probability * 100 - (1 - currentPrediction.confidence) * 20,
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  const formatTimeHorizon = (minutes: number) => {
    if (minutes < 60) return `${minutes} menit`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} jam`;
    return `${Math.floor(minutes / 1440)} hari`;
  };

  const getHorizonColor = (horizon: number) => {
    const colors = {
      15: 'bg-neon-blue',
      60: 'bg-neon-green', 
      240: 'bg-neon-purple',
    };
    return colors[horizon as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <KhalsiAvatar variant="trading" showBubble bubbleText="Mari saya analisis probabilitas pasar Solana untuk Anda!" />
            <div>
              <h1 className="text-3xl font-bold text-white">Market Probability</h1>
              <p className="text-gray-400">
                Prediksi real-time Solana dengan confidence interval
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isUsingLiveData ? 'bg-neon-green animate-pulse' : 'bg-neon-purple'}`} />
              <span className="text-gray-400">
                {isUsingLiveData ? 'Live CoinGecko Data' : 'Demo Mode'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Update Data
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

        {/* Current Prediction Overview */}
        {solPrediction && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Main Prediction Card */}
            <div className="lg:col-span-2">
              <Card variant="elevated" glow>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-neon-blue">
                        Prediksi {formatTimeHorizon(selectedHorizon)}
                      </CardTitle>
                      <CardDescription>
                        Berdasarkan analisis AI dan data CoinGecko real-time
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-neon-green">
                        {(currentPrediction.probability * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Probabilitas Naik</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Probability Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Tren yang Diharapkan</span>
                        <span className="text-neon-blue capitalize font-medium">
                          {currentPrediction.signal}
                        </span>
                      </div>
                      <div className="w-full bg-dark-surface rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${getHorizonColor(selectedHorizon)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${currentPrediction.probability * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-dark-surface rounded-lg">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Rentang Prediksi</p>
                        <p className="text-white font-medium">
                          ${currentPrediction.range.min.toFixed(2)} - ${currentPrediction.range.max.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Confidence Level</p>
                        <p className="text-neon-green font-medium">
                          {(currentPrediction.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Horizon Selector */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-neon-blue" />
                  Time Horizon
                </CardTitle>
                <CardDescription>
                  Pilih rentang waktu analisis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[15, 60, 240].map((horizon) => (
                    <Button
                      key={horizon}
                      variant={selectedHorizon === horizon ? "primary" : "ghost"}
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setSelectedHorizon(horizon)}
                    >
                      <span>{formatTimeHorizon(horizon)}</span>
                      {selectedHorizon === horizon && (
                        <BeakerIcon className="h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Stats */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-neon-purple" />
                  Market Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Harga Saat Ini</span>
                    <span className="text-white font-medium">
                      ${solPrediction.market.current_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">24h Change</span>
                    <span className={`font-medium ${
                      solPrediction.market.price_change_24h >= 0 
                        ? 'text-neon-green' 
                        : 'text-red-400'
                    }`}>
                      {solPrediction.market.price_change_24h >= 0 ? '+' : ''}
                      {solPrediction.market.price_change_24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">24h Volume</span>
                    <span className="text-white font-medium">
                      ${(solPrediction.market.volume_24h / 1e6).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Chart */}
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-3">
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <CpuChipIcon className="h-5 w-5 mr-2 text-neon-blue" />
                      Probability Evolution
                    </CardTitle>
                    <CardDescription>
                      Prediksi probabilitas naik sepanjang {formatTimeHorizon(selectedHorizon)}
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant={chartType === 'probability' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setChartType('probability')}
                    >
                      Probability
                    </Button>
                    <Button
                      variant={chartType === 'confidence' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setChartType('confidence')}
                    >
                      Confidence
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
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
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A1B2E', 
                          border: '1px solid #2D2E4A',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                        labelStyle={{ color: '#8B5CF6' }}
                        formatter={(value: any) => [`${value.toFixed(1)}%`, chartType === 'probability' ? 'Probabilitas' : 'Confidence']}
                      />
                      
                      {/* Confidence Interval */}
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stackId="1"
                        stroke="transparent"
                        fill="#8B5CF6"
                        fillOpacity={0.1}
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stackId="1"
                        stroke="transparent"
                        fill="#1A1B2E"
                        fillOpacity={0.1}
                      />
                      
                      {/* Main Line */}
                      <Line
                        type="monotone"
                        dataKey={chartType}
                        stroke="#00D4FF"
                        strokeWidth={3}
                        dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#00D4FF', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                      
                      {/* Reference line for 50% probability */}
                      <ReferenceLine y={50} stroke="#6B7280" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Sidebar */}
          <div className="space-y-6">
            {/* Khalsi Analysis */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <KhalsiAvatar variant="mini" />
                  <span className="ml-2">Khalsi Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-dark-surface rounded-lg border border-neon-blue/30">
                    <p className="text-neon-blue font-medium mb-1">Current Assessment</p>
                    <p className="text-gray-300">
                      {currentPrediction.signal === 'bullish' 
                        ? 'Probabilitas naik menunjukkan momentum positif untuk periode ini.'
                        : currentPrediction.signal === 'bearish'
                        ? 'Indikator menunjukkan potensi penurunan, tetap waspada.'
                        : 'Pasar dalam fase sideways, tunggu konfirmasi sinyal.'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-dark-surface rounded-lg border border-neon-green/30">
                    <p className="text-neon-green font-medium mb-1">Confidence Check</p>
                    <p className="text-gray-300">
                      Confidence level {(currentPrediction.confidence * 100).toFixed(0)}% 
                      {currentPrediction.confidence > 0.7 ? ' - Level tinggi, analisis terpercaya.' :
                       currentPrediction.confidence > 0.5 ? ' - Level sedang, perlu monitoring.' :
                       ' - Level rendah, hati-hati dengan interpretasi.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Predictions Summary */}
            {solPrediction && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Summary Predictions</CardTitle>
                  <CardDescription>Semua horizon analisis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {solPrediction.predictions.map((pred) => (
                      <div 
                        key={pred.horizon_minutes}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedHorizon === pred.horizon_minutes 
                            ? 'border-neon-blue bg-neon-blue/10' 
                            : 'border-dark-elevated hover:border-neon-purple/50'
                        }`}
                        onClick={() => setSelectedHorizon(pred.horizon_minutes)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">
                            {formatTimeHorizon(pred.horizon_minutes)}
                          </span>
                          <div className="text-right">
                            <div className={`font-bold ${
                              pred.trend_direction === 'bullish' ? 'text-neon-green' :
                              pred.trend_direction === 'bearish' ? 'text-red-400' :
                              'text-neon-blue'
                            }`}>
                              {(pred.probability_up * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                              {pred.trend_direction}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Warning */}
            <Card variant="glass" className="border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-orange-400">Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">
                  Prediksi ini berdasarkan analisis data historis dan tidak menjamin hasil di masa depan. 
                  Selalu lakukan riset sendiri sebelum membuat keputusan investasi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Details */}
        {solPrediction && (
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>
                Metodologi dan sumber data prediksi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-neon-blue mb-2">Data Sources</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• CoinGecko API (Real-time)</li>
                    <li>• Market volume analysis</li>
                    <li>• Price action patterns</li>
                    <li>• Historical correlations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-neon-green mb-2">Analysis Method</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Momentum indicators</li>
                    <li>• Sentiment analysis</li>
                    <li>• Volume confirmation</li>
                    <li>• Risk assessment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-neon-purple mb-2">Update Frequency</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Price data: Real-time</li>
                    <li>• Predictions: 30 seconds</li>
                    <li>• Volume: Daily aggregation</li>
                    <li>• Confidence: Per calculation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarketProbabilityPage;