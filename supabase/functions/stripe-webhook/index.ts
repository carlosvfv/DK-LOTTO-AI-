// Supabase Edge Function: Stripe Webhook Handler
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.11.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
    const signature = req.headers.get('Stripe-Signature')
    const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !WEBHOOK_SECRET) {
        return new Response('No signature', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            WEBHOOK_SECRET,
            undefined,
            cryptoProvider
        )

        console.log('Webhook event:', event.type)

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object

            const supabase = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            // Get customer email
            const customerEmail = session.customer_email || session.customer_details?.email

            if (!customerEmail) {
                console.error('No customer email found')
                return new Response('No email', { status: 400 })
            }

            // Determine credits based on amount paid
            const amount = session.amount_total // in cents
            let credits = 0
            let subscriptionType = 'free'
            let expiresAt = null

            if (amount === 1300) { // 13 kr = 1300 øre
                credits = 1
                subscriptionType = 'x1'
            } else if (amount === 4900) { // 49 kr
                credits = 5
                subscriptionType = 'x5'
            } else if (amount === 17000) { // 170 kr
                credits = 999999 // Unlimited
                subscriptionType = 'vip_unlimited'
                // Set expiration to 1 month from now
                expiresAt = new Date()
                expiresAt.setMonth(expiresAt.getMonth() + 1)
            }

            // Find or create user
            const { data: existingUser } = await supabase
                .from('user_credits')
                .select('*')
                .eq('email', customerEmail)
                .single()

            if (existingUser) {
                // Update existing user
                await supabase
                    .from('user_credits')
                    .update({
                        credits: existingUser.credits + credits,
                        subscription_type: subscriptionType,
                        subscription_expires_at: expiresAt,
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', customerEmail)

                console.log(`Updated user ${customerEmail}: +${credits} credits`)
            } else {
                // Create new user record (they'll link it when they sign up)
                await supabase
                    .from('user_credits')
                    .insert({
                        email: customerEmail,
                        credits,
                        subscription_type: subscriptionType,
                        subscription_expires_at: expiresAt
                    })

                console.log(`Created user ${customerEmail}: ${credits} credits`)
            }

            // TODO: Send email to customer
            console.log(`Payment successful for ${customerEmail}: ${credits} credits`)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err) {
        console.error('Webhook error:', err.message)
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }
})
