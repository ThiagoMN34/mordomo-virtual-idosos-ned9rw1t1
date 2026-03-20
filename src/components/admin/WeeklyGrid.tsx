import { X, Copy } from 'lucide-react'
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
  }

  const handleDropOnWeeklyGuest = (e: React.DragEvent, guestId: string, day: string) => {
    e.preventDefault()
    const staffId = e.dataTransfer.getData('staffId')
    if (staffId) assignStaffToGuestWeekly(staffId, guestId, day)
  }

  const handlePropagate = () => {
    propagateWeek()
    toast({
      title: 'Sucesso',
      description: 'Escala propagada com sucesso para a próxima semana.',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
        <span className="text-sm text-muted-foreground">
          Planeje a rotina de segunda a domingo.
        </span>
        <Button onClick={handlePropagate} variant="outline" size="sm">
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
                  const assignedIds = weeklyAssignments[g.id]?.[d.id] || []
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
                              onClick={() => unassignStaffFromGuestWeekly(s.id, g.id, d.id)}
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
