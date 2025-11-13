# Blueprint Laporan: Riset Mendalam CoinGecko API untuk Data Solana (SOL)

## Ringkasan Eksekutif

Laporan ini merangkum hasil riset teknis tentang bagaimana mengambil dan mengolah data Solana (SOL) menggunakan CoinGecko API, dengan fokus pada harga real-time, data pasar, trending, struktur respons, batas laju (rate limits), contoh implementasi (REST dan WebSocket), serta metodologi inferensi “market probability” berbasis volume dan perubahan harga. Secara garis besar:

- Harga real-time SOL dapat diakses melalui kombinasi endpoint REST “market data” dan informasi harga-harian/metadata. Jika kebutuhan latensi sangat rendah, WebSocket (Beta) tersedia untuk streaming harga, perdagangan, dan OHLCV dengan SLA uptime 99% pada paket berbayar. CoinGecko menyebut cakupan multi-chain yang luas dengan data on-chain DEX lintas 200+ jaringan, relevan untuk seluruh ekosistem Solana.[^1][^3][^5]
- Trending tokens bisa diakses via /search/trending (beri API key untuk Pro). Namun, endpoint ini tidak menyediakan filter spesifik jaringan; penerapan “Solana-only” memerlukan pemetaan simbol/ID terhadap daftar token Solana, atau pendekatan alternatif dengan GeckoTerminal seperti “most recently updated tokens” untuk jaringan Solana.[^6][^14]
- Struktur respons berbeda antar endpoint: pasar (deretan fields utama seperti price/market cap/volume/ATH/ATL/dsb.), trending (objek coins/nfts/categories dengan field data rencana), DEX on-chain/pools/OHLCV (atribut khusus pool, relasi DEX, dan daftar OHLCV berlabel base/quote). Gunakan pemetaan yang konsisten sesuai kebutuhan fitur aplikasi.[^7][^6][^3]
- Rate limits: Public/Demo ±30 rpm (variatif), Public plan 5–15 rpm, Pro mengikuti paket (mis. Analyst dengan 250 rpm). Semua permintaan (termasuk error 4xx/5xx) dihitung terhadap limit per menit. Terapkan caching, exponential backoff, polling efisien, dan gunakan REST+WebSocket secara terpadu untuk latensi dan keandalan.[^8][^9][^10]
- WebSocket (Beta) relevan saat требования latensi sangat ketat; gunakan REST untuk batch/market overview, lalu WS untuk ticker/ohlcv real-time. Keduanya memerlukan autentikasi API key (Pro).[^1][^5]
- Inferensi “market probability” bukan metrik resmi: direkomendasikan indikator berbasis volume seperti On-Balance Volume (OBV), Relative Volume (RVOL), dan Volume Rate of Change (VROC), serta kerangka konfirmasi breakout + manajemen risiko. Metode berbasis backtest dapat digunakan untuk memetakan skor probabilitas empiris.[^16][^17][^18]

Rekomendasi implementasi cepat:
- Harga real-time SOL: ambil via coins_markets, tambah endpoint detail untuk metadata jika diperlukan. Jika latensi harus sangat rendah, gunakan WebSocket untuk feed langsung.
- Trending Solana-only: gunakan trending search + pemetaan ID ke ekosistem Solana, atau GeckoTerminal tokens-recent-updated dengan filter jaringan.
- Arsitektur: caching TTL 10–30 detik untuk REST, retry/backoff untuk 429/5xx, normalize data lintas endpoint, kombinasi REST (overview) dan WS (ticker/ohlcv). Sertakan autentikasi API key dan pemilihan root endpoint yang tepat (api.coingecko.com vs pro-api.coingecko.com).[^1][^7][^6][^8]



## Metodologi & Sumber Data

Riset ini berdasarkan penelusuran sumber resmi CoinGecko (dokumentasi API, halaman API dan pricing, changelog), referensi WebSocket (Beta), serta sumber sekunder yang kredibel untuk contoh implementasi dan praktik terbaik. Ekstraksi conteúdo dilakukan dari:
- Dokumentasi utama CoinGecko API: cakupan REST dan WebSocket, termasuk cakupan multi-chain dan data on-chain DEX.[^1]
- Halaman API Solanol: spesifikasi endpoint Solana, contoh respons dan metrik pasar serta DEX/NFT data.[^3]
- Halaman “Chains” untuk cakupan multi-chain: relevansi ekosistem Solana di jaringan CoinGecko.[^5]

Kriteria relevansi: semua referensi diprioritaskan dari domain CoinGecko; sumber sekunder digunakan untuk contoh implementasi Python dan praktik umum. Informasi dinormalisasi ke struktur terstandar (JSON) untuk memetakan fields lintas endpoint. Beberapa keterbatasan:
- Detail rate limit lintas paket Pro tidak lengkap di satu halaman; angka spesifik diketahui untuk Analyst (250 rpm) dan batas publik (5–15 rpm; ±30 rpm untuk Demo).[^10][^9]
- Dokumentasi Python resmi terhalang Cloudflare; referensi alternatif eksternal digunakan untuk contoh implementasi.[^20]
- Trending search tidak menyediakan filter jaringan; Solana-only memerlukan langkah tambahan (pemetaan ID/contract address ke ekosistem Solana).[^6]
- WebSocket (Beta) membutuhkan akses Pro; format payload dan contoh streaming tidak seluruhnya tersedia di sumber yang dapat diakses; rekomendasi penggunaan disimpulkan dari dokumentasi utama.[^1]



