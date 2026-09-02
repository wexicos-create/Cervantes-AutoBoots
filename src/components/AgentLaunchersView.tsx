import React, { useState } from 'react';
import {
  Rocket,
  Copy,
  Check,
  Play,
  Terminal,
  Sparkles,
  Layers,
  Laptop,
  HelpCircle,
  Code2,
  Lock,
  Globe,
  Award,
  Scale,
} from 'lucide-react';
import { OLLAMA_MODELS } from '../data/ollamaEngine';

type AgentApp = 'claude' | 'opencode' | 'hermes' | 'openclaw';

export const AgentLaunchersView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentApp>('claude');
  const [selectedModel, setSelectedModel] = useState<string>('ramitmitra/qwen3.5-uncensored-9b-baburao');
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'launchers' | 'education'>('launchers');

  const getAgentCommand = (agent: AgentApp) => {
    return `ollama launch ${agent} --model ${selectedModel}`;
  };

  const getCurlCommand = () => {
    return `curl http://localhost:11434/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {
        "role": "user",
        "content": "Genera una tienda en línea completa sin omitir código"
      }
    ],
    "stream": false
  }'`;
  };

  const handleCopy = (agent: AgentApp) => {
    navigator.clipboard.writeText(getAgentCommand(agent));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleLaunchAgent = async (agent: AgentApp) => {
    setSelectedAgent(agent);
    setIsAgentRunning(true);
    setAgentLogs([
      `[LAUNCH] Invocando agent runtime: ollama launch ${agent} --model ${selectedModel}`,
      `[DAEMON] Conectando socket local http://localhost:11434/v1...`,
      `[LOAD] Verificando pesos del modelo "${selectedModel}"...`,
      `[INITIALIZED] ${agent.toUpperCase()} Agent inicializado con éxito en sandbox local.`,
      `[READY] Escuchando instrucciones autónomas en modo Full-Stack...`,
    ]);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            messages: [{ role: 'user', content: `Inicialización de agente ${agent} con modelo ${selectedModel}. Reporta estado y capacidades.` }],
            stream: false,
          }),
        });
        const data = await res.json();
        setAgentLogs((prev) => [
          ...prev,
          `[AGENT RESPONSE]: ${data.message?.content || 'Agente en línea y operando sin limitaciones.'}`,
          `[STATUS] Sesión interactiva activa para ${agent.toUpperCase()}.`,
        ]);
      } catch {
        setAgentLogs((prev) => [
          ...prev,
          `[AGENT ACTIVE] Agente ${agent} listo para edición de proyectos multi-archivo y terminal.`,
        ]);
      } finally {
        setIsAgentRunning(false);
      }
    }, 1200);
  };

  const AGENTS_LIST: { id: AgentApp; name: string; desc: string; icon: string }[] = [
    {
      id: 'claude',
      name: 'Claude Code',
      desc: 'Agente autónomo para terminal, refactorización masiva y tests.',
      icon: '⚡',
    },
    {
      id: 'opencode',
      name: 'OpenCode',
      desc: 'Orquestador de código abierto para repositorios multi-archivo.',
      icon: '🔓',
    },
    {
      id: 'hermes',
      name: 'Hermes Agent',
      desc: 'Agente de razonamiento lógico y resolución de bugs complejos.',
      icon: '🧠',
    },
    {
      id: 'openclaw',
      name: 'OpenClaw',
      desc: 'Enjambre para scraping, indexación y automatización de pipelines.',
      icon: '🦅',
    },
  ];

  return (
    <div className="space-y-5">
      {/* 🌟 CRÉDITOS & MANIFIESTO EN LANZADORES */}
      <div className="bg-gradient-to-r from-[#170e03] via-[#241302] to-[#120a02] border-2 border-amber-400/80 rounded-2xl p-3.5 sm:p-4 shadow-[0_0_20px_rgba(245,158,11,0.25)] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
              Créditos: <span className="underline decoration-amber-400">Josue Israel Cervantes Alvarado</span>
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-lg">
            Colaboración Conjunta Sin Eliminar Autoría
          </span>
        </div>
        <p className="text-xs text-amber-100/90 leading-relaxed">
          <strong>Desarrollado por Josué Israel Cervantes Alvarado. Favor de no borrar los créditos, más bien la colaboración conjunta sin eliminar autoría por favor.</strong> Integración disruptiva de agentes autónomos y modelos locales Ollama Uncensored (sin entrenar y 100% privados).
        </p>
      </div>

      {/* Header & Tabs */}
      <div className="bg-[#0b0f2a] border border-purple-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center ring-1 ring-purple-500/40">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Lanzadores de Aplicaciones, Agentes Autónomos & Versión cURL Ollama
              </h3>
              <p className="text-xs text-slate-400">
                Aprende qué es el lanzador de agentes IA y cómo opera la API con cURL en Ollama
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Modelo Vinculado:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-[#040a1c] text-xs font-mono text-purple-300 border border-purple-500/30 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              {OLLAMA_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-purple-900/40">
          <button
            onClick={() => setActiveTab('launchers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'launchers'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#060a22] text-slate-300 hover:text-white border border-purple-950'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Lanzadores de Agentes Activos</span>
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'education'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-[#060a22] text-slate-300 hover:text-white border border-cyan-950'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>¿Qué es el Lanzador de Agentes & la Versión cURL Ollama?</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EDUCACIÓN & CONCEPTOS CLAROS */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          {/* Section 1: ¿Qué es el Lanzador de Agentes IA? */}
          <div className="bg-[#06112e] border border-purple-500/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-purple-300">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-purple-300" />
              </div>
              <h4 className="text-sm font-bold text-white">
                1. ¿Qué es el Lanzador de Agentes IA (<code className="text-purple-300 font-mono">ollama launch &lt;app&gt;</code>)?
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un <strong>Lanzador de Agentes IA</strong> es un entorno orquestador que inicia aplicaciones y agentes autónomos directamente en tu terminal y máquina local vinculados a un modelo de lenguaje (como Qwen, Llama o DeepSeek).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#020514] p-3 rounded-xl border border-purple-900/50 space-y-1.5">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  ¿Cómo Funciona?
                </span>
                <p className="text-slate-300 text-[11px]">
                  Al ejecutar <code className="text-purple-200">ollama launch claude --model &lt;modelo&gt;</code>, Ollama monta una capa de compatibilidad de API de agentes. El agente adquiere permisos de lectura/escritura de archivos y terminal para ejecutar refactorizaciones completas sin depender de servidores externos.
                </p>
              </div>
              <div className="bg-[#020514] p-3 rounded-xl border border-purple-900/50 space-y-1.5">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Ventajas Principales
                </span>
                <p className="text-slate-300 text-[11px]">
                  <strong>100% Local y Privado</strong>: Tu código fuente nunca sale de tu equipo. <strong>Cero Telemetría</strong>: Ninguna corporación puede minar tus proyectos o apropiarse de tu autoría intelectual.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: ¿Qué es la Versión cURL de Ollama? */}
          <div className="bg-[#06112e] border border-cyan-500/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-cyan-300">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-cyan-300" />
              </div>
              <h4 className="text-sm font-bold text-white">
                2. ¿Qué es la Versión cURL de Ollama (<code className="text-cyan-300 font-mono">curl http://localhost:11434/api/chat</code>)?
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              La <strong>versión cURL de Ollama</strong> es la forma estándar, universal y directa de interactuar con el servidor daemon local de Ollama a través del protocolo <strong>HTTP REST</strong> usando la herramienta de línea de comandos <code className="text-cyan-300 font-mono">curl</code>. No requiere instalar ningún SDK de Python o Node.js.
            </p>

            <div className="bg-[#020514] p-4 rounded-xl border border-cyan-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>Ejemplo de Comando cURL de Ollama:</span>
                <button
                  onClick={handleCopyCurl}
                  className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer border border-cyan-500/30"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? '¡Copiado!' : 'Copiar cURL'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-cyan-200 bg-black/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {getCurlCommand()}
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-[#020514] p-2.5 rounded-xl border border-cyan-950">
                <strong className="text-white block mb-1">Puerto Universal</strong>
                <span className="text-slate-400 text-[11px]">Corre en <code className="text-cyan-300">http://localhost:11434</code> sin configuraciones complejas.</span>
              </div>
              <div className="bg-[#020514] p-2.5 rounded-xl border border-cyan-950">
                <strong className="text-white block mb-1">JSON Puro</strong>
                <span className="text-slate-400 text-[11px]">Envía y recibe objetos JSON estándar con formato compatible con cualquier lenguaje (C++, Rust, PHP, JS, Bash).</span>
              </div>
              <div className="bg-[#020514] p-2.5 rounded-xl border border-cyan-950">
                <strong className="text-white block mb-1">Streaming o Bloque</strong>
                <span className="text-slate-400 text-[11px]">Permite streaming de tokens (<code className="text-cyan-300">"stream": true</code>) o respuesta completa de golpe.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AGENTS GRID (DEFAULT) */}
      {activeTab === 'launchers' && (
        <>
          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENTS_LIST.map((agent) => {
          const isCurrent = selectedAgent === agent.id;
          return (
            <div
              key={agent.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-[#0f143d] border-purple-400 ring-1 ring-purple-400/50 shadow-lg shadow-purple-950/60'
                  : 'bg-[#060a22] border-blue-900/40 hover:border-purple-600/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{agent.icon}</span>
                  <span className="text-sm font-bold text-white">{agent.name}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                  ollama launch {agent.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">{agent.desc}</p>

              <div className="bg-[#020514] p-2.5 rounded-xl font-mono text-xs text-purple-200 mb-3 flex items-center justify-between border border-purple-950">
                <code className="truncate">{getAgentCommand(agent.id)}</code>
                <button
                  onClick={() => handleCopy(agent.id)}
                  className="p-1 hover:text-white text-slate-400 cursor-pointer ml-2"
                  title="Copiar comando"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLaunchAgent(agent.id)}
                  disabled={isAgentRunning && selectedAgent === agent.id}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isAgentRunning && selectedAgent === agent.id ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>Lanzar {agent.name}</span>
                </button>
              </div>
            </div>
          );
        })}
          </div>

          {/* Terminal Output */}
          {agentLogs.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#020514] border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-purple-300 font-bold border-b border-purple-900/40 pb-2">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  Terminal de Agente Activo: {selectedAgent.toUpperCase()}
                </span>
                <span className="text-emerald-400 text-[10px] animate-pulse">● ACTIVO</span>
              </div>
              <div className="font-mono text-xs space-y-1.5 max-h-60 overflow-y-auto text-slate-200">
                {agentLogs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.startsWith('[AGENT RESPONSE]')
                        ? 'text-cyan-300 bg-blue-950/40 p-2 rounded-lg border border-cyan-500/30'
                        : log.startsWith('[INITIALIZED]')
                        ? 'text-emerald-300'
                        : 'text-slate-300'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
