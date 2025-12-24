import type { Widget } from "../../../molecule";


interface DashboardLayoutProps {
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
}

interface DashboardLogicProps {
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
  options?: {
    cols?: number;
    showGrid?: boolean;
  }
}

interface Placeholder {
  x: number;
  y: number;
  w: number;
  h: number;
}


export type { DashboardLayoutProps, DashboardLogicProps, Placeholder };
