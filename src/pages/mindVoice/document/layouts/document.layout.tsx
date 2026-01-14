import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';

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

export const DocumentLayout: React.FC<LayoutProps> = ({ 
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
