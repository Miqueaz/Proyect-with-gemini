import { useRef, useCallback, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import type { Block, BlockType, TextStyle } from '../interface/document.interface';
import { FloatingToolbar } from './floatingToolbar.component';

interface BlockElementProps {
  block: Block;
  onUpdate: (val: string) => void;
  onToggle: () => void;
  onEnter: () => void;
  onDelete: () => void;
  isActive: boolean;
  onFocus: () => void;
  onTypeChange: (type: BlockType) => void;
  onStyleToggle: (style: keyof TextStyle) => void;
}

export const BlockElement: React.FC<BlockElementProps> = ({ 
  block, onUpdate, onToggle, onEnter, onDelete, isActive, onFocus, onTypeChange, onStyleToggle 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, [block.content, block.type, block.bold, block.italic, adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    }
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
    }
  };

  const getStyleClasses = () => {
    let classes = "";
    if (block.bold) classes += " font-bold";
    if (block.italic) classes += " italic";
    if (block.underline) classes += " underline underline-offset-4 decoration-indigo-300";
    return classes;
  };

  const getTypeClasses = () => {
    switch (block.type) {
      case 'h1': return "text-4xl font-black mt-8 mb-3 text-slate-900 tracking-tight";
      case 'h2': return "text-2xl font-bold mt-6 mb-2 text-slate-800 tracking-tight";
      case 'todo': return "text-base font-medium text-slate-700";
      default: return "text-lg text-slate-600 mb-1";
    }
  };

  return (
    <div className="w-full relative group/block" onFocus={onFocus}>
      {isActive && (
        <FloatingToolbar 
          currentType={block.type}
          styles={{ bold: block.bold, italic: block.italic, underline: block.underline }}
          onTypeChange={onTypeChange}
          onStyleToggle={onStyleToggle}
          onDelete={onDelete}
        />
      )}
      
      <div className="flex items-start gap-4 w-full">
        {block.type === 'todo' && (
          <button 
            onClick={onToggle}
            className={`mt-2 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${block.completed ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
          >
            {block.completed && <CheckSquare size={16} />}
          </button>
        )}
        
        <textarea
          ref={textareaRef}
          className={`w-full bg-transparent border-none outline-none focus:ring-0 p-1.5 transition-all leading-relaxed resize-none overflow-hidden block ${getTypeClasses()} ${getStyleClasses()} ${block.completed ? 'line-through text-slate-400 opacity-60' : ''}`}
          value={block.content}
          onChange={(e) => onUpdate(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={block.type === 'h1' || block.type === 'h2' ? "Encabezado..." : "Escribe tus ideas..."}
          rows={1}
        />
      </div>
    </div>
  );
};
