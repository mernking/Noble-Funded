# Noble-Funded

## Comprehensive Integration Plan

Based on my analysis of the codebase, here's a detailed plan to connect the Super Admin Dashboard to the live backend API:

### **Backend API Available**
The backend already provides well-structured API endpoints:
- `GET /api/dev/admin/dashboard/stats` - Overview KPIs (✓ already integrated in Overview.tsx)
- `GET /api/dev/admin/users` - User listing with filters, ban/flag/unban/unflag actions
- `GET /api/dev/admin/challenges` - Challenge management
- `GET /api/dev/admin/payouts` - Payout management
- `GET /api/dev/admin/revenue` - Revenue data
- `GET /api/dev/admin/settings` - System settings
- `GET /api/dev/admin/team` - Team member management
- `GET /api/dev/admin/support` - Support tickets
- `GET /api/dev/admin/activity-logs` - Activity logs

### **Views Requiring Updates (25 files)**

**Tier 1 - High Priority (Core Admin Functions):**
1. **Overview.tsx** - Already fetching stats, needs: revenue chart data, challenge breakdown, user growth, activity feed from API
2. **Users.tsx** - Already fetching, needs: proper pagination, status filters
3. **Challenges.tsx** - No API, needs complete integration
4. **Payouts.tsx** - Already fetching, needs: approve/reject actions

**Tier 2 - Secondary (Business Functions):**
5. Revenue.tsx
6. Affiliates.tsx
7. Leaderboard.tsx
8. Certificates.tsx
9. KYC.tsx
10. Team.tsx
11. ActivityLogs.tsx

**Tier 3 - Settings & Configuration:**
12. Settings.tsx
13. Rules.tsx
14. RiskEngine.tsx
15. PromoCodes.tsx
16. PaymentGateway.tsx
17. BrokerAPI.tsx
18. FXRateEngine.tsx
19. RuleConfigMatrix.tsx

**Tier 4 - Advanced/Reports:**
20. ChallengePlans.tsx
21. MT5Accounts.tsx
22. TraderPerformance.tsx
23. AdvancedReporting.tsx
24. GlobalCommand.tsx
25. StaffPermissions.tsx

### **Implementation Approach**

**Phase 1: Core Data Integration**
- Update each view to fetch data from corresponding API endpoint
- Replace all hardcoded arrays (revenueData, challengeData, etc.) with API calls
- Implement loading states and error handling

**Phase 2: Action Integration**
- Connect all buttons (approve/reject, ban/unban, enable/disable) to API actions
- Add proper toast notifications for actions

**Phase 3: Polish & Optimization**
- Add proper pagination
- Implement search/filter functionality
- Remove remaining mock data

### **Schema Match**
The current schema (`backend/db/schema.js`) matches well with the API requirements. The main tables (users, challenges, payouts, transactions, activityLogs) are properly defined.

### **Role-Based Access**
Already implemented in backend via `requireRole` decorator. Frontend needs to ensure proper UI rendering based on user role (already handled in page.tsx).

---

**This is a large-scale task affecting 25+ files. Should I proceed with the implementation? I can work through it systematically view by view.**