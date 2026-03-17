import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User as UserIcon } from 'lucide-react'
import useAppStore from '@/stores/main'
import { TimeSimulator } from './TimeSimulator'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { currentUser, logout } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isLoginPage = location.pathname === '/login'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isLoginPage && currentUser && (
        <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none hidden sm:block">Virtual Butler</h1>
                <p className="text-sm font-medium text-muted-foreground leading-snug">
                  {currentUser.name}{' '}
                  <span className="text-xs opacity-70">({currentUser.role})</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>
      )}

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 pb-32">
        <Outlet />
      </main>

      {!isLoginPage && <TimeSimulator />}
    </div>
  )
}
