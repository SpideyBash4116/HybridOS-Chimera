
export type AppID = 'terminal' | 'files' | 'browser' | 'settings' | 'ai' | 'notepad' | 'game' | 'music' | 'monitor' | 'calculator' | 'store' | 'youtube' | 'tiktok' | 'facebook' | 'instagram' | 'reddit' | 'x' | 'linkedin';

export type AccentColor = 'blue' | 'purple' | 'rose' | 'emerald' | 'amber';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  isAdmin: boolean;
}

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VFSNode {
  type: 'dir' | 'file';
  name: string;
  children?: Record<string, VFSNode>;
  content?: string;
  createdAt: number;
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'system';
}
