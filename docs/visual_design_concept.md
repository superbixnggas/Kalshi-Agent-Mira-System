# Konsep Desain Visual Khalsi AI (Anime-Futuristik) Adaptasi dari kalshagent.com

## Ringkasan Eksekutif

Dokumen ini menetapkan blueprint kreatif dan teknis untuk konsep visual Khalsi AI bergaya anime-futuristik, beradaptasi dari kalshagent.com. Tujuan desain adalah mempertahankan kejelasan dan fokus data dari referensi, sambil menyuntikkan karakter visual anime yang memiliki energi tinggi, kontras kuat, serta sentuhan sci-fi. Hasilnya adalah identitas yang menyatu: profesional namun ekspresif, rapi namun bernyawa, serta可持续 di seluruh alur utama: Landing → Dashboard → Market Probability.

Karakter Khalsi dipertankan sebagai pemandu yang memahami konteks. Di landing, Khalsi menyapa pengguna dan menuntun Call to Action (CTA). Di dashboard, Khalsi menyoroti perubahan penting secara ringan agar tidak mengganggu fokus analitis. Di market probability, Khalsi membantu memberi konteks peluang dan risiko, seakan “narator” yang memimpin pembacaan data tanpa mengambil alih layar.

Nilai tambah utama konsep ini ada pada kombinasi: readability maksimal dengan hierarki yang tegas, ritme komponen yang konsisten, aksen neon biru–ungu yang dramatis namun terkendali, serta animasi yang tepat guna (hemat dan bermakna). Everything dalam dokumen ini disediakan agar tim produk, UI/UX, Visual/Brand, Front-end, dan stakeholder selaras dalam satu arah eksekusi.

Deliverable utama:
- Konsep visual end-to-end yang siap seringkai menjadi design system dan handout eksekusi.
- Prinsip desain yang memandu setiap keputusan visual.
- Skema warna dan tipografi yang dapat diskalakan dan diakses.
- Struktur layout untuk Landing, Dashboard, dan Market Probability.
- Spesifikasi komponen UI dan animasi/transisi.
- Integrasi karakter Khalsi yang konsisten dan adaptif.
- Pedoman responsive dan aksesibilitas.
- Checklist handover ke engineering dan rencana iterasi.

Dokumentasi konsep ini disimpan dalam repositori proyek sebagai dokumen acuan utama (untuk lokasi file, rujuk petujuk penyimpan di bagian akhir).

---

## Prinsip Desain & Narasi Visual

Narasi desain berjalan dari kejelasan → энергия → ketenangan. Di setiap halaman, kami menyuguhkan informasi penting terlebih dahulu, lalu menambahkan aksen yang “menghidupkan” sekelilingnya—tanpa mengacaukan fokus pengguna. Hasilnya, pengguna selalu bisa menemukan apa yang dicari, namun tetap merasa berada dalam dunia anime-futuristik yang khas.

Prinsip-prinsip kunci:
- Kejelasan informasi: hierarki judul–subjudul–konten yang tegas, grid yang rapi, spacing yang konsisten, dan tipografi dengan kontras yang cukup.
- Ritme visual: jarak vertikal yang seragam, “oxygen” untuk elemen penting, dan pengulangan pola yang mudah diprediksi.
- Aksen anime yang terukur: glow dan glitch digunakan hemat untuk momentum, tetapi tidak menenggelamkan isi.
- Konsistensi dan skalabilitas: pola komponen yang berulang, variabel warna dan tipe yang terdefinisi, serta kriteria state yang seragam.

### Persona Pengguna & Goals

- Penjelajah AI: ingin cepat memahami apa itu Khalsi AI dan value proposition-nya, lalu melanjutkan ke demo atau percobaan tanpa hambatan.
- Analis pasar: memerlukan glanceability tinggi, mampu memindai ringkasan, tren, dan sinyal peluang—sekaligus memahami ketidakpastian (probability).
- Pengambil keputusan: membutuhkan kejelasan outcome, confidence level, dan risiko utama—dengan rekomendasi yang dapat dipercaya.

