import type { GhostWidgetProps } from "./type";
import { GripVertical } from 'lucide-react';


const GhostWidget: React.FC<GhostWidgetProps> = ({ widget, position }) => {
  if (!widget) return null;
  return (
    <div 
      className="widget-ghost-mouse rounded-2xl flex flex-col overflow-hidden"
      style={{
        left: position.x - 40,
        top: position.y - 30,
        width: '280px',
        height: '180px'
      }}
    >
      <div className="p-3 bg-indigo-600 text-white flex items-center gap-2">
        <GripVertical size={16} />
        <span className="font-black text-[10px] uppercase tracking-wider">{widget.title}</span>
      </div>
      <div className="flex-1 bg-white/95 flex flex-col items-center justify-center p-4 gap-2">
        <div className="w-full h-1.5 bg-indigo-50 rounded-full" />
        <div className="w-2/3 h-1.5 bg-indigo-50/50 rounded-full" />
      </div>
    </div>
  );
};

export { GhostWidget };
