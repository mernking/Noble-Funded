import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.jsx"),
  layout("routes/layout.jsx", [
    index("routes/dashboard.jsx"),
    route("compliance", "routes/compliance.jsx"),
    route("support", "routes/support-dashboard.jsx"),
    route("marketing", "routes/marketing.jsx"),
    route("dev", "routes/developer.jsx"),
    route("users", "routes/users.jsx"),
    route("users/:id", "routes/users.$id.jsx"),
    route("challenges", "routes/challenges.jsx"),
    route("payouts", "routes/payouts.jsx"),
    route("revenue", "routes/revenue.jsx"),
    route("team", "routes/team.jsx"),
    route("activity", "routes/activity.jsx"),
    route("settings", "routes/admin-settings.jsx"),
  ]),
] satisfies RouteConfig;
