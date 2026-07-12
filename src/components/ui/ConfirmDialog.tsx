import type { ConfirmState } from '@/types';
import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  state: ConfirmState | null;
  onClose: () => void;
}

export function ConfirmDialog({ state, onClose }: ConfirmDialogProps) {
  if (!state) return null;

  const handleConfirm = () => {
    state.onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={onClose}
      title={state.title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {state.cancelLabel ?? 'Cancel'}
          </Button>
          <Button variant={state.danger ? 'danger' : 'primary'} onClick={handleConfirm}>
            {state.confirmLabel ?? 'Confirm'}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-500 dark:text-ink-300">{state.message}</p>
    </Modal>
  );
}
