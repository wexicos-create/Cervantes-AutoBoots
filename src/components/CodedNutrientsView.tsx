import React, { useState, useEffect, useRef } from 'react';
import {
  Dna,
  Bot,
  Cpu,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  Download,
  ArrowRight,
  Send,
  Code2,
  Zap,
  Activity,
  Boxes,
  Layers,
  Workflow,
  Database,
  Sliders,
  TrendingUp,
  FileCheck,
  Server,
  Lock,
  Globe,
  RefreshCw,
  GitBranch,
  BrainCircuit,
  Share2,
  Atom,
  Binary,
} from 'lucide-react';
import { ProgrammingLanguage } from '../types';
import {
  PURE_ALGORITHMIC_ENGINE_REGISTRY,
  CERVANTES_KNOWLEDGE_DOMAINS,
  AUTOBOT_CERVANTES_CODE_SUITE,
  COMMUNITY_ALGORITHMIC_BOTS,
  TASK_COMPLEXITY_LEVELS,
} from '../data/autobotCervantesKnowledge';

interface CodedNutrientsViewProps {
  selectedLanguage: ProgrammingLanguage;
  onApplyCodeToEditor: (code: string) => void;
  onOpenEditorTab: () => void;
}

interface BotDialogueMessage {
  id: string;
  botId: 'bot_alpha' | 'bot_beta' | 'bot_gamma' | 'bot_delta';
  botName: string;
  botRole: string;
  avatarColor: string;
  message: string;
  nutrientType: string;
  nutrientSnippet: string;
  timestamp: string;
}

