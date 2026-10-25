import { EconomicRelease, NewsType, NewsCorrelation } from '../types/forex';

export interface MacroCorrelationDetail {
  newsType: NewsType;
  fullName: string;
  sourceAuthority: string;
  releaseSchedule: string;
  relatedIndicators: {
    name: string;
    nature: 'LEADING' | 'COINCIDENT' | 'CONFIRMATORY';
    relationship: string;
  }[];
  usdImpactMechanism: string;
  goldImpactMechanism: string;
  marketTransmissionChain: string;
  tradingRules: string[];
}

export const NEWS_CORRELATION_MATRIX: Record<NewsType, MacroCorrelationDetail> = {
  NFP: {
    newsType: 'NFP',
    fullName: 'Non-Farm Payrolls & Unemployment Rate (Ketenagakerjaan AS)',
    sourceAuthority: 'U.S. Bureau of Labor Statistics (BLS)',
    releaseSchedule: 'Jumat pertama setiap bulan (19:30 WIB / 20:30 WITA)',
    relatedIndicators: [
      {
        name: 'ADP Non-Farm Employment Change',
        nature: 'LEADING',
        relationship: 'Dirilis 2 hari sebelum NFP (hari Rabu). Mengukur penambahan tenaga kerja swasta (~400.000 bisnis). Sering menjadi petunjuk awal arah NFP.'
      },
      {
        name: 'Initial Jobless Claims (Klaim Pengangguran Mingguan)',
        nature: 'LEADING',
        relationship: 'Rilis setiap Kamis. Jika rata-rata klaim 4 minggu meningkat di atas 240K, NFP cenderung melemah dan angka pengangguran naik.'
      },
      {
        name: 'JOLTS Job Openings (Lowongan Kerja)',
        nature: 'LEADING',
        relationship: 'Mengukur rasio lowongan kerja per pencari kerja. Penurunan lowongan kerja menandakan pendinginan pasar tenaga kerja yang mendahului penurunan NFP.'
      },
      {
        name: 'ISM Services & Manufacturing Employment Index',
        nature: 'LEADING',
        relationship: 'Sub-komponen ketenagakerjaan PMI. Jika angka ISM Services Employment di bawah 50.0 (kontraksi), NFP hampir selalu rilis lebih rendah.'
      },
      {
        name: 'Average Hourly Earnings (Upah Per Jam)',
        nature: 'COINCIDENT',
        relationship: 'Dirilis serentak dengan NFP. Menjadi jembatan antara pasar tenaga kerja dan inflasi upah (Wage-Push Inflation).'
      }
    ],
    usdImpactMechanism: 'NFP Beat (> Forecast) & Pengangguran Turun → Ekonomi tangguh, daya beli kuat → The Fed menunda pemangkasan suku bunga (Higher for Longer) → Imbal hasil obligasi AS (Treasury Yields) melonjak → USD Menguat Kuat (BULLISH USD).',
    goldImpactMechanism: 'Emas (XAU/USD) adalah aset tanpa bunga. Kenaikan yield riil obligasi dan penguatan USD akibat NFP kuat memicu aksi jual masif pada Emas ($15 - $35 drop). Sebaliknya jika NFP Miss tajam, ekspektasi pemotongan bunga memicu reli eksplosif Emas.',
    marketTransmissionChain: 'Data NFP Kuat → Peluang Rate Cut Fed Turun → Yield US 10-Yr Naik → DXY Menguat → EUR/USD & XAU/USD Anjlok.',
    tradingRules: [
      'Cek ADP & Jobless Claims 2 hari sebelum NFP sebagai acuan awal.',
      'Waspadai "Konflik Data": Jika Headline Payroll hijau tapi Tingkat Pengangguran naik, pasar sering spike sesaat lalu berbalik arah 180° mengikuti pengangguran.',
      'Hindari open posisi 2 menit sebelum rilis; tunggu pembentukan candle 5-menit (M5) pertama.'
    ]
  },

  CPI: {
    newsType: 'CPI',
    fullName: 'Consumer Price Index (Inflasi Konsumen AS)',
    sourceAuthority: 'U.S. Bureau of Labor Statistics (BLS)',
    releaseSchedule: 'Pertengahan bulan (tanggal 10-14, pukul 19:30 WIB)',
    relatedIndicators: [
      {
        name: 'PPI (Producer Price Index - Inflasi Produsen)',
        nature: 'LEADING',
        relationship: 'Biaya di tingkat pabrik/grosir akan diteruskan ke harga eceran konsumen 1-2 bulan ke depan. Kenaikan PPI mendahului kenaikan CPI.'
      },
      {
        name: 'Core PCE Price Index (Personal Consumption Expenditures)',
        nature: 'CONFIRMATORY',
        relationship: 'Indikator inflasi resmi yang menjadi target 2% The Fed. CPI adalah penggerak ekspektasi utama sebelum data PCE dirilis.'
      },
      {
        name: 'Harga Minyak Mentah (WTI Crude Oil & Gasoline)',
        nature: 'LEADING',
        relationship: 'Komponen energi menyumbang fluktuasi terbesar pada Headline CPI. Kenaikan bensin 10% langsung mengerek CPI bulanan 0.2% - 0.3%.'
      },
      {
        name: 'Shelter / Owners Equivalent Rent (Biaya Sewa Tempat Tinggal)',
        nature: 'COINCIDENT',
        relationship: 'Memegang bobot 36% dalam CPI AS. Kenaikan sewa rumah membuat Core CPI membandel (sticky) dan sulit turun.'
      },
      {
        name: 'Import Price Index (Harga Barang Impor)',
        nature: 'LEADING',
        relationship: 'Mengukur apakah inflasi diimpor dari luar negeri melalui pelemahan mata uang atau tarif perdagangan.'
      }
    ],
    usdImpactMechanism: 'CPI Panas (> Forecast) → Inflasi membandel → The Fed dipaksa mempertahankan suku bunga tinggi atau menaikkan bunga → Yield obligasi AS meroket → Inflow modal global ke instrumen dollar → USD Sangat Bullish.',
    goldImpactMechanism: 'Emas (XAU/USD) bereaksi sangat keras terhadap CPI. Ketika CPI tinggi, ekspektasi suku bunga tinggi menekan Emas (Bearish). Namun jika CPI melandai mulus, Emas mengalami "Relief Rally" luar biasa karena imbal hasil riil menurun drastis.',
    marketTransmissionChain: 'CPI Tinggi → Prospek Bunga Fed Naik → US 2-Yr Yield Naik → DXY Reli → Emas (XAU/USD) Anjlok Tajam ($20 - $40).',
    tradingRules: [
      'Utamakan Core CPI (tanpa makanan & energi) dibanding Headline jika terjadi perbedaan arah.',
      'Deviasi CPI sebesar 0.2% dari estimasi konsensus sudah cukup memicu pergerakan 100-180 pips pada pasangan major.',
      'Emas adalah instrumen dengan volatilitas tertinggi saat rilis CPI.'
    ]
  },

  PPI: {
    newsType: 'PPI',
    fullName: 'Producer Price Index (Inflasi Tingkat Produsen/Grosir)',
    sourceAuthority: 'U.S. Bureau of Labor Statistics (BLS)',
    releaseSchedule: 'Sehari setelah atau sebelum rilis CPI (19:30 WIB)',
    relatedIndicators: [
      {
        name: 'CPI (Consumer Price Index)',
        nature: 'CONFIRMATORY',
        relationship: 'PPI adalah indikator hulu bagi CPI. Produsen yang menanggung kenaikan biaya bahan baku akan menaikkan harga jual ke konsumen.'
      },
      {
        name: 'ISM Prices Paid Index (Manufaktur & Jasa)',
        nature: 'LEADING',
        relationship: 'Survei manajer pembelian mengenai harga yang mereka bayar untuk bahan baku. Mendahului tren pergerakan PPI.'
      },
      {
        name: 'Commodity & Metals Index (CRB Index)',
        nature: 'LEADING',
        relationship: 'Harga tembaga, baja, aluminium, dan komoditas pertanian menentukan biaya input produsen.'
      },
      {
        name: 'Tarif Pengiriman Global & Logistik (Freight Rates)',
        nature: 'LEADING',
        relationship: 'Kenaikan tarif kontainer kapal laut langsung menaikkan biaya input pabrik pada rilis PPI kategori Final Demand.'
      }
    ],
    usdImpactMechanism: 'PPI Naik (> Forecast) → Sinyal tekanan inflasi hulu masih bergejolak → Mengindikasikan CPI bulan depan berisiko naik → USD Menguat (Bullish USD moderat).',
    goldImpactMechanism: 'Emas bereaksi negatif terhadap PPI yang tinggi karena mengikis peluang pemotongan suku bunga The Fed. Namun rentang pergerakan PPI (~$10-$20 pada emas) biasanya separuh dari CPI.',
    marketTransmissionChain: 'PPI Tinggi → Tekanan Biaya Pabrik Naik → Prospek CPI Ikut Naik → DXY Menguat → XAU/USD Tertekan.',
    tradingRules: [
      'Gunakan PPI sebagai konfirmasi arah setelah data CPI rilis.',
      'Jika CPI dan PPI sama-sama "Beat", tren penguatan USD dan tren penurunan Emas akan berlangsung berhari-hari (multi-day trend).'
    ]
  },

  FOMC: {
    newsType: 'FOMC',
    fullName: 'Federal Open Market Committee (Keputusan Suku Bunga & Kebijakan Fed)',
    sourceAuthority: 'Federal Reserve Board of Governors',
    releaseSchedule: '8 kali per tahun (Kamis dini hari 01:00 / 02:00 WIB)',
    relatedIndicators: [
      {
        name: 'Dual Mandate The Fed (NFP + CPI)',
        nature: 'LEADING',
        relationship: 'The Fed secara hukum hanya memiliki 2 mandat: Lapangan Kerja Maksimal (NFP) dan Stabilitas Harga 2% (CPI). Rapat FOMC adalah akumulasi dari kedua data ini.'
      },
      {
        name: 'CME FedWatch Tool (Probabilitas Pasar Suku Bunga)',
        nature: 'LEADING',
        relationship: 'Menghitung ekspektasi pemotongan/kenaikan bunga berdasarkan pasar berjangka Fed Funds. Perubahan probabilitas sebelum rapat menentukan tingkat kejutan pasar.'
      },
      {
        name: 'Dot Plot Projections (Grafik Proyeksi Suku Bunga Anggota Fed)',
        nature: 'COINCIDENT',
        relationship: 'Dirilis setiap 3 bulan (Maret, Juni, September, Desember). Menunjukkan berapa kali Fed berencana memotong/menaikkan bunga dalam 1-3 tahun ke depan.'
      },
      {
        name: 'US Treasury Yield Curve (Kurva Imbal Hasil 2Y vs 10Y)',
        nature: 'COINCIDENT',
        relationship: 'Kenaikan suku bunga mengangkat bagian pendek kurva (2Y yield) dan memperkuat nilai tukar dollar terhadap mata uang dunia.'
      }
    ],
    usdImpactMechanism: 'Suku Bunga Dinaikkan atau Ditahan di Level Tinggi dengan Nada Hawkish → Selisih suku bunga AS (Interest Rate Differential) melebar dibanding mata uang Eropa/Asia → Arus modal masuk ke Dollar → USD Super Bullish.',
    goldImpactMechanism: 'FOMC adalah katalis nomor satu penggerak harga Emas dunia. Pemotongan suku bunga (Dovish Easing) secara historis memicu "Super Bull Market" pada XAU/USD dengan potensi reli $30 - $70 dalam 24 jam.',
    marketTransmissionChain: 'Suku Bunga Fed / Nada Powell → Pergeseran Selisih Bunga Global → Rebalancing Portofolio Triliunan Dollar → Volatilitas Ekstrem pada USD & Emas.',
    tradingRules: [
      'Wajib pahami sistem 2 Fase: Fase 1 (01:00/02:00 WIB rilis angka suku bunga), Fase 2 (30 menit kemudian pidato dan tanya-jawab Jerome Powell).',
      'Seringkali Fase 1 membuat harga melonjak ke satu arah, kemudian pada Fase 2 konferensi pers Powell membalikkan harga ke arah yang berlawanan!'
    ]
  }
};

