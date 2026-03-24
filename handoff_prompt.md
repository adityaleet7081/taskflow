# TaskFlow Application - Complete AI Handoff Prompt

*Context: You are picking up a fully completed, production-ready React + TypeScript project management application built from scratch without external UI component libraries.*

## 1. Project Overview & Tech Stack
- **Framework**: React 18 + TypeScript (Strict Mode)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS (v4 via `@tailwindcss/vite` plugin, NO component libraries)
- **State Management**: Zustand
- **Routing**: React Router v6 (for URL sync)
- **Status**: **100% Functional** (Compiles with zero TypeScript errors, builds successfully, and runs without React infinite loop errors).

## 2. Completed File Structure & Architecture
The project structure is exactly as follows. All files listed below have been fully written and function perfectly together:

```text
task/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top nav with view switcher & collab user count
│   │   │   └── FilterBar.tsx       # Complex multi-select dropdowns & date filters
│   │   ├── views/
│   │   │   ├── KanbanView.tsx      # Flex container for the 4 status columns
│   │   │   ├── KanbanColumn.tsx    # Scrollable bucket tracking drop zones
│   │   │   ├── KanbanCard.tsx      # Draggable task card with pointers
│   │   │   ├── ListView.tsx        # Virtual scrolled data table with inline status changes
│   │   │   └── TimelineView.tsx    # Month-based Gantt chart spanning tasks across days
│   │   ├── ui/
│   │   │   ├── PriorityBadge.tsx   # Color-coded badge (critical=red, high=orange etc.)
│   │   │   ├── Avatar.tsx          # Initials-based colored avatars
│   │   │   ├── CollabIndicator.tsx # Live avatar cluster with viewing/editing states
│   │   │   ├── EmptyState.tsx      # Reusable UI for empty columns/lists
│   │   │   └── Dropdown.tsx        # Custom accessible multi-select dropdown
│   ├── store/
│   │   ├── taskStore.ts            # Zustand store (Tasks, filters, sortConfig, activeView)
│   │   └── collabStore.ts          # Zustand store (Simulated collaborative users interval)
│   ├── hooks/
│   │   ├── useDragAndDrop.ts       # Raw pointer-event DnD logic (mouse & touch)
│   │   ├── useVirtualScroll.ts     # Formula-based windowing for List View performance
│   │   └── useUrlFilters.ts        # Syncs Zustand `filters` state bi-directionally to URL
│   ├── data/
│   │   └── seedData.ts             # Generates exactly 500 deterministic tasks on load
│   ├── types/
│   │   └── index.ts                # App-wide interfaces (Task, Status, FilterState)
│   ├── utils/
│   │   └── dateUtils.ts            # Overdue tracking and formatting logic
│   ├── App.tsx                     # Main layout shell and component delegator
│   ├── main.tsx                    # ReactDOM entry executing `<BrowserRouter>`
│   └── index.css                   # Tailwind imports and custom smooth CSS animations
├── index.html                      # Loads Inter font from Google
├── vite.config.ts                  # Registers Tailwind and React plugins
├── tsconfig.json                   # Base references
├── tsconfig.app.json               # Configured with `verbatimModuleSyntax: true`
└── README.md                       # Comprehensive architectural markdown
```

## 3. Critical Technical Context for AI
If you are analyzing or modifying this codebase, you must adhere to the following rules which have already been solved:

### A. TypeScript Imports (`verbatimModuleSyntax`)
The Vite 8 `tsconfig.app.json` has `"verbatimModuleSyntax": true`. This means **you cannot mix type imports with value imports**. Across all 27 files, if you import `Task`, `Status`, or `Priority`, you MUST use `import type { Task } from ...`. This is already implemented perfectly; do not break it.

### B. Zustand Selectors & React Render Loops
In earlier iterations, the app threw a React infinite loop error (`The result of getSnapshot should be cached to avoid an infinite loop`). 
- **The Cause**: Calling `.filter()` or returning newly generated array references directly inside a `useTaskStore(s => ...)` selector. 
- **The Solution**: In files like `KanbanCard.tsx`, `KanbanView.tsx`, and `TimelineView.tsx`, the store is queried for base primitives (e.g., `const users = useCollabStore(s => s.users);`). The derived grouping/filtering is then executed safely within a `React.useMemo()` hook inside the component shell. If you add new data derivations, **always use `useMemo`** to prevent catastrophic render loops.

### C. The Drag and Drop Engine
`useDragAndDrop.ts` does NOT use the HTML5 Drag API or external libraries. It uses standard DOM `pointerdown`, `pointermove`, `pointerup` events. It works by cloning a fixed "ghost" node to the body and mapping pointer translation onto it via CSS `transform: translate3d`. Drop zones are calculated using `document.elementsFromPoint()`. When adding new drop targets, ensure they have the `data-status={status}` DOM attribute.

### D. The Virtual Scroll Engine
`useVirtualScroll.ts` handles the 500 tasks mathematically. It takes the container `scrollTop`, divides by a fixed `itemHeight` (56px), and calculates `startIndex` and `endIndex` with a 5-item buffer. `ListView.tsx` applies padding to the top of the mapping array equal to the height of the unrendered above items. Do not alter the CSS heights programmatically inside the List View without updating the hook arguments.

## 4. Continuity Instructions
The core feature set of this hiring assessment is **100% finished and working flawlessly**. 
From here, you can propose:
1. Writing unit tests using Vitest/React Testing Library.
2. Replacing the local mock state (`seedData.ts`) with async data fetching (`React Query` or `RTK Query`).
3. Enhancing the UI with dark mode support (currently hardcoded for light mode colors).
4. Adding accessibility (ARIA tags, keyboard navigation) to the custom Dropdowns and Cards.

Acknowledge that you have successfully ingested this architecture and let me know how you would like to proceed.
