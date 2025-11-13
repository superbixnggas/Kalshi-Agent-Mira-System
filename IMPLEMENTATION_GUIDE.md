# Khalsi AI Backend Implementation Guide

## 🚀 Quick Start Implementation

Panduan step-by-step untuk mengimplementasikan backend Khalsi AI berdasarkan arsitektur yang telah dibuat.

## 📋 Prerequisites Checklist

### System Requirements
- [ ] Node.js 20+ LTS
- [ ] Python 3.9+ untuk ML services
- [ ] PostgreSQL 15+
- [ ] Redis 7+
- [ ] Docker & Docker Compose
- [ ] Git

### API Keys & Services
- [ ] CoinGecko API Key (Pro tier recommended)
- [ ] Twitter API v2 credentials
- [ ] Discord Webhook (optional)
- [ ] SendGrid/SMTP credentials
- [ ] AWS/Google Cloud credentials (optional)

## 🏗️ Project Setup

### 1. Repository Structure

```bash
# Create main project structure
mkdir khalsi-ai-backend
cd khalsi-ai-backend

# Create core directories
mkdir -p {src,config,scripts,tests,docs,logs,data}

# Create service directories
mkdir -p src/{services,models,middleware,routes,utils,types}
mkdir -p src/services/{auth,market,predictions,user,notifications}
mkdir -p src/ml/{training,serving,utils}

# Create ML service
mkdir -p ml-service/{app,models,data,tests}

# Setup initial files
touch package.json tsconfig.json .env.example
touch docker-compose.yml Dockerfile nginx.conf
touch README.md CHANGELOG.md LICENSE
```

### 2. Package.json Setup

```json
{
  "name": "khalsi-ai-backend",
  "version": "1.0.0",
  "description": "Khalsi AI - Solana Market Prediction Platform Backend",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js",
    "ml:train": "python ml-service/train_models.py",
    "ml:serve": "python ml-service/serve_model.py"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "bullmq": "^4.10.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "winston": "^3.10.0",
    "joi": "^17.9.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "node-cron": "^3.0.0",
    "axios": "^1.4.0",
    "ws": "^8.13.0",
    "multer": "^1.4.5",
    "rate-limiter-flexible": "^2.4.0",
    "swagger-ui-express": "^4.6.0",
    "swagger-jsdoc": "^6.2.8"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/ws": "^8.5.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0",
    "jest": "^29.5.0",
    "eslint": "^8.40.0",
    "prettier": "^2.8.0"
  }
}
```

### 3. Environment Configuration

```bash
# Copy and configure environment
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Environment Variables:**
```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/khalsi_ai
DB_POOL_MIN=5
DB_POOL_MAX=20

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# External APIs
COINGECKO_API_KEY=your-coingecko-pro-api-key
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Social Media APIs
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# ML Service
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_API_KEY=your-ml-service-key

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

## 🗄️ Database Setup

### 1. PostgreSQL Schema Creation

```bash
# Create database
createdb khalsi_ai

# Run migrations
npm run db:migrate
```

**Migration Script (scripts/migrate.js):**
```javascript
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  try {
    const migrationPath = path.join(__dirname, '../sql/migrations');
    const files = fs.readdirSync(migrationPath);
    
    for (const file of files.sort()) {
      const sql = fs.readFileSync(path.join(migrationPath, file), 'utf8');
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
    }
    
    console.log('✅ All migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
```

