import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Wallet,
  Coins,
  QrCode,
  Copy,
  Check,
  FileSignature,
  Activity,
  Zap,
  Building,
  Key,
  BadgeCheck,
  RefreshCw,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Layers,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react';
import { TestAccount, UserRole, BlockchainTransaction, Property } from '../types/blockchain';
import { shortenAddress, formatEth, formatUsd } from '../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentAccount: TestAccount;
  accounts: TestAccount[];
  transactions: BlockchainTransaction[];
  properties: Property[];
  onFaucetRefill: (address: string, amountEth: number) => void;
  onSwitchAccount?: (acc: TestAccount) => void;
  onOpenCertificate?: (property: Property) => void;
}

export const ProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentAccount,
  accounts,
  transactions,
  properties,
  onFaucetRefill,
  onSwitchAccount,
  onOpenCertificate,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'holdings' | 'signature' | 'activity'>('profile');
  const [signMessage, setSignMessage] = useState('I hereby digitally sign and endorse title conveyance under Cadastre Regulation Act 2026.');
  const [signatureResult, setSignatureResult] = useState<string | null>(null);
  const [faucetSuccess, setFaucetSuccess] = useState(false);
  const [faucetAmount, setFaucetAmount] = useState(10);
  const [kycUpgradeRequested, setKycUpgradeRequested] = useState(false);
  const [customKeyCopied, setCustomKeyCopied] = useState(false);

  // Editable user preferences
  const [displayName, setDisplayName] = useState(currentAccount.name);
  const [emailContact, setEmailContact] = useState(`${currentAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@cadastre-network.io`);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentAccount.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrivateKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCustomKeyCopied(true);
    setTimeout(() => setCustomKeyCopied(false), 2000);
  };

  const handleRefill = (amount: number) => {
    onFaucetRefill(currentAccount.address, amount);
    setFaucetSuccess(true);
    setTimeout(() => setFaucetSuccess(false), 2500);
  };

  const handleGenerateSignature = () => {
    // Generate simulated EIP-191 ECDSA signature
    const rawData = `${currentAccount.address}:${signMessage}:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      hash = (hash << 5) - hash + rawData.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    const fullSig = `0x${hex}7f82c491da0183bce4901fa8201bce471829bb01248109ad${hex}1b`;
    setSignatureResult(fullSig);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Filter transactions performed by this account
  const accountTxs = transactions.filter(
    (tx) => tx.from.toLowerCase() === currentAccount.address.toLowerCase()
  );

  // Owned properties
  const ownedProperties = properties.filter(
    (p) => p.currentOwner.toLowerCase() === currentAccount.address.toLowerCase()
  );
  const totalValuation = ownedProperties.reduce((acc, p) => acc + (p.valuationEth || 0), 0);

  const getKycDetails = (role: UserRole) => {
    switch (role) {
      case UserRole.AUTHORITY:
        return {
          idNumber: 'GOV-REG-TX-4091',
          tier: 'Tier 4 - State Land Registrar General',
          jurisdiction: 'Texas Cadastral & Deeds Department',
          accreditation: 'Executive Blockchain Notary Authority',
          status: 'Active Government Officer',
          authorityLevel: 'Super Administrator / Cadastre Master Key',
          permissions: ['Register New Parcels', 'Resolve Title Disputes', 'Revoke Fraudulent Claims', 'Deploy Contract Upgrades'],
          nationalRegistryId: 'US-CADASTRAL-AUTH-7719',
          complianceScore: '100% Fully Vetted',
        };
      case UserRole.VERIFIER:
        return {
          idNumber: 'SURV-LIC-8820',
          tier: 'Tier 3 - Licensed Cadastral Surveyor',
          jurisdiction: 'Board of Professional Land Surveyors',
          accreditation: 'Certified GIS & Geodetic Boundary Inspector',
          status: 'Verified Verifier',
          authorityLevel: 'Accredited Boundary Auditor',
          permissions: ['Verify Spatial Boundaries', 'Countersign Geo-Survey Maps', 'Submit Field Audit Affidavits'],
          nationalRegistryId: 'SURV-GIS-WGS84-9912',
          complianceScore: '98% Accredited',
        };
      case UserRole.OWNER:
        return {
          idNumber: 'US-ID-9102-AV',
          tier: 'Tier 2 - Verified Property Title Holder',
          jurisdiction: 'State Real Estate Registry',
          accreditation: 'Biometrically Verified Citizen (KYC Passed)',
          status: 'Verified Owner',
          authorityLevel: 'Title Deed Beneficiary',
          permissions: ['Direct On-Chain Title Transfer', 'Escrow Escort Initiation', 'Generate Certified Deed Certificates'],
          nationalRegistryId: 'NID-PASSPORT-448102',
          complianceScore: '95% KYC Cleared',
        };
      case UserRole.BUYER:
        return {
          idNumber: 'US-ID-4419-BS',
          tier: 'Tier 2 - Verified Real Estate Investor',
          jurisdiction: 'Commercial Escrow Registry',
          accreditation: 'AML / Escrow Qualified Buyer',
          status: 'Verified Buyer',
          authorityLevel: 'Escrow Depositor / Investor',
          permissions: ['Propose Escrow Deeds', 'Deposit Settlement Funds', 'Receive Conveyance Tokens'],
          nationalRegistryId: 'AML-CLEAR-2026-8812',
          complianceScore: '96% AML Compliant',
        };
      default:
        return {
          idNumber: 'UNVERIFIED-ENTITY',
          tier: 'Tier 0 - Anonymous Public Wallet',
          jurisdiction: 'Unrestricted Public Network',
          accreditation: 'No Government Accreditation',
          status: 'Unverified Guest',
          authorityLevel: 'Read-Only Explorer',
          permissions: ['Inspect Public Ledgers', 'Verify IPFS CIDs'],
          nationalRegistryId: 'N/A',
          complianceScore: '0% Unverified',
        };
    }
  };

  const kyc = getKycDetails(currentAccount.role);

  // Derive mock private key deterministically
  const mockPrivateKey = `0x${currentAccount.address.slice(2).repeat(2).slice(0, 64)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className={`h-13 w-13 rounded-2xl bg-gradient-to-tr ${currentAccount.avatarColor} flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-white`}>
              {currentAccount.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900">{displayName}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[10px] font-bold uppercase tracking-wide border border-orange-200">
                  {currentAccount.role}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  KYC Verified
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                {currentAccount.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Identity & Title Dossier"
              className="h-8 w-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-6 pt-3 border-b border-stone-100 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'profile'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Digital ID & Credentials</span>
          </button>

          <button
            onClick={() => setActiveSubTab('holdings')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'holdings'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Portfolio & Titles</span>
            <span className="px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-700 text-[10px]">
              {ownedProperties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('signature')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'signature'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileSignature className="h-4 w-4" />
            <span>Cryptographic Keys</span>
          </button>

          <button
            onClick={() => setActiveSubTab('activity')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'activity'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>On-Chain History</span>
            <span className="px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-700 text-[10px]">
              {accountTxs.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-stone-700">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Profile details updated successfully for this session.</span>
            </div>
          )}

          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              {/* Wallet Card with Multi-Tier Faucet */}
              <div className="p-5 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-2xl text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-semibold text-stone-300">EVM Signer & Liquidity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Hardhat Testnet (#31337)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
                  <div>
                    <div className="text-[11px] text-stone-400">Available Signer Balance</div>
                    <div className="text-2xl font-black font-mono text-white tracking-tight">
                      {formatEth(currentAccount.balanceEth)}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      ≈ {formatUsd(currentAccount.balanceEth * 3450)} USD (Calculated at $3,450/ETH)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRefill(10)}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                      >
                        <Coins className="h-3.5 w-3.5" />
                        <span>+10 ETH</span>
                      </button>
                      <button
                        onClick={() => handleRefill(50)}
                        className="px-3 py-1.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-100 font-bold text-xs flex items-center gap-1 transition"
                      >
                        <span>+50 ETH</span>
                      </button>
                      <button
                        onClick={() => setShowQr(!showQr)}
                        className="p-1.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 transition"
                        title="Show Wallet QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                    </div>
                    {faucetSuccess && (
                      <div className="text-[10px] font-mono text-emerald-400 text-right">
                        Funds mined into wallet!
                      </div>
                    )}
                  </div>
                </div>

                {showQr && (
                  <div className="p-4 bg-white rounded-xl text-stone-900 flex flex-col items-center justify-center gap-2 animate-in fade-in">
                    <div className="h-28 w-28 bg-stone-900 rounded-lg p-2 flex items-center justify-center text-white font-mono text-[9px] text-center break-all">
                      [QR: {currentAccount.address.slice(0, 18)}...]
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono text-center">
                      Scan with mobile Web3 wallet to receive property tokens or native gas
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-700/60 flex items-center justify-between text-stone-400 text-[11px]">
                  <span className="font-mono">{currentAccount.address}</span>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Editable Profile & Role Meta */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-4 w-4 text-orange-600" />
                    Actor Profile & Contact Information
                  </h4>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}</span>
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold">Display Name:</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full p-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold">Contact Email / Notification Endpoint:</label>
                        <input
                          type="email"
                          value={emailContact}
                          onChange={(e) => setEmailContact(e.target.value)}
                          className="w-full p-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Profile Updates</span>
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <span className="text-[10px] text-stone-400 font-medium">Assigned Identity</span>
                      <div className="font-bold text-stone-900 text-xs">{displayName}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <span className="text-[10px] text-stone-400 font-medium">Notification Endpoint</span>
                      <div className="font-mono font-semibold text-stone-800 text-[11px] truncate">{emailContact}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <span className="text-[10px] text-stone-400 font-medium">Audit Clearance</span>
                      <div className="font-bold text-emerald-700 text-xs">{kyc.complianceScore}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* KYC & Real Estate Accreditation Credentials */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    Government Cadastral Accreditation (ISO-19152 LADM)
                  </h4>
                  <span className="text-[10px] font-mono text-stone-500">Registry: Travis County #TX</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-400 font-medium">National Registry ID / License</span>
                    <div className="font-mono font-bold text-stone-900 text-xs">{kyc.idNumber}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-400 font-medium">Accreditation Tier</span>
                    <div className="font-bold text-emerald-700 text-xs">{kyc.tier}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-400 font-medium">Cadastral Jurisdiction</span>
                    <div className="font-semibold text-stone-800 text-xs">{kyc.jurisdiction}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-400 font-medium">National ID Record</span>
                    <div className="font-mono font-bold text-stone-800 text-xs">{kyc.nationalRegistryId}</div>
                  </div>
                </div>

                {/* Role Permissions & Modifiers */}
                <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80 text-orange-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-orange-900">
                      <Briefcase className="h-4 w-4 text-orange-600" />
                      Smart Contract Modifiers & Role Permissions:
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-orange-200/70 text-orange-900 px-2 py-0.5 rounded-full">
                      {kyc.authorityLevel}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {kyc.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-stone-800 text-[11px] font-medium flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="h-3 w-3 text-orange-600" />
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO & TITLES */}
          {activeSubTab === 'holdings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[11px] text-stone-400">Total Portfolio Real Estate Value</span>
                  <div className="text-2xl font-black font-mono text-orange-400">
                    {formatEth(totalValuation)}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    ≈ {formatUsd(totalValuation * 3450)} USD
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                  <span className="text-[11px] text-stone-500">Registered Land Parcels Held</span>
                  <div className="text-2xl font-black text-stone-900">
                    {ownedProperties.length} <span className="text-xs font-normal text-stone-500">parcels on-chain</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All titles secured via ERC-721 smart deeds
                  </div>
                </div>
              </div>

              {ownedProperties.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <Layers className="h-8 w-8 text-stone-400 mx-auto" />
                  <div className="font-bold text-stone-800 text-xs">No Land Titles Owned Under This Account</div>
                  <p className="text-[11px] text-stone-500 max-w-md mx-auto">
                    Switch to <strong>Alice Vance (Owner A)</strong> or <strong>Land Authority</strong> to view owned real estate or register new land parcels.
                  </p>
                  {onSwitchAccount && (
                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        onClick={() => onSwitchAccount(accounts[1])}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Switch to Alice Vance (Owner)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Secured Title Deeds in Vault
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {ownedProperties.map((prop) => (
                      <div
                        key={prop.propertyId}
                        className="p-4 bg-stone-50 hover:bg-stone-100/80 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900 text-xs">{prop.propertyId}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-stone-200 text-stone-800 font-semibold">
                              {prop.propertyType}
                            </span>
                            {prop.verified && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Verified Deed
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-stone-800">{prop.location}</div>
                          <div className="text-[10px] font-mono text-stone-500">
                            Parcel: {prop.propertyNumber} • Area: {prop.area.toLocaleString()} {prop.areaUnit}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-mono font-black text-stone-900 text-sm">
                              {formatEth(prop.valuationEth)}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              {formatUsd(prop.valuationEth * 3450)}
                            </div>
                          </div>

                          {onOpenCertificate && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenCertificate(prop);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs flex items-center gap-1 transition"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Deed Cert</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CRYPTOGRAPHIC KEYS & SIGNER */}
          {activeSubTab === 'signature' && (
            <div className="space-y-5">
              {/* Private Key & ECDSA Keycard */}
              <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-orange-400 flex items-center gap-1.5">
                    <Key className="h-4 w-4" />
                    Local EVM Secp256k1 Key Pair (Development Mode)
                  </span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1"
                  >
                    {showPrivateKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    <span>{showPrivateKey ? 'Hide Private Key' : 'Reveal Key'}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-stone-400 font-mono">Public EVM Address:</div>
                  <div className="p-2 bg-stone-950 rounded-xl font-mono text-[11px] text-emerald-400 break-all select-all border border-stone-800">
                    {currentAccount.address}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-stone-400 font-mono">Private Signing Key:</div>
                  <div className="p-2 bg-stone-950 rounded-xl font-mono text-[11px] text-amber-300 break-all select-all border border-stone-800 flex items-center justify-between gap-2">
                    <span>{showPrivateKey ? mockPrivateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}</span>
                    {showPrivateKey && (
                      <button
                        onClick={() => handleCopyPrivateKey(mockPrivateKey)}
                        className="text-stone-400 hover:text-white shrink-0"
                      >
                        {customKeyCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Digital Conveyance Signer */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">EIP-191 Digital Conveyance Signer</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Generate cryptographic deed endorsements or title conveyance authorizations using ECDSA signatures.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-stone-700">Deed Clause / Conveyance Message:</label>
                  <textarea
                    value={signMessage}
                    onChange={(e) => setSignMessage(e.target.value)}
                    rows={2}
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleGenerateSignature}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
                >
                  <Key className="h-4 w-4" />
                  <span>Generate Cryptographic Signature</span>
                </button>

                {signatureResult && (
                  <div className="p-4 bg-stone-950 text-stone-200 rounded-2xl space-y-2 font-mono text-[11px] border border-stone-800 animate-in fade-in">
                    <div className="flex items-center justify-between text-orange-400 font-bold">
                      <span>ECDSA Signature String (secp256k1)</span>
                      <span className="text-[10px] text-emerald-400">Cryptographically Valid</span>
                    </div>
                    <div className="p-2 bg-stone-900 rounded-lg text-emerald-300 break-all select-all">
                      {signatureResult}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-400 pt-1">
                      <div>Signer: <span className="text-stone-200">{shortenAddress(currentAccount.address, 6)}</span></div>
                      <div>Standard: <span className="text-stone-200">EIP-191 (Ethereum personal_sign)</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY LOGS */}
          {activeSubTab === 'activity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900">Signed Transactions History</h4>
                <span className="text-[11px] text-stone-500">
                  Total Gas Spent: <strong>{accountTxs.reduce((acc, tx) => acc + tx.gasUsed, 0).toLocaleString()} gas</strong>
                </span>
              </div>

              {accountTxs.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500">
                  No mined transactions recorded for this signer yet. Execute a registration, verification, or transfer to see on-chain receipts.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {accountTxs.map((tx) => (
                    <div
                      key={tx.hash}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between hover:bg-stone-100 transition"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs font-mono">{tx.functionName}()</span>
                          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 rounded border border-emerald-200">
                            Block #{tx.blockNumber}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-stone-500">
                          TX: {shortenAddress(tx.hash, 8)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-xs font-semibold text-stone-800">
                          {tx.gasUsed.toLocaleString()} gas
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-stone-500">
            Hardhat EVM Localhost • Secure Cadastral Registry Node
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
