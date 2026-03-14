import { Route } from '@tanstack/react-router'
import { rootRoute } from '../routes' // We'll create this
import { AdminLayout } from './components/AdminLayout'
import { DashboardPage } from './pages/Dashboard'
import { AppointmentsPage } from './pages/Appointments'
import { PatientsPage } from './pages/Patients'
import { ServicesPage } from './pages/Services'
import { ReportsPage } from './pages/Reports'
import { SettingsPage } from './pages/Settings'

// Admin root route
export const adminRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin',
  component: AdminLayout,
})

// Admin child routes
export const adminIndexRoute = new Route({
  getParentRoute: () => adminRoute,
  path: '/',
  component: DashboardPage,
})

export const adminAppointmentsRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'appointments',
  component: AppointmentsPage,
})

export const adminPatientsRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'patients',
  component: PatientsPage,
})

export const adminServicesRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'services',
  component: ServicesPage,
})

export const adminReportsRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'reports',
  component: ReportsPage,
})

export const adminSettingsRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'settings',
  component: SettingsPage,
})

// Export all admin routes
export const adminRoutes = [
  adminRoute,
  adminIndexRoute,
  adminAppointmentsRoute,
  adminPatientsRoute,
  adminServicesRoute,
  adminReportsRoute,
  adminSettingsRoute,
]
