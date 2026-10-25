export type NewsType = 'NFP' | 'CPI' | 'PPI' | 'FOMC';

export type BiasDirection = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type BiasStrength = 'STRONG' | 'MODERATE' | 'MIXED';

export interface NewsComponent {
  name: string;
  actual: number | string;
  forecast: number | string;
  previous: number | string;
  revisedPrevious?: number | string;
  unit: string;
  betterDirection: 'HIGHER_BETTER_FOR_USD' | 'LOWER_BETTER_FOR_USD';
  description?: string;
}

export interface PairImpact {
  pair: 'DXY' | 'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'XAU/USD' | 'USD/CAD';
  bias: 'BUY' | 'SELL' | 'NEUTRAL';
  directionText: 'Bullish' | 'Bearish' | 'Netral / Sideway';
  reasoning: string;
  expectedPips: string;
}

export interface BiasResult {
  newsType: NewsType;
  usdDirection: BiasDirection;
  strength: BiasStrength;
  headlineReason: string;
  detailedPoints: string[];
  pairsImpact: PairImpact[];
  marketMechanics: string;
  tradingRecommendation: string;
}

export interface NewsCorrelation {
  relatedIndicators: string[]; // Contoh: ADP Employment, Initial Jobless Claims, ISM Services
  leadLagRelationship: string; // Hubungan leading/lagging
  usdImpactSummary: string; // Dampak spesifik ke USD
  goldImpactSummary: string; // Dampak spesifik ke XAU/USD (Gold)
  marketChain: string; // Rantai transmisi pasar
}

export interface EconomicRelease {
  id: string;
  type: NewsType;
  title: string;
  period: string;
  releaseDate: string;
  timeWIB: string;
  impact: 'HIGH';
  status?: 'RELEASED' | 'UPCOMING';
  components: NewsComponent[];
  correlation?: NewsCorrelation;
  summaryNote?: string;
}

export interface AggregateSentiment {
  overallUsdDirection: BiasDirection;
  overallStrength: BiasStrength;
  bullishScore: number; // e.g. 75%
  bearishScore: number; // e.g. 25%
  analyzedEventsCount: number;
  executiveSummary: string;
  keyDrivers: string[];
  recommendedAction: string;
  pairsConsensus: {
    pair: 'DXY' | 'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'XAU/USD' | 'USD/CAD';
    action: 'BUY' | 'SELL' | 'HOLD';
    direction: 'Bullish' | 'Bearish' | 'Netral';
    confidence: 'Tinggi' | 'Sedang';
  }[];
}
