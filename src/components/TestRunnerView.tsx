import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Clock, Plus, Code, RotateCcw, AlertTriangle, ShieldCheck, FileCode } from 'lucide-react';
import { TestCase, TestSuiteResult } from '../types';

interface TestRunnerViewProps {
  testSuite: TestSuiteResult | null;
  onRunTests: (tests: TestCase[]) => void;
  isRunning: boolean;
  language: string;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({
  testSuite,
  onRunTests,
  isRunning,
  language,
}) => {
  const [showCode, setShowCode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');
  const [customName, setCustomName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  if (!testSuite) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400">
          <Play className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-zinc-200">No hay pruebas automáticas generadas aún</h4>
        <p className="text-xs text-zinc-400 max-w-md">
          Haz clic en <strong className="text-cyan-400">&quot;Pruebas Automáticas&quot;</strong> en el panel superior para generar y ejecutar casos de prueba (camino feliz, valores frontera y casos de borde) para tu código.
        </p>
      </div>
    );
  }

  const { tests, totalCount, passedCount, failedCount, overallDurationMs, summary, testFrameworkCode } = testSuite;
  const passPercentage = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const handleAddCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customInput || !customExpected) return;

    const newTest: TestCase = {
      id: `custom_${Date.now()}`,
      name: customName,
      description: 'Caso de prueba personalizado por el usuario',
      input: customInput,
      expectedOutput: customExpected,
      isEdgeCase: false,
    };

    const updatedTests = [...tests, newTest];
    setShowAddModal(false);
    setCustomName('');
    setCustomInput('');
    setCustomExpected('');
    onRunTests(updatedTests);
  };

  return (
    <div className="space-y-5">
      {/* Header and Progress Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-zinc-100">
                Suite de Pruebas Automáticas ({passedCount}/{totalCount} Pasadas)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{summary}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Caso</span>
            </button>

            <button
              onClick={() => setShowCode(!showCode)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showCode ? 'Ocultar Código' : 'Ver Código de Tests'}</span>
            </button>

            <button
              onClick={() => onRunTests(tests)}
              disabled={isRunning}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all disabled:opacity-50 active:scale-95"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Ejecutando...' : 'Re-ejecutar Pruebas'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Status Pill */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 font-semibold">Tasa de Aprobación: {passPercentage}%</span>
            <span className="text-zinc-400">Duración: {overallDurationMs} ms</span>
          </div>

          <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-500 ${
                failedCount === 0 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-rose-500'
              }`}
              style={{ width: `${passPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Code of Test Suite view (optional toggle) */}
      {showCode && testFrameworkCode && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Código de la Suite de Pruebas Unitarias ({language})
            </span>
          </div>
          <pre className="p-4 font-mono text-xs text-cyan-300/90 leading-6 overflow-auto max-h-[300px]">
            <code>{testFrameworkCode}</code>
          </pre>
        </div>
      )}

      {/* Test Cases List */}
      <div className="space-y-3">
        {tests.map((test, idx) => {
          const isPassed = test.passed ?? true;

          return (
            <div
              key={test.id || idx}
              className={`p-4 rounded-xl border font-mono text-xs transition-all shadow-md ${
                isPassed
                  ? 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-800/80 hover:border-rose-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="font-bold text-zinc-100">{test.name}</span>
                  {test.isEdgeCase && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-sans font-semibold">
                      Caso de Borde
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                  {test.executionTimeMs !== undefined && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {test.executionTimeMs} ms
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isPassed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isPassed ? 'PASÓ' : 'FALLÓ'}
                  </span>
                </div>
              </div>

              {test.description && (
                <p className="text-[11px] text-zinc-400 font-sans mb-3">{test.description}</p>
              )}

              {/* In / Out / Actual Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Entrada (Input):</span>
                  <span className="text-zinc-300 break-all">{test.input}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Esperado (Expected):</span>
                  <span className="text-emerald-400 break-all">{test.expectedOutput}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Obtenido (Actual):</span>
                  <span className={isPassed ? 'text-emerald-400 break-all' : 'text-rose-400 break-all font-bold'}>
                    {test.actualOutput || test.expectedOutput}
                  </span>
                </div>
              </div>

              {test.errorMessage && (
                <div className="mt-2 p-2 rounded bg-rose-900/30 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{test.errorMessage}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-zinc-100">Añadir Caso de Prueba Personalizado</h4>
            <form onSubmit={handleAddCustomTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nombre del Test:</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ej: Prueba con saldo negativo"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Valores de Entrada (Input):</label>
                <input
                  type="text"
                  required
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Ej: calcular_descuento(-50, 'PROMO', false)"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Resultado Esperado (Expected Output):</label>
                <input
                  type="text"
                  required
                  value={customExpected}
                  onChange={(e) => setCustomExpected(e.target.value)}
                  placeholder="Ej: ValueError('El precio no puede ser negativo')"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
                >
                  Guardar y Ejecutar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
