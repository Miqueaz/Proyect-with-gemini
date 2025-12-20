interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  onToggleGrid: () => void;
  showGrid: boolean;
}

export type { DashboardLayoutProps };
