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
  Map,
  FileAudio
} from 'lucide-react';

/**
 * /////////////////////////////////////////////////
 * LOGIC / HOOKS (Separation of Concerns)
 * /////////////////////////////////////////////////
 */

const useMindVoice = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data representing the 14 entities (Files, Audios, Transcriptions, etc.)
  const files = [
    { id: 1, type: 'audio', title: 'Product Vision Brainstorming', date: '2023-10-12', size: '4.2MB', status: 'transcribed' },
    { id: 2, type: 'map', title: 'Marketing Strategy Q4', date: '2023-10-10', size: '1.1MB', status: 'generated' },
    { id: 3, type: 'report', title: 'Meeting Notes - Backend Sync', date: '2023-10-09', size: '256KB', status: 'draft' },
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

const MainLayout = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          {header}
        </header>

        {/* Main Content Area */}
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

const FileDashboard = ({ files, onSearch, searchQuery }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Knowledge Assets</h1>
          <p className="text-slate-500 text-sm">Convert your voice into structured data.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Plus size={18} />}>New Folder</Button>
          <Button variant="primary" icon={<Mic size={18} />}>Record New</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <SearchBar value={searchQuery} onChange={onSearch} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {files.map(file => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </div>
    </section>
  );
};

const NavigationSidebar = ({ currentTab, onTabChange }) => {
  const menuItems = [
    { id: 'all', label: 'All Files', icon: <LayoutDashboard size={20} /> },
    { id: 'audio', label: 'Recordings', icon: <FileAudio size={20} /> },
    { id: 'map', label: 'Mind Maps', icon: <Map size={20} /> },
    { id: 'report', label: 'Reports', icon: <FileText size={20} /> },
  ];

  return (
    <>
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
        <span className="text-xl font-black tracking-tight text-indigo-900">MindVoice AI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors">
          <LogOut size={20} />
          Logout
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

const FileCard = ({ file }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'audio': return <FileAudio className="text-blue-500" />;
      case 'map': return <Map className="text-purple-500" />;
      default: return <FileText className="text-emerald-500" />;
    }
  };

  return (
    <div className="group border border-slate-200 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
          {getIcon()}
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical size={18} />
        </button>
      </div>
      <h3 className="font-semibold text-slate-800 mb-1 truncate">{file.title}</h3>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Clock size={12} /> {file.date}</span>
        <span>{file.size}</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <StatusBadge status={file.status} />
        <div className="flex -space-x-2">
           <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-200 flex items-center justify-center text-[10px]">JD</div>
           <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px]">+1</div>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ value, onChange }) => (
  <div className="relative max-w-md w-full">
    <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-slate-400" size={18} />
    <input
      type="text"
      placeholder="Search for files, maps or voice notes..."
      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
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

const Button = ({ children, variant = 'primary', icon, onClick }) => {
  const baseStyles = "px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    transcribed: "bg-blue-50 text-blue-600 border-blue-100",
    generated: "bg-purple-50 text-purple-600 border-purple-100",
    draft: "bg-slate-50 text-slate-600 border-slate-100"
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
};

/**
 * /////////////////////////////////////////////////
 * MAIN APP COMPONENT
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
            <span className="text-sm font-medium text-slate-500">Workspace / <span className="text-slate-900">General</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost"><Share2 size={18} /></Button>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold">UA</div>
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