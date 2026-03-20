import { X } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DailyGrid() {
  const { guests, users, assignStaffToGuest, unassignStaffFromGuest } = useAppStore()
  const staff = users.filter((u) => u.role === 'staff')

  const handleDragStartFromGuest = (e: React.DragEvent, staffId: string, guestId: string) => {
    e.dataTransfer.setData('staffId', staffId)
    e.dataTransfer.setData('sourceGuestId', guestId)
  }

  const handleDropOnGuest = (e: React.DragEvent, guestId: string) => {
    e.preventDefault()
    const staffId = e.dataTransfer.getData('staffId')
    if (staffId) assignStaffToGuest(staffId, guestId)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {guests.map((g) => {
        const assignedStaff = staff.filter((s) => s.guestIds?.includes(g.id))
        return (
          <Card
            key={g.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropOnGuest(e, g.id)}
            className="border-2 border-transparent hover:border-primary/20 transition-colors bg-white shadow-sm"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {g.name}
                <span className="text-xs font-normal text-muted-foreground">
                  Quarto: {g.room || '-'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 min-h-[80px]">
              {assignedStaff.length === 0 && (
                <div className="text-sm text-muted-foreground p-3 bg-slate-50 border border-dashed rounded text-center">
                  Solte um cuidador aqui
                </div>
              )}
              {assignedStaff.map((s) => (
                <div
                  key={s.id}
                  draggable
                  onDragStart={(e) => handleDragStartFromGuest(e, s.id, g.id)}
                  className="bg-primary text-primary-foreground pl-3 pr-1 py-1.5 rounded-md text-sm font-medium flex items-center justify-between cursor-grab active:cursor-grabbing shadow-sm group"
                >
                  <span>{s.name}</span>
                  <button
                    onClick={() => unassignStaffFromGuest(s.id, g.id)}
                    className="p-1.5 hover:bg-primary-foreground/20 rounded-md transition-colors"
                    title="Remover cuidador"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
