import React, { useMemo, useCallback } from 'react';
import type { Status } from '../../types';
import { useTaskStore, getFilteredTasks, groupTasksByStatus } from '../../store/taskStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import KanbanColumn from './KanbanColumn';

const COLUMNS: { status: Status; label: string; headerColor: string; bgColor: string }[] = [
  { status: 'todo', label: 'To Do', headerColor: 'bg-slate-200', bgColor: 'bg-slate-50/80' },
  { status: 'in-progress', label: 'In Progress', headerColor: 'bg-blue-100', bgColor: 'bg-blue-50/40' },
  { status: 'in-review', label: 'In Review', headerColor: 'bg-purple-100', bgColor: 'bg-purple-50/40' },
  { status: 'done', label: 'Done', headerColor: 'bg-green-100', bgColor: 'bg-green-50/40' },
];

const KanbanView: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const moveTask = useTaskStore((s) => s.moveTask);

  const filteredTasks = useMemo(() => getFilteredTasks(tasks, filters), [tasks, filters]);
  const tasksByStatus = useMemo(() => groupTasksByStatus(filteredTasks), [filteredTasks]);

  const handleDrop = useCallback((taskId: string, newStatus: Status) => {
    moveTask(taskId, newStatus);
  }, [moveTask]);

  const { startDrag } = useDragAndDrop({ onDrop: handleDrop });

  const onDragStart = useCallback((e: React.PointerEvent, taskId: string, status: Status) => {
    startDrag(e, taskId, status);
  }, [startDrag]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-1" style={{ minHeight: 'calc(100vh - 200px)' }}>
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.status}
          status={col.status}
          tasks={tasksByStatus[col.status]}
          label={col.label}
          headerColor={col.headerColor}
          bgColor={col.bgColor}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
};

export default KanbanView;
