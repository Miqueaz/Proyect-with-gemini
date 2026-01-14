import type { LucideIcon } from 'lucide-react';

export type FileType = 'audio' | 'map' | 'report';
export type FileStatus = 'transcribed' | 'generated' | 'draft';

export interface MindVoiceFile {
  id: number;
  type: FileType;
  title: string;
  date: string;
  size: string;
  status: FileStatus;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}
