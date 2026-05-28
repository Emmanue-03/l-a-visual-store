import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-mg-line bg-mg-ink/40 px-6 py-16 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-mg-line bg-mg-ink text-mg-magenta-soft">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-bold text-mg-text">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-mg-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
