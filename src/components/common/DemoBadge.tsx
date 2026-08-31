import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DemoBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono rounded-md shadow-sm">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      <span className="font-semibold uppercase tracking-wide">Demo Environment</span>
      <span className="hidden sm:inline text-amber-400/80">| Simulated Ground Data</span>
    </div>
  );
};

export const OperationalStatusBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-md shadow-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      <span className="font-semibold">Response Network Operational</span>
    </div>
  );
};