## Ikhtisar CoinGecko API & Cakupan Data Solana

CoinGecko menyediakan data pasar kripto melalui REST (JSON) dan WebSocket (Beta) untuk streaming harga, perdagangan, dan OHLCV dengan cakupan multi-chain, termasuk data DEX on-chain lintas 200+ jaringan. cakupan Solana meliputi token, pools/DEX pairs, OHLCV, dan NFT metadata/floor price, dengan 99% uptime SLA pada paket enterprise. Akses ke WebSocket dan metode pengiriman REST tertentu memerlukan paket berbayar (Analyst dan di atasnya).[^1][^3][^5]

Untuk mengkristalkan cakupan data relevan bagi Solana, Tabel 1 merangkum jenis data dan endpoint terkait.

Table 1. Ringkasan cakupan data Solana di CoinGecko

| Kategori data                | Deskripsi singkat                                                                 | Endpoint/Referensi       |
|-----------------------------|------------------------------------------------------------------------------------|--------------------------|
| Harga & market data         | Harga USD/EUR/dsb., market cap, volume, ATH/ATL, circulating supply                 | coins_markets; detail coin[^7][^19] |
| Metadata                    | Nama/simbol/ID, logo, deskripsi, tautan, kategori                                  | coin detail / metadata[^3][^19] |
| DEX on-chain (Solana)       | Pairs/pools, likuiditas, volume USD, alamat token, pool teratas                    | GeckoTerminal (Solana DEX data)[^3] |
| OHLCV on-chain              | Seri OHLCV untuk pair base/quote (Raydium/Orca/dsb.)                               | GeckoTerminal OHLCV[^3]  |
| Trending                    | Pencarian trending coins/NFTs/kategori (24 jam terakhir)                           | search/trending[^6]      |
| Tokens terbaru (Solana)     | 100 token dengan pembaruan terbaru per jaringan (GeckoTerminal)                    | tokens recently updated[^14] |
| WebSocket (Beta)            | Streaming harga, perdagangan, OHLCV latensi rendah                                 | WebSocket API[^1]        |
| Cakupan multi-chain         | 200+ jaringan dengan data on-chain, relevan bagi ekosistem Solana                  | Chains overview[^5]      |

Cakupan di atas menjadi fondasi untuk desain endpoint harga real-time, deteksi trending, serta analisis on-chain Solana.



## Endpoint Harga Real-time Solana (SOL)

Pendekatan utama untuk mengambil harga real-time SOL di CoinGecko adalah melalui endpoint pasar (coins_markets), optionally dilengkapi dengan endpoint detail harga/market chart untuk kebutuhan historis dan metadata. Pada paket berbayar, WebSocket (Beta) dapat menyediakan feed latensi rendah untuk harga, perdagangan, dan OHLCV.[^7][^3][^1][^5]

Table 2 merangkum pilihan endpoint harga real-time, metode, URL, parameter utama, dan contoh kegunaan.

Table 2. Endpoint harga real-time SOL: metode, URL, parameter, contoh

| Nama endpoint                 | Method | URL root (tanpa path)         | Path                         | Parameter wajib/utama                      | Kapan digunakan                              | Contoh respons (ringkas)                             | Sumber |
|------------------------------|--------|-------------------------------|------------------------------|--------------------------------------------|----------------------------------------------|------------------------------------------------------|--------|
| Coins Markets                | GET    | api.coingecko.com (Demo/Public); pro-api.coingecko.com (Pro) | /api/v3/coins/markets        | vs_currency; ids (opsional)                | Overview pasar/harvest batch harga            | lihat “Contoh JSON Response” (coins_markets)         | [^7]   |
| Simple Price / Price by ID   | GET    | api.coingecko.com / pro-api.coingecko.com | /api/v3/simple/... ; /api/v3/coins/{id} | vs_currency; ids; id (path)                | Harga cepat per ID/kurrency                   | lihat “Contoh JSON Response” (simple/coin detail)    | [^19]  |
| Market Chart by ID           | GET    | api.coingecko.com / pro-api.coingecko.com | /api/v3/coins/{id}/market_chart | id; vs_currency; days                      | Historis harga/volume untuk trend/indikator   | lihat “Contoh JSON Response” (market_chart)          | [^19]  |
| WebSocket (Beta)             | WS     | (Pro)                          | (topic stream)                | API key (auth); subscribe topic            | Streaming harga/ohlcv real-time               | lihat “Contoh JSON Response” (WS)                    | [^1]   |

Catatan penting:
- Root endpoint: gunakan api.coingecko.com untuk akses Demo/Public; pro-api.coingecko.com untuk Pro. Autentikasi header: x-cg-pro-api-key (Pro), x-cg-demo-api-key (Demo).[^11][^8]
- coins_markets mengembalikan deretan aset pasar; Anda bisa menspesifikasi ids=“solana” untuk memfokuskan pada SOL.[^7]
- WebSocket (Beta) membutuhkan akses Pro dan sesuai untuk feed real-time sangat cepat.[^1][^5]

