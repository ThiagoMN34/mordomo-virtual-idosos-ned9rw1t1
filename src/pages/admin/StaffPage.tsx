import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { UserPlus, Trash2 } from 'lucide-react'

export default function StaffPage() {
  const { users, addUser, deleteUser } = useAppStore()
  const [name, setName] = useState('')
  const [role, setRole] = useState<'staff' | 'admin'>('staff')

  const handleAdd = () => {
    if (name) {
      addUser({ name, role, guestId: null })
      setName('')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Gestão de Equipe</h2>
        <p className="text-muted-foreground mt-1">Gerencie cuidadores e administradores.</p>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="grid gap-2 flex-1">
            <label className="text-sm font-medium">Nome do Funcionário</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ana Silva"
            />
          </div>
          <div className="grid gap-2 sm:w-48">
            <label className="text-sm font-medium">Cargo</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="staff">Cuidador</option>
              <option value="admin">Gestor/Enfermeiro</option>
            </select>
          </div>
          <Button onClick={handleAdd}>
            <UserPlus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-muted-foreground">
                  {u.role === 'admin' ? 'Gestor/Enfermeiro' : 'Cuidador'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteUser(u.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
