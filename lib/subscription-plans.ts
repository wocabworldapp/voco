export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: 'Monthly',
    price: 4.99,
    interval: 'month',
    features: [
      'Access to all vocabulary topics',
      'Daily reminder notifications',
      'Progress tracking',
      'Offline access',
      'Unlimited practice sessions'
    ]
  },
  YEARLY: {
    name: 'Yearly',
    price: 39.90,
    interval: 'year',
    features: [
      'Access to all vocabulary topics',
      'Daily reminder notifications',
      'Progress tracking',
      'Offline access',
      'Unlimited practice sessions',
      'Premium support',
      'Early access to new features'
    ]
  }
}

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS.MONTHLY
