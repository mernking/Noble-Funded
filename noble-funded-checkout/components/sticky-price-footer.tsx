"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"

interface StickyPriceFooterProps {
  totalPrice: number
  currency: {
    id: string
    name: string
    symbol: string
    flag: string
  }
  accountSize: string
  onCheckout: () => void
}

export default function StickyPriceFooter({ totalPrice, currency, accountSize, onCheckout }: StickyPriceFooterProps) {
  const [showDetails, setShowDetails] = useState(false)

  const formatPrice = (price: number) => {
    if (currency.id === "ngn") {
      return `₦${price.toLocaleString()}`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out">
      {/* Price details panel - shown when expanded */}
      {showDetails && (
        <div className="container mx-auto py-3 px-4 md:px-6 border-b border-border">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Challenge Type</span>
              <span className="font-medium text-foreground">2-Step Evaluation</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Account Size</span>
              <span className="font-medium text-foreground">{accountSize}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Platform</span>
              <span className="font-medium text-foreground">MetaTrader 5</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Profit Split</span>
              <span className="font-medium text-foreground">Up to 80%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main footer with total and checkout button */}
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex flex-col mr-2">
              <span className="text-sm text-muted-foreground">Challenge Fee</span>
              <span className="text-2xl font-medium text-foreground">{formatPrice(totalPrice)}</span>
            </div>
            {showDetails ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </button>

          <Button onClick={onCheckout} size="lg" className="px-8">
            Get Funded Now
          </Button>
        </div>
      </div>
    </div>
  )
}
