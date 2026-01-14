import type { LucideIcon } from 'lucide-react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  FileAudio, 
  Map as MapIcon, 
  FileText 
} from 'lucide-react';
import type { NavigationItem } from '../interface/dashboard.interface';

interface NavigationSidebarProps {
  currentTab: string;
  onTabChange: (id: string) => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ currentTab, onTabChange }) => {
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
          const Icon: LucideIcon = item.icon;
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
