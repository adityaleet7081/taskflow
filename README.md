# TaskFlow — Project Management Application

A production-grade React + TypeScript project management application with three views (Kanban, List, Timeline), custom drag-and-drop, virtual scrolling, and real-time collaboration simulation.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Architecture Decisions

### State Management: Zustand

Zustand was chosen over Context + useReducer for several reasons:

- **Simpler API**: No need for providers, reducers, or context wrappers. Store is created with a single `create()` call.
- **No prop drilling**: Any component can subscribe to specific slices of state without wrapping the tree in providers.
- **Performance**: Zustand uses selector-based subscriptions. Components only re-render when their selected slice of state changes — critical for the collaboration simulation which updates every 3–5 seconds.
- **No boilerplate**: Actions are defined alongside state, eliminating action types and dispatch ceremonies.

### Custom Virtual Scrolling

The `useVirtualScroll` hook computes which rows to render based on scroll position:

- `startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize)` — first rendered row, with buffer above
- `endIndex = Math.min(itemCount - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize)` — last rendered row, with buffer below
- `offsetY = startIndex * itemHeight` — padding-top applied to offset unrendered rows above the viewport
- `totalHeight = itemCount * itemHeight` — maintains correct scrollbar proportions

The buffer (default 5 rows) prevents blank flashes during fast scrolling by pre-rendering rows just outside the viewport. Only ~20-30 DOM nodes exist at any time, even with 500+ tasks.

### Custom Drag and Drop

Pointer events were chosen over the HTML5 Drag API because:

- **Touch support**: Pointer events work identically on mouse and touch — the HTML5 Drag API has no built-in touch support.
- **Full control**: We create a ghost clone element (position: fixed, opacity: 0.85, elevated shadow) that follows the cursor via `translate3d` for GPU-accelerated movement.
- **Drop zone detection**: `document.elementsFromPoint()` detects which column (via `data-status` attribute) the cursor is over.
- **Snap-back animation**: If dropped outside a valid column, the ghost element transitions back to the original card's position using CSS `transform` transition (300ms ease), then is removed.

The placeholder div (dashed border, subtle background) maintains layout in the original position while dragging.

### Collaboration Simulation

Three simulated users (Priya S., Luca M., Nina K.) move between random tasks every 3–5 seconds. The collaboration store uses `setInterval` with randomized timing per user. Cards show small colored avatars with viewing/editing status dots.

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite (build tool)
- Tailwind CSS (styling, no component libraries)
- Zustand (state management)
- React Router v6 (URL state management)

## Features

- **Kanban Board**: 4-column drag-and-drop board with task cards
- **List View**: Virtual-scrolled table with sortable columns and inline status change
- **Timeline View**: Gantt chart grouped by status with today line indicator
- **Filtering**: Multi-select dropdowns for Status, Priority, Assignee + date range
- **URL Sync**: All filters sync to URL query params, supports browser back/forward
- **Collaboration**: Simulated live users shown on cards and in header
- **500 Tasks**: Handles 500 tasks with smooth virtual scrolling
- **Responsive**: Horizontal scroll on Kanban and Timeline for smaller screens

## Note

## Lighthouse Score
![Lighthouse Score](./lighthouse.png)
The hardest UI problem was implementing the custom drag-and-drop system without any libraries. The core challenge was maintaining layout integrity during a drag — when a card is lifted, the column must not collapse or reflow. I solved this by keeping the original card in the DOM but setting visibility: hidden while rendering a separate placeholder div with identical dimensions in its place. This means the column layout never shifts — the placeholder occupies the exact space the card did, preventing any reflow.
For the drag itself, I used Pointer Events instead of the HTML5 Drag API because pointer events work identically on both mouse and touch devices. On pointerdown, I clone the card into a position: fixed ghost element appended to document.body, completely outside the React tree. On pointermove, I translate the ghost using transform: translate3d for GPU-accelerated movement. Drop zones are detected via document.elementsFromPoint(). If dropped outside a valid column, the ghost animates back to its origin using a CSS transition before being removed.
If I had more time, I would refactor the virtual scrolling hook to support dynamic row heights rather than the current fixed 56px assumption. This would make the List View more flexible — supporting expandable rows or variable content — without sacrificing the performance benefits of windowed rendering.
