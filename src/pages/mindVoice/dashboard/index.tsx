import { Folder, Mic, Search } from 'lucide-react';
import { Button } from '../../../components/atom/button';
import { SearchBar } from '../../../components/molecule/searchBar/searchBar.component';
import { DashboardLayout } from './layouts/dashboard.layout';
import { NavigationSidebar } from './components/navigationSidebar.component';
import { FileCard } from './components/fileCard.component';
import { useMindVoice } from './hooks/useMindVoice.hook';

const MindVoiceDashboard: React.FC = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, filteredFiles } = useMindVoice();

  return (
    <DashboardLayout
      sidebar={<NavigationSidebar currentTab={activeTab} onTabChange={setActiveTab} />}
      header={<div />} // Header placeholder si es necesario
    >
      <section className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mis Activos de Conocimiento</h1>
            <p className="text-slate-500 text-sm">Convierte tu voz en datos estructurados.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => alert('Crear nueva carpeta')}>
              <Folder size={18} /> Nueva Carpeta
            </Button>
            <Button variant="primary" onClick={() => alert('Iniciar grabación')}>
              <Mic size={18} /> Grabar Nuevo
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar archivos, mapas o notas de voz..." />
          </div>

          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredFiles.map(file => (
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
    </DashboardLayout>
  );
};

export default MindVoiceDashboard;
