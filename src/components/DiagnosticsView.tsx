import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Wrench, ArrowRight, ShieldCheck, Bug, Sparkles, Activity, FileCheck, Copy, Check } from 'lucide-react';
import { AnalysisResult, DiagnosticIssue } from '../types';

interface DiagnosticsViewProps {
  analysis: AnalysisResult | null;
  onApplyFixedCode: (code: string) => void;
  language: string;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  analysis,
  onApplyFixedCode,
  language,
}) => {
  const [copiedFixed, setCopiedFixed] = useState(false);
  const [activeTab, setActiveTab] = useState<'issues' | 'fixedCode'>('issues');

  if (!analysis) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <Bug className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-zinc-200">Aún no se ha realizado un análisis</h4>
        <p className="text-xs text-zinc-400 max-w-md">
          Haz clic en el botón <strong className="text-rose-400">&quot;Analizar y Reparar Fallas&quot;</strong> en el panel superior para que el motor identifique errores reales, fallas de seguridad, fugas de memoria o excepciones no controladas.
        </p>
      </div>
    );
  }

  const { issues, summary, fixedCode, changesSummary, metrics } = analysis;

  const getSeverityBadge = (severity: DiagnosticIssue['severity']) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Error Crítico
          </span>
        );
      case 'security':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Seguridad
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Advertencia
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Información
          </span>
        );
    }
  };

  const handleCopyFixed = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopiedFixed(true);
    setTimeout(() => setCopiedFixed(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Metrics Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100">
                Diagnóstico de Calidad y Fallas Reales
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{summary}</p>
          </div>

          <button
            onClick={() => onApplyFixedCode(fixedCode)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Wrench className="w-4 h-4" />
            <span>Aplicar Código Reparado al Editor</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">Puntaje de Salud</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{metrics.score} / 100</div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">Fallas Encontradas</span>
            <div className={`text-xl font-bold mt-1 ${issues.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {issues.length}
            </div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">Complejidad</span>
            <div className="text-xl font-bold text-cyan-400 mt-1">{metrics.complexity}</div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">Riesgo de Seguridad</span>
            <div className={`text-xl font-bold mt-1 ${metrics.securityRisk === 'Alto' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {metrics.securityRisk}
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher: Issues list vs Fixed Code preview */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'issues'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Bug className="w-3.5 h-3.5 text-rose-400" />
          <span>Fallas y Soluciones ({issues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fixedCode')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'fixedCode'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ver Código Reparado Completo</span>
        </button>
      </div>

      {/* Tab 1: Issues List */}
      {activeTab === 'issues' && (
        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-300">¡No se detectaron fallas críticas!</h4>
              <p className="text-xs text-zinc-400">El código cumple con los estándares de sintaxis y seguridad analizados.</p>
            </div>
          ) : (
            issues.map((issue, idx) => (
              <div
                key={issue.id || idx}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-md hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(issue.severity)}
                    <h5 className="text-xs sm:text-sm font-bold text-zinc-100">{issue.title}</h5>
                  </div>
                  {issue.line && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      Línea {issue.line}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{issue.description}</p>

                {issue.codeSnippet && (
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-xs text-rose-300/90 overflow-x-auto">
                    <code>{issue.codeSnippet}</code>
                  </div>
                )}

                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-300">Reparación aplicada: </span>
                    <span className="text-zinc-300">{issue.suggestion}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Key Changes Summary List */}
          {changesSummary.length > 0 && (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4">
              <h5 className="text-xs font-bold text-zinc-200 uppercase mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resumen de Mejoras Realizadas:</span>
              </h5>
              <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside">
                {changesSummary.map((ch, i) => (
                  <li key={i}>{ch}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Fixed Code Preview */}
      {activeTab === 'fixedCode' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400">
                Código Reparado y Listo para Producción
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyFixed}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1"
              >
                {copiedFixed ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFixed ? 'Copiado' : 'Copiar'}</span>
              </button>
              <button
                onClick={() => onApplyFixedCode(fixedCode)}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <Wrench className="w-3 h-3" />
                <span>Aplicar al Editor</span>
              </button>
            </div>
          </div>
          <pre className="p-4 font-mono text-xs sm:text-sm text-emerald-300/90 leading-6 overflow-auto max-h-[480px]">
            <code>{fixedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
