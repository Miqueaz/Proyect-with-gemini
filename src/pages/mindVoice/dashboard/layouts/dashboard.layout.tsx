interface MainLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export const DashboardLayout: React.FC<MainLayoutProps> = ({ children, sidebar, header }) => {
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
