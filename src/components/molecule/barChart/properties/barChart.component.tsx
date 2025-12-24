import type { BarChartProps } from "./barChart.interface";


const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="h-full flex items-end gap-2 md:gap-3 pt-2 min-h-[100px] md:min-h-[140px]">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 md:gap-3 group">
          <div className="w-full bg-slate-50 rounded-xl relative overflow-hidden" style={{ height: `${(d.val / max) * 100}%` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 opacity-90 transition-transform duration-500" />
          </div>
          <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.name}</span>
        </div>
      ))}
    </div>
  );
};

export { BarChart };
