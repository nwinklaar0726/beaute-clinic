import { RootRoute, Route, Router } from '@tanstack/react-router'
import App, { LandingPage } from './App'
import { AdminLayout } from './admin/components/AdminLayout'
import { DashboardPage } from './admin/pages/Dashboard'
import { AppointmentsPage } from './admin/pages/Appointments'
import { PatientsPage } from './admin/pages/Patients'
import { ServicesPage } from './admin/pages/Services'
import { ReportsPage } from './admin/pages/Reports'
import { SettingsPage } from './admin/pages/Settings'

// Root route - App is the layout
export const rootRoute = new RootRoute({
  component: App,
})

// Landing page route (index)
export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

// Admin routes
export const adminRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin',
  component: AdminLayout,
})

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

// Create router
export const router = new Router({
  routeTree: rootRoute.addChildren([
    indexRoute,
    adminRoute.addChildren([
      adminIndexRoute,
      adminAppointmentsRoute,
      adminPatientsRoute,
      adminServicesRoute,
      adminReportsRoute,
      adminSettingsRoute,
    ]),
  ]),
})

// Register router for types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