### 3.1 REST: coins_markets

Endpoint ini cocok untuk mengambil harga SOL saat ini beserta metrik pasar inti dalam satu respon. Parameter umum:
- vs_currency: mata uang pembanding (mis. usd).
- ids: gunakan “solana” untuk mendapatkan entri SOL secara langsung.

Contoh fitur yang bisa dibangun: dashboard harga SOL, alert kenaikan/penurunan harga 24 jam, ranking pasar, dan penyajian ATH/ATL historis.[^7]

### 3.2 REST: simple/price atau coins/{id}

Endpoint “simple price” ideal untuk pengambilan harga cepat SOL dalam berbagai vs_currency. Alternatifnya, gunakan coins/{id} untuk mendapat detail harga dan metrik harian dalam satu objek, atau market_chart untuk historis harian dengan rentang hari yang fleksibel. Gunakan IDs/fields secukupnya untuk meminimalkan payload dan latensi.[^19]

### 3.3 WebSocket (Beta)

WebSocket menyediakan streaming harga, perdagangan, dan OHLCV latensi rendah untuk implementasi yang sangat bergantung pada update cepat (mis. terminal risiko real-time, market maker, atau UI watchlist). Gunakan REST untuk batch/market overview, lalu WS untuk ticker/ohlcv live. Pastikan autentikasi Pro aktif dan/topik langganan sesuai kebutuhan aplikasi.[^1]



## Endpoint Trending Tokens di Solana

Trending search memungkinkan Anda mengambil coin/NFT/kategori yang populer dalam 24 jam terakhir. Namun, endpoint ini tidak menyediakan filter jaringan; hasil trending bersifat global. Untuk mendapatkan “Solana-only”, gunakan pemetaan ID/contract address terhadap daftar token Solana atau pendekatan GeckoTerminal “most recently updated tokens” dengan filter jaringan.

### 4.1 Trending Search (Global)

- Endpoint: GET https://pro-api.coingecko.com/api/v3/search/trending (Pro). Header: x-cg-pro-api-key. 
- Parameter: show_max (opsional) untuk mengontrol jumlah maksimum hasil pada tipe tertentu (coins/nfts/categories); paket berbayar bisa mengangkat batas pengambilan (hingga 30 coins, 10 NFTs, 10 categories).
- Cache/frekuensi: pembaruan ±10 menit. Respons berisi coins, nfts, categories; objek item coins memiliki field data harga/market cap/volume, termasuk price_change_percentage_24h dalam beberapa mata uang. Trending tidak filter by network; lakukan pemetaan ke ekosistem Solana (ID/contract address).[^6][^13]

### 4.2 Alternatif: GeckoTerminal “Recently Updated Tokens” (Solana)

GeckoTerminal menyediakan endpoint untuk 100 token terbaru per jaringan. Gunakan untuk melacak token yang baru aktif di Solana. Setelah mendapatkan daftar, cocokkan dengan kategori/ranking di CoinGecko atau pada ekosistem Solana untuk menilai minat pasar (mis. volume dan harga terbaru).[^14][^15]



## Struktur Data yang Dikembalikan (JSON)

Struktur respons berbeda antar endpoint. Tabel 3 memetakan field umum untuk pasar, Tabel 4 memetakan trending, dan Tabel 5 memetakan DEX/pools serta OHLCV.

Table 3. Mapping field utama coins_markets dan interpretasinya

| Field                                | Tipe     | Deskripsi                                                     | Contoh (ilustratif)           |
|--------------------------------------|----------|---------------------------------------------------------------|-------------------------------|
| id                                   | string   | ID internal CoinGecko untuk aset                              | “solana”                      |
| symbol                               | string   | Simbol aset                                                   | “sol”                         |
| name                                 | string   | Nama aset                                                     | “Solana”                      |
| current_price                        | number   | Harga terakhir dalam vs_currency (mis. USD)                   | 171.68                        |
| market_cap                           | number   | Kapitalisasi pasar                                            | 89,310,810,865                |
| market_cap_rank                      | number   | Ranking market cap                                            | 6                             |
| total_volume                         | number   | Volume perdagangan 24 jam                                     | 4,893,607,193                 |
| high_24h / low_24h                   | number   | Highest/lowest price 24 jam                                   | 177.99 / 168.14               |
| price_change_24h / pct_24h           | number   | Perubahan harga (absolut/%) 24 jam                            | -5.33 / -3.01332              |
| fully_diluted_valuation (FDV)        | number   | Valuasi fully diluted                                         | 103,247,646,363               |
| circulating_supply / total_supply    | number   | Supply yang Beredar / Total Supply                            | 519,699,758 / 600,798,227     |
| ath / atl                            | number   | All-time high/low                                             | 293.31 / 0.500801             |
| ath_date / atl_date                  | string   | Timestamp ATH/ATL                                             | ISO 8601                      |
| last_updated                         | string   | Timestamp pembaruan terakhir                                  | ISO 8601                      |

Catatan: nama field di atas mengikuti format umum pada coins_markets dan “market data” yang dirujuk. Gunakan map/alias internal untuk konsistensi UI Anda.[^7][^3][^19]

Table 4. Mapping field trending search (coins items)

