import React from 'react';
import type { Status, Priority } from '../../types';
import { USERS } from '../../data/seedData';
import { useTaskStore } from '../../store/taskStore';
import Dropdown from '../ui/Dropdown';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const ASSIGNEE_OPTIONS = USERS.map((u) => ({ value: u.id, label: u.name }));

const FilterBar: React.FC = () => {
  const filters = useTaskStore((s) => s.filters);
  const setFilter = useTaskStore((s) => s.setFilter);
  const clearFilters = useTaskStore((s) => s.clearFilters);

  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assigneeIds.length > 0 ||
    filters.dueDateFrom !== '' ||
    filters.dueDateTo !== '';

  const totalActiveCount =
    filters.statuses.length +
    filters.priorities.length +
    filters.assigneeIds.length +
    (filters.dueDateFrom ? 1 : 0) +
    (filters.dueDateTo ? 1 : 0);

  return (
    <div className="flex items-center gap-3 flex-wrap px-1">
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {totalActiveCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-indigo-600 text-white ml-1">
            {totalActiveCount}
          </span>
        )}
      </div>

      <Dropdown
        label="Status"
        options={STATUS_OPTIONS}
        selected={filters.statuses}
        onChange={(v) => setFilter('statuses', v as Status[])}
      />

      <Dropdown
        label="Priority"
        options={PRIORITY_OPTIONS}
        selected={filters.priorities}
        onChange={(v) => setFilter('priorities', v as Priority[])}
      />

      <Dropdown
        label="Assignee"
        options={ASSIGNEE_OPTIONS}
        selected={filters.assigneeIds}
        onChange={(v) => setFilter('assigneeIds', v)}
      />

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">From</label>
        <input
          type="date"
          value={filters.dueDateFrom}
          onChange={(e) => setFilter('dueDateFrom', e.target.value)}
          className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">To</label>
        <input
          type="date"
          value={filters.dueDateTo}
          onChange={(e) => setFilter('dueDateTo', e.target.value)}
          className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all duration-200"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterBar;
