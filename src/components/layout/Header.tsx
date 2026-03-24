import React from 'react';
import type { ViewType } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useCollabStore } from '../../store/collabStore';
import Avatar from '../ui/Avatar';

const VIEWS: { key: ViewType; label: string; icon: string }[] = [
  { key: 'kanban', label: 'Kanban', icon: '⊞' },
  { key: 'list', label: 'List', icon: '☰' },
  { key: 'timeline', label: 'Timeline', icon: '⊟' },
];

const Header: React.FC = () => {
  const activeView = useTaskStore((s) => s.activeView);
  const setActiveView = useTaskStore((s) => s.setActiveView);
  const collabUsers = useCollabStore((s) => s.users);
  const activeCollabCount = collabUsers.filter((u) => u.currentTaskId !== null).length;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">TaskFlow</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Project Manager</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 rounded-xl p-1">
          {VIEWS.map((view) => (
            <button
              key={view.key}
              onClick={() => setActiveView(view.key)}
              className={`
                flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${activeView === view.key
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                }
              `}
            >
              <span className="text-base">{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {collabUsers.map((user) => (
              <Avatar
                key={user.id}
                name={user.name}
                color={user.color}
                size="sm"
                className="ring-2 ring-white"
              />
            ))}
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700 transition-all duration-300">
              {activeCollabCount}
            </span>
            {' '}people viewing
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
