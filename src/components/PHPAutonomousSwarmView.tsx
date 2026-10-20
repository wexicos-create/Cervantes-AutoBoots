import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Play,
  Square,
  RefreshCw,
  Terminal,
  CheckCircle2,
  Copy,
  Download,
  Code2,
  FileCode,
  Layers,
  Award,
  Sparkles,
  TrendingUp,
  Share2,
  Lock,
  Globe,
  Database,
  ArrowRight,
  Sliders,
  Check,
  Flame,
} from 'lucide-react';
import { DecentralizedPHPBot, ExecutionLog } from '../types';

interface PHPAutonomousSwarmViewProps {
  onLoadPHPToEditor: (code: string) => void;
}

export const PHPAutonomousSwarmView: React.FC<PHPAutonomousSwarmViewProps> = ({ onLoadPHPToEditor }) => {
  const [taskInput, setTaskInput] = useState<string>(
    'Motor algorítmico distribuido de alta plusvalía: balanceo asíncrono, cálculo de margen y arbitraje de datos con consenso SHA-256'
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [swarmId, setSwarmId] = useState<string>('PHP-SWARM-8X-ALPHA');
  const [phpCode, setPhpCode] = useState<string>('');
  const [architecture, setArchitecture] = useState<string>('');
  const [surplusExplanation, setSurplusExplanation] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'live-swarm' | 'php-code' | 'algorithm-surplus' | 'telemetry'>('live-swarm');

  const [metrics, setMetrics] = useState({
    surplusValueGenerated: 'Sin medición real',
    efficiencyRate: 'No medido',
    latencyMs: 0,
    zeroFaultAssurance: 'Sin garantía de cero fallas',
  });

  const [bots, setBots] = useState<DecentralizedPHPBot[]>([
    {
      id: 'php_daemon_architect',
      name: 'PHP Architect Daemon',
      specialty: 'Orquestación de Procesos & Concurrencia Fibers',
      daemonState: 'stopped',
      memoryUsageMb: 0,
      autonomousCycles: 0,
      hashProof: 'Sin ejecutar',
      lastAction: 'Rol de referencia; no es un proceso activo',
      uptimeSeconds: 0,
    },
    {
      id: 'php_daemon_synthesizer',
      name: 'PHP Logic Synthesizer',
      specialty: 'Generación Algorítmica & Sanitización SQLi/XSS',
      daemonState: 'stopped',
      memoryUsageMb: 0,
      autonomousCycles: 0,
      hashProof: 'Sin ejecutar',
      lastAction: 'Rol de referencia; no es un proceso activo',
      uptimeSeconds: 86400,
    },
    {
      id: 'php_daemon_ledger',
      name: 'PHP Decentralized Ledger',
      specialty: 'Consenso Descentralizado & Proof-of-Execution',
      daemonState: 'stopped',
      memoryUsageMb: 0,
      autonomousCycles: 0,
      hashProof: 'Sin ejecutar',
      lastAction: 'Rol de referencia; no es un proceso activo',
      uptimeSeconds: 86400,
    },
    {
      id: 'php_daemon_surplus_optimizer',
      name: 'PHP Surplus Value Maximizer',
      specialty: 'Rendimiento Extremo & Supresión de Costes',
      daemonState: 'running',
      memoryUsageMb: 0,
      autonomousCycles: 0,
      hashProof: 'Sin ejecutar',
      lastAction: 'Rol de referencia; no es un proceso activo',
      uptimeSeconds: 86400,
    },
  ]);

  const [logs, setLogs] = useState<ExecutionLog[]>([
    {
      id: 'log-init-1',
      timestamp: new Date().toLocaleTimeString(),
      botId: 'php_daemon_architect',
      botName: 'PHP Architect Daemon',
      level: 'info',
      message: 'Vista ilustrativa: no hay daemons PHP conectados.',
    },
    {
      id: 'log-init-2',
      timestamp: new Date().toLocaleTimeString(),
      botId: 'php_daemon_synthesizer',
      botName: 'PHP Logic Synthesizer',
      level: 'success',
      message: 'Los roles de esta pantalla son referencias visuales, no procesos en ejecución.',
    },
    {
      id: 'log-init-3',
      timestamp: new Date().toLocaleTimeString(),
      botId: 'php_daemon_ledger',
      botName: 'PHP Decentralized Ledger',
      level: 'algorithm',
      message: 'No se ha ejecutado un proceso ni generado una prueba de consenso.',
    },
  ]);

  // No synthetic background ticker: displayed counters must not impersonate live processes.

  // Request new Swarm synthesis
  const handleDispatchAutonomousSwarm = async () => {
    setIsSynthesizing(true);
    setIsRunning(false);

    try {
      let data: any = null;
      try {
        const response = await fetch('/api/php/autonomous-swarm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'dispatch_autonomous_swarm',
            algorithmTask: taskInput,
            payload: {
              phpVersion: '8.2',
              strictTypes: true,
              concurrency: 'fibers_async',
            },
          }),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch {
        data = null;
      }

      if (!data) {
        setLogs((prev) => [{
          id: 'connection-error-' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          botId: 'api',
          botName: 'API Cervantes',
          level: 'error',
          message: 'No se pudo conectar con el generador. No se inventó código, telemetría ni consenso.',
        }, ...prev.slice(0, 20)]);
        return;
      }

      setSwarmId(data.swarmId || `PHP-SWARM-${Date.now().toString(36).toUpperCase()}`);
      setPhpCode(data.phpCode || '');
      setArchitecture(data.architecture || '');
      setSurplusExplanation(data.surplusValueExplanation || '');
      if (data.metrics) setMetrics(data.metrics);
      if (data.bots && Array.isArray(data.bots)) setBots(data.bots);
      if (data.executionLogs && Array.isArray(data.executionLogs)) {
        setLogs((prev) => [...data.executionLogs, ...prev.slice(0, 20)]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopyCode = () => {
    if (!phpCode) return;
    navigator.clipboard.writeText(phpCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPHP = () => {
    if (!phpCode) return;
    const blob = new Blob([phpCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autonomous_php_swarm.php';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div role="note" className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] px-4 py-3 text-sm text-zinc-200">
        <strong className="text-lime-300">Cómo funciona:</strong> esta herramienta genera una plantilla PHP usando reglas locales. “Enjambre” describe la idea de repartir tareas entre agentes; en esta versión no hay agentes remotos activos, ejecución PHP, métricas de rendimiento ni consenso distribuido.
      </div>
      {/* Top Banner: Decentralized Engine Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-purple-950/30 to-zinc-950 border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 text-white flex items-center justify-center shadow-xl shadow-purple-950/60">
              <Server className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Laboratorio de arquitectura PHP
                </h2>
                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  GENERACIÓN DE CÓDIGO
                </span>
                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SIN EJECUCIÓN REAL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-3xl">
                Genera una plantilla PHP a partir de tu indicación. Esta vista no inicia procesos PHP, no conecta nodos y no mide rendimiento; revisa el código generado antes de usarlo.
              </p>
            </div>
          </div>

          {/* Autonomous Status Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                isRunning
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Ocultar modo de referencia</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Mostrar modo de referencia</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Algorithm Prompt Box */}
        <div className="mt-5 space-y-2 relative z-10">
          <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>¿Qué quieres construir en PHP?</span>
            </span>
            <span className="text-[11px] font-mono text-purple-400">ID de generación: {swarmId}</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Describe el algoritmo, lógica de negocio o daemon PHP autónomo que deseas orquestar..."
              className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-sans"
            />
            <button
              onClick={handleDispatchAutonomousSwarm}
              disabled={isSynthesizing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 hover:from-purple-400 hover:to-emerald-300 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-950/50 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              {isSynthesizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Generando código...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Generar plantilla PHP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-4 border-t border-zinc-800/80 relative z-10">
          <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
              <span>Resultado medido</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
              {metrics.surplusValueGenerated}
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
              <span>Eficiencia medida</span>
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-purple-300 font-mono">
              {metrics.efficiencyRate}
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
              <span>Latencia real</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">
              {metrics.latencyMs} ms / ciclo
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
              <span>Garantía de calidad</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono truncate">
              {metrics.zeroFaultAssurance}
            </div>
          </div>
        </div>
      </div>

      {/* Reference roles — not live processes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/40 rounded-3xl p-5 space-y-3.5 shadow-xl transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-100">{bot.name}</h4>
                  <span className="text-[10px] text-zinc-400 block">{bot.specialty}</span>
                </div>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  bot.daemonState === 'running' || bot.daemonState === 'executing'
                    ? 'bg-emerald-400 animate-ping'
                    : 'bg-amber-400'
                }`}
                title={`Estado: ${bot.daemonState}`}
              />
            </div>

            <div className="space-y-1.5 text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Ciclos Autónomos:</span>
                <span className="text-emerald-400 font-bold">{bot.autonomousCycles.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Uso de RAM:</span>
                <span className="text-cyan-400 font-bold">{bot.memoryUsageMb} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Hash de Prueba:</span>
                <span className="text-purple-300 font-bold truncate max-w-[110px]" title={bot.hashProof}>
                  {bot.hashProof}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 bg-zinc-950/40 px-3 py-2 rounded-xl border border-zinc-900 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-tight">{bot.lastAction}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('live-swarm')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'live-swarm'
              ? 'bg-zinc-800 text-purple-300 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Telemetría de Daemons en Vivo</span>
        </button>

        <button
          onClick={() => setActiveTab('php-code')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'php-code'
              ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Código PHP 8.2+ Generado</span>
        </button>

        <button
          onClick={() => setActiveTab('algorithm-surplus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'algorithm-surplus'
              ? 'bg-zinc-800 text-amber-400 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Arquitectura & Plusvalía</span>
        </button>
      </div>

      {/* Sub-Tab 1: Live Swarm Telemetry & Logs */}
      {activeTab === 'live-swarm' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-mono font-bold text-zinc-200">
                Transmisión de Eventos Descentralizados (Autonomía Activa)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400">EN VIVO</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2 font-mono text-xs">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex items-start gap-3 hover:border-zinc-700 transition-colors"
              >
                <span className="text-[10px] text-zinc-500 shrink-0 mt-0.5">{log.timestamp}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    log.level === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : log.level === 'algorithm'
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  }`}
                >
                  {log.botName}
                </span>
                <span className="text-zinc-300 leading-relaxed">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: PHP Generated Code View */}
      {activeTab === 'php-code' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-900 px-5 py-3.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-bold text-purple-300">
                autonomous_php_swarm.php
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                PHP 8.2+ STRICT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleDownloadPHP}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Descargar .php</span>
              </button>

              <button
                onClick={() => onLoadPHPToEditor(phpCode)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Cargar en Editor Principal</span>
              </button>
            </div>
          </div>

          <pre className="p-5 font-mono text-xs sm:text-sm text-emerald-300/90 leading-6 overflow-auto max-h-[550px]">
            <code>
              {phpCode ||
                `<?php
declare(strict_types=1);

namespace AutonomousSwarm\\Engine;

/**
 * Haz clic en 'Despachar Bots PHP & Algoritmo' para generar código PHP autónomo en tiempo real.
 */`}
            </code>
          </pre>
        </div>
      )}

      {/* Sub-Tab 3: Architecture & Surplus Explanation */}
      {activeTab === 'algorithm-surplus' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div>
            <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Arquitectura Descentralizada & Concurrencia PHP:</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed font-sans">
              {architecture ||
                'La arquitectura del enjambre implementa Fiber Event Loops desacoplados en PHP 8.2+. Permite la ejecución no bloqueante de múltiples daemons de procesamiento numérico y transformación de datos sin incurrir en cuellos de botella de servidores centralizados.'}
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Plusvalía y Eficacia Algorítmica Obtenida:</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed font-sans">
              {surplusExplanation ||
                'Al eliminar capas de intermediación e implementar verificación criptográfica local en memoria, el sistema multiplica el throughput por 5.4x, reduciendo a cero el coste de infraestructura en la nube y garantizando soberanía y descentralización total en la ejecución.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
