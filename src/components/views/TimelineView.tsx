import React, { useMemo, useRef } from 'react';
import type { Task, Status, Priority } from '../../types';
import { useTaskStore, getFilteredTasks } from '../../store/taskStore';

const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#94a3b8',
};

const STATUS_LABELS: Record<Status, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
};

const STATUS_ORDER: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 32;
const GROUP_HEADER_HEIGHT = 36;
const DAY_WIDTH = 44;

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const TimelineView: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const monthName = today.toLocaleString('default', { month: 'long' });

  const filteredTasks = useMemo(
    () => getFilteredTasks(tasks, filters),
    [tasks, filters]
  );

  const groupedTasks = useMemo(() => {
    const groups: Record<Status, Task[]> = {
      'todo': [],
      'in-progress': [],
      'in-review': [],
      'done': [],
    };
    filteredTasks.forEach((t) => groups[t.status].push(t));
    return groups;
  }, [filteredTasks]);

  const rows = useMemo(() => {
    const result: Array<{ type: 'header'; status: Status; count: number } | { type: 'task'; task: Task }> = [];
    for (const status of STATUS_ORDER) {
      const statusTasks = groupedTasks[status];
      if (statusTasks.length > 0) {
        result.push({ type: 'header', status, count: statusTasks.length });
        statusTasks.forEach((task) => result.push({ type: 'task', task }));
      }
    }
    return result;
  }, [groupedTasks]);

  const totalWidth = daysInMonth * DAY_WIDTH + 200;
  const totalHeight = rows.reduce((sum, row) =>
    sum + (row.type === 'header' ? GROUP_HEADER_HEIGHT : ROW_HEIGHT), 0
  ) + HEADER_HEIGHT;

  const todayIndex = today.getDate() - 1;
  const todayX = 200 + todayIndex * DAY_WIDTH + DAY_WIDTH / 2;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="overflow-auto"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div style={{ width: totalWidth, minHeight: totalHeight, position: 'relative' }}>
          {/* Day headers */}
          <div className="sticky top-0 z-20 flex bg-white border-b border-slate-200" style={{ height: HEADER_HEIGHT }}>
            <div className="shrink-0 w-[200px] px-3 flex items-center text-xs font-semibold text-slate-500 bg-slate-50 border-r border-slate-200">
              {monthName} {year}
            </div>
            <div className="flex">
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayDate = new Date(year, month, i + 1);
                const isToday = i === todayIndex;
                const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;

                return (
                  <div
                    key={i}
                    className={`shrink-0 flex items-center justify-center text-[10px] font-semibold border-r border-slate-100
                      ${isToday ? 'bg-red-50 text-red-600' : isWeekend ? 'bg-slate-50 text-slate-400' : 'text-slate-500'}
                    `}
                    style={{ width: DAY_WIDTH, height: HEADER_HEIGHT }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today line */}
          <div
            className="absolute z-10 w-0.5 bg-red-400 opacity-60"
            style={{
              left: todayX,
              top: HEADER_HEIGHT,
              height: totalHeight - HEADER_HEIGHT,
            }}
          />

          {/* Rows */}
          <div>
            {rows.map((row) => {
              if (row.type === 'header') {
                return (
                  <div
                    key={`header-${row.status}`}
                    className="flex items-center bg-slate-50 border-b border-slate-200"
                    style={{ height: GROUP_HEADER_HEIGHT }}
                  >
                    <div className="w-[200px] shrink-0 px-3 text-xs font-bold text-slate-600 border-r border-slate-200">
                      {STATUS_LABELS[row.status]}
                      <span className="ml-2 text-slate-400 font-normal">({row.count})</span>
                    </div>
                    <div style={{ width: daysInMonth * DAY_WIDTH }} />
                  </div>
                );
              }

              const task = row.task;
              const dueDate = parseDateLocal(task.dueDate);
              const startDate = task.startDate ? parseDateLocal(task.startDate) : null;

              const monthStart = new Date(year, month, 1);
              const monthEnd = new Date(year, month, daysInMonth);

              let barStart: number;
              let barWidth: number;
              let isMarker = false;

              if (!startDate) {
                isMarker = true;
                const dueDayInMonth = dueDate.getMonth() === month && dueDate.getFullYear() === year
                  ? dueDate.getDate() - 1
                  : dueDate < monthStart ? -1 : daysInMonth;
                barStart = dueDayInMonth;
                barWidth = 1;
              } else {
                const effectiveStart = startDate < monthStart ? monthStart : startDate;
                const effectiveEnd = dueDate > monthEnd ? monthEnd : dueDate;

                const startDay = effectiveStart.getMonth() === month && effectiveStart.getFullYear() === year
                  ? effectiveStart.getDate() - 1 : 0;
                const endDay = effectiveEnd.getMonth() === month && effectiveEnd.getFullYear() === year
                  ? effectiveEnd.getDate() - 1 : daysInMonth - 1;

                barStart = startDay;
                barWidth = Math.max(1, endDay - startDay + 1);
              }

              const isInMonth = (
                (startDate && startDate <= monthEnd && dueDate >= monthStart) ||
                (!startDate && dueDate >= monthStart && dueDate <= monthEnd)
              );

              return (
                <div
                  key={task.id}
                  className="flex items-center border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-100 group"
                  style={{ height: ROW_HEIGHT }}
                >
                  <div className="w-[200px] shrink-0 px-3 text-xs text-slate-700 truncate border-r border-slate-100" title={task.title}>
                    {task.title}
                  </div>

                  <div className="relative" style={{ width: daysInMonth * DAY_WIDTH, height: ROW_HEIGHT }}>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-r border-slate-50"
                        style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
                      />
                    ))}

                    {isInMonth && (
                      isMarker ? (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 rounded-sm cursor-pointer"
                          style={{
                            left: barStart * DAY_WIDTH + DAY_WIDTH / 2 - 6,
                            backgroundColor: PRIORITY_COLORS[task.priority],
                          }}
                          title={task.title}
                        />
                      ) : (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-6 rounded-md cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-sm"
                          style={{
                            left: barStart * DAY_WIDTH + 2,
                            width: barWidth * DAY_WIDTH - 4,
                            backgroundColor: PRIORITY_COLORS[task.priority],
                            opacity: 0.85,
                          }}
                          title={task.title}
                        >
                          <span className="block px-1.5 text-[9px] text-white font-medium leading-6 truncate">
                            {barWidth > 2 ? task.title : ''}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;