import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  icon: LucideIcon
  iconColor?: 'gold' | 'rose' | 'olive' | 'blue' | 'purple'
  loading?: boolean
}

const colorClasses = {
  gold: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  olive: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon, 
  iconColor = 'gold',
  loading 
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <span className={`flex items-center text-xs font-medium ${
                trend.positive ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {trend.positive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[iconColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
