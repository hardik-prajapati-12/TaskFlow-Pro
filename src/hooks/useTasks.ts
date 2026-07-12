import { useContext } from 'react';
import { TaskContext, type TaskContextValue } from '@/context/TaskContext';

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a <TaskProvider>.');
  }
  return ctx;
}
