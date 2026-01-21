import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        console.log("🔄 Starting Lottery Data Update...")

        const LOTTERY_URLS = {
            lotto: 'https://lotteryguru.com/denmark-lottery-results/dk-lotto/dk-lotto-results-history',
            eurojackpot: 'https://lotteryguru.com/denmark-lottery-results/dk-eurojackpot/dk-eurojackpot-results-history',
            vikinglotto: 'https://lotteryguru.com/denmark-lottery-results/dk-vikinglotto/dk-vikinglotto-results-history'
        }

        const games = ['lotto', 'eurojackpot', 'vikinglotto']
        const results = {}

        for (const game of games) {
            console.log(`🌐 Scraping ${game}...`)
            const url = LOTTERY_URLS[game]

            try {
                const response = await fetch(url)
                const html = await response.text()
                const $ = cheerio.load(html)

                const draws = []

                // Generic scraper for LotteryGuru table structure
                // Looks for rows with numbers
                $('tr').each((i, el) => {
                    if (draws.length >= 100) return

                    const numbers = []
                    $(el).find('li, .ball, td').each((j, numEl) => {
                        const txt = $(numEl).text().trim()
                        const num = parseInt(txt)
                        if (!isNaN(num) && num > 0 && num <= 50) {
                            numbers.push(num)
                        }
                    })

                    // Filter valid draws (min 5 numbers)
                    if (numbers.length >= 5) {
                        // Remove duplicates and sort
                        const uniqueSorted = [...new Set(numbers)].sort((a, b) => a - b)
                        // Take only first N numbers (depends on game, but storing all is safer for now)
                        draws.push(uniqueSorted)
                    }
                })

                console.log(`✅ Found ${draws.length} draws for ${game}`)

                if (draws.length > 0) {
                    // PERFORM ANALYSIS
                    const config = getGameConfig(game)
                    const analysis = performAnalysis(draws, config.range)

                    // SAVE TO DB
                    const { error } = await supabaseClient
                        .from('lottery_cache')
                        .upsert({
                            game: game,
                            data: draws,
                            analysis: analysis,
                            updated_at: new Date()
                        }, { onConflict: 'game' })

                    if (error) console.error(`Error saving ${game}:`, error.message)
                    else console.log(`💾 Saved ${game} to DB`)

                    results[game] = { status: 'success', draws: draws.length }
                } else {
                    results[game] = { status: 'error', message: 'No numbers found in HTML' }
                }

            } catch (e) {
                console.error(`Error scraping ${game}:`, e)
                results[game] = { status: 'error', message: e.message }
            }
        }

        return new Response(
            JSON.stringify({ message: 'Update complete', results }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

// --- HELPERS ---

function getGameConfig(game) {
    const configs = {
        lotto: { range: 36 },
        vikinglotto: { range: 48 },
        eurojackpot: { range: 50 }
    };
    return configs[game] || { range: 36 };
}

function performAnalysis(historicalData, maxNumber) {
    const frequency = {};
    const totalDraws = historicalData.length;

    // Initialize
    for (let i = 1; i <= maxNumber; i++) frequency[i] = 0;

    // Count
    historicalData.forEach(draw => {
        draw.forEach(num => {
            if (num <= maxNumber) frequency[num] = (frequency[num] || 0) + 1;
        });
    });

    // Sort Hot/Cold
    const sortedNumbers = Object.keys(frequency).map(Number).sort((a, b) => frequency[b] - frequency[a]);

    return {
        hotNumbers: sortedNumbers.slice(0, 15),
        coldNumbers: sortedNumbers.slice(-15).reverse(),
        totalDraws
    };
}