**Migration Files (sql/migrations/001_initial_schema.sql):**
```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    preferences JSONB,
    subscription JSONB DEFAULT '{"plan": "free", "features": ["basic_predictions"]}',
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Data Table
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    volume_24h DECIMAL(20,2),
    market_cap DECIMAL(20,2),
    price_change_24h DECIMAL(8,4),
    price_change_percentage_24h DECIMAL(8,4),
    circulating_supply DECIMAL(25,2),
    total_supply DECIMAL(25,2),
    max_supply DECIMAL(25,2),
    ath DECIMAL(20,8),
    ath_change_percentage DECIMAL(8,4),
    ath_date TIMESTAMP WITH TIME ZONE,
    atl DECIMAL(20,8),
    atl_change_percentage DECIMAL(8,4),
    atl_date TIMESTAMP WITH TIME ZONE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(50) DEFAULT 'coingecko'
);

-- Predictions Table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(20) NOT NULL,
    probability_up DECIMAL(5,4) NOT NULL,
    probability_down DECIMAL(5,4) NOT NULL,
    probability_sideways DECIMAL(5,4),
    confidence_level DECIMAL(5,4) NOT NULL,
    price_target DECIMAL(20,8),
    support_levels DECIMAL(20,8)[],
    resistance_levels DECIMAL(20,8)[],
    risk_level VARCHAR(20) NOT NULL,
    methodology JSONB,
    models_used VARCHAR(50)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_market_data_symbol_timestamp ON market_data(symbol, timestamp DESC);
CREATE INDEX idx_predictions_symbol_timeframe ON predictions(symbol, timeframe);
CREATE INDEX idx_predictions_created_at ON predictions(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. Redis Setup for Caching

```javascript
// src/config/redis.js
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

export default redisClient;

// Usage examples:
// await redisClient.setex('key', 3600, 'value');
// const value = await redisClient.get('key');
// await redisClient.del('key');
```

## 🔐 Authentication Implementation

### 1. JWT Authentication Service

```javascript
// src/services/auth/auth.service.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../../config/database.js';

class AuthService {
  generateTokens(payload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: payload.id, tokenVersion: payload.tokenVersion || 1 },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
    );

    return { accessToken, refreshToken };
  }

  async register(userData) {
    const { email, password, username, preferences } = userData;
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, username, password_hash, preferences, token_version)
       VALUES ($1, $2, $3, $4, 1)
       RETURNING id, email, username, role, preferences, created_at`,
      [email, username, passwordHash, JSON.stringify(preferences || {})]
    );

    const user = result.rows[0];
    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    return { user, tokens };
  }

  async login(email, password) {
    // Get user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1 AND email_verified = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      tokenVersion: user.token_version
    });

    return { user, tokens };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      // Get current user
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];

      // Check token version
      if (user.token_version !== decoded.tokenVersion) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        tokenVersion: user.token_version
      });

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService();
```

### 2. Authentication Middleware

```javascript
// src/middleware/auth.middleware.js
import authService from '../services/auth/auth.service.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Access token required' }
    });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Invalid or expired token' }
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    next();
  };
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Ignore invalid tokens in optional auth
    }
  }
  
  next();
};
```

## 📊 Market Data Service Implementation

### 1. CoinGecko Integration Service

