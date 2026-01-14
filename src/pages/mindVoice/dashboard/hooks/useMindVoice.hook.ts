import { useState, useMemo } from 'react';
import type { MindVoiceFile } from '../interface/dashboard.interface';

export const useMindVoice = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Datos simulados
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
