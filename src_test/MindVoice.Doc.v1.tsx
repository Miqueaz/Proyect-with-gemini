import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  Share2, 
  Sparkles, 
  CheckSquare, 
  Type, 
  MessageSquare,
  Play,
  ArrowLeft,
  Settings,
  MoreHorizontal,
  GripVertical,
  PanelLeftClose, 
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Bold,
  Italic,
  Underline,
  Trash2
} from 'lucide-react';

/**
 * /////////////////////////////////////////////////
 * TYPES & INTERFACES
 * /////////////////////////////////////////////////
 */

type BlockType = 'h1' | 'h2' | 'p' | 'todo';

interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline?: boolean;
}

interface Block extends TextStyle {
  id: string;
  type: BlockType;
  content: string;
  completed?: boolean;
}

interface DocData {
  title: string;
  emoji: string;
  titleStyle: TextStyle;
  coverColor: string;
  tags: string[];
  blocks: Block[];
}

interface DocumentActions {
  docData: DocData;
  updateTitle: (val: string) => void;
  updateTitleStyle: (key: keyof TextStyle) => void;
  updateEmoji: (val: string) => void;
  updateBlock: (id: string, newContent: string) => void;
  updateBlockType: (id: string, newType: BlockType) => void;
  toggleBlockStyle: (id: string, styleKey: keyof TextStyle) => void;
  toggleTodo: (id: string) => void;
  addBlock: (afterId: string, type?: BlockType) => void;
  removeBlock: (id: string) => void;
  activeBlockId: string | null;
  setActiveBlockId: (id: string | null) => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
}

/**
 * /////////////////////////////////////////////////
 * LOGIC / HOOKS (TypeScript Engine)
 * /////////////////////////////////////////////////
 */

const useDocumentEngine = (): DocumentActions => {
  const [docData, setDocData] = useState<DocData>({
    title: "Estrategia de Lanzamiento MindVoice Q1",
    emoji: "🚀",
    titleStyle: { bold: true, italic: false },
    coverColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
    tags: ["Prioridad Alta", "Marketing", "IA"],
    blocks: [
      { id: 'b1', type: 'h1', content: 'Visión General del Proyecto', bold: true, italic: false, underline: false },
      { id: 'b2', type: 'p', content: 'Este documento resume las ideas capturadas durante la sesión de brainstorming por voz.', bold: false, italic: false, underline: false },
      { id: 'b3', type: 'h2', content: 'Objetivos Clave', bold: true, italic: false, underline: false },
      { id: 'b4', type: 'todo', content: 'Finalizar integración con Supabase Auth', completed: true, bold: false, italic: false, underline: false },
      { id: 'b5', type: 'todo', content: 'Optimizar latencia de Whisper en el procesamiento de audios largos.', completed: false, bold: false, italic: true, underline: false },
    ]
  });

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);

  const updateTitle = (val: string) => setDocData(prev => ({ ...prev, title: val }));
  const updateEmoji = (val: string) => setDocData(prev => ({ ...prev, emoji: val }));
  
  const updateTitleStyle = (key: keyof TextStyle) => setDocData(prev => ({ 
    ...prev, 
    titleStyle: { ...prev.titleStyle, [key]: !prev.titleStyle[key] } 
  }));

  const updateBlock = (id: string, newContent: string) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
    }));
  };

  const updateBlockType = (id: string, newType: BlockType) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, type: newType } : b)
    }));
  };

  const toggleBlockStyle = (id: string, styleKey: keyof TextStyle) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, [styleKey]: !b[styleKey] } : b)
    }));
  };

  const toggleTodo = (id: string) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, completed: !b.completed } : b)
    }));
  };

  const addBlock = (afterId: string, type: BlockType = 'p') => {
    const newBlock: Block = { 
      id: Math.random().toString(36).substr(2, 9), 
      type, 
      content: '', 
      completed: false,
      bold: false,
      italic: false,
      underline: false
    };
    const index = docData.blocks.findIndex(b => b.id === afterId);
    const newBlocks = [...docData.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setDocData(prev => ({ ...prev, blocks: newBlocks }));
    setActiveBlockId(newBlock.id);
  };

  const removeBlock = (id: string) => {
    if (docData.blocks.length <= 1) return;
    setDocData(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
  };

  return { 
    docData, 
    updateTitle, 
    updateTitleStyle,
    updateEmoji,
    updateBlock, 
    updateBlockType,
    toggleBlockStyle,
    toggleTodo, 
    addBlock, 
    removeBlock,
    activeBlockId,
    setActiveBlockId,
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen
  };
};

/**
 * /////////////////////////////////////////////////
 * LAYOUT
 * /////////////////////////////////////////////////
 */

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  rightPanel: React.ReactNode;
  header: React.ReactNode;
  leftOpen: boolean;
  rightOpen: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
}

