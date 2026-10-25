import { NewsType, NewsComponent, BiasResult, PairImpact, BiasDirection, BiasStrength } from '../types/forex';

export interface EvaluationInput {
  type: NewsType;
  components: NewsComponent[];
  fomcTone?: 'HAWKISH' | 'DOVISH' | 'NEUTRAL';
  rateChangeBps?: number; // e.g. -25, -50, 0, +25
}

function parseNum(val: number | string): number {
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function evaluateNewsBias(input: EvaluationInput): BiasResult {
  const { type, components, fomcTone, rateChangeBps } = input;

  if (type === 'FOMC') {
    return evaluateFOMC(components, fomcTone, rateChangeBps);
  }

  if (type === 'NFP') {
    return evaluateNFP(components);
  }

  if (type === 'CPI') {
    return evaluateCPI(components);
  }

  // Default: PPI
  return evaluatePPI(components);
}

function evaluateNFP(components: NewsComponent[]): BiasResult {
  const nfpComp = components.find(c => 
    c.name.toLowerCase().includes('employment') || 
    c.name.toLowerCase().includes('payroll') ||
    c.name.toLowerCase().includes('nfp')
  ) || components[0];
  const unempComp = components.find(c => c.name.toLowerCase().includes('unemployment') || c.name.toLowerCase().includes('pengangguran'));
  const wageComp = components.find(c => c.name.toLowerCase().includes('wage') || c.name.toLowerCase().includes('earning') || c.name.toLowerCase().includes('upah'));

  const nfpActual = nfpComp ? parseNum(nfpComp.actual) : 0;
  const nfpForecast = nfpComp ? parseNum(nfpComp.forecast) : 0;
  const nfpPrev = nfpComp ? parseNum(nfpComp.previous) : 0;

  const unempActual = unempComp ? parseNum(unempComp.actual) : 0;
  const unempForecast = unempComp ? parseNum(unempComp.forecast) : 0;
  const unempPrev = unempComp ? parseNum(unempComp.previous) : 0;

  const wageActual = wageComp ? parseNum(wageComp.actual) : 0;
  const wageForecast = wageComp ? parseNum(wageComp.forecast) : 0;

  const nfpBeatForecast = nfpActual > nfpForecast;
  const nfpBeatPrev = nfpActual > nfpPrev;
  const unempBetterForecast = unempComp ? unempActual < unempForecast : true;
  const unempBetterPrev = unempComp ? unempActual <= unempPrev : true;

  let usdDirection: BiasDirection = 'NEUTRAL';
  let strength: BiasStrength = 'MODERATE';
  let headlineReason = '';
  const detailedPoints: string[] = [];

  const nfpDeltaForecast = nfpActual - nfpForecast;
  const nfpDeltaPrev = nfpActual - nfpPrev;
  const deltaPrevStr = nfpDeltaPrev >= 0 ? `+${nfpDeltaPrev}K` : `${nfpDeltaPrev}K`;

  if (nfpBeatForecast && unempBetterForecast) {
    usdDirection = 'BULLISH';
    strength = Math.abs(nfpDeltaForecast) >= 40 ? 'STRONG' : 'MODERATE';
    headlineReason = `Pasar tenaga kerja sangat solid (${nfpActual}K vs estimasi ${nfpForecast}K) dan pengangguran membaik. The Fed tidak terdesak memangkas suku bunga terburu-buru, mendorong penguatan DXY.`;
    
    detailedPoints.push(
      `Non-Farm Payrolls melampaui forecast sebesar ${nfpDeltaForecast > 0 ? '+' : ''}${nfpDeltaForecast}K dan ${deltaPrevStr} dibandingkan bulan sebelumnya (${nfpPrev}K).`,
      unempComp ? `Tingkat Pengangguran terkendali di ${unempActual}% (vs konsensus ${unempForecast}% dan sebelumnya ${unempPrev}%).` : 'Kondisi ketenagakerjaan stabil.',
      wageComp ? `Upah rata-rata per jam di ${wageActual}% (konsensus ${wageForecast}%) mencerminkan tekanan inflasi upah yang terukur.` : 'Sektor riil menunjukkan ketahanan tinggi.'
    );
  } else if (!nfpBeatForecast && !unempBetterForecast) {
    usdDirection = 'BEARISH';
    strength = Math.abs(nfpDeltaForecast) >= 40 ? 'STRONG' : 'MODERATE';
    headlineReason = `Sektor tenaga kerja melemah di bawah konsensus (${nfpActual}K vs ${nfpForecast}K) disertai kenaikan pengangguran. Ekspektasi pelonggaran moneter The Fed meningkat, menekan DXY.`;
    
    detailedPoints.push(
      `Penyerapan tenaga kerja turun signifikan menjadi ${nfpActual}K, jauh di bawah konsensus ${nfpForecast}K dan bulan lalu (${nfpPrev}K).`,
      unempComp ? `Tingkat Pengangguran naik menjadi ${unempActual}% (melebihi estimasi ${unempForecast}% dan bulan lalu ${unempPrev}%).` : 'Pasar tenaga kerja mendingin.',
      'Pelemahan ini membuka peluang pemangkasan suku bunga Fed yang lebih agresif, menekan yield Treasury AS.'
    );
  } else {
    // Mixed signals
    usdDirection = nfpBeatForecast ? 'BULLISH' : 'BEARISH';
    strength = 'MIXED';
    headlineReason = `Data NFP kontradiktif: Payroll ${nfpBeatForecast ? 'melampaui ekspektasi' : 'di bawah ekspektasi'}, namun Tingkat Pengangguran ${unempBetterForecast ? 'membaik' : 'justru naik'}. Pergerakan rawan 'spike' awal lalu berbalik (reversal).`;

    detailedPoints.push(
      `Headline NFP berada di ${nfpActual}K (vs forecast ${nfpForecast}K), ${nfpBeatPrev ? 'naik' : 'turun'} dari bulan sebelumnya (${nfpPrev}K).`,
      unempComp ? `Tingkat pengangguran berada di ${unempActual}% (vs estimasi ${unempForecast}% dan sebelumnya ${unempPrev}%).` : 'Sinyal bertentangan pada komponen data.',
      'Pasar biasanya merespons angka headline NFP di 1-3 menit pertama, lalu mengevaluasi detail pengangguran & upah untuk arah penutupan lilin M15/M30.'
    );
  }

  const pairsImpact = generatePairImpacts(usdDirection, strength, 'NFP');

  return {
    newsType: 'NFP',
    usdDirection,
    strength,
    headlineReason,
    detailedPoints,
    pairsImpact,
    marketMechanics: 'NFP mengukur kesehatan fundamental ekonomi AS. Lapangan kerja yang kuat menopang konsumsi domestik dan inflasi, memungkinkan suku bunga tetap tinggi (USD Bullish). Sebaliknya pelemahan memicu kekhawatiran resesi dan ekspektasi pemotongan suku bunga (USD Bearish).',
    tradingRecommendation: strength === 'MIXED'
      ? 'Waspadai false breakout dan pelebaran spread di menit 0-5. Tunggu pembentukan higher high / lower low di timeframe M15 sebelum entri.'
      : 'Ikuti arah bias utama setelah lonjakan awal (spike) teruji. Cari entri saat harga retest level support/resistance M5 pasca-reaksi pertama.'
  };
}

function evaluateCPI(components: NewsComponent[]): BiasResult {
  const cpiYoy = components.find(c => c.name.toLowerCase().includes('y/y') || c.name.toLowerCase().includes('yoy')) || components[0];
  const cpiMom = components.find(c => c.name.toLowerCase().includes('m/m') || c.name.toLowerCase().includes('mom'));
  const coreYoy = components.find(c => c.name.toLowerCase().includes('core') && (c.name.toLowerCase().includes('y/y') || c.name.toLowerCase().includes('yoy')));

  const actual = cpiYoy ? parseNum(cpiYoy.actual) : 0;
  const forecast = cpiYoy ? parseNum(cpiYoy.forecast) : 0;
  const prev = cpiYoy ? parseNum(cpiYoy.previous) : 0;

  const diffForecast = actual - forecast;
  const diffPrev = actual - prev;

  let usdDirection: BiasDirection = 'NEUTRAL';
  let strength: BiasStrength = 'MODERATE';
  let headlineReason = '';
  const detailedPoints: string[] = [];

  if (diffForecast > 0.05 || (diffForecast >= 0 && diffPrev > 0.1)) {
    usdDirection = 'BULLISH';
    strength = diffForecast >= 0.2 ? 'STRONG' : 'MODERATE';
    headlineReason = `Inflasi konsumen rilis lebih tinggi dari estimasi (${actual}% vs ${forecast}%). Inflasi yang membandel memaksa The Fed menahan suku bunga tinggi, memicu rally US Dollar & pelemahan Emas.`;
    
    detailedPoints.push(
      `CPI YoY berada di level ${actual}%, melampaui konsensus analis (${forecast}%) serta ${diffPrev >= 0 ? 'naik dari' : 'relatif terhadap'} bulan sebelumnya (${prev}%).`,
      coreYoy ? `Core CPI berada di ${coreYoy.actual}% (forecast: ${coreYoy.forecast}%), menegaskan tekanan harga di sektor jasa masih lengket.` : 'Tekanan harga konsumen terbukti resilien.',
      'Imbal hasil obligasi US Treasury 10-tahun naik, memberikan yield advantage signifikan bagi USD atas mata uang mayor lainnya.'
    );
  } else if (diffForecast < -0.05 || (diffForecast <= 0 && diffPrev < -0.1)) {
    usdDirection = 'BEARISH';
    strength = diffForecast <= -0.2 ? 'STRONG' : 'MODERATE';
    headlineReason = `Inflasi konsumen mendingin di bawah ekspektasi pasar (${actual}% vs ${forecast}%). Tekanan disinflasi memperkuat alasan pemangkasan suku bunga Fed, melemahkan DXY.`;
    
    detailedPoints.push(
      `CPI YoY tercatat ${actual}%, melandai di bawah proyeksi pasar ${forecast}% dan turun dari periode lalu (${prev}%).`,
      coreYoy ? `Core CPI turun menjadi ${coreYoy.actual}%, mencerminkan berkurangnya tekanan inflasi inti.` : 'Tren disinflasi berjalan sesuai harapan The Fed.',
      'Emas (XAU/USD) dan pasangan mata uang non-USD (EUR, GBP) mendapatkan momentum penguatan tajam karena biaya peluang bunga memudar.'
    );
  } else {
    usdDirection = diffForecast >= 0 ? 'BULLISH' : 'BEARISH';
    strength = 'MODERATE';
    headlineReason = `Angka CPI keluar inline atau mendekati proyeksi pasar (${actual}% vs ${forecast}%). Pasar mencerna dinamika bulanan (${cpiMom ? cpiMom.actual : 'MoM'}), volatilitas cenderung bersifat technical whipsaw.`;
    
    detailedPoints.push(
      `Realisasi CPI ${actual}% hampir sejalan dengan proyeksi konsensus ${forecast}%, dengan selisih minimal terhadap bulan lalu (${prev}%).`,
      'Karena minim kejutan makro, pergerakan harga bergantung pada reaksi level teknikal utama dan ekspektasi rapat FOMC berikutnya.'
    );
  }

  const pairsImpact = generatePairImpacts(usdDirection, strength, 'CPI');

  return {
    newsType: 'CPI',
    usdDirection,
    strength,
    headlineReason,
    detailedPoints,
    pairsImpact,
    marketMechanics: 'CPI adalah metrik inflasi paling diperhatikan pasar finansial. Deviasi 0.1% - 0.2% saja dari konsensus sudah cukup menggeser ekspektasi kurva suku bunga The Fed puluhan basis poin dalam hitungan menit.',
    tradingRecommendation: 'CPI sering menghasilkan false spike di candle 1-menit pertama karena eksekusi algoritma HFT. Rekomendasi terbaik: tunggu candle M5 ditutup untuk mengonfirmasi arah dominan.'
  };
}

function evaluatePPI(components: NewsComponent[]): BiasResult {
  const ppiYoy = components.find(c => c.name.toLowerCase().includes('y/y') || c.name.toLowerCase().includes('yoy')) || components[0];
  const ppiMom = components.find(c => c.name.toLowerCase().includes('m/m') || c.name.toLowerCase().includes('mom'));

  const actual = ppiYoy ? parseNum(ppiYoy.actual) : 0;
  const forecast = ppiYoy ? parseNum(ppiYoy.forecast) : 0;
  const prev = ppiYoy ? parseNum(ppiYoy.previous) : 0;

  const diffForecast = actual - forecast;
  const diffPrev = actual - prev;

  let usdDirection: BiasDirection = 'NEUTRAL';
  let strength: BiasStrength = 'MODERATE';
  let headlineReason = '';
  const detailedPoints: string[] = [];

  if (diffForecast > 0.05 || (diffForecast >= 0 && diffPrev > 0.1)) {
    usdDirection = 'BULLISH';
    strength = diffForecast >= 0.3 ? 'STRONG' : 'MODERATE';
    headlineReason = `Inflasi produsen (PPI) naik di atas konsensus (${actual}% vs ${forecast}%). Kenaikan biaya produksi adalah sinyal awal bahwa inflasi konsumen (CPI) berisiko menyusul naik, mendukung USD.`;
    
    detailedPoints.push(
      `PPI tercatat ${actual}%, lebih tinggi dari estimasi ${forecast}% dan bulan sebelumnya (${prev}%).`,
      ppiMom ? `Pertumbuhan bulanan (MoM) di ${ppiMom.actual}% menegaskan akselerasi biaya rantai pasok industri AS.` : 'Biaya input manufaktur & jasa meningkat.',
      'Sinyal inflasi hulu ini meredam ekspektasi pelonggaran moneter agresif oleh Federal Reserve.'
    );
  } else if (diffForecast < -0.05 || (diffForecast <= 0 && diffPrev < -0.1)) {
    usdDirection = 'BEARISH';
    strength = diffForecast <= -0.3 ? 'STRONG' : 'MODERATE';
    headlineReason = `Biaya produksi tingkat pabrik (PPI) mendingin di bawah perkiraan (${actual}% vs ${forecast}%). Sinyal disinflasi hulu memberi ruang The Fed untuk melonggarkan kebijakan, menekan USD.`;
    
    detailedPoints.push(
      `PPI rilis di level ${actual}%, berada di bawah konsensus analis (${forecast}%) dan periode sebelumnya (${prev}%).`,
      'Penurunan biaya input produsen mengindikasikan tekanan harga ke konsumen pada bulan-bulan mendatang akan ikut mereda.',
      'Pasar obligasi merespons positif dengan penurunan imbal hasil, melemahkan indeks Dollar AS (DXY).'
    );
  } else {
    usdDirection = diffForecast >= 0 ? 'BULLISH' : 'BEARISH';
    strength = 'MODERATE';
    headlineReason = `Realisasi PPI berada di kisaran estimasi (${actual}% vs ${forecast}%). Dampak terhadap pasar biasanya lebih moderat dibanding CPI, kecuali terjadi deviasi ekstrem.`;
    
    detailedPoints.push(
      `Data PPI relatif sejalan dengan konsensus pasar (${actual}% vs ${forecast}%).`,
      'Dampak volatilitas biasanya berkisar 25-50 pips dan pergerakan lebih cepat kembali ke tren teknikal yang ada.'
    );
  }

  const pairsImpact = generatePairImpacts(usdDirection, strength, 'PPI');

  return {
    newsType: 'PPI',
    usdDirection,
    strength,
    headlineReason,
    detailedPoints,
    pairsImpact,
    marketMechanics: 'PPI adalah indikator leading bagi CPI karena produsen biasanya mengalihkan kenaikan biaya produksi kepada konsumen akhir dengan jeda waktu 1-2 bulan.',
    tradingRecommendation: 'Volatilitas PPI biasanya separuh dari CPI. Cocok untuk strategi momentum singkat atau konfirmasi arah swing bila sejalan dengan data CPI terakhir.'
  };
}

function evaluateFOMC(
  components: NewsComponent[],
  tone: 'HAWKISH' | 'DOVISH' | 'NEUTRAL' = 'NEUTRAL',
  rateChangeBps: number = 0
): BiasResult {
  const rateComp = components.find(c => c.name.toLowerCase().includes('rate') || c.name.toLowerCase().includes('target') || c.name.toLowerCase().includes('bunga')) || components[0];
  const rateActual = rateComp ? parseNum(rateComp.actual) : 5.0;
  const rateForecast = rateComp ? parseNum(rateComp.forecast) : 5.0;
  const ratePrev = rateComp ? parseNum(rateComp.previous) : 5.0;

  let usdDirection: BiasDirection = 'NEUTRAL';
  let strength: BiasStrength = 'STRONG';
  let headlineReason = '';
  const detailedPoints: string[] = [];

  const rateDiff = rateActual - rateForecast;
  const rateDiffPrev = rateActual - ratePrev;

  if (rateChangeBps > 0 || rateDiff > 0 || (rateDiff === 0 && tone === 'HAWKISH')) {
    usdDirection = 'BULLISH';
    strength = 'STRONG';
    headlineReason = `Kebijakan FOMC condong Hawkish: ${rateChangeBps > 0 ? `Suku bunga dinaikkan ${rateChangeBps} bps` : `The Fed mempertahankan suku bunga di ${rateActual}% dengan retorika waspada terhadap inflasi`}. USD menguat signifikan.`;
    
    detailedPoints.push(
      `Tingkat suku bunga Fed Funds Target dipertahankan/dinaikkan ke ${rateActual}% (sebelumnya ${ratePrev}%).`,
      'Pernyataan The Fed menekankan perlunya menjaga suku bunga di level restriktif lebih lama guna memastikan inflasi kembali ke target 2%.',
      'Dot plot dan panduan ke depan (forward guidance) membatasi peluang pemangkasan bunga dalam waktu dekat, mendorong penguatan DXY.'
    );
  } else if (rateChangeBps < -25 || rateDiff < 0 || (rateDiff === 0 && tone === 'DOVISH')) {
    usdDirection = 'BEARISH';
    strength = 'STRONG';
    headlineReason = `Keputusan FOMC bernada Dovish: ${rateChangeBps < 0 ? `The Fed memangkas suku bunga ${Math.abs(rateChangeBps)} bps` : `The Fed memberi sinyal pelonggaran suku bunga yang lebih agresif`} akibat pelemahan pasar tenaga kerja. USD tertekan.`;
    
    detailedPoints.push(
      `Suku bunga acuan berada di ${rateActual}%, mencerminkan langkah The Fed ${rateDiffPrev < 0 ? `memotong suku bunga sebesar ${Math.abs(Math.round(rateDiffPrev * 100))} bps` : 'mengantisipasi siklus pemotongan'}.`,
      'Jerome Powell menegaskan fokus pada perlambatan ketenagakerjaan dan kemajuan disinflasi.',
      'Pasar merespons dengan penurunan imbal hasil obligasi AS dan reli besar pada Emas (XAU/USD) serta pasangan mata uang lawan USD.'
    );
  } else {
    usdDirection = 'NEUTRAL';
    strength = 'MODERATE';
    headlineReason = `FOMC memutuskan suku bunga ${rateActual}% sesuai ekspektasi dengan nada pernyataan netral/berimbang. Arah selanjutnya ditentukan oleh konferensi pers Jerome Powell.`;
    
    detailedPoints.push(
      `Keputusan suku bunga ${rateActual}% tidak memberikan kejutan langsung terhadap harga pasar.`,
      'Pergerakan mata uang akan ditentukan oleh tanya-jawab konferensi pers Ketua The Fed (pukul 02:00 WIB / 14:30 EST).',
      'Waspadai perubahan arah mendadak saat sesi Q&A berlangsung.'
    );
  }

  const pairsImpact = generatePairImpacts(usdDirection, strength, 'FOMC');

  return {
    newsType: 'FOMC',
    usdDirection,
    strength,
    headlineReason,
    detailedPoints,
    pairsImpact,
    marketMechanics: 'FOMC adalah penentu arah suku bunga dasar ekonomi terbesar di dunia. Seluruh aliran modal global menyesuaikan diri berdasarkan selisih bunga (interest rate differential) yang diputuskan oleh The Fed.',
    tradingRecommendation: 'Sesi FOMC memiliki 2 fase: Fase 1 (Rilis Pernyataan Bunga pukul 01:30/02:00 WIB) dan Fase 2 (Konferensi Pers Powell 30 menit kemudian). Sering terjadi pembalikan arah 180 derajat di Fase 2.'
  };
}

function generatePairImpacts(
  usdDir: BiasDirection,
  strength: BiasStrength,
  newsType: NewsType
): PairImpact[] {
  const pipsMultiplier = newsType === 'NFP' ? 1.0 : newsType === 'CPI' ? 1.2 : newsType === 'FOMC' ? 1.5 : 0.6;
  
  const getRange = (baseLow: number, baseHigh: number) => {
    const low = Math.round(baseLow * pipsMultiplier);
    const high = Math.round(baseHigh * pipsMultiplier);
    return `${low} - ${high} Pips`;
  };

  if (usdDir === 'BULLISH') {
    return [
      {
        pair: 'DXY',
        bias: 'BUY',
        directionText: 'Bullish',
        reasoning: 'Indeks Dollar AS menguat didukung ekspektasi suku bunga tinggi dan imbal hasil Treasury naik.',
        expectedPips: getRange(40, 80)
      },
      {
        pair: 'EUR/USD',
        bias: 'SELL',
        directionText: 'Bearish',
        reasoning: 'Kenaikan USD menekan mata uang Euro. Tekanan jual meningkat pada level resisten utama.',
        expectedPips: getRange(50, 90)
      },
      {
        pair: 'GBP/USD',
        bias: 'SELL',
        directionText: 'Bearish',
        reasoning: 'Sterling tertekan aksi beli dollar. Volatilitas biasanya lebih lebar dibanding EUR/USD.',
        expectedPips: getRange(60, 110)
      },
      {
        pair: 'USD/JPY',
        bias: 'BUY',
        directionText: 'Bullish',
        reasoning: 'Korelasi kuat dengan US 10-Yr Yields; pelebaran selisih suku bunga US-Jepang memicu lonjakan pair ini.',
        expectedPips: getRange(70, 140)
      },
      {
        pair: 'XAU/USD',
        bias: 'SELL',
        directionText: 'Bearish',
        reasoning: 'Emas tanpa imbal hasil (non-yielding asset) menjadi kurang menarik saat yield obligasi dan dollar menguat.',
        expectedPips: getRange(100, 220)
      },
      {
        pair: 'USD/CAD',
        bias: 'BUY',
        directionText: 'Bullish',
        reasoning: 'Kekuatan greenback mendorong pair naik, dipengaruhi juga oleh sentimen harga minyak mentah.',
        expectedPips: getRange(40, 80)
      }
    ];
  } else if (usdDir === 'BEARISH') {
    return [
      {
        pair: 'DXY',
        bias: 'SELL',
        directionText: 'Bearish',
        reasoning: 'Indeks Dollar melemah akibat penurunan ekspektasi suku bunga dan pelemahan yield obligasi.',
        expectedPips: getRange(40, 80)
      },
      {
        pair: 'EUR/USD',
        bias: 'BUY',
        directionText: 'Bullish',
        reasoning: 'Euro menguat tajam saat arus modal keluar dari aset berdenominasi dollar AS.',
        expectedPips: getRange(50, 90)
      },
      {
        pair: 'GBP/USD',
        bias: 'BUY',
        directionText: 'Bullish',
        reasoning: 'Peluang buy momentum terbuka seiring pelemahan USD, menguji level resistance intraday.',
        expectedPips: getRange(60, 110)
      },
      {
        pair: 'USD/JPY',
        bias: 'SELL',
        directionText: 'Bearish',
        reasoning: 'Penurunan yield US 10-Yr memicu penutupan posisi carry trade, mendorong apresiasi Yen.',
        expectedPips: getRange(70, 140)
      },
      {
        pair: 'XAU/USD',
        bias: 'BUY',
        directionText: 'Bullish',
        reasoning: 'Pelemahan dollar dan turunnya imbal hasil riil menjadi katalis bullish terkuat untuk Emas.',
        expectedPips: getRange(100, 220)
      },
      {
        pair: 'USD/CAD',
        bias: 'SELL',
        directionText: 'Bearish',
        reasoning: 'Penjualan USD mendorong koreksi turun pada pasangan USD/CAD.',
        expectedPips: getRange(40, 80)
      }
    ];
  }

  // Neutral
  return [
    {
      pair: 'DXY',
      bias: 'NEUTRAL',
      directionText: 'Netral / Sideway',
      reasoning: 'Pasar berada di zona konsolidasi menunggu konfirmasi katalis berikutnya.',
      expectedPips: getRange(20, 40)
    },
    {
      pair: 'EUR/USD',
      bias: 'NEUTRAL',
      directionText: 'Netral / Sideway',
      reasoning: 'Pergerakan bolak-balik dalam range support dan resistance harian.',
      expectedPips: getRange(25, 45)
    },
    {
      pair: 'GBP/USD',
      bias: 'NEUTRAL',
      directionText: 'Netral / Sideway',
      reasoning: 'Volatilitas dua arah tanpa breakout berkelanjutan.',
      expectedPips: getRange(30, 50)
    },
    {
      pair: 'USD/JPY',
      bias: 'NEUTRAL',
      directionText: 'Netral / Sideway',
      reasoning: 'Yields AS bergerak datar, pair cenderung sideway.',
      expectedPips: getRange(35, 60)
    },
    {
      pair: 'XAU/USD',
      bias: 'NEUTRAL',
      directionText: 'Netral / Sideway',
      reasoning: 'Emas berkonsolidasi di range ketat, menunggu tren yang lebih jelas.',
      expectedPips: getRange(50, 100)
    },
    {
      pair: 'USD/CAD',
      bias: 'NEUTRAL',
      directionText: 'Netral / Sideway',
      reasoning: 'Keseimbangan antara sentimen komoditas dan stabilitas dollar.',
      expectedPips: getRange(20, 40)
    }
  ];
}

/**
 * Otomatis menyimpulkan agregasi seluruh data kalender ekonomi menjadi satu kesimpulan makro komprehensif
 */
export function calculateAggregateMacroSentiment(
  releases: { type: NewsType; components: NewsComponent[]; status?: string }[]
) {
  // Hanya simpulkan event yang sudah ada data atau memiliki nilai actual
  const evaluatedList = releases.map(rel => {
    return {
      release: rel,
      bias: evaluateNewsBias({ type: rel.type, components: rel.components })
    };
  });

  let bullishCount = 0;
  let bearishCount = 0;
  let neutralCount = 0;

  const drivers: string[] = [];

  for (const item of evaluatedList) {
    if (item.bias.usdDirection === 'BULLISH') {
      bullishCount++;
      drivers.push(`${item.release.type}: ${item.bias.headlineReason}`);
    } else if (item.bias.usdDirection === 'BEARISH') {
      bearishCount++;
      drivers.push(`${item.release.type}: ${item.bias.headlineReason}`);
    } else {
      neutralCount++;
    }
  }

  const total = bullishCount + bearishCount + neutralCount || 1;
  const bullishPct = Math.round((bullishCount / total) * 100);
  const bearishPct = Math.round((bearishCount / total) * 100);

  let overallUsdDirection: BiasDirection = 'NEUTRAL';
  let overallStrength: BiasStrength = 'MODERATE';
  let executiveSummary = '';
  let recommendedAction = '';

  if (bullishCount > bearishCount) {
    overallUsdDirection = 'BULLISH';
    overallStrength = bullishCount >= bearishCount + 2 ? 'STRONG' : 'MODERATE';
    executiveSummary = `Kesimpulan Otomatis: Mayoritas data ekonomi AS (${bullishCount} dari ${total} indikator rilis) mencerminkan kondisi ekonomi dan inflasi yang solid di atas ekspektasi. Fundamental ini mendorong imbal hasil obligasi AS naik dan menahan suku bunga The Fed tetap restriktif, memberikan bias penguatan (Bullish) bagi US Dollar.`;
    recommendedAction = 'Fokus pada peluang Sell EUR/USD, GBP/USD, dan Emas (XAU/USD). Cari peluang Buy pada USD/JPY di area support retracement.';
  } else if (bearishCount > bullishCount) {
    overallUsdDirection = 'BEARISH';
    overallStrength = bearishCount >= bullishCount + 2 ? 'STRONG' : 'MODERATE';
    executiveSummary = `Kesimpulan Otomatis: Data rilis ekonomi AS didominasi sinyal pelemahan (${bearishCount} dari ${total} indikator) dengan pendinginan inflasi atau perlambatan pasar tenaga kerja. Hal ini memperbesar kepastian pemangkasan suku bunga oleh The Fed, menghasilkan bias pelemahan (Bearish) bagi US Dollar.`;
    recommendedAction = 'Fokus pada peluang Buy EUR/USD, GBP/USD, dan Emas (XAU/USD). Waspadai peluang short-selling pada USD/JPY.';
  } else {
    overallUsdDirection = 'NEUTRAL';
    overallStrength = 'MIXED';
    executiveSummary = `Kesimpulan Otomatis: Sinyal data ekonomi AS saat ini seimbang dan kontradiktif (${bullishCount} Bullish vs ${bearishCount} Bearish). Pasar berada dalam fase konsolidasi dan pergerakan harga rentan terjadi false breakout.`;
    recommendedAction = 'Trading dengan target pips lebih konservatif atau tunggu rilis katalis berikutnya untuk konfirmasi tren dominan.';
  }

  const pairsConsensus = [
    {
      pair: 'DXY' as const,
      action: overallUsdDirection === 'BULLISH' ? ('BUY' as const) : overallUsdDirection === 'BEARISH' ? ('SELL' as const) : ('HOLD' as const),
      direction: overallUsdDirection === 'BULLISH' ? ('Bullish' as const) : overallUsdDirection === 'BEARISH' ? ('Bearish' as const) : ('Netral' as const),
      confidence: overallStrength === 'STRONG' ? ('Tinggi' as const) : ('Sedang' as const)
    },
    {
      pair: 'EUR/USD' as const,
      action: overallUsdDirection === 'BULLISH' ? ('SELL' as const) : overallUsdDirection === 'BEARISH' ? ('BUY' as const) : ('HOLD' as const),
      direction: overallUsdDirection === 'BULLISH' ? ('Bearish' as const) : overallUsdDirection === 'BEARISH' ? ('Bullish' as const) : ('Netral' as const),
      confidence: overallStrength === 'STRONG' ? ('Tinggi' as const) : ('Sedang' as const)
    },
    {
      pair: 'XAU/USD' as const,
      action: overallUsdDirection === 'BULLISH' ? ('SELL' as const) : overallUsdDirection === 'BEARISH' ? ('BUY' as const) : ('HOLD' as const),
      direction: overallUsdDirection === 'BULLISH' ? ('Bearish' as const) : overallUsdDirection === 'BEARISH' ? ('Bullish' as const) : ('Netral' as const),
      confidence: overallStrength === 'STRONG' ? ('Tinggi' as const) : ('Sedang' as const)
    },
    {
      pair: 'USD/JPY' as const,
      action: overallUsdDirection === 'BULLISH' ? ('BUY' as const) : overallUsdDirection === 'BEARISH' ? ('SELL' as const) : ('HOLD' as const),
      direction: overallUsdDirection === 'BULLISH' ? ('Bullish' as const) : overallUsdDirection === 'BEARISH' ? ('Bearish' as const) : ('Netral' as const),
      confidence: overallStrength === 'STRONG' ? ('Tinggi' as const) : ('Sedang' as const)
    },
    {
      pair: 'GBP/USD' as const,
      action: overallUsdDirection === 'BULLISH' ? ('SELL' as const) : overallUsdDirection === 'BEARISH' ? ('BUY' as const) : ('HOLD' as const),
      direction: overallUsdDirection === 'BULLISH' ? ('Bearish' as const) : overallUsdDirection === 'BEARISH' ? ('Bullish' as const) : ('Netral' as const),
      confidence: overallStrength === 'STRONG' ? ('Tinggi' as const) : ('Sedang' as const)
    },
    {
      pair: 'USD/CAD' as const,
      action: overallUsdDirection === 'BULLISH' ? ('BUY' as const) : overallUsdDirection === 'BEARISH' ? ('SELL' as const) : ('HOLD' as const),
      direction: overallUsdDirection === 'BULLISH' ? ('Bullish' as const) : overallUsdDirection === 'BEARISH' ? ('Bearish' as const) : ('Netral' as const),
      confidence: overallStrength === 'STRONG' ? ('Tinggi' as const) : ('Sedang' as const)
    }
  ];

  return {
    overallUsdDirection,
    overallStrength,
    bullishScore: bullishPct,
    bearishScore: bearishPct,
    analyzedEventsCount: evaluatedList.length,
    executiveSummary,
    keyDrivers: drivers.slice(0, 4),
    recommendedAction,
    pairsConsensus
  };
}

