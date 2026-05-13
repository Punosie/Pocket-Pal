import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subMonths,
} from 'date-fns';

export function formatTransactionDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'd MMM yyyy');
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd MMM');
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMMM yyyy');
}

export type PeriodRange = { start: Date; end: Date };

export function getPeriodRange(
  period: 'day' | 'week' | 'month' | 'quarter' | 'year',
  referenceDate = new Date(),
): PeriodRange {
  switch (period) {
    case 'day':
      return { start: startOfDay(referenceDate), end: endOfDay(referenceDate) };
    case 'week':
      return {
        start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
        end: endOfWeek(referenceDate, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(referenceDate),
        end: endOfMonth(referenceDate),
      };
    case 'quarter': {
      const quarterStart = subMonths(startOfMonth(referenceDate), referenceDate.getMonth() % 3);
      return {
        start: quarterStart,
        end: endOfMonth(subMonths(quarterStart, -2)),
      };
    }
    case 'year':
      return {
        start: startOfYear(referenceDate),
        end: endOfYear(referenceDate),
      };
  }
}

export function getLastNDays(n: number): PeriodRange {
  return {
    start: startOfDay(subDays(new Date(), n - 1)),
    end: endOfDay(new Date()),
  };
}