const DocumentLayout: React.FC<LayoutProps> = ({ 
  children, sidebar, rightPanel, header, leftOpen, rightOpen, toggleLeft, toggleRight 
}) => (
  <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden relative">
    <aside className={`transition-all duration-300 ease-in-out bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 ${leftOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
      <div className="w-64 h-full flex flex-col">{sidebar}</div>
    </aside>

    <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
      <header className="h-14 flex items-center justify-between px-4 border-b border-slate-100/50 bg-white/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          {!leftOpen && (
            <button onClick={toggleLeft} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
              <PanelLeftOpen size={18} />
            </button>
          )}
          {header}
        </div>
        {!rightOpen && (
          <button onClick={toggleRight} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
            <PanelRightOpen size={18} />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex scroll-smooth bg-white relative">
        <main className={`flex-1 mx-auto transition-all duration-500 pt-16 px-6 md:px-12 lg:px-20 pb-[80vh] ${leftOpen && rightOpen ? 'max-w-3xl' : 'max-w-4xl'}`}>
          {children}
        </main>
        
        <aside className={`transition-all duration-300 ease-in-out border-l border-slate-100 bg-slate-50/30 shrink-0 ${rightOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <div className="w-80 h-full">{rightPanel}</div>
        </aside>
      </div>
    </div>
  </div>
);

/**
 * /////////////////////////////////////////////////
 * MOLECULES: FloatingToolbar
 * /////////////////////////////////////////////////
 */

interface ToolbarProps {
  onTypeChange: (type: BlockType) => void;
  onStyleToggle: (style: keyof TextStyle) => void;
  currentType: string;
  styles: TextStyle;
  onDelete: () => void;
}

const FloatingToolbar: React.FC<ToolbarProps> = ({ onTypeChange, onStyleToggle, currentType, styles, onDelete }) => (
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

/**
 * /////////////////////////////////////////////////
 * MOLECULES: BlockElement
 * /////////////////////////////////////////////////
 */

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

const BlockElement: React.FC<BlockElementProps> = ({ 
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

/**
 * /////////////////////////////////////////////////
 * ATOMS
 * /////////////////////////////////////////////////
 */

interface InsightCardProps {
  title: string;
  content: string;
  icon: React.ElementType;
  color: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, content, icon: Icon, color }) => (
  <div className="mb-6 group cursor-pointer animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-2 rounded-xl ${color} shadow-lg shadow-current/10 group-hover:scale-110 transition-transform`}>
        <Icon size={16} className="text-white" />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
    </div>
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-xs text-slate-600 leading-relaxed group-hover:border-indigo-200 transition-colors">
      {content}
    </div>
  </div>
);

/**
 * /////////////////////////////////////////////////
 * MAIN APP
 * /////////////////////////////////////////////////
 */

export default function App() {
  const engine = useDocumentEngine();
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [engine.docData.title]);

  return (
    <DocumentLayout
      leftOpen={engine.leftSidebarOpen}
      rightOpen={engine.rightSidebarOpen}
      toggleLeft={() => engine.setLeftSidebarOpen(!engine.leftSidebarOpen)}
      toggleRight={() => engine.setRightSidebarOpen(!engine.rightSidebarOpen)}
      header={
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <button className="hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><ArrowLeft size={16}/></button>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <FileText size={14} /> 
            <span className="hidden sm:inline">Base de conocimiento</span> 
            <ChevronRight size={12} /> 
            <span className="text-slate-900 font-bold truncate max-w-[120px] md:max-w-none">{engine.docData.title}</span>
          </div>
        </div>
      }
      sidebar={
        <div className="p-6 flex flex-col h-full bg-slate-50">
          <div className="flex items-center justify-between mb-10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-slate-900 rounded-2xl flex items-center justify-center text-sm text-white font-black shadow-xl shadow-slate-200">MV</div>
              <span className="font-black text-base tracking-tight text-slate-900">MindVoice</span>
            </div>
            <button onClick={() => engine.setLeftSidebarOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg">
              <PanelLeftClose size={18} />
            </button>
          </div>
          <nav className="flex-1 space-y-1.5 overflow-y-auto">
             {['Startup Pitch', 'Meeting Notes', 'Product Spec'].map(p => (
               <button key={p} className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md rounded-xl flex items-center gap-3 transition-all">
                 <FileText size={16} className="opacity-40" /> {p}
               </button>
             ))}
          </nav>
        </div>
      }
      rightPanel={
        <div className="p-8 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-10 shrink-0">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest"><Sparkles size={16} className="text-indigo-600" />Análisis IA</h3>
            <button onClick={() => engine.setRightSidebarOpen(false)} className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><PanelRightClose size={18} /></button>
          </div>
          <div className="space-y-6">
            <div className="bg-indigo-600 p-5 rounded-3xl text-white shadow-lg relative overflow-hidden group">
               <Sparkles size={20} className="mb-3 relative z-10 opacity-80" />
               <p className="text-[11px] font-bold leading-snug relative z-10">AI detectó un cambio en el tono de voz al hablar de "Estrategia". Nodo marcado como Prioridad.</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Sentimiento</span>
                <div className="flex items-center gap-2">
                   <div className="h-1 flex-1 bg-emerald-100 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-emerald-500"></div></div>
                   <span className="text-[10px] font-bold text-emerald-600">85% Positivo</span>
                </div>
            </div>
          </div>
        </div>
      }
    >
      <div className={`h-60 -mx-12 -mt-16 mb-16 ${engine.docData.coverColor} group relative overflow-hidden rounded-b-[40px] shadow-2xl`}>
         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
         <button className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-xl text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 border border-white/20">Cambiar portada</button>
      </div>

      <div className="group relative mb-12" onFocus={() => engine.setActiveBlockId('title')}>
        {engine.activeBlockId === 'title' && (
          <FloatingToolbar 
            currentType="title"
            styles={engine.docData.titleStyle}
            onTypeChange={() => {}} 
            onStyleToggle={engine.updateTitleStyle}
            onDelete={() => {}}
          />
        )}
        <input 
          value={engine.docData.emoji}
          onChange={(e) => engine.updateEmoji(e.target.value)}
          className="text-6xl mb-6 bg-transparent border-none outline-none w-24 hover:bg-slate-100 rounded-3xl transition-colors text-center"
        />
        <textarea 
          ref={titleRef}
          value={engine.docData.title}
          onChange={(e) => engine.updateTitle(e.target.value)}
          rows={1}
          className={`text-5xl md:text-6xl font-black w-full border-none outline-none placeholder-slate-200 tracking-tighter resize-none leading-[1.1] overflow-hidden ${engine.docData.titleStyle.bold ? 'font-black' : 'font-light'} ${engine.docData.titleStyle.italic ? 'italic' : ''}`}
          placeholder="Título del documento"
        />
      </div>

      <div className="space-y-4">
        {engine.docData.blocks.map(block => (
          <div key={block.id} className="group relative flex items-start gap-3 md:-ml-12">
            <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => engine.addBlock(block.id)} className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Plus size={16} />
              </button>
              <div className="p-1.5 text-slate-300 cursor-grab hover:text-slate-500">
                <GripVertical size={16} />
              </div>
            </div>

            <BlockElement 
              block={block} 
              isActive={engine.activeBlockId === block.id}
              onFocus={() => engine.setActiveBlockId(block.id)}
              onUpdate={(val) => engine.updateBlock(block.id, val)}
              onTypeChange={(newType) => engine.updateBlockType(block.id, newType)}
              onStyleToggle={(style) => engine.toggleBlockStyle(block.id, style)}
              onToggle={() => engine.toggleTodo(block.id)}
              onEnter={() => engine.addBlock(block.id)}
              onDelete={() => engine.removeBlock(block.id)}
            />
          </div>
        ))}
      </div>
    </DocumentLayout>
  );
}