| Level/Field                         | Tipe   | Deskripsi                                          |
|------------------------------------|--------|----------------------------------------------------|
| item.id                            | string | ID CoinGecko untuk coin                            |
| item.coin_id                       | int    | ID numerik internal                                |
| item.name / symbol / slug          | string | Nama/simbol/slug                                   |
| item.market_cap_rank               | int    | Ranking market cap                                 |
| item.thumb / small / large         | URL    |URL gambar ikon coin (berbagai ukuran)             |
| item.price_btc                     | float  | Harga dalam BTC                                    |
| item.data.price                    | float  | Harga terkini (USD)                                |
| item.data.price_btc                | string | Harga BTC (string)                                 |
| item.data.price_change_percentage_24h.<currency> | float | Perubahan % 24 jam per currency (usd/btc/aed/dsb.) |
| item.data.market_cap / market_cap_btc | string | Market cap (formatted, BTC)                       |
| item.data.total_volume / total_volume_btc | string | Volume (formatted, BTC)                       |
| item.data.sparkline                | URL    | Sparkline image                                    |
| item.data.content.title/description| string | Info ringkas (bila tersedia)                       |

Cache/frekuensi: ±10 menit. Pemetaan ke jaringan Solana diperlukan untuk “Solana-only”.[^6]

Table 5. Mapping DEX pools/ohlcv (GeckoTerminal/Solana)

| Bagian            | Field/Atribut                                         | Deskripsi                                                      |
|-------------------|--------------------------------------------------------|----------------------------------------------------------------|
| Pool (attributes) | address, name, symbol, decimals, image_url             | Alamat token, nama, simbol, desimal, gambar                    |
| Pool (attributes) | coingecko_coin_id, total_supply                        | ID CoinGecko (bila ada), total supply                          |
| Pool (attributes) | price_usd, fdv_usd, total_reserve_in_usd               | Harga USD, FDV USD, total cadangan USD                         |
| Pool (attributes) | volume_usd.h24                                         | Volume USD 24 jam                                              |
| Relasi            | top_pools (data[])                                     | Daftar pool teratas                                            |
| OHLCV (attributes)| ohlcv_list                                             | [timestamp, open, high, low, close, volume]                    |
| Meta (base/quote) | address, name, symbol, coingecko_coin_id               | Base/quote token (mis. MOODENG/SOL/Wrapped SOL)                |

Gunakan atribut-atribut di atas untuk fitur seperti watchlist likuiditas, alerting lonjakan volume, serta analisis teknis berbasis OHLCV.[^3]



## Rate Limits & Best Practices

Batas laju (rate limit) dan autentikasi bervariasi antar rencana akses. Tabel 6 merangkum angka yang relevan dan perbedaan Pro vs Public/Demo.

Table 6. Rate limits per rencana

| Rencana          | Rate limit (indikatif)                    | Ketersediaan/ Catatan                                             | Sumber |
|------------------|-------------------------------------------|--------------------------------------------------------------------|--------|
| Public plan      | 5–15 calls per menit                      | Bergantung pada kondisi lalu lintas global                         | [^9]   |
| Demo (Public API)| ±30 calls per menit (variatif)            | Dapat berubah mengikuti ukuran traffic                             | [^8]   |
| Pro – Analyst    | 250 calls per menit                       | Akses Pro, infrastruktur khusus untuk stabilitas                   | [^10]  |
| Pro – lainnya    | Tergantung paket                          | Rujuk halaman pricing untuk credit/minute per paket                | [^10][^21] |

Catatan penting:
- Semua permintaan dihitung ke batas laju per menit, termasuk error 4xx/5xx. Hal ini berarti throttle/logika retry harus memperhitungkan seluruh spektrum status (bukan hanya 200).[^8]
- Gunakan autentikasi dan root endpoint yang tepat: 
  - Header x-cg-pro-api-key (Pro) atau x-cg-demo-api-key (Demo).
  - Root url: pro-api.coingecko.com untuk Pro; api.coingecko.com untuk Demo/Public.[^11][^8]

Best practices:
- Caching & TTL: tetapkan TTL 10–30 detik untuk REST harga real-time; untuk trending (±10 menit) TTL 10–15 menit.[^6][^8]
- Retry & exponential backoff: khusus untuk 408/429/5xx; jangan melakukan retry agresif saat 403/401—perbaiki autentikasi/otorisasi terlebih dahulu.[^8][^11]
- Minimize payload: gunakan parameter ids/vs_currency yang spesifik; hindari pengambilan fields tak perlu.
- Concurrency & pooling: kontrol jumlah koneksi simultan untuk menghindari thundering herd; prioritaskan batching melalui coins_markets bila memungkinkan.[^7][^8]
- Arsitektur hybrid: REST untuk batch/overview, WebSocket untuk ticker/ohlcv real-time bila kebutuhan latensi sangat ketat.[^1][^5]
- Akses & key management: simpan kunci API aman; rotasi berkala; catat usage per menit/harian untuk menjaga SLA.

Untuk troubleshooting, Tabel 7 memetakan kode status umum ke penyebab dan langkah penanganan.

Table 7. Kode status umum dan penanganannya

