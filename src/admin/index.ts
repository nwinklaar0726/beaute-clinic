// Admin Dashboard Exports
export { AdminLayout } from './components/AdminLayout'
export { Sidebar } from './components/Sidebar'
export { Header } from './components/Header'
export { StatCard } from './components/StatCard'

// Pages
export { DashboardPage } from './pages/Dashboard'
export { AppointmentsPage } from './pages/Appointments'
export { PatientsPage } from './pages/Patients'
export { ServicesPage } from './pages/Services'
export { ReportsPage } from './pages/Reports'
export { SettingsPage } from './pages/Settings'

// Hooks
export {
  useDashboardStats,
  useAppointments,
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
  usePatients,
  usePatient,
  useCreatePatient,
  useUpdatePatient,
  useServices,
  useUpdateService,
  useCalendarEvents,
  useRevenueReport,
  useServicesReport,
} from './hooks/useAdminData'

// Types
export type {
  AdminUser,
  Appointment,
  Patient,
  Service,
  DashboardStats,
  ChartData,
  CalendarEvent,
  Notification,
  DateRange,
  AppointmentFilters,
  PatientFilters,
} from './types'

// Routes
export { adminRoutes } from './routes'
