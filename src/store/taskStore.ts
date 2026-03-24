import { create } from 'zustand';
import type { Task, FilterState, SortConfig, ViewType, Status, Priority } from '../types';
import { TASKS } from '../data/seedData';

const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

interface TaskStore {
  tasks: Task[];
  filters: FilterState;
  sortConfig: SortConfig | null;
  activeView: ViewType;

  updateTaskStatus: (taskId: string, newStatus: Status) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setAllFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  setSortConfig: (config: SortConfig | null) => void;
  setActiveView: (view: ViewType) => void;
}

const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  priorities: [],
  assigneeIds: [],
  dueDateFrom: '',
  dueDateTo: '',
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: TASKS,
  filters: { ...DEFAULT_FILTERS },
  sortConfig: null,
  activeView: 'kanban',

  updateTaskStatus: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setAllFilters: (filters) => set({ filters }),

  clearFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  setSortConfig: (config) => set({ sortConfig: config }),

  setActiveView: (view) => set({ activeView: view }),
}));

export function getFilteredTasks(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter((task) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
      return false;
    }
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }
    if (filters.assigneeIds.length > 0 && !filters.assigneeIds.includes(task.assigneeId)) {
      return false;
    }
    if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) {
      return false;
    }
    if (filters.dueDateTo && task.dueDate > filters.dueDateTo) {
      return false;
    }
    return true;
  });
}

export function sortTasks(tasks: Task[], sortConfig: SortConfig | null): Task[] {
  if (!sortConfig) return tasks;

  const sorted = [...tasks];
  const { field, direction } = sortConfig;
  const multiplier = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (field) {
      case 'title':
        return multiplier * a.title.localeCompare(b.title);
      case 'priority':
        return multiplier * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      case 'dueDate':
        return multiplier * a.dueDate.localeCompare(b.dueDate);
      default:
        return 0;
    }
  });

  return sorted;
}

export function groupTasksByStatus(tasks: Task[]): Record<Status, Task[]> {
  const groups: Record<Status, Task[]> = {
    'todo': [],
    'in-progress': [],
    'in-review': [],
    'done': [],
  };

  for (const task of tasks) {
    groups[task.status].push(task);
  }

  return groups;
}