| Kode | Kemungkinan penyebab                                           | Tindakan yang disarankan                                 |
|------|-----------------------------------------------------------------|----------------------------------------------------------|
| 400  | Permintaan tidak valid (parameter/format salah)                 | Validasi parameter; periksa schema request               |
| 401  | Tidak terautentikasi                                           | Lengkapi header autentikasi yang benar                   |
| 403  | Dilarang (akses forbidden)                                      | Periksa hak akses/paket/langganan                        |
| 408  | Timeout koneksi/latensi tinggi                                  | Retry dengan backoff; perbaiki jaringan                  |
| 429  | Melebihi rate limit                                             | Turunkan QPS; caching; backoff; pertimbangkan upgrade    |
| 500  | Server error                                                    | Retry eksponensial; monitor pola                         |
| 503  | Layanan tidak tersedia                                          | Retry dengan jitter; failover bila perlu                 |
| 1020 | Access denied oleh firewall CDN                                 | Validasi konfigurasi akses/ACL                           |
| 10002| API key hilang                                                  | Sertakan x-cg-pro-api-key atau x-cg-demo-api-key         |
| 10010| API key tidak valid (Pro)                                       | Periksa kunci; pastikan root pro-api.coingecko.com       |
| 10011| API key tidak valid (Demo)                                      | Periksa kunci; pastikan root api.coingecko.com           |

Semua permintaan (apakah sukses atau error) tetap dihitung terhadap kuota per menit. Gunakan monitor untuk mencegah lonjakan 429 di production.[^8][^11]



## Contoh Response JSON untuk Implementasi

Untuk mempercepat integrasi, berikut contoh ringkas respons (ilustratif) yang mengikuti struktur endpoint. Ini bukan data langsung dari produksi, namun mencerminkan skema resmi yang dirujuk.

### 6.1 coins_markets (SOL)

Contoh respons (ringkas):

```json
[
  {
    "id": "solana",
    "symbol": "sol",
    "name": "Solana",
    "current_price": 171.68,
    "market_cap": 89310810865,
    "market_cap_rank": 6,
    "total_volume": 4893607193,
    "high_24h": 177.99,
    "low_24h": 168.14,
    "price_change_24h": -5.334046366127495,
    "price_change_percentage_24h": -3.01332,
    "market_cap_change_24h": -2680762982.68602,
    "market_cap_change_percentage_24h": -2.91414,
    "circulating_supply": 519699758.1456244,
    "total_supply": 600798227.2694036,
    "max_supply": null,
    "fully_diluted_valuation": 103247646363,
    "ath": 293.31,
    "ath_change_percentage": -41.37641,
    "ath_date": "2025-01-19T11:15:27.957Z",
    "atl": 0.500801,
    "atl_change_percentage": 34234.98062,
    "atl_date": "2020-05-11T19:35:23.449Z",
    "last_updated": "2025-05-15T16:33:35.670Z"
  }
]
```

Gunakan fields tersebut untuk dashboard harga, alert, dan perbandingan lintas aset.[^7][^3]

### 6.2 search/trending (Coins)

Contoh respons (ringkas):

```json
{
  "coins": [
    {
      "item": {
        "id": "solana",
        "coin_id": 4128,
        "name": "Solana",
        "symbol": "SOL",
        "market_cap_rank": 6,
        "thumb": "https://assets.coingecko.com/coins/images/4128/standard/solana.png",
        "small": "https://assets.coingecko.com/coins/images/4128/small/solana.png",
        "large": "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        "slug": "solana",
        "price_btc": 0.00083,
        "score": 0,
        "data": {
          "price": 171.68,
          "price_btc": "0.00083",
          "price_change_percentage_24h": { "usd": -3.0, "btc": -2.5 },
          "market_cap": "$89,310,810,865",
          "market_cap_btc": "118000",
          "total_volume": "$4,893,607,193",
          "total_volume_btc": "70500",
          "sparkline": "https://www.coingecko.com/coins/4128/sparkline.svg",
          "content": null
        }
      }
    }
  ],
  "nfts": [],
  "categories": []
}
```

Cache/frekuensi: ±10 menit. Trending tidak filter by network; lakukan pemetaan “Solana-only” menggunakan ID/contract address.[^6]

### 6.3 Solana DEX Pools & OHLCV (GeckoTerminal)

Contoh pools (ringkas):

```json
{
  "data": {
    "id": "solana_ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY",
    "type": "token",
    "attributes": {
      "address": "ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY",
      "name": "Moo Deng",
      "symbol": "MOODENG",
      "decimals": 6,
      "image_url": "https://coin-images.coingecko.com/coins/images/50264/large/MOODENG.jpg",
      "coingecko_coin_id": "moo-deng",
      "total_supply": "989940962969385.0",
      "price_usd": "0.2260493612",
      "fdv_usd": "223775522.276758",
      "total_reserve_in_usd": "5180212.306700410",
      "volume_usd": { "h24": "10235022.5216961" },
      "market_cap_usd": "225739398.037755"
    },
    "relationships": {
      "top_pools": {
        "data": [
          { "id": "solana_22WrmyTj8x2TRVQen3fxxi2r4Rn6JDHWoMTpsSmn8RUd", "type": "pool" }
        ]
      }
    }
  }
}
```

Contoh OHLCV (ringkas):

