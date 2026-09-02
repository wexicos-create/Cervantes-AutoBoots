import React, { useRef, useState } from 'react';
import { Upload, X, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { ProgrammingLanguage } from '../types';
import { LANGUAGES } from '../data/languages';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileLoaded: (content: string, detectedLang?: ProgrammingLanguage, filename?: string) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onFileLoaded,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: number; lang?: ProgrammingLanguage } | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const detectLanguageByExtension = (filename: string): ProgrammingLanguage | undefined => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return undefined;

    const map: Record<string, ProgrammingLanguage> = {
      py: 'python',
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      c: 'c',
      h: 'c',
      cpp: 'cpp',
      cc: 'cpp',
      hpp: 'cpp',
      rs: 'rust',
      go: 'go',
      java: 'java',
      cs: 'csharp',
      php: 'php',
      rb: 'ruby',
      swift: 'swift',
      kt: 'kotlin',
      html: 'html',
      htm: 'html',
      sql: 'sql',
      sh: 'bash',
      bash: 'bash',
    };

    return map[ext];
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const detectedLang = detectLanguageByExtension(file.name);
      setFileDetails({
        name: file.name,
        size: file.size,
        lang: detectedLang,
      });
      setFileContent(content);
    };
    reader.readAsText(file);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (fileContent !== null && fileDetails) {
      onFileLoaded(fileContent, fileDetails.lang, fileDetails.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">Subir Archivo de Código</h3>
            <p className="text-xs text-zinc-400">
              Soporta Python, JavaScript, TypeScript, C, C++, Rust, Go, Java, PHP y más
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-emerald-400 bg-emerald-950/20'
              : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            className="hidden"
            accept=".py,.js,.ts,.tsx,.jsx,.c,.cpp,.h,.hpp,.rs,.go,.java,.cs,.php,.rb,.swift,.kt,.html,.sql,.sh,.txt"
          />
          <FileCode className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-xs sm:text-sm font-semibold text-zinc-200">
            Haz clic para seleccionar o arrastra tu archivo aquí
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Cualquier archivo de texto o código fuente</p>
        </div>

        {/* File Preview if loaded */}
        {fileDetails && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold text-zinc-200">{fileDetails.name}</div>
                <div className="text-[11px] text-zinc-500">
                  {(fileDetails.size / 1024).toFixed(1)} KB • Lenguaje detectado:{' '}
                  <strong className="text-emerald-400">
                    {fileDetails.lang ? fileDetails.lang.toUpperCase() : 'General'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!fileContent}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-md disabled:opacity-40"
          >
            Cargar al Editor
          </button>
        </div>
      </div>
    </div>
  );
};
