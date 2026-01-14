// Script to populate/update Supabase cache with full statistical analysis
// Run this locally or as a scheduled job every 6 hours

import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dtyckxrqyyvcitmityzv.supabase.co';
const SUPABASE_SERVICE_KEY = 'TU_SERVICE_ROLE_KEY_AQUI'; // Get from Supabase Dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// === SAME SCRAPING LOGIC FROM server.js ===
async function scrapeRealHistoricalData(game) {
    const urls = {
        lotto: 'https://www.lotteryguru.com/denmark-lottery/lotto-results',
        vikinglotto: 'https://www.lotteryguru.com/denmark-lottery/vikinglotto-results',
        eurojackpot: 'https://www.lotteryguru.com/eurojackpot-lottery-results'
    };

    console.log(`📥 Scraping ${game} data from LotteryGuru...`);
    const response = await axios.get(urls[game]);
    const $ = cheerio.load(response.data);
    const draws = [];

    $('.results-table tr').each((i, row) => {
        if (i === 0) return; // Skip header
        const numbers = [];
        $(row).find('.ball').each((j, ball) => {
            numbers.push(parseInt($(ball).text()));
        });
        if (numbers.length > 0) draws.push(numbers);
    });

    console.log(`✅ Scraped ${draws.length} draws for ${game}`);
    return draws.slice(0, 100); // Last 100 draws
}

// === SAME ANALYSIS LOGIC FROM server.js ===
function performAdvancedAnalysis(historicalData, range) {
    const frequency = Array(range + 1).fill(0);
    const pairs = {};
    const gaps = Array(range + 1).fill(0);
    let totalDraws = historicalData.length;

    // Frequency Analysis
    historicalData.forEach(draw => {
        draw.forEach(num => frequency[num]++);
    });

    // Pair Correlations
    historicalData.forEach(draw => {
        for (let i = 0; i < draw.length - 1; i++) {
            for (let j = i + 1; j < draw.length; j++) {
                const pair = `${draw[i]}-${draw[j]}`;
                pairs[pair] = (pairs[pair] || 0) + 1;
            }
        }
    });

    // Gap Analysis
    const lastSeen = Array(range + 1).fill(0);
    historicalData.forEach((draw, idx) => {
        for (let num = 1; num <= range; num++) {
            if (!draw.includes(num)) {
                gaps[num] = idx - lastSeen[num];
            } else {
                lastSeen[num] = idx;
                gaps[num] = 0;
            }
        }
    });

    // Chi-Square Test
    const expected = totalDraws * (7 / range); // Lotto: 7 numbers per draw
    let chiSquare = 0;
    for (let i = 1; i <= range; i++) {
        chiSquare += Math.pow(frequency[i] - expected, 2) / expected;
    }

    // Hot/Cold Numbers
    const sortedByFreq = frequency.map((f, i) => ({ num: i, freq: f }))
        .filter(x => x.num > 0)
        .sort((a, b) => b.freq - a.freq);

    const hotNumbers = sortedByFreq.slice(0, 15).map(x => x.num);
    const coldNumbers = sortedByFreq.slice(-15).map(x => x.num);

    // Common Pairs
    const commonPairs = Object.entries(pairs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([pair, count]) => ({ pair, count }));

    // Entropy Calculation
    const relativeFreq = frequency.map(f => f / totalDraws);
    const entropy = -relativeFreq.reduce((sum, p) => {
        return p > 0 ? sum + p * Math.log2(p) : sum;
    }, 0);

    // Standard Deviation
    const mean = frequency.reduce((sum, f) => sum + f, 0) / range;
    const variance = frequency.reduce((sum, f) => sum + Math.pow(f - mean, 2), 0) / range;
    const stdDev = Math.sqrt(variance);

    return {
        hotNumbers,
        coldNumbers,
        commonPairs,
        totalDraws,
        chiSquare,
        isRandom: chiSquare < 50, // Simplified threshold
        entropy: entropy.toFixed(2),
        stdDev: stdDev.toFixed(2),
        statistics: {
            mean: mean.toFixed(2),
            median: sortedByFreq[Math.floor(sortedByFreq.length / 2)].freq
        }
    };
}

// === UPDATE CACHE FOR ALL GAMES ===
async function updateCache() {
    const games = ['lotto', 'vikinglotto', 'eurojackpot'];
    const ranges = { lotto: 36, vikinglotto: 48, eurojackpot: 50 };

    for (const game of games) {
        try {
            console.log(`\n🎰 Processing ${game.toUpperCase()}...`);

            // Scrape data
            const historicalData = await scrapeRealHistoricalData(game);

            // Perform full analysis
            const analysis = performAdvancedAnalysis(historicalData, ranges[game]);

            // Upsert to Supabase
            const { error } = await supabase
                .from('lottery_cache')
                .upsert({
                    game,
                    data: historicalData,
                    analysis,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'game' });

            if (error) {
                console.error(`❌ Error updating ${game}:`, error);
            } else {
                console.log(`✅ ${game} cache updated successfully!`);
            }

            // Wait 2 seconds between games to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error(`❌ Failed to update ${game}:`, error.message);
        }
    }

    console.log('\n🎉 Cache update completed!');
}

// Run
updateCache();
