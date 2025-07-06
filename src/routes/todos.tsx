import { Route } from "@tanstack/react-router";
import { rootRoute } from "@/routes/root";
import { TodoList } from "@/components/Task/TodoList";

export const todolistRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/todos",
  component: TodoList,
});
