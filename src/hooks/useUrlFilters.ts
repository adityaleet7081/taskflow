import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import type { Status, Priority } from '../types';

const VALID_STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
const VALID_PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useTaskStore((s) => s.filters);
  const setAllFilters = useTaskStore((s) => s.setAllFilters);
  const isInitialized = useRef(false);

  useEffect(() => {
    const statuses = searchParams.getAll('status').filter((s) =>
      VALID_STATUSES.includes(s as Status)
    ) as Status[];

    const priorities = searchParams.getAll('priority').filter((p) =>
      VALID_PRIORITIES.includes(p as Priority)
    ) as Priority[];

    const assigneeIds = searchParams.getAll('assignee');
    const dueDateFrom = searchParams.get('dueDateFrom') || '';
    const dueDateTo = searchParams.get('dueDateTo') || '';

    setAllFilters({
      statuses,
      priorities,
      assigneeIds,
      dueDateFrom,
      dueDateTo,
    });

    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    const params = new URLSearchParams();

    filters.statuses.forEach((s) => params.append('status', s));
    filters.priorities.forEach((p) => params.append('priority', p));
    filters.assigneeIds.forEach((a) => params.append('assignee', a));
    if (filters.dueDateFrom) params.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) params.set('dueDateTo', filters.dueDateTo);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);
}
