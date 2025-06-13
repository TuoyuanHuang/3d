# 3D su Misura - Stripe Integration

This project now includes a complete Stripe payment integration for the 3D printing service website.

## Features

- **Secure Payment Processing**: Full Stripe integration with client-side and server-side components
- **Product Checkout**: Direct purchase from product cards and detail pages
- **Payment Modal**: Elegant checkout experience with customer information collection
- **Order Confirmation**: Professional order confirmation with status tracking
- **Responsive Design**: Mobile-friendly payment forms and modals

## Stripe Setup

1. **Create a Stripe Account**
   - Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   - Complete the registration process

2. **Get Your API Keys**
   - Navigate to Developers > API Keys in your Stripe Dashboard
   - Copy your Publishable Key and Secret Key

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add your Stripe keys:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
     STRIPE_SECRET_KEY=sk_test_your_secret_key_here
     ```

## Payment Flow

1. **Product Selection**: Users can purchase directly from product cards or detail pages
2. **Checkout Modal**: Secure payment form with customer information collection
3. **Payment Processing**: Stripe handles secure payment processing
4. **Order Confirmation**: Users receive confirmation with order details
5. **Email Notifications**: Automatic email receipts via Stripe

## Components

- **CheckoutForm**: Main payment form with customer details and payment processing
- **PaymentModal**: Modal wrapper for the checkout experience
- **OrderConfirmation**: Post-purchase confirmation display
- **Updated ProductCard**: Added "Buy Now" functionality
- **Updated ProductDetail**: Enhanced with direct purchase option

## Security Features

- SSL encryption for all payment data
- PCI DSS compliance through Stripe
- No sensitive payment data stored locally
- Secure tokenization of payment methods

## Testing

Use Stripe's test card numbers:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Production Deployment

1. Replace test API keys with live keys
2. Enable webhook endpoints for order processing
3. Configure proper error handling and logging
4. Set up order fulfillment workflows

## Support

For payment-related issues, check the Stripe Dashboard for detailed transaction logs and error messages.