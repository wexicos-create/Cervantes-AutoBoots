import React, { useRef, useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Upload,
  Trash2,
  Download,
  AlignLeft,
  WrapText,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ProgrammingLanguage } from '../types';
import { LANGUAGES } from '../data/languages';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: ProgrammingLanguage;
  onFileDrop: (file: File) => void;
  title?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onFileDrop,
  title = 'Editor de Código Fuente',
  readOnly = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatCode = () => {
    if (!code) return;
    // Standardize line endings and trailing whitespaces
    const cleaned = code
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();
    onChange(cleaned);
  };

  const handleDownloadCode = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codecraft_solution.${currentLang.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative bg-[#050c20] border rounded-2xl overflow-hidden shadow-[0_12px_45px_rgba(2,6,23,0.9)] transition-all flex flex-col min-h-[460px] ${
        isDragOver ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-blue-500/30'
      }`}
    >
      {/* Editor Header Bar */}
      <div className="bg-[#09153a] px-4 py-2.5 border-b border-blue-500/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-white">{title}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-950 text-cyan-300 uppercase font-bold border border-blue-500/40">
            {language} (.{currentLang.extension})
          </span>
        </div>

        {/* Editor Actions Toolbar */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-slate-300 hidden md:inline mr-2">
            {lineCount} {lineCount === 1 ? 'línea' : 'líneas'} • {code.length} chars
          </span>

          {/* Wrap Toggle */}
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              wordWrap
                ? 'bg-blue-600/40 text-white border border-cyan-400 shadow-sm'
                : 'bg-[#050c20] hover:bg-blue-900 text-slate-300 hover:text-white border border-blue-900'
            }`}
            title="Ajuste de línea (Word Wrap)"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Clean / Format */}
          <button
            onClick={handleFormatCode}
            className="p-1.5 rounded-lg bg-[#050c20] hover:bg-blue-900 text-slate-200 hover:text-white border border-blue-900 transition-colors cursor-pointer"
            title="Limpiar espacios en blanco y formatear"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          {/* Download Code */}
          <button
            onClick={handleDownloadCode}
            className="p-1.5 rounded-lg bg-[#050c20] hover:bg-blue-900 text-cyan-300 hover:text-white border border-blue-900 transition-colors cursor-pointer"
            title="Descargar este archivo"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[#050c20] hover:bg-blue-900 text-slate-200 hover:text-white border border-blue-900 transition-colors cursor-pointer"
            title="Copiar código al portapapeles"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {!readOnly && (
            <button
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-[#050c20] hover:bg-rose-950/80 text-slate-400 hover:text-rose-200 border border-blue-900 transition-colors cursor-pointer"
              title="Limpiar editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Line Numbers and Textarea */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs sm:text-sm">
        {/* Line Numbers column */}
        <div className="bg-[#030817] select-none py-4 px-3 text-right text-cyan-500/70 border-r border-blue-500/30 min-w-[3.2rem]">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6 text-[11px] sm:text-xs">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className={`flex-1 w-full bg-transparent p-4 text-cyan-100 leading-6 font-mono focus:outline-none resize-none overflow-auto selection:bg-cyan-500 selection:text-black ${
            wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
          }`}
          placeholder="Escribe, pega o arrastra un archivo de código aquí..."
        />
      </div>

      {/* Drag & Drop Visual Hint Banner */}
      {isDragOver && (
        <div className="absolute inset-0 bg-[#050c20]/95 border-2 border-dashed border-cyan-400 rounded-2xl flex flex-col items-center justify-center gap-3 z-30 pointer-events-none">
          <Upload className="w-10 h-10 text-cyan-400 animate-bounce" />
          <p className="text-sm font-bold text-cyan-300">Suelta tu archivo aquí para cargarlo al editor</p>
          <span className="text-xs text-slate-300 font-mono">Detección automática de extensión y lenguaje</span>
        </div>
      )}
    </div>
  );
};

