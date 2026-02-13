// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Получаем данные от сайта
    // amount - это УЖЕ финальная сумма, которую посчитал ваш сайт (с учетом семьи и скидок)
    // description - это красивое описание (например: "Пакет №4 + Семейный (3 чел.) - Скидка Пакет 1")
    const { amount, email, productName, description, metadata } = await req.json()

    console.log(`Creating payment for: ${email}, Amount: ${amount}, Desc: ${description}`)

    // 2. Создаем сессию в Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: description, // Покажем клиенту, за что он платит
            },
            unit_amount: Math.round(amount * 100), // Stripe ждет цену в центах
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?payment_success=true`,
      cancel_url: `${req.headers.get('origin')}/?payment_cancelled=true`,
      metadata: metadata,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error("Error creating session:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})