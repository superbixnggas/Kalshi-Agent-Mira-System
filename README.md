# Khalsi AI - Platform Analisis Pasar Solana

![Khalsi AI Platform](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.0+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Khalsi AI** adalah platform analisis pasar cryptocurrency yang berfokus pada ekosistem Solana, dipersonifikasikan oleh karakter AI anime yang cerdas dan ramah.

## 🎯 Overview

Platform ini menawarkan analisis pasar real-time dengan teknologi AI untuk membantu trader dan investor dalam mengambil keputusan yang lebih baik di pasar Solana. Dikembangkan dengan React + TypeScript dan terintegrasi dengan CoinGecko API untuk data pasar yang akurat.

### 🌟 Fitur Utama

#### ✅ **Market Probability (AKTIF)**
- Prediksi harga real-time menggunakan volume-based analysis
- Enhanced probability calculations (RVOL, VROC, OBV)
- Multiple timeframes (15 menit, 1 jam, 4 jam)
- Interactive charts dengan refresh data real-time
- Confidence intervals yang akurat

#### 🚧 **Interactive AI Mode (COMING SOON)**
- Mode percakapan dengan Khalsi AI
- Analisis market dengan voice dan animasi
- Rekomendasi trading yang dipersonalisasi

#### 🚧 **Explore Insights (COMING SOON)**
- Dashboard trending tokens Solana (BONK, WIF, SAMO)
- Volume analysis dan bubble maps
- Community sentiment analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, atau pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/superbixnggas/Kalshi-Agent-Mira-System.git
cd Kalshi-Agent-Mira-System

# Install dependencies
cd khalsi-ai
npm install
# atau
pnpm install

# Start development server
npm run dev
# atau  
pnpm dev
```

### Build untuk Production

```bash
# Build production
npm run build
# atau
pnpm build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
Kalshi-Agent-Mira-System/
├── khalsi-ai/                 # Main React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json          # Dependencies & scripts
├── docs/                     # Documentation
│   ├── coingecko_api_research.md    # API research
│   ├── khalsi_content.md            # Character content
│   ├── market_data_structure.md     # Data structures
│   └── visual_design_concept.md     # Design specifications
├── imgs/                     # Character assets
│   ├── khalsi_waifu_main.png
│   ├── khalsi_trading_desk.png
│   └── khalsi_dashboard_avatar.png
└── README.md                 # This file
```

## 🛠 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Chart.js** - Interactive charts
- **React Router** - Navigation

### API Integration
- **CoinGecko API** - Real-time cryptocurrency data
- **Enhanced Volume Analysis** - Custom probability calculations

### Design
- **Anime-Futuristic Theme** - Blue & purple neon colors
- **Character Branding** - Khalsi AI persona
- **Responsive Design** - Mobile-first approach

## 🎨 Khalsi Character Design

### Personality
- **Nama**: Khalsi AI
- **Kepribadian**: Ramah, cerdas, analitis, empatik, inovatif
- **Appearance**: 
  - Rambut putih keperakan panjang
  - Mata biru elektrik ekspresif
  - Seragam profesional hijau-hijau
  - Pose ramah dan welcoming

### Dialog Examples
```
"Halo! Saya Khalsi. Yuk mulai memahami peluang pasar Solana bersama!"

"Hari ini pasar Solana lagi panas di sektor meme, siap pantau?"

"Aku lihat tren volume naik signifikan di sektor meme hari ini, mungkin ada rotasi capital."
```

## 📊 Market Analysis Features

### Volume-Based Probability
Platform menggunakan analisis volume yang sophisticated:

- **RVOL (Relative Volume)** - Volume relatif terhadap rata-rata
- **VROC (Volume Rate of Change)** - Tingkat perubahan volume
- **OBV (On-Balance Volume)** - Volume akumulatif

### Timeframe Analysis
- **15 menit**: Quick scalping opportunities
- **1 jam**: Short-term trend analysis (default)
- **4 jam**: Medium-term swing trading

### Confidence Levels
- **60%+**: High confidence predictions
- **40-59%**: Moderate confidence
- **<40%**: Low confidence (informational only)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # ESLint check

# Type checking
npm run type-check   # TypeScript type check
```

### Environment Variables

Buat file `.env.local` di root folder `khalsi-ai/`:

```env
# CoinGecko API (optional - uses public endpoints)
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_APP_ENV=development
```

### API Endpoints

#### Market Data
- `GET /api/v3/coins/markets` - Current SOL price & market data
- `GET /api/v3/search/trending` - Trending tokens

#### Probability Engine
- `/api/market-probability` - Current probability predictions
- `/api/trending-tokens` - Solana trending tokens data

## 📈 CoinGecko Integration

Platform terintegrasi dengan CoinGecko API untuk:

1. **Real-time SOL price data**
2. **Volume and market cap information**
3. **Trending tokens in Solana ecosystem**
4. **Historical price data untuk charts**

Rate limit: ~30 calls/minute (public tier)

## 🎯 Roadmap

### Phase 1: Core Platform ✅
- [x] Landing page dengan Khalsi character
- [x] Dashboard dengan market overview
- [x] Market Probability dengan enhanced calculations
- [x] CoinGecko API integration

### Phase 2: Enhanced Features 🚧
- [ ] Interactive AI Mode dengan voice analysis
- [ ] Explore Insights dengan trending tokens
- [ ] User authentication & portfolios
- [ ] Alert system

### Phase 3: Advanced Analytics 🔮
- [ ] Machine learning predictions
- [ ] Social sentiment analysis
- [ ] Multi-chain support
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- React functional components dengan hooks

## 📞 Support & Community

- **GitHub Issues**: Report bugs dan request features
- **Discord**: Bergabung dengan komunitas trader Solana
- **Twitter**: @KhalsiAI untuk update terbaru

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- **CoinGecko** untuk cryptocurrency data API
- **Khalsi Community** untuk feedback dan testing
- **Anime Art Community** untuk karakter design inspiration

---

**Dibuat dengan ❤️ untuk komunitas trader Solana**

*Khalsi AI - Your trusted partner in Solana market analysis*