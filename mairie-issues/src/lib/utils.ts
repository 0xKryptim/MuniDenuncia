import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReportStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an ISO date string to a human-readable relative time format
 * @param date - ISO date string
 * @returns Relative time string (e.g., "2 minutes ago", "3 hours ago")
 */
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return diffSeconds === 1 ? '1 second ago' : `${diffSeconds} seconds ago`;
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  } else {
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
  }
}

/**
 * Converts a ReportStatus to a human-readable label
 * @param status - Report status
 * @returns Human-readable status label
 */
export function getStatusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    submitted: 'Submitted',
    in_review: 'In Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
  };
  return labels[status];
}

/**
 * Extracts initials from a name
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
