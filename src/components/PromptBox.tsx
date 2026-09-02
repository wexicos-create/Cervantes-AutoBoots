import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  Bug,
  Play,
  ArrowRight,
  CornerDownLeft,
  FileCode,
  Bot,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Server,
  Code2,
  FolderTree,
  Cpu,
  Dna,
  Award,
  Scale,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { ProgrammingLanguage } from '../types';

interface PromptBoxProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerateOrEdit: () => void;
  onAnalyzeAndFix: () => void;
  onGenerateTests: () => void;
  onLoadBuggySample: () => void;
  onOpenDesignTab?: () => void;
  onOpenRepoTab?: () => void;
  onOpenOllamaTab?: () => void;
  onOpenAuthorshipTab?: () => void;
  onOpenNutrientsTab?: () => void;
  isLoading: boolean;
  activeAction: 'generate' | 'analyze' | 'test' | 'repo' | null;
  selectedLanguage: ProgrammingLanguage;
  hasCode: boolean;
}

export const PromptBox: React.FC<PromptBoxProps> = ({
  prompt,
  setPrompt,
  onGenerateOrEdit,
  onAnalyzeAndFix,
  onGenerateTests,
  onLoadBuggySample,
  onOpenDesignTab,
  onOpenRepoTab,
  onOpenOllamaTab,
  onOpenAuthorshipTab,
  onOpenNutrientsTab,
  isLoading,
  activeAction,
  selectedLanguage,
  hasCode,
}) => {
  const ALL_PRESETS = [
    { label: '🛍️ Tienda Online Completa', prompt: 'Crear una tienda en línea completa con catálogo de productos, carrito de compras, cálculo de impuestos, checkout transaccional y órdenes de compra persistentes.' },
    { label: '📦 Control de Stock e Inventario', prompt: 'Sistema de gestión de inventario y pedidos con validación de stock concurrente, alertas de reabastecimiento y cálculo de margen de ganancia.' },
    { label: '💳 Pasarela de Pagos & Facturación', prompt: 'Módulo de checkout seguro con validación de tarjetas, cálculo de descuentos promocionales, generación de recibos y registro de transacciones.' },
    { label: '🚀 API REST Microservicios', prompt: 'API REST robusta con endpoints CRUD completos, validación estricta de esquemas, paginación, filtros de búsqueda y respuestas HTTP normalizadas.' },
    { label: '⚡ Webhook & Cola de Eventos', prompt: 'Procesador de eventos asíncronos y webhooks con reintentos exponenciales, idempotencia y cola de tareas en memoria.' },
    { label: '🔐 Autenticación JWT & RBAC', prompt: 'Sistema de autenticación y autorización con JWT, hashing seguro de contraseñas, control de acceso basado en roles (Admin, Usuario, Auditor) e interceptores.' },
    { label: '🛡️ Rate Limiting & Firewall', prompt: 'Middleware de seguridad con limitador de tasa de peticiones por IP/Token, sanitización anti-XSS y protección contra inyecciones SQL.' },
    { label: '📊 Algoritmos & Estructuras O(1)', prompt: 'Implementación de caché LRU de alto rendimiento con acceso en tiempo constante O(1), estructura de datos doblemente enlazada y desalojo automático.' },
    { label: '⚡ Pipeline Paralelo', prompt: 'Pipeline de procesamiento concurrente y transformación de datos en streaming con control de memoria y manejo de excepciones.' },
    { label: '🔍 Detección y Reparación', prompt: 'Analizar el código, detectar vulnerabilidades de seguridad, condiciones de carrera, excepciones no capturadas y aplicar correcciones inmediatas.' },
    { label: '🧪 Pruebas Unitarias & Borde', prompt: 'Generar una suite completa de pruebas unitarias cubriendo casos nominales, entradas nulas, desbordamientos y aserciones estrictas.' },
  ];

  const [currentRecommendations, setCurrentRecommendations] = useState(() => {
    const shuffled = [...ALL_PRESETS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });

  const refreshRecommendations = () => {
    setCurrentRecommendations(() => {
      const shuffled = [...ALL_PRESETS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onGenerateOrEdit();
    }
  };

  return (
    <div className="bg-[#071330]/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_12px_45px_rgba(2,6,23,0.85)] space-y-4 ring-1 ring-blue-400/20">


      {/* Header with Title and Mode Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center ring-1 ring-cyan-500/40 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
              Instrucciones de Construcción y Reparación
            </h2>
            <p className="text-[11px] text-slate-300">
              Genera código real sin omisiones ni marcadores ficticios
            </p>
          </div>
        </div>

        <button
          onClick={onLoadBuggySample}
          className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition-all active:scale-95 shadow-sm cursor-pointer"
          title="Cargar código de muestra con fallas reales para probar el detector y reparador de errores"
        >
          <Bug className="w-3.5 h-3.5" />
          <span>Cargar Muestra con Errores Reales</span>
        </button>
      </div>

      {/* Main Instruction Textarea */}
      <div className="relative">
        <textarea
          id="user-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe exactamente lo que deseas construir o reparar (ejemplo: 'Tienda en línea completa con carrito y checkout en PHP/TypeScript/Python', 'API REST de productos con validaciones y base de datos SQL', 'Corregir fallas de concurrencia y memory leaks')..."
          rows={3}
          className="w-full bg-[#040a1c] border border-blue-500/40 hover:border-blue-400 focus:border-cyan-400 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-sans resize-y leading-relaxed shadow-inner"
        />
        <div className="absolute right-3.5 bottom-3 hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400 pointer-events-none bg-[#09153a] px-2 py-0.5 rounded-md border border-blue-500/30">
          <CornerDownLeft className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-300">Ctrl + Enter para ejecutar</span>
        </div>
      </div>

      {/* Presets Navigator */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Sugerencias de Construcción:
          </span>
          <button
            onClick={refreshRecommendations}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-cyan-300 transition-colors border border-blue-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Selected Category Chips */}
        <div className="flex flex-col gap-2">
          {currentRecommendations.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(preset.prompt)}
              className="text-xs px-3 py-2 rounded-xl bg-[#040a1c] hover:bg-blue-950 text-slate-200 hover:text-cyan-300 border border-blue-500/30 hover:border-cyan-400 transition-all text-left shadow-sm flex items-start gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-cyan-200">{preset.label}</span>
                <span className="text-slate-400 line-clamp-1">{preset.prompt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Orchestration Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-blue-500/30">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Action: Generate / Edit Exact Code */}
          <button
            id="btn-generate-code"
            onClick={onGenerateOrEdit}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-[#040a1c] font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-950/60 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isLoading && activeAction === 'generate' ? (
              <>
                <div className="w-4 h-4 border-2 border-[#040a1c] border-t-transparent rounded-full animate-spin" />
                <span>Escribiendo Código Real...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{hasCode && prompt ? 'Aplicar Cambios al Código' : 'Escribir Código Completo'}</span>
              </>
            )}
          </button>

        </div>

        {/* Selected Language Indicator */}
        <div className="flex items-center gap-2 self-start lg:self-center px-3.5 py-1.5 rounded-xl bg-[#040a1c] border border-blue-500/40 shrink-0 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
          <span className="text-slate-300">Objetivo:</span>
          <span className="text-cyan-300 font-bold uppercase">{selectedLanguage}</span>
        </div>
      </div>
    </div>
  );
};


