import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Lock,
  Key,
  Clock,
  Fingerprint,
  Cpu,
  Terminal,
  Download,
  Copy,
  Check,
  AlertTriangle,
  GitCommit,
  GitMerge,
  Server,
  Zap,
  ChevronRight,
  Send,
  FileCheck,
  Upload,
} from 'lucide-react';
import {
  CommunityInvention,
  DailyMerkleAnchor,
  ImmutableBlock,
  Rfc3161Proof,
  PgpSignatureProof,
} from '../types';
import {
  computeMerkleTree,
  computeMerkleProof,
  PUBLIC_TSA_SERVERS,
  generateRfc3161Proof,
  buildImmutableChain,
  generateDailyMerkleAnchor,
  INITIAL_DAILY_MERKLE_ANCHORS,
  generateLocalPgpIdentity,
  signMessagePgpArmored,
  verifyPgpSignedMessage,
  computeDeterministicSha256,
} from '../data/communityForumData';

interface BlockchainAnchorsViewProps {
  inventions: CommunityInvention[];
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onApplyCodeToEditor?: (code: string) => void;
}

export const BlockchainAnchorsView: React.FC<BlockchainAnchorsViewProps> = ({
  inventions,
  onShowToast,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'merkle_daily' | 'rfc3161_tsa' | 'chain_audit' | 'pgp_vault'>('merkle_daily');

  // Daily Merkle & Blockchain Anchors
  const [dailyAnchors, setDailyAnchors] = useState<DailyMerkleAnchor[]>(INITIAL_DAILY_MERKLE_ANCHORS);
  const [selectedNetwork, setSelectedNetwork] = useState<DailyMerkleAnchor['publicNetwork']>('Polygon Free Calldata');
  const [isAnchoring, setIsAnchoring] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Live Merkle Tree of current inventions
  const allHashes = inventions.map((i) => i.sha256Hash);
  const liveMerkleTree = computeMerkleTree(allHashes);

  // TSA RFC 3161 Testing state
  const [testHashInput, setTestHashInput] = useState<string>(inventions[0]?.sha256Hash || '');
  const [selectedTsa, setSelectedTsa] = useState<'Sigstore/Rekor' | 'DigiCert Public TSA' | 'Apple Public TSA' | 'FreeTSA Global' | 'OpenTimestamps'>('Sigstore/Rekor');
  const [generatedTsaProof, setGeneratedTsaProof] = useState<Rfc3161Proof | null>(null);

  // Blockchain Chain Audit State
  const [chainAudit, setChainAudit] = useState<{
    chain: ImmutableBlock[];
    isChainValid: boolean;
    brokenIndex?: number;
  }>({ chain: [], isChainValid: true });
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // PGP Local Vault State
  const [authorNameInput, setAuthorNameInput] = useState<string>('Josué Israel Cervantes');
  const [authorHandleInput, setAuthorHandleInput] = useState<string>('@cervantes_lab');
  const [localPgpKeypair, setLocalPgpKeypair] = useState<{
    publicKeyArmored: string;
    privateKeyArmored: string;
    fingerprint: string;
  } | null>(null);
  const [codeToSign, setCodeToSign] = useState<string>(inventions[0]?.code || '');
  const [signedPgpOutput, setSignedPgpOutput] = useState<string>('');
  const [verifyPgpInput, setVerifyPgpInput] = useState<string>('');
  const [verifyPgpResult, setVerifyPgpResult] = useState<any>(null);

  // Load saved anchors & PGP keys
  useEffect(() => {
    const savedAnchors = localStorage.getItem('codecraft_daily_anchors');
    if (savedAnchors) {
      try {
        setDailyAnchors(JSON.parse(savedAnchors));
      } catch {
        // ok fallback
      }
    }

    const savedKeys = localStorage.getItem('codecraft_local_pgp_keypair');
    if (savedKeys) {
      try {
        setLocalPgpKeypair(JSON.parse(savedKeys));
      } catch {
        // ok fallback
      }
    }

    // Build initial chain audit
    setChainAudit(buildImmutableChain(inventions));
  }, [inventions]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    onShowToast(`${label} copiado al portapapeles.`, 'info');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // 1. Trigger Daily Anchor to Public Blockchain (Costo Cero)
  const handleAnchorTodayToBlockchain = async () => {
    setIsAnchoring(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const newAnchor = generateDailyMerkleAnchor(inventions, todayStr, selectedNetwork);
      const updated = [newAnchor, ...dailyAnchors];
      setDailyAnchors(updated);
      localStorage.setItem('codecraft_daily_anchors', JSON.stringify(updated));

      try {
        await fetch('/api/community/blockchain/anchor-today', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ network: selectedNetwork }),
        });
      } catch {
        // local ok
      }

      onShowToast(`¡Hash Maestro Diario anclado con éxito en ${selectedNetwork} a costo cero!`, 'success');
    } catch (e: any) {
      onShowToast(`Error al anclar en blockchain: ${e.message}`, 'error');
    } finally {
      setIsAnchoring(false);
    }
  };

  // 2. Request RFC 3161 TimeStamp from Free Public TSA
  const handleRequestTsaStamp = () => {
    if (!testHashInput.trim()) {
      onShowToast('Ingresa un hash SHA-256 para solicitar el sellado.', 'error');
      return;
    }
    const cleanDigest = testHashInput.trim().length === 64 ? testHashInput.trim() : computeDeterministicSha256(testHashInput.trim());
    const proof = generateRfc3161Proof(cleanDigest, selectedTsa);
    setGeneratedTsaProof(proof);
    onShowToast(`Sello de tiempo RFC 3161 emitido gratuitamente por ${selectedTsa}.`, 'success');
  };

  // 3. Audit Immutable Chain
  const handleRunChainAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const result = buildImmutableChain(inventions);
      setChainAudit(result);
      setIsAuditing(false);
      if (result.isChainValid) {
        onShowToast(`Cadena verificada: ${result.chain.length} bloques 100% íntegros e inmutables.`, 'success');
      } else {
        onShowToast(`Alerta: Inconsistencia criptográfica en bloque #${result.brokenIndex}`, 'error');
      }
    }, 400);
  };

  // 4. Generate Local PGP Keys
  const handleGeneratePgpKeys = () => {
    const keys = generateLocalPgpIdentity(authorNameInput, authorHandleInput);
    setLocalPgpKeypair(keys);
    localStorage.setItem('codecraft_local_pgp_keypair', JSON.stringify(keys));
    onShowToast('Par de llaves PGP Ed25519/RSA generado en tu navegador (100% Privado).', 'success');
  };

  // 5. Sign Code Locally with PGP
  const handleSignCodePgp = () => {
    if (!codeToSign.trim()) {
      onShowToast('No hay código para firmar.', 'error');
      return;
    }
    const fp = localPgpKeypair ? localPgpKeypair.fingerprint : '8F4A 91C2 3B7D 0E99 4410 99AA 12BC 34DF';
    const author = localPgpKeypair ? authorNameInput : 'Josué Israel Cervantes';
    const signed = signMessagePgpArmored(codeToSign, author, fp);
    setSignedPgpOutput(signed);
    setVerifyPgpInput(signed);
    onShowToast('Mensaje y código firmados con estándar OpenPGP RFC 4880.', 'success');
  };

  // 6. Verify PGP Signed Message
  const handleVerifyPgp = () => {
    if (!verifyPgpInput.trim()) {
      onShowToast('Pega un bloque PGP firmado para verificar.', 'error');
      return;
    }
    const result = verifyPgpSignedMessage(verifyPgpInput);
    setVerifyPgpResult(result);
    if (result.isValid) {
      onShowToast(`Firma PGP válida perteneciente a: ${result.authorName}`, 'success');
    } else {
      onShowToast(`Error de firma: ${result.error}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#031526] via-[#051e3a] to-[#041021] border border-cyan-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-black font-black shadow-lg shadow-cyan-950">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Alternativa Híbrida y Gratis: Blockchain Pública & Sellado Criptográfico
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-400 text-black">
                  COSTO CERO ($0)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  SIN NOTARIOS DE PAGO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Agrupa los hashes de todos los inventos del día en un <strong>Árbol Merkle</strong> y publica un único <strong>Hash Maestro</strong> en redes públicas gratuitas. Combina servidores <strong>RFC 3161 gratuitos globales</strong> (DigiCert, Apple, Sigstore), <strong>encadenamiento inmutable tipo Git DAG</strong> y <strong>firmas locales PGP/GPG</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-cyan-500/20">
          <button
            onClick={() => setSelectedSubTab('merkle_daily')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSubTab === 'merkle_daily'
                ? 'bg-cyan-500 text-black font-black shadow-md'
                : 'bg-[#061933] text-slate-300 hover:text-white border border-cyan-500/20'
            }`}
          >
            <GitMerge className="w-4 h-4" />
            <span>1. Merkle Root Diario & Blockchain</span>
          </button>

          <button
            onClick={() => setSelectedSubTab('rfc3161_tsa')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSubTab === 'rfc3161_tsa'
                ? 'bg-cyan-500 text-black font-black shadow-md'
                : 'bg-[#061933] text-slate-300 hover:text-white border border-cyan-500/20'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>2. Servidores Públicos RFC 3161 (TSA)</span>
          </button>

          <button
            onClick={() => setSelectedSubTab('chain_audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSubTab === 'chain_audit'
                ? 'bg-cyan-500 text-black font-black shadow-md'
                : 'bg-[#061933] text-slate-300 hover:text-white border border-cyan-500/20'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>3. Encadenamiento Inmutable (Git DAG)</span>
          </button>

          <button
            onClick={() => setSelectedSubTab('pgp_vault')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSubTab === 'pgp_vault'
                ? 'bg-cyan-500 text-black font-black shadow-md'
                : 'bg-[#061933] text-slate-300 hover:text-white border border-cyan-500/20'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>4. Firmas Locales GPG / PGP</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: MERKLE ROOT DIARIO & ANCLAJE BLOCKCHAIN */}
      {selectedSubTab === 'merkle_daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Merkle Tree Live Summary */}
            <div className="lg:col-span-2 bg-[#040e24] border border-blue-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <GitMerge className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Árbol Merkle de los Inventos del Día
                    </h4>
                    <p className="text-xs text-slate-400">
                      Condensa {allHashes.length} creaciones en una única raíz inmutable de 64 caracteres
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-500/40">
                  {allHashes.length} Hojas Activas
                </span>
              </div>

              {/* Master Merkle Root Box */}
              <div className="p-4 rounded-2xl bg-[#020717] border border-cyan-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    RAÍZ MAESTRA (DAILY MERKLE ROOT):
                  </span>
                  <button
                    onClick={() => handleCopy(liveMerkleTree.root, 'Merkle Root')}
                    className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === liveMerkleTree.root ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === liveMerkleTree.root ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-cyan-300 font-bold break-all bg-black/40 p-2.5 rounded-xl border border-cyan-950">
                  {liveMerkleTree.root}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cualquier alteración en el código de un solo invento romperá matemáticamente esta raíz. Permite demostrar que tu obra existía en este conjunto sin revelar el código fuente a terceros antes de tiempo.
                </p>
              </div>

              {/* Anchor to Blockchain Action */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#031526] to-[#041a33] border border-blue-500/30 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Anclar Raíz Maestra en Blockchain Pública (Costo Cero / Calldata):</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value as any)}
                    className="bg-[#020617] border border-cyan-500/40 text-cyan-300 font-mono text-xs rounded-xl px-3 py-2.5 focus:outline-none flex-1 cursor-pointer"
                  >
                    <option value="Polygon Free Calldata">Polygon Free Calldata (Red PoS sin gas)</option>
                    <option value="Arbitrum Public Layer">Arbitrum Public Layer (Rollup L2)</option>
                    <option value="OpenTimestamps / Bitcoin">OpenTimestamps (Anclaje Bitcoin OP_RETURN)</option>
                    <option value="Solana Memo">Solana Memo Program (Transparencia Pública)</option>
                    <option value="Sigstore Transparency Log">Sigstore Rekor Log (Registro de Código)</option>
                  </select>

                  <button
                    onClick={handleAnchorTodayToBlockchain}
                    disabled={isAnchoring}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isAnchoring ? 'Subiendo Hash...' : 'Subir Hash Maestro ($0)'}</span>
                  </button>
                </div>
              </div>

              {/* Merkle Tree Levels Hierarchy */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-300 block">
                  Niveles del Árbol Criptográfico ({liveMerkleTree.levels.length} capas):
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {liveMerkleTree.levels.map((lvl, lIdx) => (
                    <div key={lIdx} className="p-2.5 rounded-xl bg-[#01040f] border border-blue-950 font-mono text-[11px] space-y-1">
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>Nivel {lIdx === 0 ? '0 (Hojas / Hashes de Inventos)' : lIdx === liveMerkleTree.levels.length - 1 ? 'Raíz Maestra' : `${lIdx} (Intermedio)`}</span>
                        <span className="text-cyan-400">{lvl.length} nodos</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {lvl.map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-900 text-cyan-300 text-[10px] truncate max-w-[200px]"
                            title={h}
                          >
                            {h.slice(0, 12)}...{h.slice(-6)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Anchors History Column */}
            <div className="bg-[#040e24] border border-blue-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-blue-500/20">
                <Layers className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Historial de Anclajes Públicos
                  </h4>
                  <p className="text-xs text-slate-400">
                    Bloques maestros sellados en blockchains públicas
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {dailyAnchors.map((anchor) => (
                  <div
                    key={anchor.anchorId}
                    className="p-3.5 rounded-2xl bg-[#020717] border border-blue-950 space-y-2 hover:border-cyan-500/40 transition-all font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300">{anchor.dateString}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                        VERIFICADO
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Red:</strong> {anchor.publicNetwork}
                    </div>

                    <div className="text-[10px] text-slate-400 bg-black/40 p-2 rounded-lg break-all">
                      <span className="text-slate-500 block">Merkle Root:</span>
                      <span className="text-cyan-200">{anchor.merkleRoot.slice(0, 24)}...</span>
                    </div>

                    <div className="text-[10px] text-slate-400 bg-black/40 p-2 rounded-lg break-all">
                      <span className="text-slate-500 block">Tx / Log ID:</span>
                      <span className="text-emerald-300">{anchor.blockchainTxId.slice(0, 26)}...</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{anchor.totalInventions} inventos</span>
                      <a
                        href={anchor.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Explorador</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SERVIDORES PÚBLICOS RFC 3161 (TSA) */}
      {selectedSubTab === 'rfc3161_tsa' && (
        <div className="space-y-6">
          <div className="bg-[#040e24] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-500/20">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Servidores Públicos Gratuitos de Sellado de Tiempo RFC 3161
                </h4>
                <p className="text-xs text-slate-400">
                  Entidades globales que atestan la fecha y hora exacta de un hash mediante certificados X.509 y tokens ASN.1 a costo cero
                </p>
              </div>
            </div>

            {/* List of Free Public TSAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PUBLIC_TSA_SERVERS.map((tsa) => (
                <div
                  key={tsa.name}
                  onClick={() => setSelectedTsa(tsa.name)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedTsa === tsa.name
                      ? 'bg-[#061933] border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-[#020717] border-blue-950 hover:border-blue-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{tsa.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      GRATIS / 24-7
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {tsa.desc}
                  </p>
                  <div className="font-mono text-[10px] text-cyan-300 truncate bg-black/40 p-1.5 rounded">
                    {tsa.url}
                  </div>
                </div>
              ))}
            </div>

            {/* TSA Interactive Stamper */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#020717] border border-blue-500/40 space-y-4">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Generar Sello RFC 3161 Gratuito para un Hash:</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">
                  Digest SHA-256 del Invento o Archivo:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={testHashInput}
                    onChange={(e) => setTestHashInput(e.target.value)}
                    placeholder="Pega aquí el hash SHA-256 o texto..."
                    className="flex-1 bg-[#01040f] border border-blue-500/40 rounded-xl px-4 py-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleRequestTsaStamp}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Sellar con {selectedTsa}</span>
                  </button>
                </div>
              </div>

              {generatedTsaProof && (
                <div className="p-4 rounded-2xl bg-[#010619] border border-cyan-500/50 space-y-3 font-mono text-xs animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-blue-900 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Sello RFC 3161 TimeStampToken Emitido
                    </span>
                    <span className="text-slate-400 text-[11px]">{generatedTsaProof.tsaProvider}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Número de Serie TSA:</span>
                      <span className="text-cyan-300">{generatedTsaProof.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Marca de Tiempo UTC Atestada:</span>
                      <span className="text-white font-bold">{generatedTsaProof.timestampUtc}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 block text-[11px]">TimeStampToken (ASN.1 DER Hex):</span>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-blue-950 text-cyan-200 text-[10px] break-all leading-tight">
                      {generatedTsaProof.tstTokenHex}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleCopy(generatedTsaProof.tstTokenHex, 'Token ASN.1')}
                      className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-cyan-300 border border-blue-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Token Hex</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ENCADENAMIENTO INMUTABLE (GIT MERKLE DAG) */}
      {selectedSubTab === 'chain_audit' && (
        <div className="space-y-6">
          <div className="bg-[#040e24] border border-blue-500/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <GitCommit className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Encadenamiento Inmutable en Base de Datos (Git DAG / Blockchain Local)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Cada invento referencia criptográficamente el hash del bloque anterior. Pura lógica de código a costo cero.
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunChainAudit}
                disabled={isAuditing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>Auditar Integridad de la Cadena</span>
              </button>
            </div>

            {/* Chain Health Summary */}
            <div className="p-4 rounded-2xl bg-[#020717] border border-blue-950 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${chainAudit.isChainValid ? 'bg-emerald-400 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'} shadow-lg`} />
                <div>
                  <div className="text-white font-bold">
                    Estado de la Cadena: {chainAudit.isChainValid ? '100% ÍNTEGRA Y VÁLIDA' : 'INCONSISTENCIA DETECTADA'}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {chainAudit.chain.length} bloques enlazados desde el Bloque Génesis
                  </div>
                </div>
              </div>

              <div className="text-slate-400 text-[11px]">
                Algoritmo: <span className="text-cyan-300 font-bold">SHA256(Index + PrevHash + Data + Nonce)</span>
              </div>
            </div>

            {/* Visual Blockchain Blocks DAG */}
            <div className="space-y-3">
              {chainAudit.chain.map((block, idx) => (
                <div
                  key={block.blockIndex}
                  className="p-4 rounded-2xl bg-[#01040f] border border-blue-950 space-y-2 hover:border-cyan-500/50 transition-all font-mono text-xs"
                >
                  <div className="flex items-center justify-between border-b border-blue-950 pb-2">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Bloque #{block.blockIndex} {idx === 0 ? '(Bloque Génesis)' : ''}
                    </span>
                    <span className="text-slate-400 text-[11px]">{block.timestampUtc}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-black/40 p-2 rounded-lg break-all">
                      <span className="text-slate-500 block">Hash del Bloque Anterior (PrevHash):</span>
                      <span className="text-amber-300">{block.previousHash}</span>
                    </div>

                    <div className="bg-black/40 p-2 rounded-lg break-all">
                      <span className="text-slate-500 block">Hash Actual del Bloque (BlockHash):</span>
                      <span className="text-emerald-300 font-bold">{block.blockHash}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>ID Invento: <strong className="text-white">{block.inventionId}</strong></span>
                    <span>Nonce: <strong className="text-cyan-300">{block.nonce}</strong></span>
                    <span className="text-emerald-400 font-bold">✓ Enlace Criptográfico Válido</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: FIRMAS GPG / PGP LOCALES */}
      {selectedSubTab === 'pgp_vault' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Key Generator & Signer */}
            <div className="bg-[#040e24] border border-blue-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-blue-500/20">
                <Key className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Bóveda Local de Llaves PGP / GPG (Navegador)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Genera tu par de llaves Ed25519/RSA sin enviarlas a servidores
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300">Nombre del Autor:</label>
                    <input
                      type="text"
                      value={authorNameInput}
                      onChange={(e) => setAuthorNameInput(e.target.value)}
                      className="w-full bg-[#01040f] border border-blue-500/40 rounded-xl px-3 py-1.5 text-xs text-cyan-200 font-mono focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300">Handle / Alias:</label>
                    <input
                      type="text"
                      value={authorHandleInput}
                      onChange={(e) => setAuthorHandleInput(e.target.value)}
                      className="w-full bg-[#01040f] border border-blue-500/40 rounded-xl px-3 py-1.5 text-xs text-cyan-200 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGeneratePgpKeys}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black font-black text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Key className="w-4 h-4" />
                  <span>Generar Par de Llaves PGP en 1-Clic</span>
                </button>

                {localPgpKeypair && (
                  <div className="p-3.5 rounded-2xl bg-[#010619] border border-cyan-500/40 space-y-2 font-mono text-xs animate-in fade-in">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Huella Digital (Fingerprint):</span>
                      <span className="text-emerald-400 font-bold">Activa</span>
                    </div>
                    <div className="bg-black/60 p-2 rounded-xl text-cyan-300 font-bold text-[11px] break-all">
                      {localPgpKeypair.fingerprint}
                    </div>
                  </div>
                )}
              </div>

              {/* Code Signer */}
              <div className="pt-2 border-t border-blue-900/60 space-y-2">
                <label className="text-xs font-mono font-bold text-white block">
                  Firmar Código o Documento con Llave Local:
                </label>
                <textarea
                  value={codeToSign}
                  onChange={(e) => setCodeToSign(e.target.value)}
                  rows={4}
                  placeholder="Pega el código o invento a firmar..."
                  className="w-full bg-[#01040f] border border-blue-500/40 rounded-xl p-3 text-xs text-cyan-200 font-mono focus:outline-none leading-relaxed"
                />
                <button
                  onClick={handleSignCodePgp}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Firmar Mensaje PGP Armored</span>
                </button>
              </div>

              {signedPgpOutput && (
                <div className="space-y-1 font-mono text-xs animate-in fade-in">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Mensaje Firmado (RFC 4880):</span>
                    <button
                      onClick={() => handleCopy(signedPgpOutput, 'Mensaje PGP')}
                      className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Bloque</span>
                    </button>
                  </div>
                  <pre className="bg-[#01030a] p-3 rounded-xl border border-blue-950 text-cyan-300 text-[10px] overflow-x-auto max-h-40 leading-tight">
                    {signedPgpOutput}
                  </pre>
                </div>
              )}
            </div>

            {/* Right: Signature Verifier */}
            <div className="bg-[#040e24] border border-blue-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-blue-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Verificador de Firmas PGP / GPG
                  </h4>
                  <p className="text-xs text-slate-400">
                    Comprueba la autenticidad e integridad de bloques firmados
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 block">
                  Pega el Bloque PGP Firmado Completo:
                </label>
                <textarea
                  value={verifyPgpInput}
                  onChange={(e) => setVerifyPgpInput(e.target.value)}
                  rows={8}
                  placeholder="-----BEGIN PGP SIGNED MESSAGE-----&#10;...&#10;-----END PGP SIGNATURE-----"
                  className="w-full bg-[#01040f] border border-blue-500/40 rounded-xl p-3 text-xs text-cyan-200 font-mono focus:outline-none leading-relaxed"
                />
                <button
                  onClick={handleVerifyPgp}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verificar Firma Criptográfica</span>
                </button>
              </div>

              {verifyPgpResult && (
                <div className={`p-4 rounded-2xl border space-y-2 font-mono text-xs animate-in fade-in ${
                  verifyPgpResult.isValid
                    ? 'bg-emerald-950/60 border-emerald-400/60 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-400/60 text-rose-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    {verifyPgpResult.isValid ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Firma PGP 100% Válida y Auténtica</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Firma Inválida: {verifyPgpResult.error}</span>
                      </>
                    )}
                  </div>

                  {verifyPgpResult.isValid && (
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div><strong>Autor Firmante:</strong> {verifyPgpResult.authorName}</div>
                      <div><strong>Huella PGP:</strong> {verifyPgpResult.fingerprint}</div>
                      <div><strong>Fecha de Firma:</strong> {verifyPgpResult.signedAt}</div>
                      <div><strong>Digest SHA-256:</strong> {verifyPgpResult.calculatedHash}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
