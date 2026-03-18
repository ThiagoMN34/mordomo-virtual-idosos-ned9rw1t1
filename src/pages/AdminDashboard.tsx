import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, AlertCircle, CheckCircle, Clock, RefreshCcw } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Task } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function CompactAlert({ task }: { task: Task }) {
  return (
    <div className="flex flex-col p-2.5 bg-red-50 border border-red-100 rounded-md gap-1.5 transition-colors hover:bg-red-100/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-red-700 font-semibold text-sm min-w-0">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate leading-tight">{task.title}</span>
        </div>
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
          {task.timeStr}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-[11px] text-red-600/80">
        <span className="truncate font-medium pr-2">{task.guestName}</span>
        <span className="truncate shrink-0">Resp: {task.staffName}</span>
      </div>
    </div>
  )
}

function GuestRoutineCard({ guestName, tasks }: { guestName: string; tasks: Task[] }) {
  const isEscalated = tasks.some((t) => t.status === 'escalated')
  return (
    <div className="bg-white p-3.5 rounded-lg border shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b pb-2 gap-2">
        <h3 className="text-sm font-bold flex items-center gap-2 truncate">
          {guestName}
          {isEscalated && (
            <span className="flex w-2 h-2 shrink-0 rounded-full bg-destructive animate-pulse" />
          )}
        </h3>
        <span className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600 shrink-0">
          {tasks[0]?.staffName}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'px-2 py-1.5 rounded border text-[11px] flex items-center justify-between gap-2',
              task.status === 'completed' && 'bg-green-50/50 border-green-100 text-green-700',
              task.status === 'escalated' && 'bg-red-50 border-red-200 text-red-700 font-medium',
              task.status === 'pending' && 'bg-slate-50 border-slate-200 text-slate-600',
            )}
          >
            <span className="truncate flex items-center gap-1.5">
              {task.status === 'completed' && <CheckCircle className="w-3 h-3 shrink-0" />}
              {task.status === 'escalated' && <AlertCircle className="w-3 h-3 shrink-0" />}
              {task.status === 'pending' && <Clock className="w-3 h-3 shrink-0" />}
              {task.title}
            </span>
            <span className="shrink-0 font-mono opacity-80">{task.timeStr}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { currentUser, tasks, resetAlerts } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') navigate('/login')
  }, [currentUser, navigate])

  if (!currentUser) return null

  const escalatedTasks = tasks.filter((t) => t.status === 'escalated')
  const pendingTasks = tasks.filter((t) => t.status === 'pending')
  const completedTasks = tasks.filter((t) => t.status === 'completed')
  const guests = Array.from(new Set(tasks.map((t) => t.guestName))).sort()

  return (
    <div className="flex flex-col flex-1 overflow-hidden animate-fade-in w-full max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Visão Geral da Clínica
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Status em tempo real de todas as rotinas.
          </p>
        </div>
        <Button
          onClick={resetAlerts}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto shadow-sm"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Resetar Alertas Críticos
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        <Card className="bg-red-50/50 border-red-100 shadow-sm">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-full">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-red-600/80 uppercase tracking-wider">
                Alertas
              </p>
              <h3 className="text-lg font-bold text-red-700 leading-none mt-0.5">
                {escalatedTasks.length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Pendentes
              </p>
              <h3 className="text-lg font-bold leading-none mt-0.5">{pendingTasks.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-full">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Concluídas
              </p>
              <h3 className="text-lg font-bold leading-none mt-0.5">{completedTasks.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className="flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b bg-red-50/30 flex items-center justify-between text-destructive shrink-0">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Atenção Imediata</h3>
            </div>
            <Badge variant="destructive" className="h-4 text-[10px] px-1.5">
              {escalatedTasks.length}
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {escalatedTasks.map((task) => (
                <CompactAlert key={`esc-${task.id}`} task={task} />
              ))}
              {escalatedTasks.length === 0 && (
                <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400 opacity-50" />
                  <p className="text-xs">Nenhum alerta crítico</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="lg:col-span-2 flex flex-col bg-slate-50 border rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b bg-white shrink-0">
            <h3 className="font-semibold text-sm text-slate-800">Rotinas por Hóspede</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {guests.map((guestName) => (
                <GuestRoutineCard
                  key={guestName}
                  guestName={guestName}
                  tasks={tasks.filter((t) => t.guestName === guestName)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
