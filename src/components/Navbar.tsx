import React, { useState } from 'react';
import {
  Building2,
  Wallet,
  Cpu,
  Search,
  Layers,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  UserCheck,
  Briefcase,
  Home,
  ShieldAlert,
  User,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { TestAccount, UserRole } from '../types/blockchain';
import { shortenAddress, formatEth } from '../utils/formatters';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accounts: TestAccount[];
  currentAccount: TestAccount;
  onSelectAccount: (acc: TestAccount) => void;
  blockNumber: number;
  onResetState: () => void;
  onOpenProfile?: () => void;
  onOpenTaxCalculator?: () => void;
  onOpenDueDiligence?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  accounts,
  currentAccount,
  onSelectAccount,
  blockNumber,
  onResetState,
  onOpenProfile,
  onOpenTaxCalculator,
  onOpenDueDiligence,
}) => {
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all property registries, transactions, and event logs back to initial seeded state?')) {
      setResetting(true);
      onResetState();
      setTimeout(() => setResetting(false), 500);
    }
  };

  const navItems = [
    { id: 'authority', label: 'Land Authority', icon: Building2, roleTag: 'Admin' },
    { id: 'owner', label: 'My Properties', icon: Home, roleTag: 'Owner' },
    { id: 'buyer', label: 'Buyer & Escrow', icon: Briefcase, roleTag: 'Buyer' },
    { id: 'verify', label: 'Title Verification', icon: Search, highlight: true },
    { id: 'contract', label: 'Smart Contract & Remix', icon: Cpu, badge: 'Solidity' },
    { id: 'explorer', label: 'EVM Explorer', icon: Layers, badge: 'Logs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Network Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('authority')}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-100">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-stone-900">
                    LAND<span className="text-orange-600">REGISTRY</span>
                  </span>
                  <span className="px-1.5 py-0.2 bg-orange-100 text-orange-800 text-[10px] font-bold rounded tracking-wide uppercase border border-orange-200">
                    Web3 EVM
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Hardhat Node #31337</span>
                  <span className="text-stone-300">•</span>
                  <span className="font-mono text-stone-600">Block #{blockNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-orange-50/70'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-orange-600'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Profile, Tools & Wallet Switcher */}
          <div className="flex items-center gap-2">
            {/* Quick Profile Button */}
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                title="View Government KYC Credentials, Digital Signature Key & Wallet Balance"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition border border-stone-200/90 font-semibold shadow-2xs"
              >
                <User className="h-3.5 w-3.5 text-orange-600" />
                <span className="hidden sm:inline">Profile & KYC</span>
              </button>
            )}

            {/* Quick Tax Calculator Button */}
            {onOpenTaxCalculator && (
              <button
                onClick={onOpenTaxCalculator}
                title="Automated Stamp Duty & Real Estate Closing Cost Calculator"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition border border-stone-200/90 font-semibold shadow-2xs"
              >
                <Calculator className="h-3.5 w-3.5 text-orange-600" />
                <span>Stamp Duty Calc</span>
              </button>
            )}

            {/* Quick Due Diligence Button */}
            {onOpenDueDiligence && (
              <button
                onClick={onOpenDueDiligence}
                title="6-Point On-Chain Title Encumbrance & Legal Risk Audit"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition border border-stone-200/90 font-semibold shadow-2xs"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Due Diligence</span>
              </button>
            )}

            <button
              onClick={handleReset}
              title="Reset blockchain state to initial mock data"
              disabled={resetting}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-600 bg-stone-100 hover:bg-orange-100 hover:text-orange-900 rounded-xl transition border border-stone-200"
            >
              <RotateCcw className={`h-3.5 w-3.5 text-stone-500 ${resetting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Test Wallet Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl hover:border-orange-300 transition text-left shadow-xs"
              >
                <div className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${currentAccount.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
                  {currentAccount.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-stone-900 leading-tight">
                      {currentAccount.name.split('(')[0]}
                    </span>
                    <span className="text-[10px] font-medium text-orange-700 bg-orange-100 px-1 rounded">
                      {currentAccount.role}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 leading-tight">
                    {formatEth(currentAccount.balanceEth)} • {shortenAddress(currentAccount.address)}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-stone-500" />
              </button>

              {walletDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setWalletDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-orange-200/90 p-2 z-30 divide-y divide-stone-100">
                    <div className="p-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Wallet className="h-4 w-4 text-orange-600" />
                          Simulate Actor Wallet
                        </span>
                        <span className="text-[10px] text-stone-400 font-normal">Switch with 1-click</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Test authorization rules, modifiers, and reverts by switching active EVM signers.
                      </p>
                    </div>

                    <div className="py-1 space-y-1">
                      {accounts.map((acc) => {
                        const isSelected =
                          acc.address &&
                          currentAccount?.address &&
                          acc.address.toLowerCase() === currentAccount.address.toLowerCase();
                        return (
                          <button
                            key={acc.address}
                            onClick={() => {
                              onSelectAccount(acc);
                              setWalletDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                              isSelected
                                ? 'bg-orange-100/70 border border-orange-300'
                                : 'hover:bg-stone-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${acc.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
                                {acc.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-stone-900">{acc.name}</span>
                                  {acc.role === UserRole.AUTHORITY && (
                                    <span className="text-[9px] bg-orange-600 text-white font-bold px-1 rounded">
                                      ADMIN
                                    </span>
                                  )}
                                  {acc.role === UserRole.UNAUTHORIZED && (
                                    <span className="text-[9px] bg-rose-600 text-white font-bold px-1 rounded">
                                      NO ROLE
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-stone-500 font-mono">
                                  {shortenAddress(acc.address, 5)} • {formatEth(acc.balanceEth)}
                                </div>
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-orange-600" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-2 bg-orange-50/50 rounded-b-xl text-[11px] text-stone-600 flex items-center justify-between">
                      {onOpenProfile ? (
                        <button
                          onClick={() => {
                            setWalletDropdownOpen(false);
                            onOpenProfile();
                          }}
                          className="w-full text-center py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>View Full Profile & KYC Credentials</span>
                        </button>
                      ) : (
                        <>
                          <span>MetaMask Web3 Provider:</span>
                          <span className="text-orange-700 font-semibold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Virtual RPC Ready
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-stone-100 overflow-x-auto gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive ? 'bg-orange-600 text-white' : 'text-stone-600 hover:bg-orange-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
