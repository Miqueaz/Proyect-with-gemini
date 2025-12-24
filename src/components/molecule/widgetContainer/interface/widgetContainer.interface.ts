import type { LucideIcon } from 'lucide-react';
import type { MouseEvent as ReactMouseEvent } from 'react';

type InteractionType = 'drag' | 'resize-right' | 'resize-left' | null;

interface WidgetContainerProps {
  children: React.ReactNode;
  id: string;
  title: string;
  icon: LucideIcon;
  width: number;
  height: number;
  x: number;
  y: number;
  isDragging: boolean;
  onDragStart: (e: ReactMouseEvent) => void;
  onResizeStart: (e: ReactMouseEvent, dir: InteractionType) => void;
  onRemove: () => void;
}

export type { WidgetContainerProps, InteractionType };