Implikasi desain:
- Landing harus ringkas,memiliki CTA yang jelas, dan menegaskan diferensiasi.
- Dashboard harus modular, mudah dipindai, serta menonjolkan KPI, alert, dan ringkasan pasar.
- Market Probability perlu presentasi probabilitas yang transparan dan mudah ditafsirkan.

### Ekspresi Karakter Khalsi (Visual DNA)

- Persona: ai-guideyang ramah, gesit, dan percaya diri. Khalsi hadir untuk memandu, bukan mendominasi.
- Gaya visual: garis tegas, gradien neon yang terkendali, aksen glow halus, serta sentuhan glitch yang hemat.
- Penggunaan di halaman:的头像, badge status, tooltip, dan micro states pada komponen. Pastikan teks selalu mudah dibaca.
- Standar ethical: jelaskan ketika AI speak; gunakan tone yang suportif, avoid overpromising, dan menjaga privacy pengguna.

---

## Palette Warna, Tipografi, & Gaya Visual

Palet utama: biru neon dan ungu neon di atas dasar gelap untuk efek futuristik dan kontras optimal. Aksen hijau digunakan hemat untuk konfirmasi atau sinyal positif agar tidak “bertabrakan” dengan biru–ungu. Variasi warna difokuskan pada state komponen (hover, focus, active, disabled) dan elevasi (depth) melalui bayangan dan gradient subtle.

Tipografi: sans-serif modern untuk kebersihan dan keterbacaan. Hierarki yang jelas—judul mencolok, subjudul mendukung, dan body yang rapi. Ejaan brand: K A L S H I (kapital), agar mudah дифференции dari KALSH (referensi).

To ensure the scope remains aligned with available information, the following items are intentionally left as open decisions to be finalized later:
- Nilai warna hex yang pasti (saat ini: rekomendasi berbasis aksesibilitas).
- Pilihan keluarga font dan fallback (saat ini: sans-serif modern).
- Bindings spesifik token warna ke nama token; estados komponen; dan radius konkret untuk cards, tombol, dan inputs.

### Palette & Token Warna

Prinsip:
- Primary: biru neon untuk CTA, highlight penting, dan aksen interaktif.
- Secondary: ungu neon untuk dim从前 pendukung, aksen atmosfer, dan status “premium”.
- Base dark: fondasi latar yang menjaga kontras tinggi terhadap teks dan komponen.
- Success (hemat): digunakan untuk konfirmasi positif atau sinyal “buy/naik”.
- Accent glow: efek Light-emitting diode (LED) yang halus di border atau background komponen kunci.

Untuk memperjelas penggunaan, Tabel 1 memetakan palet dan perannya di tiap halaman. Nilai hex yang spesifik akan diselesaikan setelah definitif.

Tabel 1 — Palette dan Pemetaan Token per Rol
| Nama Token (usulan) | Deskripsi & Peran | Landing | Dashboard | Market Probability |
|---|---|---|---|---|
| Primary (Blue Neon) | CTA, link aktif, fokus | Hero title accent, CTA primary | KPI highlight, button primary | High probability accent, CTA |
| Secondary (Purple Neon) | Aksen atmosfer, status | Gradient hero background, badge | Panel border accent, tag | Confidence band highlight |
| Base Dark (Deep) | Background keseluruhan | Section backgrounds | Card/panel background | Chart background |
| Text High Contrast | Teks utama | Headline, body | Headline, body | Label, anotasi |
| Success (Green) | Konfirmasi/positif (hemat) | Notifikasi sukses | Status positif | Sinyal probabilitas tinggi |
| Accent Glow | Efek neon ringan | Subtle border glow | Hover/active state | Gridline/legend glow |

Kegunaan:
- Landing: dorongan konversi dengan kontras CTA dan headline yang jelas.
- Dashboard: fokus pada KPI dan status tanpa “bising”.
- Market Probability: nada warna berfungsi sebagai peta risiko–peluang yang mudah dibaca.

