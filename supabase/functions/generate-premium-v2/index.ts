// Supabase Edge Function: Generate Premium (User-based)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { game } = await req.json()

        // Get user from JWT token
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Not authenticated', code: 'NO_AUTH' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        // Get current user
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: 'Invalid session', code: 'INVALID_SESSION' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Service client for admin operations
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get user credits
        const { data: userCredits, error: creditsError } = await supabaseAdmin
            .from('user_credits')
            .select('*')
            .eq('id', user.id)
            .single()

        if (creditsError || !userCredits) {
            return new Response(
                JSON.stringify({ error: 'User not found', code: 'USER_NOT_FOUND' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check credits
        if (userCredits.credits <= 0) {
            // Check if VIP Unlimited and still valid
            if (userCredits.subscription_type === 'vip_unlimited') {
                const expiresAt = new Date(userCredits.subscription_expires_at)
                if (expiresAt > new Date()) {
                    // VIP still valid, allow usage
                    console.log('VIP Unlimited user, allowing usage')
                } else {
                    return new Response(
                        JSON.stringify({ error: 'Subscription expired', code: 'SUBSCRIPTION_EXPIRED' }),
                        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                    )
                }
            } else {
                return new Response(
                    JSON.stringify({ error: 'No credits remaining', code: 'NO_CREDITS' }),
                    { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }
        }

        // Deduct credit (unless VIP Unlimited)
        let newCredits = userCredits.credits
        if (userCredits.subscription_type !== 'vip_unlimited') {
            newCredits = userCredits.credits - 1
            await supabaseAdmin
                .from('user_credits')
                .update({ credits: newCredits, updated_at: new Date().toISOString() })
                .eq('id', user.id)
        }

        // Get cached data
        const { data: cachedData } = await supabaseAdmin
            .from('lottery_cache')
            .select('*')
            .eq('game', game)
            .single()

        if (!cachedData) {
            return new Response(
                JSON.stringify({ error: 'Data not available' }),
                { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const analysis = cachedData.analysis
        const gameConfig = getGameConfig(game)
        const aiResult = await generateAINumbers(game, analysis, gameConfig)

        // Save to history
        await supabaseAdmin
            .from('prediction_history')
            .insert({
                game,
                numbers: aiResult.numbers,
                stars: aiResult.stars || [],
                confidence: aiResult.confidence,
                user_id: user.id,
                ai_reasoning: aiResult.reasoning
            })

        return new Response(
            JSON.stringify({
                success: true,
                remainingCredits: userCredits.subscription_type === 'vip_unlimited' ? 999999 : newCredits,
                subscriptionType: userCredits.subscription_type,
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

async function generateAINumbers(game: string, analysis: any, gameConfig: any) {
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')

    const prompt = `Analyze ${game} lottery. Hot: ${analysis.hotNumbers.join(', ')}. Cold: ${analysis.coldNumbers.join(', ')}. Generate ${gameConfig.count} numbers (1-${gameConfig.range}) using Mean Reversion. JSON only: {"numbers":[...], "confidence":0.85, "reasoning":"..."}`

    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 30000)

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
            reasoning: aiData.reasoning || 'AI prediction'
        }
    } catch (error) {
        const numbers = generateSmartRandom(gameConfig.range, gameConfig.count, analysis)
        return {
            numbers,
            stars: gameConfig.starCount ? Array(gameConfig.starCount).fill(0).map(() => Math.floor(Math.random() * gameConfig.starRange) + 1) : [],
            confidence: 0.65,
            reasoning: 'Statistical fallback'
        }
    }
}

function generateSmartRandom(range: number, count: number, analysis: any) {
    const pool = []
    const coldNums = analysis.coldNumbers.slice(0, Math.ceil(count * 0.4))
    const hotNums = analysis.hotNumbers.slice(0, Math.ceil(count * 0.3))

    pool.push(...coldNums, ...hotNums)

    while (pool.length < count) {
        const rand = Math.floor(Math.random() * range) + 1
        if (!pool.includes(rand)) pool.push(rand)
    }

    return pool.slice(0, count).sort((a, b) => a - b)
}
