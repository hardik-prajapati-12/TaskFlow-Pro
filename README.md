# TaskFlow Pro

A premium, offline-first task management dashboard — built as a fully working
production-style SPA, not a mockup. Every feature described below is real,
wired up, and covered by an automated smoke test.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion ·
React Router 7 · React Hook Form · Recharts · react-big-calendar · react-hot-toast

All data lives in your browser's `localStorage`. There is no backend, no
account, and nothing ever leaves your machine.

---

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

### Available scripts

| Command           | What it does                                             |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server with HMR                        |
| `npm run build`    | Type-check (`tsc -b`) and build a production bundle       |
| `npm run preview`  | Serve the production build locally                        |
| `npm run lint`     | Run ESLint over the project                                |
| `npm test`         | Run the Vitest/Testing Library smoke test suite            |

The production build is verified to pass `tsc -b`, `eslint`, and the full
test suite with zero errors — see [Quality checks](#quality-checks) below.

---

## Features

### Dashboard
Welcome greeting with the current date, live stat cards (total / completed /
pending / productivity), an animated circular productivity ring, a linear
progress bar, a daily/weekly/monthly goals widget, an upcoming-deadlines list,
a pinned-tasks widget, and rotating motivational-quote / productivity-tip cards.

### Task management
Create, edit, duplicate, complete (with undo), archive/restore, pin, and
favorite tasks. Every task supports a title, description, category, due date,
priority, estimated time, notes, and an optional recurrence (daily / weekly /
monthly — completing a recurring task automatically schedules the next
occurrence).

### Categories
Seven default categories (Personal, Work, Study, Health, Shopping, Finance,
Travel) plus unlimited custom categories with a picked color, addable inline
from the task form or from Settings.

### Filtering, search & sorting
Filter by All / Pending / Completed / Archived / Today / Upcoming / Overdue,
narrow further by category or priority, toggle a favorites-only view, and
instantly search title/description/category. Sort by due date, priority,
recently added, or alphabetically — pinned tasks always float to the top.

### Bulk actions
Enter selection mode to multi-select tasks and complete, archive, restore, or
delete them together.

### Calendar view
Every task with a due date rendered on a full month/week/day/agenda calendar
(`react-big-calendar`), color-coded by priority, restyled to match the app's
design system in both themes.

### Statistics
Recharts-powered breakdowns: tasks by category (bar), tasks by priority
(donut), and a 14-day completion trend (area chart), alongside live stat cards.

### Recently deleted
Deleting a task moves it to a Recently Deleted list (in Settings) rather than
erasing it immediately — restore it or remove it permanently at any time.

### Settings
Theme (light/dark/system), daily/weekly/monthly goal targets, category
management, JSON export/import, full data reset, the Recently Deleted list,
a keyboard-shortcut reference, and an About section.

### Design & UX
Glassmorphism cards, a signature indigo → teal gradient ("Flow") used
sparingly for primary actions and the productivity ring, soft layered
shadows, light/dark/system themes with persisted preference, Framer Motion
transitions throughout (cards, modals, page transitions, list reordering),
loading skeletons, empty states, and toast notifications for every mutating
action.

### Keyboard shortcuts
`Ctrl/Cmd+N` new task · `Ctrl/Cmd+F` focus search · `Delete` remove the
current multi-selection (with confirmation) · `Esc` close the active modal.

### Accessibility
Semantic landmarks, ARIA labels on every icon-only control, a real focus trap
in modals with focus restoration on close, visible focus rings, keyboard-
operable menus, and `prefers-reduced-motion` support.

### Performance
Route-based code splitting via `React.lazy`/`Suspense` (Calendar and
Statistics — the two heaviest dependencies — only download when visited),
memoized derived state (`useMemo`/`useCallback`), and debounced search.

### Data
Auto-save on every change (no explicit save step for task data), JSON
export/import, and a full local reset — all backed by a small, defensive
`localStorage` wrapper that never throws into the UI.

---

## Quality checks

This isn't just code that "looks right" — it's verified:

- **`tsc -b`** — strict TypeScript, zero errors across the whole project.
- **ESLint** (flat config, typescript-eslint + react-hooks + react-refresh) —
  zero errors.
- **Vitest + React Testing Library** — a real smoke-test suite
  (`src/test/smoke.test.tsx`) that renders the actual app in jsdom and
  exercises it end-to-end: creating/completing/deleting a task through the
  real UI, confirming destructive-action dialogs, navigating every route,
  toggling dark mode, and firing the `Ctrl+N` / `Esc` keyboard shortcuts.
  All 6 scenarios pass.
- **`vite build`** — a clean production build with working code-splitting.

## Folder structure

```
src/
  components/
    ui/           Reusable primitives (Button, Modal, Input, ProgressRing, ...)
    tasks/         Task-specific pieces (TaskCard, TaskList, forms, badges, ...)
    dashboard/     Dashboard widgets (StatCard, GoalsWidget, QuoteWidget, ...)
    navigation/    Navbar, Sidebar, ThemeSwitcher
  layouts/         MainLayout (shell composing Sidebar + Navbar + routed page)
  pages/           Dashboard, Tasks, CalendarView, Statistics, Settings, NotFound
  context/         TaskContext (data + UI orchestration), ThemeContext
  hooks/           useTasks, useTheme, useLocalStorage, useKeyboardShortcuts, ...
  services/        taskService — pure task-mutation logic, framework-free
  utils/           date/, filtering/sorting, storage, export/import, toast copy
  types/           Shared TypeScript types
  constants/       Default categories, priorities, quotes, tips, storage keys
  styles/          Tailwind entry + react-big-calendar theme override
  test/            Vitest setup + smoke tests
```

## Design system

- **Palette:** deep indigo/navy ink scale for text and dark surfaces, a cool
  "paper" neutral for light surfaces, and a signature **Flow** gradient
  (indigo → teal) reserved for primary actions, the productivity ring, and
  active navigation — priority colors (red/amber/green) stay separate and
  functional, per the spec.
- **Type:** Sora for display headings, Inter for UI/body text, IBM Plex Mono
  for keyboard-shortcut hints and other small utility text.
- **Motion:** Framer Motion for card/list entrance & exit, modal transitions,
  page transitions, and the animated productivity ring — all respecting
  `prefers-reduced-motion`.

## Notes on dependencies

- **Tailwind CSS v3** (not v4) was used deliberately for its mature,
  well-documented class-based dark mode (`darkMode: 'class'`) and JS config
  file, which this app relies on heavily for the light/dark/system theme
  switcher.
- **React Big Calendar** and **Recharts** are the two heaviest dependencies,
  so both `CalendarView` and `Statistics` are lazy-loaded — they add nothing
  to the initial bundle.

## Browser storage

TaskFlow Pro stores everything under a handful of namespaced `localStorage`
keys (`taskflow_pro.tasks`, `.categories`, `.trash`, `.goals`, `.theme`).
Clearing your browser's site data for this app will reset it completely —
use **Settings → Export as JSON** first if you want a backup.

---

Built as a demonstration of a complete, production-style React application:
no placeholder components, no stubbed logic, no "TODO: implement this" —
every feature listed above is live in the code.