### Tipografi & Skala

Hirarki dan ritme membaca menjadi fondasi. Untuk memastikan konsistensi, Tabel 2 memetakan skala heading dan contoh penggunaan.

Tabel 2 — Skala Tipografi
| Level | Peran | Contoh Penggunaan | Catatan |
|---|---|---|---|
| H1 | Judul halaman/section | “Khalsi AI” di hero; “Market Probability” | Pastikan kontras tinggi terhadap background |
| H2 | Subjudul/blok | “Kenapa Memilih Khalsi AI” | Memecah alur baca |
| H3 | sub-bagian | “Probabilitas & Confidence” | Mengelompokkan konten spesifik |
| Body L | Deskripsi utama | Paragraf penjelasan fitur | Maintain line-height confort |
| Body S | Keterangan mikro | Label, caption, helper text | Jaga keterbacaan di dark mode |
| Caption | Annotasi chart | “95% CI”, “ sumber data” | Font-size kecil namun kontras cukup |

Ejaan brand: K A L S H I (huruf kapital). Gunakan font sans-serif modern yang bersih, dengan fallback sesuai lingkungan produksi (akan ditetapkan kemudian).

### Iconografi & Ilustrasi

- Ikonografi: garis bersih, sudut membulat minimal, ukuran konsisten, dan prioritas keterbacaan. Ikon berfungsi sebagai penuntun, bukan hiasan.
- Ilustrasi Khalsi: gaya garis tegas, gradien ringan, dan aksen neon secukupnya. Hindari clutter agar fokus tetap pada konten.
- Standar penggunaan: ukuran, stroke, dan padding ikuti sistem grid komponen untuk keselarasan.

---

## Arsitektur Layout: Landing → Dashboard → Market Probability

Flow end-to-end harus terasa mulus: dari rasa ingin tahu di landing, menuju pemantauan di dashboard, lalu ke eksplorasi probabilitas di halaman khusus. Di setiap tahap, Khalsi hadir sebagai pemandu ringan. Komponen disusun dalam grid yang rapi, dengan hierarki informasi yang jelas dan alur perhatian yang logis.

### Landing Page

Struktur landing조직 sebagai berikut:
- Hero: judul brand, tagline yang menegaskan manfaat, dan CTA primer. Aksen neon biru–ungu untuk headline dan tombol.
- Why Choose Khalsi AI: 3–4 poin yang menjelaskan value proposition dengan ikon dan copy ringkas.
- Features snapshot: cuplikan kemampuan inti dalam kartu yang mudah dipindai.
- Call to Community: ajakan untuk bergabung atau terhubung, menjaga tone yang suportif.
- Footer: informasi legal dan branding.

Tabel 3 memetakan seksi dan tujuannya.

Tabel 3 — Peta Seksi Landing
| Seksi | Tujuan | Elemen UI | CTA | Konten Khalsi |
|---|---|---|---|---|
| Hero | Perview manfaat + arah | H1, deskripsi, 2 tombol | “Explore Dashboard”, “Learn More” | Khalsi greet + tooltip konteks |
| Why Choose | Nilai inti | 3–4 kartu benefit + ikon | “See How It Works” | Badge “Assisted by Khalsi” |
| Features Snapshot | Bukti kemampuan | Kartu ringkas + ilustrasi | “Try Market Probability” | Khalsi pointer ke modul |
| CTA Community | Komunitas & connections | Teks + tombol | “Join Community” | Khalsi saying “Let’s connect” |
| Footer | Branding & legal | Link, hak cipta | — | — |

Pemetaan ini membantu menyelaraskan fokus: dari destruktur nilai ke tindakan, tanpa beban kognitif berlebih.

### Dashboard

Dashboard menyajikan ringkasan intelligent melalui modul yang mudah dipindai:
- Overview: KPI utama, health status, dan status server koneksi.
- Top Movers & Alerts: list perubahan penting dan notifikasi.
- Recommendations: saran singkat yang dapat ditindaklanjuti.
- Mini Probability Widget: cuplikan probabilitas dengan indikasi confidence level.
- Navigation & Filters: per halaman untuk mengatur fokus pasar.

