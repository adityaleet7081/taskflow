export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  status: Status;
  startDate: string | null;
  dueDate: string;
  createdAt: string;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  currentTaskId: string | null;
  action: 'viewing' | 'editing';
}

export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export type ViewType = 'kanban' | 'list' | 'timeline';

// Re-export runtime values for bundler compatibility
export const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
export const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
