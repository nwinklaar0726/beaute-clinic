import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Sparkles, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/appointments', label: 'Citas', icon: CalendarDays },
  { path: '/admin/patients', label: 'Pacientes', icon: Users },
  { path: '/admin/services', label: 'Servicios', icon: Sparkles },
  { path: '/admin/reports', label: 'Reportes', icon: BarChart3 },
  { path: '/admin/settings', label: 'Configuración', icon: Settings },
]

function SidebarLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const router = useRouterState()
  const Icon = item.icon
  const isActive = router.location.pathname === item.path || 
    (item.path !== '/admin' && router.location.pathname.startsWith(item.path))
  
  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-beute-gold/10 text-beute-gold font-medium' 
          : 'text-beute-earth-medium hover:bg-beute-cream hover:text-beute-earth-deep'
      }`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span>{item.label}</span>
      {item.path === '/admin/appointments' && (
        <span className="ml-auto bg-beute-gold text-white text-xs px-2 py-0.5 rounded-full">
          3
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-soft"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-beute-taupe/20
        flex flex-col z-50 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-beute-taupe/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-beute-gold to-beute-gold-light 
                            flex items-center justify-center">
              <span className="font-dream text-xl text-white">B</span>
            </div>
            <div>
              <h1 className="font-dream text-xl text-beute-earth-deep">Beauté</h1>
              <p className="text-[10px] text-beute-taupe uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-beute-taupe/10">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="/images/dra-meyryn.jpg" 
              alt="Admin" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-beute-earth-deep truncate">Dra. Meyryn</p>
              <p className="text-xs text-beute-taupe">Administrador</p>
            </div>
          </div>
          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-beute-earth-medium 
                             hover:text-beute-rose transition-colors rounded-lg hover:bg-beute-rose/5">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
