interface BarData {
  name: string;
  val: number;
}

interface BarChartProps {
  data: BarData[];
}

export type { BarChartProps, BarData };
