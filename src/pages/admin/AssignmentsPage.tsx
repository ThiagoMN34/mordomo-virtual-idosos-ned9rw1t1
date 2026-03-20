import useAppStore from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DailyGrid } from '@/components/admin/DailyGrid'
import { WeeklyGrid } from '@/components/admin/WeeklyGrid'

export default function AssignmentsPage() {
  const { users, unassignStaffFromGuest, unassignStaffFromGuestWeekly } = useAppStore()

  const staff = users.filter((u) => u.role === 'staff')

  const handleDragStartFromList = (e: React.DragEvent, staffId: string) => {
    e.dataTransfer.setData('staffId', staffId)
  }

  const handleDropOnList = (e: React.DragEvent) => {
    e.preventDefault()
    const staffId = e.dataTransfer.getData('staffId')
    const sourceGuestId = e.dataTransfer.getData('sourceGuestId')
    const sourceGuestIdWeekly = e.dataTransfer.getData('sourceGuestIdWeekly')
    const sourceDayWeekly = e.dataTransfer.getData('sourceDayWeekly')

    if (staffId && sourceGuestId) {
      unassignStaffFromGuest(staffId, sourceGuestId)
    }
    if (staffId && sourceGuestIdWeekly && sourceDayWeekly) {
      unassignStaffFromGuestWeekly(staffId, sourceGuestIdWeekly, sourceDayWeekly)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
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
          className="w-full md:w-64 shrink-0 space-y-3 bg-slate-100 p-4 rounded-xl border border-dashed border-slate-300 min-h-[300px]"
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

        {/* Assignments Panel */}
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Escala Diária</TabsTrigger>
              <TabsTrigger value="weekly">Escala Semanal</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="m-0 focus-visible:outline-none">
              <DailyGrid />
            </TabsContent>

            <TabsContent value="weekly" className="m-0 focus-visible:outline-none">
              <WeeklyGrid />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