```json
{
  "data": {
    "id": "2903f148-61bb-4338-b8dd-0d4d76967f5c",
    "type": "ohlcv_request_response",
    "attributes": {
      "ohlcv_list": [
        [1747612800, 0.273671113609608, 0.2794043054353163, 0.23432190304052236, 0.23605446277942485, 3291680.8493624832]
      ]
    }
  },
  "meta": {
    "base": { "address": "...", "name": "Moo Deng", "symbol": "MOODENG", "coingecko_coin_id": "moo-deng" },
    "quote": { "address": "So11111111111111111111111111111111111111112", "name": "Wrapped SOL", "symbol": "SOL", "coingecko_coin_id": "wrapped-solana" }
  }
}
```

Gunakan atribut ini untuk watch likuiditas, deteksi lonjakan volume, dan charting teknikal pada pairs populer di Solana (Raydium/Orca, dsb.).[^3]



## Market Probability dari Volume & Price Change

“Market probability” bukan metrik resmi yang disediakan CoinGecko; namun, indikator berbasis volume memberi kerangka untuk mengestimasi probabilitas kondisional apakah pergerakan harga cenderung berlanjut atau berbalik. Pendekatan yang direkomendasikan:

- Relative Volume (RVOL): membandingkan volume terkini terhadap rata-rata periode tertentu. RVOL ≥ 1.5 sering kali dikaitkan dengan breakout yang lebih可信; ≥ 2.0 menunjukkan konvensi kuat. 
- Volume Rate of Change (VROC): mengukur laju perubahan volume. VROC yang tinggi menandai lonjakan aktivitas yang tidak biasa, sering mendahului aksi harga signifikan.
- On-Balance Volume (OBV): indikator kumulatif yang menambah volume saat harga close naik dan menguranginya saat harga close turun. Divergensi OBV (mis. harga mendatar sementara OBV naik) dapat mendahului breakout.[^16][^17]

Table 8. Indikator berbasis volume: definisi, interpretasi, ambang

| Indikator | Definisi ringkas                                                | Interpretasi probabilitas kondisional                           | Ambang praktis (indikatif)                 |
|----------|------------------------------------------------------------------|------------------------------------------------------------------|--------------------------------------------|
| RVOL     | Volume saat ini / volume rata-rata periode                       | RVOL tinggi伴随 breakout mengindikasikan partisipasi luas        | 1.5 (breakout可信), 2.0–3.0 (kuat)         |
| VROC     | Persentase perubahan volume terhadap periode lalu                 | VROC tinggi saat breakout meningkatkan peluang kelanjutan        | 50–100%+ di atas rata-rata                 |
| OBV      | Akumulasi volume kumulatif berdasar arah close                    | Divergensi OBV mengisyaratkan akumulasi/kelelahan tren           | Divergensi yang jelas vs harga             |

Konfirmasi operasional:
- Breakout dengan volume ≥50% di atas rata-rata 20 hari cenderung lebih berkelanjutan. Lonjakan volume saat突破 (≥150% dari rata-rata) memberikan konfirmasi awal; lanjutkan dengan volume ≥100% pada hari-hari berikutnya untuk memvalidasi momentum.[^16]
- Setelah突破, pullback dengan volume rendah sering kali menandakan retest yang berhasil; sebaliknya, pullback dengan peningkatan volume jual meningkatkan risiko kegagalan突破.[^16]

Metodologi backtesting:
- Bina serangkaian aturan berbasis RVOL/VROC/OBV (mis. “_entry_ jika harga menembus resistance dan RVOL ≥ 1.5 pada candle突破”), lalu evaluasi frekuensi keberhasilan (win rate) dan distribusi outcome pada data historis.
- Gunakan hasil backtest untuk memetakan “skor probabilitas” empiris per kondisi (mis. RVOL 1.5–2.0, VROC > 100%, tanpa divergensi negatif OBV), yang kemudian diterjemahkan ke ukuran posisi dan level stop/take-profit. Pastikan rolling window dan out-of-sample test untuk menghindari overfitting.[^18]

### 7.1 Konfirmasi Breakout dengan Volume

Threshold operasional yang berguna untuk konfirmasi:
- ≥150% dari rata-rata volume pada突破 awal,
- ≥100% dari rata-rata pada hari-hari melanjutkan,
- RVOL ≥ 2.0 memperkuat keyakinan. Jika pullback berikutnya menunjukkan volume rendah, itu adalah konfirmasi tambahan bahwa突破 tersebut “BERSIH” (tidak immediately rejected).[^16]

### 7.2 Strategi Probabilitas Berbasis Volume

Kombinasikan RVOL, VROC, dan OBV dalam aturan keputusan. Contoh:
- Jika harga menembus resistance, RVOL ≥ 2.0, VROC ≥ 100%, dan OBV tidak menunjukkan divergensi negatif, masuk longs dengan ukuran posisi lebih besar; place stop-loss di bawah level support terdekat; take-profit di zona nilai/area harga dengan konsentrasi volume tinggi.
- Jika ada divergensi OBV (harga naik, OBV menurun) atau volume gagal mencapai ambang, kecilkan ukuran posisi atau tunda eksekusi hingga konfirmasi tambahan muncul. 
- Backtest aturan di atas untuk menilai distribusi hasil (mis. expectancy dan win rate), kemudian petakan “market probability” empiris untuk setiap kombinasi kondisi.[^16][^18]



