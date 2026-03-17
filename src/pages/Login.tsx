import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle, ShieldAlert } from 'lucide-react'
import useAppStore from '@/stores/main'
import { USERS } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Login() {
  const { currentUser, login, setTimeMinutes } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'nurse' ? '/admin' : '/dashboard')
    }
  }, [currentUser, navigate])

  const handleLogin = (user: (typeof USERS)[0]) => {
    setTimeMinutes(420) // Reset time to 07:00 on fresh login for demo purposes
    login(user)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in-up">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
          <ShieldAlert className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Virtual Butler Demo</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Select a role below to experience the automated routine and escalation system.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl">
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Care Staff</CardTitle>
            <CardDescription>Responsible for daily routines of assigned guests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {USERS.filter((u) => u.role === 'staff').map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-start h-14 text-base font-medium"
                onClick={() => handleLogin(user)}
              >
                <UserCircle className="w-5 h-5 mr-3 text-blue-500" />
                Login as {user.name}
                <span className="ml-auto text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                  {user.guest}
                </span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-destructive/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Administration</CardTitle>
            <CardDescription>Monitors all activities and receives critical alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            {USERS.filter((u) => u.role === 'nurse').map((user) => (
              <Button
                key={user.id}
                variant="default"
                className="w-full justify-start h-14 text-base font-medium bg-slate-900 hover:bg-slate-800"
                onClick={() => handleLogin(user)}
              >
                <ShieldAlert className="w-5 h-5 mr-3 text-red-400" />
                Login as {user.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
