import { useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  GripVertical, 
  PanelLeftClose, 
  PanelRightClose, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { DocumentLayout } from './layouts/document.layout';
import { FloatingToolbar } from './components/floatingToolbar.component';
import { BlockElement } from './components/blockElement.component';
import { useDocumentEngine } from './hooks/useDocumentEngine.hook';

const MindVoiceDocument: React.FC = () => {
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

export default MindVoiceDocument;
