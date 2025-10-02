"use client"
import { ReactNode } from 'react'
import { useSubscription } from '@/contexts/subscription-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Crown, Zap } from 'lucide-react'
import Link from 'next/link'

interface SubscriptionGateProps {
  children: ReactNode
  feature: string
  fallback?: ReactNode
  requiresPlan?: 'BASIC' | 'PREMIUM' | 'ANNUAL'
}

export function SubscriptionGate({ 
  children, 
  feature, 
  fallback, 
  requiresPlan = 'BASIC' 
}: SubscriptionGateProps) {
  const { subscription, loading, hasFeature } = useSubscription()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  // Check if user has access to the feature
  const hasAccess = subscription.isActive && hasFeature(feature)

  if (hasAccess) {
    return <>{children}</>
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>
  }

  // Default premium gate UI
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {requiresPlan === 'BASIC' ? (
            <Lock className="h-8 w-8 text-blue-500" />
          ) : (
            <Crown className="h-8 w-8 text-yellow-500" />
          )}
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          Premium Feature
          <Badge variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            {requiresPlan}
          </Badge>
        </CardTitle>
        <CardDescription>
          Upgrade your subscription to access {feature}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          This feature is available with our {requiresPlan.toLowerCase()} plan and above.
        </p>
        
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/subscription">
              Upgrade Now
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link href="/subscription">
              View All Plans
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface FeatureWrapperProps {
  children: ReactNode
  feature: string
  requiresPlan?: 'BASIC' | 'PREMIUM' | 'ANNUAL'
  showBadge?: boolean
}

export function FeatureWrapper({ 
  children, 
  feature, 
  requiresPlan = 'BASIC',
  showBadge = true 
}: FeatureWrapperProps) {
  const { subscription, hasFeature } = useSubscription()
  
  const hasAccess = subscription.isActive && hasFeature(feature)

  return (
    <div className="relative">
      {!hasAccess && showBadge && (
        <Badge 
          variant="outline" 
          className="absolute -top-2 -right-2 z-10 bg-yellow-100 text-yellow-800 border-yellow-300"
        >
          <Crown className="h-3 w-3 mr-1" />
          {requiresPlan}
        </Badge>
      )}
      
      <div className={!hasAccess ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  )
}