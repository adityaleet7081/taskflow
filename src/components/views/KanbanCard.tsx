import React from 'react';
import type { Task, Status } from '../../types';
import { USERS } from '../../data/seedData';
import { formatDueDate, getDueDateColor } from '../../utils/dateUtils';
import PriorityBadge from '../ui/PriorityBadge';
import Avatar from '../ui/Avatar';
import CollabIndicator from '../ui/CollabIndicator';
import { useCollabStore, getTaskCollabUsers } from '../../store/collabStore';

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.PointerEvent, taskId: string, status: Status) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onDragStart }) => {
  const users = useCollabStore((s) => s.users);
  const collabUsers = React.useMemo(() => getTaskCollabUsers(users, task.id), [users, task.id]);
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const dueDateColor = getDueDateColor(task.dueDate);
  const dueDateText = formatDueDate(task.dueDate);

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 cursor-grab active:cursor-grabbing select-none touch-none transition-all duration-200 hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 mb-2"
      onPointerDown={(e) => onDragStart(e, task.id, task.status)}
    >
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={task.priority} compact />
        <CollabIndicator users={collabUsers} />
      </div>

      <h3 className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 mb-3">
        {task.title}
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee && (
            <Avatar name={assignee.name} color={assignee.color} size="sm" />
          )}
          <span className="text-xs text-slate-500 truncate max-w-[80px]">
            {assignee?.name.split(' ')[0]}
          </span>
        </div>
        <span className={`text-xs font-medium ${dueDateColor}`}>
          {dueDateText}
        </span>
      </div>
    </div>
  );
};

export default React.memo(KanbanCard);
