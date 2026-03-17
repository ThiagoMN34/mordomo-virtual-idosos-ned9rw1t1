export type Role = 'staff' | 'nurse'
export type TaskStatus = 'pending' | 'completed' | 'escalated'

export interface User {
  id: string
  name: string
  role: Role
  guest: string | null
}

export interface Task {
  id: string
  title: string
  timeStr: string
  timeMins: number
  status: TaskStatus
  assignedTo: string
  staffName: string
  guestName: string
}

export const USERS: User[] = [
  { id: 'x', name: 'Staff X', role: 'staff', guest: 'Guest A' },
  { id: 'y', name: 'Staff Y', role: 'staff', guest: 'Guest B' },
  { id: 'w', name: 'Staff W', role: 'staff', guest: 'Guest C' },
  { id: 'n', name: 'Nurse Joy', role: 'nurse', guest: null },
]

export const ROUTINE = [
  { title: 'Bath', timeStr: '08:00', timeMins: 480 },
  { title: 'Medications', timeStr: '10:00', timeMins: 600 },
  { title: 'Diaper Change', timeStr: '11:00', timeMins: 660 },
  { title: 'Lunch', timeStr: '12:00', timeMins: 720 },
  { title: 'Dinner', timeStr: '18:00', timeMins: 1080 },
]

export const generateInitialTasks = (): Task[] => {
  const tasks: Task[] = []
  USERS.filter((u) => u.role === 'staff').forEach((staff) => {
    ROUTINE.forEach((routine) => {
      tasks.push({
        id: `${staff.id}-${routine.title.replace(/\s+/g, '-')}`,
        title: routine.title,
        timeStr: routine.timeStr,
        timeMins: routine.timeMins,
        status: 'pending',
        assignedTo: staff.id,
        staffName: staff.name,
        guestName: staff.guest!,
      })
    })
  })
  return tasks
}
