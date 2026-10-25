import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateNewsBias, calculateAggregateMacroSentiment } from './forexRules';
import { NewsComponent } from '../types/forex';

test('NFP: Strong beat on employment and lower unemployment gives strong Bullish USD', () => {
  const components: NewsComponent[] = [
    {
      name: 'Non-Farm Employment Change',
      actual: '254K',
      forecast: '147K',
      previous: '159K',
      unit: 'K',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    },
    {
      name: 'Unemployment Rate',
      actual: '4.1%',
      forecast: '4.2%',
      previous: '4.2%',
      unit: '%',
      betterDirection: 'LOWER_BETTER_FOR_USD'
    },
    {
      name: 'Average Hourly Earnings m/m',
      actual: '0.4%',
      forecast: '0.3%',
      previous: '0.5%',
      unit: '%',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    }
  ];

  const result = evaluateNewsBias({ type: 'NFP', components });

  assert.equal(result.usdDirection, 'BULLISH');
  assert.equal(result.strength, 'STRONG');
  assert.ok(result.headlineReason.includes('Pasar tenaga kerja'));

  // EUR/USD must be BEARISH / SELL
  const eurusd = result.pairsImpact.find(p => p.pair === 'EUR/USD');
  assert.ok(eurusd);
  assert.equal(eurusd.bias, 'SELL');

  // XAU/USD (Gold) must be BEARISH / SELL
  const gold = result.pairsImpact.find(p => p.pair === 'XAU/USD');
  assert.ok(gold);
  assert.equal(gold.bias, 'SELL');

  // USD/JPY must be BULLISH / BUY
  const usdjpy = result.pairsImpact.find(p => p.pair === 'USD/JPY');
  assert.ok(usdjpy);
  assert.equal(usdjpy.bias, 'BUY');
});

test('NFP: Miss on employment and higher unemployment gives Bearish USD', () => {
  const components: NewsComponent[] = [
    {
      name: 'Non-Farm Employment Change',
      actual: '114K',
      forecast: '176K',
      previous: '206K',
      unit: 'K',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    },
    {
      name: 'Unemployment Rate',
      actual: '4.3%',
      forecast: '4.1%',
      previous: '4.1%',
      unit: '%',
      betterDirection: 'LOWER_BETTER_FOR_USD'
    }
  ];

  const result = evaluateNewsBias({ type: 'NFP', components });

  assert.equal(result.usdDirection, 'BEARISH');
  const eurusd = result.pairsImpact.find(p => p.pair === 'EUR/USD');
  assert.equal(eurusd?.bias, 'BUY');
  const gold = result.pairsImpact.find(p => p.pair === 'XAU/USD');
  assert.equal(gold?.bias, 'BUY');
});

test('NFP: Mixed scenario (NFP beat but unemployment rose) signals MIXED strength', () => {
  const components: NewsComponent[] = [
    {
      name: 'Non-Farm Employment Change',
      actual: '220K',
      forecast: '180K',
      previous: '160K',
      unit: 'K',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    },
    {
      name: 'Unemployment Rate',
      actual: '4.3%',
      forecast: '4.0%',
      previous: '4.0%',
      unit: '%',
      betterDirection: 'LOWER_BETTER_FOR_USD'
    }
  ];

  const result = evaluateNewsBias({ type: 'NFP', components });

  assert.equal(result.strength, 'MIXED');
  assert.ok(result.headlineReason.includes('kontradiktif'));
});

test('CPI: Inflation higher than forecast causes Bullish USD and Bearish Gold', () => {
  const components: NewsComponent[] = [
    {
      name: 'CPI y/y',
      actual: '3.5%',
      forecast: '3.4%',
      previous: '3.2%',
      unit: '%',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    },
    {
      name: 'Core CPI y/y',
      actual: '3.8%',
      forecast: '3.7%',
      previous: '3.8%',
      unit: '%',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    }
  ];

  const result = evaluateNewsBias({ type: 'CPI', components });

  assert.equal(result.usdDirection, 'BULLISH');
  const gold = result.pairsImpact.find(p => p.pair === 'XAU/USD');
  assert.equal(gold?.bias, 'SELL');
});

test('CPI: Inflation cooling below forecast causes Bearish USD and Bullish Gold', () => {
  const components: NewsComponent[] = [
    {
      name: 'CPI y/y',
      actual: '2.5%',
      forecast: '2.6%',
      previous: '2.9%',
      unit: '%',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    }
  ];

  const result = evaluateNewsBias({ type: 'CPI', components });

  assert.equal(result.usdDirection, 'BEARISH');
  const gold = result.pairsImpact.find(p => p.pair === 'XAU/USD');
  assert.equal(gold?.bias, 'BUY');
});

test('FOMC: Hawkish tone triggers Bullish USD', () => {
  const components: NewsComponent[] = [
    {
      name: 'Federal Funds Target Rate',
      actual: '5.50%',
      forecast: '5.50%',
      previous: '5.50%',
      unit: '%',
      betterDirection: 'HIGHER_BETTER_FOR_USD'
    }
  ];

  const result = evaluateNewsBias({
    type: 'FOMC',
    components,
    fomcTone: 'HAWKISH',
    rateChangeBps: 0
  });

  assert.equal(result.usdDirection, 'BULLISH');
  assert.equal(result.strength, 'STRONG');
});

test('calculateAggregateMacroSentiment computes collective bias and pairs consensus', () => {
  const releases = [
    {
      type: 'NFP' as const,
      components: [
        { name: 'NFP', actual: '254K', forecast: '147K', previous: '159K', unit: 'K', betterDirection: 'HIGHER_BETTER_FOR_USD' as const },
        { name: 'Unemployment Rate', actual: '4.1%', forecast: '4.2%', previous: '4.2%', unit: '%', betterDirection: 'LOWER_BETTER_FOR_USD' as const }
      ]
    },
    {
      type: 'CPI' as const,
      components: [
        { name: 'CPI y/y', actual: '3.4%', forecast: '3.1%', previous: '2.9%', unit: '%', betterDirection: 'HIGHER_BETTER_FOR_USD' as const }
      ]
    }
  ];

  const summary = calculateAggregateMacroSentiment(releases);
  assert.equal(summary.overallUsdDirection, 'BULLISH');
  assert.equal(summary.overallStrength, 'STRONG');
  assert.equal(summary.bullishScore, 100);
  assert.ok(summary.executiveSummary.includes('Kesimpulan Otomatis'));
  
  const gold = summary.pairsConsensus.find(p => p.pair === 'XAU/USD');
  assert.equal(gold?.action, 'SELL');
});

