import { cn } from '@/lib/utils';

interface WeekProgressProps {
  weekProgress: { day: string; completed: boolean; isToday: boolean }[];
  className?: string;
}

export function WeekProgress({ weekProgress, className }: WeekProgressProps) {
  return (
    <div className={cn('flex gap-2 justify-between', className)}>
      {weekProgress.map((day, index) => (
        <div
          key={day.day}
          className="flex flex-col items-center gap-2 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div
            className={cn(
              'streak-dot',
              day.completed && 'completed',
              !day.completed && 'empty',
              day.isToday && 'today'
            )}
          >
            {day.completed ? '✓' : ''}
          </div>
          <span
            className={cn(
              'text-xs font-medium',
              day.isToday ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {day.day}
          </span>
        </div>
      ))}
    </div>
  );
}
