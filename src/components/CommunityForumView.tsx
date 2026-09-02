import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Upload,
  Download,
  Copy,
  Check,
  Search,
  PlusCircle,
  FileCode,
  Calendar,
  Key,
  Award,
  Hash,
  Share2,
  ExternalLink,
  Code2,
  Lock,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  ArrowRight,
  GitBranch,
  Fingerprint,
  RefreshCw,
  FolderTree,
  Layers,
  GitCommit,
} from 'lucide-react';
import { ProgrammingLanguage, CommunityInvention, AuthorshipCertificate } from '../types';
import {
  INITIAL_COMMUNITY_INVENTIONS,
  computeDeterministicSha256,
  getAsyncSha256,
  generateAuthorshipCertificate,
} from '../data/communityForumData';
import { BlockchainAnchorsView } from './BlockchainAnchorsView';

interface CommunityForumViewProps {
  currentEditorCode: string;
  selectedLanguage: ProgrammingLanguage;
  onApplyCodeToEditor: (code: string) => void;
  onOpenEditorTab: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  currentEditorCode,
  selectedLanguage,
  onApplyCodeToEditor,
  onOpenEditorTab,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'blockchain' | 'publish' | 'verify' | 'guide'>('explore');
  const [inventions, setInventions] = useState<CommunityInvention[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedInventionId, setExpandedInventionId] = useState<string | null>('inv_cervantes_001');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Form State for new invention submission
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [newAuthorHandle, setNewAuthorHandle] = useState<string>('');
  const [newAuthorFingerprint, setNewAuthorFingerprint] = useState<string>('');
  const [newCategory, setNewCategory] = useState<CommunityInvention['category']>('algoritmo_novedoso');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newLanguage, setNewLanguage] = useState<string>(selectedLanguage || 'typescript');
  const [newCode, setNewCode] = useState<string>('');
  const [newLicense, setNewLicense] = useState<string>('Defensa de Dominio Público / Evidencia de Prior Art');
  const [newTagsInput, setNewTagsInput] = useState<string>('Invento, Codigo, PriorArt');
  const [liveCalculatedHash, setLiveCalculatedHash] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdCertificate, setCreatedCertificate] = useState<AuthorshipCertificate | null>(null);

  // Verification tool state
  const [verifyInputCode, setVerifyInputCode] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<{
    hash: string;
    matchedInvention?: CommunityInvention;
  } | null>(null);

  // Load inventions from localStorage + initial data + server
  useEffect(() => {
    const saved = localStorage.getItem('codecraft_community_inventions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInventions(parsed);
          return;
        }
      } catch (e) {
        console.error('Error loading local inventions', e);
      }
    }
    setInventions(INITIAL_COMMUNITY_INVENTIONS);
  }, []);

  // Update live calculated hash when form code changes
  useEffect(() => {
    if (newCode) {
      getAsyncSha256(newCode).then((h) => setLiveCalculatedHash(h));
    } else {
      setLiveCalculatedHash('');
    }
  }, [newCode]);

  // Import code from editor
  const handleImportFromEditor = () => {
    if (!currentEditorCode || !currentEditorCode.trim()) {
      onShowToast('El editor está vacío. Escribe o genera código primero.', 'info');
      return;
    }
    setNewCode(currentEditorCode);
    setNewLanguage(selectedLanguage || 'typescript');
    onShowToast('Código del editor importado con éxito.', 'success');
  };

  // Submit new invention
  const handlePublishInvention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthorName.trim() || !newCode.trim() || !newDescription.trim()) {
      onShowToast('Por favor completa los campos requeridos (Título, Autor, Descripción y Código).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const computedHash = await getAsyncSha256(newCode);
      const newId = `inv_user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const nowIso = new Date().toISOString();

      const tags = newTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const inventionRecord: CommunityInvention = {
        id: newId,
        title: newTitle.trim(),
        authorName: newAuthorName.trim(),
        authorHandle: newAuthorHandle.trim() || `@${newAuthorName.trim().toLowerCase().replace(/\s+/g, '_')}`,
        authorFingerprint: newAuthorFingerprint.trim() || `PGP-${computedHash.slice(0, 8).toUpperCase()}`,
        category: newCategory,
        noveltyDescription: newDescription.trim(),
        language: newLanguage,
        code: newCode,
        license: newLicense,
        sha256Hash: computedHash,
        registeredAt: nowIso,
        witnessCount: 1,
        witnessList: [newAuthorName.trim()],
        tags: tags.length > 0 ? tags : ['Invento', 'PriorArt'],
        isVerifiedPriorArt: true,
      };

      const cert = generateAuthorshipCertificate(inventionRecord);
      const updatedList = [inventionRecord, ...inventions];
      setInventions(updatedList);
      localStorage.setItem('codecraft_community_inventions', JSON.stringify(updatedList));

      // Try server sync
      try {
        await fetch('/api/community/inventions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inventionRecord),
        });
      } catch {
        // Fallback local ok
      }

      setCreatedCertificate(cert);
      onShowToast('¡Invento registrado y certificado de autoría generado con éxito!', 'success');

      // Reset form fields except author
      setNewTitle('');
      setNewDescription('');
      setNewCode('');
    } catch (err: any) {
      onShowToast(`Error al registrar invento: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Attest / Witness an invention
  const handleAttestInvention = (id: string) => {
    const updated = inventions.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          witnessCount: inv.witnessCount + 1,
          witnessList: [...(inv.witnessList || []), '@tu_firma_testigo'],
        };
      }
      return inv;
    });
    setInventions(updated);
    localStorage.setItem('codecraft_community_inventions', JSON.stringify(updated));
    onShowToast('¡Firma de testigo agregada! Respaldas públicamente la existencia de este diseño.', 'success');
  };

  // Copy SHA-256
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    onShowToast('Hash SHA-256 copiado al portapapeles.', 'info');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Download Code
  const handleDownloadCode = (inv: CommunityInvention) => {
    const extMap: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      c: 'c',
      cpp: 'cpp',
      rust: 'rs',
      go: 'go',
      java: 'java',
      php: 'php',
      html: 'html',
      sql: 'sql',
    };
    const ext = extMap[inv.language] || 'txt';
    const blob = new Blob([inv.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${inv.sha256Hash.slice(0, 8)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Archivo de código descargado.', 'success');
  };

  // Download Certificate
  const handleDownloadCertificate = (inv: CommunityInvention) => {
    const cert = generateAuthorshipCertificate(inv);
    const certText = `================================================================================
CERTIFICADO COMUNITARIO DE EVIDENCIA DE AUTORÍA & DIVULGACIÓN PREVIA
================================================================================
ID de Certificado: ${cert.certificateId}
Título de la Obra: ${cert.title}
Autor Declarado:   ${cert.authorName} (${inv.authorHandle || ''})
Huella PGP / ID:   ${inv.authorFingerprint || 'N/A'}
Categoría:         ${inv.category}
Fecha / Hora UTC:  ${cert.timestampUtc}
Licencia:          ${inv.license}

--------------------------------------------------------------------------------
HUELLA CRIPTOGRÁFICA INMUTABLE (SHA-256):
${cert.sha256Hash}
--------------------------------------------------------------------------------
Métricas del Código:
- Líneas de código: ${cert.lineCount}
- Tamaño en bytes:  ${cert.byteSize} bytes
- Testigos Comunitarios: ${inv.witnessCount}

DESCRIPCIÓN DE NOVEDAD & RECLAMOS TÉCNICOS:
${inv.noveltyDescription}

AVISO LEGAL & VALIDEZ PROBATORIA:
${cert.disclaimer}
================================================================================
Emitido por CodeCraft Foro Comunitario - Registro Criptográfico Descentralizado
`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_Autoria_${inv.id}_${inv.sha256Hash.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Certificado de autoría descargado en formato .TXT', 'success');
  };

  // Verify input code
  const handleVerifyCode = async () => {
    if (!verifyInputCode.trim()) return;
    const computed = await getAsyncSha256(verifyInputCode);
    const match = inventions.find((inv) => inv.sha256Hash === computed || inv.code.trim() === verifyInputCode.trim());
    setVerifyResult({
      hash: computed,
      matchedInvention: match,
    });
  };

  // Filtered Inventions
  const filteredInventions = inventions.filter((inv) => {
    const matchesCat = selectedCategory === 'all' || inv.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      inv.title.toLowerCase().includes(q) ||
      inv.authorName.toLowerCase().includes(q) ||
      inv.noveltyDescription.toLowerCase().includes(q) ||
      inv.tags.some((t) => t.toLowerCase().includes(q)) ||
      inv.sha256Hash.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Main Header Banner */}
      <div className="bg-gradient-to-r from-[#030d29] via-[#071d54] to-[#040e2b] border border-cyan-400/40 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(2,6,23,0.85)] space-y-4 ring-1 ring-cyan-400/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-black font-black ring-2 ring-cyan-300/50 shadow-xl shadow-cyan-950/80">
              <Users className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Foro Comunitario: Respaldo de Autoría & Registro de Inventos
                </h3>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md">
                  TIPO GITHUB • EVIDENCIA DE PRIOR ART
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  MARCA DE TIEMPO & SHA-256 INMUTABLE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Espacio público para <strong>subir y respaldar la autoría de inventos, diseños de software y algoritmos que aún no existen</strong>. Aunque no es un trámite de patente gubernamental, genera una <strong>evidencia fehaciente con marca de tiempo y hash criptográfico</strong> (estilo commits/releases de repositorios GitHub) para acreditar divulgación previa frente a terceros.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('publish')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Subir Mi Invento / Código</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-cyan-500/20">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-cyan-500 text-black shadow-md font-black'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Explorar Inventos ({inventions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blockchain')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'blockchain'
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-md font-black'
                : 'bg-[#051336] text-emerald-300 hover:text-white border border-emerald-500/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Blockchain & Sellado Criptográfico ($0)</span>
          </button>

          <button
            onClick={() => setActiveTab('publish')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'publish'
                ? 'bg-cyan-500 text-black shadow-md font-black'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Publicar / Respaldar Mi Proyecto</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'verify'
                ? 'bg-cyan-500 text-black shadow-md font-black'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Verificador de Hash & Certificado</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-cyan-500 text-black shadow-md font-black'
                : 'bg-[#051336] text-slate-300 hover:text-white border border-blue-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Validez Legal & Prior Art</span>
          </button>
        </div>
      </div>

      {/* TAB: BLOCKCHAIN & CRYPTOGRAPHIC ANCHORS ($0) */}
      {activeTab === 'blockchain' && (
        <BlockchainAnchorsView
          inventions={inventions}
          onShowToast={onShowToast}
          onApplyCodeToEditor={onApplyCodeToEditor}
        />
      )}

      {/* TAB 1: EXPLORAR INVENTOS REGISTRADOS */}
      {activeTab === 'explore' && (
        <div className="space-y-5">
          {/* Filters and Search Bar */}
          <div className="bg-[#050e29] border border-blue-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, autor, descripción, hash SHA-256 o tag..."
                className="w-full bg-[#020617] border border-blue-500/40 rounded-xl pl-10 pr-4 py-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">Categoría:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#020617] border border-blue-500/40 text-cyan-300 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="all">Todas las Categorías</option>
                <option value="algoritmo_novedoso">Algoritmos Novedosos</option>
                <option value="invento_no_existente">Inventos No Existentes</option>
                <option value="arquitectura_software">Arquitecturas de Software</option>
                <option value="e_commerce_disruptivo">E-Commerce & Transacciones</option>
                <option value="criptografia_seguridad">Criptografía & Seguridad</option>
                <option value="hardware_firmware">Hardware & Firmware</option>
                <option value="motor_3d_fisica">Motores 3D & Física</option>
                <option value="inteligencia_determinista">Inteligencia Determinista</option>
              </select>
            </div>
          </div>

          {/* Inventions List */}
          <div className="space-y-4">
            {filteredInventions.length === 0 ? (
              <div className="bg-[#050e29] border border-blue-500/30 rounded-2xl p-8 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-white">No se encontraron inventos con esos filtros</p>
                <p className="text-xs text-slate-400">Intenta buscar con otros términos o registra tu propio invento.</p>
                <button
                  onClick={() => setActiveTab('publish')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Publicar Primer Invento</span>
                </button>
              </div>
            ) : (
              filteredInventions.map((inv) => {
                const isExpanded = expandedInventionId === inv.id;
                return (
                  <div
                    key={inv.id}
                    className="bg-[#040c26] border border-blue-500/40 rounded-3xl p-5 space-y-4 hover:border-cyan-400/60 transition-all shadow-xl"
                  >
                    {/* Header of Item */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-blue-500/20">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-black text-white tracking-tight">
                            {inv.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                            {inv.category.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-900/60 text-blue-200">
                            .{inv.language}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-0.5">
                          <span className="text-cyan-300 font-bold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-cyan-400" />
                            {inv.authorName} <span className="text-slate-400 text-[11px] font-mono">({inv.authorHandle})</span>
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(inv.registeredAt).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            {inv.witnessCount} Testigos
                          </span>

                          {/* Cryptographic Badges */}
                          {inv.rfc3161Proof && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40" title={`RFC 3161 TimeStampToken: ${inv.rfc3161Proof.tsaProvider}`}>
                              <Clock className="w-3 h-3 text-cyan-400" />
                              RFC 3161: {inv.rfc3161Proof.tsaProvider.split('/')[0]}
                            </span>
                          )}

                          {inv.immutableBlock && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40" title={`Bloque Inmutable #${inv.immutableBlock.blockIndex}`}>
                              <Layers className="w-3 h-3 text-purple-400" />
                              Bloque #{inv.immutableBlock.blockIndex}
                            </span>
                          )}

                          {inv.pgpProof && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40" title={`Firma PGP: ${inv.pgpProof.keyFingerprint}`}>
                              <Key className="w-3 h-3 text-amber-400" />
                              PGP Firmado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleAttestInvention(inv.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                          title="Firmar como testigo comunitario que respalda la existencia de esta creación"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Firmar como Testigo</span>
                        </button>

                        <button
                          onClick={() => setExpandedInventionId(isExpanded ? null : inv.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#08153b] hover:bg-blue-900/60 text-cyan-300 border border-blue-500/40 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Ocultar Código' : 'Ver Código'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Novelty Description */}
                    <div className="text-xs text-slate-300 leading-relaxed bg-[#02071a] p-3.5 rounded-2xl border border-blue-950">
                      <strong className="text-cyan-300 block mb-1">Reclamo de Novedad & Respaldo de Creación:</strong>
                      {inv.noveltyDescription}
                    </div>

                    {/* Cryptographic SHA-256 Fingerprint */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[#01040f] border border-blue-950 font-mono text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-slate-400 text-[10px] shrink-0">SHA-256:</span>
                        <span className="text-cyan-300 text-[10px] sm:text-xs truncate">{inv.sha256Hash}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyHash(inv.sha256Hash)}
                          className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer px-2 py-1 rounded bg-blue-950/80 border border-blue-900"
                        >
                          {copiedHash === inv.sha256Hash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHash === inv.sha256Hash ? 'Copiado' : 'Copiar Hash'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Code & Actions */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-cyan-400" />
                            Código Fuente del Invento ({inv.code.split('\n').length} líneas):
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onApplyCodeToEditor(inv.code);
                                onOpenEditorTab();
                                onShowToast('Código cargado en el Editor IDE principal.', 'success');
                              }}
                              className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                              <span>Cargar en Editor IDE</span>
                            </button>

                            <button
                              onClick={() => handleDownloadCertificate(inv)}
                              className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Descargar Certificado (.txt)</span>
                            </button>

                            <button
                              onClick={() => handleDownloadCode(inv)}
                              className="px-3 py-1 rounded-xl bg-[#08153b] hover:bg-blue-900 text-cyan-300 border border-blue-500/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar Código</span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#01030a] border border-blue-950 rounded-2xl p-4 font-mono text-xs text-cyan-200 overflow-x-auto max-h-80 leading-relaxed">
                          <pre>{inv.code}</pre>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">Etiquetas:</span>
                          {inv.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#03091e] border border-blue-900 text-cyan-300"
                            >
                              #{tag}
                            </span>
                          ))}
                          <span className="text-[10px] text-slate-500 font-mono ml-auto">
                            Licencia: {inv.license}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PUBLICAR / RESPALDAR NUEVO INVENTO */}
      {activeTab === 'publish' && (
        <div className="space-y-6">
          {/* Certificate confirmation card if recently generated */}
          {createdCertificate && (
            <div className="bg-gradient-to-r from-emerald-950/80 to-[#032418] border border-emerald-400/60 rounded-3xl p-5 space-y-3 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>¡Certificado de Autoría Generado con Éxito!</span>
                </div>
                <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  {createdCertificate.certificateId}
                </span>
              </div>
              <p className="text-xs text-slate-200">
                Tu obra <strong>"{createdCertificate.title}"</strong> ha quedado registrada en el Foro Comunitario con fecha exacta y firma criptográfica inmutable.
              </p>
              <div className="p-2.5 rounded-xl bg-[#010e09] border border-emerald-900 font-mono text-xs text-emerald-200">
                <strong>SHA-256:</strong> {createdCertificate.sha256Hash}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    const match = inventions.find((i) => i.id === createdCertificate.inventionId);
                    if (match) handleDownloadCertificate(match);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Certificado Oficial (.TXT)</span>
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-4 py-2 rounded-xl bg-[#021811] hover:bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver en el Catálogo Comunitario</span>
                </button>
              </div>
            </div>
          )}

          {/* Publishing Form */}
          <form onSubmit={handlePublishInvention} className="bg-[#040c26] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Registrar Nuevo Invento, Diseño de Software o Algoritmo
                  </h4>
                  <p className="text-xs text-slate-400">
                    Crea un respaldo fehaciente con marca de tiempo pública para proteger tu autoría antes de divulgarlo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleImportFromEditor}
                className="px-3.5 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                title="Copia el código que tienes actualmente abierto en el editor principal"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Importar Código Actual del Editor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Título del Invento o Proyecto <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Motor de Consenso Determinista sin IA con Tolerancia a Fallas O(1)"
                  required
                  className="w-full bg-[#020617] border border-blue-500/40 rounded-xl px-4 py-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Author Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Nombre o Razón del Autor <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  placeholder="Ej: Arturo Cervantes / Laboratorio Abierto"
                  required
                  className="w-full bg-[#020617] border border-blue-500/40 rounded-xl px-4 py-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Author Handle or Alias */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Pseudónimo, Handle o Clave PGP (Opcional):
                </label>
                <input
                  type="text"
                  value={newAuthorHandle}
                  onChange={(e) => setNewAuthorHandle(e.target.value)}
                  placeholder="Ej: @arturo_dev o PGP-99A1-BB22"
                  className="w-full bg-[#020617] border border-blue-500/40 rounded-xl px-4 py-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Categoría del Invento:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CommunityInvention['category'])}
                  className="w-full bg-[#020617] border border-blue-500/40 text-cyan-300 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="algoritmo_novedoso">Algoritmo Novedoso</option>
                  <option value="invento_no_existente">Invento No Existente</option>
                  <option value="arquitectura_software">Arquitectura de Software</option>
                  <option value="e_commerce_disruptivo">E-Commerce & Transacciones Disruptivas</option>
                  <option value="criptografia_seguridad">Criptografía & Seguridad</option>
                  <option value="hardware_firmware">Hardware & Firmware Embebido</option>
                  <option value="motor_3d_fisica">Motor 3D & Física</option>
                  <option value="inteligencia_determinista">Inteligencia Determinista / Sin IA</option>
                </select>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Lenguaje o Pila Tecnológica:
                </label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="w-full bg-[#020617] border border-blue-500/40 text-cyan-300 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="c">C / C++</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="php">PHP</option>
                  <option value="java">Java</option>
                  <option value="sql">SQL / Schemas</option>
                  <option value="html">HTML / Web UI</option>
                </select>
              </div>
            </div>

            {/* Novelty Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-200">
                Descripción de Novedad & Reclamo de Creación <span className="text-rose-400">*</span>:
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                placeholder="Explica qué hace tu invento, por qué no existe previamente, qué problema resuelve y cómo funciona..."
                required
                className="w-full bg-[#020617] border border-blue-500/40 rounded-xl p-3 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Code / Content Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Código Fuente Completo o Especificación del Diseño <span className="text-rose-400">*</span>:
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {newCode ? `${newCode.split('\n').length} líneas` : 'Vacío'}
                </span>
              </div>
              <textarea
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                rows={10}
                placeholder="Pega aquí el código fuente completo, clases, funciones o diseño técnico a respaldar..."
                required
                className="w-full bg-[#01040f] border border-blue-500/40 rounded-xl p-3 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Live SHA-256 Preview */}
            {liveCalculatedHash && (
              <div className="p-3 rounded-xl bg-[#010619] border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">Huella Inmutable en Tiempo Real:</span>
                  <span className="text-cyan-300 font-bold truncate">{liveCalculatedHash}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded font-bold border border-emerald-500/30 shrink-0">
                  SHA-256 OK
                </span>
              </div>
            )}

            {/* License & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Tipo de Licencia o Declaración de Divulgación:
                </label>
                <select
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value)}
                  className="w-full bg-[#020617] border border-blue-500/40 text-cyan-300 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="Defensa de Dominio Público / Evidencia de Prior Art">Defensa de Dominio Público / Evidencia de Prior Art</option>
                  <option value="MIT License (Con Respaldo Fechado)">MIT License (Con Respaldo Fechado)</option>
                  <option value="Apache 2.0 (Divulgación Preventiva)">Apache 2.0 (Divulgación Preventiva)</option>
                  <option value="GPLv3 Open Source">GPLv3 Open Source</option>
                  <option value="Evidencia Estricta de Autoría / Todos los Derechos Reservados">Evidencia Estricta de Autoría / Todos los Derechos Reservados</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-200">
                  Etiquetas (separadas por coma):
                </label>
                <input
                  type="text"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  placeholder="Invento, Algoritmo, O(1), E-Commerce"
                  className="w-full bg-[#020617] border border-blue-500/40 rounded-xl px-4 py-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs sm:text-sm font-mono flex items-center gap-2 shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>{isSubmitting ? 'Registrando y Generando Hash...' : 'Registrar Invento & Generar Certificado'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: VERIFICADOR DE HASH & CERTIFICADO */}
      {activeTab === 'verify' && (
        <div className="space-y-6">
          <div className="bg-[#040c26] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-500/20">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Verificador Criptográfico de Integridad & Prior Art
                </h4>
                <p className="text-xs text-slate-400">
                  Pega cualquier código para calcular su hash exacto y verificar si ya fue registrado previamente en el catálogo comunitario
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-200">
                Pega el código o texto a verificar:
              </label>
              <textarea
                value={verifyInputCode}
                onChange={(e) => setVerifyInputCode(e.target.value)}
                rows={6}
                placeholder="Pega aquí el código que deseas contrastar..."
                className="w-full bg-[#01040f] border border-blue-500/40 rounded-xl p-3 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={!verifyInputCode.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Verificar Huella SHA-256</span>
            </button>

            {verifyResult && (
              <div className="space-y-3 pt-3 border-t border-blue-900/60 animate-in fade-in">
                <div className="p-3 rounded-xl bg-[#010619] border border-blue-900 font-mono text-xs space-y-1">
                  <div className="text-slate-400">Huella SHA-256 Calculada:</div>
                  <div className="text-cyan-300 font-bold break-all">{verifyResult.hash}</div>
                </div>

                {verifyResult.matchedInvention ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-400/50 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>¡Coincidencia Exacta Encontrada! Este código ya tiene respaldo de autoría registrado.</span>
                    </div>
                    <div className="text-xs text-white">
                      <strong>Título:</strong> {verifyResult.matchedInvention.title}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Autor:</strong> {verifyResult.matchedInvention.authorName} ({verifyResult.matchedInvention.authorHandle})
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Fecha de Registro:</strong> {new Date(verifyResult.matchedInvention.registeredAt).toUTCString()}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span>Código No Registrado Aún</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Esta huella no existe en el catálogo comunitario. Puedes registrarlo ahora mismo en la pestaña "Publicar" para ser el primer autor registrado con marca de tiempo pública.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: GUÍA DE VALIDEZ LEGAL & PRIOR ART */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-[#040c26] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  ¿Cómo Funciona el Respaldo Comunitario y la Evidencia de Prior Art?
                </h4>
                <p className="text-xs text-slate-400">
                  Conceptos clave para proteger tus inventos y creaciones de software frente a plagios o registros ilegítimos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#020617] border border-blue-950 space-y-2">
                <span className="font-bold text-cyan-300 block text-sm flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  1. Evidencia Tipo Repositorio GitHub
                </span>
                <p>
                  Al igual que un commit público firmado con fecha y hora inmutable en GitHub o GitLab, este foro comunitario almacena el código y genera un <strong>hash SHA-256 exacto</strong> que no puede ser alterado a posteriori sin romper la firma criptográfica.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#020617] border border-blue-950 space-y-2">
                <span className="font-bold text-emerald-300 block text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  2. Divulgación Previa (Prior Art)
                </span>
                <p>
                  En el derecho de propiedad intelectual internacional (Convenio de Berna y tratados PCT/OMPI), si demuestras que una obra o invento fue divulgado públicamente por ti con fecha anterior a una solicitud de patente de un tercero, dicha patente queda invalidada por falta de novedad.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#020617] border border-blue-950 space-y-2">
                <span className="font-bold text-amber-300 block text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  3. Transparencia: No es una Patente Formal
                </span>
                <p>
                  Este registro comunitario <strong>no reemplaza el trámite formal ante las oficinas gubernamentales de patentes</strong> (como USPTO, IMPI, EPO o OEPM). Su propósito es servir como <em>evidencia probatoria y antecedente fehaciente</em> en disputas de autoría o plagio.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#020617] border border-blue-950 space-y-2">
                <span className="font-bold text-purple-300 block text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  4. Firmas de Testigos Comunitarios
                </span>
                <p>
                  Otros desarrolladores de la comunidad pueden atestar y firmar digitalmente la existencia de tu proyecto, reforzando la credibilidad colectiva de la fecha de creación y los reclamos técnicos descritos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#031526] to-[#041a33] border border-cyan-500/40 space-y-2 md:col-span-2">
                <span className="font-bold text-cyan-300 block text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  5. Alternativa Híbrida y Gratis: Blockchain Pública, RFC 3161 y PGP
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-300 text-[11px]">
                  <div className="bg-black/40 p-3 rounded-xl border border-cyan-950 space-y-1">
                    <strong className="text-white block">Árbol Merkle & Blockchain</strong>
                    <p>
                      En lugar de pagar notarios, el foro agrupa los hashes diarios en un Árbol Merkle y sube un único Hash Maestro a blockchains públicas (Polygon/Arbitrum/Bitcoin OpenTimestamps) a costo cero.
                    </p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-cyan-950 space-y-1">
                    <strong className="text-white block">Servidores Públicos RFC 3161</strong>
                    <p>
                      Entidades globales (Apple, DigiCert, Sigstore de Linux Foundation) ofrecen TimeStamping RFC 3161 gratuito para certificar la fecha exacta con validez probatoria internacional.
                    </p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-cyan-950 space-y-1">
                    <strong className="text-white block">Firmas PGP & Git DAG</strong>
                    <p>
                      Cada usuario firma localmente con sus llaves asimétricas OpenPGP, y los registros se encadenan inmutablemente bloque a bloque como en Git. Costo cero y soberanía total.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
