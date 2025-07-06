import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد الحذف",
}: ConfirmDialogProps) {
  return (
<Dialog.Root open={open} onOpenChange={(v) => !v && onClose()} modal={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg space-y-4">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          {description && <Dialog.Description>{description}</Dialog.Description>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>إلغاء</Button>
            <Button variant="destructive" onClick={onConfirm}>{confirmText}</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}