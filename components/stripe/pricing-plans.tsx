"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

interface PricingPlansProps {
  onSelectPlanAction: (planType: keyof typeof SUBSCRIPTION_PLANS) => void
  loading?: boolean
  currentPlan?: string
}

export function PricingPlans({ onSelectPlanAction, loading = false, currentPlan }: PricingPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof SUBSCRIPTION_PLANS | null>(null)

  const handleSelectPlan = (planType: keyof typeof SUBSCRIPTION_PLANS) => {
    setSelectedPlan(planType)
    onSelectPlanAction(planType)
  }

  const getPlanIcon = (planType: keyof typeof SUBSCRIPTION_PLANS) => {
    switch (planType) {
      case 'MONTHLY':
        return <Star className="h-6 w-6" />
      case 'YEARLY':
        return <Zap className="h-6 w-6 text-yellow-500" />
      default:
        return <Star className="h-6 w-6" />
    }
  }

  const isPopularPlan = (planType: keyof typeof SUBSCRIPTION_PLANS) => {
    return planType === 'YEARLY'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {Object.entries(SUBSCRIPTION_PLANS).map(([planType, plan]) => {
        const isCurrentPlan = currentPlan === planType
        const isSelected = selectedPlan === planType
        const popular = isPopularPlan(planType as keyof typeof SUBSCRIPTION_PLANS)
        
        return (
          <Card 
            key={planType} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              popular ? 'border-blue-500 border-2' : ''
            } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            {popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getPlanIcon(planType as keyof typeof SUBSCRIPTION_PLANS)}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground">
                  /{plan.interval}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={popular ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(planType as keyof typeof SUBSCRIPTION_PLANS)}
                disabled={loading || isCurrentPlan}
              >
                {loading && isSelected ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : (
                  `Choose ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}