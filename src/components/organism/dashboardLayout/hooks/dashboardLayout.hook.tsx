import type { Placeholder, DashboardLogicProps } from '../interface/dashboardLayout.interface';
import { useState, useEffect, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import type { Widget, InteractionType, Point } from '../../../molecule';

function useDashboardLogic({ widgets, setWidgets, options }: DashboardLogicProps) {
    const [showGrid, setShowGrid] = useState<boolean>(options?.showGrid || true);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [interactionType, setInteractionType] = useState<InteractionType>(null);
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
    const [placeholder, setPlaceholder] = useState<Placeholder | null>(null);
    const cols = options?.cols || 12;

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

            const current = widgets.find(w => w.id === activeId);
            if (!current) return;

            if (interactionType === 'drag') {
                const safeW = Math.min(current.w, cols);
                const safeX = Math.max(0, Math.min(gridX, cols - safeW));
                const safeY = Math.max(0, gridY);

                if (!placeholder || placeholder.x !== safeX || placeholder.y !== safeY) {
                    setPlaceholder({ x: safeX, y: safeY, w: safeW, h: current.h });
                    const nextLayout = resolveLayout({ id: activeId, x: safeX, y: safeY, w: safeW }, widgets, cols);
                    setPlaceholder({ x: nextLayout.find(w => w.id === activeId)?.x || 0, y: nextLayout.find(w => w.id === activeId)?.y || 0, w: nextLayout.find(w => w.id === activeId)?.w || 0, h: nextLayout.find(w => w.id === activeId)?.h || 0 });
                    setWidgets(nextLayout);
                }
            }
            else if (interactionType === 'resize-right') {
                // Esquina inferior derecha: ajusta w y h
                const newW = Math.max(1, Math.min(gridX - current.x + 1, cols - current.x));
                const newH = Math.max(2, gridY - current.y + 1);

                if (!placeholder || placeholder.w !== newW || placeholder.h !== newH) {
                    setPlaceholder({ x: current.x, y: current.y, w: newW, h: newH });
                    const nextLayout = resolveLayout({ id: activeId, w: newW, h: newH }, widgets, cols);
                    setPlaceholder({ x: nextLayout.find(w => w.id === activeId)?.x || 0, y: nextLayout.find(w => w.id === activeId)?.y || 0, w: nextLayout.find(w => w.id === activeId)?.w || 0, h: nextLayout.find(w => w.id === activeId)?.h || 0 });
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
                    setPlaceholder({ x: current.x, y: current.y, w: newW, h: newH });
                    const nextLayout = resolveLayout({ id: activeId, x: newX, w: newW, h: newH }, widgets, cols);
                    setPlaceholder({ x: nextLayout.find(w => w.id === activeId)?.x || 0, y: nextLayout.find(w => w.id === activeId)?.y || 0, w: nextLayout.find(w => w.id === activeId)?.w || 0, h: nextLayout.find(w => w.id === activeId)?.h || 0 });
                    setWidgets(nextLayout);
                }
            }
        };

        const handleMouseUp = () => {
            if (activeId) {
                setWidgets([...widgets]);
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
    }, [activeId, interactionType, placeholder, widgets, widgets, resolveLayout, cols]);

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
            const filtered = widgets.filter(w => w.id !== id);
            setWidgets(filtered);
            setWidgets(filtered);
        },
        handlers: { onDragStart, onResizeStart, mousePos, interactionType },
        cols
    };
}

export { useDashboardLogic };