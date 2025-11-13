# Khalsi AI API Endpoints Specification

## 🚀 API Overview

**Base URL**: `https://api.khalsi.ai/v1`  
**Protocol**: HTTPS  
**Content-Type**: `application/json`  
**Authentication**: Bearer JWT Token  

## 🔐 Authentication Endpoints

### POST /auth/register
Register new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "trader123",
  "preferences": {
    "notification": true,
    "theme": "dark"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "trader123",
      "role": "user",
      "created_at": "2025-11-13T19:37:00Z"
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token",
      "expires_in": 3600
    }
  }
}
```

### POST /auth/login
User authentication

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "trader123",
      "role": "user"
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token",
      "expires_in": 3600
    }
  }
}
```

### POST /auth/refresh
Refresh access token

**Request Body**:
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

### POST /auth/logout
User logout

**Headers**: `Authorization: Bearer jwt_access_token`

**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 📊 Market Data Endpoints

### GET /market/solana
Get real-time Solana data

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "SOL",
    "name": "Solana",
    "price_usd": 155.33,
    "price_btc": 0.004521,
    "volume_24h": 6033400000,
    "market_cap": 687350000000,
    "price_change_24h": -2.90,
    "price_change_percentage_24h": -2.90,
    "last_updated": "2025-11-13T19:37:00Z",
    "circulating_supply": 442925634.12,
    "total_supply": 544318336.74,
    "max_supply": 544318336.74
  }
}
```

### GET /market/trending
Get trending tokens in Solana ecosystem

**Query Parameters**:
- `limit` (optional): Number of results (default: 10, max: 50)
- `category` (optional): Filter by category (meme, defi, gaming)

**Response**:
```json
{
  "success": true,
  "data": {
    "tokens": [
      {
        "id": "solana",
        "symbol": "SOL",
        "name": "Solana",
        "current_price": 155.33,
        "market_cap_rank": 5,
        "market_cap": 687350000000,
        "total_volume": 6033400000,
        "price_change_percentage_24h": -2.90,
        "price_change_percentage_7d": 8.45,
        "social_score": 85,
        "sentiment_score": 0.72,
        "category": "infrastructure"
      },
      {
        "id": "bonk",
        "symbol": "BONK",
        "name": "Bonk",
        "current_price": 0.00003845,
        "market_cap_rank": 98,
        "market_cap": 2345000000,
        "total_volume": 120000000,
        "price_change_percentage_24h": 15.67,
        "price_change_percentage_7d": -8.23,
        "social_score": 92,
        "sentiment_score": 0.78,
        "category": "meme"
      }
    ],
    "meta": {
      "total_count": 2,
      "timestamp": "2025-11-13T19:37:00Z"
    }
  }
}
```

### GET /market/token/:symbol
Get detailed token information

**Parameters**:
- `symbol`: Token symbol (e.g., SOL, BONK, WIF)

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "SOL",
    "name": "Solana",
    "description": "Fast, secure, and scalable blockchain platform",
    "current_price": 155.33,
    "price_history_24h": [
      {
        "timestamp": "2025-11-13T18:00:00Z",
        "price": 160.12,
        "volume": 250000000
      }
    ],
    "market_metrics": {
      "market_cap": 687350000000,
      "fully_diluted_valuation": 844500000000,
      "total_volume": 6033400000,
      "circulating_supply": 442925634.12,
      "max_supply": 544318336.74,
      "ath": 259.96,
      "ath_change_percentage": -40.24,
      "ath_date": "2021-11-06T21:54:35.825Z",
      "atl": 0.500801,
      "atl_change_percentage": 30911.25,
      "atl_date": "2020-05-11T19:35:23.449Z"
    },
    "social_metrics": {
      "reddit_subscribers": 156420,
      "reddit_average_posts_48h": 15,
      "reddit_average_comments_48h": 89,
      "reddit_subscribers_48h": 1250,
      "reddit_points": 8950,
      "twitter_followers": 298456,
      "facebook_likes": 0,
      "telegram_channel_user_count": 0
    }
  }
}
```

## 🤖 AI Prediction Endpoints

### GET /predictions/market/:symbol
Get market predictions for specific token

**Parameters**:
- `symbol`: Token symbol
- `timeframe` (optional): Prediction timeframe (15m, 1h, 4h, 1d)
- `methodology` (optional): Prediction method (volume, sentiment, technical)

