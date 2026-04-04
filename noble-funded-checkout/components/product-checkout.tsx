"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import {
  Check,
  TrendingUp,
  TrendingDown,
  Calendar,
  Percent,
  Clock,
  Scale,
  BarChart3,
  AlertCircle,
  Flame,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import CheckoutForm from "./checkout-form"
import StickyPriceFooter from "./sticky-price-footer"
import TradingCard from "./trading-card"

const currencyOptions = [
  { id: "ngn", name: "Naira Challenge Account", symbol: "₦", flag: "🇳🇬" },
  { id: "usd", name: "Dollar Challenge Account", symbol: "$", flag: "🇺🇸" },
]

const nairaAccountOptions = [
  { id: "ngn-200k", name: "₦200,000", accountSize: "₦200,000", price: 10000 },
  { id: "ngn-400k", name: "₦400,000", accountSize: "₦400,000", price: 19000 },
  { id: "ngn-600k", name: "₦600,000", accountSize: "₦600,000", price: 29000 },
  { id: "ngn-800k", name: "₦800,000", accountSize: "₦800,000", price: 39000, popular: true },
  { id: "ngn-1m", name: "₦1,000,000", accountSize: "₦1,000,000", price: 54000 },
  { id: "ngn-3m", name: "₦3,000,000", accountSize: "₦3,000,000", price: 190000 },
]

const dollarAccountOptions = [
  { id: "usd-5k", name: "$5K", accountSize: "$5,000", price: 29.99 },
  { id: "usd-10k", name: "$10K", accountSize: "$10,000", price: 59.99 },
  { id: "usd-25k", name: "$25K", accountSize: "$25,000", price: 134.99 },
  { id: "usd-50k", name: "$50K", accountSize: "$50,000", price: 219.99, popular: true },
  { id: "usd-100k", name: "$100K", accountSize: "$100,000", price: 379.99 },
  { id: "usd-200k", name: "$200K", accountSize: "$200,000", price: 749.99 },
]

const nairaChallengeDetails = [
  { icon: TrendingUp, label: "Profit Target Phase 1", value: "10%" },
  { icon: TrendingUp, label: "Profit Target Phase 2", value: "10%" },
  { icon: TrendingDown, label: "Maximum Drawdown", value: "20%" },
  { icon: Calendar, label: "Minimum Trading Days", value: "1" },
  { icon: Percent, label: "Profit Split", value: "80%" },
  { icon: Clock, label: "Payout Frequency", value: "24 Hours" },
  { icon: Scale, label: "Trading Leverage", value: "Up to 1:100" },
  { icon: BarChart3, label: "Instruments", value: "Fx, Commodities, Indices, Stock, Crypto" },
  { icon: AlertCircle, label: "Consistency Rule", value: "Not Applied" },
]

const dollarChallengeDetails = [
  { icon: TrendingUp, label: "Profit Target Phase 1", value: "10%" },
  { icon: TrendingUp, label: "Profit Target Phase 2", value: "5%" },
  { icon: TrendingDown, label: "Daily Drawdown", value: "3%" },
  { icon: TrendingDown, label: "Maximum Drawdown", value: "10%" },
  { icon: Calendar, label: "Minimum Trading Days", value: "3" },
  { icon: Percent, label: "Profit Split", value: "80%" },
  { icon: Clock, label: "Payout Frequency", value: "Bi-Weekly" },
  { icon: Scale, label: "Trading Leverage", value: "Up to 1:100" },
  { icon: BarChart3, label: "Instruments", value: "Fx, Commodities, Indices, Stock, Crypto" },
  { icon: AlertCircle, label: "Consistency Rule", value: "Not Applied" },
]

