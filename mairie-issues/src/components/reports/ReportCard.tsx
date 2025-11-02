import { Calendar } from 'lucide-react';
import type { Report } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { StatusChip } from './StatusChip';
import { formatRelativeTime, cn } from '@/lib/utils';

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200',
        onClick &&
          'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      {/* Thumbnail Image */}
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {report.photoUrl ? (
            <img
              src={report.photoUrl}
              alt={report.title}
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base line-clamp-2 leading-tight">
          {report.title}
        </h3>

        {/* Description (optional, truncated) */}
        {report.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {report.description}
          </p>
        )}

        {/* Status Chip */}
        <div className="flex items-center">
          <StatusChip status={report.status} />
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        {/* Created Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatRelativeTime(report.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
