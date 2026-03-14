import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; positive: boolean } | null;
  icon: LucideIcon;
  color: 'gold' | 'blue' | 'rose' | 'olive' | 'purple';
}

const colorMap = {
  gold: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', icon: 'text-rose-600' },
  olive: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' },
};

export function StatCard({ title, value, subtitle, trend, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color];
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-beute-taupe/10 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-beute-taupe font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-beute-earth-deep mb-1">{value}</h3>
          {subtitle && <p className="text-xs text-beute-taupe">{subtitle}</p>}
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`flex items-center text-xs font-medium ${
                trend.positive ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {trend.positive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-beute-taupe">vs período anterior</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
