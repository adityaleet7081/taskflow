import React from 'react';
import type { CollabUser } from '../../types';

interface CollabIndicatorProps {
  users: CollabUser[];
  maxVisible?: number;
}

const CollabIndicator: React.FC<CollabIndicatorProps> = ({ users, maxVisible = 2 }) => {
  if (users.length === 0) return null;

  const visible = users.slice(0, maxVisible);
  const overflow = users.length - maxVisible;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((user) => (
        <div
          key={user.id}
          className="relative group"
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ring-2 ring-white transition-all duration-300 ease-in-out animate-collab-fade-in"
            style={{ backgroundColor: user.color }}
            title={`${user.name} is ${user.action}`}
          >
            {user.name.charAt(0)}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-white ${
            user.action === 'editing' ? 'bg-green-400' : 'bg-yellow-400'
          }`} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
            {user.name} · {user.action}
          </div>
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold bg-slate-200 text-slate-600 ring-2 ring-white">
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default CollabIndicator;
