import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Course Simulation Disclaimer" className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-orange-300/40 px-4 py-2.5 text-xs text-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-xs">
            <AlertTriangle className="h-3 w-3" />
          </span>
          <p className="leading-tight">
            <strong className="font-semibold text-orange-950">Academic Simulation Disclaimer:</strong>{' '}
            This project is a decentralized Web3 land registry prototype developed for blockchain course simulation.
            All property data, cadastral deeds, IPFS hashes, and wallet balances are synthetic and do <strong>not</strong> confer legally binding real-world ownership.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-medium text-orange-800 border border-orange-200">
            <ShieldCheck className="h-3 w-3 text-orange-600" />
            Hardhat EVM 31337
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-1 text-stone-400 hover:bg-orange-100 hover:text-stone-700 transition"
            title="Dismiss notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
