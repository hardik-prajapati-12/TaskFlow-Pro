import toast from 'react-hot-toast';

/**
 * Centralized toast copy so every part of the app reports task actions
 * with consistent, predictable wording.
 */
export const notify = {
  taskAdded: (title: string) => toast.success(`"${title}" added`),
  taskUpdated: (title: string) => toast.success(`"${title}" updated`),
  taskDeleted: (title: string) => toast.success(`"${title}" moved to Recently Deleted`),
  taskDuplicated: (title: string) => toast.success(`"${title}" duplicated`),
  taskCompleted: (title: string) => toast.success(`"${title}" completed 🎉`),
  taskReopened: (title: string) => toast(`"${title}" marked as pending`, { icon: '↩️' }),
  taskArchived: (title: string) => toast.success(`"${title}" archived`),
  taskRestored: (title: string) => toast.success(`"${title}" restored`),
  taskPinned: (pinned: boolean) => toast(pinned ? 'Pinned to top' : 'Unpinned', { icon: '📌' }),
  taskFavorited: (favorited: boolean) => toast(favorited ? 'Added to favorites' : 'Removed from favorites', { icon: '⭐' }),
  recurringCreated: (title: string) => toast(`Next occurrence of "${title}" scheduled`, { icon: '🔁' }),
  categoryAdded: (name: string) => toast.success(`Category "${name}" created`),
  categoryDeleted: (name: string) => toast.success(`Category "${name}" removed`),
  bulkAction: (count: number, action: string) => toast.success(`${action} ${count} task${count === 1 ? '' : 's'}`),
  trashEmptied: () => toast.success('Recently Deleted is now empty'),
  dataExported: () => toast.success('Export ready — check your downloads'),
  dataImported: (count: number) => toast.success(`Imported ${count} task${count === 1 ? '' : 's'}`),
  dataReset: () => toast.success('All data has been reset'),
  taskAutoTerminated: (count: number) => toast(`${count} task${count === 1 ? '' : 's'} auto-terminated (exceeded time limit)`, { icon: '🛑' }),
  info: (message: string) => toast(message, { icon: 'ℹ️' }),
  error: (message: string) => toast.error(message),
};
