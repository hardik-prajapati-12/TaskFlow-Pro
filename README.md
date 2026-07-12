# TaskFlow Pro

A premium, offline-first task management dashboard — built as a fully working production-style SPA, not a mockup. Every feature described below is real, wired up, and covered by an automated smoke test.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · React Router 7 · React Hook Form · Recharts · react-big-calendar · react-hot-toast

All data lives in your browser's `localStorage`. There is no backend, no account, and nothing ever leaves your machine.

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

The production build is verified to pass `tsc -b`, `eslint`, and the full test suite with zero errors — see [Quality checks](#quality-checks) below.

---

## Features

### Dashboard
Welcome greeting with the current date, live stat cards (total / completed / pending / productivity), an animated circular productivity ring, a linear progress bar, a daily/weekly/monthly goals widget, an upcoming-deadlines list, a pinned-tasks widget, and rotating motivational-quote / productivity-tip cards.

### Task management
Create, edit, duplicate, complete (with undo), archive/restore, pin, and favorite tasks. Every task supports a title, description, category, due date, priority, estimated time, notes, and an optional recurrence (daily / weekly / monthly — completing a recurring task automatically schedules the next occurrence).
* **Smart Completion Undo:** Unmarking a completed recurring task will automatically clean up/delete the newly spawned next occurrence task (as long as it remains unmodified), preventing task duplication.

### Custom category color picker
Seven default categories (Personal, Work, Study, Health, Shopping, Finance, Travel) plus unlimited custom categories.
* **Custom Color Picker:** Replaced predefined swatches with a professional, interactive color picker button and a manual `#HEX` text input field supporting regex-validated custom inputs in both the Settings view and the task creation form modal.

### Flexible category deletion
* **Delete Default & Custom Categories:** Users can delete any category (including default ones) at any time. To protect your data, a delete button is shown as long as at least two categories exist (preventing empty category states).
* **Dynamic Task Reassignment:** When a category is deleted, any tasks associated with it are dynamically moved to the next remaining category. The confirmation dialog dynamically updates to display the name of the fallback category.

### Filtering, search & sorting
Filter by All / Pending / Completed / Archived / Today / Upcoming / Overdue, narrow further by category or priority, toggle a favorites-only view, and instantly search title/description/category. Sort by due date, priority, recently added, or alphabetically — pinned tasks always float to the top.

### Bulk actions
Enter selection mode to multi-select tasks and complete, archive, restore, or delete them together.

### Calendar view
Every task with a due date rendered on a full month/week/day/agenda calendar (`react-big-calendar`), color-coded by priority, restyled to match the app's design system in both themes.

### Statistics
Recharts-powered breakdowns: tasks by category (bar), tasks by priority (donut), and a 14-day completion trend (area chart), alongside live stat cards.

### Recently deleted
Deleting a task moves it to a Recently Deleted list (in Settings) rather than erasing it immediately — restore it or remove it permanently at any time.

### Settings
Theme (light/dark/system), daily/weekly/monthly goal targets, category management with custom color picker, JSON export/import, full data reset, the Recently Deleted list, a keyboard-shortcut reference, and an About section.

### Localhost request intercept protection
* **Service Worker Cleanup:** Built-in automatic unregistration of any legacy active service workers from other projects sharing `localhost:5173`. This ensures browser requests are never intercepted by cached index configurations of prior localhost web developments.

### Design & UX
Glassmorphism cards, a signature indigo → teal gradient ("Flow") used sparingly for primary actions and the productivity ring, soft layered shadows, light/dark/system themes with persisted preference, Framer Motion transitions throughout (cards, modals, page transitions, list reordering), loading skeletons, empty states, and toast notifications for every mutating action.

### Keyboard shortcuts
`Ctrl/Cmd+N` new task · `Ctrl/Cmd+F` focus search · `Delete` remove the current multi-selection (with confirmation) · `Esc` close the active modal.

---

## Quality checks

This isn't just code that "looks right" — it's verified:

- **`tsc -b`** — strict TypeScript, zero errors across the whole project.
- **ESLint** (flat config, typescript-eslint + react-hooks + react-refresh) — zero errors.
- **Vitest + React Testing Library** — a real smoke-test suite (`src/test/smoke.test.tsx`) that renders the actual app in jsdom and exercises it end-to-end:
  * Creating/completing/deleting a task through the UI.
  * Toggling dark mode.
  * Opening the task modal with keyboard shortcuts.
  * Navigating route tabs.
  * **Recurring tasks validation:** Completing and undoing recurring tasks checks next occurrence creation and cleanups.
  * **Category deletion validation:** Deleting a default category and confirming tasks are shifted to the next fallback category.
  * **All 8 scenarios pass successfully.**
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

---

Built as a demonstration of a complete, production-style React application: no placeholder components, no stubbed logic, no "TODO: implement this" — every feature listed above is live in the code.
