import Stripe from 'stripe'

// Server-side Stripe instance - only initialize when needed
export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
  }

  if (secretKey === 'sk_test_YOUR_SECRET_KEY_HERE') {
    throw new Error('Please replace STRIPE_SECRET_KEY with your actual Stripe secret key from https://dashboard.stripe.com/apikeys')
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  })
}

// Re-export subscription plans for server-side use
export { SUBSCRIPTION_PLANS, type SubscriptionPlan } from './subscription-plans'