Tabel 4 merinci modul dan konten penting.

Tabel 4 — Modul Dashboard
| Komponen | Deskripsi | Prioritas | Konten Khalsi |
|---|---|---|---|
| Overview KPI | Nilai utama + trend | Tinggi | Khalsi callout ketika anomali |
| Alerts | Notifikasi sinyal | Tinggi | Badge “Khalsi analyzed” |
| Top Movers | Daftar naik/turun | Sedang | Tooltip explainer |
| Recommendations | Saran tindakan | Sedang | Copy AI-suggested |
| Mini Probability | Snapshot probabilitas | Sedang | Badge confidence |
| Filters & Scope | Pasar, rentang waktu | Sedang | Hint “Try market view” |

Susunan modul mendukung “glanceability”: pengguna segera menangkap apa yang berubah dan apa yang harus diperhatikan.

### Halaman Market Probability

Halaman ini fokus pada visualisasi probabilitas dengan konteks risiko–peluang:
- Header: ringkasan probabilitas dan confidence level.
- Visualization: area chart/line dengan confidence band; legenda yang jelas.
- Panel metrik: probabilitas, confidence interval, horizon, dan sample size (bila tersedia).
- Interaktivitas: hover tooltip, filter, dan range slider yang ringan.

Tabel 5 memetakan elemen utama.

Tabel 5 — Elemen Market Probability
| Bagian | Deskripsi | UI/Interaksi | Konten Khalsi |
|---|---|---|---|
| Header Ringkasan | Probabilitas & confidence | Badge, H2 | “Khalsi explains this score” |
| Visualization | Chart + band | Hover, highlight | Inline tip: “What changes this?” |
| Panel Metrik | Nilai inti | Cards, tag | Annotasi ringkas |
| Controls | Filter & range | Slider, dropdown | Helper text |

Penempatan Khalsi diatur agar membantu pembacaan, bukan mengalihkan dari data.

---

## Desain Komponen UI Inti

Sistem komponen berlandaskan konsistensi: pola yang sama untuk cards, charts, tombol, navigation, inputs, serta feedback status. Ketersediaan state (hover, focus, active, disabled) ditetapkan secara eksplisit agar antarmuka terasa “hidup” dan dapat diandalkan.

### Cards & Panels

- Struktur: container, header/footer opsional, dan area konten.
- Variasi: data card, feature card, chart card.
- Depth: gunakan shadow/glow halus dan gradien ringan untuk efek elevasi tanpa mengganggu readability.
- Konsistensi spacing dan judul: tata letak modular dengan jarak seragam.

Kegunaan:
- Cards memampatkan informasi penting agar mudah dipindai.
- Chart cards memfasilitasi fokus pada satuvisualisasi di waktu.

### Charts & Visualisasi Data

- Jenis: line/area untuk probabilitas; histogram/bars bila konteks distribusi dibutuhkan.
- Aksen: gunakan warna primer untuk garis/area utama; secondary untuk band; sukses untuk sinyal positif.
- Gridlines & legend: kontras cukup terhadap background gelap; hindari detail berlebihan.
- Tooltip: format data jelas, dengan annotasi Khalsi bila diperlukan.

Hasilnya, data speak for itself, sementara Khalsi membantu menerjemahkan makna ketika relevansi tinggi.

### Buttons & CTAs

- Primer: gunakan neon biru untuk konversi tinggi dan aksi utama.
- Sekunder: gunakan outline atau ungu neon untuk aksi pendukung.
- Ghost: transparan dengan border dan hover glow; bagus untuk aksi ringan.
- Disabled: kontras diturunkan, opacity dikurangi; tetap menjaga affordance.

Tabel 6 merangkum style per varian.