```javascript
// src/services/market/coingecko.service.js
import axios from 'axios';
import redis from '../../config/redis.js';

class CoinGeckoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.apiKey = process.env.COINGECKO_API_KEY;
    this.cacheDuration = 30; // 30 seconds cache
  }

  get headers() {
    return {
      'X-CG-Demo-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async makeRequest(endpoint, params = {}) {
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: this.headers,
        params
      });

      // Cache the response
      await redis.setex(cacheKey, this.cacheDuration, JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error:', error.message);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  async getSolanaPrice() {
    const data = await this.makeRequest('/coins/markets', {
      vs_currency: 'usd',
      ids: 'solana',
      order: 'market_cap_desc',
      per_page: 1,
      page: 1,
      sparkline: true,
      price_change_percentage: '1h,24h,7d'
    });

    return data[0];
  }

  async getTrendingTokens(limit = 10) {
    const data = await this.makeRequest('/search/trending');
    
    // Filter for Solana ecosystem
    const solanaTokens = await this.makeRequest('/coins/markets', {
      vs_currency: 'usd',
      category: 'solana-ecosystem',
      order: 'volume_desc',
      per_page: limit,
      page: 1
    });

    return {
      trending: data.coins.slice(0, limit),
      solana_ecosystem: solanaTokens
    };
  }

  async getTokenDetails(symbol) {
    // Get coin ID for the symbol
    const searchData = await this.makeRequest('/search', { query: symbol });
    const coin = searchData.coins.find(c => 
      c.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (!coin) {
      throw new Error(`Token ${symbol} not found`);
    }

    // Get detailed information
    const details = await this.makeRequest(`/coins/${coin.id}`, {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: true,
      developer_data: false,
      sparkline: true
    });

    return {
      id: details.id,
      symbol: details.symbol,
      name: details.name,
      description: details.description?.en || '',
      current_price: details.market_data?.current_price?.usd,
      market_cap: details.market_data?.market_cap?.usd,
      total_volume: details.market_data?.total_volume?.usd,
      circulating_supply: details.market_data?.circulating_supply,
      price_change_percentage_24h: details.market_data?.price_change_percentage_24h,
      market_cap_rank: details.market_cap_rank,
      community_data: details.community_data,
      social_metrics: {
        reddit_subscribers: details.community_data?.reddit_subscribers,
        twitter_followers: details.community_data?.twitter_followers,
        facebook_likes: details.community_data?.facebook_likes
      }
    };
  }

  async getHistoricalData(symbol, days = 30) {
    const searchData = await this.makeRequest('/search', { query: symbol });
    const coin = searchData.coins.find(c => 
      c.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (!coin) {
      throw new Error(`Token ${symbol} not found`);
    }

    const historicalData = await this.makeRequest(`/coins/${coin.id}/market_chart`, {
      vs_currency: 'usd',
      days: days,
      interval: days <= 1 ? 'hourly' : 'daily'
    });

    return {
      prices: historicalData.prices,
      volumes: historicalData.total_volumes,
      market_caps: historicalData.market_caps
    };
  }
}

export default new CoinGeckoService();
```

### 2. Market Data Controller

```javascript
// src/controllers/market.controller.js
import coinGeckoService from '../services/market/coingecko.service.js';
import marketService from '../services/market/market.service.js';

export const getSolanaPrice = async (req, res) => {
  try {
    const data = await coinGeckoService.getSolanaPrice();
    
    res.json({
      success: true,
      data: {
        symbol: 'SOL',
        name: 'Solana',
        price_usd: data.current_price,
        price_btc: data.current_price / 45000, // Approximate BTC price
        volume_24h: data.total_volume,
        market_cap: data.market_cap,
        price_change_24h: data.price_change_24h,
        price_change_percentage_24h: data.price_change_percentage_24h,
        last_updated: new Date().toISOString(),
        circulating_supply: data.circulating_supply,
        total_supply: data.total_supply,
        max_supply: data.max_supply,
        sparkline_data: data.sparkline_in_7d?.price || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

export const getTrendingTokens = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    
    const data = await coinGeckoService.getTrendingTokens(limit);
    
    // Process trending data
    const trendingTokens = data.trending.map(item => ({
      id: item.item.id,
      symbol: item.item.symbol,
      name: item.item.name,
      current_price: item.item.price_btc ? item.item.price_btc * 45000 : null,
      market_cap_rank: item.item.market_cap_rank,
      market_cap: item.item.market_cap,
      total_volume: item.item.total_volume,
      price_change_percentage_24h: item.item.price_change_percentage_24h?.usd,
      social_score: item.item.score + 1, // Simple scoring
      category: 'trending'
    }));

    res.json({
      success: true,
      data: {
        tokens: trendingTokens,
        meta: {
          total_count: trendingTokens.length,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

export const getTokenDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Symbol is required' }
      });
    }

    const data = await coinGeckoService.getTokenDetails(symbol);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
```

## 🤖 AI Prediction Service

### 1. Prediction Engine Service

