import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success';
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  className,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend.value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-success';
    if (trend.value < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'metric-card group',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'success' && 'bg-success text-success-foreground',
        className
      )}
    >
      {/* Decorative gradient */}
      <div
        className={cn(
          'absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-20',
          variant === 'default' && 'bg-primary',
          variant === 'primary' && 'bg-primary-foreground',
          variant === 'success' && 'bg-success-foreground'
        )}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'default' && 'text-muted-foreground'
            )}
          >
            {title}
          </p>
          {icon && (
            <div
              className={cn(
                'p-2 rounded-xl',
                variant === 'default' && 'bg-accent text-primary',
                variant === 'primary' && 'bg-primary-foreground/10',
                variant === 'success' && 'bg-success-foreground/10'
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {subtitle && (
            <span
              className={cn(
                'text-sm',
                variant === 'default' && 'text-muted-foreground'
              )}
            >
              {subtitle}
            </span>
          )}
        </div>

        {trend && (
          <div className={cn('flex items-center gap-1 mt-2 text-xs', getTrendColor())}>
            {getTrendIcon()}
            <span className="font-medium">{Math.abs(trend.value)}%</span>
            <span className={variant === 'default' ? 'text-muted-foreground' : 'opacity-80'}>
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
