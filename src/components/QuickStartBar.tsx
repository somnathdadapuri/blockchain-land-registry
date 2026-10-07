import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSearch,
  Cpu,
  User,
  Zap,
  Calculator,
} from 'lucide-react';
import { TestAccount, UserRole, Property } from '../types/blockchain';

interface Props {
  currentAccount: TestAccount;
  accounts: TestAccount[];
  properties: Property[];
  onSelectAccount: (account: TestAccount) => void;
  onNavigateTab: (tab: 'authority' | 'owner' | 'buyer' | 'verify' | 'contract' | 'explorer') => void;
  onQuickTransferDemo: () => void;
  onQuickRegisterDemo: () => void;
  onOpenProfile?: () => void;
  onOpenTaxCalculator?: () => void;
  onOpenDueDiligence?: () => void;
}

export const QuickStartBar: React.FC<Props> = ({
  currentAccount,
  accounts,
  properties,
  onSelectAccount,
  onNavigateTab,
  onQuickTransferDemo,
  onQuickRegisterDemo,
  onOpenProfile,
  onOpenTaxCalculator,
  onOpenDueDiligence,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Role Context & Friendly Helper */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">Interactive Web3 Land Registry</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active ({currentAccount.role})
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Logged in as <strong className="text-stone-800">{currentAccount.name}</strong>. Choose a quick action or enterprise tool below:
            </p>
          </div>
        </div>

        {/* Right: 1-Click Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Profile */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <User className="h-3.5 w-3.5 text-orange-600" />
              <span>Profile & KYC</span>
            </button>
          )}

          {/* Quick Transfer */}
          <button
            onClick={onQuickTransferDemo}
            className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs shadow-orange-600/30"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>1-Click Transfer Demo</span>
          </button>

          {/* Quick Register */}
          <button
            onClick={onQuickRegisterDemo}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Building2 className="h-3.5 w-3.5 text-stone-600" />
            <span>Register Land</span>
          </button>

          {/* Due Diligence Audit */}
          {onOpenDueDiligence && (
            <button
              onClick={onOpenDueDiligence}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Due Diligence Audit</span>
            </button>
          )}

          {/* Tax Calculator */}
          {onOpenTaxCalculator && (
            <button
              onClick={onOpenTaxCalculator}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Calculator className="h-3.5 w-3.5 text-stone-600" />
              <span>Tax Calculator</span>
            </button>
          )}

          {/* Quick Verify */}
          <button
            onClick={() => onNavigateTab('verify')}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileSearch className="h-3.5 w-3.5 text-stone-600" />
            <span>Verify Title</span>
          </button>

          {/* Smart Contract Tests */}
          <button
            onClick={() => onNavigateTab('contract')}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Cpu className="h-3.5 w-3.5 text-stone-600" />
            <span>Solidity Tests</span>
          </button>
        </div>
      </div>
    </div>
  );
};

