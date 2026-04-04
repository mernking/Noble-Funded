import type { Metadata } from "next"
import { Suspense } from "react"
import ProductCheckout from "@/components/product-checkout"

export const metadata: Metadata = {
  title: "Noble Funded | Get Your Trading Challenge",
  description: "Nigeria's #1 Prop Trading Firm - Get funded up to ₦50M or $200K",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-8">
          <img src="/noble-logo.png" alt="Noble Funded" className="w-9 h-9 rounded-xl object-contain" />
          <h1 className="text-2xl font-semibold text-foreground">Noble Funded</h1>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-primary/40 text-primary">
            2-Step Challenge
          </span>
        </div>
        <Suspense fallback={<div className="text-muted-foreground text-sm">Loading checkout…</div>}>
          <ProductCheckout />
        </Suspense>
      </div>
    </main>
  )
}
