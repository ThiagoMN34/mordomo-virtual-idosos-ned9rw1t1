import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'
import { User, Task, generateInitialTasks } from '@/lib/mock-data'

interface AppState {
  currentUser: User | null
  tasks: Task[]
  timeMinutes: number
  login: (u: User) => void
  logout: () => void
  completeTask: (id: string) => void
  setTimeMinutes: (m: number) => void
}

const AppContext = createContext<AppState | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>(generateInitialTasks())
  const [timeMinutes, setTimeMinutes] = useState(420) // Start at 07:00
  const [notified, setNotified] = useState<Set<string>>(new Set())

  const login = useCallback((user: User) => setCurrentUser(user), [])
  const logout = useCallback(() => setCurrentUser(null), [])
  const completeTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'completed' } : t)))
  }, [])

  useEffect(() => {
    let changed = false
    const updatedTasks = tasks.map((task) => {
      if (task.status === 'completed') return task
      let newStatus = task.status

      if (timeMinutes === task.timeMins && !notified.has(`${task.id}-remind`)) {
        toast({
          title: 'WhatsApp Reminder Sent',
          description: `To ${task.staffName}: It's time for ${task.guestName}'s ${task.title}.`,
        })
        setNotified((prev) => new Set(prev).add(`${task.id}-remind`))
      }

      if (task.status === 'pending' && timeMinutes >= task.timeMins + 15) {
        newStatus = 'escalated'
        changed = true
        if (!notified.has(`${task.id}-escalate`)) {
          toast({
            variant: 'destructive',
            title: 'CRITICAL ESCALATION',
            description: `Nurse alerted! ${task.guestName}'s ${task.title} is overdue by 15 mins.`,
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
      tasks,
      timeMinutes,
      login,
      logout,
      completeTask,
      setTimeMinutes,
    }),
    [currentUser, tasks, timeMinutes, login, logout, completeTask],
  )

  return React.createElement(AppContext.Provider, { value }, children)
}

export default function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
