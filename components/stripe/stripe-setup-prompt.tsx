"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ExternalLink, Key, CreditCard, AlertTriangle } from 'lucide-react'

export function StripeSetupPrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl text-yellow-700">
            Stripe Integration Setup Required
          </CardTitle>
          <CardDescription className="text-lg">
            To test payments, you need to configure your Stripe API keys
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              Currently using placeholder Stripe keys. Follow the steps below to enable payments.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Create a Stripe Account
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                If you don't have a Stripe account yet, create one to get your API keys.
              </p>
              <Button variant="outline" asChild>
                <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create Stripe Account
                </a>
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Get Your API Keys
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Go to your Stripe Dashboard → Developers → API Keys
              </p>
              <Button variant="outline" asChild>
                <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get API Keys
                </a>
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Update Environment Variables
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Replace the placeholder values in your <code className="bg-gray-200 px-1 rounded">.env.local</code> file:
              </p>
              <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                <div>STRIPE_SECRET_KEY="sk_test_your_actual_secret_key"</div>
                <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_actual_publishable_key"</div>
                <div>STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                Create Products & Prices
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Create products in Stripe and update the price IDs in the code.
              </p>
              <Button variant="outline" asChild>
                <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create Products
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Test Mode
            </h4>
            <p className="text-sm text-blue-700">
              Use Stripe's test mode for development. Test card number: <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code>
            </p>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Refresh Page After Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}