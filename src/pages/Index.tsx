import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/main'

export default function Index() {
  const { currentUser } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true })
    } else if (currentUser.role === 'nurse') {
      navigate('/admin', { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }, [currentUser, navigate])

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4 text-muted-foreground">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p>Loading application...</p>
      </div>
    </div>
  )
}