```javascript
// src/services/predictions/prediction.service.js
import db from '../../config/database.js';
import redis from '../../config/redis.js';
import coinGeckoService from '../market/coingecko.service.js';

class PredictionService {
  async getMarketPrediction(symbol, timeframe = '1h') {
    const cacheKey = `prediction:${symbol}:${timeframe}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      // Get current market data
      const marketData = await coinGeckoService.getTokenDetails(symbol);
      const historicalData = await coinGeckoService.getHistoricalData(symbol, 7);
      
      // Calculate prediction
      const prediction = await this.calculatePrediction({
        symbol,
        timeframe,
        currentPrice: marketData.current_price,
        volume24h: marketData.total_volume,
        priceChange24h: marketData.price_change_percentage_24h,
        historicalPrices: historicalData.prices,
        historicalVolumes: historicalData.volumes
      });

      // Cache prediction for 5 minutes
      await redis.setex(cacheKey, 300, JSON.stringify(prediction));
      
      return prediction;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  async calculatePrediction(data) {
    const { symbol, timeframe, currentPrice, volume24h, priceChange24h, historicalPrices, historicalVolumes } = data;
    
    // Volume-based analysis
    const volumes = historicalVolumes.map(v => v[1]);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const currentVolume = volumes[volumes.length - 1];
    const volumeRatio = currentVolume / avgVolume;
    
    // Price momentum
    const recentPrices = historicalPrices.slice(-24); // Last 24 data points
    const priceMomentum = (recentPrices[recentPrices.length - 1][1] - recentPrices[0][1]) / recentPrices[0][1];
    
    // Calculate probabilities
    const { probUp, probDown, confidence } = this.calculateProbabilities({
      volumeRatio,
      priceMomentum,
      priceChange24h,
      currentPrice
    });

    // Generate price targets
    const priceTarget = this.calculatePriceTargets(currentPrice, probUp, probDown);
    
    // Risk assessment
    const riskLevel = this.assessRisk(volumeRatio, confidence, priceMomentum);

    return {
      symbol,
      timeframe,
      probability_up: probUp,
      probability_down: probDown,
      probability_sideways: 1 - probUp - probDown,
      confidence_level: confidence,
      price_target: priceTarget,
      support_resistance: this.calculateSupportResistance(recentPrices),
      risk_level: riskLevel,
      methodology: {
        indicators_used: ['RVOL', 'VROC', 'Momentum'],
        weighting: { volume: 0.4, momentum: 0.3, sentiment: 0.3 },
        model_version: 'v2.1.3'
      },
      timestamp: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
    };
  }

  calculateProbabilities({ volumeRatio, priceMomentum, priceChange24h, currentPrice }) {
    // Base probabilities
    let probUp = 0.5;
    let probDown = 0.5;
    
    // Volume influence
    const volumeWeight = 0.4;
    if (volumeRatio > 1.5) {
      probUp += volumeWeight * 0.2;
      probDown -= volumeWeight * 0.2;
    } else if (volumeRatio < 0.7) {
      probUp -= volumeWeight * 0.15;
      probDown += volumeWeight * 0.15;
    }
    
    // Momentum influence
    const momentumWeight = 0.3;
    if (priceMomentum > 0.02) {
      probUp += momentumWeight * 0.25;
      probDown -= momentumWeight * 0.25;
    } else if (priceMomentum < -0.02) {
      probUp -= momentumWeight * 0.2;
      probDown += momentumWeight * 0.2;
    }
    
    // Normalize
    probUp = Math.max(0.05, Math.min(0.95, probUp));
    probDown = Math.max(0.05, Math.min(0.95, probDown));
    probDown = Math.min(probDown, 1 - probUp);
    
    // Confidence based on signal strength
    const signalStrength = Math.abs(volumeRatio - 1) + Math.abs(priceMomentum);
    const confidence = Math.min(0.95, 0.5 + (signalStrength * 2));
    
    return { probUp, probDown, confidence };
  }

  calculatePriceTargets(currentPrice, probUp, probDown) {
    const volatility = 0.05; // Assume 5% volatility
    const range = currentPrice * volatility;
    
    return {
      upside: probUp > 0.55 ? currentPrice + range : null,
      downside: probDown > 0.55 ? currentPrice - range : null,
      current: currentPrice
    };
  }

  calculateSupportResistance(prices) {
    const priceValues = prices.map(p => p[1]);
    const sortedPrices = [...priceValues].sort((a, b) => a - b);
    
    // Simple support and resistance calculation
    const supportLevels = sortedPrices.slice(0, 3);
    const resistanceLevels = sortedPrices.slice(-3);
    
    return {
      support_levels: supportLevels,
      resistance_levels: resistanceLevels
    };
  }

  assessRisk(volumeRatio, confidence, priceMomentum) {
    const volumeRisk = Math.abs(volumeRatio - 1) > 1.5 ? 'high' : 'medium';
    const confidenceRisk = confidence < 0.6 ? 'high' : confidence < 0.7 ? 'medium' : 'low';
    const momentumRisk = Math.abs(priceMomentum) > 0.05 ? 'high' : 'medium';
    
    const riskScores = { low: 1, medium: 2, high: 3 };
    const avgRisk = (riskScores[volumeRisk] + riskScores[confidenceRisk] + riskScores[momentumRisk]) / 3;
    
    if (avgRisk >= 2.5) return 'high';
    if (avgRisk >= 1.5) return 'medium';
    return 'low';
  }

  async savePrediction(prediction) {
    const query = `
      INSERT INTO predictions (
        symbol, timeframe, probability_up, probability_down, 
        probability_sideways, confidence_level, price_target,
        risk_level, methodology, created_at, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)
      RETURNING id
    `;
    
    const values = [
      prediction.symbol,
      prediction.timeframe,
      prediction.probability_up,
      prediction.probability_down,
      prediction.probability_sideways,
      prediction.confidence_level,
      JSON.stringify(prediction.price_target),
      prediction.risk_level,
      JSON.stringify(prediction.methodology),
      prediction.expires_at
    ];
    
    const result = await db.query(query, values);
    return result.rows[0].id;
  }
}

