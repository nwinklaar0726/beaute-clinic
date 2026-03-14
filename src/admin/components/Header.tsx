import { Bell, Search, Calendar } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  
  const notifications = [
    { id: 1, title: 'Nueva cita agendada', time: '5 min ago', unread: true },
    { id: 2, title: 'Cita cancelada', time: '1 hora ago', unread: true },
    { id: 3, title: 'Recordatorio: Consulta en 30 min', time: '2 horas ago', unread: false },
  ]

  return (
    <header className="bg-white border-b border-beute-taupe/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="font-dream text-2xl text-beute-earth-deep">{title}</h1>
          {subtitle && <p className="text-sm text-beute-taupe">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-beute-cream/50 rounded-xl px-4 py-2">
            <Search className="w-4 h-4 text-beute-taupe" />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="bg-transparent text-sm outline-none w-48 placeholder:text-beute-taupe"
            />
          </div>

          {/* Date Display */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-beute-earth-medium">
            <Calendar className="w-4 h-4 text-beute-gold" />
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-beute-cream transition-colors"
            >
              <Bell className="w-5 h-5 text-beute-earth-medium" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-beute-rose rounded-full" />
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-elegant border border-beute-taupe/10 z-50">
                  <div className="p-4 border-b border-beute-taupe/10">
                    <h3 className="font-medium text-beute-earth-deep">Notificaciones</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        className={`p-4 border-b border-beute-taupe/5 hover:bg-beute-cream/50 cursor-pointer ${
                          n.unread ? 'bg-beute-gold/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                            n.unread ? 'bg-beute-gold' : 'bg-beute-taupe/30'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-beute-earth-dark">{n.title}</p>
                            <p className="text-xs text-beute-taupe mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center">
                    <button className="text-sm text-beute-gold hover:underline">
                      Ver todas
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-beute-gold text-white rounded-xl 
                             hover:bg-beute-gold-dark transition-colors">
            <span className="text-sm font-medium">+ Nueva Cita</span>
          </button>
        </div>
      </div>
    </header>
  )
}
