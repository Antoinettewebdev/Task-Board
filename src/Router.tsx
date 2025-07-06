import {
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import { rootRoute } from "./routes/root";
import { homeRoute } from "./routes/home";
import { loginRoute } from "./routes/login";
import { registerRoute } from "./routes/register";
import { forgetPasswordRoute } from "./routes/forget-password";
import { todolistRoute } from "./routes/todos";

// Assemble tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  forgetPasswordRoute,
  todolistRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

export const Router = () => <RouterProvider router={router} />;