export default new PredictionService();
```

### 2. Prediction Controller

```javascript
// src/controllers/predictions.controller.js
import predictionService from '../services/predictions/prediction.service.js';

export const getMarketPrediction = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h', limit = 1 } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Symbol is required' }
      });
    }

    const predictions = [];
    
    for (let i = 0; i < parseInt(limit); i++) {
      const prediction = await predictionService.getMarketPrediction(symbol, timeframe);
      predictions.push(prediction);
      
      // Save to database
      await predictionService.savePrediction(prediction);
    }
    
    res.json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        timeframe,
        predictions,
        meta: {
          model_version: 'v2.1.3',
          data_freshness: 'real-time',
          total_predictions: predictions.length,
          average_confidence: predictions.reduce((sum, p) => sum + p.confidence_level, 0) / predictions.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

export const getPredictionSummary = async (req, res) => {
  try {
    const { timeframe = '1h', category } = req.query;
    
    // Get predictions for major tokens
    const symbols = ['SOL', 'BONK', 'WIF', 'SAMO', 'RAY'];
    const predictions = [];
    
    for (const symbol of symbols) {
      try {
        const prediction = await predictionService.getMarketPrediction(symbol, timeframe);
        predictions.push({
          symbol,
          name: symbol === 'SOL' ? 'Solana' : symbol,
          current_price: prediction.price_target.current,
          prediction_1h: {
            probability_up: prediction.probability_up,
            probability_down: prediction.probability_down,
            confidence: prediction.confidence_level,
            trend: prediction.probability_up > 0.55 ? 'bullish' : 
                   prediction.probability_down > 0.55 ? 'bearish' : 'sideways'
          },
          risk_level: prediction.risk_level,
          category: 'infrastructure', // This would come from a token registry
          last_updated: prediction.timestamp
        });
      } catch (error) {
        console.error(`Failed to get prediction for ${symbol}:`, error.message);
      }
    }
    
    res.json({
      success: true,
      data: {
        predictions,
        summary: {
          total_tokens: predictions.length,
          bullish_predictions: predictions.filter(p => p.prediction_1h.trend === 'bullish').length,
          bearish_predictions: predictions.filter(p => p.prediction_1h.trend === 'bearish').length,
          sideways_predictions: predictions.filter(p => p.prediction_1h.trend === 'sideways').length,
          high_confidence_predictions: predictions.filter(p => p.prediction_1h.confidence > 0.7).length,
          average_confidence: predictions.reduce((sum, p) => sum + p.prediction_1h.confidence, 0) / predictions.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
```

## 🚀 API Routes Setup

### 1. Main Routes Configuration

```javascript
// src/routes/index.js
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import marketRoutes from './market.routes.js';
import predictionsRoutes from './predictions.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/market', marketRoutes);
router.use('/predictions', predictionsRoutes);
router.use('/user', userRoutes);

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' }
  });
});

export default router;
```

### 2. Authentication Routes

```javascript
// src/routes/auth.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  body('username').isAlphanumeric().isLength({ min: 3, max: 50 }),
  body('preferences').optional().isObject()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
```

### 3. Market Routes

```javascript
// src/routes/market.routes.js
import { Router } from 'express';
import marketController from '../controllers/market.controller.js';
import { optionalAuth, authenticateToken } from '../middleware/auth.middleware.js';
import { rateLimitMiddleware } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes (with rate limiting)
router.get('/solana', rateLimitMiddleware, optionalAuth, marketController.getSolanaPrice);
router.get('/trending', rateLimitMiddleware, optionalAuth, marketController.getTrendingTokens);
router.get('/token/:symbol', rateLimitMiddleware, optionalAuth, marketController.getTokenDetails);

// Protected routes
router.get('/portfolio', authenticateToken, marketController.getUserPortfolio);

export default router;
```

## 🔧 Middleware Implementation

### 1. Rate Limiting Middleware

```javascript
// src/middleware/rateLimit.middleware.js
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from '../config/redis.js';

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rate_limit',
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
});

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const key = req.ip;
    await rateLimiter.consume(key);
    next();
  } catch (rejRes) {
    const remainingPoints = rejRes.remainingPoints || 0;
    const msBeforeNext = rejRes.msBeforeNext || 900000;
    
    res.set({
      'Retry-After': String(Math.round(msBeforeNext / 1000)),
      'X-RateLimit-Limit': String(rejRes.totalHits),
      'X-RateLimit-Remaining': String(remainingPoints),
      'X-RateLimit-Reset': String(new Date(Date.now() + msBeforeNext))
    });
    
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests from this IP',
        retry_after: Math.round(msBeforeNext / 1000)
      }
    });
  }
};

