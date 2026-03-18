export type Role = 'staff' | 'admin'
export type TaskStatus = 'pending' | 'completed' | 'escalated'

export interface User {
  id: string
  name: string
  role: Role
  guestId: string | null
}

export interface Guest {
  id: string
  name: string
  room: string
}

export interface Activity {
  id: string
  title: string
  timeStr: string
  timeMins: number
}

export interface Task {
  id: string
  title: string
  timeStr: string
  timeMins: number
  status: TaskStatus
  assignedTo: string
  staffName: string
  guestId: string
  guestName: string
}

export const INITIAL_GUESTS: Guest[] = [
  { id: 'g1', name: 'Sr. João', room: '101' },
  { id: 'g2', name: 'Dona Maria', room: '102' },
  { id: 'g3', name: 'Sr. Carlos', room: '103' },
]

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Cuidadora Ana', role: 'staff', guestId: 'g1' },
  { id: 'u2', name: 'Cuidador Pedro', role: 'staff', guestId: 'g2' },
  { id: 'u3', name: 'Cuidadora Julia', role: 'staff', guestId: null },
  { id: 'a1', name: 'Enfermeira Chefe', role: 'admin', guestId: null },
]

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'a1', title: 'Banho', timeStr: '08:00', timeMins: 480 },
  { id: 'a2', title: 'Medicação', timeStr: '10:00', timeMins: 600 },
  { id: 'a3', title: 'Troca de Fraldas', timeStr: '11:00', timeMins: 660 },
  { id: 'a4', title: 'Almoço', timeStr: '12:00', timeMins: 720 },
  { id: 'a5', title: 'Jantar', timeStr: '18:00', timeMins: 1080 },
]

export const generateTasks = (
  users: User[],
  guests: Guest[],
  activities: Activity[],
  existingTasks: Task[] = [],
): Task[] => {
  const tasks: Task[] = []
  users
    .filter((u) => u.role === 'staff' && u.guestId)
    .forEach((staff) => {
      const guest = guests.find((g) => g.id === staff.guestId)
      if (!guest) return

      activities.forEach((activity) => {
        const taskId = `${staff.id}-${guest.id}-${activity.id}`
        const existing = existingTasks.find((t) => t.id === taskId)

        tasks.push({
          id: taskId,
          title: activity.title,
          timeStr: activity.timeStr,
          timeMins: activity.timeMins,
          status: existing ? existing.status : 'pending',
          assignedTo: staff.id,
          staffName: staff.name,
          guestId: guest.id,
          guestName: guest.name,
        })
      })
    })
  return tasks.sort((a, b) => a.timeMins - b.timeMins)
}