export const INITIAL_ECONOMIC_RELEASES: EconomicRelease[] = [
  // ==============================================================
  // 1. DATA SUDAH RILIS (TAHUN 2026 - UPDATE SETIAP BULAN)
  // ==============================================================

  // --- OKTOBER 2026: NFP (Data September 2026, Rilis 2 Okt 2026) ---
  {
    id: 'nfp-2026-10',
    type: 'NFP',
    title: 'Non-Farm Employment Change & Unemployment Rate',
    period: 'Data September 2026 (Rilis 2 Okt 2026)',
    releaseDate: '2026-10-02',
    timeWIB: '19:30 WIB',
    impact: 'HIGH',
    status: 'RELEASED',
    components: [
      {
        name: 'Non-Farm Employment Change',
        actual: '238K',
        forecast: '155K',
        previous: '162K',
        revisedPrevious: 'Data Agustus 2026 direvisi dari 148K ke 162K',
        unit: 'K',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Penambahan tenaga kerja baru melonjak tinggi melampaui ekspektasi'
      },
      {
        name: 'Unemployment Rate (Tingkat Pengangguran)',
        actual: '4.0%',
        forecast: '4.2%',
        previous: '4.2%',
        unit: '%',
        betterDirection: 'LOWER_BETTER_FOR_USD',
        description: 'Tingkat pengangguran turun ke 4.0% (angka terendah dalam 6 bulan)'
      },
      {
        name: 'Average Hourly Earnings m/m (Upah Per Jam)',
        actual: '0.4%',
        forecast: '0.3%',
        previous: '0.3%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Tekanan inflasi upah naik 0.4% bulanan'
      }
    ],
    correlation: {
      relatedIndicators: [
        'ADP Employment (212K vs 145K est)',
        'Initial Jobless Claims (turun ke 218K)',
        'ISM Services Employment (52.4 ekspansif)'
      ],
      leadLagRelationship: 'Kenaikan payroll dan upah mendukung pengeluaran konsumsi pribadi (Personal Consumption) kuartal 4.',
      usdImpactSummary: 'BULLISH USD: DXY melesat dari 101.20 ke 102.60 (+140 poin). Sinyal pemangkasan 50 bps Fed langsung gugur.',
      goldImpactSummary: 'BEARISH XAU/USD: Harga emas ambles $42 dari $2,680 ke $2,638 akibat lonjakan imbal hasil obligasi 10-Tahun.',
      marketChain: 'NFP 238K & Pengangguran 4.0% → The Fed tahan suku bunga → Yield US 10-Yr 4.15% → DXY Rally → Emas Jatuh Bebas.'
    },
    summaryNote: 'Data ketenagakerjaan September 2026 menggelegar menghempaskan narasi resesi. EUR/USD anjlok 95 pips, Emas turun tajam.'
  },

  // --- OKTOBER 2026: CPI (Data September 2026, Rilis 14 Okt 2026) ---
  {
    id: 'cpi-2026-10',
    type: 'CPI',
    title: 'Consumer Price Index (CPI & Core CPI)',
    period: 'Data September 2026 (Rilis 14 Okt 2026)',
    releaseDate: '2026-10-14',
    timeWIB: '19:30 WIB',
    impact: 'HIGH',
    status: 'RELEASED',
    components: [
      {
        name: 'CPI y/y (Inflasi Konsumen Tahunan)',
        actual: '2.5%',
        forecast: '2.4%',
        previous: '2.6%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Tingkat inflasi tahunan sedikit di atas proyeksi analis'
      },
      {
        name: 'Core CPI y/y (Inflasi Inti Tahunan)',
        actual: '3.1%',
        forecast: '3.0%',
        previous: '3.1%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Inflasi inti tertahan di 3.1% akibat biaya sewa tempat tinggal'
      },
      {
        name: 'CPI m/m (Inflasi Bulanan)',
        actual: '0.2%',
        forecast: '0.2%',
        previous: '0.2%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD'
      }
    ],
    correlation: {
      relatedIndicators: [
        'PPI Final Demand (1.8% vs 1.7% est)',
        'Harga Minyak Mentah WTI ($78/barel)',
        'Shelter Index (+0.3% MoM)'
      ],
      leadLagRelationship: 'Kenaikan inflasi inti membatasi pelonggaran moneter The Fed menjelang rapat kuartal 4.',
      usdImpactSummary: 'BULLISH USD: Indeks Dollar menguat stabil, menahan resistance harian di 102.80.',
      goldImpactSummary: 'BEARISH XAU/USD: Emas mengalami retest support penting, tertekan $18 pasca-rilis.',
      marketChain: 'Core CPI 3.1% membandel → Target inflasi 2% belum tuntas → The Fed lambat memotong bunga → USD Kuat, Emas Melemah.'
    },
    summaryNote: 'Inflasi inti bertahan di 3.1%, menegaskan The Fed akan memilih pemotongan bertahap 25 bps dibanding pemotongan agresif.'
  },

  // --- OKTOBER 2026: PPI (Data September 2026, Rilis 15 Okt 2026) ---
  {
    id: 'ppi-2026-10',
    type: 'PPI',
    title: 'Producer Price Index (PPI Final Demand)',
    period: 'Data September 2026 (Rilis 15 Okt 2026)',
    releaseDate: '2026-10-15',
    timeWIB: '19:30 WIB',
    impact: 'HIGH',
    status: 'RELEASED',
    components: [
      {
        name: 'PPI Final Demand y/y',
        actual: '1.9%',
        forecast: '1.7%',
        previous: '1.8%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Harga di tingkat produsen naik di atas konsensus'
      },
      {
        name: 'Core PPI y/y (Tanpa Pangan & Energi)',
        actual: '2.6%',
        forecast: '2.4%',
        previous: '2.4%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD'
      }
    ],
    correlation: {
      relatedIndicators: [
        'ISM Manufacturing Prices Paid (54.2)',
        'Biaya Angkut Kontainer Global',
        'CPI Output Forward Projection'
      ],
      leadLagRelationship: 'PPI naik memberi sinyal tekanan biaya manufaktur akan diteruskan ke harga eceran konsumen bulan depan.',
      usdImpactSummary: 'BULLISH USD: Mengonfirmasi data CPI sehari sebelumnya, DXY mempertahankan tren naik.',
      goldImpactSummary: 'BEARISH XAU/USD: Tekanan jual lanjutan sebesar $12 pada Emas.',
      marketChain: 'Input Cost Pabrik Naik → Sinyal Inflasi Hulu Eksis → Fed Bersikap Hati-hati → USD Bullish.'
    },
    summaryNote: 'Biaya produsen naik moderat sejalan dengan harga komoditas industri yang menguat.'
  },

  // --- SEPTEMBER 2026: NFP (Data Agustus 2026, Rilis 4 Sep 2026) ---
  {
    id: 'nfp-2026-09',
    type: 'NFP',
    title: 'Non-Farm Employment Change & Unemployment Rate',
    period: 'Data Agustus 2026 (Rilis 4 Sep 2026)',
    releaseDate: '2026-09-04',
    timeWIB: '19:30 WIB',
    impact: 'HIGH',
    status: 'RELEASED',
    components: [
      {
        name: 'Non-Farm Employment Change',
        actual: '142K',
        forecast: '165K',
        previous: '114K',
        revisedPrevious: 'Data Juli 2026 tetap di 114K',
        unit: 'K',
        betterDirection: 'HIGHER_BETTER_FOR_USD'
      },
      {
        name: 'Unemployment Rate (Tingkat Pengangguran)',
        actual: '4.2%',
        forecast: '4.3%',
        previous: '4.3%',
        unit: '%',
        betterDirection: 'LOWER_BETTER_FOR_USD'
      }
    ],
    correlation: {
      relatedIndicators: [
        'JOLTS Job Openings (turun ke 7.7 Juta)',
        'Klaim Pengangguran Rata-rata 230K'
      ],
      leadLagRelationship: 'Penyerapan tenaga kerja melambat dibandingkan rata-rata awal tahun 2026.',
      usdImpactSummary: 'BEARISH USD: Headline NFP meleset dari forecast, memicu pelemahan Greenback.',
      goldImpactSummary: 'BULLISH XAU/USD: Emas melonjak +$28 menguji level $2,550.',
      marketChain: 'Payroll Melambat → Pasar Price-In Pemotongan Bunga Fed → DXY Melemah → Emas Terbang.'
    },
    summaryNote: 'Payroll meleset membuka spekulasi pemangkasan suku bunga oleh The Fed pada pertemuan September 2026.'
  },

  // --- SEPTEMBER 2026: FOMC (Rilis 17 Sep 2026) ---
  {
    id: 'fomc-2026-09',
    type: 'FOMC',
    title: 'FOMC Rate Decision & Dot Plot Projections',
    period: 'Rapat FOMC September 2026 (Rilis 17 Sep 2026)',
    releaseDate: '2026-09-17',
    timeWIB: '01:00 WIB',
    impact: 'HIGH',
    status: 'RELEASED',
    components: [
      {
        name: 'Federal Funds Target Rate',
        actual: '4.50%',
        forecast: '4.50%',
        previous: '4.75%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'The Fed memotong suku bunga acuan 25 bps ke 4.25%-4.50%'
      },
      {
        name: 'Dot Plot Projections (Suku Bunga Akhir 2026)',
        actual: '4.00%',
        forecast: '4.25%',
        previous: '4.75%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Fed memproyeksikan tambahan 50 bps pemotongan hingga akhir 2026'
      }
    ],
    correlation: {
      relatedIndicators: [
        'CME FedWatch (100% probabilitas cut)',
        'US 2-Yr Treasury Yield (turun ke 3.60%)',
        'Disinflasi CPI 2.5%'
      ],
      leadLagRelationship: 'Siklus pelonggaran likuiditas global resmi berlanjut menopang pertumbuhan ekonomi.',
      usdImpactSummary: 'BEARISH USD: DXY turun dari 101.50 ke 100.40 seiring tertekannya imbal hasil AS.',
      goldImpactSummary: 'BULLISH XAU/USD: Emas mencetak rekor rekor baru (+ $45) menembus $2,650/oz.',
      marketChain: 'Pemotongan Bunga Fed & Proyeksi Dovish → Selisih Bunga Menyusut → USD Dump → Emas & EUR/USD Rally Besar.'
    },
    summaryNote: 'The Fed memotong bunga 25 bps dan memberi sinyal pelonggaran bertahap, memicu reli masif aset lindung nilai Emas.'
  },

  // ==============================================================
  // 2. DATA MENDATANG (UPCOMING - BULAN NOVEMBER & DESEMBER 2026)
  // ==============================================================

  // --- NOVEMBER 2026: FOMC RATE DECISION (Rilis 5 Nov 2026) ---
  {
    id: 'fomc-2026-11',
    type: 'FOMC',
    title: 'FOMC Rate Decision & Policy Statement',
    period: 'Rapat FOMC November 2026 (Rilis 5 Nov 2026)',
    releaseDate: '2026-11-05',
    timeWIB: '02:00 WIB',
    impact: 'HIGH',
    status: 'UPCOMING',
    components: [
      {
        name: 'Federal Funds Target Rate',
        actual: '-',
        forecast: '4.25%',
        previous: '4.50%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Konsensus memperkirakan pemotongan bunga 25 bps'
      }
    ],
    correlation: {
      relatedIndicators: [
        'CME FedWatch Tool (Probabilitas Cut 25 bps saat ini: 88%)',
        'Data NFP Oktober 2026',
        'Data Inflasi CPI Terakhir (3.1% Core)'
      ],
      leadLagRelationship: 'Keputusan ini menjadi patokan arah bunga penutup tahun 2026.',
      usdImpactSummary: 'Jika Fed Hold / Hawkish Cut: USD Menguat tajam. Jika Dovish Cut dengan sinyal cut lanjutan: USD Melemah dalam.',
      goldImpactSummary: 'Emas berpotensi bergerak $35 - $60 pips saat sesi konferensi pers Jerome Powell.',
      marketChain: 'Hasil Rapat Bunga → Konferensi Pers Powell → Arah Baru Tren USD & Emas.'
    },
    summaryNote: 'Fokus pasar tertuju pada apakah Powell memberi sinyal jeda pemotongan (pause) atau pemotongan berlanjut di Desember 2026.'
  },

  // --- NOVEMBER 2026: NFP (Data Oktober 2026, Rilis 6 Nov 2026) ---
  {
    id: 'nfp-2026-11',
    type: 'NFP',
    title: 'Non-Farm Employment Change & Unemployment Rate',
    period: 'Data Oktober 2026 (Rilis 6 Nov 2026)',
    releaseDate: '2026-11-06',
    timeWIB: '19:30 WIB',
    impact: 'HIGH',
    status: 'UPCOMING',
    components: [
      {
        name: 'Non-Farm Employment Change',
        actual: '-',
        forecast: '175K',
        previous: '238K',
        unit: 'K',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Proyeksi penyerapan tenaga kerja normalisasi ke 175K'
      },
      {
        name: 'Unemployment Rate (Tingkat Pengangguran)',
        actual: '-',
        forecast: '4.1%',
        previous: '4.0%',
        unit: '%',
        betterDirection: 'LOWER_BETTER_FOR_USD',
        description: 'Ekspektasi pengangguran naik tipis ke 4.1%'
      },
      {
        name: 'Average Hourly Earnings m/m',
        actual: '-',
        forecast: '0.3%',
        previous: '0.4%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD'
      }
    ],
    correlation: {
      relatedIndicators: [
        'ADP Employment Oktober (Rilis 4 Nov 2026)',
        'Initial Jobless Claims Mingguan (29 Okt & 5 Nov 2026)',
        'ISM Manufacturing Employment (Rilis 2 Nov 2026)'
      ],
      leadLagRelationship: 'Data NFP pertama pasca keputusan suku bunga FOMC November 2026.',
      usdImpactSummary: 'Jika Actual > 200K: BULLISH USD (DXY Breakout 103.00). Jika Actual < 140K: BEARISH USD (DXY Anjlok).',
      goldImpactSummary: 'Jika Payroll Miss tajam, XAU/USD diproyeksikan melonjak $25 - $40 pips menuju rekor baru.',
      marketChain: 'Deviasi Angka Ketenagakerjaan → Reaksi Spontan Algoritma HFT → Arah Lilin Harian Forex.'
    },
    summaryNote: 'Rilis krusial setelah keputusan suku bunga FOMC sehari sebelumnya, rentan memicu volatilitas ganda.'
  },

  // --- NOVEMBER 2026: CPI (Data Oktober 2026, Rilis 12 Nov 2026) ---
  {
    id: 'cpi-2026-11',
    type: 'CPI',
    title: 'Consumer Price Index (CPI & Core CPI)',
    period: 'Data Oktober 2026 (Rilis 12 Nov 2026)',
    releaseDate: '2026-11-12',
    timeWIB: '19:30 WIB',
    impact: 'HIGH',
    status: 'UPCOMING',
    components: [
      {
        name: 'CPI y/y (Inflasi Konsumen Tahunan)',
        actual: '-',
        forecast: '2.4%',
        previous: '2.5%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Target pasar disinflasi berlanjut ke 2.4%'
      },
      {
        name: 'Core CPI y/y (Inflasi Inti Tahunan)',
        actual: '-',
        forecast: '3.0%',
        previous: '3.1%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Ekspektasi inflasi inti menembus ke bawah 3.0%'
      }
    ],
    correlation: {
      relatedIndicators: [
        'Indeks Harga Sewa Rumah (Shelter)',
        'Harga Minyak Mentah Oktober 2026',
        'PPI Oktober 2026 (Rilis 13 Nov 2026)'
      ],
      leadLagRelationship: 'Konfirmasi tren inflasi kuartal 4 yang akan menentukan langkah Fed pada rapat Desember 2026.',
      usdImpactSummary: 'Jika CPI < 2.4%: Tekanan jual berat pada USD (BEARISH USD). Jika CPI > 2.6%: Rally kilat USD.',
      goldImpactSummary: 'Jika Core CPI menyentuh 2.9% atau lebih rendah, Emas diprediksi terbang agresif (BULLISH XAU/USD).',
      marketChain: 'Rilis CPI → Penyesuaian Real Yields Obligasi AS → Reaksi Terbalik Emas & EUR/USD.'
    },
    summaryNote: 'Penentu utama apakah The Fed akan melanjutkan pemotongan suku bunga di rapat FOMC Desember 2026.'
  },

  // --- NOVEMBER 2026: PPI (Data Oktober 2026, Rilis 13 Nov 2026) ---
  {
    id: 'ppi-2026-11',
    type: 'PPI',
    title: 'Producer Price Index (PPI Final Demand)',
    period: 'Data Oktober 2026 (Rilis 13 Nov 2026)',
    releaseDate: '2026-11-13',
    timeWIB: '19:30 WIB',
    impact: 'HIGH',
    status: 'UPCOMING',
    components: [
      {
        name: 'PPI Final Demand y/y',
        actual: '-',
        forecast: '1.7%',
        previous: '1.9%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD'
      },
      {
        name: 'Core PPI y/y',
        actual: '-',
        forecast: '2.4%',
        previous: '2.6%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD'
      }
    ],
    correlation: {
      relatedIndicators: [
        'CPI Oktober (Rilis sehari sebelumnya)',
        'Indeks Komoditas Pabrikan AS',
        'Biaya Logistik & Rantai Pasok'
      ],
      leadLagRelationship: 'Leading indicator untuk proyeksi CPI bulan November dan Desember 2026.',
      usdImpactSummary: 'Dampak volatilitas ~30-50 pips pada USD. Mengonfirmasi arah tren dari rilis CPI.',
      goldImpactSummary: 'Emas merespons moderat ($10 - $20 rentang harga).',
      marketChain: 'Biaya Input Pabrik → Konfirmasi Disinflasi Hulu → Pengaruh Sentimen Bunga Fed.'
    },
    summaryNote: 'Rilis pelengkap untuk membaca kesehatan rantai pasok industri dan biaya produksi di Amerika Serikat.'
  },

  // --- DESEMBER 2026: FOMC RATE DECISION & DOT PLOT (Rilis 17 Des 2026) ---
  {
    id: 'fomc-2026-12',
    type: 'FOMC',
    title: 'FOMC Rate Decision & Economic Projections (Dot Plot 2027)',
    period: 'Rapat FOMC Akhir Tahun 2026 (Rilis 17 Des 2026)',
    releaseDate: '2026-12-17',
    timeWIB: '02:00 WIB',
    impact: 'HIGH',
    status: 'UPCOMING',
    components: [
      {
        name: 'Federal Funds Target Rate',
        actual: '-',
        forecast: '4.00%',
        previous: '4.25%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
        description: 'Penetapan suku bunga akhir tahun 2026 dan proyeksi Dot Plot 2027'
      }
    ],
    correlation: {
      relatedIndicators: [
        'Dot Plot Projections Tahun 2027',
        'Proyeksi Pertumbuhan GDP & Pengangguran Fed (SEP)',
        'Rilis NFP & CPI November 2026'
      ],
      leadLagRelationship: 'Menentukan panduan kebijakan moneter (Forward Guidance) untuk sepanjang tahun 2027.',
      usdImpactSummary: 'Penentu tren jangka panjang USD memasuki awal tahun 2027.',
      goldImpactSummary: 'Volatilitas maksimum ($50 - $100 pips) dengan potensi breakout tren tahunan baru.',
      marketChain: 'Dot Plot 2027 → Penyesuaian Valuasi Aset Global → Tren Jangka Panjang DXY & Logam Mulia.'
    },
    summaryNote: 'Rapat terbesar akhir tahun 2026 dengan rilis Summary of Economic Projections (SEP) dan Dot Plot untuk tahun 2027.'
  }
];

