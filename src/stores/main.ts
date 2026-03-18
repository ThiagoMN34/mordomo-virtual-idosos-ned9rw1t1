import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'
import {
  User,
  Guest,
  Activity,
  Task,
  INITIAL_USERS,
  INITIAL_GUESTS,
  INITIAL_ACTIVITIES,
  generateTasks,
} from '@/lib/mock-data'

interface AppState {
  currentUser: User | null
  users: User[]
  guests: Guest[]
  activities: Activity[]
  tasks: Task[]
  timeMinutes: number
  login: (u: User) => void
  logout: () => void
  completeTask: (id: string) => void
  setTimeMinutes: (m: number) => void
  addGuest: (g: Omit<Guest, 'id'>) => void
  deleteGuest: (id: string) => void
  addUser: (u: Omit<User, 'id'>) => void
  deleteUser: (id: string) => void
  addActivity: (a: Omit<Activity, 'id'>) => void
  deleteActivity: (id: string) => void
  assignStaffToGuest: (staffId: string, guestId: string | null) => void
  resetAlerts: () => void
}

const AppContext = createContext<AppState | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS)
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES)
  const [tasks, setTasks] = useState<Task[]>([])
  const [timeMinutes, setTimeMinutes] = useState(420)
  const [notified, setNotified] = useState<Set<string>>(new Set())

  useEffect(() => {
    setTasks((prev) => generateTasks(users, guests, activities, prev))
  }, [users, guests, activities])

  const login = useCallback((user: User) => setCurrentUser(user), [])
  const logout = useCallback(() => setCurrentUser(null), [])

  const completeTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'completed' } : t)))
  }, [])

  const resetAlerts = useCallback(() => {
    setTasks((prev) =>
      prev.map((t) => (t.status === 'escalated' ? { ...t, status: 'pending' } : t)),
    )
    setNotified(new Set())
  }, [])

  const addGuest = useCallback(
    (g: Omit<Guest, 'id'>) => setGuests((p) => [...p, { ...g, id: Date.now().toString() }]),
    [],
  )
  const deleteGuest = useCallback((id: string) => {
    setGuests((p) => p.filter((x) => x.id !== id))
    setUsers((p) => p.map((u) => (u.guestId === id ? { ...u, guestId: null } : u)))
  }, [])

  const addUser = useCallback(
    (u: Omit<User, 'id'>) => setUsers((p) => [...p, { ...u, id: Date.now().toString() }]),
    [],
  )
  const deleteUser = useCallback((id: string) => setUsers((p) => p.filter((x) => x.id !== id)), [])

  const addActivity = useCallback(
    (a: Omit<Activity, 'id'>) => setActivities((p) => [...p, { ...a, id: Date.now().toString() }]),
    [],
  )
  const deleteActivity = useCallback(
    (id: string) => setActivities((p) => p.filter((x) => x.id !== id)),
    [],
  )

  const assignStaffToGuest = useCallback((staffId: string, guestId: string | null) => {
    setUsers((p) => p.map((u) => (u.id === staffId ? { ...u, guestId } : u)))
  }, [])

  useEffect(() => {
    let changed = false
    const updatedTasks = tasks.map((task) => {
      if (task.status === 'completed') return task
      let newStatus = task.status

      if (timeMinutes >= task.timeMins && !notified.has(`${task.id}-remind`)) {
        toast({
          title: 'Lembrete de WhatsApp Enviado',
          description: `Para ${task.staffName}: É hora de ${task.title} para ${task.guestName}.`,
        })
        setNotified((prev) => new Set(prev).add(`${task.id}-remind`))
      }

      if (task.status === 'pending' && timeMinutes >= task.timeMins + 15) {
        newStatus = 'escalated'
        changed = true
        if (!notified.has(`${task.id}-escalate`)) {
          toast({
            variant: 'destructive',
            title: 'ESCALONAMENTO CRÍTICO',
            description: `Enfermeiro alertado! ${task.title} de ${task.guestName} está atrasado 15+ min.`,
          })
          setNotified((prev) => new Set(prev).add(`${task.id}-escalate`))
        }
      }

      return { ...task, status: newStatus }
    })

    if (changed) setTasks(updatedTasks)
  }, [timeMinutes, tasks, notified])

  const value = useMemo(
    () => ({
      currentUser,
      users,
      guests,
      activities,
      tasks,
      timeMinutes,
      login,
      logout,
      completeTask,
      setTimeMinutes,
      addGuest,
      deleteGuest,
      addUser,
      deleteUser,
      addActivity,
      deleteActivity,
      assignStaffToGuest,
      resetAlerts,
    }),
    [
      currentUser,
      users,
      guests,
      activities,
      tasks,
      timeMinutes,
      login,
      logout,
      completeTask,
      addGuest,
      deleteGuest,
      addUser,
      deleteUser,
      addActivity,
      deleteActivity,
      assignStaffToGuest,
      resetAlerts,
    ],
  )

  return React.createElement(AppContext.Provider, { value }, children)
}

export default function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
