export interface Goals {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
}

export interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
}