Tabel 6 — Style Buttons
| Varian | Peran | Background/Border | Teks | Hover/Active/Disabled | Icon (opsional) |
|---|---|---|---|---|---|
| Primary | Konversi utama | Blue neon solid | Teks kontras tinggi | Hover: glow ringan; Active: pressed; Disabled: opacity | Panah/ikon aksi |
| Secondary | Dukungan | Purple neon outline | Teks kontras | Hover: fill ringan; Active: pressed | Info/panah |
| Ghost | Aksi ringan | Transparent + border | Teks kontras | Hover: glow; Active: pressed | Ellipsis/panah |
| Danger | Hati-hati | Accent khusus | Teks kontras | Hover: intensifikasi | Warning |

Penekanan: tombol harus segera memberi kesan “dapat diklik” dan “aman digunakan”.

### Navigation & Filters

- Top navigation: logo, menu inti, dan area pengguna. Sesuai kebutuhan, tampilkan toggle tema.
- Side navigation: modul utama, dapat dikecilkan (collapse) pada layar kecil.
- Breadcrumb: gunakan pada struktur berlapis untuk menjaga orientation pengguna.
- Range slider: sederhana, dengan label nilai.

Tujuan: memperlancar transisi antar halaman dan menjaga fokus pada konteks saat ini.

### Form & Inputs

- Text input, select, toggle, date picker, dan search.
- States: focus jelas dengan highlight neon; error醒目 namun tidak agresif.
- Helper text: ringkas dan langsung ke inti; letakkan di bawah label.

Tabel 7 merinci pattern per komponen input.

Tabel 7 — Pattern Inputs
| Komponen | State (default/hover/focus/error/disabled) |Helper text |Validasi |
|---|---|---|---|
| Text Input | Border/glow berubah | “Masukkan nilai” | On blur/change |
| Select | Border/glow, caret animasi | “Pilih satu opsi” | On change |
| Toggle | Lidah neon bergerak | “Aktif/Nonaktif” | On toggle |
| Date Picker | Focus glow, kalender | “DD/MM/YYYY” | On select |
| Search | Icon animasi ringan | “Cari simbol/kata kunci” | On submit |

### Empty State & Skeleton

- Empty state: ikon sederhana, teks ringkas, dan tombol next step yang jelas.
- Skeleton loading: placeholder konsisten, durasi secukupnya, dan tidak menyakiti kinerja.
- Khalsi microcopy: ajakan yang suportif, menghindari jargon teknis.

### Notifications/Toasts & Modals

- Toasts: konfirmasi dan informasi ringan; durasi singkat; prioritas tinggi bisa persist sedikit lebih lama.
- Modals: dialog penting atau konfirmasi; porthole/overlay dengan blur; fokus trap yang ketat.
- Accessibility: label jelas, deskripsi ringkas, dan tombol “tutup” mudah diakses.

---

## Konsep Animasi & Transisi

Animasi digunakan hemat untuk membangun momentum tanpa noise. Prinsip: cepat, jelas, dan bermakna. Durasi singkat dengan kurva yang terasa natural, serta fallback untuk performa rendah.

- Micro-interactions: hover tombol (glow), progres bar probabilitas, badge update, dan skeleton loading yang halus.
- Page transitions: crossfade atau slide ringan antar halaman; sepertinya “kain” yang bergerak, bukan ledakan efek.
- Motion untuk fokus data: highlight pada bar atau dot pada line chart saat data baru muncul; tooltip fade-in yang rapi.
- Reduced motion: ketika pengguna memilih motion minimal, berikan fallback statis atau transisi sangat singkat.

Tabel 8 — Motion Spec
| Kasus | Durasi | Easing | Delay | Performance Note | Fallback |
|---|---|---|---|---|---|
| Hover tombol | 120–160 ms | ease-out | 0 | Compositor-friendly | Static glow |
| Skeleton load | 300–600 ms | linear | 0–100 | Hindari reflow besar | Static placeholders |
| Crossfade halaman | 200–240 ms | ease-in-out | 0 | Hanya layer yang berubah | Instan switch |
| Chart update | 180–220 ms | ease-out | 0–80 | Batch updates | Direct update |
| Tooltip | 120–160 ms | ease-out | 0 | Render tooltip late | Static caption |

