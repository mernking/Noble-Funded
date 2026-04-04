// Noble Funded - Mock Data & Types

export type Currency = "NGN" | "USD"
export type AccountStatus = "active" | "challenge_phase1" | "challenge_phase2" | "failed" | "passed" | "funded"
export type AccountType = "naira" | "dollar"

export interface TradingAccount {
  id: string
  accountNumber: string
  type: AccountType
  currency: Currency
  status: AccountStatus
  balance: number
  startingBalance: number
  profitTarget: number // percentage
  maxDailyDrawdown: number // percentage
  maxOverallDrawdown: number // percentage
  currentProfit: number // percentage
  currentDailyDrawdown: number // percentage
  currentOverallDrawdown: number // percentage
  phase: 1 | 2 | null
  leverage: string
  platform: string
  server: string
  login: string
  password: string
  profitSplit: number // percentage
  createdAt: string
  trades: Trade[]
}

export interface Trade {
  id: string
  ticket: string
  symbol: string
  type: "buy" | "sell"
  lots: number
  openPrice: number
  closePrice: number
  openTime: string
  closeTime: string
  profit: number
  currency: Currency
  pips: number
  commission: number
  swap: number
}

export interface PayoutRequest {
  id: string
  accountId: string
  amount: number
  currency: Currency
  status: "pending" | "processing" | "paid" | "rejected"
  method: string
  requestedAt: string
  paidAt?: string
  reference?: string
}

export interface AffiliateData {
  referralCode: string
  referralLink: string
  totalReferrals: number
  pendingReferrals: number
  totalEarnings: number
  currency: Currency
  referrals: Referral[]
}

export interface Referral {
  id: string
  name: string
  email: string
  joinedAt: string
  status: "pending" | "converted" | "active"
  commission: number
  currency: Currency
}

export interface LeaderboardEntry {
  rank: number
  name: string
  country: string
  profit: number
  currency: Currency
  accountSize: number
  badge?: "top" | "rising"
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  country: string
  joinedAt: string
  kycStatus: "verified" | "pending" | "unverified"
  avatar?: string
  totalPayouts: number
  totalProfits: number
}

// --- MOCK DATA ---

export const mockUser: UserProfile = {
  id: "user_001",
  name: "Adebayo Ogundimu",
  email: "adebayo@example.com",
  phone: "+234 801 234 5678",
  country: "Nigeria",
  joinedAt: "2024-11-15",
  kycStatus: "verified",
  totalPayouts: 680000,
  totalProfits: 850000,
}

const generateTrades = (currency: Currency, count: number): Trade[] => {
  const symbols = ["XAUUSD", "EURUSD", "GBPUSD", "NAS100", "US30", "BTCUSD", "USOIL"]
  const trades: Trade[] = []
  for (let i = 0; i < count; i++) {
    const profit = (Math.random() - 0.4) * (currency === "NGN" ? 15000 : 120)
    const type = Math.random() > 0.5 ? "buy" : "sell"
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const date = new Date(Date.now() - i * 86400000 * Math.random() * 3)
    trades.push({
      id: `trade_${i}`,
      ticket: `${100000 + i}`,
      symbol,
      type,
      lots: parseFloat((Math.random() * 1.5 + 0.01).toFixed(2)),
      openPrice: 1.08 + Math.random() * 0.02,
      closePrice: 1.08 + Math.random() * 0.02,
      openTime: new Date(date.getTime() - 3600000 * Math.random() * 8).toISOString(),
      closeTime: date.toISOString(),
      profit: parseFloat(profit.toFixed(2)),
      currency,
      pips: parseFloat((profit * (currency === "NGN" ? 0.001 : 0.8)).toFixed(1)),
      commission: parseFloat((-Math.abs(profit) * 0.02).toFixed(2)),
      swap: parseFloat((-Math.random() * 5).toFixed(2)),
    })
  }
  return trades
}

// --- CHALLENGE PRICING ---

export interface ChallengePricing {
  accountSize: number
  challengeFee: number
  currency: Currency
  label: string
}

export const nairaChallengePricing: ChallengePricing[] = [
  { accountSize: 200000, challengeFee: 10000, currency: "NGN", label: "₦200,000" },
  { accountSize: 400000, challengeFee: 19000, currency: "NGN", label: "₦400,000" },
  { accountSize: 600000, challengeFee: 29000, currency: "NGN", label: "₦600,000" },
  { accountSize: 800000, challengeFee: 39000, currency: "NGN", label: "₦800,000" },
  { accountSize: 1000000, challengeFee: 54000, currency: "NGN", label: "₦1,000,000" },
  { accountSize: 3000000, challengeFee: 190000, currency: "NGN", label: "₦3,000,000" },
]

