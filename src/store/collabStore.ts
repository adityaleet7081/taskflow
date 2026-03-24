import { create } from 'zustand';
import type { CollabUser } from '../types';
import { TASKS } from '../data/seedData';

const COLLAB_USERS: CollabUser[] = [
  { id: 'collab-1', name: 'Priya S.', color: '#e11d48', currentTaskId: null, action: 'viewing' },
  { id: 'collab-2', name: 'Luca M.', color: '#7c3aed', currentTaskId: null, action: 'viewing' },
  { id: 'collab-3', name: 'Nina K.', color: '#0891b2', currentTaskId: null, action: 'editing' },
];

interface CollabStore {
  users: CollabUser[];
  startSimulation: () => void;
  stopSimulation: () => void;
}

const intervalIds: number[] = [];

export const useCollabStore = create<CollabStore>((set) => ({
  users: COLLAB_USERS.map((u) => ({ ...u })),

  startSimulation: () => {
    intervalIds.forEach((id) => clearInterval(id));
    intervalIds.length = 0;

    COLLAB_USERS.forEach((user, index) => {
      const interval = window.setInterval(() => {
        const randomTask = TASKS[Math.floor(Math.random() * TASKS.length)];
        const randomAction: 'viewing' | 'editing' = Math.random() > 0.6 ? 'editing' : 'viewing';
        
        set((state) => ({
          users: state.users.map((u) =>
            u.id === user.id
              ? { ...u, currentTaskId: randomTask.id, action: randomAction }
              : u
          ),
        }));
      }, 3000 + index * 700 + Math.random() * 2000);

      intervalIds.push(interval);
    });
  },

  stopSimulation: () => {
    intervalIds.forEach((id) => clearInterval(id));
    intervalIds.length = 0;
  },
}));

export function getTaskCollabUsers(users: CollabUser[], taskId: string): CollabUser[] {
  return users.filter((u) => u.currentTaskId === taskId);
}
