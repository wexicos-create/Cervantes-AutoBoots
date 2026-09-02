import React, { ReactNode } from 'react';
import {
  Maximize2,
  Minimize2,
  Minus,
  X,
  Pin,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';

export interface WindowState {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowFrameProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  isMinimized?: boolean;
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onFocus?: () => void;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  icon,
  badge,
  badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  isMinimized = false,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
  onFocus,
  children,
  actions,
  className = '',
}) => {
  if (isMinimized) return null;

  return (
    <div
      id={`window-${id}`}
      onClick={onFocus}
      className={`flex flex-col transition-all duration-200 ${
        isMaximized
          ? 'fixed inset-3 sm:inset-5 z-50 rounded-2xl'
          : 'relative rounded-2xl'
      } bg-[#081330]/95 backdrop-blur-2xl border border-blue-500/30 shadow-[0_12px_45px_rgba(2,6,23,0.85)] ring-1 ring-blue-400/20 overflow-hidden ${className}`}
    >
      {/* Window Top Titlebar */}
      <div className="h-12 bg-gradient-to-r from-[#0d1c47] via-[#0a163a] to-[#0d1c47] px-4 border-b border-blue-500/30 flex items-center justify-between select-none cursor-default shrink-0">
        {/* Left: Window Traffic Lights */}
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Cerrar ventana"
              className="w-3 h-3 rounded-full bg-rose-500/90 hover:bg-rose-400 border border-rose-600 flex items-center justify-center text-rose-950 opacity-90 hover:opacity-100 transition-all cursor-pointer group"
            >
              <X className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
            </button>
          )}

          {onMinimize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              title="Minimizar al Dock"
              className="w-3 h-3 rounded-full bg-amber-500/90 hover:bg-amber-400 border border-amber-600 flex items-center justify-center text-amber-950 opacity-90 hover:opacity-100 transition-all cursor-pointer group"
            >
              <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
            </button>
          )}

          {onMaximize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              title={isMaximized ? 'Restaurar tamaño' : 'Maximizar a pantalla completa'}
              className="w-3 h-3 rounded-full bg-emerald-500/90 hover:bg-emerald-400 border border-emerald-600 flex items-center justify-center text-emerald-950 opacity-90 hover:opacity-100 transition-all cursor-pointer group"
            >
              {isMaximized ? (
                <Minimize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
              ) : (
                <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
              )}
            </button>
          )}

          {/* Window Title, Author Tag & Icon */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-1 sm:ml-2 min-w-0">
            <div className="text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] shrink-0">
              {icon}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                {title}
              </h2>
              {/* Discrete small yet clearly visible author badge requested by user */}
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 whitespace-nowrap shrink-0 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Desarrollado por Josué Israel Cervantes Alvarado</span>
              </span>
            </div>
            {badge && (
              <span
                className={`hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shadow-sm shrink-0 ${badgeColor}`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Right: Window Specific Tools & Controls */}
        <div className="flex items-center gap-2">
          {actions}

          {onMaximize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 hover:text-white border border-blue-500/30 transition-all text-xs flex items-center gap-1 cursor-pointer"
              title={isMaximized ? 'Restaurar' : 'Maximizar'}
            >
              {isMaximized ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-mono">Restaurar</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-mono">Pantalla Completa</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto text-slate-100">
        {children}
      </div>
    </div>
  );
};
