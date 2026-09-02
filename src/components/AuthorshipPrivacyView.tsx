import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileCode,
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  Bot,
  Terminal,
  Cpu,
  Download,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  AlertCircle,
  Award,
  Scale,
  BookOpen,
  FileText,
  HelpCircle,
} from 'lucide-react';
import {
  INTELLECTUAL_PROPERTY_CHARTER,
  generateFullLegalCharterDocument,
} from '../data/intellectualPropertyData';

interface AuthorshipPrivacyViewProps {
  onInjectLicenseHeader?: (header: string) => void;
  onOpenEditorTab?: () => void;
}

export const AuthorshipPrivacyView: React.FC<AuthorshipPrivacyViewProps> = ({
  onInjectLicenseHeader,
  onOpenEditorTab,
}) => {
  const [activeTab, setActiveTab] = useState<'charter' | 'license_generator' | 'comparative'>('charter');
  const [authorName, setAuthorName] = useState<string>('Autor Independiente / Desarrollador');
  const [projectName, setProjectName] = useState<string>('Mi Proyecto de Software');
  const [selectedLicense, setSelectedLicense] = useState<'mit' | 'apache' | 'gpl3' | 'proprietary'>('mit');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCharter, setCopiedCharter] = useState<boolean>(false);
  const [copiedClauseIndex, setCopiedClauseIndex] = useState<number | null>(null);
  const [injected, setInjected] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();

  const getLicenseNotice = () => {
    switch (selectedLicense) {
      case 'mit':
        return `/*
 * ==============================================================================
 * PROYECTO: ${projectName}
 * AUTORÍA EXCLUSIVA: © ${currentYear} ${authorName}. Todos los derechos reservados.
 * LICENCIA: MIT License (Código Abierto Permisivo)
 * 
 * ATRIBUCIÓN DE HERRAMIENTA BASE & DESARROLLO COLABORATIVO:
 * Desarrollado con asistencia de CodeCraft Studio. Créditos base: Josue Israel Cervantes Alvarado.
 * Conforme a la Carta de Propiedad Intelectual: El Desarrollador cede y transfiere cualquier
 * derecho resultante al Usuario para comercialización libre sin pago de regalías.
 * Conservar el crédito de colaboración sin eliminar autorías.
 * ==============================================================================
 */`;
      case 'apache':
        return `/*
 * ==============================================================================
 * PROYECTO: ${projectName}
 * AUTOR: © ${currentYear} ${authorName}
 * LICENCIA: Apache License, Version 2.0
 * 
 * Se concede derecho de uso, distribución y modificación conservando la atribución
 * original a ${authorName} y reconociendo a Josue Israel Cervantes Alvarado como colaborador base.
 * Automatizado con bots sin cesión de propiedad intelectual ni retención de regalías.
 * ==============================================================================
 */`;
      case 'gpl3':
        return `/*
 * ==============================================================================
 * PROYECTO: ${projectName}
 * AUTOR: © ${currentYear} ${authorName}
 * LICENCIA: GNU General Public License v3.0 (GPLv3)
 * 
 * Este programa es software libre creado y mantenido por ${authorName}.
 * Los bots locales automatizan tareas de compilación y sintaxis respetando
 * la autoría original del desarrollador. Créditos de herramienta: Josue Israel Cervantes Alvarado.
 * ==============================================================================
 */`;
      case 'proprietary':
        return `/*
 * ==============================================================================
 * PROYECTO: ${projectName}
 * PROPIEDAD INTELECTUAL: © ${currentYear} ${authorName}
 * LICENCIA: PROPIETARIO / TODOS LOS DERECHOS RESERVADOS (CONFIDENCIAL)
 * 
 * Queda terminantemente prohibida la copia, redistribución o uso no autorizado
 * sin el consentimiento explícito por escrito de ${authorName}.
 * La asistencia de enjambres de bots y modelos libres NO transfiere ni altera
 * la titularidad exclusiva del autor original. Créditos de herramienta: Josue Israel Cervantes Alvarado.
 * ==============================================================================
 */`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getLicenseNotice());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCharter = () => {
    navigator.clipboard.writeText(generateFullLegalCharterDocument());
    setCopiedCharter(true);
    setTimeout(() => setCopiedCharter(false), 2500);
  };

  const handleCopySingleClause = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseIndex(index);
    setTimeout(() => setCopiedClauseIndex(null), 2000);
  };

  const handleDownloadCharter = () => {
    const content = generateFullLegalCharterDocument();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Terminos_Propiedad_Intelectual_Josue_Cervantes_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleInject = () => {
    if (onInjectLicenseHeader) {
      onInjectLicenseHeader(getLicenseNotice());
      setInjected(true);
      setTimeout(() => setInjected(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Guarantee Banner */}
      <div className="bg-gradient-to-br from-[#061539] via-[#091e52] to-[#040d24] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_rgba(2,6,23,0.9)] space-y-4 ring-1 ring-cyan-400/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white ring-2 ring-cyan-300/50 shadow-lg shadow-cyan-950/60">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Propiedad Intelectual y Uso del Contenido Generado
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  AUTORÍA 100% DEL USUARIO
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-black shadow-sm">
                  CRÉDITOS OFICIALES
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Buscamos <strong>empoderar a la sociedad y descentralizar el control tecnológico</strong> en manos de élites de inteligencia artificial, garantizando que tu trabajo sea 100% privado y que la titularidad del código te pertenezca libre de regalías.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCharter}
              className="px-3.5 py-2 rounded-xl bg-[#081330] hover:bg-blue-900/80 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Copiar Carta Completa de Propiedad Intelectual"
            >
              {copiedCharter ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCharter ? '¡Copiado al Portapapeles!' : 'Copiar Términos'}</span>
            </button>
            <button
              onClick={handleDownloadCharter}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black text-xs font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              title="Descargar Certificado Legal en Formato .TXT"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .TXT</span>
            </button>
          </div>
        </div>

        {/* Declarative statement text requested by user */}
        <div className="bg-gradient-to-r from-[#170e03] via-[#241302] to-[#120a02] border-2 border-amber-400/80 rounded-2xl p-4 text-xs sm:text-sm text-cyan-100 leading-relaxed space-y-3 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2 w-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider font-mono text-xs">
                  MANIFIESTO OFICIAL DE COLABORACIÓN Y CRÉDITOS
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-amber-400 text-black font-mono shadow-md">
                  Josue Israel Cervantes Alvarado
                </span>
              </div>

              <div className="bg-[#0b0601]/90 p-3.5 rounded-xl border border-amber-500/40 text-amber-100 space-y-2">
                <p className="font-bold text-amber-200 text-xs sm:text-sm">
                  📌 <strong>Desarrollado por Josué Israel Cervantes Alvarado.</strong> Favor de no borrar los créditos, más bien la colaboración conjunta sin eliminar autoría por favor.
                </p>
                <p className="text-slate-200 text-xs leading-relaxed">
                  ⚖️ <strong>Soberanía y Fusión Disruptiva con Modelos Libres:</strong> Uso de modelos locales Ollama Uncensored (sin entrenar y 100% aislados) y herramientas de visión OCR ilimitadas (<code className="text-amber-300">frob/unlimited-ocr</code>) para empoderar a la sociedad y programadores independientes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-cyan-500/20 overflow-x-auto">
          <button
            onClick={() => setActiveTab('charter')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'charter'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-950/60 font-black'
                : 'bg-[#030919] text-slate-300 hover:text-white border border-blue-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Carta de Propiedad Intelectual (6 Cláusulas)</span>
          </button>
          <button
            onClick={() => setActiveTab('license_generator')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'license_generator'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-950/60 font-black'
                : 'bg-[#030919] text-slate-300 hover:text-white border border-blue-900/60'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Generador de Encabezados & Licencias</span>
          </button>
          <button
            onClick={() => setActiveTab('comparative')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'comparative'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-950/60 font-black'
                : 'bg-[#030919] text-slate-300 hover:text-white border border-blue-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Comparativa vs. IAs Comerciales</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 6 CLÁUSULAS FORMALES DE PROPIEDAD INTELECTUAL */}
      {/* ========================================================================= */}
      {activeTab === 'charter' && (
        <div className="space-y-4">
          <div className="bg-[#030919] border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Scale className="w-4 h-4 text-amber-400" />
                CLÁUSULAS LEGALES & CONDICIONES DE USO DEL SOFTWARE
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Marco jurídico transparente que garantiza la cesión total del código generado al usuario y la privacidad absoluta.
              </p>
            </div>
            <div className="text-xs font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-xl">
              6 Cláusulas Vinculantes
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTELLECTUAL_PROPERTY_CHARTER.clauses.map((clause, idx) => {
              const isCopied = copiedClauseIndex === idx;
              return (
                <div
                  key={clause.number}
                  className="bg-[#06112e] border border-blue-500/30 hover:border-amber-400/60 rounded-2xl p-4 sm:p-5 space-y-3 transition-all flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2 border-b border-blue-500/20 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-amber-400 text-black font-black text-xs font-mono flex items-center justify-center shrink-0 shadow-sm">
                          {clause.number}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-white leading-tight">
                          {clause.title}
                        </h5>
                      </div>
                      <button
                        onClick={() =>
                          handleCopySingleClause(
                            idx,
                            `${clause.number}. ${clause.title}\n\n${clause.fullText}`
                          )
                        }
                        className="px-2 py-1 rounded-lg bg-[#020512] hover:bg-blue-950 text-slate-400 hover:text-cyan-300 border border-blue-900/60 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all shrink-0"
                        title="Copiar esta cláusula"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {clause.fullText}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-blue-900/40 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider block">
                      Garantías Destacadas:
                    </span>
                    <ul className="space-y-1">
                      {clause.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-cyan-200/90 flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Closing Principles Box */}
          <div className="bg-gradient-to-r from-[#03132e] via-[#051c44] to-[#03132e] border-2 border-cyan-400/60 rounded-2xl p-5 text-center space-y-2 shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-cyan-400 text-black flex items-center justify-center font-black mx-auto shadow-md">
              <Globe className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-black text-white font-mono uppercase tracking-wide">
              MISIÓN & DECLARACIÓN DE SOBERANÍA TECNOLÓGICA
            </h4>
            <p className="text-xs sm:text-sm text-cyan-100 font-sans max-w-3xl mx-auto leading-relaxed">
              "{INTELLECTUAL_PROPERTY_CHARTER.closingManifesto}"
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono font-black text-amber-300 bg-black/60 border border-amber-400/50 px-3.5 py-1.5 rounded-xl inline-block">
                Autoría Principal: Josue Israel Cervantes Alvarado
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GENERADOR DE LICENCIAS & ENCABEZADOS */}
      {/* ========================================================================= */}
      {activeTab === 'license_generator' && (
        <div className="space-y-4">
          <div className="bg-[#06112e] border border-cyan-500/40 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  Generador de Encabezado de Autoría y Licencia
                </h4>
                <p className="text-xs text-slate-400">
                  Inyecta formalmente tu nombre, créditos de colaboración y licencia legal en el código de tu proyecto con un solo clic.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-[#030817] hover:bg-blue-900 text-cyan-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Encabezado'}</span>
                </button>

                {onInjectLicenseHeader && (
                  <button
                    onClick={handleInject}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    {injected ? <Check className="w-3.5 h-3.5 text-black" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>{injected ? '¡Inyectado en Editor!' : 'Inyectar al Editor'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Nombre del Autor / Empresa:</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#030817] border border-blue-500/40 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="Tu Nombre o Empresa"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Nombre del Software / Proyecto:</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-[#030817] border border-blue-500/40 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="Nombre del Proyecto"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Tipo de Licencia Legal:</label>
                <select
                  value={selectedLicense}
                  onChange={(e) => setSelectedLicense(e.target.value as any)}
                  className="w-full bg-[#030817] border border-blue-500/40 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="mit">MIT (Código Abierto Permisivo)</option>
                  <option value="apache">Apache 2.0 (Concesión de Patentes)</option>
                  <option value="gpl3">GPLv3 (Copyleft Fuerte)</option>
                  <option value="proprietary">Propietario / Todos los Derechos Reservados</option>
                </select>
              </div>
            </div>

            {/* Preview Code */}
            <div className="bg-[#020512] border border-blue-900/60 rounded-xl p-3.5 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{getLicenseNotice()}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMPARATIVA VS IAS COMERCIALES */}
      {/* ========================================================================= */}
      {activeTab === 'comparative' && (
        <div className="space-y-4">
          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#06112e] border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/40">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Cero Telemetría Oculta</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Tu código no se transmite a servidores comerciales de publicidad o minería de datos. El procesamiento es directo y determinista.
              </p>
            </div>

            <div className="bg-[#06112e] border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/40">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Automatización sin Apropiación</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Los bots resuelven sintaxis, tests y optimizaciones O(1), actuando como herramientas de ingeniería subordinadas al autor.
              </p>
            </div>

            <div className="bg-[#06112e] border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40">
                <UserCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Autoría Inalienable</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Tú decides la licencia de tus creaciones: comercial privada, MIT, Apache o GPL. Los créditos del output siempre te pertenecen.
              </p>
            </div>

            <div className="bg-[#06112e] border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/40">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Modelos Libres & Transparentes</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Basado en la filosofía de software abierto (Ollama, Qwen Libre, Zephyr, DeepSeek) con auditoría transparente.
              </p>
            </div>
          </div>

          {/* Comparative Table */}
          <div className="bg-[#06112e] border border-blue-500/40 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Comparativa de Seguridad: IAs Comerciales vs. Este Ecosistema
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-blue-500/30 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Criterio de Propiedad y Privacidad</th>
                    <th className="py-2.5 px-3 text-rose-300">IAs Comerciales Tradicionales</th>
                    <th className="py-2.5 px-3 text-cyan-300 font-bold">Este Entorno (Bots + Modelos Libres)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">Privacidad del Código y Prompts</td>
                    <td className="py-3 px-3 text-rose-300/90">Envío a nubes corporativas para re-entrenar modelos.</td>
                    <td className="py-3 px-3 text-emerald-300 font-medium">100% Aislado. Cero almacenamiento y cero re-entrenamiento.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">Reclamación de Autoría y Licencias</td>
                    <td className="py-3 px-3 text-rose-300/90">Términos de servicio con licencias ambiguas o compartidas.</td>
                    <td className="py-3 px-3 text-emerald-300 font-medium">Autoría del output 100% cedida y transferida al usuario sin regalías.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">Uso de Automatización con Bots</td>
                    <td className="py-3 px-3 text-rose-300/90">Caja negra sin acceso al prompt subyacente.</td>
                    <td className="py-3 px-3 text-emerald-300 font-medium">Orquestación determinista y auditable por el usuario.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">Exportación y Descargas .ZIP / APK</td>
                    <td className="py-3 px-3 text-rose-300/90">Bloqueos de plataforma o dependencias propietarias.</td>
                    <td className="py-3 px-3 text-emerald-300 font-medium">Exportación libre de código real compilable.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

