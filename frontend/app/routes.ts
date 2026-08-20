import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("gestao", "routes/gestao.tsx"),
  route("transparencia", "routes/transparencia.tsx"),
] satisfies RouteConfig;