export { rateLimitMiddleware };
```

### 2. Validation Middleware

```javascript
// src/middleware/validation.middleware.js
import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
          value: err.value
        }))
      }
    });
  }
  
  next();
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);
  
  // Default error
  let status = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';
  
  // Handle specific errors
  if (error.name === 'ValidationError') {
    status = 400;
    message = error.message;
    code = 'VALIDATION_ERROR';
  } else if (error.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
    code = 'UNAUTHORIZED';
  } else if (error.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
    code = 'UNAUTHORIZED';
  } else if (error.code === '23505') {
    status = 409;
    message = 'Resource already exists';
    code = 'CONFLICT';
  }
  
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      request_id: req.id || 'unknown'
    }
  });
};
```

## 📊 Background Jobs & Scheduling

### 1. Job Queue Setup

```javascript
// src/config/queue.js
import { Queue } from 'bullmq';
import redis from './redis.js';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

export const predictionQueue = new Queue('predictions', { connection });
export const marketDataQueue = new Queue('market-data', { connection });
export const notificationQueue = new Queue('notifications', { connection });

// Job processors
import { updateMarketData } from '../workers/marketData.worker.js';
import { generatePredictions } from '../workers/predictions.worker.js';
import { sendNotifications } from '../workers/notification.worker.js';