## Studi Kasus: Implementasi End-to-End untuk SOL

Skenario implementasi berikut menunjukkan alur integrasi yang praktis dan andal.

Tabel 9. Parameter utama per endpoint yang digunakan

| Use case                          | Endpoint (REST/WS)                       | Parameter utama                                 | Output kunci                         |
|-----------------------------------|------------------------------------------|--------------------------------------------------|--------------------------------------|
| Harga SOL real-time (dashboard)   | /coins/markets (REST)                    | vs_currency=usd; ids=solana                     | current_price, pct_24h, volume       |
| Historis & indikator teknis       | /coins/{id}/market_chart (REST)          | id=solana; vs_currency=usd; days                | prices[[t,p]], volumes[[t,v]]        |
| Metadata & tautan                 | /coins/{id} (REST)                       | id=solana                                       | name, symbol, links, categories      |
| Trending Solana-only              | /search/trending (REST)                  | header API key; show_max                        | coins items; perlu pemetaan Solana   |
| Token Solana terbaru              | GeckoTerminal recently updated (REST)    | network=solana (opsional)                       | 100 token terbaru per jaringan       |
| Ticker/ohlcv latensi rendah       | WebSocket (Beta)                         | API key; subscribe ticker/ohlcv                 | stream harga/ohlcv                   |

Catatan:
- Pilih root endpoint sesuai rencana (Demo vs Pro) dan gunakan header autentikasi yang benar.[^7][^6][^1][^11]
- GeckoTerminal recently updated memberi sinyal “freshness”token di jaringan Solana, berguna untuk deteksi dini peluang baru.[^14]

### 8.1 Python: Implementasi Sederhana

Contoh pengambilan harga SOL dengan library eksternal (pycoingecko) dan library standard requests:

```python
# 1) pip install pycoingecko
from pycoingecko import CoinGeckoAPI

cg = CoinGeckoAPI()

# Harga SOL saat ini dalam USD
sol_price = cg.get_price(ids='solana', vs_currencies='usd')
print("SOL USD:", sol_price['solana']['usd'])

# Data pasar beberapa koin teratas
top_markets = cg.get_coins_markets(vs_currency='usd', per_page=5, page=1)
for c in top_markets:
    print(c['name'], c['symbol'].upper(), c['current_price'], c['market_cap'])

# Historis harga 30 hari terakhir
hist = cg.get_coin_market_chart_by_id(id='solana', vs_currency='usd', days=30)
for t, p in hist['prices'][:5]:
    print("ts", t, "price", p)
```

Alternatif manual (requests) untuk endpoint markets:

```python
import requests

url = "https://api.coingecko.com/api/v3/coins/markets"
params = {"vs_currency": "usd", "ids": "solana", "order": "market_cap_desc", "per_page": 1, "page": 1}
r = requests.get(url, params=params, timeout=10)
r.raise_for_status()
print(r.json()[0]['current_price'])
```

Ini adalah pola implementasi yang direkomendasikan untuk memulai integrasi sebelum migrasi ke infrastruktur Pro/WebSocket.[^20]

### 8.2 Node.js/Fetch: Implementasi Sederhana

Contoh fetch harga SOL dan trending:

```javascript
const fetch = require("node-fetch");

const base = "https://api.coingecko.com/api/v3";

// Harga SOL
async function getSolPrice() {
  const url = `${base}/coins/markets?vs_currency=usd&ids=solana&order=market_cap_desc&per_page=1&page=1`;
  const res = await fetch(url, { timeout: 10000 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log("SOL price:", data[0].current_price, "USD");
}

// Trending (Pro)
async function getTrending(proApiKey) {
  const url = `${base}/search/trending`;
  const res = await fetch(url, {
    headers: { "x-cg-pro-api-key": proApiKey },
    timeout: 10000
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log("Trending coins:", data.coins.map(c => c.item.id));
}

(async () => {
  await getSolPrice();
  // await getTrending(process.env.CG_PRO_API_KEY);
})();
```

Untuk kebutuhan latensi sangat rendah, ganti pengambilan batch dengan langganan WebSocket (Beta) di klien Node.js.[^1]



## Rekomendasi & Roadmap Implementasi

- Rencana implementasi bertingkat:
  - MVP: gunakan coins_markets (REST) dengan caching 10–30 detik; ambil data 24 jam (price_change_percentage_24h) untuk alert/trend; simpan minimal respons (price, volume, pct_24h).
  - Profesional: tambah WebSocket (Beta) untuk ticker/ohlcv real-time; gabungkan REST untuk pembaruan metadata dan historis; implementasikan retry/backoff dan health check WS.
  - Enterprise: perluas ke DEX on-chain dan OHLCV GeckoTerminal untuk watch likuiditas dan risiko slippage; integrasikan pipeline analitik volume (RVOL, VROC, OBV) dan backtesting.
- Optimasi performance:
  - Rate limit guard: throttle client QPS ≤ 60% dari limit rencana.
  - Batch & pagination: gunakan coins_markets untuk batch; paginasi saat per_page > 250.
  - Caching berlapis: in-memory cache untuk hot fields; CDN untuk aset statis.
