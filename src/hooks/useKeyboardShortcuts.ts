import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTasks } from './useTasks';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/**
 * Registers the app-wide keyboard shortcuts described in the spec:
 *   Ctrl/Cmd+N  → new task        Ctrl/Cmd+F → focus search
 *   Delete      → delete selection Esc       → close the topmost modal
 */
export function useKeyboardShortcuts(): void {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    openCreateForm,
    closeForm,
    closeTaskDetails,
    closeConfirm,
    formState,
    isTaskDetailsOpen,
    confirmState,
    searchInputRef,
    selectionMode,
    selectedIds,
    requestConfirm,
    bulkDelete,
  } = useTasks();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const mod = event.ctrlKey || event.metaKey;

      if (mod && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        openCreateForm();
        return;
      }

      if (mod && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        if (location.pathname !== '/tasks') {
          navigate('/tasks');
          window.setTimeout(() => searchInputRef.current?.focus(), 150);
        } else {
          searchInputRef.current?.focus();
        }
        return;
      }

      if (event.key === 'Escape') {
        if (confirmState?.isOpen) {
          closeConfirm();
        } else if (formState.isOpen) {
          closeForm();
        } else if (isTaskDetailsOpen) {
          closeTaskDetails();
        }
        return;
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && !isTypingTarget(event.target)) {
        if (selectionMode && selectedIds.length > 0) {
          event.preventDefault();
          requestConfirm({
            title: `Delete ${selectedIds.length} task${selectedIds.length === 1 ? '' : 's'}?`,
            message: 'Deleted tasks move to Recently Deleted, where they can be restored later.',
            danger: true,
            confirmLabel: 'Delete',
            onConfirm: bulkDelete,
          });
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    navigate,
    location.pathname,
    openCreateForm,
    closeForm,
    closeTaskDetails,
    closeConfirm,
    formState.isOpen,
    isTaskDetailsOpen,
    confirmState?.isOpen,
    searchInputRef,
    selectionMode,
    selectedIds,
    requestConfirm,
    bulkDelete,
  ]);
}
