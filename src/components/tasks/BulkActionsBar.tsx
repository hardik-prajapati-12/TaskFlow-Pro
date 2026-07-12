import { AnimatePresence, motion } from 'framer-motion';
import { FiArchive, FiCheck, FiRotateCcw, FiTrash2, FiX } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';

export function BulkActionsBar() {
  const {
    selectionMode,
    selectedIds,
    toggleSelectionMode,
    selectAllVisible,
    bulkComplete,
    bulkArchive,
    bulkRestore,
    bulkDelete,
    filter,
    requestConfirm,
  } = useTasks();

  const count = selectedIds.length;

  const handleBulkDelete = () => {
    requestConfirm({
      title: `Delete ${count} task${count === 1 ? '' : 's'}?`,
      message: 'These tasks will move to Recently Deleted, where they can be restored later.',
      danger: true,
      confirmLabel: 'Delete',
      onConfirm: bulkDelete,
    });
  };

  return (
    <AnimatePresence>
      {selectionMode && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="glass-panel-solid sticky bottom-4 z-30 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 shadow-soft-lg"
        >
          <span className="text-sm font-medium text-ink-600 dark:text-ink-200">{count} selected</span>
          <button
            type="button"
            onClick={selectAllVisible}
            className="text-sm font-medium text-flow-600 hover:underline dark:text-flow-300"
          >
            Select all
          </button>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {count > 0 && (
              <>
                {filter === 'archived' ? (
                  <Button variant="secondary" size="sm" leftIcon={<FiRotateCcw aria-hidden="true" />} onClick={bulkRestore}>
                    Restore
                  </Button>
                ) : (
                  <>
                    <Button variant="secondary" size="sm" leftIcon={<FiCheck aria-hidden="true" />} onClick={bulkComplete}>
                      Complete
                    </Button>
                    <Button variant="secondary" size="sm" leftIcon={<FiArchive aria-hidden="true" />} onClick={bulkArchive}>
                      Archive
                    </Button>
                  </>
                )}
                <Button variant="danger" size="sm" leftIcon={<FiTrash2 aria-hidden="true" />} onClick={handleBulkDelete}>
                  Delete
                </Button>
              </>
            )}
            <IconButton icon={<FiX aria-hidden="true" />} label="Exit selection mode" onClick={toggleSelectionMode} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
