import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import type { Category, Task, TaskFormValues } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { toDateInputValue } from '@/utils/date';
import { CATEGORY_COLOR_SWATCHES } from '@/constants/categories';
import { cn } from '@/utils/cn';

const EMPTY_VALUES: TaskFormValues = {
  title: '',
  description: '',
  category: 'personal',
  dueDate: '',
  priority: 'medium',
  estimatedTime: '',
  notes: '',
  recurrence: 'none',
};

function buildDefaultValues(task: Task | undefined, categories: Category[]): TaskFormValues {
  if (task) {
    return {
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: toDateInputValue(task.dueDate),
      priority: task.priority,
      estimatedTime: task.estimatedTime ? String(task.estimatedTime) : '',
      notes: task.notes,
      recurrence: task.recurrence,
    };
  }
  return { ...EMPTY_VALUES, category: categories[0]?.id ?? 'personal' };
}

/**
 * Rendered fresh (via `key`) every time the modal opens for a create action or a
 * different/edited task, so its default values are simply computed once at mount —
 * no effect needed to "reset" the form when the target task changes.
 */
function TaskFormFields() {
  const { formState, categories, addCategory, addTask, updateTask } = useTasks();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({ defaultValues: buildDefaultValues(formState.task, categories) });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLOR_SWATCHES[0]);

  const onSubmit = (values: TaskFormValues) => {
    if (formState.mode === 'edit' && formState.task) {
      updateTask(formState.task.id, values);
    } else {
      addTask(values);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName('');
    setShowNewCategory(false);
  };

  return (
    <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="field-label" htmlFor="task-title">
          Title
        </label>
        <Input
          id="task-title"
          placeholder="e.g. Finish the quarterly report"
          error={errors.title?.message}
          {...register('title', {
            required: 'A title is required',
            maxLength: { value: 120, message: 'Keep it under 120 characters' },
          })}
        />
        {errors.title && <p className="field-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="task-description">
          Description
        </label>
        <Textarea id="task-description" placeholder="Add any extra context..." {...register('description')} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="field-label mb-0" htmlFor="task-category">
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowNewCategory((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-flow-600 hover:text-flow-700 dark:text-flow-300"
            >
              <FiPlus className="h-3 w-3" aria-hidden="true" /> New
            </button>
          </div>
          <Select id="task-category" {...register('category')}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="field-label" htmlFor="task-priority">
            Priority
          </label>
          <Select id="task-priority" {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
      </div>

      {showNewCategory && (
        <div className="glass-panel rounded-xl p-3">
          <p className="mb-2 text-xs font-medium text-ink-400">New category</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center gap-1.5">
              {CATEGORY_COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategoryColor(color)}
                  aria-label={`Choose color ${color}`}
                  aria-pressed={newCategoryColor === color}
                  className={cn(
                    'h-6 w-6 rounded-full border-2 transition-transform',
                    newCategoryColor === color ? 'scale-110 border-ink-900 dark:border-white' : 'border-transparent',
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Button type="button" size="sm" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="task-due-date">
            Due date
          </label>
          <Input id="task-due-date" type="date" {...register('dueDate')} />
        </div>
        <div>
          <label className="field-label" htmlFor="task-estimated-time">
            Estimated time (minutes)
          </label>
          <Input
            id="task-estimated-time"
            type="number"
            min={0}
            step={5}
            placeholder="e.g. 30"
            {...register('estimatedTime')}
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="task-recurrence">
          Repeat
        </label>
        <Select id="task-recurrence" {...register('recurrence')}>
          <option value="none">Does not repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
      </div>

      <div>
        <label className="field-label" htmlFor="task-notes">
          Notes
        </label>
        <Textarea id="task-notes" placeholder="Any additional notes..." {...register('notes')} />
      </div>
    </form>
  );
}

export function TaskFormModal() {
  const { formState, closeForm } = useTasks();
  const formKey = `${formState.mode}-${formState.task?.id ?? 'new'}`;

  return (
    <Modal
      isOpen={formState.isOpen}
      onClose={closeForm}
      title={formState.mode === 'edit' ? 'Edit task' : 'Create a new task'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={closeForm}>
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            {formState.mode === 'edit' ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <TaskFormFields key={formKey} />
    </Modal>
  );
}
