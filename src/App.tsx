import { Outlet } from '@tanstack/react-router'

export const App = () => {
  return (
    <div className="min-h-screen p-6">
  <Outlet />
    </div>
  )
}
