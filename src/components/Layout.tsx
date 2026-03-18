import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom'
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
        <>
          <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-none hidden sm:block">
                    Mordomo Virtual
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground leading-snug">
                    {currentUser.name}{' '}
                    <span className="text-xs opacity-70">
                      ({currentUser.role === 'admin' ? 'Gestor' : 'Equipe'})
                    </span>
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
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          {currentUser.role === 'admin' && (
            <nav className="bg-slate-100/80 border-b backdrop-blur-md sticky top-16 z-30">
              <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto py-3 text-sm font-semibold text-slate-600">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-slate-900')}
                >
                  Visão Geral
                </NavLink>
                <NavLink
                  to="/admin/guests"
                  className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-slate-900')}
                >
                  Hóspedes
                </NavLink>
                <NavLink
                  to="/admin/staff"
                  className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-slate-900')}
                >
                  Equipe
                </NavLink>
                <NavLink
                  to="/admin/activities"
                  className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-slate-900')}
                >
                  Rotina Padrão
                </NavLink>
                <NavLink
                  to="/admin/assignments"
                  className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-slate-900')}
                >
                  Atribuições
                </NavLink>
              </div>
            </nav>
          )}
        </>
      )}

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 pb-32">
        <Outlet />
      </main>

      {!isLoginPage && <TimeSimulator />}
    </div>
  )
}
