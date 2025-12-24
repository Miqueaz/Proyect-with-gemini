import type { LucideIcon } from 'lucide-react';
import type { WidgetType } from '../../widgetContent';

interface Point {
  x: number;
  y: number;
}

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  icon: LucideIcon;
  x: number;
  y: number;
  w: number;
  h: number;
  data: any;
}

interface GhostWidgetProps {
  widget?: Widget;
  position: Point;
}

export type { GhostWidgetProps, Widget, Point };
