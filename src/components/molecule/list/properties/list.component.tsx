import type { ListProps } from "./list.interface";


const List: React.FC<ListProps> = ({ data }) => (
  <div className="space-y-3 md:space-y-5">
    {data.map((item, i) => (
      <div key={i} className="flex items-center gap-3 md:gap-4">
        <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full ${item.urgent ? 'bg-red-500 shadow-lg shadow-red-200' : 'bg-indigo-400'}`} />
        <div className="flex-1">
          <p className="text-[11px] md:text-xs font-black text-slate-700 leading-none mb-1 md:mb-1.5">{item.task}</p>
          <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.time} • ACTIVO</p>
        </div>
      </div>
    ))}
  </div>
);

export { List };
