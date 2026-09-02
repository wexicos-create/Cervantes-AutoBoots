import React from 'react';
import {
  Code2,
  Upload,
  Download,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Users,
  Cloud,
} from 'lucide-react';
import { ProgrammingLanguage } from '../types';
import { LANGUAGES } from '../data/languages';

interface HeaderProps {
  selectedLanguage: ProgrammingLanguage;
  onSelectLanguage: (lang: ProgrammingLanguage) => void;
  onUploadClick: () => void;
  onDownloadClick: () => void;
  onCopyClick: () => void;
  copied: boolean;
  onResetSample: () => void;
  codeLength: number;
  activeTab: string;
  onOpenAuthorshipModal?: () => void;
  onOpenWindow?: (windowId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onUploadClick,
  onDownloadClick,
  onCopyClick,
  copied,
  onResetSample,
  onOpenAuthorshipModal,
  onOpenWindow,
}) => {
  const currentLang = LANGUAGES.find((l) => l.id === selectedLanguage) || LANGUAGES[0];

  return (
    <header className="bg-[#060e26]/90 backdrop-blur-xl border-b border-blue-500/30 sticky top-0 z-50 shadow-[0_4px_30px_rgba(2,6,23,0.8)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Workspace Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-950/60 text-white ring-2 ring-cyan-400/40">
            <Code2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-end gap-3">
              <span className="text-base sm:text-lg font-black text-white tracking-tight flex flex-col leading-none drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                <span>Cervantes</span>
                <span className="text-cyan-400 font-mono text-xs font-bold">Code</span>
              </span>
              <button
                onClick={onOpenAuthorshipModal}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-cyan-400 underline underline-offset-[3px] decoration-slate-600 hover:decoration-cyan-400 transition-all cursor-pointer mb-0.5"
                title="Ver Cláusulas Intelectuales y Legales de Autoría - Josué Israel Cervantes Alvarado"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Cláusulas Legales e Intelectuales</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Center */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {/* COMPILADOR APK ANDROID */}
          <button
            id="header-apk-cloud-btn"
            onClick={() => onOpenWindow && onOpenWindow('apk-cloud')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-emerald-300/50 transition-all cursor-pointer active:scale-95 ring-2 ring-emerald-400/30 whitespace-nowrap shrink-0"
            title="Compilador APK Android (Subir .zip, compilar, firmar y obtener APK)"
          >
            <Cloud className="w-4 h-4 stroke-[2.5]" />
            <span className="tracking-tight">Compilador APK Android</span>
          </button>

          {/* FORO COMUNITARIO: RESPALDO DE AUTORÍA E INVENTOS */}
          <button
            id="header-community-forum-btn"
            onClick={() => onOpenWindow && onOpenWindow('community-forum')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.7)] border-2 border-amber-200 transition-all cursor-pointer active:scale-95 ring-2 ring-amber-400/50 whitespace-nowrap shrink-0"
            title="Foro Comunitario: Respaldo de autoría para inventos o proyectos que no existen (Evidencia tipo GitHub)"
          >
            <Users className="w-4 h-4 stroke-[2.5]" />
            <span className="tracking-tight">Foro Comunitario</span>
            <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-black/30 text-amber-100 uppercase tracking-wider">
              Respaldo de Autoría
            </span>
          </button>
        </div>

        {/* Global Toolbar: Language, Upload, Download, Copy, Sample Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-[#09153a] border border-blue-500/40 rounded-xl px-2.5 py-1.5 shadow-sm hover:border-cyan-400 transition-colors">
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">Lenguaje:</span>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as ProgrammingLanguage)}
              className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-[#09153a] text-white">
                  {lang.name} (.{lang.extension})
                </option>
              ))}
            </select>
          </div>

          {/* Upload Button */}
          <button
            id="upload-file-btn"
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09153a] hover:bg-blue-900/70 text-white text-xs font-semibold border border-blue-500/40 hover:border-cyan-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Subir archivo de código (.py, .js, .ts, .c, .php, etc.)"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Subir</span>
          </button>

          {/* Download Button */}
          <button
            id="download-file-btn"
            onClick={onDownloadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09153a] hover:bg-blue-900/70 text-white text-xs font-semibold border border-blue-500/40 hover:border-cyan-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            title={`Descargar archivo actual (.${currentLang.extension})`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Descargar</span>
          </button>

          {/* Copy Button */}
          <button
            id="copy-code-btn"
            onClick={onCopyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09153a] hover:bg-blue-900/70 text-white text-xs font-semibold border border-blue-500/40 hover:border-cyan-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Copiar código del editor al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Copiar</span>
              </>
            )}
          </button>

          {/* Reset / Sample Button */}
          <button
            id="reset-sample-btn"
            onClick={onResetSample}
            className="p-2 rounded-xl bg-[#09153a] hover:bg-blue-900/70 text-slate-300 hover:text-white transition-all border border-blue-500/40 hover:border-cyan-400 shadow-sm active:scale-95 cursor-pointer"
            title="Cargar código limpio de ejemplo"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
};