- Keamanan & governance:
  - Key management: rotasi kunci, secrets vault, audit akses; gunakan root endpoint Pro untuk request berbayar.
  - Monitoring: integrasikan metrik error (429/5xx), latency p95/p99, dan consumption per menit/hari.
- Scaling & SLA:
  - Pro paid plan untuk mendapatkan Infrastruktur dedicated; pilih paket dengan credit/minute yang memadai (cek pricing).
  - Eval WebSocket pada use case yang membutuhkan latensi sub-detik; pastikan pengukuran fallback jika WS terputus.[^10][^5]



## Lampiran

### A. Kode status & pesan umum (ringkas)

| Kode | Deskripsi ringkas                                 |
|------|----------------------------------------------------|
| 400  | Bad Request                                        |
| 401  | Unauthorized                                       |
| 403  | Forbidden                                          |
| 408  | Timeout                                            |
| 429  | Too Many Requests (rate limit)                     |
| 500  | Internal Server Error                              |
| 503  | Service Unavailable                                |
| 1020 | Access Denied (CDN firewall)                       |
| 10002| Missing API Key                                    |
| 10010| Invalid API Key (Pro)                              |
| 10011| Invalid API Key (Demo)                             |

Semua permintaan dihitung terhadap kuota per menit; hindari retry agresif, manfaatkan caching dan batch.[^8]

### B. Currency terkelola (contoh)

CoinGecko mendukung banyak vs_currency; gunakan vs_currency yang konsisten untuk perbandingan lintas aset, mis. “usd”, “eur”, “gbp”, “aud”, “cad”.[^19]



## Penutup

Dengan fondasi endpoint yang tepat (coins_markets/simple/coins market chart) dan tambahan WebSocket (Beta) untuk kebutuhan latensi, tim engineer dapat menyajikan harga SOL real-time dan pasar Solana secara reliabel. Untuk trending, gunakan search/trending plus pemetaan ke ekosistem Solana atau GeckoTerminal recently updated untuk coverage “new listings”. Struktur data yang konsisten lintas endpoint memudahkan normalisasi fitur (mis. OHLCV on-chain untuk teknis, DEX pools untuk watch likuiditas). Pada sisi analitik, indikator berbasis volume (RVOL, VROC, OBV) memberi kerangka operasional untuk inferensi “market probability” yang dapat ditingkatkan melalui backtest. Tetap utamakan praktik batas laju, autentikasi root endpoint yang benar, caching, dan monitoring untuk menjaga stabilitas dan SLA di production.



## Referensi

[^1]: CoinGecko API: Introduction. https://docs.coingecko.com/
[^3]: Solana Data API: Price & Metadata for Tokens, NFTs & DEXs. https://www.coingecko.com/en/api/solana
[^4]: Multi-chain Crypto Data API - Chains. https://www.coingecko.com/en/api/chains
[^5]: Crypto API Pricing Plans - CoinGecko. https://www.coingecko.com/en/api/pricing
[^6]: Trending Search List - CoinGecko API. https://docs.coingecko.com/reference/trending-search
[^7]: Coins List with Market Data - CoinGecko API. https://docs.coingecko.com/reference/coins-markets
[^8]: Common Errors & Rate Limit - CoinGecko API. https://docs.coingecko.com/docs/common-errors-rate-limit
[^9]: What is the rate limit for CoinGecko API (public plan)? https://support.coingecko.com/hc/en-us/articles/4538771776153-What-is-the-rate-limit-for-CoinGecko-API-public-plan
[^10]: CoinGecko Crypto Data API Plans. https://www.coingecko.com/en/api/pricing
[^11]: Authentication (Pro API) - CoinGecko API. https://docs.coingecko.com/reference/authentication
[^12]: Changelog - CoinGecko API. https://docs.coingecko.com/changelog
[^13]: Trending Search List - ReadMe (Mirror). https://coingecko-api-v3.readme.io/reference/trending-search
[^14]: Most Recently Updated Tokens List - GeckoTerminal. https://docs.coingecko.com/reference/tokens-info-recent-updated
[^15]: Top Solana Ecosystem Coins by Market Cap. https://www.coingecko.com/en/categories/solana-ecosystem
[^16]: Mastering Crypto Volume Analysis: Guide (2025) - HyroTrader. https://www.hyrotrader.com/blog/crypto-volume-analysis/
[^17]: Volume Rate of Change | TrendSpider Learning Center. https://trendspider.com/learning-center/volume-rate-of-change/
[^18]: Probability and Its Implementation in Crypto Trading - Binance. https://www.binance.com/en/square/post/21624717697193
[^19]: Simple Supported Currencies - CoinGecko API. https://docs.coingecko.com/reference/simple-supported-currencies
[^20]: How to Extract Cryptocurrency Data from CoinGecko with Python - Crawlbase. https://crawlbase.com/blog/how-to-extract-cryptocurrency-data-from-coingecko/
[^21]: Crypto Data API: Most Comprehensive & Reliable - CoinGecko. https://www.coingecko.com/en/api
[^22]: Solana Price: SOL Live Price Chart, Market Cap & News Today. https://www.coingecko.com/en/coins/solana