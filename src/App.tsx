import { lazy, Suspense, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { TaskProvider } from '@/context/TaskContext';
import { MainLayout } from '@/layouts/MainLayout';
import { PageSkeleton } from '@/components/ui/Skeleton';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const CalendarView = lazy(() => import('@/pages/CalendarView'));
const Statistics = lazy(() => import('@/pages/Statistics'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageSkeleton />}>{element}</Suspense>;
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={withSuspense(<Dashboard />)} />
            <Route path="tasks" element={withSuspense(<Tasks />)} />
            <Route path="calendar" element={withSuspense(<CalendarView />)} />
            <Route path="statistics" element={withSuspense(<Statistics />)} />
            <Route path="settings" element={withSuspense(<Settings />)} />
            <Route path="*" element={withSuspense(<NotFound />)} />
          </Route>
        </Routes>
      </TaskProvider>
    </ThemeProvider>
  );
}
