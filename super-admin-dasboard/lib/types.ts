export type Role = "Super Admin" | "Compliance" | "Support" | "Marketing" | "Developer";

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  badge?: number;
};

export type RoleConfig = {
  role: Role;
  subtitle: string;
  defaultTab: string;
  navItems: NavItem[];
};

export type NotifType = "success" | "warning" | "danger" | "info" | "payout" | "user" | "system";

export type RoleNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotifType;
  read: boolean;
  category: string;
};

// ─── Role-specific notification data ─────────────────────────────────────────

export const ROLE_NOTIFICATIONS: Record<Role, RoleNotification[]> = {
  "Super Admin": [
    { id: "sa1", title: "Payout Approved", message: "Jane Adeyemi's payout of ₦45,000 was approved by compliance.", time: "2 min ago", type: "success", read: false, category: "Payouts" },
    { id: "sa2", title: "New User Registration", message: "New trader registered: ID #4821 — Chidi Okonkwo. KYC pending.", time: "14 min ago", type: "user", read: false, category: "Users" },
    { id: "sa3", title: "Challenge Completed", message: "Mark S. (ID #3012) passed Phase 1 — ₦800K Naira challenge.", time: "45 min ago", type: "success", read: false, category: "Challenges" },
    { id: "sa4", title: "Drawdown Alert — Critical", message: "Alex Thorne has reached 91.4% of max drawdown limit. Account at risk.", time: "1 hr ago", type: "danger", read: false, category: "Compliance" },
    { id: "sa5", title: "Payout Flagged", message: "Musa Okoro's payout request flagged for unusual IP address mismatch.", time: "2 hr ago", type: "warning", read: false, category: "Payouts" },
    { id: "sa6", title: "KYC Document Submitted", message: "Emeka Nwachukwu submitted identity documents. Awaiting review.", time: "3 hr ago", type: "info", read: true, category: "KYC" },
    { id: "sa7", title: "System Maintenance Window", message: "Scheduled maintenance on MT5 server NF-LIVE-02 from 02:00–04:00 UTC.", time: "5 hr ago", type: "system", read: true, category: "System" },
    { id: "sa8", title: "Revenue Milestone", message: "Platform crossed ₦50M total revenue this month. New record.", time: "8 hr ago", type: "success", read: true, category: "Revenue" },
    { id: "sa9", title: "Compliance Violation", message: "3 accounts triggered simultaneous-trade rule. Auto-flagged for review.", time: "1 day ago", type: "danger", read: true, category: "Compliance" },
    { id: "sa10", title: "New Challenge Plan", message: "Elite $100K challenge plan activated and live on the platform.", time: "1 day ago", type: "info", read: true, category: "Challenges" },
    { id: "sa11", title: "Affiliate Payout", message: "Affiliate Tosin Abiodun earned ₦12,000 commission — 3 referrals.", time: "2 days ago", type: "payout", read: true, category: "Affiliates" },
    { id: "sa12", title: "MT5 Server Warning", message: "NF-DEMO-01 latency spike detected: 420ms. Monitoring in progress.", time: "2 days ago", type: "warning", read: true, category: "System" },
  ],
  "Compliance": [
    { id: "co1", title: "Payout Pending Review", message: "Jane Adeyemi's payout of ₦45,000 requires your approval.", time: "5 min ago", type: "payout", read: false, category: "Payouts" },
    { id: "co2", title: "Drawdown Alert — Critical", message: "Alex Thorne has reached 91.4% of max drawdown. Action required.", time: "1 hr ago", type: "danger", read: false, category: "Violations" },
    { id: "co3", title: "Account Flagged", message: "Musa Okoro flagged for IP mismatch on payout request #4892.", time: "2 hr ago", type: "warning", read: false, category: "Flagged" },
    { id: "co4", title: "KYC Review Required", message: "3 new KYC submissions awaiting compliance verification.", time: "3 hr ago", type: "info", read: true, category: "KYC" },
    { id: "co5", title: "Violation Auto-Closed", message: "Daily loss violation for account MT5-78821 resolved automatically.", time: "6 hr ago", type: "success", read: true, category: "Violations" },
    { id: "co6", title: "Simultaneous Trade Rule", message: "3 accounts triggered simultaneous-trade rule. Requires manual review.", time: "1 day ago", type: "danger", read: true, category: "Violations" },
  ],
  "Support": [
    { id: "sp1", title: "New High-Priority Ticket", message: "Ticket #TKT-5024 opened: Payment not reflecting on account.", time: "3 min ago", type: "danger", read: false, category: "Tickets" },
    { id: "sp2", title: "Ticket Assigned to You", message: "Ticket #TKT-5021 assigned to your queue by team lead.", time: "22 min ago", type: "info", read: false, category: "Tickets" },
    { id: "sp3", title: "Password Reset Requested", message: "Amara Obi (ID #4811) requested a password reset. Pending action.", time: "1 hr ago", type: "warning", read: false, category: "Users" },
    { id: "sp4", title: "Ticket Resolved", message: "Ticket #TKT-5018 marked as resolved by customer.", time: "3 hr ago", type: "success", read: false, category: "Tickets" },
    { id: "sp5", title: "Escalation Notice", message: "Ticket #TKT-5015 escalated to compliance by customer — 3 days open.", time: "5 hr ago", type: "warning", read: true, category: "Tickets" },
    { id: "sp6", title: "New User Message", message: "Chidi Okonkwo sent a message about MT5 login credentials.", time: "8 hr ago", type: "info", read: true, category: "Messages" },
  ],
  "Marketing": [
    { id: "mk1", title: "Campaign Goal Reached", message: "Q1 Nigerian market campaign exceeded 150% of registration target.", time: "1 hr ago", type: "success", read: false, category: "Campaigns" },
    { id: "mk2", title: "Traffic Spike Detected", message: "Organic traffic up 340% from yesterday. Source: Twitter/X post.", time: "3 hr ago", type: "info", read: false, category: "Traffic" },
    { id: "mk3", title: "Conversion Drop Alert", message: "Checkout page conversion dropped 12% in last 24 hours. Investigate.", time: "6 hr ago", type: "warning", read: false, category: "Conversions" },
    { id: "mk4", title: "Affiliate Milestone", message: "Affiliate program passed 100 active referrers this week.", time: "1 day ago", type: "success", read: true, category: "Affiliates" },
    { id: "mk5", title: "New Campaign Approved", message: "Instagram Reel campaign #4 approved and scheduled to go live.", time: "2 days ago", type: "info", read: true, category: "Campaigns" },
  ],
  "Developer": [
    { id: "dv1", title: "Critical Error Spike", message: "Error rate increased 400% in last 15 minutes. API endpoint /api/mt5/balance throwing 500s.", time: "2 min ago", type: "danger", read: false, category: "Errors" },
    { id: "dv2", title: "Deployment Failed", message: "Production deploy v2.4.1 failed at build step. Rollback triggered.", time: "35 min ago", type: "danger", read: false, category: "Deploy" },
    { id: "dv3", title: "Database Query Slow", message: "Query on challenges table averaging 4.2s. Index optimization needed.", time: "2 hr ago", type: "warning", read: false, category: "Database" },
    { id: "dv4", title: "Deployment Succeeded", message: "Production deploy v2.4.0 completed successfully. All health checks passed.", time: "5 hr ago", type: "success", read: true, category: "Deploy" },
    { id: "dv5", title: "MT5 Server Latency", message: "NF-DEMO-01 latency spike: 420ms. Monitoring automated alert sent.", time: "8 hr ago", type: "warning", read: true, category: "System" },
    { id: "dv6", title: "Backup Completed", message: "Nightly database backup completed successfully. Size: 2.3GB.", time: "1 day ago", type: "success", read: true, category: "System" },
  ],
};

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  "Super Admin": {
    role: "Super Admin",
    subtitle: "INSTITUTIONAL GRADE",
    defaultTab: "overview",
    navItems: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "users", label: "Users", icon: "Users" },
      { id: "challenges", label: "Challenges", icon: "Trophy" },
      { id: "challenge-plans", label: "Challenge Plans", icon: "PackageOpen" },
      { id: "mt5-accounts", label: "MT5 Accounts", icon: "Server" },
      { id: "payouts", label: "Payouts", icon: "CreditCard" },
      { id: "revenue", label: "Revenue", icon: "TrendingUp" },
      { id: "affiliates", label: "Affiliates", icon: "Share2" },
      { id: "leaderboard", label: "Leaderboard", icon: "Medal" },
      { id: "certificates", label: "Certificates", icon: "Award" },
      { id: "rules", label: "Rules", icon: "BookOpen" },
      { id: "kyc", label: "KYC Center", icon: "ShieldCheck" },
      { id: "risk-engine", label: "Risk Engine", icon: "ShieldAlert" },
      { id: "promo-codes", label: "Promo Codes", icon: "Tag" },
      { id: "payment-gateway", label: "Payment Gateway", icon: "Wallet" },
      { id: "broker-api", label: "Broker API", icon: "Plug" },
      { id: "fx-rate", label: "FX Rate Engine", icon: "DollarSign" },
      { id: "broadcast", label: "Broadcast Center", icon: "Megaphone" },
      { id: "trader-performance", label: "Trader Analytics", icon: "BarChart2" },
      { id: "advanced-reporting", label: "Reports", icon: "FileBarChart" },
      { id: "global-command", label: "Command Center", icon: "Globe" },
      { id: "notifications", label: "Notifications", icon: "Bell", badge: 5 },
      { id: "team", label: "Team", icon: "UsersRound" },
      { id: "staff-permissions", label: "Permissions", icon: "Lock" },
      { id: "settings", label: "Settings", icon: "Settings" },
      { id: "rule-config-matrix", label: "Rule Config Matrix", icon: "SlidersHorizontal" },
      { id: "manual-override", label: "Manual Override", icon: "RotateCcw" },
      { id: "activity-logs", label: "Activity Logs", icon: "Activity" },
    ],
  },
  "Compliance": {
    role: "Compliance",
    subtitle: "COMPLIANCE OFFICER",
    defaultTab: "overview",
    navItems: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "monitor", label: "Monitor", icon: "Monitor" },
      { id: "risk-escalation", label: "Risk Escalation", icon: "ShieldAlert", badge: 4 },
      { id: "manual-override", label: "Manual Override", icon: "RotateCcw" },
      { id: "payouts", label: "Payouts", icon: "CreditCard" },
      { id: "flagged", label: "Flagged Accounts", icon: "Flag", badge: 3 },
      { id: "violations", label: "Violations Log", icon: "AlertTriangle" },
      { id: "leaderboard-mod", label: "Leaderboard Mod", icon: "Medal" },
      { id: "reports", label: "Reports", icon: "FileText" },
      { id: "notifications", label: "Notifications", icon: "Bell", badge: 3 },
    ],
  },
  "Support": {
    role: "Support",
    subtitle: "SUPPORT CENTER",
    defaultTab: "tickets",
    navItems: [
      { id: "tickets", label: "Ticket Queue", icon: "Ticket", badge: 128 },
      { id: "users", label: "Users", icon: "Users" },
      { id: "manual-override", label: "Manual Override", icon: "RotateCcw" },
      { id: "certificate-manager", label: "Certificates", icon: "Award" },
      { id: "leaderboard-mod", label: "Leaderboard Mod", icon: "Medal" },
      { id: "broadcast", label: "Broadcast Center", icon: "Megaphone" },
      { id: "faq", label: "FAQ Manager", icon: "HelpCircle" },
      { id: "messages", label: "Messages", icon: "MessageSquare" },
      { id: "notifications", label: "Notifications", icon: "Bell", badge: 4 },
    ],
  },
  "Marketing": {
    role: "Marketing",
    subtitle: "GROWTH & ANALYTICS",
    defaultTab: "overview",
    navItems: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "traffic", label: "Traffic", icon: "BarChart2" },
      { id: "sources", label: "Traffic Sources", icon: "GitBranch" },
      { id: "conversions", label: "Conversions", icon: "Target" },
      { id: "campaigns", label: "Campaigns", icon: "Megaphone" },
      { id: "competitions", label: "Competitions", icon: "Trophy" },
      { id: "promo-codes", label: "Promo Codes", icon: "Tag" },
      { id: "broadcast", label: "Broadcast Center", icon: "Send" },
      { id: "affiliates", label: "Affiliates", icon: "Share2" },
      { id: "reports", label: "Reports", icon: "FileBarChart" },
      { id: "notifications", label: "Notifications", icon: "Bell", badge: 1 },
    ],
  },
  "Developer": {
    role: "Developer",
    subtitle: "DEVELOPER CONSOLE",
    defaultTab: "system",
    navItems: [
      { id: "system", label: "System Status", icon: "Cpu" },
      { id: "logs", label: "System Logs", icon: "Terminal" },
      { id: "errors", label: "Error Tracker", icon: "AlertCircle", badge: 6 },
      { id: "webhook-monitor", label: "Webhook Monitor", icon: "Webhook" },
      { id: "deploy", label: "Deployments", icon: "Rocket" },
      { id: "database", label: "Database", icon: "Database" },
      { id: "broker-api", label: "Broker API", icon: "Plug" },
      { id: "notifications", label: "Notifications", icon: "Bell", badge: 3 },
    ],
  },
};
