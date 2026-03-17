import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import useAppStore from '@/stores/main'
import { TaskCard } from '@/components/TaskCard'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminDashboard() {
  const { currentUser, tasks } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'nurse') {
      navigate('/login')
    }
  }, [currentUser, navigate])

  if (!currentUser) return null

  const escalatedTasks = tasks.filter((t) => t.status === 'escalated')
  const pendingTasks = tasks.filter((t) => t.status === 'pending')
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  // Group tasks by guest
  const guests = Array.from(new Set(tasks.map((t) => t.guestName))).sort()

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Care Center Overview</h2>
        <p className="text-muted-foreground mt-1">
          Real-time status of all guest routines and staff activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-600/80">Critical Alerts</p>
              <h3 className="text-2xl font-bold text-red-700">{escalatedTasks.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
              <h3 className="text-2xl font-bold">{pendingTasks.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
              <h3 className="text-2xl font-bold">{completedTasks.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {escalatedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-destructive border-b border-destructive/20 pb-2">
            <Activity className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Immediate Attention Required</h3>
          </div>
          <div className="grid gap-4">
            {escalatedTasks.map((task) => (
              <TaskCard key={`esc-${task.id}`} task={task} showStaff />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {guests.map((guestName) => {
          const guestTasks = tasks.filter((t) => t.guestName === guestName)
          const isEscalated = guestTasks.some((t) => t.status === 'escalated')

          return (
            <div key={guestName} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {guestName}
                  {isEscalated && (
                    <span className="flex w-3 h-3 rounded-full bg-destructive animate-pulse" />
                  )}
                </h3>
                <span className="text-sm font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                  Staff: {guestTasks[0]?.staffName}
                </span>
              </div>
              <div className="grid gap-3">
                {guestTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
