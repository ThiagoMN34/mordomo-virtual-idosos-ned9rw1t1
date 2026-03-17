import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/main'
import { TaskCard } from '@/components/TaskCard'
import { Progress } from '@/components/ui/progress'

export default function StaffDashboard() {
  const { currentUser, tasks, completeTask } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'staff') {
      navigate('/login')
    }
  }, [currentUser, navigate])

  if (!currentUser) return null

  const userTasks = tasks.filter((t) => t.assignedTo === currentUser.id)
  const completedCount = userTasks.filter((t) => t.status === 'completed').length
  const progress = Math.round((completedCount / userTasks.length) * 100) || 0

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Today's Schedule</h2>
          <p className="text-muted-foreground">
            You are managing{' '}
            <span className="font-semibold text-slate-700">{currentUser.guest}</span> today.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Daily Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2.5" />
          <p className="text-xs text-muted-foreground text-right">
            {completedCount} of {userTasks.length} tasks completed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {userTasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={completeTask} />
        ))}
        {userTasks.length === 0 && (
          <div className="text-center p-8 bg-slate-50 rounded-lg border border-dashed">
            <p className="text-muted-foreground">No tasks scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  )
}