export default function ProductCheckout() {
  const searchParams = useSearchParams()

  // Determine initial state from ?plan= URL param (e.g. ?plan=ngn-800k)
  const planParam = searchParams.get("plan")
  const getInitialState = () => {
    if (planParam) {
      const nairaMatch = nairaAccountOptions.find((o) => o.id === planParam)
      if (nairaMatch) return { currency: currencyOptions[0], account: nairaMatch }
      const dollarMatch = dollarAccountOptions.find((o) => o.id === planParam)
      if (dollarMatch) return { currency: currencyOptions[1], account: dollarMatch }
    }
    return { currency: currencyOptions[0], account: nairaAccountOptions[0] }
  }

  const initial = getInitialState()
  const [selectedCurrency, setSelectedCurrency] = useState(initial.currency)
  const [selectedAccount, setSelectedAccount] = useState<(typeof nairaAccountOptions)[0]>(initial.account)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const checkoutFormRef = useRef<HTMLDivElement>(null)

  const accountOptions = selectedCurrency.id === "ngn" ? nairaAccountOptions : dollarAccountOptions
  const challengeDetails = selectedCurrency.id === "ngn" ? nairaChallengeDetails : dollarChallengeDetails

  useEffect(() => {
    // Only reset account when currency manually changes (not on initial plan-param load)
    if (!planParam) {
      setSelectedAccount(selectedCurrency.id === "ngn" ? nairaAccountOptions[0] : dollarAccountOptions[0])
    }
  }, [selectedCurrency])

  const formatPrice = (price: number) =>
    selectedCurrency.id === "ngn" ? `₦${price.toLocaleString()}` : `$${price.toFixed(2)}`

  const handleGetFunded = () => {
    setShowCheckoutForm(true)
    // Scroll to form after state update + render
    setTimeout(() => {
      checkoutFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 80)
  }

  useEffect(() => {
    document.body.style.paddingBottom = showCheckoutForm ? "0" : "88px"
    return () => { document.body.style.paddingBottom = "0" }
  }, [showCheckoutForm])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Dynamic Trading Card */}
          <Card className="p-6 bg-card flex flex-col items-center justify-center min-h-[320px]">
            <div className="w-full max-w-full">
              <TradingCard
              accountSize={selectedAccount.accountSize}
              price={formatPrice(selectedAccount.price)}
              currencyName={selectedCurrency.name}
              currencyFlag={selectedCurrency.flag}
              currencyId={selectedCurrency.id}
            />
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-xl font-semibold text-foreground">2-Step Challenge</h2>
              <p className="text-sm text-muted-foreground mt-1">Prove your skills. Get funded. Start earning.</p>
            </div>
          </Card>

          {/* Challenge details panel */}
          <Card className="p-6 bg-card">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
              <span className="text-lg">{selectedCurrency.flag}</span>
              <h4 className="font-semibold text-foreground">
                {selectedCurrency.id === "ngn" ? "Naira" : "Dollar"} Challenge Account
              </h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Choose a simulated account size and try to reach the minimum simulated gains target.
              Trade all available instruments. Subject to certain rules and objectives, your trading
              style is completely up to you!
            </p>
            <div className="space-y-3 text-sm">
              {challengeDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{label}</span>
                  </div>
                  <span className="font-medium text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 bg-card">
            {/* Trading Path (currency) selector */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-foreground mb-4">Choose your Trading Path</h3>
              <div className="grid grid-cols-2 gap-3 relative">
                {currencyOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCurrency(option)}
                    className={`relative border rounded-xl p-4 text-left transition-all ${
                      selectedCurrency.id === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {option.id === "ngn" && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold tracking-wide">
                        <Flame className="h-3 w-3" /> HOT
                      </span>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{option.flag}</span>
                        <span className="font-medium text-xs leading-tight">{option.name}</span>
                      </div>
                      {selectedCurrency.id === option.id && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Size */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-foreground mb-4">Select Account Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {accountOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAccount(option)}
                    className={`relative border rounded-xl py-3 px-2 text-center transition-all ${
                      selectedAccount.id === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {"popular" in option && option.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-orange-500 text-base leading-none">
                        🔥
                      </span>
                    )}
                    <span className="font-semibold text-foreground text-sm">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Challenge Fee</p>
                <p className="text-2xl font-bold text-foreground">{formatPrice(selectedAccount.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Platform</p>
                <p className="text-sm font-medium text-foreground">MetaTrader 5</p>
                <p className="text-xs text-muted-foreground mt-0.5">2-Step Evaluation</p>
              </div>
            </div>
          </Card>

          {/* Checkout Form (revealed on click) */}
          {showCheckoutForm && (
            <div ref={checkoutFormRef}>
              <CheckoutForm
                totalPrice={selectedAccount.price}
                currency={selectedCurrency}
                productDetails={{
                  name: "2-Step Challenge",
                  accountSize: selectedAccount.accountSize,
                  platform: "MetaTrader 5",
                  challengeType: "2-Step Evaluation",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      {!showCheckoutForm && (
        <StickyPriceFooter
          totalPrice={selectedAccount.price}
          currency={selectedCurrency}
          accountSize={selectedAccount.accountSize}
          onCheckout={handleGetFunded}
        />
      )}
    </>
  )
}
