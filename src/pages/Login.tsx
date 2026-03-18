import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle, ShieldAlert } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Login() {
  const { currentUser, users, guests, login, setTimeMinutes } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [currentUser, navigate])

  const handleLogin = (user: (typeof users)[0]) => {
    setTimeMinutes(420) // Reset time to 07:00 on fresh login
    login(user)
  }

  const staff = users.filter((u) => u.role === 'staff')
  const admins = users.filter((u) => u.role === 'admin')

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in-up">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
          <ShieldAlert className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Mordomo Virtual</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Selecione um perfil abaixo para acessar o sistema automatizado de rotinas e alertas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl">
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Equipe de Cuidados</CardTitle>
            <CardDescription>Responsável pela rotina diária dos hóspedes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {staff.map((user) => {
              const guest = guests.find((g) => g.id === user.guestId)
              return (
                <Button
                  key={user.id}
                  variant="outline"
                  className="w-full justify-start h-14 text-base font-medium"
                  onClick={() => handleLogin(user)}
                >
                  <UserCircle className="w-5 h-5 mr-3 text-blue-500" />
                  Entrar como {user.name}
                  {guest && (
                    <span className="ml-auto text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                      {guest.name}
                    </span>
                  )}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-destructive/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Administração</CardTitle>
            <CardDescription>Monitora a clínica e recebe alertas críticos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {admins.map((user) => (
              <Button
                key={user.id}
                variant="default"
                className="w-full justify-start h-14 text-base font-medium bg-slate-900 hover:bg-slate-800"
                onClick={() => handleLogin(user)}
              >
                <ShieldAlert className="w-5 h-5 mr-3 text-red-400" />
                Entrar como {user.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
