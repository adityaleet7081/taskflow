import { useCallback, useRef } from 'react';
import type { Status } from '../types';

interface UseDragAndDropOptions {
  onDrop: (taskId: string, newStatus: Status) => void;
}

interface DragState {
  taskId: string;
  originalStatus: Status;
  ghostEl: HTMLElement | null;
  placeholderEl: HTMLElement | null;
  sourceEl: HTMLElement | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  currentDropColumn: HTMLElement | null;
}

export function useDragAndDrop({ onDrop }: UseDragAndDropOptions) {
  const dragStateRef = useRef<DragState | null>(null);
  const isDraggingRef = useRef(false);

  const cleanup = useCallback(() => {
    const state = dragStateRef.current;
    if (!state) return;

    if (state.ghostEl && state.ghostEl.parentNode) {
      state.ghostEl.parentNode.removeChild(state.ghostEl);
    }

    if (state.placeholderEl && state.placeholderEl.parentNode) {
      state.placeholderEl.parentNode.removeChild(state.placeholderEl);
    }

    if (state.sourceEl) {
      state.sourceEl.style.visibility = 'visible';
      state.sourceEl.style.opacity = '1';
    }

    document.querySelectorAll('[data-status]').forEach((col) => {
      (col as HTMLElement).classList.remove('drop-target-active');
    });

    dragStateRef.current = null;
    isDraggingRef.current = false;
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const state = dragStateRef.current;
    if (!state || !state.ghostEl) return;

    const x = e.clientX - state.offsetX;
    const y = e.clientY - state.offsetY;
    state.ghostEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    let foundColumn: HTMLElement | null = null;

    for (const el of elements) {
      const column = (el as HTMLElement).closest('[data-status]') as HTMLElement | null;
      if (column) {
        foundColumn = column;
        break;
      }
    }

    if (state.currentDropColumn !== foundColumn) {
      if (state.currentDropColumn) {
        state.currentDropColumn.classList.remove('drop-target-active');
      }
      if (foundColumn) {
        foundColumn.classList.add('drop-target-active');
      }
      state.currentDropColumn = foundColumn;
    }
  }, []);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    const state = dragStateRef.current;
    if (!state) return;

    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    let targetStatus: Status | null = null;

    for (const el of elements) {
      const column = (el as HTMLElement).closest('[data-status]') as HTMLElement | null;
      if (column) {
        targetStatus = column.dataset.status as Status;
        break;
      }
    }

    if (targetStatus && targetStatus !== state.originalStatus) {
      onDrop(state.taskId, targetStatus);
      cleanup();
    } else if (state.ghostEl && state.sourceEl) {
      const sourceRect = state.sourceEl.getBoundingClientRect();
      const ghost = state.ghostEl;

      ghost.style.transition = 'transform 300ms ease';
      ghost.style.transform = `translate3d(${sourceRect.left}px, ${sourceRect.top}px, 0)`;

      const onTransitionEnd = () => {
        ghost.removeEventListener('transitionend', onTransitionEnd);
        cleanup();
      };
      ghost.addEventListener('transitionend', onTransitionEnd);

      setTimeout(() => {
        cleanup();
      }, 400);
    } else {
      cleanup();
    }
  }, [onDrop, cleanup, handlePointerMove]);

  const startDrag = useCallback((e: React.PointerEvent, taskId: string, status: Status) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    e.preventDefault();

    const ghost = target.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.top = '0';
    ghost.style.left = '0';
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.opacity = '0.85';
    ghost.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.style.cursor = 'grabbing';
    ghost.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
    ghost.style.willChange = 'transform';
    ghost.style.borderRadius = '12px';
    document.body.appendChild(ghost);

    const placeholder = document.createElement('div');
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.border = '2px dashed #94a3b8';
    placeholder.style.borderRadius = '12px';
    placeholder.style.background = 'rgba(148, 163, 184, 0.08)';
    placeholder.style.marginBottom = '8px';
    placeholder.className = 'drag-placeholder';
    target.parentNode?.insertBefore(placeholder, target);

    target.style.visibility = 'hidden';
    target.style.opacity = '0';

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    dragStateRef.current = {
      taskId,
      originalStatus: status,
      ghostEl: ghost,
      placeholderEl: placeholder,
      sourceEl: target,
      startX: rect.left,
      startY: rect.top,
      offsetX,
      offsetY,
      currentDropColumn: null,
    };
    isDraggingRef.current = true;

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove, handlePointerUp]);

  return {
    startDrag,
    isDragging: isDraggingRef.current,
  };
}
