import React from 'react';
import type { Task, Status } from '../../types';
import KanbanCard from './KanbanCard';
import EmptyState from '../ui/EmptyState';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  label: string;
  headerColor: string;
  bgColor: string;
  onDragStart: (e: React.PointerEvent, taskId: string, status: Status) => void;
}

const EMPTY_MESSAGES: Record<Status, { icon: string; title: string; message: string }> = {
  'todo': { icon: '📝', title: 'No tasks yet', message: 'Create a new task to get started' },
  'in-progress': { icon: '🚀', title: 'Nothing in progress', message: 'Drag tasks here when work begins' },
  'in-review': { icon: '🔍', title: 'Nothing to review', message: 'Tasks ready for review will appear here' },
  'done': { icon: '✅', title: 'No completed tasks', message: 'Finished tasks will show up here' },
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  label,
  headerColor,
  bgColor,
  onDragStart,
}) => {
  return (
    <div
      className={`flex flex-col min-w-[280px] w-full rounded-xl ${bgColor} transition-colors duration-300`}
      data-status={status}
    >
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${headerColor}`}>
        <h2 className="text-sm font-semibold text-slate-700">{label}</h2>
        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold rounded-full bg-white/60 text-slate-600">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {tasks.length === 0 ? (
          <EmptyState {...EMPTY_MESSAGES[status]} />
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(KanbanColumn);