**Query Parameters**:
- `timeframe`: `15m|1h|4h|1d` (default: 1h)
- `limit`: Number of predictions (default: 1)

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "SOL",
    "timeframe": "1h",
    "predictions": [
      {
        "id": "uuid",
        "probability_up": 0.4867,
        "probability_down": 0.5133,
        "confidence_level": 0.6245,
        "price_target": {
          "upside": 158.45,
          "downside": 152.18,
          "current": 155.33
        },
        "support_resistance": {
          "support_levels": [152.18, 150.50, 148.90],
          "resistance_levels": [158.45, 162.30, 165.80]
        },
        "methodology": {
          "indicators_used": ["RVOL", "VROC", "OBV", "SMA", "RSI"],
          "weighting": {
            "volume": 0.4,
            "technical": 0.3,
            "sentiment": 0.3
          },
          "model_version": "v2.1.3"
        },
        "risk_assessment": {
          "risk_level": "medium",
          "volatility_score": 0.68,
          "correlation_score": 0.45
        },
        "timestamp": "2025-11-13T19:37:00Z",
        "expires_at": "2025-11-13T20:37:00Z"
      }
    ],
    "meta": {
      "model_version": "v2.1.3",
      "data_freshness": "real-time",
      "total_predictions": 1,
      "average_confidence": 0.6245
    }
  }
}
```

### GET /predictions/summary
Get prediction summary for all tracked tokens

**Query Parameters**:
- `timeframe`: Prediction timeframe
- `category`: Token category filter
- `risk_level`: Risk level filter (low, medium, high)

**Response**:
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "symbol": "SOL",
        "name": "Solana",
        "current_price": 155.33,
        "prediction_1h": {
          "probability_up": 0.4867,
          "probability_down": 0.5133,
          "confidence": 0.6245,
          "trend": "sideways"
        },
        "prediction_4h": {
          "probability_up": 0.5234,
          "probability_down": 0.4766,
          "confidence": 0.5876,
          "trend": "bullish"
        },
        "risk_level": "medium",
        "category": "infrastructure",
        "last_updated": "2025-11-13T19:37:00Z"
      }
    ],
    "summary": {
      "total_tokens": 25,
      "bullish_predictions": 12,
      "bearish_predictions": 8,
      "sideways_predictions": 5,
      "high_confidence_predictions": 7,
      "average_confidence": 0.6123
    }
  }
}
```

### GET /predictions/history/:symbol
Get historical prediction accuracy

**Parameters**:
- `symbol`: Token symbol
- `days`: Number of days to look back (default: 30, max: 365)

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "SOL",
    "period_days": 30,
    "accuracy_metrics": {
      "overall_accuracy": 0.7234,
      "precision_up": 0.6854,
      "precision_down": 0.7613,
      "precision_sideways": 0.7234,
      "total_predictions": 720,
      "correct_predictions": 521
    },
    "timeframe_performance": {
      "15m": {
        "accuracy": 0.6543,
        "total_predictions": 2880
      },
      "1h": {
        "accuracy": 0.7234,
        "total_predictions": 720
      },
      "4h": {
        "accuracy": 0.7892,
        "total_predictions": 180
      }
    },
    "methodology_performance": {
      "volume_based": {
        "accuracy": 0.7456,
        "usage_percentage": 0.65
      },
      "technical_analysis": {
        "accuracy": 0.7012,
        "usage_percentage": 0.25
      },
      "sentiment_analysis": {
        "accuracy": 0.6789,
        "usage_percentage": 0.10
      }
    }
  }
}
```

## 👤 User Management Endpoints

### GET /user/profile
Get current user profile

**Headers**: `Authorization: Bearer jwt_access_token`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "trader123",
    "role": "user",
    "preferences": {
      "notification": true,
      "theme": "dark",
      "default_timeframe": "1h",
      "risk_tolerance": "medium"
    },
    "subscription": {
      "plan": "premium",
      "expires_at": "2025-12-13T19:37:00Z",
      "features": [
        "real_time_predictions",
        "advanced_analytics",
        "priority_support"
      ]
    },
    "created_at": "2025-10-13T10:30:00Z",
    "last_login": "2025-11-13T19:35:00Z"
  }
}
```

### PUT /user/profile
Update user profile

**Request Body**:
```json
{
  "username": "newtrader123",
  "preferences": {
    "notification": false,
    "theme": "light",
    "default_timeframe": "4h",
    "risk_tolerance": "high"
  }
}
```

### GET /user/portfolio
Get user's portfolio

**Query Parameters**:
- `include_pnl` (optional): Include P&L calculations
- `period` (optional): P&L period (1d, 7d, 30d, 90d, 1y)

**Response**:
```json
{
  "success": true,
  "data": {
    "holdings": [
      {
        "symbol": "SOL",
        "name": "Solana",
        "quantity": 50.0,
        "average_price": 145.50,
        "current_price": 155.33,
        "market_value": 7766.50,
        "unrealized_pnl": {
          "amount": 491.50,
          "percentage": 6.75,
          "period": "all_time"
        },
        "allocation_percentage": 75.5
      }
    ],
    "summary": {
      "total_value": 10283.45,
      "total_pnl": {
        "amount": 823.45,
        "percentage": 8.71,
        "period": "all_time"
      },
      "total_symbols": 3,
      "largest_position": "SOL",
      "diversification_score": 0.68
    }
  }
}
```

### POST /user/portfolio/position
Add new position to portfolio

**Request Body**:
```json
{
  "symbol": "BONK",
  "quantity": 10000000,
  "price": 0.00003845,
  "notes": "Meme coin speculation"
}
```

## 🔔 Alert Management Endpoints

### GET /alerts
Get user alerts

