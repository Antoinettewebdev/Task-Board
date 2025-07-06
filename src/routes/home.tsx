import { Route } from "@tanstack/react-router";
import { rootRoute } from "@/routes/root";
import { Home } from "@/components/Home/Home";

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
