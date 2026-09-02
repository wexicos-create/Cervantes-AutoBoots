import React from 'react';
import {
  Code2,
  Cpu,
  FolderTree,
  Wrench,
  Bug,
  Bot,
  LayoutGrid,
  Columns2,
  Maximize,
  Minimize2,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';
import { WindowState } from './WindowFrame';

export type WorkspaceLayout = 'free_windows' | 'split_ide_ollama' | 'split_diagnostics_ide' | 'split_repo_ide' | 'focus_single';

interface CyberDockProps {
  windows: Record<string, WindowState>;
  onToggleWindow: (id: string) => void;
  onRestoreAll: () => void;
  onMinimizeAll: () => void;
  currentLayout: WorkspaceLayout;
  onSelectLayout: (layout: WorkspaceLayout) => void;
  activeWindowId: string | null;
}

export const CyberDock: React.FC<CyberDockProps> = ({
  windows,
  onToggleWindow,
  onRestoreAll,
  onMinimizeAll,
  currentLayout,
  onSelectLayout,
  activeWindowId,
}) => {
  return (
    <div className="sticky top-2 z-40 w-full max-w-7xl mx-auto px-2 sm:px-4 mb-4">
      <div className="bg-[#081330]/90 backdrop-blur-2xl border border-blue-500/40 rounded-2xl p-2 sm:p-2.5 shadow-[0_8px_32px_rgba(2,6,23,0.9)] ring-1 ring-cyan-500/20 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Window Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {(Object.values(windows) as WindowState[])
            .filter((win) => win.id !== 'authorship-privacy' && win.id !== 'community-forum')
            .map((win) => {
            const isActive = activeWindowId === win.id && win.isOpen && !win.isMinimized;
            const isOpen = win.isOpen && !win.isMinimized;

            return (
              <button
                key={win.id}
                id={`dock-btn-${win.id}`}
                onClick={() => onToggleWindow(win.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-blue-600/40 text-white border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-1 ring-cyan-400'
                    : isOpen
                    ? 'bg-blue-950/60 text-blue-200 border-blue-500/40 hover:bg-blue-900/60 hover:text-white'
                    : 'bg-[#050b1c]/70 text-slate-400 border-blue-900/40 hover:border-blue-700 hover:text-slate-200'
                }`}
                title={`Alternar ventana: ${win.title}`}
              >
                <span className="text-cyan-400 drop-shadow">{win.icon}</span>
                <span className="font-semibold text-white">{win.title}</span>
                {/* Active Indicator Dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isOpen ? 'bg-cyan-400 shadow-[0_0_6px_#38bdf8]' : 'bg-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Workspace Layout Presets & Global Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Layout Mode Selector */}
          <div className="flex items-center bg-[#050b1c] p-1 rounded-xl border border-blue-500/30 gap-1">
            <button
              onClick={() => onSelectLayout('free_windows')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentLayout === 'free_windows'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mosaico Multiventana Libre"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Multiventana</span>
            </button>

            <button
              onClick={() => onSelectLayout('split_ide_ollama')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentLayout === 'split_ide_ollama'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dividido: IDE + Ollama AI"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">IDE + Ollama</span>
            </button>

            <button
              onClick={() => onSelectLayout('split_diagnostics_ide')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentLayout === 'split_diagnostics_ide'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dividido: Reparador de Fallas + IDE"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reparador</span>
            </button>
          </div>

          {/* Quick Global Actions */}
          <button
            onClick={onRestoreAll}
            className="px-2.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
            title="Mostrar todas las ventanas"
          >
            Abrir Todo
          </button>

          <button
            onClick={onMinimizeAll}
            className="px-2.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-slate-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
            title="Minimizar todas las ventanas"
          >
            Minimizar
          </button>
        </div>
      </div>
    </div>
  );
};
