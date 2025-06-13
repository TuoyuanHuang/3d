/*
  # Create Payment Intent Edge Function

  1. New Edge Function
    - `create-payment-intent`
      - Handles Stripe payment intent creation
      - Validates request data
      - Returns client secret for frontend

  2. Security
    - Server-side Stripe secret key usage
    - Input validation and error handling
    - CORS headers for frontend requests
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  productName: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const requestData: CreatePaymentIntentRequest = await req.json()

    // Validate required fields
    if (!requestData.amount || !requestData.currency || !requestData.productName || !requestData.customerInfo?.name || !requestData.customerInfo?.email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create payment intent with Stripe API
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: requestData.amount.toString(),
        currency: requestData.currency,
        'metadata[productName]': requestData.productName,
        'metadata[customerName]': requestData.customerInfo.name,
        'metadata[customerEmail]': requestData.customerInfo.email,
        receipt_email: requestData.customerInfo.email,
        ...(requestData.customerInfo.address && {
          'shipping[name]': requestData.customerInfo.name,
          'shipping[phone]': requestData.customerInfo.phone || '',
          'shipping[address][line1]': requestData.customerInfo.address,
          'shipping[address][city]': requestData.customerInfo.city || '',
          'shipping[address][postal_code]': requestData.customerInfo.postalCode || '',
          'shipping[address][country]': 'IT',
        }),
      }),
    })

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text()
      console.error('Stripe API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to create payment intent' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const paymentIntent = await stripeResponse.json()

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in create-payment-intent function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})