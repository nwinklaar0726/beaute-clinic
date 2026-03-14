import { useState } from 'react'
import { 
  Building2, 
  Clock, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Check
} from 'lucide-react'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'schedule', label: 'Horarios', icon: Clock },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-dream text-2xl text-beute-earth-deep">Configuración</h1>
        <p className="text-sm text-beute-taupe">Administra la configuración de tu clínica</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-soft p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-beute-gold/10 text-beute-gold'
                      : 'text-beute-earth-medium hover:bg-beute-cream'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="font-dream text-xl text-beute-earth-deep">Información General</h2>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                      Nombre del Negocio
                    </label>
                    <input
                      type="text"
                      defaultValue="Beauté by Dra. Meyryn Carrillo"
                      className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                                focus:border-beute-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      defaultValue="info@beaute.cr"
                      className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                                focus:border-beute-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      defaultValue="+506 8888 8888"
                      className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                                focus:border-beute-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      defaultValue="San José, Costa Rica"
                      className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                                focus:border-beute-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Clínica de Estética y Nutrición Integral. Fusionamos la precisión de la medicina estética con la serenidad de un spa médico de lujo."
                    className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                              focus:border-beute-gold focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h2 className="font-dream text-xl text-beute-earth-deep">Horarios de Atención</h2>
                
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                  <div key={day} className="flex items-center gap-4 py-3 border-b border-beute-taupe/10 last:border-0">
                    <div className="w-32">
                      <span className="font-medium text-beute-earth-dark">{day}</span>
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={day !== 'Domingo'} className="rounded text-beute-gold" />
                      <span className="text-sm text-beute-taupe">Abierto</span>
                    </label>
                    {day !== 'Domingo' && (
                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="time"
                          defaultValue="09:00"
                          className="px-3 py-1.5 rounded-lg border border-beute-taupe/20 text-sm"
                        />
                        <span className="text-beute-taupe">a</span>
                        <input
                          type="time"
                          defaultValue={day === 'Sábado' ? '14:00' : '19:00'}
                          className="px-3 py-1.5 rounded-lg border border-beute-taupe/20 text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="font-dream text-xl text-beute-earth-dark">Configuración de Notificaciones</h2>
                
                <div className="space-y-4">
                  {[
                    { label: 'Nueva cita agendada', default: true },
                    { label: 'Cita cancelada', default: true },
                    { label: 'Recordatorio de cita (24h antes)', default: true },
                    { label: 'Nuevo paciente registrado', default: false },
                    { label: 'Reseña recibida', default: true },
                    { label: 'Reportes semanales', default: false },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center justify-between py-3 border-b border-beute-taupe/10 last:border-0">
                      <span className="text-beute-earth-dark">{item.label}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={item.default}
                        className="w-5 h-5 rounded text-beute-gold focus:ring-beute-gold" 
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="font-medium text-beute-earth-dark mb-4">Canales de Notificación</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded text-beute-gold" />
                      <span className="text-beute-earth-medium">Email</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded text-beute-gold" />
                      <span className="text-beute-earth-medium">WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded text-beute-gold" />
                      <span className="text-beute-earth-medium">SMS</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="font-dream text-xl text-beute-earth-deep">Seguridad</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                                focus:border-beute-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                                focus:border-beute-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-beute-earth-dark mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 rounded-xl border border-beute-taupe/20 
                                focus:border-beute-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-beute-taupe/10">
                  <h3 className="font-medium text-beute-earth-dark mb-4">Autenticación de Dos Factores</h3>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded text-beute-gold" />
                    <span className="text-beute-earth-medium">Habilitar 2FA</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="font-dream text-xl text-beute-earth-deep">Facturación</h2>
                
                <div className="bg-beute-cream/30 rounded-xl p-4">
                  <p className="text-sm text-beute-earth-medium mb-2">Plan Actual</p>
                  <p className="font-dream text-2xl text-beute-earth-deep">Profesional</p>
                  <p className="text-sm text-beute-taupe">₡29,900/mes - Renueva el 15 de cada mes</p>
                </div>

                <div>
                  <h3 className="font-medium text-beute-earth-dark mb-4">Métodos de Pago</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-beute-taupe/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-beute-gold/20 rounded" />
                        <div>
                          <p className="font-medium text-beute-earth-dark">•••• 4242</p>
                          <p className="text-xs text-beute-taupe">Expira 12/25</p>
                        </div>
                      </div>
                      <span className="text-xs bg-beute-gold/10 text-beute-gold px-2 py-1 rounded-full">
                        Principal
                      </span>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-beute-gold hover:underline">
                    + Agregar método de pago
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-beute-taupe/10 mt-6">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-beute-gold text-white hover:bg-beute-gold-dark'
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Guardado
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
