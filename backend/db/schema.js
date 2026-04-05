import {
  pgTable,
  uuid,
  varchar,
  boolean,
  decimal,
  integer,
  timestamp,
  text,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }), // nullable for OAuth users
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  country: varchar("country", { length: 2 }).default("NG"),
  role: varchar("role", { length: 20 }).default("trader"), // trader | super_admin | compliance | support | marketing | developer
  status: varchar("status", { length: 20 }).default("active"), // active | banned | suspended
  emailVerified: boolean("email_verified").default(false),
  kycStatus: varchar("kyc_status", { length: 20 }).default("pending"),
  // OAuth fields
  provider: varchar("provider", { length: 20 }).default("email"), // email | google
  supabaseUserId: varchar("supabase_user_id", { length: 255 }), // link to Supabase user
  // Verification fields
  verificationCode: varchar("verification_code", { length: 6 }),
  verificationCodeExpiry: timestamp("verification_code_expiry"),
  // Password reset
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// ─── Challenges ───────────────────────────────────────────────────────────────
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  accountType: varchar("account_type", { length: 10 }).notNull(), // 'naira' | 'dollar'
  startingBalance: decimal("starting_balance", {
    precision: 12,
    scale: 2,
  }).notNull(),
  currentBalance: decimal("current_balance", {
    precision: 12,
    scale: 2,
  }).notNull(),
  currentEquity: decimal("current_equity", {
    precision: 12,
    scale: 2,
  }).notNull(),
  profitTarget: decimal("profit_target", { precision: 12, scale: 2 }).notNull(),
  maxDrawdownPct: decimal("max_drawdown_pct", {
    precision: 5,
    scale: 2,
  }).notNull(),
  maxDailyLossPct: decimal("max_daily_loss_pct", {
    precision: 5,
    scale: 2,
  }).notNull(),
  durationDays: integer("duration_days").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending | active | passed | failed
  mt5Login: varchar("mt5_login", { length: 50 }),
  mt5Password: varchar("mt5_password", { length: 50 }),
  mt5Server: varchar("mt5_server", { length: 100 }),
  phase: integer("phase").default(1),
  startedAt: timestamp("started_at"),
  passedAt: timestamp("passed_at"),
  failedAt: timestamp("failed_at"),
  failedReason: text("failed_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  challengeId: uuid("challenge_id").references(() => challenges.id),
  type: varchar("type", { length: 20 }).notNull(), // challenge_purchase | payout
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(), // NGN | USD
  status: varchar("status", { length: 20 }).default("pending"), // pending | completed | failed
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentProvider: varchar("payment_provider", { length: 50 }),
  providerRef: varchar("provider_ref", { length: 100 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Payouts ──────────────────────────────────────────────────────────────────
export const payouts = pgTable("payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  challengeId: uuid("challenge_id").references(() => challenges.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending | approved | rejected | paid
  payoutMethod: varchar("payout_method", { length: 50 }),
  bankName: varchar("bank_name", { length: 100 }),
  accountNumber: varchar("account_number", { length: 50 }),
  accountName: varchar("account_name", { length: 100 }),
  usdtAddress: varchar("usdt_address", { length: 100 }),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectedReason: text("rejected_reason"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Team Members ─────────────────────────────────────────────────────────────
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  role: varchar("role", { length: 50 }).notNull(),
  permissions: jsonb("permissions").notNull(),
  addedBy: uuid("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Support Tickets ─────────────────────────────────────────────────────────
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  assignedTo: uuid("assigned_to").references(() => users.id),
  subject: varchar("subject", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).default("open"), // open | in_progress | resolved | closed
  priority: varchar("priority", { length: 20 }).default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ticketReplies = pgTable("ticket_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").references(() => supportTickets.id),
  userId: uuid("user_id").references(() => users.id),
  message: text("message").notNull(),
  isInternal: boolean("is_internal").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Activity Logs ────────────────────────────────────────────────────────────
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }),
  resourceId: uuid("resource_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── System Settings ──────────────────────────────────────────────────────────
export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // string | number | boolean | json
  description: text("description"),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Affiliates ───────────────────────────────────────────────────────────────
export const affiliates = pgTable("affiliates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).unique(),
  referralCode: varchar("referral_code", { length: 20 }).unique().notNull(),
  totalReferrals: integer("total_referrals").default(0),
  activeReferrals: integer("active_referrals").default(0),
  totalEarned: decimal("total_earned", { precision: 12, scale: 2 }).default("0"),
  pendingPayout: decimal("pending_payout", { precision: 12, scale: 2 }).default("0"),
  conversionRate: integer("conversion_rate").default(0),
  status: varchar("status", { length: 20 }).default("pending"), // pending | active | suspended
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Affiliate Referrals ─────────────────────────────────────────────────────
export const affiliateReferrals = pgTable("affiliate_referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  affiliateId: uuid("affiliate_id").references(() => affiliates.id),
  referredUserId: uuid("referred_user_id").references(() => users.id),
  referralDate: timestamp("referral_date").defaultNow(),
  commissionAmount: decimal("commission_amount", { precision: 12, scale: 2 }).default("0"),
  commissionStatus: varchar("commission_status", { length: 20 }).default("pending"), // pending | paid | cancelled
  createdAt: timestamp("created_at").defaultNow(),
});
