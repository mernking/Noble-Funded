import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("pricing", "routes/pricing.jsx"),
  route("faq", "routes/faq.jsx"),
  route("contact", "routes/contact.jsx"),
  route("login", "routes/login.jsx"),
  route("signup", "routes/signup.jsx"),
  route("auth/callback", "routes/auth/callback.jsx"),
  layout("routes/dashboard/layout.jsx", [
    route("dashboard", "routes/dashboard/overview.jsx"),
    route("dashboard/challenges", "routes/dashboard/challenges.jsx"),
    route("dashboard/challenges/:id", "routes/dashboard/challenges.$id.jsx"),
    route("dashboard/payouts", "routes/dashboard/payout.jsx"),
    route("dashboard/payouts/:id", "routes/dashboard/payout.$id.jsx"),
    route("dashboard/support", "routes/dashboard/support.jsx"),
    route("dashboard/settings", "routes/dashboard/settings.jsx"),
  ]),
] satisfies RouteConfig;
