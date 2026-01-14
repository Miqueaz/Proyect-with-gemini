import { FileAudio, Map as MapIcon, FileText, MoreVertical, Clock } from 'lucide-react';
import { StatusBadge } from '../../../../components/atom/badge/badge.component';
import type { MindVoiceFile } from '../interface/dashboard.interface';

interface FileCardProps {
  file: MindVoiceFile;
}

export const FileCard: React.FC<FileCardProps> = ({ file }) => {
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
