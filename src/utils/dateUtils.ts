const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isDueToday(dueDate: string): boolean {
  const today = getToday();
  const due = parseDate(dueDate);
  return due.getTime() === today.getTime();
}

export function isOverdue(dueDate: string): boolean {
  const today = getToday();
  const due = parseDate(dueDate);
  return due.getTime() < today.getTime();
}

export function daysOverdue(dueDate: string): number {
  const today = getToday();
  const due = parseDate(dueDate);
  const diffMs = today.getTime() - due.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function formatDueDate(dueDate: string): string {
  if (isDueToday(dueDate)) return 'Due Today';
  
  const overdueDays = daysOverdue(dueDate);
  if (overdueDays > 7) return `${overdueDays} days overdue`;
  
  const due = parseDate(dueDate);
  return `${MONTHS[due.getMonth()]} ${due.getDate()}`;
}

export function getDueDateColor(dueDate: string): string {
  if (isDueToday(dueDate)) return 'text-amber-600';
  if (isOverdue(dueDate)) return 'text-red-500';
  return 'text-slate-500';
}

export function formatDateShort(dateStr: string): string {
  const d = parseDate(dateStr);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