export const dollarChallengePricing: ChallengePricing[] = [
  { accountSize: 5000, challengeFee: 29.99, currency: "USD", label: "$5,000" },
  { accountSize: 10000, challengeFee: 59.99, currency: "USD", label: "$10,000" },
  { accountSize: 25000, challengeFee: 134.99, currency: "USD", label: "$25,000" },
  { accountSize: 50000, challengeFee: 219.99, currency: "USD", label: "$50,000" },
  { accountSize: 100000, challengeFee: 379.99, currency: "USD", label: "$100,000" },
  { accountSize: 200000, challengeFee: 749.99, currency: "USD", label: "$200,000" },
]

export const mockAccounts: TradingAccount[] = [
  {
    id: "acc_001",
    accountNumber: "NF-NG-800K",
    type: "naira",
    currency: "NGN",
    status: "funded",
    balance: 860000,
    startingBalance: 800000,
    profitTarget: 10,
    maxDailyDrawdown: 0,
    maxOverallDrawdown: 20,
    currentProfit: 7.5,
    currentDailyDrawdown: 0,
    currentOverallDrawdown: 2.1,
    phase: null,
    leverage: "1:100",
    platform: "MT5",
    server: "NobleFunded-Live",
    login: "5001234",
    password: "Nb****56",
    profitSplit: 80,
    createdAt: "2024-12-01",
    trades: generateTrades("NGN", 24),
  },
  {
    id: "acc_002",
    accountNumber: "NF-NG-400K-P1",
    type: "naira",
    currency: "NGN",
    status: "challenge_phase1",
    balance: 419200,
    startingBalance: 400000,
    profitTarget: 10,
    maxDailyDrawdown: 0,
    maxOverallDrawdown: 20,
    currentProfit: 4.8,
    currentDailyDrawdown: 0,
    currentOverallDrawdown: 1.5,
    phase: 1,
    leverage: "1:100",
    platform: "MT5",
    server: "NobleFunded-Demo",
    login: "5005678",
    password: "Nb****78",
    profitSplit: 80,
    createdAt: "2025-01-10",
    trades: generateTrades("NGN", 12),
  },
  {
    id: "acc_003",
    accountNumber: "NF-USD-10K",
    type: "dollar",
    currency: "USD",
    status: "challenge_phase2",
    balance: 10620,
    startingBalance: 10000,
    profitTarget: 5,
    maxDailyDrawdown: 3,
    maxOverallDrawdown: 10,
    currentProfit: 6.2,
    currentDailyDrawdown: 0.5,
    currentOverallDrawdown: 1.8,
    phase: 2,
    leverage: "1:100",
    platform: "MT5",
    server: "NobleFunded-Demo",
    login: "5009999",
    password: "Nb****99",
    profitSplit: 80,
    createdAt: "2025-02-14",
    trades: generateTrades("USD", 18),
  },
  {
    id: "acc_004",
    accountNumber: "NF-USD-5K",
    type: "dollar",
    currency: "USD",
    status: "failed",
    balance: 4500,
    startingBalance: 5000,
    profitTarget: 10,
    maxDailyDrawdown: 3,
    maxOverallDrawdown: 10,
    currentProfit: -10,
    currentDailyDrawdown: 3.1,
    currentOverallDrawdown: 10,
    phase: 1,
    leverage: "1:100",
    platform: "MT5",
    server: "NobleFunded-Demo",
    login: "5007777",
    password: "Nb****77",
    profitSplit: 80,
    createdAt: "2025-01-05",
    trades: generateTrades("USD", 8),
  },
]

export const mockPayouts: PayoutRequest[] = [
  {
    id: "pay_001",
    accountId: "acc_001",
    amount: 680000,
    currency: "NGN",
    status: "paid",
    method: "Bank Transfer (GTBank)",
    requestedAt: "2025-02-15T09:00:00Z",
    paidAt: "2025-02-15T14:32:00Z",
    reference: "NOB-PAY-8821",
  },
  {
    id: "pay_002",
    accountId: "acc_001",
    amount: 320000,
    currency: "NGN",
    status: "paid",
    method: "Bank Transfer (Access Bank)",
    requestedAt: "2025-03-01T11:00:00Z",
    paidAt: "2025-03-01T18:14:00Z",
    reference: "NOB-PAY-9104",
  },
  {
    id: "pay_003",
    accountId: "acc_001",
    amount: 180000,
    currency: "NGN",
    status: "processing",
    method: "Bank Transfer (Opay)",
    requestedAt: "2025-03-20T08:00:00Z",
    reference: "NOB-PAY-9502",
  },
]

