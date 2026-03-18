import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AssignmentsPage() {
  const { users, guests, assignStaffToGuest } = useAppStore()
  const staff = users.filter((u) => u.role === 'staff')

  const handleDragStart = (e: React.DragEvent, staffId: string) => {
    e.dataTransfer.setData('staffId', staffId)
  }

  const handleDrop = (e: React.DragEvent, guestId: string | null) => {
    e.preventDefault()
    const staffId = e.dataTransfer.getData('staffId')
    if (staffId) {
      assignStaffToGuest(staffId, guestId)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Atribuições de Equipe</h2>
        <p className="text-muted-foreground mt-1">
          Arraste os cuidadores para os hóspedes desejados para designar as responsabilidades.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Available Staff Panel */}
        <div
          className="w-full md:w-1/3 space-y-3 bg-slate-100 p-4 rounded-xl border border-dashed border-slate-300 min-h-[300px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, null)}
        >
          <h3 className="font-semibold text-slate-700">Disponíveis (Sem Hóspede)</h3>
          {staff
            .filter((s) => !s.guestId)
            .map((s) => (
              <Card
                key={s.id}
                draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm"
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <span className="font-medium">{s.name}</span>
                  <Badge variant="outline">Arraste</Badge>
                </CardContent>
              </Card>
            ))}
          {staff.filter((s) => !s.guestId).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Todos os cuidadores estão atribuídos.
            </p>
          )}
        </div>

        {/* Guests Panel */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guests.map((g) => {
            const assignedStaff = staff.filter((s) => s.guestId === g.id)
            return (
              <Card
                key={g.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, g.id)}
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
                      onDragStart={(e) => handleDragStart(e, s.id)}
                      className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium flex justify-between cursor-grab active:cursor-grabbing shadow-sm"
                    >
                      <span>{s.name}</span>
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
