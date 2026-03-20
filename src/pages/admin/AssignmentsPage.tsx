import { X } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AssignmentsPage() {
  const { users, guests, assignStaffToGuest, unassignStaffFromGuest } = useAppStore()
  const staff = users.filter((u) => u.role === 'staff')

  const handleDragStartFromList = (e: React.DragEvent, staffId: string) => {
    e.dataTransfer.setData('staffId', staffId)
  }

  const handleDragStartFromGuest = (e: React.DragEvent, staffId: string, guestId: string) => {
    e.dataTransfer.setData('staffId', staffId)
    e.dataTransfer.setData('sourceGuestId', guestId)
  }

  const handleDropOnGuest = (e: React.DragEvent, guestId: string) => {
    e.preventDefault()
    const staffId = e.dataTransfer.getData('staffId')
    if (staffId) {
      assignStaffToGuest(staffId, guestId)
    }
  }

  const handleDropOnList = (e: React.DragEvent) => {
    e.preventDefault()
    const staffId = e.dataTransfer.getData('staffId')
    const sourceGuestId = e.dataTransfer.getData('sourceGuestId')
    if (staffId && sourceGuestId) {
      unassignStaffFromGuest(staffId, sourceGuestId)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Atribuições de Equipe</h2>
        <p className="text-muted-foreground mt-1">
          Arraste os cuidadores para os hóspedes desejados para designar as responsabilidades. Um
          único funcionário pode ser atribuído a múltiplos hóspedes.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Available Staff Panel */}
        <div
          className="w-full md:w-1/3 space-y-3 bg-slate-100 p-4 rounded-xl border border-dashed border-slate-300 min-h-[300px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnList}
        >
          <div className="mb-2">
            <h3 className="font-semibold text-slate-700">Equipe de Cuidadores</h3>
            <p className="text-xs text-muted-foreground">
              Arraste para os hóspedes ou solte aqui para remover uma atribuição.
            </p>
          </div>
          {staff.map((s) => (
            <Card
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStartFromList(e, s.id)}
              className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm"
            >
              <CardContent className="p-3 flex items-center justify-between">
                <span className="font-medium">{s.name}</span>
                <Badge variant="outline">Arraste</Badge>
              </CardContent>
            </Card>
          ))}
          {staff.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum cuidador cadastrado.
            </p>
          )}
        </div>

        {/* Guests Panel */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </div>
  )
}
