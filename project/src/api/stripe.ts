import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2024-06-20',
});

export interface CreatePaymentIntentRequest {
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

export const createPaymentIntent = async (data: CreatePaymentIntentRequest) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      metadata: {
        productName: data.productName,
        customerName: data.customerInfo.name,
        customerEmail: data.customerInfo.email,
      },
      receipt_email: data.customerInfo.email,
      shipping: data.customerInfo.address ? {
        name: data.customerInfo.name,
        phone: data.customerInfo.phone,
        address: {
          line1: data.customerInfo.address,
          city: data.customerInfo.city || '',
          postal_code: data.customerInfo.postalCode || '',
          country: 'IT',
        },
      } : undefined,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
};

export const createCustomer = async (customerInfo: CreatePaymentIntentRequest['customerInfo']) => {
  try {
    return await stripe.customers.create({
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address ? {
        line1: customerInfo.address,
        city: customerInfo.city || '',
        postal_code: customerInfo.postalCode || '',
        country: 'IT',
      } : undefined,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export default stripe;