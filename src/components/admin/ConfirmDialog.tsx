import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  trigger: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = true,
  onConfirm,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="border-mg-line bg-mg-ink text-mg-text">
        <AlertDialogHeader>
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="font-display text-lg text-mg-text">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-mg-muted">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-mg-line bg-mg-night/60 text-mg-text hover:bg-mg-ink-soft">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => void onConfirm()}
            className={
              destructive
                ? "bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-900/40 hover:from-rose-600 hover:to-rose-800"
                : "bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-90"
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
