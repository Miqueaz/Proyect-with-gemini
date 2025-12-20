import type { Placeholder } from '../properties/type';
import { useState, useEffect, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { BarChart3, ImageIcon, ListIcon, TableIcon } from 'lucide-react';
import type { Widget, InteractionType, Point } from '../../../components/organism/index';


function useDashboardLogic() {
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [interactionType, setInteractionType] = useState<InteractionType>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [placeholder, setPlaceholder] = useState<Placeholder | null>(null);
  const [cols, setCols] = useState<number>(12);

  const [originalWidgets, setOriginalWidgets] = useState<Widget[]>([
    { id: 'w1', type: 'chart', title: 'Network Flow', icon: BarChart3, x: 0, y: 0, w: 8, h: 4, data: [{ name: 'Ene', val: 45 }, { name: 'Feb', val: 78 }, { name: 'Mar', val: 56 }, { name: 'Abr', val: 90 }, { name: 'May', val: 65 }] },
    { id: 'w2', type: 'image', title: 'Security Nodes', icon: ImageIcon, x: 8, y: 0, w: 4, h: 4, data: { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400' } },
    { id: 'w3', type: 'list', title: 'Critical Events', icon: ListIcon, x: 0, y: 4, w: 4, h: 5, data: [{ task: 'Node Overflow', time: '5m', urgent: true }, { task: 'System Sync', time: '1h', urgent: false }, { task: 'Global Patch', time: '2h', urgent: false }] },
    { id: 'w4', type: 'table', title: 'Live Statistics', icon: TableIcon, x: 4, y: 4, w: 8, h: 5, data: [{ id: 'COMPUTE-A', value: '85% CPU' }, { id: 'S3-BUCKET', value: '1.2 TB' }, { id: 'DB-MASTER', value: '99% UP' }] },
    { id: 'w5', type: 'table', title: 'Live Statistics', icon: TableIcon, x: 4, y: 4, w: 8, h: 5, data: [{ id: 'COMPUTE-A', value: '85% CPU' }, { id: 'S3-BUCKET', value: '1.2 TB' }, { id: 'DB-MASTER', value: '99% UP' }] }
  ]);

  const [widgets, setWidgets] = useState<Widget[]>([...originalWidgets]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newCols = 12;
      if (width < 640) newCols = 2;
      else if (width < 1024) newCols = 6;
      setCols(newCols);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * ALGORITMO DE REFLUJO Y GRAVEDAD (Adaptado a redimensionamiento por esquinas inferiores)
   */
  const resolveLayout = useCallback((movedWidget: Partial<Widget> & { id: string }, allWidgets: Widget[], currentCols: number): Widget[] => {
    let currentLayout = allWidgets.map(w => {
      if (w.id === movedWidget.id) {
        const updated = { ...w, ...movedWidget } as Widget;
        updated.w = Math.max(1, Math.min(updated.w, currentCols));
        updated.x = Math.max(0, Math.min(updated.x, currentCols - updated.w));
        updated.h = Math.max(2, updated.h); // Altura mínima de 2 unidades
        return updated;
      }
      const other = { ...w };
      other.w = Math.min(other.w, currentCols);
      other.x = Math.max(0, Math.min(other.x, currentCols - other.w));
      return other;
    });

    // 1. Resolver Colisiones
    let hasCollisions = true;
    while (hasCollisions) {
      hasCollisions = false;
      currentLayout.sort((a, b) => a.y - b.y);

      for (let i = 0; i < currentLayout.length; i++) {
        for (let j = 0; j < currentLayout.length; j++) {
          if (i === j) continue;
          const a = currentLayout[i];
          const b = currentLayout[j];

          const isOverlapping = (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
          );

          if (isOverlapping) {
            if (a.id === movedWidget.id || a.y <= b.y) {
              currentLayout[j] = { ...b, y: a.y + a.h };
              hasCollisions = true;
            }
          }
        }
      }
    }

    // 2. Compactación Vertical
    currentLayout.sort((a, b) => a.y - b.y || a.x - b.x);
    const compactedLayout: Widget[] = [];

    for (const w of currentLayout) {
      let newY = 0;
      while (newY < w.y) {
        const canMoveUp = !compactedLayout.some(other => (
          w.x < other.x + other.w &&
          w.x + w.w > other.x &&
          newY < other.y + other.h &&
          newY + w.h > other.y
        ));
        if (canMoveUp) break;
        newY++;
      }
      compactedLayout.push({ ...w, y: newY });
    }

    return compactedLayout;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!activeId) return;
      setMousePos({ x: e.clientX, y: e.clientY });

      const grid = document.querySelector('.dashboard-grid');
      if (!grid) return;

      const rect = grid.getBoundingClientRect();
      const cellW = rect.width / cols;
      const cellH = 96;

      const gridX = Math.floor((e.clientX - rect.left) / cellW);
      const gridY = Math.floor((e.clientY - rect.top) / cellH);

      const current = originalWidgets.find(w => w.id === activeId);
      if (!current) return;

      if (interactionType === 'drag') {
        const safeW = Math.min(current.w, cols);
        const safeX = Math.max(0, Math.min(gridX, cols - safeW));
        const safeY = Math.max(0, gridY);

        if (!placeholder || placeholder.x !== safeX || placeholder.y !== safeY) {
          setPlaceholder({ x: safeX, y: safeY, w: safeW, h: current.h });
          const nextLayout = resolveLayout({ id: activeId, x: safeX, y: safeY, w: safeW }, originalWidgets, cols);
          setWidgets(nextLayout);
        }
      }
      else if (interactionType === 'resize-right') {
        // Esquina inferior derecha: ajusta w y h
        const newW = Math.max(1, Math.min(gridX - current.x + 1, cols - current.x));
        const newH = Math.max(2, gridY - current.y + 1);

        if (!placeholder || placeholder.w !== newW || placeholder.h !== newH) {
          setPlaceholder({ x: current.x, y: current.y, w: newW, h: newH });
          const nextLayout = resolveLayout({ id: activeId, w: newW, h: newH }, originalWidgets, cols);
          setWidgets(nextLayout);
        }
      }
      else if (interactionType === 'resize-left') {
        // Esquina inferior izquierda: ajusta x, w y h
        const originalRightEdge = current.x + current.w;
        const newX = Math.max(0, Math.min(gridX, originalRightEdge - 1));
        const newW = originalRightEdge - newX;
        const newH = Math.max(2, gridY - current.y + 1);

        if (!placeholder || placeholder.x !== newX || placeholder.w !== newW || placeholder.h !== newH) {
          setPlaceholder({ x: newX, y: current.y, w: newW, h: newH });
          const nextLayout = resolveLayout({ id: activeId, x: newX, w: newW, h: newH }, originalWidgets, cols);
          setWidgets(nextLayout);
        }
      }
    };

    const handleMouseUp = () => {
      if (activeId) {
        setOriginalWidgets([...widgets]);
      }
      setActiveId(null);
      setInteractionType(null);
      setPlaceholder(null);
    };

    if (activeId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeId, interactionType, placeholder, widgets, originalWidgets, resolveLayout, cols]);

  const onDragStart = (e: ReactMouseEvent, widget: Widget) => {
    e.preventDefault();
    setActiveId(widget.id);
    setInteractionType('drag');
    setPlaceholder({ x: widget.x, y: widget.y, w: Math.min(widget.w, cols), h: widget.h });
  };

  const onResizeStart = (e: ReactMouseEvent, widget: Widget, dir: InteractionType) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveId(widget.id);
    setInteractionType(dir);
    setPlaceholder({ x: widget.x, y: widget.y, w: widget.w, h: widget.h });
  };

  return {
    widgets,
    activeId,
    placeholder,
    showGrid,
    toggleGrid: () => setShowGrid(!showGrid),
    removeWidget: (id: string) => {
      const filtered = originalWidgets.filter(w => w.id !== id);
      setOriginalWidgets(filtered);
      setWidgets(filtered);
    },
    handlers: { onDragStart, onResizeStart, mousePos, interactionType },
    cols
  };
}

export { useDashboardLogic };