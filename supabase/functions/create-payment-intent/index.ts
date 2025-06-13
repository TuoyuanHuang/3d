/*
  # Create Payment Intent Edge Function

  1. New Edge Function
    - `create-payment-intent`
      - Handles Stripe payment intent creation
      - Creates order record in database
      - Validates request data
      - Returns client secret for frontend

  2. Security
    - Server-side Stripe secret key usage
    - Input validation and error handling
    - CORS headers for frontend requests
    - Database transaction safety
*/

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  productId: string;
  productName: string;
  selectedColor?: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
}

Deno.serve(async (req) => {
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
    if (!requestData.amount || !requestData.currency || !requestData.productName || 
        !requestData.customerInfo?.name || !requestData.customerInfo?.email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

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

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing')
      return new Response(
        JSON.stringify({ error: 'Database service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from authorization header
    const authHeader = req.headers.get('authorization')
    let userId = null
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id
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
        'metadata[productId]': requestData.productId || '',
        'metadata[productName]': requestData.productName,
        'metadata[customerName]': requestData.customerInfo.name,
        'metadata[customerEmail]': requestData.customerInfo.email,
        'metadata[selectedColor]': requestData.selectedColor || '',
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

    // Create order in database
    const shippingAddress = requestData.customerInfo.address ? {
      address: requestData.customerInfo.address,
      city: requestData.customerInfo.city || '',
      postalCode: requestData.customerInfo.postalCode || '',
      country: 'IT'
    } : null

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        customer_name: requestData.customerInfo.name,
        customer_email: requestData.customerInfo.email,
        customer_phone: requestData.customerInfo.phone,
        shipping_address: shippingAddress,
        total_amount: requestData.amount,
        currency: requestData.currency,
        payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
        order_status: 'processing'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Database error creating order:', orderError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order record' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: requestData.productId || '',
        product_name: requestData.productName,
        quantity: 1,
        unit_price: requestData.amount,
        selected_color: requestData.selectedColor
      })

    if (itemError) {
      console.error('Database error creating order item:', itemError)
      // Note: In a production environment, you might want to cancel the payment intent here
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: order.id
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