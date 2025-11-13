# Blueprint Laporan: Struktur Data & Mockup Fitur Market Probability (Solana)

## 1. Pendahuluan & Ringkasan Eksekutif

Dokumen ini menyusun rencana teknis naratif untuk merancang dan mengimplementasikan fitur Market Probability pada ekosistem Solana, dengan fokus pada prediksi harga SOL, tampilan token trending (misalnya BONK, WIF, SAMO), format respons API, sample data untuk dashboard, serta struktur data untuk fitur “Coming Soon” (Interactive AI Mode dan Explore Insights). Tujuan utamanya adalah menyatukan prinsip desain data, kontrak antarmuka, contoh payload JSON, serta pedoman kualitas data, sehingga fitur-fitur dapat dikembangkan secara paralel tanpa menyelesaikan terlebih dahulu seluruhdependensi bisnis. Hasil entregas utama mencakup dokumen docs/market_data_structure.md yang memuat definisi skema, contoh payload (mock), kontrak API, dan pedoman implementasi lintas kolom data.

Fitur Market Probability dirancang untuk memberikan probabilistik prediksi dan sinyal yang mudah ditafsirkan, sehingga pengguna mendapat konteks perubahan harga berdasarkan horizon waktu yang relevan. Pada tahap awal, deliverable inti meliputi: rancangan struktur data prediksi SOL, mockup token trending, format respons API yang konsisten, sample data untuk ringkasan pasar, dan struktur data “Coming Soon”. Pendekatan implementasi dilakukan secara modular, menjaga kompatibilitas mundur melalui versioning dan namespace yang jelas, sembari menandai area yang membutuhkan penetapan kebijakan lebih lanjut (misalnya sumber data, metodologi, SLO).

## 2. Prinsip Desain & Standar Data

Untuk memastikan konsistensi dan interoperabilitas, seluruh struktur data mengikuti beberapa prinsip kunci. Pertama, konsistensi skema: nama field menggunakan snake_case, tipe data menggunakan ISO 8601 untuk waktu, decimals selalu dinyatakan sebagai angka integer non-negatif, dan harga dalam unit token (misalnya USDC) dengan presisi desimal sesuai decimals. Kedua, formato waktu: semua timestamp diformat ISO 8601 dengan timezone Z (UTC), misalnya “created_at”: “2025-11-13T18:10:12Z”. Ketiga, normalisasi: symbol selalu uppercase dan berada dalam satu casing konvensi, kategori token mengikuti klasifikasi internal, dan source diasosiasikan untuk menjaga traceability.

Keempat, kualitas data: setiap objek harus memuat metrik “confidence” dan “sample_size” pada tingkat yang relevan, bersama “last_updated” dan “data_source”. Kelima, kompatibilitas mundur: gunakan version (“v1”, “v1.1”, “v2”) pada namespace endpoint, evite removing/renaming field tanpa menambah alternatif baru; jika terjadi perubahan skema, sediakan masa transisi dengan perilaku “legacy support” dan catatan perubahan. Terakhir, i18n dan desimal: pensinyalan angka mengikuti locale en-US dengan standar titik desimal, menghindari penggunaan koma; decimals disimpan pada level token dan konversi lintas presisi dilakukan secara eksplisit.

Untuk memudahkan rujukan tim, Tabel 1 merangkum konvensi penamaan dan tipe data secara ringkas.

