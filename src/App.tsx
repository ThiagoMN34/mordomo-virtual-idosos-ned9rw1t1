import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Login from './pages/Login'
import StaffDashboard from './pages/StaffDashboard'
import AdminDashboard from './pages/AdminDashboard'
import GuestsPage from './pages/admin/GuestsPage'
import StaffPage from './pages/admin/StaffPage'
import ActivitiesPage from './pages/admin/ActivitiesPage'
import AssignmentsPage from './pages/admin/AssignmentsPage'
import { AppProvider } from './stores/main'

const App = () => (
  <AppProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<StaffDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/guests" element={<GuestsPage />} />
            <Route path="/admin/staff" element={<StaffPage />} />
            <Route path="/admin/activities" element={<ActivitiesPage />} />
            <Route path="/admin/assignments" element={<AssignmentsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
