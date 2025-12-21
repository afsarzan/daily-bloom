export type TaskCategory = 'health' | 'work' | 'study' | 'personal' | 'other';

export type TaskType = 'binary' | 'numeric';

export type RepetitionPattern = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  type: TaskType;
  target?: number; // For numeric tasks
  unit?: string; // For numeric tasks (e.g., "minutes", "pages")
  repetition: RepetitionPattern;
  customDays?: number[]; // 0-6 for Sun-Sat if custom pattern
  createdAt: Date;
  archived: boolean;
}

export interface TaskCompletion {
  taskId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  value?: number; // For numeric tasks
  completedAt?: Date;
}

export interface DailyStats {
  date: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface WeeklyStats {
  weekStart: string;
  days: DailyStats[];
  averageCompletionRate: number;
}

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; bgColor: string }> = {
  health: { label: 'Health', color: 'text-success', bgColor: 'bg-success-muted' },
  work: { label: 'Work', color: 'text-chart-2', bgColor: 'bg-accent' },
  study: { label: 'Study', color: 'text-chart-3', bgColor: 'bg-accent' },
  personal: { label: 'Personal', color: 'text-warning', bgColor: 'bg-warning-muted' },
  other: { label: 'Other', color: 'text-muted-foreground', bgColor: 'bg-muted' },
};
