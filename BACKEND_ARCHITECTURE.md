# Khalsi AI Backend Architecture & Framework

## 🏗️ System Architecture Overview

Khalsi AI Backend menggunakan arsitektur microservices dengan fokus pada analisis data real-time dan machine learning untuk prediksi pasar cryptocurrency.

## 🎯 Core Objectives

- **Real-time Data Processing**: Stream processing untuk market data CoinGecko
- **AI-Powered Predictions**: Machine learning models untuk probability calculations
- **Scalable Analytics**: Handle 10,000+ concurrent users
- **Low Latency**: <100ms response time untuk market predictions
- **High Availability**: 99.9% uptime dengan failover mechanisms

## 🛠️ Technology Stack

### Core Backend Framework
```javascript
// Primary Stack
- Node.js 20+ (LTS)
- TypeScript 5.0+
- Express.js / Fastify (Web Framework)
- PostgreSQL 15+ (Primary Database)
- Redis 7+ (Cache & Session Store)
- Socket.io (WebSocket untuk Real-time)
- BullMQ (Background Jobs)
```

### AI/ML Stack
```javascript
- TensorFlow.js / TensorFlow Python
- Python FastAPI (ML Microservices)
- scikit-learn (Traditional ML)
- pandas (Data Processing)
- numpy (Numerical Computing)
```

### Infrastructure
```yaml
# Containerization
Docker + Docker Compose

# Message Queue
Redis Pub/Sub
Bull Queue (Job Processing)

# Monitoring
Prometheus + Grafana
Winston (Logging)
Sentry (Error Tracking)

# Deployment
AWS / Google Cloud Platform
Nginx (Reverse Proxy)
Cloudflare (CDN)
```

## 🏛️ Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Khalsi AI Backend                        │
├─────────────────────────────────────────────────────────────┤
│  API Gateway (Express.js)                                   │
│  ├── Authentication Service                                 │
│  ├── Market Data Service                                   │
│  ├── AI Prediction Service                                 │
│  ├── User Management Service                               │
│  └── Notification Service                                  │
├─────────────────────────────────────────────────────────────┤
│  Database Layer                                             │
│  ├── PostgreSQL (Primary Data)                             │
│  ├── Redis (Cache & Sessions)                              │
│  └── InfluxDB (Time Series Data)                           │
├─────────────────────────────────────────────────────────────┤
│  External APIs                                              │
│  ├── CoinGecko API                                         │
│  ├── WebSocket Feeds                                       │
│  └── Social Media APIs (Sentiment)                         │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### Primary Tables (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Data Table
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    volume_24h DECIMAL(20,2),
    market_cap DECIMAL(20,2),
    price_change_24h DECIMAL(8,4),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(50) DEFAULT 'coingecko'
);

-- Predictions Table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(20) NOT NULL,
    probability_up DECIMAL(5,4),
    probability_down DECIMAL(5,4),
    confidence_level DECIMAL(5,4),
    price_target DECIMAL(20,8),
    methodology JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- User Portfolios Table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    avg_price DECIMAL(20,8) NOT NULL,
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trending Tokens Table
CREATE TABLE trending_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    volume_24h DECIMAL(20,2),
    price_change_24h DECIMAL(8,4),
    rank INTEGER,
    category VARCHAR(50),
    social_mentions INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts Table
CREATE TABLE user_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    symbol VARCHAR(20) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    condition JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions Table (for WebSocket connections)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    socket_id VARCHAR(100),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    disconnected_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);
```

### Indexes for Performance

```sql
-- Market Data Indexes
CREATE INDEX idx_market_data_symbol_timestamp ON market_data(symbol, timestamp DESC);
CREATE INDEX idx_market_data_timestamp ON market_data(timestamp DESC);

-- Predictions Indexes
CREATE INDEX idx_predictions_symbol_timeframe ON predictions(symbol, timeframe);
CREATE INDEX idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX idx_predictions_expires_at ON predictions(expires_at);

-- Trending Tokens Indexes
CREATE INDEX idx_trending_tokens_timestamp ON trending_tokens(timestamp DESC);
CREATE INDEX idx_trending_tokens_category ON trending_tokens(category);
```

## 🔧 Configuration Files

### package.json Dependencies

```json
{
  "name": "khalsi-ai-backend",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.0.0",
    "socket.io": "^4.7.0",
    "redis": "^4.6.0",
    "pg": "^8.11.0",
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
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/ws": "^8.5.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0"
  }
}
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Environment Variables (.env)

```env
# Server Configuration
NODE_ENV=production
PORT=3001
API_VERSION=v1

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/khalsi_ai
DB_POOL_MIN=5
DB_POOL_MAX=20

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# CoinGecko API
COINGECKO_API_KEY=your-coingecko-api-key
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# ML Service
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_API_KEY=your-ml-service-key

# Notification Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password

# External APIs
TWITTER_API_KEY=your-twitter-api-key
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# WebSocket
WS_HEARTBEAT_INTERVAL=30000
WS_HEARTBEAT_TIMEOUT=5000

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Sources  │───▶│   Processing    │───▶│   Storage       │
│                 │    │                 │    │                 │
│ • CoinGecko API │    │ • Transform     │    │ • PostgreSQL    │
│ • WebSocket     │    │ • Validate      │    │ • Redis Cache   │
│ • Social APIs   │    │ • Enrich        │    │ • InfluxDB      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ML Pipeline   │    │   API Gateway   │    │   WebSocket     │
│                 │    │                 │    │                 │
│ • Feature Eng   │    │ • Authentication│    │ • Real-time     │
│ • Model Pred.   │    │ • Rate Limiting │    │ • Notifications │
│ • Probability    │    │ • Business Logic│    │ • Live Updates  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Deployment Strategy

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose

```yaml
# docker-compose.yml
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
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=khalsi_ai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
```

## 📈 Monitoring & Observability

### Health Check Endpoints

```javascript
// Health check routes
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    coingecko: await checkCoinGeckoAPI(),
    ml_service: await checkMLService()
  };
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks
  });
});
```

### Logging Strategy

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🔐 Security Implementation

### Authentication Middleware

```javascript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user as any;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

## 📝 API Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP
  message: {
    error: 'Too many requests from this IP',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { limiter };
```

---

**Next Steps**: Implement specific endpoints based on this architecture (see API_ENDPOINTS.md)