"use client"
import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface PaymentFormProps {
  clientSecret: string
  planName: string
  planPrice: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentForm({ 
  clientSecret, 
  planName, 
  planPrice, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!stripe) return

    // Check if payment already succeeded (e.g., on page refresh)
    const clientSecretFromUrl = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (clientSecretFromUrl) {
      stripe.retrievePaymentIntent(clientSecretFromUrl).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            setMessage('Payment succeeded!')
            setIsSuccess(true)
            onSuccess?.()
            break
          case 'processing':
            setMessage('Your payment is processing.')
            break
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.')
            onError?.('Payment failed')
            break
          default:
            setMessage('Something went wrong.')
            onError?.('Unknown error')
            break
        }
      })
    }
  }, [stripe, onSuccess, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Payment failed')
        onError?.(error.message || 'Payment failed')
      } else {
        setMessage('An unexpected error occurred.')
        onError?.('An unexpected error occurred.')
      }
    }

    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-green-700">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing to {planName}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Subscribe to {planName} for ${planPrice}/month
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          
          {message && (
            <Alert variant={isSuccess ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !stripe || !elements}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              `Pay $${planPrice}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}