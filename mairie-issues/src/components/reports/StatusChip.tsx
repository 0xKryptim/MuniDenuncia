import { Badge } from '@/components/ui/badge';
import type { ReportStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusChipProps {
  status: ReportStatus;
  className?: string;
}

const statusConfig: Record<
  ReportStatus,
  {
    label: string;
    variant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
      | null
      | undefined;
    className: string;
  }
> = {
  submitted: {
    label: 'Enviada',
    variant: 'secondary',
    className:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
  },
  in_review: {
    label: 'En Revisión',
    variant: 'outline',
    className:
      'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700',
  },
  in_progress: {
    label: 'En Progreso',
    variant: 'outline',
    className:
      'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  },
  resolved: {
    label: 'Resuelta',
    variant: 'outline',
    className:
      'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200 border-green-300 dark:border-green-700',
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive',
    className:
      'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200 border-red-300 dark:border-red-700',
  },
};

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'px-2.5 py-0.5 text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