export const EDUCATIONAL_RULES = [
  {
    id: 'rule-nfp',
    newsType: 'NFP (Non-Farm Payrolls)',
    frequency: 'Jumat pertama setiap bulan (19:30 / 20:30 WIB)',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    marketWeight: 'Sangat Tinggi (Paling Volatil)',
    typicalPips: '70 - 150 Pips',
    biasRule: 'Actual > Forecast & Pengangguran Turun -> BULLISH USD (Sell EURUSD, XAUUSD). Actual < Forecast & Pengangguran Naik -> BEARISH USD (Buy EURUSD, XAUUSD).',
    mechanics: 'Pasar tenaga kerja adalah roda penggerak konsumsi ekonomi AS (~70% GDP). Jika payroll tinggi, daya beli kuat -> inflasi bisa naik -> The Fed menahan suku bunga tinggi -> USD kuat.',
    pitfall: 'Konflik Data: Sering kali NFP hijau (beat) tapi Unemployment naik (merah). Di menit pertama algoritma mengejar headline NFP, namun 15 menit kemudian pasar berbalik arah mengikuti pengangguran & upah!'
  },
  {
    id: 'rule-cpi',
    newsType: 'CPI (Consumer Price Index)',
    frequency: 'Pertengahan bulan, tanggal 10-14 (19:30 / 20:30 WIB)',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    marketWeight: 'Maksimum (Penentu Arah Moneter)',
    typicalPips: '80 - 180 Pips',
    biasRule: 'Actual > Forecast -> BULLISH USD (Emas jatuh tajam). Actual < Forecast -> BEARISH USD (Emas melonjak kencang).',
    mechanics: 'Mandat utama The Fed adalah inflasi 2.0%. Angka CPI yang panas langsung mengubah kalkulasi "Fed Rate Cut Probability" seketika, menggerakkan imbal hasil obligasi US 10-Year.',
    pitfall: 'Perhatikan "Core CPI" (tanpa minyak & pangan). Jika Headline turun karena harga bensin murah tapi Core naik karena sewa rumah & asuransi, The Fed tetap bersikap Hawkish.'
  },
  {
    id: 'rule-ppi',
    newsType: 'PPI (Producer Price Index)',
    frequency: 'Sehari setelah CPI rilis (19:30 / 20:30 WIB)',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    marketWeight: 'Tinggi (Leading Indicator CPI)',
    typicalPips: '35 - 75 Pips',
    biasRule: 'Actual > Forecast -> BULLISH USD. Actual < Forecast -> BEARISH USD.',
    mechanics: 'PPI mengukur inflasi di tingkat grosir/pabrik. Kenaikan harga di tingkat pabrik akan diteruskan ke harga jual ritel konsumen 1-2 bulan kemudian. Jadi PPI adalah bocoran masa depan CPI.',
    pitfall: 'Volatilitas biasanya separuh dari CPI. Hindari over-leveraging karena reaksi PPI lebih cepat mereda dan harga kembali ke level teknikal sebelumnya.'
  },
  {
    id: 'rule-fomc',
    newsType: 'FOMC (Federal Open Market Committee)',
    frequency: '8 kali per tahun (biasanya Kamis dini hari 01:00 / 02:00 WIB)',
    source: 'Federal Reserve Board of Governors',
    marketWeight: 'Tertinggi (Fondasi Tren Jangka Menengah)',
    typicalPips: '100 - 250 Pips',
    biasRule: 'Rate Naik / Hawkish Statement / Dot Plot Naik -> BULLISH USD. Rate Turun / Dovish Statement / Proyeksi Cut Agresif -> BEARISH USD.',
    mechanics: 'The Fed menentukan suku bunga acuan global. Selisih bunga (interest rate differential) menentukan ke mana triliunan dollar dana institusi global mengalir.',
    pitfall: 'Dua Babak: Pukul 01:00 WIB rilis statement (Bunga). Pukul 01:30 WIB konferensi pers Jerome Powell. Sering terjadi fakeout di babak pertama lalu arah berbalik 180 derajat di babak kedua!'
  }
];

export const PAIRS_LIST = [
  { symbol: 'DXY', name: 'US Dollar Index', baseRelation: 'DIRECT', note: 'Mengukur kekuatan USD terhadap 6 mata uang utama dunia (terutama Euro 57.6%)' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', baseRelation: 'INVERSE', note: 'Pasangan forex paling likuid di dunia; bergerak terbalik terhadap USD' },
  { symbol: 'GBP/USD', name: 'Great Britain Pound / USD', baseRelation: 'INVERSE', note: 'Volatilitas seringkali lebih besar daripada EUR/USD (kabel/cable)' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', baseRelation: 'DIRECT', note: 'Sangat sensitif terhadap imbal hasil (yield) obligasi US Treasury 10-Year' },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar (Emas)', baseRelation: 'INVERSE', note: 'Aset lindung nilai tanpa imbal hasil; sangat sensitif terhadap suku bunga riil & CPI' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', baseRelation: 'DIRECT', note: 'Dipengaruhi oleh USD dan korelasi harga minyak mentah komoditas Kanada' }
];
