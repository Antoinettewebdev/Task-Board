import { Route } from "@tanstack/react-router";
import { rootRoute } from "@/routes/root";
import { ForgetPassword } from "@/components/Auth/ForgetPassword";

export const forgetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/forget-password",
  component: ForgetPassword,
});