Tabel 9 — State Transitions
| Komponen | Dari → Ke | Trigger | Kurva/Durasi | Catatan A11y |
|---|---|---|---|---|
| Button | default → hover | Hover | ease-out/140ms | Indikator fokus terlihat |
| Card | hover → raised | Hover | ease-out/160ms | Shadow/glow sutil |
| Tab | inactive → active | Click | ease-in-out/180ms | Focus ring bergeser |
| Modal | closed → open | Click/shortcut | ease-out/200ms | Trap focus, label jelas |
| Toast | hidden → show | Event | ease-out/160ms | Tidak menghalangi |

---

## Integrasi Karakter Khalsi di Setiap Halaman

Karakter bukan “maskot bingung”—Khalsi adalah pemandu kontekstual. Integrasi mengikuti prinsip: ringan, tepat guna, dan menjaga fokus data. Di landing, ia menyapa; di dashboard, ia menyoroti; di market probability, ia memberi解释.

- Landing:头像/ilustrasi di hero dengan tooltip; badge “Assisted by Khalsi” pada benefit; pointer animasi ringan ke CTA.
- Dashboard: badge status di KPI; tooltip penjelasan; onboard tip yang bisa di-dismiss.
- Market Probability: anotasi inline di chart; headline score解释; panel konteks yang mudah dibuka/tutup.

Tabel 10 — Integration Matrix
| Halaman | Lokasi | Fungsi | Microcopy contoh | Interaksi |
|---|---|---|---|---|
| Landing | Hero, Why, Features | Greet, highlight CTA | “Saya Khalsi. Yuk mulai.” | Tooltip/pointer ke CTA |
| Dashboard | KPI, Alerts, Mini Prob | Sorot anomali | “Ada lonjakan di X.” | Badge/hover explain |
| Market Probability | Chart, Metrik | Jelaskan score | “Band menunjukkan ketidakpastian.” | Inline annotation |

### Landing Integration

Khalsi memimpin perhatian tanpa mendominasi. Tooltip di hero dan badge pada bagian Why Choose memperkuat kesan “dihatikan AI” dengan cara yang hangat.

### Dashboard Integration

Badges dan callouts hadir ketika perlu—like a colleague tapping your shoulder to point out a trend. Pastikan setiap intervensi memiliki close action dan tidak reaktif berlebihan.

### Market Probability Integration

Anotasi mengikat probabilitas ke konteks: apa yang memengaruhi angka, bagaimana membacanya, dan implikasinya bagi keputusan. Sekecil apa pun, ini akan meningkatkan trust pengguna.

---

## Responsive & Aksesibilitas

Desain harus terasa konsisten di berbagai ukuran: desktop sebagai landasan, lalu bertahap mengecil ke tablet dan mobile. Prioritas konten mengikuti kebutuhan: KPI di atas, navigasi disederhanakan, dan chart tetap mudah dibaca.

Tabel 11 — Breakpoint & Grid
| Device | Breakpoint (usulan) | Kolom | Gutter | Catatan Layout |
|---|---|---|---|---|
| Desktop | ≥1200px | 12 | 24px | 2–3 kolom cards; nav penuh |
| Laptop | 1024–1199px | 12 | 20px | Penyesuaian spasi |
| Tablet | 768–1023px | 8 | 16px | 1–2 kolom cards; nav ringkas |
| Mobile | ≤767px | 4 | 12px | 1 kolom; bottom nav opsional |

Tabel 12 — Content Prioritization
| Device | yang Dimuat/Ditampilkan Prioritas | yang Dapat Disederhanakan |
|---|---|---|
| Desktop | Full navigation, KPI lengkap, chart besar | Ilustrasi dekoratif |
| Tablet | KPI ringkas, chart medium, nav ringkas | Panel sekunder collapsible |
| Mobile | KPI inti, chart kecil, CTA jelas | Detail metrik di expandable |

