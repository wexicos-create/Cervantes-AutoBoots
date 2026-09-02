import React, { useState } from 'react';
import { Award, Copy, Check, Scale, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAuthorshipModal?: () => void;
  onOpenCommunityForum?: () => void;
  onOpenLaunchers?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAuthorshipModal,
  onOpenCommunityForum,
  onOpenLaunchers,
}) => {
  const [copiedCredit, setCopiedCredit] = useState(false);

  const creditText =
    'Desarrollado por Josué Israel Cervantes Alvarado. Favor de no borrar los créditos, más bien la colaboración conjunta sin eliminar autoría por favor.';

  const handleCopyCredit = () => {
    navigator.clipboard.writeText(creditText);
    setCopiedCredit(true);
    setTimeout(() => setCopiedCredit(false), 2000);
  };

  return (
    <footer className="mt-8 border-t border-amber-500/30 bg-[#020512] text-slate-400 py-3 px-4 relative z-20 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Créditos de Autoría Compactos */}
        <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-200 font-medium">
            Desarrollado por <strong className="text-amber-300">Josué Israel Cervantes Alvarado</strong>.
          </span>
          <span className="text-slate-400 hidden md:inline">
            (Colaboración conjunta sin eliminar autoría).
          </span>
          <button
            onClick={handleCopyCredit}
            className="ml-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            title="Copiar créditos oficiales"
          >
            {copiedCredit ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCredit ? 'Copiado' : 'Copiar Atribución'}</span>
          </button>
        </div>

        {/* Fusión Ollama Uncensored & OCR Libre */}
        <div className="flex items-center gap-3 flex-wrap text-[11px] justify-center sm:justify-end font-mono">
          <span className="text-cyan-300 flex items-center gap-1 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            <Scale className="w-3 h-3 text-cyan-400" />
            Ollama Uncensored + OCR (<a href="https://ollama.com/frob/unlimited-ocr" target="_blank" rel="noreferrer" className="underline hover:text-cyan-200">frob/unlimited-ocr</a>)
          </span>
          <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
            0% Telemetría • 100% Determinista
          </span>
        </div>
      </div>
    </footer>
  );
};
