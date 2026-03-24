import React from 'react';
import type { Priority } from '../../types';

const PRIORITY_CONFIG: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
  critical: { label: 'Critical', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  high: { label: 'High', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  medium: { label: 'Medium', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  low: { label: 'Low', bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
};

interface PriorityBadgeProps {
  priority: Priority;
  compact?: boolean;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, compact = false }) => {
  const config = PRIORITY_CONFIG[priority];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.text} transition-all duration-200`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
