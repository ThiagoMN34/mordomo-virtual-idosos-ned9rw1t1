import { useState } from 'react'
import { X, Copy, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const DAYS = [
  { id: '1', label: 'Seg' },
  { id: '2', label: 'Ter' },
  { id: '3', label: 'Qua' },
  { id: '4', label: 'Qui' },
  { id: '5', label: 'Sex' },
  { id: '6', label: 'Sáb' },
  { id: '0', label: 'Dom' },
]

export function WeeklyGrid() {
  const {
    guests,
    users,
    weeklyAssignments,
    assignStaffToGuestWeekly,
    unassignStaffFromGuestWeekly,
    propagateWeek,
  } = useAppStore()
  const { toast } = useToast()
  const [weekOffset, setWeekOffset] = useState(0)

  const staff = users.filter((u) => u.role === 'staff')

  const handleDragStartFromWeeklyGuest = (
    e: React.DragEvent,
    staffId: string,
    guestId: string,
    day: string,
  ) => {
    e.dataTransfer.setData('staffId', staffId)
    e.dataTransfer.setData('sourceGuestIdWeekly', guestId)
    e.dataTransfer.setData('sourceDayWeekly', day)
    e.dataTransfer.setData('sourceWeekOffset', weekOffset.toString())
  }

  const handleDropOnWeeklyGuest = (e: React.DragEvent, guestId: string, day: string) => {
    e.preventDefault()
    const staffId = e.dataTransfer.getData('staffId')
    if (staffId) assignStaffToGuestWeekly(staffId, guestId, day, weekOffset)
  }

  const handlePropagate = () => {
    if (weekOffset >= 2) return
    propagateWeek(weekOffset)
    toast({
      title: 'Sucesso',
      description: `Escala propagada com sucesso para a semana seguinte.`,
    })
  }

  const startDate = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 })
  const endDate = endOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 })
  const dateRangeLabel = `${format(startDate, 'dd MMM', { locale: ptBR })} - ${format(endDate, 'dd MMM', { locale: ptBR })}`

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg border shadow-sm gap-4">
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            title="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[150px]">
            <div className="text-sm font-semibold">
              {weekOffset === 0
                ? 'Semana Atual'
                : weekOffset === 1
                  ? 'Próxima Semana'
                  : 'Semana +2'}
            </div>
            <div className="text-xs text-muted-foreground capitalize">{dateRangeLabel}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWeekOffset(Math.min(2, weekOffset + 1))}
            disabled={weekOffset === 2}
            title="Próxima semana"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={handlePropagate} variant="outline" size="sm" disabled={weekOffset === 2}>
          <Copy className="w-4 h-4 mr-2" />
          Propagar para próxima semana
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 bg-slate-50 border-b font-medium text-sm text-slate-600">
            <div className="p-3 border-r">Hóspede</div>
            {DAYS.map((d) => (
              <div key={d.id} className="p-3 border-r last:border-0 text-center">
                {d.label}
              </div>
            ))}
          </div>

          <div className="divide-y">
            {guests.map((g) => (
              <div key={g.id} className="grid grid-cols-8 hover:bg-slate-50/50 transition-colors">
                <div className="p-3 border-r font-medium flex items-center">{g.name}</div>
                {DAYS.map((d) => {
                  const weekAssigns = weeklyAssignments[weekOffset] || {}
                  const assignedIds = weekAssigns[g.id]?.[d.id] || []
                  const assignedStaff = assignedIds
                    .map((id) => staff.find((s) => s.id === id))
                    .filter(Boolean)

                  return (
                    <div
                      key={d.id}
                      className="p-1.5 border-r last:border-0"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropOnWeeklyGuest(e, g.id, d.id)}
                    >
                      <div className="flex flex-col gap-1.5 h-full min-h-[70px]">
                        {assignedStaff.length === 0 && (
                          <div className="flex-1 border-2 border-dashed border-transparent hover:border-slate-200 rounded flex items-center justify-center text-[10px] text-muted-foreground transition-colors">
                            Soltar
                          </div>
                        )}
                        {assignedStaff.map((s: any) => (
                          <div
                            key={s.id}
                            draggable
                            onDragStart={(e) => handleDragStartFromWeeklyGuest(e, s.id, g.id, d.id)}
                            className="bg-primary text-primary-foreground px-2 py-1 rounded text-[11px] font-medium flex items-center justify-between cursor-grab active:cursor-grabbing shadow-sm"
                          >
                            <span className="truncate mr-1">{s.name}</span>
                            <button
                              onClick={() =>
                                unassignStaffFromGuestWeekly(s.id, g.id, d.id, weekOffset)
                              }
                              className="p-0.5 hover:bg-primary-foreground/20 rounded transition-colors shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
            {guests.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                Nenhum hóspede cadastrado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
