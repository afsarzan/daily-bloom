import { cn } from '@/lib/utils';
import { Task, CATEGORY_CONFIG } from '@/types';
import { Check, Delete, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './ui/button';

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onDelete: () => void;
  onToggle: () => void;
  animationDelay?: number;
}

export function TaskItem({ task, isCompleted, onDelete, onToggle, animationDelay = 0 }: TaskItemProps) {
  const categoryConfig = CATEGORY_CONFIG[task.category];
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: `${animationDelay}ms`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card',
        'transition-all duration-300 ease-out animate-fade-in',
        'hover:shadow-medium hover:-translate-y-0.5',
        isCompleted && 'bg-accent/30 border-primary/20',
        isDragging && 'opacity-50 shadow-lg z-50'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>

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
      <Dialog.Root>
          <Dialog.Trigger>
            <button ><Delete className="w-5 h-5 text-red-700" /></button>
          </Dialog.Trigger>

          <Dialog.Content >
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Make changes to your profile.
            </Dialog.Description>

               

              <Dialog.Close>
                <Button  color="gray" size='sm' className='mr-2 mt-2'>
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button  color="gray" onClick={onDelete} size='sm'>
                  Delete
                </Button>
              </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>

      
    </div>
  );
}
