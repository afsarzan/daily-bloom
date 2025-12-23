import { useTasks } from '@/hooks/useTasks';
import { MetricCard } from '@/components/MetricCard';
import { ProgressRing } from '@/components/ProgressRing';
import { TaskItem } from '@/components/TaskItem';
import { WeekProgress } from '@/components/WeekProgress';
import { ProgressChart } from '@/components/ProgressChart';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { Target, Flame, TrendingUp, CheckCircle2, Calendar, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const Index = () => {
  const {
    activeTasks,
    todayStats,
    last7DaysStats,
    currentStreak,
    weekProgress,
    toggleTaskCompletion,
    isTaskCompleted,
    addTask,
    reorderTasks,
  } = useTasks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string);
    }
  };

  const weeklyAverage = Math.round(
    last7DaysStats.reduce((sum, stat) => sum + stat.completionRate, 0) / 7
  );

  const prevWeekAverage = 65; // Simulated for demo

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DailyFlow</h1>
                <p className="text-xs text-muted-foreground">Track your progress</p>
              </div>
            </div>
            <AddTaskDialog onAddTask={addTask} />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <section className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-1">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!
          </h2>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Today's Progress"
            value={`${todayStats.completionRate}%`}
            subtitle={`${todayStats.completedTasks}/${todayStats.totalTasks} tasks`}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="primary"
          />
          <MetricCard
            title="Current Streak"
            value={currentStreak}
            subtitle="days"
            icon={<Flame className="w-5 h-5" />}
            trend={currentStreak > 0 ? { value: 12, label: 'vs last week' } : undefined}
          />
          <MetricCard
            title="Weekly Average"
            value={`${weeklyAverage}%`}
            icon={<BarChart3 className="w-5 h-5" />}
            trend={{ value: weeklyAverage - prevWeekAverage, label: 'vs prev week' }}
          />
          <MetricCard
            title="Tasks Completed"
            value={todayStats.completedTasks}
            subtitle="today"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Today's Tasks</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {todayStats.completedTasks} of {todayStats.totalTasks} completed
              </span>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activeTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {activeTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isCompleted={isTaskCompleted(task.id)}
                      onToggle={() => toggleTaskCompletion(task.id)}
                      animationDelay={index * 50}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {activeTasks.length === 0 && (
              <div className="text-center py-12 bg-card rounded-xl border border-border/50">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">No tasks yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by adding your first daily task
                </p>
              </div>
            )}
          </section>

          {/* Sidebar Stats */}
          <aside className="space-y-6">
            {/* Progress Ring Card */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft animate-fade-in">
              <h4 className="font-semibold mb-4">Today's Goal</h4>
              <div className="flex justify-center">
                <ProgressRing value={todayStats.completionRate} size={140} strokeWidth={10}>
                  <div className="text-center">
                    <span className="text-3xl font-bold">{todayStats.completionRate}%</span>
                    <p className="text-xs text-muted-foreground">completed</p>
                  </div>
                </ProgressRing>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                {todayStats.completionRate >= 80
                  ? '🎉 Great job! Goal achieved!'
                  : `Complete ${Math.ceil((0.8 * todayStats.totalTasks) - todayStats.completedTasks)} more to reach 80%`}
              </p>
            </div>

            {/* Week Progress Card */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h4 className="font-semibold mb-4">This Week</h4>
              <WeekProgress weekProgress={weekProgress} />
              <p className="text-center text-sm text-muted-foreground mt-4">
                {weekProgress.filter(d => d.completed).length} of 7 days completed
              </p>
            </div>

            {/* 7-Day Trend */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">7-Day Trend</h4>
                <span className="text-xs text-muted-foreground">Completion rate</span>
              </div>
              <ProgressChart data={last7DaysStats} />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Build better habits, one day at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
