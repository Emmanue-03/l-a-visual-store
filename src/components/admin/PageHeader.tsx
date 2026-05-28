import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, description, icon, actions }: Props) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-mg-line bg-mg-ink/60 text-mg-magenta-soft shadow-mg-glow sm:flex">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-mg-text">{title}</h1>
          {description && <p className="mt-1 text-sm text-mg-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
