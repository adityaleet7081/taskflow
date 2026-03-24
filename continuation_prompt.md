## ✅ FILES COMPLETED SO FAR

Every requested file has been successfully created. The directory structure and implementations are fully complete:

1. `src/types/index.ts` - All interfaces and types for tasks, users, filters, and priority orders.
2. `src/data/seedData.ts` - Logic generating precisely 500 tasks matching all priority/date distribution rules.
3. `src/utils/dateUtils.ts` - Helper functions `isDueToday`, `isOverdue`, `formatDueDate`, and Tailwind color mappers.
4. `src/store/taskStore.ts` - Zustand task store containing tasks, filters, sort, view state, and getter helpers.
5. `src/store/collabStore.ts` - Zustand collaboration store with `setInterval` logic moving 3 users between tasks randomly.
6. `src/hooks/useDragAndDrop.ts` - Custom drag-and-drop hook built using raw pointer events, ghost nodes, and snap-back animations.
7. `src/hooks/useVirtualScroll.ts` - Custom virtual scrolling implementation calculating `startIndex`, `endIndex`, and scroll container offsets. 
8. `src/hooks/useUrlFilters.ts` - Syncs React Router URLs with Zustand filter states.
9. `src/components/ui/PriorityBadge.tsx` - Color-coded badge for task priorities.
10. `src/components/ui/Avatar.tsx` - Initials-based avatar bubble.
11. `src/components/ui/CollabIndicator.tsx` - Floating avatars with action dots (editing/viewing) and popover tooltips.
12. `src/components/ui/EmptyState.tsx` - Reusable "no tasks" view for empty columns/lists.
13. `src/components/ui/Dropdown.tsx` - Scratch-built customizable multi-select component.
14. `src/components/views/KanbanCard.tsx` - Drag-enabled card for the Kanban board.
15. `src/components/views/KanbanColumn.tsx` - Status bucket tracking `data-status` drop targets.
16. `src/components/views/KanbanView.tsx` - Wraps columns and initiates the `useDragAndDrop` drop handler.
17. `src/components/views/ListView.tsx` - Virtual-scrolled table view incorporating `useVirtualScroll`.
18. `src/components/views/TimelineView.tsx` - Custom Gantt chart drawing horizontal span bars over month columns.
19. `src/components/layout/FilterBar.tsx` - Top bar triggering filter actions for priorities, assignees, strings, and dates.
20. `src/components/layout/Header.tsx` - View toggle switch and global collab active indicator.
21. `src/App.tsx` - App orchestrator linking the header, filter bar, views, and useUrlFilters.
22. `src/main.tsx` - Standard entrypoint setting up `BrowserRouter`.
23. `src/index.css` - Custom smooth animations for dragging, dropdowns, and basic Tailwind imports.
24. `index.html` - Base HTML including Google Fonts (Inter) loading.
25. `vite.config.ts` - Bundler config utilizing `tailwindcss()` plugin on Vite 8.
26. `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - Setup with `verbatimModuleSyntax: true` handled securely.
27. `README.md` - Complete document covering technical architectural decisions.

**Note on syntax fixes:** We already successfully resolved all TypeScript compiler (`npx tsc`) and bundler (`vite build`) type export errors. We converted all structural typings to use strict `import type { ... } from '...'` syntax to satisfy the `verbatimModuleSyntax: true` config Vite sets up.

## ❌ FILES REMAINING

Zero new files remain. All code has been written. **However, the app is currently paused in a broken state due to a runtime bug involving an infinite render loop.**

## 🔁 CONTINUATION PROMPT

*Copy everything below this line and paste it into a new session to continue seamlessly:*

---

I am working on a production-grade React + TypeScript project management application built from scratch without external UI libraries. 

All 27 required files have been fully written, the TypeScript compiler passes (`npx tsc`), and the production build completes perfectly. However, when the dev server runs in the browser, the screen is **completely blank white**. 

The browser console produces the following continuous React error:
`[error] The result of getSnapshot should be cached to avoid an infinite loop`
and a subsequent warning indicating `<KanbanCard>` crashed. 

### THE ROOT CAUSE:
Zustand selector re-referencing. In components like `KanbanView` and `TimelineView`, we are fetching state from Zustand (`useTaskStore`) and computing derived arrays (like `getFilteredTasks` and `groupTasksByStatus`). If derived data is calculated or arrays are mapped inside a Zustand `useStore()` selector directly, it creates a new memory reference on every single component render. React/Zustand's `useSyncExternalStore` detects this new reference, assumes state has changed, triggers a re-render, and enters an infinite loop.

We need to fix `<KanbanView.tsx>`, `<ListView.tsx>`, and `<TimelineView.tsx>`. You must ensure components pull stable base references (e.g. `tasks` and `filters`) out of Zustand, and then use `useMemo()` inside the React component to derive the grouped/filtered data instead. 

### CURRENT RELEVANT SETUP DETAILS:
- **Stack**: Vite + React 18 + TS + Zustand + Tailwind (using latest v4 `@tailwindcss/vite` plugin syntax)
- **File Structure**:
  - `src/types/index.ts`
  - `src/data/seedData.ts`
  - `src/store/taskStore.ts` & `collabStore.ts`
  - `src/utils/dateUtils.ts`
  - `src/hooks/useDragAndDrop.ts`, `useVirtualScroll.ts`, `useUrlFilters.ts`
  - `src/components/views/KanbanView.tsx`, `KanbanColumn.tsx`, `KanbanCard.tsx`, `ListView.tsx`, `TimelineView.tsx`
  - `src/components/ui/...`
  - `src/components/layout/Header.tsx`, `FilterBar.tsx`
  - `src/App.tsx`, `src/main.tsx`
- **Important**: The codebase relies strictly on `import type` logic for types due to `verbatimModuleSyntax: true` inside tsconfig.

### YOUR TASK:
1. First, search for `KanbanView.tsx`, `ListView.tsx`, and `TimelineView.tsx` on disk.
2. Observe how they fetch data from `useTaskStore`. Look for any calls to `useCollabStore(s => getTaskCollabUsers(s.users, task.id))` nested in lists or bad derived selectors in `taskStore`.
3. Stop the infinite rendering loop by fixing selector logic and wrapping computation in `useMemo`, or moving computation outside the store selector. 
4. Check `KanbanCard.tsx` as well to make sure `useCollabStore` isn't triggering loops there.
5. After applying the fixes, verify functionality by rendering the dev server in the browser tool, ensure the white screen is gone, the drag and drop works, the virtual scroll handles the 500 records nicely, and the timeline renders cleanly.
