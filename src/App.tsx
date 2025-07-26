import { Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'

export const App = () => {
  return (
    <div className="min-h-screen p-6">
  <Outlet />
  <Toaster/>
    </div>
  )
}
