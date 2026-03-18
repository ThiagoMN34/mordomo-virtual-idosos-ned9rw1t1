import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Plus, Trash2 } from 'lucide-react'

export default function ActivitiesPage() {
  const { activities, addActivity, deleteActivity } = useAppStore()
  const [title, setTitle] = useState('')
  const [timeStr, setTimeStr] = useState('08:00')

  const handleAdd = () => {
    if (title && timeStr) {
      const [hh, mm] = timeStr.split(':').map(Number)
      addActivity({ title, timeStr, timeMins: hh * 60 + mm })
      setTitle('')
    }
  }

  const sortedActivities = [...activities].sort((a, b) => a.timeMins - b.timeMins)

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Rotina Padrão</h2>
        <p className="text-muted-foreground mt-1">
          Configure os horários das atividades para todos os hóspedes.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="grid gap-2 flex-1">
            <label className="text-sm font-medium">Nome da Atividade</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Medicação da Manhã"
            />
          </div>
          <div className="grid gap-2 sm:w-32">
            <label className="text-sm font-medium">Horário</label>
            <Input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {sortedActivities.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{a.title}</p>
                  <p className="text-sm text-muted-foreground font-medium">{a.timeStr}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteActivity(a.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {sortedActivities.length === 0 && (
          <p className="text-center text-muted-foreground p-4">Nenhuma atividade cadastrada.</p>
        )}
      </div>
    </div>
  )
}