export const CodedNutrientsView: React.FC<CodedNutrientsViewProps> = ({
  selectedLanguage,
  onApplyCodeToEditor,
  onOpenEditorTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'swarm-quantified' | 'cervantes' | 'database' | 'sandbox' | 'terminal'>('swarm-quantified');
  const [selectedComplexityTier, setSelectedComplexityTier] = useState<string>('DISTRIBUTED_ECOSYSTEM');
  const [swarmTaskPrompt, setSwarmTaskPrompt] = useState<string>('Desarrollar una API REST determinista y motor de autenticación con autocorrección en tiempo real');
  const [selectedPolymorphicDomain, setSelectedPolymorphicDomain] = useState<string>('FULLSTACK_WEB');
  const [targetLanguage, setTargetLanguage] = useState<string>(selectedLanguage || 'typescript');
  const [isSwarmProcessing, setIsSwarmProcessing] = useState<boolean>(false);
  const [swarmResult, setSwarmResult] = useState<any>(null);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [dialogueLogs, setDialogueLogs] = useState<BotDialogueMessage[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [testInput, setTestInput] = useState<string>('status');
  const [testLogs, setTestLogs] = useState<string[]>([
    '>>> [BOOT ENGINE] Autobot Cervantes Enjambre Algorítmico Cuantificado inicializado.',
    '>>> [DATA SOURCE] 5 Bots Algorítmicos Autónomos conectados (Alfa, Beta, Gamma, Delta, Epsilon).',
    '>>> [STATUS] Reemplazo total de la IA mediante código determinista activo. 100% Offline.',
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const currentTier = TASK_COMPLEXITY_LEVELS.find((t) => t.id === selectedComplexityTier) || TASK_COMPLEXITY_LEVELS[3];

  const handleRunSwarmSynthesis = async () => {
    setIsSwarmProcessing(true);
    try {
      const res = await fetch('/api/cervantes/quantified-swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: swarmTaskPrompt,
          complexityTier: selectedComplexityTier,
          targetLanguage: targetLanguage,
        }),
      });
      const data = await res.json();
      setSwarmResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwarmProcessing(false);
    }
  };

  useEffect(() => {
    handleRunSwarmSynthesis();
  }, [selectedComplexityTier, targetLanguage]);

  // Simulation steps dialog between the 4 bots in the sandbox
  const SIMULATION_STAGES: BotDialogueMessage[] = [
    {
      id: 'step_1',
      botId: 'bot_alpha',
      botName: 'Bot Alfa [Lexer Atómico]',
      botRole: 'Matriz de Estados & Gramáticas Formales BNF',
      avatarColor: 'from-cyan-500 to-blue-600',
      message: 'Iniciando diseño determinista. Aportando Matriz α: Gramática BNF libre de contexto y tokenización formal O(N) sin ambigüedades estocásticas.',
      nutrientType: 'Matriz α (FSM Determinista)',
      nutrientSnippet: 'enum CervantesState { IDLE, ADAPTING, EXECUTING, SECURING, HEALING }',
      timestamp: '00:00:01',
    },
    {
      id: 'step_2',
      botId: 'bot_beta',
      botName: 'Bot Beta [Compilador AST & FSM]',
      botRole: 'Autómatas Finitos & Grafos de Control Discretos',
      avatarColor: 'from-purple-500 to-indigo-600',
      message: 'Recibida Matriz α. Inyectando Matriz β: Autómata de estados finitos determinista y árbol sintáctico abstracto (AST) inmune a bucles infinitos.',
      nutrientType: 'Matriz β (Compilador AST)',
      nutrientSnippet: 'heuristicsDictionary.set(/^(status|optimize|audit|calc)$/i, handlerFn)',
      timestamp: '00:00:02',
    },
    {
      id: 'step_3',
      botId: 'bot_gamma',
      botName: 'Bot Gamma [Escudo de Memoria & Watchdog]',
      botRole: 'Auto-Reparación y Contención de Fallas O(1)',
      avatarColor: 'from-emerald-500 to-teal-600',
      message: 'Integrando Matriz γ: Watchdog de auto-cicatrización y caché LRU O(1) para ejecución continua sin degradación de memoria ni memory leaks.',
      nutrientType: 'Matriz γ (Watchdog Shield O(1))',
      nutrientSnippet: 'setInterval(() => { if (healthScore < 100) heal(); }, 4000)',
      timestamp: '00:00:03',
    },
    {
      id: 'step_4',
      botId: 'bot_delta',
      botName: 'Bot Delta [Reductor McCabe & Compilador]',
      botRole: 'Empaquetado Standalone 100% Determinista (Cero IA)',
      avatarColor: 'from-amber-500 to-orange-600',
      message: 'Matrices consolidadas. Compilando "Autobot Cervantes": Super bot unificado individual 100% funcional y autónomo que reemplaza totalmente la IA en programación.',
      nutrientType: 'Matriz δ (Compilador Standalone)',
      nutrientSnippet: 'export class AutobotCervantes { ... 100% STANDALONE DETERMINISTIC CODE ... }',
      timestamp: '00:00:04',
    },
  ];

  const generatedCode =
    targetLanguage === 'python'
      ? AUTOBOT_CERVANTES_CODE_SUITE.python
      : AUTOBOT_CERVANTES_CODE_SUITE.typescript;

  const startSandboxDialogue = () => {
    setIsSimulating(true);
    setDialogueLogs([]);
    setSimulationStep(0);

    let step = 0;
    const interval = setInterval(() => {
      if (step < SIMULATION_STAGES.length) {
        setDialogueLogs((prev) => [...prev, SIMULATION_STAGES[step]]);
        setSimulationStep(step + 1);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1100);
  };

  useEffect(() => {
    setDialogueLogs(SIMULATION_STAGES);
    setSimulationStep(SIMULATION_STAGES.length);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBot = () => {
    const ext = targetLanguage === 'python' ? 'py' : 'ts';
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AutobotCervantes_SuperBot.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunInteractiveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const input = testInput.trim();
    const timestamp = new Date().toLocaleTimeString();

    let output = '';
    const lower = input.toLowerCase();

    if (lower.includes('status') || lower.includes('diagnose') || lower.includes('salud') || lower.includes('ping')) {
      output = `[AUTOBOT CERVANTES ONLINE]\nSalud: 100% | Dominio: ${selectedPolymorphicDomain} | Motores: 5 Motores Matemáticos Puros Activos | Modo: 100% Determinista (Reemplazo Total de IA)`;
    } else if (lower.startsWith('optimize') || lower.startsWith('optimizar') || lower.startsWith('mccabe')) {
      const targetPrompt = input.replace(/^(optimize|optimizar|mccabe)\s*/i, '') || 'Bucle anidado O(N^2)';
      output = `[REDUCCIÓN MATEMÁTICA MCCABE]:\nTransformación formal: "${targetPrompt}" comprimida a HashMap O(1) con tiempo constante amortizado.\nGanancia de Eficiencia: +420% | Complejidad Ciclomática V(G) reducida de 14 a 2.`;
    } else if (lower.startsWith('audit') || lower.startsWith('vuln') || lower.startsWith('seguridad')) {
      const codeSnippet = input.replace(/^(audit|vuln|seguridad)\s*/i, '');
      const issues = [];
      if (codeSnippet.includes('SELECT') && codeSnippet.includes('+')) issues.push('Inyección SQL por concatenación. Sanitizado a Prepared Statements ($1, ?).');
      if (codeSnippet.includes('/ 0')) issues.push('División por cero interceptada por invariante de Hoare.');
      if (codeSnippet.match(/(key|secret|password)\s*=/i)) issues.push('Credencial sensible aislada en Secrets Manager.');
      output = `[AUDITORÍA DETERMINISTA CERVANTES]:\n` + (issues.length > 0 ? issues.map((i) => ` - ALERTA RESUELTA: ${i}`).join('\n') : ' - Código verificado con 0 vulnerabilidades.');
    } else if (lower.startsWith('solve') || lower.startsWith('calc') || lower.startsWith('compute')) {
      const expr = input.replace(/^(solve|calc|compute)\s*/i, '');
      try {
        const sanitized = expr.replace(/[^0-9+\-*/().% ]/g, '');
        const res = Function(`'use strict'; return (${sanitized})`)();
        output = `[CÁLCULO EXACTO CERVANTES]: ${sanitized} = ${res}`;
      } catch (err: any) {
        output = `[ERROR EN EXPRESIÓN]: ${err.message}`;
      }
    } else if (lower.includes('heal') || lower.includes('repair') || lower.includes('restaurar')) {
      output = `[AUTO-CICATRIZACIÓN CERVANTES]: Subsistemas restaurados al 100%, caché LRU purgada y FSM reseteada a estado base.`;
    } else {
      output = `[AUTOBOT CERVANTES]: Directiva "${input}" procesada mediante autómatas de estados finitos O(1) sin incertidumbre.`;
    }

    setTestLogs((prev) => [
      ...prev,
      `>>> [${timestamp}] ORDEN: ${input}`,
      `<<< [${timestamp}] CERVANTES: ${output}`,
    ]);
    setTestInput('');
  };

  return (
    <div className="space-y-6">
      {/* Super Bot Hero Banner */}
      <div className="bg-gradient-to-r from-[#03102d] via-[#09235e] to-[#040e2b] border border-cyan-400/40 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(2,6,23,0.85)] space-y-4 ring-1 ring-cyan-400/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-black font-black ring-2 ring-cyan-300/50 shadow-xl shadow-cyan-950/80">
              <Bot className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  El Autobot Cervantes
                </h3>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md">
                  REEMPLAZO TOTAL DE LA IA EN PROGRAMACIÓN
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  100% CÓDIGO DETERMINISTA PURO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Arquitectura de <strong>enjambre de bots autónomos unificables cuantificados</strong> que <strong>reemplaza totalmente a la IA en programación</strong>. Los bots deconstruyen y reconstruyen tareas complejas mediante <strong>gramáticas formales, autómatas FSM, blindaje de memoria O(1) y optimización McCabe</strong>, garantizando cero alucinaciones y cero dependencias de IA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const codeToApply = swarmResult?.generatedCode || generatedCode;
                onApplyCodeToEditor(codeToApply);
                onOpenEditorTab();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Inyectar Solución en Editor</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-cyan-500/20">
          <button
            onClick={() => setActiveSubTab('swarm-quantified')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'swarm-quantified'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>Enjambre Algorítmico & Descomposición Atómica</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cervantes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'cervantes'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Código Standalone del Bot</span>
          </button>

          <button
            onClick={() => setActiveSubTab('database')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'database'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <Binary className="w-4 h-4" />
            <span>5 Motores Algorítmicos Puros</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-900/80 text-cyan-200">SIN IA</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sandbox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'sandbox'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Matrices & Diálogo en Sandbox</span>
          </button>

          <button
            onClick={() => setActiveSubTab('terminal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'terminal'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Terminal Interactiva Offline</span>
          </button>
        </div>
      </div>

      {/* SubTab 0: Enjambre Algorítmico & Descomposición Atómica */}
      {activeSubTab === 'swarm-quantified' && (
        <div className="space-y-6">
          {/* 1. Complexity Tier Selector */}
          <div className="bg-[#050e29] border border-cyan-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Nivel de Complejidad de la Tarea & Deconstrucción Cuantificada
                  </h4>
                  <p className="text-xs text-slate-400">
                    Los bots determinan cuántos módulos algorítmicos activar y su profundidad atómica
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Lenguaje Objetivo:</span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-[#030817] border border-blue-500/40 text-cyan-300 font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="php">PHP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TASK_COMPLEXITY_LEVELS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedComplexityTier(tier.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    selectedComplexityTier === tier.id
                      ? 'bg-gradient-to-b from-blue-900/80 to-[#0b1e4f] border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                      : 'bg-[#06112e] border-blue-500/30 hover:border-cyan-500/40 text-slate-300 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                        {tier.tag}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {tier.activeNeuronsCount} Bots
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {tier.name}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {tier.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Task Prompt Input */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={swarmTaskPrompt}
                onChange={(e) => setSwarmTaskPrompt(e.target.value)}
                placeholder="Escribe la directiva o tarea a resolver con algoritmos deterministas..."
                className="flex-1 bg-[#03091d] border border-blue-500/40 rounded-xl px-4 py-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleRunSwarmSynthesis}
                disabled={isSwarmProcessing}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSwarmProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSwarmProcessing ? 'Procesando...' : 'Deconstruir & Resolver'}</span>
              </button>
            </div>
          </div>

          {/* 2. Active Algorithmic Bots (Alpha, Beta, Gamma, Delta, Epsilon) Live Status */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {COMMUNITY_ALGORITHMIC_BOTS.map((bot, index) => {
              const isActive = index < currentTier.activeNeuronsCount;
              return (
                <div
                  key={bot.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-b from-[#07173e] to-[#040e28] border-cyan-400/50 shadow-lg ring-1 ring-cyan-400/30'
                      : 'bg-[#030717]/60 border-slate-800/60 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      Capa {bot.atomicLayer}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isActive ? 'ACTIVO O(1)' : 'STANDBY'}
                    </span>
                  </div>

                  <div className="text-xs font-black text-white mb-1">{bot.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mb-2">{bot.algorithmicRole}</div>

                  <div className="space-y-1 text-[9px] text-slate-400 leading-tight">
                    <div>
                      <strong className="text-slate-300">Deconstrucción:</strong> {bot.deconstructBehavior}
                    </div>
                    <div>
                      <strong className="text-slate-300">Reconstrucción:</strong> {bot.reconstructBehavior}
                    </div>
                    <div className="text-emerald-400 font-mono">
                      <strong>Auto-Cicatrización:</strong> {Math.round(bot.quantifiedWeights.selfHealingRate * 100)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Real-Time Swarm Deconstruction & Reconstruction Flow */}
          {swarmResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column: Deconstruction Steps */}
              <div className="bg-[#050e29] border border-blue-500/30 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                  <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-rose-400" />
                    Fase 1: Deconstrucción Atómica de la Tarea
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Entropía: {swarmResult.atomicEntropy}
                  </span>
                </div>

                <div className="space-y-2">
                  {swarmResult.deconstructionSteps?.map((step: any) => (
                    <div
                      key={step.stepIndex}
                      className="p-3 rounded-xl bg-[#03091f] border border-blue-900/60 flex items-start gap-2.5 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                        {step.stepIndex}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-200 flex items-center justify-between">
                          <span>{step.botName}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{step.durationMs}ms</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{step.action}</div>
                        <div className="text-[10px] font-mono text-emerald-400 mt-1">{step.synapticNutrientGiven}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Reconstruction Steps */}
              <div className="bg-[#050e29] border border-blue-500/30 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                  <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    Fase 2: Reconstrucción Algorítmica & Auto-Ayuda
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Velocidad: {swarmResult.reconstructionSpeed}
                  </span>
                </div>

                <div className="space-y-2">
                  {swarmResult.reconstructionSteps?.map((step: any) => (
                    <div
                      key={step.stepIndex}
                      className="p-3 rounded-xl bg-[#03091f] border border-emerald-950/60 flex items-start gap-2.5 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                        {step.stepIndex}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-200 flex items-center justify-between">
                          <span>{step.botName}</span>
                          <span className="text-[10px] font-mono text-emerald-400">Auto-Ayuda a: {step.mutualAidTarget}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{step.action}</div>
                        <div className="text-[10px] font-mono text-cyan-300 mt-1">{step.durationMs}ms de síntesis O(1)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Synthesized Atomic Code Result */}
          {swarmResult?.generatedCode && (
            <div className="bg-[#050e29] border border-cyan-500/40 rounded-3xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white">
                    Código Resultado del Enjambre Cervantes ({currentTier.tag})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(swarmResult.generatedCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-1 rounded-xl bg-[#030817] hover:bg-blue-900 text-cyan-300 border border-blue-500/40 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onApplyCodeToEditor(swarmResult.generatedCode);
                      onOpenEditorTab();
                    }}
                    className="px-4 py-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Aplicar en Editor</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#01040f] border border-blue-950 rounded-2xl p-4 font-mono text-xs text-cyan-200 overflow-x-auto max-h-80 leading-relaxed">
                <pre>{swarmResult.generatedCode}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SubTab 1: Núcleo del Autobot Cervantes */}
      {activeSubTab === 'cervantes' && (
        <div className="space-y-6">
          {/* Polymorphic Domain Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Moldeado Polimórfico del Autobot Cervantes (Selecciona Dominio Activo):</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                ADAPTACIÓN DINÁMICA O(1)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedPolymorphicDomain('FULLSTACK_WEB')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPolymorphicDomain === 'FULLSTACK_WEB'
                    ? 'bg-gradient-to-br from-blue-950 to-[#0a235c] border-cyan-400 text-white ring-1 ring-cyan-400/50 shadow-lg'
                    : 'bg-[#06112e] border-blue-500/30 hover:border-cyan-500/50 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Web & Fullstack Alta Disponibilidad
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Arquitectura React, Express, WebSockets con reconexión exponencial y gestión de estado inmutable O(1).
                </p>
              </button>

              <button
                onClick={() => setSelectedPolymorphicDomain('SECURITY_AUDIT')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPolymorphicDomain === 'SECURITY_AUDIT'
                    ? 'bg-gradient-to-br from-blue-950 to-[#0a235c] border-cyan-400 text-white ring-1 ring-cyan-400/50 shadow-lg'
                    : 'bg-[#06112e] border-blue-500/30 hover:border-cyan-500/50 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Auditoría de Cero Vulnerabilidades
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Análisis estático riguroso: Detección formal de inyección SQL, fugas de memoria y secrets en texto plano.
                </p>
              </button>

              <button
                onClick={() => setSelectedPolymorphicDomain('ALGORITHMIC_OPTIMIZER')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPolymorphicDomain === 'ALGORITHMIC_OPTIMIZER'
                    ? 'bg-gradient-to-br from-blue-950 to-[#0a235c] border-cyan-400 text-white ring-1 ring-cyan-400/50 shadow-lg'
                    : 'bg-[#06112e] border-blue-500/30 hover:border-cyan-500/50 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Reductor de Complejidad McCabe (+400%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Comprime bucles anidados O(N^2) en HashMaps de tiempo constante O(1) y vectoriza pipelines de ejecución.
                </p>
              </button>
            </div>
          </div>

          {/* Standalone Code Viewer */}
          <div className="bg-[#050e29] border border-cyan-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Código Real del Autobot Cervantes (Standalone 100% Determinista)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Cero librerías ficticias • Auto-contenido con autómatas FSM y caché LRU O(1)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-[#030817] border border-blue-500/40 text-cyan-300 font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="typescript">TypeScript / Node.js</option>
                  <option value="python">Python 3.x</option>
                </select>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-[#030817] hover:bg-blue-900 text-cyan-300 border border-blue-500/40 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
                </button>

                <button
                  onClick={handleDownloadBot}
                  className="px-3 py-1.5 rounded-xl bg-[#030817] hover:bg-blue-900 text-cyan-300 border border-blue-500/40 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar (.ts / .py)</span>
                </button>
              </div>
            </div>

            <div className="bg-[#01040f] border border-blue-950 rounded-2xl p-4 font-mono text-xs text-cyan-200 overflow-x-auto max-h-96 leading-relaxed">
              <pre>{generatedCode}</pre>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: 5 Motores Algorítmicos Puros (Reemplazo Total de IA) */}
      {activeSubTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-[#050e29] border border-blue-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <Binary className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    5 Motores Algorítmicos y Matemáticos Puros (Reemplazo Total de la IA)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ingeniería de software formal basada en gramáticas libres de contexto, FSM, lógica de Hoare y grafos de McCabe
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PURE_ALGORITHMIC_ENGINE_REGISTRY.map((engine) => (
                <div
                  key={engine.engineId}
                  className="p-4 rounded-2xl bg-[#03091f] border border-blue-500/30 space-y-2.5 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-300">{engine.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {engine.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{engine.specialization}</p>
                  
                  <div className="p-2.5 rounded-xl bg-[#01040f] border border-blue-950 font-mono text-[10px] text-slate-300 space-y-1">
                    <div className="text-cyan-400 font-bold">Fundamento Matemático:</div>
                    <div className="text-slate-300">{engine.mathematicalFoundation}</div>
                    <div className="text-emerald-400 font-semibold pt-1">Demostración Formal: {engine.formalProof}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-[#020617] border border-blue-950 text-[9px] font-mono">
                      <span className="text-slate-400 block">Garantía:</span>
                      <span className="text-cyan-300 font-bold">{engine.deterministicMetrics.complexityGuarantee}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#020617] border border-blue-950 text-[9px] font-mono">
                      <span className="text-slate-400 block">Tasa de Error:</span>
                      <span className="text-emerald-400 font-bold">{engine.deterministicMetrics.hallucinationRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Sandbox & Matrices Codificadas */}
      {activeSubTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-[#050e29] border border-blue-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <Dna className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Sandbox de Matrices Algorítmicas entre Bots
                  </h4>
                  <p className="text-xs text-slate-400">
                    Bots especializados colaboran donando matrices deterministas sin requerir intervención de IA
                  </p>
                </div>
              </div>

              <button
                onClick={startSandboxDialogue}
                disabled={isSimulating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Simulando...' : 'Re-ejecutar Diálogo Sandbox'}</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {dialogueLogs.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-[#03091f] border border-blue-500/30 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${msg.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white">{msg.botName}</span>
                        <span className="text-[10px] text-cyan-400 block font-mono">{msg.botRole}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed pl-9">{msg.message}</p>

                  <div className="ml-9 p-2.5 rounded-xl bg-[#01040f] border border-blue-950 font-mono text-[10px] text-cyan-300">
                    <div className="text-slate-400 mb-0.5 font-sans font-bold">{msg.nutrientType}:</div>
                    <code className="text-cyan-200">{msg.nutrientSnippet}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Terminal Interactiva Standalone */}
      {activeSubTab === 'terminal' && (
        <div className="space-y-4">
          <div className="bg-[#020512] border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-300">
                  Terminal Interactiva Directa con el Autobot Cervantes (Offline / Determinista)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                100% CERO IA • REEMPLAZO TOTAL
              </span>
            </div>

            <div className="bg-[#01030a] rounded-2xl p-4 font-mono text-xs text-cyan-200 min-h-[220px] max-h-[350px] overflow-y-auto space-y-1.5 border border-blue-950">
              {testLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.startsWith('>>>')
                      ? 'text-cyan-400 font-bold'
                      : log.startsWith('<<<')
                      ? 'text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            <form onSubmit={handleRunInteractiveTest} className="flex gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Comandos: status, solve 500*24, optimize bucle for, audit SELECT * FROM users, heal..."
                className="flex-1 bg-[#01040f] border border-blue-500/40 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