**Query Parameters**:
- `status`: Filter by status (active, triggered, expired)
- `symbol` (optional): Filter by symbol
- `limit` (optional): Number of results

**Response**:
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "uuid",
        "symbol": "SOL",
        "alert_type": "price_target",
        "condition": {
          "type": "price_above",
          "value": 160.00,
          "timeframe": "1h"
        },
        "notification_channels": ["email", "push"],
        "is_active": true,
        "triggered_at": null,
        "created_at": "2025-11-13T15:30:00Z",
        "trigger_count": 0
      }
    ],
    "meta": {
      "total_alerts": 5,
      "active_alerts": 3,
      "triggered_today": 1
    }
  }
}
```

### POST /alerts
Create new alert

**Request Body**:
```json
{
  "symbol": "SOL",
  "alert_type": "price_target",
  "condition": {
    "type": "price_above",
    "value": 160.00,
    "timeframe": "1h"
  },
  "notification_channels": ["email", "push"],
  "message": "SOL breaking resistance level!"
}
```

### PUT /alerts/:id
Update alert

### DELETE /alerts/:id
Delete alert

## 📡 Real-time WebSocket Endpoints

### Connection
**URL**: `wss://api.khalsi.ai/v1/ws`  
**Authentication**: JWT Token in query parameter or header

### Subscribe to Market Updates

```javascript
// Subscribe message
{
  "action": "subscribe",
  "channel": "market_updates",
  "symbols": ["SOL", "BONK", "WIF"]
}

// Response
{
  "type": "subscription",
  "channel": "market_updates",
  "status": "subscribed",
  "symbols": ["SOL", "BONK", "WIF"]
}

// Real-time data updates
{
  "type": "market_update",
  "symbol": "SOL",
  "data": {
    "price": 155.67,
    "volume": 125000000,
    "price_change_24h": -2.45,
    "timestamp": "2025-11-13T19:37:30Z"
  }
}
```

### Subscribe to Predictions

```javascript
// Subscribe message
{
  "action": "subscribe",
  "channel": "predictions",
  "symbols": ["SOL"]
}

// Prediction update
{
  "type": "prediction_update",
  "symbol": "SOL",
  "data": {
    "timeframe": "1h",
    "probability_up": 0.5234,
    "probability_down": 0.4766,
    "confidence": 0.6789,
    "price_target": 158.45,
    "timestamp": "2025-11-13T19:37:30Z"
  }
}
```

### Subscribe to Alerts

```javascript
// Alert triggered
{
  "type": "alert_triggered",
  "alert_id": "uuid",
  "symbol": "SOL",
  "message": "SOL price target reached: $160.00",
  "timestamp": "2025-11-13T19:37:30Z"
}
```

## 📊 Analytics Endpoints

### GET /analytics/dashboard
Get dashboard analytics data

**Query Parameters**:
- `period`: Analytics period (1d, 7d, 30d, 90d)

**Response**:
```json
{
  "success": true,
  "data": {
    "market_overview": {
      "total_tracked_tokens": 1250,
      "bullish_tokens": 478,
      "bearish_tokens": 523,
      "neutral_tokens": 249,
      "high_confidence_predictions": 234
    },
    "prediction_metrics": {
      "accuracy_24h": 0.7234,
      "accuracy_7d": 0.7156,
      "accuracy_30d": 0.7089,
      "total_predictions_24h": 30000,
      "unique_users_served": 15420
    },
    "popular_tokens": [
      {
        "symbol": "SOL",
        "queries": 12540,
        "predictions_generated": 8943
      },
      {
        "symbol": "BONK",
        "queries": 8923,
        "predictions_generated": 6123
      }
    ],
    "api_metrics": {
      "requests_24h": 245678,
      "average_response_time": 89,
      "error_rate": 0.02,
      "rate_limit_hits": 234
    }
  }
}
```

## 🔍 Search Endpoints

### GET /search/tokens
Search for tokens

**Query Parameters**:
- `q`: Search query
- `category` (optional): Filter by category
- `limit` (optional): Results limit (default: 10, max: 50)

**Response**:
```json
{
  "success": true,
  "data": {
    "tokens": [
      {
        "id": "solana",
        "symbol": "SOL",
        "name": "Solana",
        "description": "Fast, secure, and scalable blockchain platform",
        "market_cap_rank": 5,
        "current_price": 155.33,
        "price_change_percentage_24h": -2.90,
        "category": "infrastructure",
        "logo": "https://assets.coingecko.com/coins/images/4128/large/solana.png"
      }
    ],
    "meta": {
      "total_results": 15,
      "query": "sol",
      "search_time": 0.023
    }
  }
}
```

## ⚠️ Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "request_id": "uuid",
    "timestamp": "2025-11-13T19:37:00Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

**Authentication**: All protected endpoints require Bearer JWT token in Authorization header  
**Rate Limiting**: Default 100 requests per 15 minutes per IP  
**Pagination**: Use `page` and `limit` parameters for paginated responses  
**Response Format**: All responses follow the `success/data/error` structure