interface PriceSummaryProps {
  totalPrice: number
  currency: {
    id: string
    name: string
    symbol: string
  }
  accountSize: string
  challengeType: string
}

export default function PriceSummary({ totalPrice, currency, accountSize, challengeType }: PriceSummaryProps) {
  const formatPrice = (price: number) => {
    if (currency.id === "ngn") {
      return `₦${price.toLocaleString()}`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex justify-between mb-2">
        <span className="text-gray-500">Challenge Type</span>
        <span className="font-medium">{challengeType}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span className="text-gray-500">Account Size</span>
        <span className="font-medium">{accountSize}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span className="text-gray-500">Platform</span>
        <span className="font-medium">MetaTrader 5</span>
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
        <span className="text-lg font-medium">Total</span>
        <span className="text-xl font-medium">{formatPrice(totalPrice)}</span>
      </div>
    </div>
  )
}
