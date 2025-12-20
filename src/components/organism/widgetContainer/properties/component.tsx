import type { WidgetContainerProps } from "./type";
import { GripVertical, X } from 'lucide-react';


const WidgetContainer: React.FC<WidgetContainerProps> = ({ 
  children, title, icon: Icon, width, height, x, y, isDragging, onDragStart, onResizeStart, onRemove 
}) => {
  const gridStyle = {
    gridColumn: `${x + 1} / span ${width}`,
    gridRow: `${y + 1} / span ${height}`,
  };

  return (
    <div 
      className={`widget-item flex flex-col bg-white border border-slate-200 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl relative 
        ${isDragging ? 'widget-dragging-active' : ''}`}
      style={gridStyle}
    >
      <div className="flex items-center justify-between p-3 md:p-4 bg-slate-50/50 border-b border-slate-100 relative z-30">
        <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
          <div 
            onMouseDown={onDragStart}
            className="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-600 p-1 md:p-1.5 rounded-lg hover:bg-white transition-all"
          >
            <GripVertical size={18} className="md:w-5 md:h-5" />
          </div>
          <Icon size={16} className="text-indigo-500 flex-shrink-0 md:w-[18px] md:h-[18px]" />
          <span className="font-bold text-[10px] md:text-xs text-slate-700 truncate uppercase tracking-tight">{title}</span>
        </div>
        <button onClick={onRemove} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
          <X size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>
      
      <div className="flex-1 p-4 md:p-6 overflow-auto custom-scrollbar bg-white relative z-10">
        {children}
      </div>

      {/* Esquinas inferiores para redimensionar */}
      <div 
        onMouseDown={(e) => onResizeStart(e, 'resize-left')}
        className="resize-corner resize-corner-left"
      >
        <div className="corner-handle-icon" />
      </div>
      
      <div 
        onMouseDown={(e) => onResizeStart(e, 'resize-right')}
        className="resize-corner resize-corner-right"
      >
        <div className="corner-handle-icon" />
      </div>
    </div>
  );
};

export { WidgetContainer };
