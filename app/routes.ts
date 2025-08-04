import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/timers.tsx"),
  route("/create-timer", "routes/create-timer.tsx"),
  route("/timer/:timerId", "routes/details.tsx"),
] satisfies RouteConfig;
