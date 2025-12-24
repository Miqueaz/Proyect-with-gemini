import type { Widget } from "../../../components/molecule";

interface LayoutProps {
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
  cols?: number;
  showGrid?: boolean;
}


export type { LayoutProps };