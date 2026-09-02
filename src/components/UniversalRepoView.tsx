import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Download,
  Copy,
  Check,
  Play,
  Plus,
  Trash2,
  Folder,
  FileText,
  Terminal,
  Database,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Code2,
  Zap,
  ArrowRightLeft,
  FilePlus,
  ShieldCheck,
} from 'lucide-react';
import { UniversalProject, RepoFile, ProgrammingLanguage } from '../types';
import { createZipFromProject, triggerBlobDownload, transpileUniversalCode, optimizeCodeDeterministically } from '../data/projectEngine';
import { LANGUAGES } from '../data/languages';

interface UniversalRepoViewProps {
  project: UniversalProject | null;
  selectedLanguage: ProgrammingLanguage;
  onGenerateProject: (prompt: string, lang: ProgrammingLanguage) => void;
  isLoading: boolean;
  onSendCodeToEditor: (code: string, lang: ProgrammingLanguage) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const UniversalRepoView: React.FC<UniversalRepoViewProps> = ({
  project,
  selectedLanguage,
  onGenerateProject,
  isLoading,
  onSendCodeToEditor,
  onShowToast,
}) => {
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [targetTranspileLang, setTargetTranspileLang] = useState<ProgrammingLanguage>('python');
  const [transpileResult, setTranspileResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'transpiler' | 'optimizer' | 'architecture'>('files');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationData, setOptimizationData] = useState<any>(null);

  // New file modal state
  const [isAddingFile, setIsAddingFile] = useState<boolean>(false);
  const [newFilePath, setNewFilePath] = useState<string>('');
  const [newFileLang, setNewFileLang] = useState<ProgrammingLanguage>('typescript');

  // Active file resolution
  const currentFiles = project?.files || [];
  const activeFile = currentFiles.find((f) => f.id === activeFileId) || currentFiles[0] || null;

  // Real ZIP download
  const handleDownloadZip = async () => {
    if (!project) return;
    setIsZipping(true);
    try {
      const blob = await createZipFromProject(project);
      const filename = `${project.name}-${Date.now()}.zip`;
      triggerBlobDownload(blob, filename);
      onShowToast(`Repositorio "${project.name}" descargado en .ZIP exitosamente.`, 'success');
    } catch (err: any) {
      console.error(err);
      onShowToast('Error al comprimir el archivo ZIP.', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyActiveCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
    onShowToast(`Archivo "${activeFile.name}" copiado al portapapeles.`, 'info');
  };

  const handleTranspile = () => {
    if (!activeFile) return;
    const sourceLang = (activeFile.language as ProgrammingLanguage) || selectedLanguage;
    const result = transpileUniversalCode(activeFile.content, sourceLang, targetTranspileLang);
    setTranspileResult(result.convertedCode);
    onShowToast(`Transpilado fielmente a ${targetTranspileLang.toUpperCase()}.`, 'success');
  };

  const handleOptimize = () => {
    if (!activeFile) return;
    setIsOptimizing(true);
    setTimeout(() => {
      const result = optimizeCodeDeterministically(activeFile.content, (activeFile.language as ProgrammingLanguage) || selectedLanguage);
      setOptimizationData(result);
      setIsOptimizing(false);
      onShowToast('Optimización de complejidad Big-O calculada.', 'success');
    }, 400);
  };

  // Group files by folder
  const foldersMap = currentFiles.reduce((acc, file) => {
    const folder = file.folder || 'root';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {} as Record<string, RepoFile[]>);

  return (
    <div className="space-y-6">
      {/* Top Header & Generator Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/20 shrink-0">
              <FolderTree className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-zinc-100 tracking-tight">
                  Generador Universal de Repositorios Reales
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  MULTI-LENGUAJE REAL
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  CERO SIMULACIÓN
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Crea proyectos enteros con estructura de carpetas real (`src/`, `config/`, `database/`, `tests/`, `Dockerfile`), exporta en `.ZIP` con 1 clic y transpila entre 16 lenguajes.
              </p>
            </div>
          </div>

          {/* Quick Stats or Actions */}
          {project && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-download-full-zip"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all disabled:opacity-50"
              >
                {isZipping ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>Descargar Repositorio (.ZIP)</span>
              </button>
            </div>
          )}
        </div>

        {/* Input for custom project prompt */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customPrompt.trim() && !isLoading) {
                onGenerateProject(customPrompt.trim(), selectedLanguage);
              }
            }}
            placeholder="Describe qué repositorio construir (ej: Tienda en línea con carrito y SQL, API REST de microservicios, Motor de auth JWT...)"
            className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => onGenerateProject(customPrompt.trim() || 'Tienda en línea completa con base de datos SQL y arquitectura transaccional', selectedLanguage)}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-zinc-700 active:scale-95 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 fill-current" />
            <span>{isLoading ? 'Construyendo Repositorio...' : 'Crear Repositorio Completo'}</span>
          </button>
        </div>
      </div>

      {project ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Interactive File Tree (4 Cols) */}
          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col h-[650px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-zinc-200 truncate">
                  {project.name}/
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                {currentFiles.length} archivos
              </span>
            </div>

            {/* Folder / File Tree List */}
            <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
              {(Object.entries(foldersMap) as [string, RepoFile[]][]).map(([folderName, filesInFolder]) => (
                <div key={folderName} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1 bg-zinc-950/40 rounded-lg">
                    <Folder className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{folderName === '.' || folderName === 'root' ? 'Raíz del Proyecto' : folderName}</span>
                  </div>

                  <div className="space-y-1 pl-2">
                    {filesInFolder.map((file) => {
                      const isSelected = activeFile?.id === file.id;
                      return (
                        <button
                          key={file.id}
                          onClick={() => {
                            setActiveFileId(file.id);
                            setTranspileResult(null);
                            setOptimizationData(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                            <span className="truncate">{file.name}</span>
                          </div>
                          {file.isEntrypoint && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-sans font-bold">
                              MAIN
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Meta in Sidebar */}
            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Stack: <strong className="text-zinc-200">{project.primaryStack}</strong></span>
              <span className="text-emerald-400 font-medium">100% Real</span>
            </div>
          </div>

          {/* Right Column: Code Viewer, Multi-Tools & Actions (8 Cols) */}
          <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col h-[650px] shadow-xl overflow-hidden">
            {/* Action Sub-Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-950 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('files')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'files'
                      ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Código Fuente</span>
                </button>
                <button
                  onClick={() => setActiveTab('transpiler')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'transpiler'
                      ? 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transpilador Políglota</span>
                </button>
                <button
                  onClick={() => setActiveTab('optimizer')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'optimizer'
                      ? 'bg-zinc-800 text-amber-400 border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Optimizador Big-O</span>
                </button>
              </div>

              {/* Action Buttons for Active File */}
              {activeFile && activeTab === 'files' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyActiveCode}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Copiar contenido del archivo"
                  >
                    {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFile ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onSendCodeToEditor(activeFile.content, (activeFile.language as ProgrammingLanguage) || selectedLanguage);
                      onShowToast(`Archivo "${activeFile.name}" cargado en el editor principal.`, 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Abrir en Editor</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-zinc-950 font-mono text-xs text-zinc-200">
              {activeTab === 'files' && activeFile && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 text-[11px] text-zinc-400">
                    <span>Ruta: <strong className="text-zinc-200">{activeFile.path}</strong></span>
                    <span>Lenguaje: <strong className="text-emerald-400 uppercase">{activeFile.language}</strong></span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre leading-relaxed selection:bg-emerald-500 selection:text-zinc-950">
                    <code>{activeFile.content}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'transpiler' && (
                <div className="space-y-4 font-sans">
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                          <span>Convertir a cualquier lenguaje</span>
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Transforma la lógica de <strong>{activeFile?.name}</strong> manteniendo las firmas y contratos intactos.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={targetTranspileLang}
                          onChange={(e) => setTargetTranspileLang(e.target.value as ProgrammingLanguage)}
                          className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                        >
                          {LANGUAGES.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                              {lang.name}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={handleTranspile}
                          className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <span>Transpilar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {transpileResult && (
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                        <span className="font-bold text-cyan-400 uppercase">Resultado en {targetTranspileLang}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(transpileResult);
                            onShowToast('Código transpilado copiado.', 'info');
                          }}
                          className="text-zinc-400 hover:text-zinc-200 text-[11px] flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-zinc-200 overflow-x-auto whitespace-pre p-2 bg-zinc-950 rounded-xl">
                        <code>{transpileResult}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'optimizer' && (
                <div className="space-y-4 font-sans">
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Analizador de Complejidad Big-O & Optimizador</span>
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Calcula la complejidad temporal/espacial y refactoriza para latencia mínima.
                      </p>
                    </div>

                    <button
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
                    >
                      {isOptimizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
                      <span>Optimizar Rendimiento</span>
                    </button>
                  </div>

                  {optimizationData && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Tiempo Antes</div>
                          <div className="text-sm font-mono font-black text-rose-400">{optimizationData.timeComplexity.before}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Tiempo Optimizado</div>
                          <div className="text-sm font-mono font-black text-emerald-400">{optimizationData.timeComplexity.after}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Memoria</div>
                          <div className="text-sm font-mono font-black text-cyan-400">{optimizationData.spaceComplexity.after}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Ganancia Throughput</div>
                          <div className="text-sm font-mono font-black text-amber-400">+{optimizationData.speedupPercentage}%</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                        <h5 className="text-xs font-bold text-zinc-200">Mejoras Aplicadas:</h5>
                        <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                          {optimizationData.optimizationsApplied.map((opt: string, idx: number) => (
                            <li key={idx}>{opt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-800 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
            <FolderTree className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-zinc-200">Ningún repositorio generado todavía</h3>
            <p className="text-xs text-zinc-400">
              Escribe cualquier requerimiento arriba para sintetizar un repositorio completo real con carpetas, esquemas de bases de datos SQL y pruebas.
            </p>
          </div>
          <button
            onClick={() => onGenerateProject('Tienda en línea completa con carrito, catálogo, esquemas SQL y pruebas', selectedLanguage)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs shadow-lg active:scale-95 transition-all"
          >
            Generar Proyecto de Ejemplo (Tienda en Línea Completa)
          </button>
        </div>
      )}
    </div>
  );
};
