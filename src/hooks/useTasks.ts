import { useState, useCallback, useMemo } from 'react';
import { Task, TaskCompletion, DailyStats, TaskCategory } from '@/types';
import { format, subDays, startOfWeek, addDays, isToday, parseISO } from 'date-fns';

// Sample data for demo
const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Morning workout',
    description: '30 minutes of exercise',
    category: 'health',
    type: 'binary',
    repetition: 'daily',
    createdAt: new Date('2024-01-01'),
    archived: false,
  },
  {
    id: '2',
    title: 'Read 20 pages',
    category: 'study',
    type: 'numeric',
    target: 20,
    unit: 'pages',
    repetition: 'daily',
    createdAt: new Date('2024-01-01'),
    archived: false,
  },
  {
    id: '3',
    title: 'Study React',
    description: 'Focus on hooks and state management',
    category: 'study',
    type: 'numeric',
    target: 60,
    unit: 'minutes',
    repetition: 'weekdays',
    createdAt: new Date('2024-01-01'),
    archived: false,
  },
  {
    id: '4',
    title: 'Meditate',
    category: 'health',
    type: 'binary',
    repetition: 'daily',
    createdAt: new Date('2024-01-01'),
    archived: false,
  },
  {
    id: '5',
    title: 'Review emails',
    category: 'work',
    type: 'binary',
    repetition: 'weekdays',
    createdAt: new Date('2024-01-01'),
    archived: false,
  },
  {
    id: '6',
    title: 'Practice typing',
    category: 'personal',
    type: 'numeric',
    target: 15,
    unit: 'minutes',
    repetition: 'daily',
    createdAt: new Date('2024-01-01'),
    archived: false,
  },
];

// Generate sample completions for demo
const generateSampleCompletions = (): TaskCompletion[] => {
  const completions: TaskCompletion[] = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    SAMPLE_TASKS.forEach((task) => {
      // Random completion with higher probability for recent days
      const probability = i < 3 ? 0.7 : 0.5;
      if (Math.random() < probability) {
        completions.push({
          taskId: task.id,
          date,
          completed: true,
          value: task.type === 'numeric' ? Math.floor(Math.random() * (task.target || 30)) + (task.target || 30) * 0.5 : undefined,
          completedAt: new Date(),
        });
      }
    });
  }
  
  return completions;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [completions, setCompletions] = useState<TaskCompletion[]>(generateSampleCompletions);

  const today = format(new Date(), 'yyyy-MM-dd');

  const activeTasks = useMemo(() => tasks.filter((t) => !t.archived), [tasks]);

  const todayCompletions = useMemo(
    () => completions.filter((c) => c.date === today),
    [completions, today]
  );

  const toggleTaskCompletion = useCallback((taskId: string) => {
    const existing = completions.find((c) => c.taskId === taskId && c.date === today);
    
    if (existing) {
      setCompletions((prev) =>
        prev.map((c) =>
          c.taskId === taskId && c.date === today
            ? { ...c, completed: !c.completed }
            : c
        )
      );
    } else {
      setCompletions((prev) => [
        ...prev,
        { taskId, date: today, completed: true, completedAt: new Date() },
      ]);
    }
  }, [completions, today]);

  const getTaskCompletion = useCallback(
    (taskId: string, date: string = today): TaskCompletion | undefined => {
      return completions.find((c) => c.taskId === taskId && c.date === date);
    },
    [completions, today]
  );

  const isTaskCompleted = useCallback(
    (taskId: string, date: string = today): boolean => {
      const completion = getTaskCompletion(taskId, date);
      return completion?.completed ?? false;
    },
    [getTaskCompletion, today]
  );

  const getDailyStats = useCallback(
    (date: string): DailyStats => {
      const dayCompletions = completions.filter((c) => c.date === date);
      const totalTasks = activeTasks.length;
      const completedTasks = dayCompletions.filter((c) => c.completed).length;
      return {
        date,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      };
    },
    [completions, activeTasks]
  );

  const getLast7DaysStats = useCallback((): DailyStats[] => {
    const stats: DailyStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      stats.push(getDailyStats(date));
    }
    return stats;
  }, [getDailyStats]);

  const getCurrentStreak = useCallback((): number => {
    let streak = 0;
    let currentDate = new Date();
    
    // Check today first
    const todayStats = getDailyStats(format(currentDate, 'yyyy-MM-dd'));
    if (todayStats.completionRate >= 80) {
      streak = 1;
    } else if (!isToday(currentDate)) {
      return 0;
    }
    
    // Check previous days
    for (let i = 1; i <= 365; i++) {
      const date = format(subDays(currentDate, i), 'yyyy-MM-dd');
      const stats = getDailyStats(date);
      if (stats.completionRate >= 80) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [getDailyStats]);

  const getWeekProgress = useCallback((): { day: string; completed: boolean; isToday: boolean }[] => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const week: { day: string; completed: boolean; isToday: boolean }[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stats = getDailyStats(dateStr);
      week.push({
        day: format(date, 'EEE'),
        completed: stats.completionRate >= 80,
        isToday: isToday(date),
      });
    }
    
    return week;
  }, [getDailyStats]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'archived'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      archived: false,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const todayStats = useMemo(() => getDailyStats(today), [getDailyStats, today]);
  const last7DaysStats = useMemo(() => getLast7DaysStats(), [getLast7DaysStats]);
  const currentStreak = useMemo(() => getCurrentStreak(), [getCurrentStreak]);
  const weekProgress = useMemo(() => getWeekProgress(), [getWeekProgress]);

  return {
    tasks,
    activeTasks,
    completions,
    todayCompletions,
    todayStats,
    last7DaysStats,
    currentStreak,
    weekProgress,
    toggleTaskCompletion,
    isTaskCompleted,
    getTaskCompletion,
    addTask,
  };
}
