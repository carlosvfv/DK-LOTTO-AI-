// Supabase Edge Function: Generate Premium Numbers
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { game, licenseKey } = await req.json()

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // --- LICENSE VALIDATION ---
        let isTrial = false
        let license = null

        if (!licenseKey) {
            return new Response(
                JSON.stringify({ error: 'License key required', code: 'MISSING_KEY' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (licenseKey === 'FREE-TRIAL-GIFT') {
            isTrial = true
            license = { active: true, credits: 1, id: 'trial' }
        } else {
            const { data: dbLic, error: fetchError } = await supabaseClient
                .from('licenses')
                .select('*')
                .eq('key_code', licenseKey)
                .single()

            if (fetchError || !dbLic) {
                return new Response(
                    JSON.stringify({ error: 'Invalid license key', code: 'INVALID_KEY' }),
                    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }
            license = dbLic
        }

        if (!license.active) {
            return new Response(
                JSON.stringify({ error: 'License inactive', code: 'INACTIVE_KEY' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (license.credits <= 0) {
            return new Response(
                JSON.stringify({ error: 'No credits', code: 'NO_CREDITS' }),
                { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Deduct credit
        let newCredits = license.credits
        if (!isTrial && license.credits < 900000) {
            newCredits = license.credits - 1
            await supabaseClient
                .from('licenses')
                .update({ credits: newCredits })
                .eq('id', license.id)
        }

        // --- GET CACHED LOTTERY DATA ---
        const { data: cachedData } = await supabaseClient
            .from('lottery_cache')
            .select('*')
            .eq('game', game)
            .single()

        if (!cachedData) {
            return new Response(
                JSON.stringify({ error: 'Data not available. Please try again later.' }),
                { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const historicalData = cachedData.data
        const analysis = cachedData.analysis

        // --- CALL DEEPSEEK AI ---
        const gameConfig = getGameConfig(game)
        const aiResult = await generateAINumbers(game, analysis, gameConfig, historicalData)

        // Save to history
        await supabaseClient
            .from('prediction_history')
            .insert({
                game,
                numbers: aiResult.numbers,
                stars: aiResult.stars || [],
                confidence: aiResult.confidence,
                license_key: licenseKey,
                ai_reasoning: aiResult.reasoning
            })

        return new Response(
            JSON.stringify({
                success: true,
                remainingCredits: isTrial ? 0 : newCredits,
                game,
                numbers: aiResult.numbers,
                stars: aiResult.stars || [],
                analysis: {
                    hotNumbers: analysis.hotNumbers,
                    coldNumbers: analysis.coldNumbers,
                    totalDrawsAnalyzed: analysis.totalDraws,
                },
                ai: {
                    confidence: aiResult.confidence,
                    reasoning: aiResult.reasoning,
                }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

function getGameConfig(game: string) {
    const configs = {
        lotto: { range: 36, count: 7 },
        vikinglotto: { range: 48, count: 6, vikingRange: 5 },
        eurojackpot: { range: 50, count: 5, starRange: 12, starCount: 2 }
    }
    return configs[game] || configs.lotto
}

async function generateAINumbers(game: string, analysis: any, gameConfig: any, historicalData: any) {
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')

    const prompt = `You are analyzing ${game} lottery data. Based on this statistical analysis:
Hot numbers: ${analysis.hotNumbers.join(', ')}
Cold numbers: ${analysis.coldNumbers.join(', ')}
Total draws analyzed: ${analysis.totalDraws}

Generate ${gameConfig.count} numbers between 1-${gameConfig.range} using "Mean Reversion Theory".
Respond ONLY with JSON: {"numbers": [1,2,3...], "confidence": 0.85, "reasoning": "brief explanation"}`

    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-reasoner',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500
            }),
            signal: controller.signal
        })

        clearTimeout(timeout)

        const data = await response.json()
        const aiText = data.choices[0].message.content
        const aiData = JSON.parse(aiText)

        return {
            numbers: aiData.numbers,
            stars: gameConfig.starCount ? Array(gameConfig.starCount).fill(0).map(() => Math.floor(Math.random() * gameConfig.starRange) + 1) : [],
            confidence: aiData.confidence || 0.75,
            reasoning: aiData.reasoning || 'AI generated prediction'
        }
    } catch (error) {
        // Fallback: generate smart random
        console.error('DeepSeek timeout, using fallback')
        const numbers = generateSmartRandom(gameConfig.range, gameConfig.count, analysis)
        return {
            numbers,
            stars: gameConfig.starCount ? Array(gameConfig.starCount).fill(0).map(() => Math.floor(Math.random() * gameConfig.starRange) + 1) : [],
            confidence: 0.65,
            reasoning: 'Generated using statistical fallback method'
        }
    }
}

function generateSmartRandom(range: number, count: number, analysis: any) {
    const pool = []

    // Mix: 40% cold, 30% hot, 30% random
    const coldNums = analysis.coldNumbers.slice(0, Math.ceil(count * 0.4))
    const hotNums = analysis.hotNumbers.slice(0, Math.ceil(count * 0.3))

    pool.push(...coldNums)
    pool.push(...hotNums)

    while (pool.length < count) {
        const rand = Math.floor(Math.random() * range) + 1
        if (!pool.includes(rand)) pool.push(rand)
    }

    return pool.slice(0, count).sort((a, b) => a - b)
}
