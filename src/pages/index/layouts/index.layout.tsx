import { LayoutIcon, Settings2 } from 'lucide-react';
import { Button } from '../../../components/atom';
import {
    DashboardLayout,
} from '../../../components/organism';
import type { LayoutProps } from '../interface/index.interface';


export function Layout({ cols = 12, showGrid = true, widgets, setWidgets }: LayoutProps) {

    return (
        <div
            className="min-h-screen bg-slate-50 w-full overflow-x-hidden w-full px-4 md:px-8 py-4 md:py-8"
            style={{ '--cols': cols } as React.CSSProperties}
        >
            <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 md:mb-12 bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-slate-200/50 w-full">
                <div className="flex items-center gap-5">
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 md:p-3.5 rounded-2xl text-white shadow-xl shadow-indigo-100">
                        <LayoutIcon size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">Dashboard</h1>
                        <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5 md:mt-1">Redimensionamiento por Esquinas</p>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Button
                        variant={showGrid ? "primary" : "secondary"}
                        onClick={() => { }}
                        className="flex-1 md:flex-none justify-center"
                    >
                        <Settings2 size={18} />
                        <span className="hidden sm:inline">{showGrid ? "Guardar Cambios" : "Modo Edición"}</span>
                        <span className="sm:hidden">{showGrid ? "Guardar" : "Editar"}</span>
                    </Button>
                </div>
            </header>

            <DashboardLayout
                widgets={widgets}
                setWidgets={setWidgets}
            />

        </div>
    );
}


