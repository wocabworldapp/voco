"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StripeProvider } from '@/components/stripe/stripe-provider'
import { PricingPlans } from '@/components/stripe/pricing-plans'
import { PaymentForm } from '@/components/stripe/payment-form'
import { StripeSetupPrompt } from '@/components/stripe/stripe-setup-prompt'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

export default function SubscriptionPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof SUBSCRIPTION_PLANS | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(null)

  // Check if Stripe is configured on component mount
  useEffect(() => {
    const checkStripeConfig = async () => {
      try {
        const response = await fetch('/api/stripe/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType: 'BASIC', email: 'test@example.com' }),
        })
        
        if (response.status === 500) {
          const data = await response.json()
          if (data.error?.includes('Stripe is not properly configured')) {
            setStripeConfigured(false)
            return
          }
        }
        
        setStripeConfigured(true)
      } catch (err) {
        setStripeConfigured(false)
      }
    }

    checkStripeConfig()
  }, [])

  // Show loading while checking Stripe configuration
  if (stripeConfigured === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  // Show setup prompt if Stripe is not configured
  if (stripeConfigured === false) {
    return <StripeSetupPrompt />
  }

  const handleSelectPlan = async (planType: keyof typeof SUBSCRIPTION_PLANS) => {
    setLoading(true)
    setError(null)

    try {
      // For subscriptions, we'll use the subscription API
      const response = await fetch('/api/stripe/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          email: 'user@example.com', // TODO: Get from user session
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      setSelectedPlan(planType)
      setClientSecret(data.clientSecret)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    router.push('/dashboard?subscription=success')
  }

  const handlePaymentError = (error: string) => {
    setError(error)
    setSelectedPlan(null)
    setClientSecret(null)
  }

  const handleBackToPricing = () => {
    setSelectedPlan(null)
    setClientSecret(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your VOCO Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of language learning with our AI-powered features and premium voices
          </p>
        </div>

        {error && (
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-red-600">
                {error}
              </CardDescription>
              <Button 
                onClick={handleBackToPricing} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!selectedPlan ? (
          <PricingPlans 
            onSelectPlanAction={handleSelectPlan}
            loading={loading}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleBackToPricing}
              variant="ghost"
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>

            {clientSecret && selectedPlan && (
              <StripeProvider clientSecret={clientSecret}>
                <PaymentForm
                  clientSecret={clientSecret}
                  planName={SUBSCRIPTION_PLANS[selectedPlan].name}
                  planPrice={SUBSCRIPTION_PLANS[selectedPlan].price}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeProvider>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Secure payments powered by Stripe • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}