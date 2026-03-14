import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-beute-cream/30">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <Header 
            title="Panel de Administración"
            subtitle="Beauté Clínica de Estética y Nutrición"
          />
          <main className="min-h-[calc(100vh-80px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