// Process jobs
predictionQueue.process(5, generatePredictions);
marketDataQueue.process(3, updateMarketData);
notificationQueue.process(2, sendNotifications);
```

### 2. Cron Jobs Setup

```javascript
// src/jobs/scheduler.js
import cron from 'node-cron';
import { predictionQueue, marketDataQueue } from '../config/queue.js';

export const setupJobs = () => {
  // Update market data every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('📊 Updating market data...');
    await marketDataQueue.add('update-market-data', {
      symbols: ['SOL', 'BONK', 'WIF', 'SAMO', 'RAY']
    });
  });

  // Generate predictions every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('🤖 Generating predictions...');
    await predictionQueue.add('generate-predictions', {
      symbols: ['SOL', 'BONK', 'WIF', 'SAMO', 'RAY'],
      timeframes: ['15m', '1h', '4h']
    });
  });

  // Clean up old predictions every hour
  cron.schedule('0 * * * *', async () => {
    console.log('🧹 Cleaning up old data...');
    // Implement cleanup logic
  });
};
```

## 🐳 Docker Setup

### 1. Dockerfile

```dockerfile
# Use Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S khalsi -u 1001

# Change ownership
RUN chown -R khalsi:nodejs /app
USER khalsi

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/khalsi_ai
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-super-secret-jwt-key
      - COINGECKO_API_KEY=${COINGECKO_API_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=khalsi_ai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

  ml-service:
    build: ./ml-service
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/models
      - PORT=8000
    volumes:
      - ./ml-service/models:/app/models
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## 📈 Testing & Monitoring

### 1. API Testing

```javascript
// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('Authentication API', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        username: 'testuser'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should reject invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        username: 'testuser'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

### 2. Health Check Implementation

```javascript
// healthcheck.js
import { createClient } from 'pg';
import { createClient as createRedisClient } from 'redis';

const healthCheck = async () => {
  const checks = {
    database: false,
    redis: false,
    external_apis: false
  };

  try {
    // Check database
    const pgClient = createClient({
      connectionString: process.env.DATABASE_URL
    });
    await pgClient.connect();
    await pgClient.query('SELECT 1');
    await pgClient.end();
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check Redis
    const redisClient = createRedisClient({
      url: process.env.REDIS_URL
    });
    await redisClient.connect();
    await redisClient.ping();
    await redisClient.quit();
    checks.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  // Check external APIs
  try {
    const axios = require('axios');
    const response = await axios.get('https://api.coingecko.com/api/v3/ping', {
      timeout: 5000
    });
    checks.external_apis = response.status === 200;
  } catch (error) {
    console.error('External API health check failed:', error);
  }

  const allHealthy = Object.values(checks).every(check => check === true);
  
  if (!allHealthy) {
    process.exit(1);
  }
};

healthCheck();
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Monitoring tools setup (Sentry, logging)

### Deployment Steps
- [ ] Build and push Docker images
- [ ] Run database migrations
- [ ] Start services with Docker Compose
- [ ] Verify health checks pass
- [ ] Test API endpoints
- [ ] Set up monitoring alerts
- [ ] Configure backup strategies

### Post-deployment
- [ ] Monitor logs for errors
- [ ] Verify prediction accuracy
- [ ] Test user registration/login
- [ ] Check rate limiting
- [ ] Validate WebSocket connections

---

**Implementation Status**: Ready for development  
**Estimated Timeline**: 2-3 weeks for MVP  
**Dependencies**: CoinGecko API, PostgreSQL, Redis  
**Next Steps**: Start with authentication service and market data integration