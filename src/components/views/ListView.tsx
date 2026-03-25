import React, { useMemo, useCallback, useRef, useState } from 'react';
import type { Status, SortField, Task, CollabUser } from '../../types';
import { USERS } from '../../data/seedData';
import { useTaskStore, getFilteredTasks, sortTasks } from '../../store/taskStore';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { formatDueDate, getDueDateColor } from '../../utils/dateUtils';
import PriorityBadge from '../ui/PriorityBadge';
import Avatar from '../ui/Avatar';
import CollabIndicator from '../ui/CollabIndicator';
import EmptyState from '../ui/EmptyState';
import { useCollabStore, getTaskCollabUsers } from '../../store/collabStore';

const ITEM_HEIGHT = 56;

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

const STATUS_COLORS: Record<Status, string> = {
  'todo': 'bg-slate-100 text-slate-600',
  'in-progress': 'bg-blue-50 text-blue-700',
  'in-review': 'bg-purple-50 text-purple-700',
  'done': 'bg-green-50 text-green-700',
};

// Only 3 sortable columns — no duplicate
const SORT_COLUMNS: { field: SortField; label: string }[] = [
  { field: 'title', label: 'Title' },
  { field: 'priority', label: 'Priority' },
  { field: 'dueDate', label: 'Due Date' },
];

const ListView: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const sortConfig = useTaskStore((s) => s.sortConfig);
  const setSortConfig = useTaskStore((s) => s.setSortConfig);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const clearFilters = useTaskStore((s) => s.clearFilters);
  const collabUsers = useCollabStore((s) => s.users);

  const filteredTasks = useMemo(() => {
    const filtered = getFilteredTasks(tasks, filters);
    return sortTasks(filtered, sortConfig);
  }, [tasks, filters, sortConfig]);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 600;

  const { startIndex, endIndex, offsetY, totalHeight, onScroll } = useVirtualScroll({
    itemCount: filteredTasks.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    bufferSize: 5,
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e.currentTarget.scrollTop);
  }, [onScroll]);

  const toggleSort = useCallback((field: SortField) => {
    if (sortConfig?.field === field) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ field, direction: 'desc' });
      } else {
        setSortConfig(null);
      }
    } else {
      setSortConfig({ field, direction: 'asc' });
    }
  }, [sortConfig, setSortConfig]);

  const visibleTasks = useMemo(
    () => filteredTasks.slice(startIndex, endIndex + 1),
    [filteredTasks, startIndex, endIndex]
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: containerHeight }}>
        <EmptyState
          icon="🔍"
          title="No tasks found"
          message="No tasks match your current filters. Try adjusting them."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Row — 5 columns, no duplicate */}
      <div className="grid grid-cols-[1fr_160px_120px_150px_44px] px-4 py-3 bg-slate-50 border-b border-slate-200">
        {SORT_COLUMNS.map(({ field, label }) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`flex items-center gap-1 text-xs font-semibold tracking-wide rounded px-1 py-0.5 -mx-1 transition-colors duration-150 cursor-pointer text-left
              ${sortConfig?.field === field ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            {label}
            <span className="text-[10px]">
              {sortConfig?.field === field
                ? sortConfig.direction === 'asc' ? '↑' : '↓'
                : <span className="text-slate-300">↕</span>}
            </span>
          </button>
        ))}
        {/* Status — not sortable */}
        <span className="text-xs font-semibold text-slate-500 tracking-wide flex items-center">
          Status
        </span>
        {/* Collab — empty header */}
        <span />
      </div>

      {/* Scrollable Body */}
      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ height: `calc(100vh - 200px)` }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, paddingTop: offsetY, position: 'relative' }}>
          {visibleTasks.map((task) => (
            <ListRow
              key={task.id}
              task={task}
              collabUsers={getTaskCollabUsers(collabUsers, task.id)}
              onStatusChange={updateTaskStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ListRowProps {
  task: Task;
  collabUsers: CollabUser[];
  onStatusChange: (taskId: string, status: Status) => void;
}

const ListRow: React.FC<ListRowProps> = React.memo(({ task, collabUsers, onStatusChange }) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const dueDateColor = getDueDateColor(task.dueDate);

  return (
    <div
      className="grid grid-cols-[1fr_160px_120px_150px_44px] px-4 items-center border-b border-slate-100 hover:bg-slate-50/80 transition-colors duration-150"
      style={{ height: ITEM_HEIGHT }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 min-w-0 pr-2">
        <span className="text-sm font-medium text-slate-800 truncate">{task.title}</span>
      </div>

      {/* Assignee */}
      <div className="flex items-center gap-2 min-w-0">
        {assignee && <Avatar name={assignee.name} color={assignee.color} size="sm" />}
        <span className="text-xs text-slate-600 truncate">{assignee?.name.split(' ')[0]}</span>
      </div>

      {/* Priority */}
      <div>
        <PriorityBadge priority={task.priority} compact />
      </div>

      {/* Due Date */}
      <span className={`text-xs font-medium ${dueDateColor}`}>
        {formatDueDate(task.dueDate)}
      </span>

      {/* Status inline dropdown */}
      <div className="relative">
        <button
          onClick={() => setStatusOpen(!statusOpen)}
          className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-150 whitespace-nowrap ${STATUS_COLORS[task.status]}`}
        >
          {STATUS_OPTIONS.find((s) => s.value === task.status)?.label}
        </button>
        {statusOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 w-36 animate-dropdown-in">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onStatusChange(task.id, opt.value);
                  setStatusOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors duration-150 ${task.status === opt.value
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Collab */}
      <CollabIndicator users={collabUsers} maxVisible={1} />
    </div>
  );
});

export default ListView;