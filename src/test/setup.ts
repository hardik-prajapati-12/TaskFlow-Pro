import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import type { ReactNode } from 'react';

// jsdom has no real animation/paint engine, so Framer Motion's AnimatePresence
// never detects "exit complete" and keeps outgoing elements mounted forever.
// In a real browser the exit finishes and the old element is removed — this
// mock restores that behavior for tests by rendering children directly.
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children?: ReactNode }) => children,
  };
});

// jsdom doesn't implement matchMedia — ThemeContext depends on it for the
// "system" theme option, so provide a minimal, controllable mock.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom doesn't implement ResizeObserver — Recharts' ResponsiveContainer and
// react-big-calendar both use it for layout measurement.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// jsdom doesn't implement scrollTo
window.scrollTo = () => {};

// jsdom doesn't implement elementFromPoint — react-big-calendar's drag-to-select
// wiring calls this on every document mousedown once a Calendar is mounted.
document.elementFromPoint = () => null;