### Tabel 1 — Konvensi Penamaan & Tipe Data
| Field               | Deskripsi                                                                              | Tipe       | Contoh                                              | Wajib |
|---------------------|----------------------------------------------------------------------------------------|------------|-----------------------------------------------------|-------|
| symbol              | Simbol aset (token atau pair)                                                          | string     | "SOL/USDC"                                          | Ya    |
| base                | Aset dasar (untuk pair)                                                                | string     | "SOL"                                               | Ya    |
| quote               | Aset kuotasi (untuk pair)                                                              | string     | "USDC"                                              | Ya    |
| decimals            | Jumlah digit desimal aset                                                              | integer    | 9                                                   | Ya    |
| price               | Harga terakhir (unit quote)                                                            | number     | 185.43                                              | Ya    |
| price_change_24h    | Perubahan harga 24 jam                                                                 | number     | 2.15                                                | Ya    |
| volume_24h          | Volume perdagangan 24 jam                                                              | number     | 123456789.50                                        | Ya    |
| liquidity           | Likuiditas pasar (USD atau unit quote)                                                 | number     | 45000000                                            | Tidak |
| market_cap          | Kapitalisasi pasar (USD)                                                               | number     | 89000000000                                         | Tidak |
| probability         | Peluang (0–1)                                                                          | number     | 0.62                                                | Ya    |
| predicted_range     |rentang harga yang diprediksi                                                          | object     | {"min":180.1,"max":190.2}                           | Tidak |
| trend_direction     | Arah tren yang diharapkan                                                              | string     | "bullish"                                           | Ya    |
| confidence          | Tingkat kepercayaan (0–1)                                                              | number     | 0.78                                                | Ya    |
| sample_size         | Ukuran sampel yang digunakan                                                           | integer    | 1200                                                | Ya    |
| horizon_minutes     | Horizon waktu prediksi (menit)                                                         | integer    | 60                                                  | Ya    |
| timestamp           | Waktu kunci (event/hasil), ISO 8601 Z                                                  | string     | "2025-11-13T18:10:12Z"                              | Ya    |
| created_at          | Waktu dibuat                                                                           | string     | "2025-11-13T18:10:12Z"                              | Ya    |
| updated_at          | Waktu diperbarui                                                                       | string     | "2025-11-13T18:10:12Z"                              | Ya    |
| source              | Sumber data (mock/internal/external)                                                   | string     | "mock"                                              | Ya    |
| tags                | Label/kategori fitur                                                                    | array      | ["momentum","sentiment"]                            | Tidak |
| notes               | Catatan tambahan (untuk interpretasi)                                                  | string     | "High volatility regime"                            | Tidak |
| locale              | Locale format angka                                                                     | string     | "en-US"                                             | Ya    |
| rounding            | Strategi pembulatan (mis. banker's rounding)                                           | string     | "half_up"                                           | Tidak |
| precision_strategy  | Strategi presisi (mis.floor/ceil untuk nilai ekstrem)                                  | string     | "floor"                                             | Tidak |

Konsistensi pada Tabel 1 meminimalkan kesalahan integrasi dan mempercepat konsumsi API oleh beragam klien.

## 3. Struktur Data Prediksi Harga SOL

Prediksi harga SOL dimodelkan sebagai entitas lintas horizon waktu yang memuat probabilitas arah dan rentang harga, lengkap dengan parameter dan kualitas data. Pada level token SOL, skema menyatukan identitas aset, detail pasar, probabilistik, dan audit trail perubahan.

### 3.1 Model Data Inti

Entitas inti memuat field yang wajib dan opsional, dengan tipe dan contoh yang seragam.

#### Tabel 2 — Skema Prediksi SOL
| Field                    | Tipe     | Deskripsi                                                       | Contoh                                        | Wajib |
|--------------------------|----------|-----------------------------------------------------------------|-----------------------------------------------|-------|
| asset_id                 | string   | Pengenal aset                                                   | "solana:sol"                                  | Ya    |
| symbol                   | string   | Simbol pair                                                     | "SOL/USDC"                                    | Ya    |
| base                     | string   | Aset dasar                                                      | "SOL"                                         | Ya    |
| quote                    | string   | Aset kuotasi                                                   | "USDC"                                        | Ya    |
| decimals                 | integer  | Digit desimal (USDC: 6, SOL: 9)                                 | 9                                             | Ya    |
| current_price            | number   | Harga terakhir                                                  | 185.43                                        | Ya    |
| price_change_24h         | number   | Perubahan harga 24 jam                                          | 2.15                                          | Ya    |
| volume_24h               | number   | Volume 24 jam                                                   | 123456789.50                                  | Ya    |
| market_cap               | number   | Kapitalisasi pasar (USD)                                        | 89000000000                                   | Tidak |
| liquidity                | number   | Likuiditas pasar                                                | 45000000                                      | Tidak |
| predictions              | array    | Daftar prediksi per horizon                                     | Lihat 3.2                                     | Ya    |
| computed_at              | string   | Waktu komputasi prediksi                                        | "2025-11-13T18:10:12Z"                        | Ya    |
| source                   | string   | Sumber data (mock/internal/external)                            | "mock"                                        | Ya    |
| version                  | string   | Versi skema                                                     | "v1"                                          | Ya    |
| last_updated             | string   | Waktu pembaruan terakhir                                        | "2025-11-13T18:10:12Z"                        | Ya    |

### 3.2 Horizon Prediksi & Probabilitas

Di dalam predictions, setiap objek menyajikan horizon waktu (misalnya 15, 60, 240 menit), probabilitas arah (naik/turun), serta rentang harga yang diprediksi. Horison disimpan sebagai durasi dalam menit agar mudah diurutkan dan dikomparasi.

#### Tabel 3 — Predictions[] Field
| Field               | Tipe     | Deskripsi                                                     | Contoh                               |
|---------------------|----------|---------------------------------------------------------------|--------------------------------------|
| horizon_minutes     | integer  | Horizon prediksi (menit)                                      | 60                                   |
| probability_up      | number   | Probabilitas harga naik (0–1)                                 | 0.62                                 |
| probability_down    | number   | Probabilitas harga turun (0–1)                                | 0.38                                 |
| predicted_price     | number   | Harga yang diprediksi                                         | 187.10                               |
| predicted_range     | object   | Rentang harga prediksi                                        | {"min":180.1,"max":190.2}            |
| trend_direction     | string   | Arah tren yang diharapkan                                     | "bullish"                            |
| confidence          | number   | Kepercayaan pada prediksi ini (0–1)                           | 0.78                                 |
| sample_size         | integer  | Ukuran sampel fitur yang digunakan                            | 1200                                 |
| signals             | array    | Sinyal pendukung (label)                                      | ["momentum","sentiment"]             |

#### Tabel 4 — Horizon Sample (15, 60, 240 menit)
| horizon_minutes | probability_up | probability_down | predicted_price | predicted_range      | trend_direction | confidence | sample_size |
|-----------------|----------------|------------------|-----------------|----------------------|-----------------|------------|-------------|
| 15              | 0.51           | 0.49             | 186.05          | {"min":184.8,"max":187.3} | "sideways"      | 0.65       | 900         |
| 60              | 0.62           | 0.38             | 187.10          | {"min":180.1,"max":190.2} | "bullish"       | 0.78       | 1200        |
| 240             | 0.58           | 0.42             | 188.90          | {"min":182.0,"max":195.0} | "bullish"       | 0.72       | 1500        |

Penafsiran Tabel 4 menegaskan bahwa kepercayaan (confidence) dan ukuran sampel (sample_size) meningkat seiring horizon yang lebih panjang, namun bukan jaminan kenaikan probabilitas. Hal ini membantu pengguna memahami bahwa prediksi lebih panjang memiliki rentang yang lebih lebar serta sinyal tambahan yang perlu dipertimbangkan.

### 3.3 Format Response JSON (Prediksi SOL)

Konsumen API memerlukan kontrak payload yang eksplisit. Format di bawah ini memadukan identitas aset, ringkasan pasar, dan daftar prediksi per horizon, dengan contoh yang mengikuti ISO 8601 UTC.

Contoh payload respons prediksi SOL:

```json
{
  "asset_id": "solana:sol",
  "symbol": "SOL/USDC",
  "base": "SOL",
  "quote": "USDC",
  "decimals": 9,
  "market": {
    "current_price": 185.43,
    "price_change_24h": 2.15,
    "volume_24h": 123456789.50,
    "market_cap": 89000000000,
    "liquidity": 45000000,
    "last_trade_at": "2025-11-13T18:10:12Z"
  },
  "predictions": [
    {
      "horizon_minutes": 15,
      "probability_up": 0.51,
      "probability_down": 0.49,
      "predicted_price": 186.05,
      "predicted_range": {"min": 184.8, "max": 187.3},
      "trend_direction": "sideways",
      "confidence": 0.65,
      "sample_size": 900,
      "signals": ["momentum", "sentiment"]
    },
    {
      "horizon_minutes": 60,
      "probability_up": 0.62,
      "probability_down": 0.38,
      "predicted_price": 187.10,
      "predicted_range": {"min": 180.1, "max": 190.2},
      "trend_direction": "bullish",
      "confidence": 0.78,
      "sample_size": 1200,
      "signals": ["momentum", "sentiment"]
    },
    {
      "horizon_minutes": 240,
      "probability_up": 0.58,
      "probability_down": 0.42,
      "predicted_price": 188.90,
      "predicted_range": {"min": 182.0, "max": 195.0},
      "trend_direction": "bullish",
      "confidence": 0.72,
      "sample_size": 1500,
      "signals": ["momentum", "sentiment"]
    }
  ],
  "computed_at": "2025-11-13T18:10:12Z",
  "source": "mock",
  "version": "v1",
  "last_updated": "2025-11-13T18:10:12Z"
}
```

Konsistensi field pada kontrak respons memudahkan penerapan filter, sorting, dan transformasi di sisi klien tanpa perubahan skema berarti.

## 4. Mockup Trending Tokens Solana (BONK, WIF, SAMO, dll.)

Untuk menampilkan “trending”, struktur data perlu memuat metrik utama serta sinyal yang mendorong token muncul pada daftar teratas.яді Основні поля включають symbol, kategori, metrik pasar, probabilitas naik/turun per horizon, arah tren, kepercayaan, dan sampel. Такий підхід забезпечує узгоджений рендеринг карток у клієнтах.

#### Tabel 5 — Skema Token Trending
| Field               | Tipe     | Deskripsi                                           | Contoh           |
|---------------------|----------|-----------------------------------------------------|------------------|
| symbol              | string   | Simbol token                                        | "BONK"           |
| name                | string   | Nama token                                          | "Bonk"           |
| category            | string   | Kategori (meme, degen, infra, stable)              | "meme"           |
| price               | number   | Harga terakhir                                      | 0.00003210       |
| price_change_24h    | number   | Perubahan harga 24 jam                              | 5.35             |
| volume_24h          | number   | Volume 24 jam                                       | 98765432.10      |
| liquidity           | number   | Likuiditas pasar                                    | 12000000         |
| market_cap          | number   | Kapitalisasi pasar                                  | 2100000000       |
| probability         | number   | Probabilitas (naik pada horizon utama)              | 0.61             |
| trend_direction     | string   | Arah tren                                           | "bullish"        |
| confidence          | number   | Kepercayaan                                         | 0.72             |
| sample_size         | integer  | Ukuran sampel                                       | 1100             |
| tags                | array    | Label sinyal                                        | ["momentum"]     |
| last_updated        | string   | Waktu pembaruan                                     | "2025-11-13T18:10:12Z" |

Berikut contoh payload JSON untuk empat token trending:

```json
[
  {
    "symbol": "BONK",
    "name": "Bonk",
    "category": "meme",
    "price": 0.00003210,
    "price_change_24h": 5.35,
    "volume_24h": 98765432.10,
    "liquidity": 12000000,
    "market_cap": 2100000000,
    "probability": 0.61,
    "trend_direction": "bullish",
    "confidence": 0.72,
    "sample_size": 1100,
    "tags": ["momentum", "sentiment"],
    "last_updated": "2025-11-13T18:10:12Z"
  },
  {
    "symbol": "WIF",
    "name": "dogwifhat",
    "category": "meme",
    "price": 2.12,
    "price_change_24h": 3.80,
    "volume_24h": 75432109.00,
    "liquidity": 9500000,
    "market_cap": 2120000000,
    "probability": 0.57,
    "trend_direction": "sideways",
    "confidence": 0.69,
    "sample_size": 950,
    "tags": ["momentum"],
    "last_updated": "2025-11-13T18:10:12Z"
  },
  {
    "symbol": "SAMO",
    "name": "Samoyedcoin",
    "category": "meme",
    "price": 0.0185,
    "price_change_24h": -1.20,
    "volume_24h": 15678900.00,
    "liquidity": 4200000,
    "market_cap": 150000000,
    "probability": 0.48,
    "trend_direction": "bearish",
    "confidence": 0.61,
    "sample_size": 800,
    "tags": ["sentiment"],
    "last_updated": "2025-11-13T18:10:12Z"
  },
  {
    "symbol": "SOL",
    "name": "Solana",
    "category": "infra",
    "price": 185.43,
    "price_change_24h": 2.15,
    "volume_24h": 123456789.50,
    "liquidity": 45000000,
    "market_cap": 89000000000,
    "probability": 0.62,
    "trend_direction": "bullish",
    "confidence": 0.78,
    "sample_size": 1200,
    "tags": ["momentum", "sentiment"],
    "last_updated": "2025-11-13T18:10:12Z"
  }
]
```

#### Tabel 6 — Contoh Data Trending
| Symbol | Price       | Change% 24h | Volume       | Probability | Trend     | Confidence |
|--------|-------------|-------------|--------------|-------------|-----------|------------|
| BONK   | 0.00003210  | 5.35        | 98,765,432.10| 0.61        | bullish   | 0.72       |
| WIF    | 2.12        | 3.80        | 75,432,109.00| 0.57        | sideways  | 0.69       |
| SAMO   | 0.0185      | -1.20       | 15,678,900.00| 0.48        | bearish   | 0.61       |
| SOL    | 185.43      | 2.15        | 123,456,789.50| 0.62        | bullish   | 0.78       |

Tabel 6 menegaskan visualisasi relative strength: token dengan probabilitas tinggi dan kepercayaan besar cenderung menduduki posisi teratas pada daftar trending, sambil mempertimbangkan perubahan harga 24 jam dan volume sebagai proksi aktivitas pasar.

### 4.1 Kebijakan “Trending”

Найпростіший підхід для моделювання “trending” ialah menyusun scoring yang menggabungkan perubahan harga 24 jam, volume, probabilitas naik, dan kepercayaan.РАхуноК скору повинен бути прозорим і повторюваним, щоб користувачі могли зрозуміти, чому токен потрапляє до списку.

#### Tabel 7 — Skema Scoring Trending (eksperimental)
| Field                 | Deskripsi                                           | Tipe    | Rentang  | Catatan                              |
|-----------------------|-----------------------------------------------------|---------|----------|---------------------------------------|
| price_change_score    | Skor perubahan harga 24 jam                         | number  | 0–1      | Dinormalisasi dengan robust scaling   |
| volume_score          | Skor volume relatif terhadap peer set               | number  | 0–1      | Z-score atau percentile               |
| probability_score     | Skor probabilitas naik                              | number  | 0–1      | Langsung gunakan probability          |
| confidence_bonus      | Tambahan skor dari confidence                       | number  | 0–0.2    | Menghindari overfit                   |
| trending_score        | Skor akhir (bobot yang dapat disesuaikan)           | number  | 0–1      | Mis. 0.4*P + 0.3*V + 0.2*C + 0.1*CB   |

Pembobotan di atas adalah contoh; nilai optimal akan ditetapkan setelah所谓的 backtest dan validasi.

## 5. Format Response untuk Market Probability API

API memfasilitasi konsumsi data prediksi dan trending secara konsisten melalu beberapa endpoint kunci. Desain v1 fokus pada endpoint ringkasan pasar, daftar trending, dan detail prediksi SOL, dengan parameter umum untuk filtering, sorting, dan pagination.

#### Tabel 8 — Rangkuman Endpoint
| Path                       | Method | Deskripsi                                  | Params Utama                             | Respon Utama                     |
|----------------------------|--------|--------------------------------------------|------------------------------------------|----------------------------------|
| /v1/market/overview        | GET    | Ringkasan pasar SOL & agregasi             | limit, sort_by, order, window            | market_overview                   |
| /v1/market/trending        | GET    | Daftar token trending                       | limit, category, sort_by, order          | array token_trending             |
| /v1/market/sol/predictions | GET    | Detail prediksi SOL (horizon)               | horizon, include_ranges, version         | object prediksi SOL              |
| /v1/market/version         | GET    | Versi skema/API                             | —                                        | {version, released_at}           |

Kode status HTTP menggunakan 200 untuk sukses, 400 untuk parameter invalid, 404 untuk resource tidak ditemukan, dan 500 untuk error server.

#### Tabel 9 — Struktur Respons Umum
| Field       | Tipe    | Deskripsi                          | Contoh                       |
|-------------|---------|------------------------------------|------------------------------|
| status      | string  | Status响应                         | "ok"                         |
| code        | integer | Kode status HTTP                   | 200                          |
| request_id  | string  | ID permintaan untuk tracing        | "req-abc123"                 |
| data        | object  | Payload utama respons              | bergantung endpoint          |
| meta        | object  | Metadata tambahan (paging, total)  | {"total":100,"page":1}       |
| error       | object  | Error payload (saat gagal)         | {"message":"invalid param"}  |
| timestamp   | string  | Waktu respons                      | "2025-11-13T18:10:12Z"       |

### 5.1 Endpoint: /v1/market/overview

Endpoint ini menyediakan ringkasan pasar SOL, termasuk statistik, event signifikan, dan probabilitas per horizon.

#### Tabel 10 — Schema market_overview
| Field                     | Tipe     | Deskripsi                                              | Contoh                                    |
|---------------------------|----------|--------------------------------------------------------|-------------------------------------------|
| symbol                    | string   | Simbol pair                                            | "SOL/USDC"                                |
| price                     | number   | Harga terakhir                                         | 185.43                                    |
| price_change_24h          | number   | Perubahan harga 24 jam                                 | 2.15                                      |
| volume_24h                | number   | Volume 24 jam                                          | 123456789.50                              |
| market_cap                | number   | Kapitalisasi pasar                                     | 89000000000                               |
| liquidity                 | number   | Likuiditas                                             | 45000000                                  |
| events_24h                | integer  | Jumlah event/signifikansi 24 jam                       | 7                                         |
| key_levels                | object   | Level support/resistance                               | {"support":[180,175],"resistance":[190]}  |
| probabilities_by_horizon  | array    | Probabilitas naik per horizon                          | [{"horizon":60,"probability":0.62},...]    |
| updated_at                | string   | Waktu pembaruan                                        | "2025-11-13T18:10:12Z"                    |

### 5.2 Endpoint: /v1/market/trending

Menampilkan daftar token trending dengan filtering kategori dan sorting.

#### Tabel 11 — Schema token_trending[]
| Field               | Tipe     | Deskripsi                               | Contoh        |
|---------------------|----------|-----------------------------------------|---------------|
| symbol              | string   | Simbol token                            | "BONK"        |
| name                | string   | Nama token                              | "Bonk"        |
| category            | string   | Kategori                                | "meme"        |
| price               | number   | Harga terakhir                           | 0.00003210    |
| price_change_24h    | number   | Perubahan harga 24 jam                   | 5.35          |
| volume_24h          | number   | Volume 24 jam                            | 98765432.10   |
| probability         | number   | Probabilitas naik                        | 0.61          |
| trend_direction     | string   | Arah tren                                | "bullish"     |
| confidence          | number   | Kepercayaan                              | 0.72          |
| sample_size         | integer  | Ukuran sampel                            | 1100          |
| tags                | array    | Label sinyal                             | ["momentum"]  |
| last_updated        | string   | Waktu pembaruan                          | "2025-11-13T18:10:12Z" |

### 5.3 Endpoint: /v1/market/sol/predictions

Menampilkan detail prediksi SOL per horizon, dapat menyertakan rentang harga.

#### Tabel 12 — Schema predictions
| Field               | Tipe     | Deskripsi                                  | Contoh                               |
|---------------------|----------|--------------------------------------------|--------------------------------------|
| horizon_minutes     | integer  | Horizon prediksi                           | 60                                   |
| probability_up      | number   | Probabilitas naik                           | 0.62                                 |
| probability_down    | number   | Probabilitas turun                          | 0.38                                 |
| predicted_price     | number   | Harga diprediksi                            | 187.10                               |
| predicted_range     | object   | Rentang harga                               | {"min":180.1,"max":190.2}            |
| trend_direction     | string   | Arah tren                                   | "bullish"                            |
| confidence          | number   | Kepercayaan                                 | 0.78                                 |
| sample_size         | integer  | Ukuran sampel                               | 1200                                 |
| signals             | array    | Sinyal pendukung                            | ["momentum","sentiment"]             |

Contoh respons lengkap telah disajikan pada bagian 3.3.

## 6. Sample Data untuk Dashboard Market Overview

Dashboard memerlukan ringkasan SOL yang konsisten dan contoh trending yang mudah dirender pada kartu UI. Kami menempatkan SOL sebagai baseline karena utilitasnya sebagai asetgas dan referensi pair.

### 6.1 JSON market_overview (contoh)

```json
{
  "market_overview": {
    "symbol": "SOL/USDC",
    "price": 185.43,
    "price_change_24h": 2.15,
    "volume_24h": 123456789.50,
    "market_cap": 89000000000,
    "liquidity": 45000000,
    "events_24h": 7,
    "key_levels": {
      "support": [180, 175],
      "resistance": [190, 195]
    },
    "probabilities_by_horizon": [
      {"horizon": 15, "probability": 0.51},
      {"horizon": 60, "probability": 0.62},
      {"horizon": 240, "probability": 0.58}
    ],
    "updated_at": "2025-11-13T18:10:12Z"
  },
  "trending": [
    {
      "symbol": "BONK",
      "name": "Bonk",
      "category": "meme",
      "price": 0.00003210,
      "price_change_24h": 5.35,
      "volume_24h": 98765432.10,
      "liquidity": 12000000,
      "market_cap": 2100000000,
      "probability": 0.61,
      "trend_direction": "bullish",
      "confidence": 0.72,
      "sample_size": 1100,
      "tags": ["momentum", "sentiment"],
      "last_updated": "2025-11-13T18:10:12Z"
    },
    {
      "symbol": "WIF",
      "name": "dogwifhat",
      "category": "meme",
      "price": 2.12,
      "price_change_24h": 3.80,
      "volume_24h": 75432109.00,
      "liquidity": 9500000,
      "market_cap": 2120000000,
      "probability": 0.57,
      "trend_direction": "sideways",
      "confidence": 0.69,
      "sample_size": 950,
      "tags": ["momentum"],
      "last_updated": "2025-11-13T18:10:12Z"
    },
    {
      "symbol": "SAMO",
      "name": "Samoyedcoin",
      "category": "meme",
      "price": 0.0185,
      "price_change_24h": -1.20,
      "volume_24h": 15678900.00,
      "liquidity": 4200000,
      "market_cap": 150000000,
      "probability": 0.48,
      "trend_direction": "bearish",
      "confidence": 0.61,
      "sample_size": 800,
      "tags": ["sentiment"],
      "last_updated": "2025-11-13T18:10:12Z"
    },
    {
      "symbol": "SOL",
      "name": "Solana",
      "category": "infra",
      "price": 185.43,
      "price_change_24h": 2.15,
      "volume_24h": 123456789.50,
      "liquidity": 45000000,
      "market_cap": 89000000000,
      "probability": 0.62,
      "trend_direction": "bullish",
      "confidence": 0.78,
      "sample_size": 1200,
      "tags": ["momentum", "sentiment"],
      "last_updated": "2025-11-13T18:10:12Z"
    }
  ]
}
```

### 6.2 Tampilan Widget

Agar dashboard mudah diinterpretasi, gunakan pemetaan ringkas antara data dan komponen UI, serta teknik pengelompokan untuk menjaga konsistensi visual.

#### Tabel 13 — Pemetaan Data ke Widget
| Widget           | Field                                      | Tipe    | Transformasi                        | Catatan Tampilan                   |
|------------------|--------------------------------------------|---------|-------------------------------------|------------------------------------|
| Harga            | market_overview.price                      | number  | Format desimal en-US                | Ukuran besar, warna dinamis        |
| Perubahan 24h    | market_overview.price_change_24h           | number  | Persen dengan tanda                 | Hijau/merah tergantung tanda       |
| Volume 24h       | market_overview.volume_24h                 | number  | Format ribuan                       | Subtitle                           |
| Probabilitas     | probabilities_by_horizon[].probability     | number  | Persen 0–100                        | Badges per horizon                 |
| Trending Cards   | trending[].symbol, price, probability      | mixed   | Badge kategori dan skor tren        | Ikon kategori, skor confidence     |
| Level Kunci      | key_levels.support/resistance              | array   | Rentang harga                       | Garis bantu pada chart             |
| Event 24h        | events_24h                                 | integer | Jumlah event                        | Notifikasi ringkas                 |
| Sumber & Waktu   | updated_at, source                         | string  | Format waktu                        | Footer dengan version              |

Tabel 13 memastikan data teknis diubah menjadi antarmuka yang ramah pengguna, mengurangi beban kognitif dan memperjelas informasi penting.

## 7. Struktur Data untuk Fitur “Coming Soon”

Dua fitur yang akan hadir memerlukan struktur data yang fleksibel namun dapat di，肖策尔один раз. Interactive AI Mode berfokus pada percakapan pengguna dengan konteks pasar, sementara Explore Insights menyediakan analitik tematik dan aturan.

### 7.1 Interactive AI Mode (struktur data)

Mode ini memanfaatkan antarmuka obrolan dengan konteks pasar yang kaya, termasuk akses ke ringkasan pasar dan prediksi SOL. Struktur pesan dirancang untuk memuat peran, konten, dan lampiran data jika diperlukan.

#### Tabel 14 — Skema ChatMessage
| Field        | Tipe     | Deskripsi                              | Contoh                              |
|--------------|----------|----------------------------------------|-------------------------------------|
| message_id   | string   | ID pesan                               | "msg-001"                           |
| role         | string   | Peran (user/assistant/system)          | "user"                              |
| content      | string   | Isi pesan                              | "Apa probabilitas naik SOL 60 menit?"|
| attachments  | array    | Lampiran data (opsional)               | [{"type":"market_overview"}]        |
| context      | object   | Konteks pasar/insight saat pesan       | {"sol_price":185.43,"probability":0.62} |
| created_at   | string   | Waktu pembuatan                        | "2025-11-13T18:10:12Z"              |
| source       | string   | Sumber ("interactive_ai")              | "interactive_ai"                    |
| version      | string   | Versi skema                            | "v1"                                |

Contoh payload obrolan:

```json
{
  "chat": {
    "session_id": "sess-abc",
    "messages": [
      {
        "message_id": "msg-001",
        "role": "user",
        "content": "Apa probabilitas naik SOL dalam 60 menit?",
        "context": {
          "symbol": "SOL/USDC",
          "sol_price": 185.43,
          "probability_60m": 0.62
        },
        "created_at": "2025-11-13T18:10:12Z",
        "source": "interactive_ai",
        "version": "v1"
      },
      {
        "message_id": "msg-002",
        "role": "assistant",
        "content": "Berdasarkan data terbaru, probabilitas naik SOL dalam 60 menit adalah 62% dengan kepercayaan 0.78. Namun, rentang prediksi melebar ke 180.1–190.2, menandakan volatilitas moderat.",
        "attachments": [
          {"type": "predictions", "horizon_minutes": 60}
        ],
        "created_at": "2025-11-13T18:10:20Z",
        "source": "interactive_ai",
        "version": "v1"
      }
    ]
  }
}
```

### 7.2 Explore Insights (struktur data)

Fitur ini mensegmentasikan insiдhs berdasarkan tema seperti momentum, mean reversion, peristiwa, atau likuiditas, lengkap dengan deskripsi, aturan pemicu, dan metrics terkait. Dengan demikian, pengguna dapat menelusuri narasi pasar berdasarkan sinyal terkurasi.

#### Tabel 15 — Skema Insight
| Field             | Tipe     | Deskripsi                                | Contoh                                    |
|-------------------|----------|-------------------------------------------|-------------------------------------------|
| insight_id        | string   | ID insight                                | "ins-001"                                  |
| title             | string   | Judul insight                             | "Momentum terkuat dalam 60 menit"         |
| theme             | string   | Tema (momentum/mean_reversion/event/liquidity) | "momentum"                           |
| description       | string   | Deskripsi                                 | "Peningkatan probabilitas naik SOL..."    |
| trigger_rules     | object   | Aturan pemicu                             | {"min_confidence":0.7,"min_probability":0.6} |
| related_tokens    | array    | Token terkait                             | ["SOL","BONK"]                             |
| metrics_snapshot  | object   | Cuplikan metrics saat insight             | {"sol_price":185.43,"volume_24h":123456789.50} |
| created_at        | string   | Waktu pembuatan                           | "2025-11-13T18:10:12Z"                     |
| source            | string   | Sumber ("explore_insights")               | "explore_insights"                         |
| version           | string   | Versi skema                               | "v1"                                       |

Contoh payload:

```json
{
  "insights": [
    {
      "insight_id": "ins-001",
      "title": "Momentum Terkuat 60 Menit",
      "theme": "momentum",
      "description": "Probabilitas naik SOL pada horizon 60 menit mencapai 62% dengan confidence 0.78, seiring lonjakan volume 24 jam.",
      "trigger_rules": {
        "min_confidence": 0.7,
        "min_probability": 0.6
      },
      "related_tokens": ["SOL"],
      "metrics_snapshot": {
        "sol_price": 185.43,
        "volume_24h": 123456789.50,
        "probability_60m": 0.62
      },
      "created_at": "2025-11-13T18:10:12Z",
      "source": "explore_insights",
      "version": "v1"
    }
  ]
}
```

## 8. QA, Kualitas Data, dan Kebijakan Error

Konsistensi internal menjadi landasan: jumlah probabilitas up/down harus smeja-sama 1, horizon必须是 integer positif, dan confidence serta probability berada pada rentang 0–1. Audit trail harus terdokumentasi melalui field last_updated, source, dan computed_at. Untuk kualitas data, metrik sample_size нужно быть jelas pada setiap prediksi atau trending item.

Pengelolaan error dan empty states harus ramah pengguna: jika horizon tidak ditemukan, kembalikan meta dengan pesan “no_data_for_horizon”; jika parameter invalid, berikan pesan “invalid_parameter” dengan saran nilai; jika terjadi kesalahan server, sediakan error message generik dan request_id untuk tracing.

#### Tabel 16 — Kebijakan Validasi Data
| Field/Aturan                 | Cek                        | Pesan                                   | Tindakan Korektif                |
|------------------------------|----------------------------|-----------------------------------------|----------------------------------|
| probability_up + down == 1   | equality                   | "probabilities_must_sum_to_one"         | normalisasi probabilitas         |
| horizon_minutes > 0          | range                      | "horizon_must_be_positive"              | reject request                   |
| confidence 0–1               | range                      | "confidence_out_of_range"               | clamp atau reject                |
| decimals >= 0                | range                      | "invalid_decimals"                      | set default atau reject          |
| ISO 8601 Z timezone          | format                     | "invalid_timestamp_format"              | format ulang atau reject         |
| symbol uppercase             | format                     | "symbol_must_be_uppercase"              | transformasi casing              |
| source wajib                 | presence                   | "missing_source"                        | isi default atau reject          |
| version wajib                | presence                   | "missing_version"                       | isi default atau reject          |

## 9. Roadmap Implementasi & Deliverables

Implementasi akan diselesaikan secara bertahap, dengan fokus pada jaminan kualitas data, konsistensi kontrak API, dan kompatibilitas mundur. Deliverable akhir, termasuk semua struktur data dan contoh payload, akan ditetapkan dalam docs/market_data_structure.md. Quality gate mencakup validasi skema JSON, uji lintas klien, serta dokumentasi penggunaan.

#### Tabel 17 — Milestone & Status
| Task                                             | Target File                    | Status     | Owner | Due         |
|--------------------------------------------------|--------------------------------|------------|-------|-------------|
| Skema prediksi SOL & horizon                     | docs/market_data_structure.md  | Planned    | FE/BE | 2025-11-20  |
| Mockup trending tokens (BONK, WIF, SAMO, SOL)    | docs/market_data_structure.md  | Planned    | FE    | 2025-11-20  |
| Kontrak API respons (overview, trending, sol)    | docs/market_data_structure.md  | Planned    | BE    | 2025-11-22  |
| Sample dashboard overview & trending             | docs/market_data_structure.md  | Planned    | FE    | 2025-11-22  |
| Skema “Coming Soon” (AI Chat, Explore Insights)  | docs/market_data_structure.md  | Planned    | FE/BE | 2025-11-25  |
| Validasi & quality gate (schema, error, i18n)    | docs/market_data_structure.md  | Planned    | QA    | 2025-11-26  |
| Finalisasi dokumentasi & Review                  | docs/market_data_structure.md  | Planned    | PO    | 2025-11-28  |

## 10. Lampiran: Contoh Lengkap Payload & Glosarium

Untuk memudahkan konsumsi dan ujian, berikut rangkuman contoh payload yang digunakan di seluruh dokumen, diikuti glosarium istilah.

Contoh payload respons prediksi SOL (v1):

```json
{
  "asset_id": "solana:sol",
  "symbol": "SOL/USDC",
  "base": "SOL",
  "quote": "USDC",
  "decimals": 9,
  "market": {
    "current_price": 185.43,
    "price_change_24h": 2.15,
    "volume_24h": 123456789.50,
    "market_cap": 89000000000,
    "liquidity": 45000000,
    "last_trade_at": "2025-11-13T18:10:12Z"
  },
  "predictions": [
    {
      "horizon_minutes": 15,
      "probability_up": 0.51,
      "probability_down": 0.49,
      "predicted_price": 186.05,
      "predicted_range": {"min": 184.8, "max": 187.3},
      "trend_direction": "sideways",
      "confidence": 0.65,
      "sample_size": 900,
      "signals": ["momentum", "sentiment"]
    },
    {
      "horizon_minutes": 60,
      "probability_up": 0.62,
      "probability_down": 0.38,
      "predicted_price": 187.10,
      "predicted_range": {"min": 180.1, "max": 190.2},
      "trend_direction": "bullish",
      "confidence": 0.78,
      "sample_size": 1200,
      "signals": ["momentum", "sentiment"]
    },
    {
      "horizon_minutes": 240,
      "probability_up": 0.58,
      "probability_down": 0.42,
      "predicted_price": 188.90,
      "predicted_range": {"min": 182.0, "max": 195.0},
      "trend_direction": "bullish",
      "confidence": 0.72,
      "sample_size": 1500,
      "signals": ["momentum", "sentiment"]
    }
  ],
  "computed_at": "2025-11-13T18:10:12Z",
  "source": "mock",
  "version": "v1",
  "last_updated": "2025-11-13T18:10:12Z"
}
```

Contoh payload trending tokens (BONK, WIF, SAMO, SOL):

```json
[
  {
    "symbol": "BONK",
    "name": "Bonk",
    "category": "meme",
    "price": 0.00003210,
    "price_change_24h": 5.35,
    "volume_24h": 98765432.10,
    "liquidity": 12000000,
    "market_cap": 2100000000,
    "probability": 0.61,
    "trend_direction": "bullish",
    "confidence": 0.72,
    "sample_size": 1100,
    "tags": ["momentum", "sentiment"],
    "last_updated": "2025-11-13T18:10:12Z"
  },
  {
    "symbol": "WIF",
    "name": "dogwifhat",
    "category": "meme",
    "price": 2.12,
    "price_change_24h": 3.80,
    "volume_24h": 75432109.00,
    "liquidity": 9500000,
    "market_cap": 2120000000,
    "probability": 0.57,
    "trend_direction": "sideways",
    "confidence": 0.69,
    "sample_size": 950,
    "tags": ["momentum"],
    "last_updated": "2025-11-13T18:10:12Z"
  },
  {
    "symbol": "SAMO",
    "name": "Samoyedcoin",
    "category": "meme",
    "price": 0.0185,
    "price_change_24h": -1.20,
    "volume_24h": 15678900.00,
    "liquidity": 4200000,
    "market_cap": 150000000,
    "probability": 0.48,
    "trend_direction": "bearish",
    "confidence": 0.61,
    "sample_size": 800,
    "tags": ["sentiment"],
    "last_updated": "2025-11-13T18:10:12Z"
  },
  {
    "symbol": "SOL",
    "name": "Solana",
    "category": "infra",
    "price": 185.43,
    "price_change_24h": 2.15,
    "volume_24h": 123456789.50,
    "liquidity": 45000000,
    "market_cap": 89000000000,
    "probability": 0.62,
    "trend_direction": "bullish",
    "confidence": 0.78,
    "sample_size": 1200,
    "tags": ["momentum", "sentiment"],
    "last_updated": "2025-11-13T18:10:12Z"
  }
]
```

Contoh payload market overview:

```json
{
  "market_overview": {
    "symbol": "SOL/USDC",
    "price": 185.43,
    "price_change_24h": 2.15,
    "volume_24h": 123456789.50,
    "market_cap": 89000000000,
    "liquidity": 45000000,
    "events_24h": 7,
    "key_levels": {
      "support": [180, 175],
      "resistance": [190, 195]
    },
    "probabilities_by_horizon": [
      {"horizon": 15, "probability": 0.51},
      {"horizon": 60, "probability": 0.62},
      {"horizon": 240, "probability": 0.58}
    ],
    "updated_at": "2025-11-13T18:10:12Z"
  }
}
```

Contoh payload chat Interactive AI Mode:

```json
{
  "chat": {
    "session_id": "sess-abc",
    "messages": [
      {
        "message_id": "msg-001",
        "role": "user",
        "content": "Apa probabilitas naik SOL dalam 60 menit?",
        "context": {"sol_price": 185.43, "probability_60m": 0.62},
        "created_at": "2025-11-13T18:10:12Z",
        "source": "interactive_ai",
        "version": "v1"
      },
      {
        "message_id": "msg-002",
        "role": "assistant",
        "content": "Probabilitas naik SOL dalam 60 menit adalah 62% dengan kepercayaan 0.78.",
        "attachments": [{"type": "predictions", "horizon_minutes": 60}],
        "created_at": "2025-11-13T18:10:20Z",
        "source": "interactive_ai",
        "version": "v1"
      }
    ]
  }
}
```

Contoh payload Explore Insights:

```json
{
  "insights": [
    {
      "insight_id": "ins-001",
      "title": "Momentum Terkuat 60 Menit",
      "theme": "momentum",
      "description": "Probabilitas naik SOL pada horizon 60 menit mencapai 62% dengan confidence 0.78.",
      "trigger_rules": {"min_confidence": 0.7, "min_probability": 0.6},
      "related_tokens": ["SOL"],
      "metrics_snapshot": {
        "sol_price": 185.43,
        "volume_24h": 123456789.50,
        "probability_60m": 0.62
      },
      "created_at": "2025-11-13T18:10:12Z",
      "source": "explore_insights",
      "version": "v1"
    }
  ]
}
```

### 10.1 Glosarium Istilah

- Probability: Peluang kejadian (0–1), digunakan untuk arah harga naik/turun. Probabilitas dinormalisasi agar jumlah up+down=1.
- Confidence: Tingkat kepercayaan terhadap prediksi, merefleksikan kualitas sinyal dan sampel. Não jaminan akurasi absolut.
- Horizon: Jangka waktu prediksi, dinyatakan dalam menit (misal 15, 60, 240).
- Sample Size: Jumlah pengamatan/fitur yang mendasari komputasi probabilitas; semakin besar, semakin stabil estimasi.
- Liquidity: Kedalaman pasar, menggambarkan kemudahan transaksi tanpa dampak harga signifikan.
- Trending Score: Skor gabungan (eksperimental) yang memengaruhi kemunculan token pada daftar trending, terdiri dari komponen perubahan harga, volume, probabilitas, dan bonus kepercayaan.

---

## Catatan Regarding Information Gaps

- Sumber data historis dan real-time belum ditetapkan; nilai dalam dokumen merupakan contoh (mock).
- Metodologi spesifik untuk menghasilkan probabilitas (model/algoritma) belum didefinisikan; rules di atas bersifat kerangka.
- Format unit price，默认 menggunakan unit quote pair (misalnya USDC) tanpa exchange tertentu.
- Kebijakan versioning API belum ditetapkan; gunakan v1 sebagai baseline, dengan roadmap masa depan.
- Kebutuhan non-fungsional (SLO/latency/cache) belum dicantumkan; diperlukan pada tahap integrasi.
- Pemetaan kategori token dan asset registry belum tersedia; gunakan kategori sederhana (meme, degen, infra, stable).
- Rancangan UI/UX tidak disediakan; struktur data telah diarahkan agar kompatibel dengan beragam layout.

Dengan struktur dan mockup di atas, tim Frontend, Backend, Data/ML, dan QA dapat bekerja паралельно, mengoptimalkan koordinasi antar-kolom, menjaga konsistensi data, serta mempercepat implementasi fitur Market Probability untuk ekosistem Solana.