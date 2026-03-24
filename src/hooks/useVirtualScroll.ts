import { useState, useCallback, useMemo } from 'react';

interface UseVirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  bufferSize?: number;
}

interface UseVirtualScrollReturn {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
  onScroll: (scrollTop: number) => void;
}

export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  bufferSize = 5,
}: UseVirtualScrollOptions): UseVirtualScrollReturn {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = useMemo(() => itemCount * itemHeight, [itemCount, itemHeight]);

  const startIndex = useMemo(
    () => Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize),
    [scrollTop, itemHeight, bufferSize]
  );

  const endIndex = useMemo(
    () => Math.min(itemCount - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize),
    [scrollTop, containerHeight, itemHeight, itemCount, bufferSize]
  );

  const offsetY = useMemo(() => startIndex * itemHeight, [startIndex, itemHeight]);

  const onScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    onScroll,
  };
}
