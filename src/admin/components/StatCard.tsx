import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  iconColor?: 'gold' | 'rose' | 'olive' | 'blue'
  loading?: boolean
}

const colorClasses = {
  gold: 'bg-beute-gold/10 text-beute-gold',
  rose: 'bg-beute-rose/10 text-beute-rose',
  olive: 'bg-beute-olive/10 text-beute-olive',
  blue: 'bg-blue-500/10 text-blue-500',
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
      <div className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-beute-taupe/20 rounded" />
            <div className="h-8 w-16 bg-beute-taupe/20 rounded" />
          </div>
          <div className="w-12 h-12 bg-beute-taupe/20 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-beute-taupe font-medium mb-1">{title}</p>
          <h3 className="font-dream text-3xl text-beute-earth-deep mb-1">{value}</h3>
          {subtitle && <p className="text-xs text-beute-taupe">{subtitle}</p>}
          
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <span className={`flex items-center text-xs font-medium ${
                trend.positive ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend.positive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {trend.value}%
              </span>
              <span className="text-xs text-beute-taupe">{trend.label}</span>
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

// Mini stat for inline display
export function MiniStat({ 
  label, 
  value, 
  trend 
}: { 
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
}) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-xs text-beute-taupe uppercase tracking-wider">{label}</p>
        <p className="font-dream text-xl text-beute-earth-deep">{value}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-0.5 text-xs font-medium ${
          trend.positive ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
          {trend.value}%
        </div>
      )}
    </div>
  )
}
