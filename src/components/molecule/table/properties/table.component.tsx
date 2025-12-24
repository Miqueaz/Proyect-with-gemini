import type { TableProps } from "./table.interface";


const Table: React.FC<TableProps> = ({ data }) => (
  <div className="space-y-2 md:space-y-3">
    {data.map((row, i) => (
      <div key={i} className="flex justify-between items-center p-2.5 md:p-3.5 rounded-xl md:rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-all text-[10px] md:text-[11px]">
        <span className="font-black text-slate-600 uppercase">{row.id}</span>
        <span className="font-mono font-black text-indigo-600 px-2 md:px-3 py-1 bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-100">{row.value}</span>
      </div>
    ))}
  </div>
);

export { Table };
