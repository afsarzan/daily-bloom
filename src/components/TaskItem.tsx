import { cn } from '@/lib/utils';
import { Task, CATEGORY_CONFIG } from '@/types';
import { Check } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  animationDelay?: number;
}

export function TaskItem({ task, isCompleted, onToggle, animationDelay = 0 }: TaskItemProps) {
  const categoryConfig = CATEGORY_CONFIG[task.category];

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card',
        'transition-all duration-300 ease-out animate-fade-in',
        'hover:shadow-medium hover:-translate-y-0.5',
        isCompleted && 'bg-accent/30 border-primary/20'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'task-checkbox flex-shrink-0',
          isCompleted && 'completed'
        )}
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isCompleted && (
          <Check className="w-4 h-4 text-primary-foreground animate-scale-in" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              'font-medium transition-all duration-200',
              isCompleted && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h3>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              categoryConfig.bgColor,
              categoryConfig.color
            )}
          >
            {categoryConfig.label}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {task.description}
          </p>
        )}
        {task.type === 'numeric' && task.target && (
          <p className="text-xs text-muted-foreground mt-1">
            Target: {task.target} {task.unit}
          </p>
        )}
      </div>

      {/* Repetition badge */}
      <div className="hidden sm:flex items-center">
        <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded-md">
          {task.repetition}
        </span>
      </div>
    </div>
  );
}