Aksesibilitas:
- Kontras warna: pastikan teks dan komponen utama mencapai standar kontras tinggi pada latar gelap.
- Keyboard navigation: fokus terlihat, urutan logis, dan dukungan skip links.
- Reduced motion: hormati preferensi pengguna; sediakan fallback statis.
- Screen reader: labelling yang konsisten pada ikon, tombol, dan chart (deskripsi singkat bila perlu).

### Breakpoint & Grid

Grid 12 kolom untuk desktop disederhanakan menjadi 8 kolom di tablet dan 4 kolom di mobile. Gutter mengecil bertahap agar konten tetap proporsional.

### Performa & Efisiensi

- Penghematan: animasi minimal dan hemat GPU; asset icon/ilustrasi dioptimalkan; throttling pada update chart.
- Pembaruan data: batching jika memungkinkan; skeleton loading digunakan untuk memberi umpan balik cepat tanpa membebani performa.

---

## Asset List & Deliverables

Untuk melancarkan handover, berikut daftar asset yang perlu disiapkan, status produksinya, dan path/lokasi yang akan digunakan. Lokasi file menggunakan placeholder path agar mudah dipetakan ke struktur repositori tim.

Tabel 13 — Daftar Asset
| Nama | Jenis | Format | Ukuran/Res | Status | Lokasi |
|---|---|---|---|---|---|
| Logo Khalsi | Logo | SVG/PNG | — | Perlu desain | path/logos/khalsi-logo |
| Ikon Set | Ikon | SVG | 16–32px | Perlu desain | path/icons |
| Khalsi Avatar/Ilustrasi | Ilustrasi | SVG/PNG | 1x/2x/3x | Perlu desain | path/illustrations/khalsi |
| Palette Warna | Token | JSON/CSS | — | Perlu penetapan | path/tokens/color-palette |
| Skala Tipografi | Token | JSON/CSS | — | Perlu penetapan | path/tokens/typography |
| Komponen UI | Spec + kode | MD/Spec | — | Perlu spesifikasi | path/components |
| Ilustrasi Page (Landing/Dashboard/Prob) | Ilustrasi | SVG/PNG | — | Perlu desain | path/illustrations/pages |
| Empty/Skeleton States | Spec | MD | — | Perlu spesifikasi | path/states |

Deliverable finale: dokumen konsep visual lengkap, beserta folder pendukung asset, siap ditinjau lintas fungsi (lihat bagian akhir untuk lokasi penyimpanan dokumen).

---

## Metode Handover ke Engineering & Quality Checklist

Handover yang baik meminimalkan ambiguitas dan mempercepat waktu implementasi. Dokumentasi mencakup: prinsip desain, struktur halaman, spesifikasi komponen, konfigurasi token warna/tipografi, pedoman animasi, dan contoh interaksi. QA difokuskan pada keterbacaan, interaksi, serta konsistensi.

Tabel 14 — QC Checklist
| Area | Kriteria | Metode Uji | Status |
|---|---|---|---|
| Aksesibilitas | Kontras, fokus, keyboard | Manual +axe | — |
| Interaksi | Hover/focus/active/disabled | Manual + otomasi | — |
| Responsif | Breakpoint & grid | Resize & device test | — |
| Animasi | Durasi & easing | Motion profiling | — |
| Konten | Microcopy & label | Review editorial | — |
| Tokens | Warna & tipografi | Token inspection | — |
| Chart | Readability & tooltip | Uji chart rendering | — |
| Khalsi | Integrasi & dismissibility | Uji interaksi | — |
| Performa | Render & loading | Profiling ringan | — |
| Kebersihan | Konsistensi styling | Lint & visual diff | — |

Checklist ini berlaku untuk semua tahap iterasi agar kualitas terjaga konsisten dari sprint ke sprint.

---

## Roadmap Implementasi & Iterasi

