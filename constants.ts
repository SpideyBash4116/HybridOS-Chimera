
import { VFSNode } from './types';

export const INITIAL_VFS: Record<string, VFSNode> = {
  '/': {
    type: 'dir',
    name: '/',
    createdAt: Date.now(),
    children: {
      'bin': { type: 'dir', name: 'bin', children: {}, createdAt: Date.now() },
      'etc': { 
        type: 'dir', 
        name: 'etc', 
        createdAt: Date.now(),
        children: {
          'hostname': { type: 'file', name: 'hostname', content: 'chimera-os', createdAt: Date.now() },
          'motd': { type: 'file', name: 'motd', content: 'Welcome to Chimera Hybrid OS\nKernel 6.5.0-hybrid', createdAt: Date.now() }
        }
      },
      'home': {
        type: 'dir',
        name: 'home',
        createdAt: Date.now(),
        children: {
          'user': {
            type: 'dir',
            name: 'user',
            createdAt: Date.now(),
            children: {
              'Desktop': { 
                type: 'dir', 
                name: 'Desktop', 
                createdAt: Date.now(),
                children: {
                  'Atlas Reign.lnk': { type: 'file', name: 'Atlas Reign.lnk', content: 'EXEC:game', createdAt: Date.now() },
                  'Documents.lnk': { type: 'file', name: 'Documents.lnk', content: 'EXEC:files', createdAt: Date.now() }
                }
              },
              'Music': { type: 'dir', name: 'Music', children: {}, createdAt: Date.now() },
              'Documents': {
                type: 'dir',
                name: 'Documents',
                createdAt: Date.now(),
                children: {
                  'welcome.txt': { 
                    type: 'file', 
                    name: 'welcome.txt', 
                    content: 'Welcome to HybridOS Chimera.\nA fusion of macOS aesthetics, Windows workflow, and Linux power.',
                    createdAt: Date.now() 
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const APPS = [
  { id: 'terminal', name: 'Terminal', category: 'productivity' },
  { id: 'files', name: 'Files', category: 'productivity' },
  { id: 'browser', name: 'Browser', category: 'productivity' },
  { id: 'ai', name: 'Nova AI', category: 'productivity' },
  { id: 'notepad', name: 'TextEdit', category: 'productivity' },
  { id: 'music', name: 'Music', category: 'entertainment' },
  { id: 'calculator', name: 'Calculator', category: 'productivity' },
  { id: 'store', name: 'Store', category: 'entertainment' },
  { id: 'monitor', name: 'Activity', category: 'system' },
  { id: 'settings', name: 'Settings', category: 'system' },
  { id: 'game', name: 'Atlas Reign', category: 'games' },
  // Social Media
  { id: 'youtube', name: 'YouTube', category: 'entertainment' },
  { id: 'tiktok', name: 'TikTok', category: 'entertainment' },
  { id: 'instagram', name: 'Instagram', category: 'entertainment' },
  { id: 'facebook', name: 'Facebook', category: 'entertainment' },
  { id: 'reddit', name: 'Reddit', category: 'entertainment' },
  { id: 'x', name: 'X', category: 'entertainment' },
  { id: 'linkedin', name: 'LinkedIn', category: 'productivity' },
] as const;

export const APP_MENUS: Record<string, string[]> = {
  'finder': ['File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  'terminal': ['Terminal', 'Shell', 'Edit', 'View', 'Window', 'Help'],
  'browser': ['Safari', 'File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'],
  'ai': ['Nova', 'Edit', 'History', 'Help'],
  'notepad': ['TextEdit', 'File', 'Edit', 'Format', 'View', 'Window', 'Help'],
  'settings': ['Settings', 'Edit', 'View', 'Window', 'Help'],
  'game': ['Game', 'Laws', 'Strategy', 'Help'],
  'files': ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  'music': ['Music', 'Controls', 'Playlist', 'Library', 'Help'],
  'monitor': ['Activity', 'Process', 'View', 'Window', 'Help'],
  'calculator': ['Calculator', 'Edit', 'View', 'Help'],
  'store': ['Store', 'Account', 'View', 'Help'],
  'youtube': ['YouTube', 'View', 'Subscriptions', 'History', 'Help'],
  'tiktok': ['TikTok', 'For You', 'Live', 'Help'],
  'instagram': ['Instagram', 'Explore', 'Direct', 'Help'],
  'facebook': ['Facebook', 'Home', 'Marketplace', 'Gaming', 'Help'],
  'reddit': ['Reddit', 'Communities', 'Popular', 'Help'],
  'x': ['X', 'Home', 'Explore', 'Notifications', 'Help'],
  'linkedin': ['LinkedIn', 'My Network', 'Jobs', 'Messaging', 'Help'],
};
