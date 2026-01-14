import { Bold, Italic, Underline, Trash2 } from 'lucide-react';
import type { BlockType, TextStyle } from '../interface/document.interface';

interface ToolbarProps {
  onTypeChange: (type: BlockType) => void;
  onStyleToggle: (style: keyof TextStyle) => void;
  currentType: string;
  styles: TextStyle;
  onDelete: () => void;
}

export const FloatingToolbar: React.FC<ToolbarProps> = ({ onTypeChange, onStyleToggle, currentType, styles, onDelete }) => (
  <div className="absolute -top-12 left-0 flex items-center gap-1 bg-slate-900 text-white p-1.5 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 border border-slate-700">
    <select 
      className="bg-slate-800 text-[10px] font-bold px-2 py-1 rounded-lg border-none outline-none mr-2 cursor-pointer hover:bg-slate-700"
      value={currentType}
      onChange={(e) => onTypeChange(e.target.value as BlockType)}
    >
      <option value="p">Texto</option>
      <option value="h1">Título Grande</option>
      <option value="h2">Título Mediano</option>
      <option value="todo">Lista de tareas</option>
    </select>
    
    <div className="h-4 w-px bg-slate-700 mx-1" />
    
    <button onClick={() => onStyleToggle('bold')} className={`p-1.5 rounded-lg transition-colors ${styles.bold ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
      <Bold size={14} />
    </button>
    <button onClick={() => onStyleToggle('italic')} className={`p-1.5 rounded-lg transition-colors ${styles.italic ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
      <Italic size={14} />
    </button>
    <button onClick={() => onStyleToggle('underline')} className={`p-1.5 rounded-lg transition-colors ${styles.underline ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
      <Underline size={14} />
    </button>
    
    <div className="h-4 w-px bg-slate-700 mx-1" />
    
    <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
      <Trash2 size={14} />
    </button>
  </div>
);