export const mockAffiliate: AffiliateData = {
  referralCode: "NOBLE-ADE123",
  referralLink: "https://noblefunded.com/ref/ADE123",
  totalReferrals: 12,
  pendingReferrals: 3,
  totalEarnings: 47800,
  currency: "NGN",
  referrals: [
    // 10% of ₦39,000 = ₦3,900
    { id: "r1", name: "Chinedu Okafor", email: "chi***@gmail.com", joinedAt: "2025-01-12", status: "active", commission: 3900, currency: "NGN" },
    // 10% of ₦54,000 = ₦5,400
    { id: "r2", name: "Amina Bello", email: "ami***@yahoo.com", joinedAt: "2025-01-28", status: "active", commission: 5400, currency: "NGN" },
    // 10% of ₦29,000 = ₦2,900
    { id: "r3", name: "Tunde Adekunle", email: "tun***@gmail.com", joinedAt: "2025-02-03", status: "converted", commission: 2900, currency: "NGN" },
    // 10% of ₦19,000 = ₦1,900
    { id: "r4", name: "Ngozi Eze", email: "ngo***@gmail.com", joinedAt: "2025-02-20", status: "active", commission: 1900, currency: "NGN" },
    // 10% of $59.99 ≈ $6.00
    { id: "r5", name: "Biodun Fasanya", email: "bio***@gmail.com", joinedAt: "2025-02-25", status: "active", commission: 6, currency: "USD" },
    // 10% of $134.99 ≈ $13.50
    { id: "r6", name: "Kelechi Onyeka", email: "kel***@gmail.com", joinedAt: "2025-03-01", status: "converted", commission: 13.5, currency: "USD" },
    { id: "r7", name: "Emeka Nwankwo", email: "eme***@gmail.com", joinedAt: "2025-03-05", status: "pending", commission: 0, currency: "NGN" },
    { id: "r8", name: "Blessing Obi", email: "ble***@yahoo.com", joinedAt: "2025-03-10", status: "pending", commission: 0, currency: "NGN" },
  ],
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Adebayo S.", country: "NG", profit: 32.4, currency: "NGN", accountSize: 500000, badge: "top" },
  { rank: 2, name: "Chidinma I.", country: "NG", profit: 28.1, currency: "USD", accountSize: 50000, badge: "top" },
  { rank: 3, name: "Tunde M.", country: "NG", profit: 24.7, currency: "NGN", accountSize: 200000 },
  { rank: 4, name: "Emeka O.", country: "NG", profit: 22.3, currency: "NGN", accountSize: 100000, badge: "rising" },
  { rank: 5, name: "Blessing N.", country: "NG", profit: 19.8, currency: "USD", accountSize: 10000 },
  { rank: 6, name: "Ngozi P.", country: "NG", profit: 18.5, currency: "NGN", accountSize: 50000 },
  { rank: 7, name: "Yusuf H.", country: "NG", profit: 17.2, currency: "USD", accountSize: 25000 },
  { rank: 8, name: "Amina B.", country: "NG", profit: 16.4, currency: "NGN", accountSize: 100000, badge: "rising" },
  { rank: 9, name: "Obinna L.", country: "NG", profit: 15.9, currency: "NGN", accountSize: 50000 },
  { rank: 10, name: "Adebayo O.", country: "NG", profit: 14.3, currency: "USD", accountSize: 10000 },
]

// Equity curve data for charts
export const generateEquityCurve = (days: number, startBalance: number, volatility: number = 0.02) => {
  const data = []
  let balance = startBalance
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000)
    const change = balance * volatility * (Math.random() - 0.38)
    balance = Math.max(startBalance * 0.88, balance + change)
    data.push({
      date: date.toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
      balance: parseFloat(balance.toFixed(2)),
      profit: parseFloat((balance - startBalance).toFixed(2)),
    })
  }
  return data
}

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === "NGN") {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const getStatusLabel = (status: AccountStatus): string => {
  const map: Record<AccountStatus, string> = {
    active: "Active",
    challenge_phase1: "Phase 1",
    challenge_phase2: "Phase 2",
    failed: "Failed",
    passed: "Passed",
    funded: "Funded",
  }
  return map[status]
}

export const getStatusClass = (status: AccountStatus): string => {
  const map: Record<AccountStatus, string> = {
    active: "badge-active",
    challenge_phase1: "badge-challenge",
    challenge_phase2: "badge-challenge",
    failed: "badge-failed",
    passed: "badge-passed",
    funded: "badge-active",
  }
  return map[status]
}

export const weeklyProfitData = [
  { day: "Mon", profit: 2.1, loss: -0.8 },
  { day: "Tue", profit: 1.5, loss: -1.2 },
  { day: "Wed", profit: 3.2, loss: -0.5 },
  { day: "Thu", profit: 0.8, loss: -2.1 },
  { day: "Fri", profit: 2.9, loss: -0.3 },
  { day: "Sat", profit: 1.1, loss: -0.7 },
  { day: "Sun", profit: 0.5, loss: -0.2 },
]

export const monthlyProfitData = [
  { month: "Oct", profit: 5.2 },
  { month: "Nov", profit: 8.1 },
  { month: "Dec", profit: -2.3 },
  { month: "Jan", profit: 11.4 },
  { month: "Feb", profit: 7.5 },
  { month: "Mar", profit: 4.2 },
]

export const instrumentBreakdown = [
  { name: "XAUUSD", value: 38, fill: "#a7ffeb" },
  { name: "EURUSD", value: 22, fill: "#14655b" },
  { name: "NAS100", value: 18, fill: "#4dd9b8" },
  { name: "US30", value: 12, fill: "#ffd166" },
  { name: "Other", value: 10, fill: "#7ab8ac" },
]
