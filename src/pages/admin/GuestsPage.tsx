import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { UserPlus, Trash2 } from 'lucide-react'

export default function GuestsPage() {
  const { guests, addGuest, deleteGuest } = useAppStore()
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')

  const handleAdd = () => {
    if (name) {
      addGuest({ name, room })
      setName('')
      setRoom('')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Gestão de Hóspedes</h2>
        <p className="text-muted-foreground mt-1">Adicione ou remova hóspedes da clínica.</p>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="grid gap-2 flex-1">
            <label className="text-sm font-medium">Nome do Hóspede</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sr. João"
            />
          </div>
          <div className="grid gap-2 sm:w-32">
            <label className="text-sm font-medium">Quarto</label>
            <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Ex: 101" />
          </div>
          <Button onClick={handleAdd}>
            <UserPlus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {guests.map((g) => (
          <Card key={g.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-muted-foreground">Quarto: {g.room || 'Não definido'}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteGuest(g.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {guests.length === 0 && (
          <p className="text-center text-muted-foreground p-4">Nenhum hóspede cadastrado.</p>
        )}
      </div>
    </div>
  )
}
