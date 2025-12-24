type WidgetType = 'chart' | 'image' | 'list' | 'table';

interface WidgetContentProps {
  type: WidgetType;
  data: any;
}

export type { WidgetContentProps, WidgetType };
