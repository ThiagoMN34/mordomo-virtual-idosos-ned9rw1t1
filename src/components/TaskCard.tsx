import { Clock, CheckCircle2, AlertTriangle, User as UserIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Task } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onComplete?: (id: string) => void
  showStaff?: boolean
}

export function TaskCard({ task, onComplete, showStaff = false }: TaskCardProps) {
  const isCompleted = task.status === 'completed'
  const isEscalated = task.status === 'escalated'

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all',
        isEscalated && 'border-destructive/50 shadow-sm shadow-destructive/20',
      )}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div
            className={cn(
              'p-3 rounded-full shrink-0',
              isCompleted
                ? 'bg-green-100 text-green-600'
                : isEscalated
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600',
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : isEscalated ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <h3 className="font-semibold text-base sm:text-lg leading-none">{task.title}</h3>
              <Badge variant={isCompleted ? 'secondary' : isEscalated ? 'destructive' : 'outline'}>
                {task.timeStr}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" /> Hóspede: {task.guestName}
              </span>
              {showStaff && (
                <span className="flex items-center gap-1 text-primary/80 font-medium">
                  Responsável: {task.staffName}
                </span>
              )}
            </div>
            {isEscalated && !isCompleted && (
              <p className="text-xs text-destructive font-medium mt-1 animate-pulse">
                Atrasado por 15+ minutos. Enfermeiro notificado.
              </p>
            )}
          </div>
        </div>

        {onComplete && !isCompleted && (
          <Button
            onClick={() => onComplete(task.id)}
            className="w-full sm:w-auto shrink-0 animate-fade-in"
            variant={isEscalated ? 'destructive' : 'default'}
          >
            Marcar Concluído
          </Button>
        )}

        {isCompleted && (
          <Badge className="bg-green-500 hover:bg-green-600 text-white self-start sm:self-center">
            Concluído
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
