import React, { useEffect } from 'react';
import Header from './components/layout/Header';
import FilterBar from './components/layout/FilterBar';
import KanbanView from './components/views/KanbanView';
import ListView from './components/views/ListView';
import TimelineView from './components/views/TimelineView';
import { useTaskStore } from './store/taskStore';
import { useCollabStore } from './store/collabStore';
import { useUrlFilters } from './hooks/useUrlFilters';

const App: React.FC = () => {
  const activeView = useTaskStore((s) => s.activeView);
  const startSimulation = useCollabStore((s) => s.startSimulation);
  const stopSimulation = useCollabStore((s) => s.stopSimulation);

  // Sync URL filters
  useUrlFilters();

  // Start collab simulation on mount
  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-6 py-4">
        {/* Filter Bar */}
        <div className="mb-4">
          <FilterBar />
        </div>

        {/* View Content */}
        <div className="transition-opacity duration-200">
          {activeView === 'kanban' && <KanbanView />}
          {activeView === 'list' && <ListView />}
          {activeView === 'timeline' && <TimelineView />}
        </div>
      </main>
    </div>
  );
};

export default App;
