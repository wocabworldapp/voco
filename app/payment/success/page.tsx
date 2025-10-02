"use client"
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Crown } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const paymentIntent = searchParams?.get('payment_intent')
    const paymentIntentClientSecret = searchParams?.get('payment_intent_client_secret')

    if (paymentIntent && paymentIntentClientSecret) {
      // You could verify the payment status here with your API
      setPaymentStatus('success')
    } else {
      setPaymentStatus('error')
    }
  }, [searchParams])

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Payment Error</CardTitle>
            <CardDescription>
              There was an issue processing your payment. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/subscription">
                Try Again
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <Crown className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-700">
            Welcome to VOCO Premium!
          </CardTitle>
          <CardDescription className="text-lg">
            Your subscription is now active. You have unlocked all premium features!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">What's unlocked:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Access to all 39 languages</li>
              <li>✓ Premium AI-powered voices</li>
              <li>✓ Advanced learning features</li>
              <li>✓ Personalized learning paths</li>
              <li>✓ Offline mode support</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/">
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            A confirmation email has been sent to your inbox. You can manage your subscription anytime in your account settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}