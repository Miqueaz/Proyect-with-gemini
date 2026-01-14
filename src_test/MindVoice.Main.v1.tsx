import React, { useState, useMemo } from 'react';
import {
  Mic,
  Search,
  Folder,
  FileText,
  Share2,
  MoreVertical,
  LayoutDashboard,
  Settings,
  LogOut,
  Plus,
  Clock,
  Map as MapIcon, // Renombrado para evitar conflictos con el constructor global Map
  FileAudio,
  LucideIcon,
  ChevronRight // Importación faltante agregada
} from 'lucide-react';

/**
 * /////////////////////////////////////////////////
 * TYPES & INTERFACES
 * /////////////////////////////////////////////////
 */

type FileType = 'audio' | 'map' | 'report';
type FileStatus = 'transcribed' | 'generated' | 'draft';

interface MindVoiceFile {
  id: number;
  type: FileType;
  title: string;
  date: string;
  size: string;
  status: FileStatus;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

/**
 * /////////////////////////////////////////////////
 * LOGIC / HOOKS (Separación de Preocupaciones)
 * /////////////////////////////////////////////////
 */

const useMindVoice = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Datos simulados representando las entidades (Archivos, Audios, etc.)
  const files: MindVoiceFile[] = [
    { id: 1, type: 'audio', title: 'Brainstorming de Visión de Producto', date: '2023-10-12', size: '4.2MB', status: 'transcribed' },
    { id: 2, type: 'map', title: 'Estrategia de Marketing Q4', date: '2023-10-10', size: '1.1MB', status: 'generated' },
    { id: 3, type: 'report', title: 'Notas de Reunión - Sync de Backend', date: '2023-10-09', size: '256KB', status: 'draft' },
  ];

  const filteredFiles = useMemo(() => {
    return files.filter(file =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === 'all' || file.type === activeTab)
    );
  }, [searchQuery, activeTab]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredFiles
  };
};

/**
 * /////////////////////////////////////////////////
 * LAYOUT
 * /////////////////////////////////////////////////
 */

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navegación Lateral */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabecera */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          {header}
        </header>

        {/* Área de Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

/**
 * /////////////////////////////////////////////////
 * ORGANISMS
 * /////////////////////////////////////////////////
 */

interface FileDashboardProps {
  files: MindVoiceFile[];
  onSearch: (val: string) => void;
  searchQuery: string;
}

const FileDashboard: React.FC<FileDashboardProps> = ({ files, onSearch, searchQuery }) => {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mis Activos de Conocimiento</h1>
          <p className="text-slate-500 text-sm">Convierte tu voz en datos estructurados.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Folder size={18} />}>Nueva Carpeta</Button>
          <Button variant="primary" icon={<Mic size={18} />}>Grabar Nuevo</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <SearchBar value={searchQuery} onChange={onSearch} />
        </div>

        {files.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {files.map(file => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-400 font-medium">No se encontraron archivos</p>
          </div>
        )}
      </div>
    </section>
  );
};

interface NavigationSidebarProps {
  currentTab: string;
  onTabChange: (id: string) => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ currentTab, onTabChange }) => {
  const menuItems: NavigationItem[] = [
    { id: 'all', label: 'Todos los Archivos', icon: LayoutDashboard },
    { id: 'audio', label: 'Grabaciones', icon: FileAudio },
    { id: 'map', label: 'Mapas Mentales', icon: MapIcon },
    { id: 'report', label: 'Reportes', icon: FileText },
  ];

  return (
    <>
      <div className="p-6 flex items-center gap-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">M</div>
        <span className="text-xl font-black tracking-tighter text-indigo-900 uppercase">MindVoice AI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all text-sm">
          <Settings size={20} />
          Configuración
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium text-sm">
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

/**
 * /////////////////////////////////////////////////
 * MOLECULES
 * /////////////////////////////////////////////////
 */

interface FileCardProps {
  file: MindVoiceFile;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'audio': return <FileAudio className="text-blue-500" size={20} />;
      case 'map': return <MapIcon className="text-purple-500" size={20} />;
      default: return <FileText className="text-emerald-500" size={20} />;
    }
  };

  return (
    <div className="group border border-slate-200 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer bg-white relative">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
          {getIcon()}
        </div>
        <button className="text-slate-300 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
          <MoreVertical size={18} />
        </button>
      </div>

      <h3 className="font-bold text-slate-800 mb-1 truncate leading-tight">{file.title}</h3>

      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
        <span className="flex items-center gap-1"><Clock size={12} /> {file.date}</span>
        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
        <span>{file.size}</span>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
        <StatusBadge status={file.status} />
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">UA</div>
          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+1</div>
        </div>
      </div>
    </div>
  );
};

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="relative max-w-md w-full">
    <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-slate-400" size={18} />
    <input
      type="text"
      placeholder="Buscar archivos, mapas o notas de voz..."
      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm placeholder:text-slate-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

/**
 * /////////////////////////////////////////////////
 * ATOMS
 * /////////////////////////////////////////////////
 */

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, onClick }) => {
  const baseStyles = "px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
};

interface StatusBadgeProps {
  status: FileStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<FileStatus, string> = {
    transcribed: "bg-blue-50 text-blue-600 border-blue-100",
    generated: "bg-purple-50 text-purple-600 border-purple-100",
    draft: "bg-slate-50 text-slate-600 border-slate-100"
  };

  const labels: Record<FileStatus, string> = {
    transcribed: "Transcrito",
    generated: "Generado",
    draft: "Borrador"
  };

  return (
    <span className={`text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

/**
 * /////////////////////////////////////////////////
 * COMPONENTE PRINCIPAL (App)
 * /////////////////////////////////////////////////
 */

export default function App() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredFiles
  } = useMindVoice();

  return (
    <MainLayout
      header={
        <>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer">Espacio de Trabajo</span>
              <ChevronRight size={12} />
              <span className="text-slate-900">General</span>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Clock size={14} /> Actualizado hace 2m
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
              <Share2 size={18} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200 border-2 border-white cursor-pointer hover:scale-105 transition-transform">
              UA
            </div>
          </div>
        </>
      }
      sidebar={
        <NavigationSidebar currentTab={activeTab} onTabChange={setActiveTab} />
      }
    >
      <FileDashboard
        files={filteredFiles}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
    </MainLayout>
  );
}