'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Crown, Check } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (planType: 'monthly' | 'yearly') => void
}

export function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {
  const [isYearly, setIsYearly] = useState(false)
  
  const selectedPlan = isYearly ? SUBSCRIPTION_PLANS.YEARLY : SUBSCRIPTION_PLANS.MONTHLY
  const savings = isYearly ? Math.round(((SUBSCRIPTION_PLANS.MONTHLY.price * 12) - SUBSCRIPTION_PLANS.YEARLY.price) * 100) / 100 : 0

  const handleUpgrade = () => {
    onUpgrade(isYearly ? 'yearly' : 'monthly')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Custom backdrop with blur */}
      <div 
        className="fixed inset-0 w-full h-full"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(0, 0, 0, 0.3)',
        }}
        onClick={onClose}
      />
      
      {/* Glassmorphism container matching the app design */}
      <div 
        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden z-50 max-w-md sm:max-w-lg w-full mx-4"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Lock icon with crown effect */}
        <div className="text-center mb-6">
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            UNLOCK THE WORD LIBRARY
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Access all the topics, Set up a daily reminder and track your progress!
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-6">
          <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <Label 
                htmlFor="billing-toggle" 
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  !isYearly ? 'text-white' : 'text-white/60'
                }`}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-400 data-[state=checked]:to-orange-500"
              />
              <div className="flex items-center gap-2">
                <Label 
                  htmlFor="billing-toggle" 
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    isYearly ? 'text-white' : 'text-white/60'
                  }`}
                >
                  Yearly
                </Label>
                {isYearly && (
                  <span className="text-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full font-medium">
                    Save ${savings}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedPlan.name} Plan</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  ${selectedPlan.price}
                </span>
                <span className="text-white/60 text-sm">/{selectedPlan.interval}</span>
              </div>
              {isYearly && (
                <p className="text-green-400 text-sm mt-2 font-medium">
                  Save ${savings} compared to monthly billing
                </p>
              )}
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {selectedPlan.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <span className="text-white/90 text-xs sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        <Button 
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          size="lg"
        >
          Upgrade Now
        </Button>

        {/* Cancel Option */}
        <button
          onClick={onClose}
          className="w-full text-center text-white/60 text-sm hover:text-white/80 transition-colors mt-4 py-2"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
