"use client"
import { useSubscription } from '@/contexts/subscription-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Calendar, CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

export default function DashboardPage() {
  const { subscription, loading } = useSubscription()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your VOCO Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your subscription and track your learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription.isActive ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Plan</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {subscription.plan && SUBSCRIPTION_PLANS[subscription.plan]?.name}
                    </Badge>
                  </div>
                  
                  {subscription.currentPeriodEnd && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Renews</span>
                      <span className="text-sm font-medium">
                        {subscription.currentPeriodEnd.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {subscription.cancelAtPeriodEnd && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        Your subscription will be cancelled at the end of the current period.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">No active subscription</p>
                  <Button asChild>
                    <Link href="/subscription">
                      Upgrade to Premium
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Learning Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Words Learned</span>
                  <span className="text-2xl font-bold text-blue-600">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Study Streak</span>
                  <span className="text-2xl font-bold text-green-600">0 days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Languages</span>
                  <span className="text-2xl font-bold text-purple-600">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>
              {subscription.isActive 
                ? "You have access to all premium features!"
                : "Upgrade to unlock premium features"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscription.plan && Object.entries(SUBSCRIPTION_PLANS[subscription.plan].features).map(([index, feature]) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
              
              {!subscription.isActive && (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Upgrade to premium to unlock all features
                  </p>
                  <Button asChild>
                    <Link href="/subscription">
                      View Plans
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Billing Actions */}
        {subscription.isActive && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Management
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full md:w-auto">
                  Update Payment Method
                </Button>
                <Button variant="outline" className="w-full md:w-auto ml-0 md:ml-2">
                  Download Invoices
                </Button>
                {!subscription.cancelAtPeriodEnd && (
                  <Button variant="destructive" className="w-full md:w-auto ml-0 md:ml-2">
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}