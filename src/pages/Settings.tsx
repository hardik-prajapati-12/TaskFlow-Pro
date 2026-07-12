import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { FiDownload, FiInfo, FiPlus, FiRefreshCcw, FiRotateCcw, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { ThemeSwitcher } from '@/components/navigation/ThemeSwitcher';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { SHORTCUTS } from '@/constants/shortcuts';
import { formatRelative } from '@/utils/date';
import { cn } from '@/utils/cn';

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{title}</h2>
        </div>
        {description && <p className="mt-1 text-sm text-ink-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Settings() {
  const {
    categories,
    addCategory,
    deleteCategory,
    goals,
    updateGoals,
    exportData,
    importData,
    resetAllData,
    trash,
    restoreFromTrash,
    permanentlyDelete,
    emptyTrash,
    requestConfirm,
  } = useTasks();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366F1');
  const [goalDrafts, setGoalDrafts] = useState(goals);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName('');
  };

  const handleSaveGoals = () => {
    updateGoals({
      daily: Math.max(0, Number(goalDrafts.daily) || 0),
      weekly: Math.max(0, Number(goalDrafts.weekly) || 0),
      monthly: Math.max(0, Number(goalDrafts.monthly) || 0),
    });
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await importData(file);
    event.target.value = '';
  };

  const handleReset = () => {
    requestConfirm({
      title: 'Reset all data?',
      message: 'This permanently deletes every task, category, and setting on this device. This cannot be undone.',
      danger: true,
      confirmLabel: 'Reset everything',
      onConfirm: resetAllData,
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const remaining = categories.filter((c) => c.id !== id);
    const fallbackName = remaining[0]?.name || 'another category';
    requestConfirm({
      title: `Delete "${name}"?`,
      message: `Any tasks in this category will be moved to ${fallbackName}.`,
      danger: true,
      confirmLabel: 'Delete',
      onConfirm: () => deleteCategory(id),
    });
  };

  const handleEmptyTrash = () => {
    requestConfirm({
      title: 'Empty Recently Deleted?',
      message: `This permanently removes all ${trash.length} task${trash.length === 1 ? '' : 's'} in Recently Deleted.`,
      danger: true,
      confirmLabel: 'Empty trash',
      onConfirm: emptyTrash,
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-ink-400">Manage your preferences, categories, and data.</p>
      </div>

      <SectionCard title="Appearance" description="Choose how TaskFlow looks on this device.">
        <ThemeSwitcher />
      </SectionCard>

      <SectionCard title="Goals" description="Set targets to track how consistent you're being.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="goal-daily">
              Daily
            </label>
            <Input
              id="goal-daily"
              type="number"
              min={0}
              value={goalDrafts.daily}
              onChange={(e) => setGoalDrafts((g) => ({ ...g, daily: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="goal-weekly">
              Weekly
            </label>
            <Input
              id="goal-weekly"
              type="number"
              min={0}
              value={goalDrafts.weekly}
              onChange={(e) => setGoalDrafts((g) => ({ ...g, weekly: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="goal-monthly">
              Monthly
            </label>
            <Input
              id="goal-monthly"
              type="number"
              min={0}
              value={goalDrafts.monthly}
              onChange={(e) => setGoalDrafts((g) => ({ ...g, monthly: Number(e.target.value) }))}
            />
          </div>
        </div>
        <Button className="mt-4" size="sm" onClick={handleSaveGoals}>
          Save goals
        </Button>
      </SectionCard>

      <SectionCard title="Categories" description="Organize tasks with default or custom categories.">
        <ul className="mb-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 rounded-full border border-ink-100 py-1 pl-3 pr-1.5 dark:border-ink-700"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} aria-hidden="true" />
              <span className="text-sm text-ink-600 dark:text-ink-300">{c.name}</span>
              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  aria-label={`Delete ${c.name} category`}
                  className="rounded-full p-1 text-ink-300 transition-colors hover:bg-priority-high/10 hover:text-priority-high"
                >
                  <FiX className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('settings-category-color-picker')?.click()}
              className="h-9 w-9 rounded-xl border border-ink-200 shadow-sm transition-transform hover:scale-105 active:scale-95 dark:border-ink-700"
              style={{ backgroundColor: newCategoryColor }}
              title="Choose custom color"
            />
            <input
              id="settings-category-color-picker"
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
            />
            <input
              type="text"
              value={newCategoryColor.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                  setNewCategoryColor(val);
                }
              }}
              maxLength={7}
              className="w-24 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-center text-sm font-mono text-ink-700 shadow-sm focus:border-flow-500 focus:outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
              placeholder="#HEX"
            />
          </div>
          <Button size="sm" leftIcon={<FiPlus aria-hidden="true" />} onClick={handleAddCategory}>
            Add category
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Data management" description="Your data lives only in this browser — back it up any time.">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" leftIcon={<FiDownload aria-hidden="true" />} onClick={exportData}>
            Export as JSON
          </Button>
          <Button variant="secondary" leftIcon={<FiUpload aria-hidden="true" />} onClick={handleImportClick}>
            Import from JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="danger" leftIcon={<FiRefreshCcw aria-hidden="true" />} onClick={handleReset}>
            Reset all data
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Recently deleted"
        description="Deleted tasks stay here until you restore them or remove them for good."
      >
        {trash.length === 0 ? (
          <EmptyState icon={<FiTrash2 />} title="Nothing in the trash" description="Deleted tasks will appear here." />
        ) : (
          <>
            <ul className="divide-y divide-ink-100 dark:divide-ink-700">
              {trash.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-700 dark:text-ink-200">{task.title}</p>
                    <p className="text-xs text-ink-400">Deleted {formatRelative(task.deletedAt)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<FiRotateCcw aria-hidden="true" />}
                      onClick={() => restoreFromTrash(task.id)}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<FiTrash2 aria-hidden="true" />}
                      onClick={() => permanentlyDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" className="mt-3 text-priority-high" onClick={handleEmptyTrash}>
              Empty trash
            </Button>
          </>
        )}
      </SectionCard>

      <SectionCard title="Keyboard shortcuts">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SHORTCUTS.map((s) => (
            <li key={s.description} className="flex items-center justify-between text-sm">
              <span className="text-ink-500 dark:text-ink-300">{s.description}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <span key={k} className="kbd">
                    {k}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="About" icon={<FiInfo className="text-flow-500" aria-hidden="true" />}>
        <div className="space-y-1.5 text-sm text-ink-500 dark:text-ink-300">
          <p>
            <span className="font-semibold text-ink-800 dark:text-white">TaskFlow</span> — a premium,
            offline-first task management dashboard.
          </p>
          <p>Version 1.0.0</p>
          <p>Built with React 19, Vite, TypeScript, Tailwind CSS, and Framer Motion.</p>
          <p>All data is stored locally in your browser via localStorage — nothing is ever sent to a server.</p>
        </div>
      </SectionCard>
    </div>
  );
}
