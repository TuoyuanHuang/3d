import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Order {
  id: string
  user_id?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address?: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  total_amount: number
  currency: string
  payment_intent_id?: string
  payment_status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  order_status: 'processing' | 'confirmed' | 'printing' | 'completed' | 'shipped' | 'delivered' | 'canceled'
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  selected_color?: string
  created_at: string
}

// Helper functions for orders
export const orderService = {
  async createOrder(orderData: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getOrderByPaymentIntent(paymentIntentId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('payment_intent_id', paymentIntentId)
      .single()
    
    if (error) throw error
    return data
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateOrderStatus(orderId: string, status: Order['order_status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}