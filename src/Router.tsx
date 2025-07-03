import {RouterProvider, createRouter, Route, RootRoute} from '@tanstack/react-router';
import { Login } from '../src/Auth/Login';
import  { Register } from '../src/Auth/Register';
import { ForgetPassword }  from '../src/Auth/ForgetPassword';
import {App} from '../src/App';
import { Home } from '../src/Home';
import { TodoList } from '../src/components/TodoList';

const rootRoute = new RootRoute({
  component: App,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
});

const registerRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: Register,
});

const forgetPasswordRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/forget-password',
    component: ForgetPassword,
});

 const todolistRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/todos',
    component: TodoList,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  forgetPasswordRoute,
  homeRoute,
  todolistRoute
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});
export const Router = () => {
  return (
    <RouterProvider router={router} />
  );
}