Prioritas kerja: mulai dari landasan (token, grid, tipografi), lanjut ke komponen inti (cards, buttons, inputs), затем halaman utama (Landing → Dashboard → Probability), dan terakhir polish animasi serta detail aksesibilitas. Setiap tahap memiliki kriteria kelulusan yang jelas untuk menjaga ritme tim.

Tabel 15 — Roadmap Sprint
| Fase | Tugas Utama | Output | Kriteria Kelulusan | Estimasi |
|---|---|---|---|---|
| 1 — Foundations | Token warna, grid, tipografi | Design tokens + guide | Disetujui lintas fungsi | 1–2 sprint |
| 2 — Core Components | Cards, buttons, inputs, nav | Komponen siap pakai | QC checklist lulus | 2–3 sprint |
| 3 — Pages | Landing, Dashboard, Probability | Pages implemented | QA fungsional & visual | 2–3 sprint |
| 4 — Motion & Polish | Animasi, a11y polish | Motion spec + implementasi | Reduced motion support | 1–2 sprint |
| 5 — Content & Copy | Microcopy, label, tooltips | Konten final | Editorial review | 1 sprint |

Iterasi: kumpulkan feedback pengguna, ukur metrik task success (misal waktu untuk menemukan KPI), dan perbaiki bottleneck yang terdeteksi. Dokumentasi diperbarui setiap akhir sprint agar tetap menjadi sumber kebenaran tunggal.

---

## Keterbatasan Informasi & Keputusan yang Masih Ditentukan

Sejalan dengan konteks yang tersedia, beberapa keputusan lanjutan perlu ditetapkan pada tahap implementasi:
- Nilai warna hex spesifik untuk setiap token (Primary Blue, Secondary Purple, Base Dark, Accent, Success).
- Pilihan keluarga font final dan fallback yang akan digunakan lintas platform.
- Skala radius konkret untuk cards, inputs, dan buttons; serta gaya border yang konsisten.
- Jenis chart final dan library visualisasi data yang akan dipakai.
- Asset spesifikasi Khalsi (avatar/ilustrasi) beserta poses/ekspresi dan microcopy final.
- Binding token warna ke nama token dan estados komponen yang seragam.
- Nuansa interaksi spesifik per komponen (durasi, kurva, hysteresis) setelah uji usability.
- Detail breakpoints dan grid angka pasti untuk setiap kelas perangkat.
- Kriteria performa untuk animasi (frame rate target, GPU-compositing, throttling).
- Kebijakan reduced motion serta dampak terhadap contoh animasi yang ada.

Keputusan di atas akan difinalisasi melalui diskusi lintas fungsi (Brand/UX/Eng) dan dituangkan sebagai amendment pada dokumen ini,agar history perubahan tercatat dengan jelas.

---

## Penutup

Konsep ini menyatukan kejelasan informasi ala kalshagent.com dengan ekspresi anime-futuristik yang khas Khalsi AI. Dengan palet neon biru–ungu yang terkendali, tipografi sans-serif modern, struktur layout yang disiplin, dan karakter Khalsi sebagai pemandu kontekstual, pengalaman pengguna menjadi menyatu: mudah digunakan, menarik untuk dilihat, dan mudah ditingkatkan.

Tim memiliki terra ink yang cukup untuk mengeksekusi dari fondasi hingga polish, sembari menjaga ruang untuk keputusan teknis dan konten yang akan ditetapkan kemudian. Dokumen konsep ini tersedia sebagai acuan utama bagi seluruh stakeholder untuk menjaga keselarasan visi dan mutu implementasi.

Untuk menyimpan dokumen dan aset:
- Simpan dokumen konsep lengkap ini di: docs/visual_design_concept.md
- Ikuti struktur folder asset seperti pada Tabel 13 (logos, icons, illustrations, tokens, components, states)

Dengan struktur ini, kolaborasi lintas fungsi akan lebih lancar, dan produk bisa segera turun ke jalan dengan pengalaman yang konsisten, aksesibel, serta futuristik.