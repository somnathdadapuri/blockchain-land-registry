import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  MapPin,
  FileText,
  UserCheck,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { Property, PropertyStatus, PropertyType, TestAccount, UserRole } from '../types/blockchain';
import { shortenAddress, formatEth, formatUsd, formatDate, generateIpfsCid, triggerConfetti } from '../utils/formatters';

interface Props {
  properties: Property[];
  currentAccount: TestAccount;
  accounts: TestAccount[];
  onRegisterProperty: (data: any) => { success: boolean; txHash?: string; error?: string };
  onVerifyProperty: (propertyId: string) => { success: boolean; txHash?: string; error?: string };
  onSetDispute: (propertyId: string, isDisputed: boolean, reason: string) => { success: boolean; txHash?: string; error?: string };
  onSelectProperty: (property: Property) => void;
}

export const AuthorityDashboard: React.FC<Props> = ({
  properties,
  currentAccount,
  accounts,
  onRegisterProperty,
  onVerifyProperty,
  onSetDispute,
  onSelectProperty,
}) => {
  const isAuthority = currentAccount.role === UserRole.AUTHORITY;

  // Form State
  const [propertyId, setPropertyId] = useState(`PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [propertyNumber, setPropertyNumber] = useState(`CAD-${Math.floor(1000 + Math.random() * 9000)}-TX`);
  const [location, setLocation] = useState('Plot 88, Innovation Parkway, Austin, TX 78702');
  const [coordinates, setCoordinates] = useState('30.2749° N, 97.7404° W');
  const [area, setArea] = useState<number>(3500);
  const [areaUnit, setAreaUnit] = useState<'sq.ft' | 'sq.m' | 'acres'>('sq.ft');
  const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.RESIDENTIAL);
  const [initialOwner, setInitialOwner] = useState<string>(
    accounts.find((a) => a.role === UserRole.OWNER)?.address || accounts[1]?.address || ''
  );
  const [valuationEth, setValuationEth] = useState<number>(120);
  const [documentHash, setDocumentHash] = useState('');
  const [cadastralZone, setCadastralZone] = useState('Zone-R3 (Medium Density Residential)');
  const [legalDescription, setLegalDescription] = useState('Lot 22, Block 14, East Travis Urban Cadastral Substation.');
  const [sampleDeedName, setSampleDeedName] = useState('Official_Cadastral_Deed_Title.pdf');

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dispute form modal state
  const [disputeModalProp, setDisputeModalProp] = useState<Property | null>(null);
  const [disputeReason, setDisputeReason] = useState('Boundary overlap claim filed with Municipal Cadastre Court');
  const [disputeAction, setDisputeAction] = useState<boolean>(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Stats calculation
  const totalProperties = properties.length;
  const verifiedCount = properties.filter((p) => p.verified).length;
  const pendingCount = properties.filter((p) => !p.verified && p.status !== PropertyStatus.DISPUTED).length;
  const disputedCount = properties.filter((p) => p.status === PropertyStatus.DISPUTED).length;
  const totalValuation = properties.reduce((acc, p) => acc + (p.valuationEth || 0), 0);

  const handleGenerateSampleDocHash = () => {
    const cid = generateIpfsCid(`${propertyId}-${propertyNumber}-${location}-${initialOwner}-${Date.now()}`);
    setDocumentHash(cid);
  };

  const handleAutoGenerateId = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    setPropertyId(`PROP-2026-${num}`);
    setPropertyNumber(`CAD-${num}-TX`);
  };

  const handleFillSampleData = () => {
    const samples = [
      {
        loc: '512 Oakwood Boulevard, Travis County, Austin, TX 78701',
        coord: '30.2747° N, 97.7404° W',
        area: 4200,
        type: PropertyType.RESIDENTIAL,
        val: 145,
        zone: 'Zone-R4 (Urban Single-Family)',
        desc: 'Plat Lot 18, Block B, Oakwood Vista Subdivision',
      },
      {
        loc: '108 Commercial Parkway, Suite 400, Houston, TX 77002',
        coord: '29.7604° N, 95.3698° W',
        area: 12500,
        type: PropertyType.COMMERCIAL,
        val: 380,
        zone: 'Zone-C3 (Commercial District)',
        desc: 'Commercial Plat 44, Section 2, Downtown Metrocadastre',
      },
      {
        loc: '880 Heritage Farm Road, Bastrop County, TX 78602',
        coord: '30.1105° N, 97.3153° W',
        area: 25,
        type: PropertyType.AGRICULTURAL,
        val: 210,
        zone: 'Zone-A1 (Agricultural Reserve)',
        desc: 'Tract 12-A, Bastrop County Farm Survey',
      },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const newId = `PROP-2026-${num}`;
    const newNum = `CAD-${num}-TX`;

    setPropertyId(newId);
    setPropertyNumber(newNum);
    setLocation(picked.loc);
    setCoordinates(picked.coord);
    setArea(picked.area);
    setPropertyType(picked.type);
    setValuationEth(picked.val);
    setCadastralZone(picked.zone);
    setLegalDescription(picked.desc);
    setDocumentHash(generateIpfsCid(`${newId}-${newNum}-${picked.loc}`));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const docHashToUse = documentHash || generateIpfsCid(`${propertyId}-${location}`);

    setLoading(true);
    const res = onRegisterProperty({
      propertyId,
      propertyNumber,
      location,
      coordinates,
      area,
      areaUnit,
      propertyType,
      initialOwner,
      valuationEth,
      documentHash: docHashToUse,
      cadastralZone,
      legalDescription,
    });
    setLoading(false);

    if (!res.success) {
      setFormError(res.error || 'Registration failed');
    } else {
      setFormSuccess(`Property ${propertyId} registered on-chain with tx hash: ${res.txHash}`);
      triggerConfetti();
      handleAutoGenerateId();
      setDocumentHash('');
    }
  };

  const handleQuickVerify = (propId: string) => {
    const res = onVerifyProperty(propId);
    if (res.success) {
      triggerConfetti();
    } else {
      alert(res.error);
    }
  };

  const handleDisputeSubmit = () => {
    if (!disputeModalProp) return;
    const res = onSetDispute(disputeModalProp.propertyId, disputeAction, disputeReason);
    if (!res.success) {
      alert(res.error);
    }
    setDisputeModalProp(null);
  };

  const filteredProperties = properties.filter((p) => {
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch =
      !q ||
      (p.propertyId && p.propertyId.toLowerCase().includes(q)) ||
      (p.propertyNumber && p.propertyNumber.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q)) ||
      (p.currentOwner && p.currentOwner.toLowerCase().includes(q));

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'PENDING') return matchesSearch && !p.verified && p.status !== PropertyStatus.DISPUTED;
    return matchesSearch && p.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Role Notice */}
      {!isAuthority && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950">Viewer Notice (Role Simulation Mode):</strong> You are currently logged in as{' '}
              <code>{currentAccount.name}</code> ({currentAccount.role}). In this mode, submitting registrar transactions will simulate
              Solidity <code>onlyAuthorizedRegistrar</code> reverts. Switch to <strong>Land Authority (Admin)</strong> using the wallet dropdown at the top to execute without reverts.
            </div>
          </div>
        </div>
      )}

      {/* Analytics KPI Header */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Parcels</span>
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-1">{totalProperties}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Registered on EVM</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Verified Titles</span>
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{verifiedCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {totalProperties > 0 ? Math.round((verifiedCount / totalProperties) * 100) : 0}% authenticated
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Pending Review</span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Awaiting surveyor check</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Disputed Parcels</span>
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">{disputedCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Transfers locked</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Registry Value</span>
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-1">{formatEth(totalValuation)}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">{formatUsd(totalValuation)} assessed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Register Property Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
                    <PlusCircle className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                    Register New Land Parcel
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Executes <code>registerProperty()</code> on the Solidity smart contract and mints genesis deed provenance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFillSampleData}
                  className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Auto-Fill Sample Parcel
                </button>
                <button
                  type="button"
                  onClick={handleAutoGenerateId}
                  className="text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition"
                >
                  Randomize UID
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* IDs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Property UID <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="e.g. PROP-2026-8821"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Cadastral Parcel Number <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyNumber}
                    onChange={(e) => setPropertyNumber(e.target.value)}
                    placeholder="e.g. CAD-9042-TX"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Physical Location */}
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  Physical Situs / Street Address <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Physical address with city, state, postal code..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:outline-none pl-9"
                  />
                  <MapPin className="h-4 w-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Coordinates & Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    GPS Coordinates
                  </label>
                  <input
                    type="text"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    placeholder="e.g. 30.2672° N, 97.7431° W"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Cadastral Zoning Classification
                  </label>
                  <input
                    type="text"
                    value={cadastralZone}
                    onChange={(e) => setCadastralZone(e.target.value)}
                    placeholder="e.g. Zone-R4 (Urban Residential)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Area & Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Surveyed Area <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={area}
                    onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Unit
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="sq.ft">Square Feet (sq.ft)</option>
                    <option value="sq.m">Square Meters (sq.m)</option>
                    <option value="acres">Acres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Classification
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                  >
                    <option value={PropertyType.RESIDENTIAL}>Residential</option>
                    <option value={PropertyType.COMMERCIAL}>Commercial</option>
                    <option value={PropertyType.AGRICULTURAL}>Agricultural</option>
                    <option value={PropertyType.INDUSTRIAL}>Industrial</option>
                    <option value={PropertyType.SPECIAL_PURPOSE}>Special Purpose</option>
                  </select>
                </div>
              </div>

              {/* Initial Owner & Valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Initial Title Owner Address <span className="text-orange-600">*</span>
                  </label>
                  <div className="space-y-1.5">
                    <select
                      value={initialOwner}
                      onChange={(e) => setInitialOwner(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-mono"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.address} value={acc.address}>
                          {acc.name} ({shortenAddress(acc.address, 6)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Valuation (ETH)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={valuationEth}
                      onChange={(e) => setValuationEth(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-bold">ETH</span>
                  </div>
                </div>
              </div>

              {/* IPFS Deed Generator & Hash */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/70 border border-orange-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Supporting Title Document (IPFS CID) <span className="text-orange-600">*</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateSampleDocHash}
                    className="text-[11px] font-bold text-orange-700 bg-white hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 flex items-center gap-1 shadow-xs transition"
                  >
                    <Sparkles className="h-3 w-3" />
                    Compute Sample Deed CID
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={documentHash}
                    onChange={(e) => setDocumentHash(e.target.value)}
                    placeholder="Qm... (IPFS multihash identifier)"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-orange-300 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Off-chain title deed, boundary survey blueprints, and notary stamps are stored on IPFS. Only the immutable cryptographic CID hash is recorded on-chain to minimize gas costs and safeguard privacy.
                </p>
              </div>

              {/* Error / Success Feedback */}
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Transaction Reverted
                  </div>
                  <p className="font-mono text-[11px] bg-white/70 p-2 rounded">{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Property Registered on EVM!
                  </div>
                  <p className="text-[11px]">{formSuccess}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 disabled:opacity-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  {loading ? 'Submitting to Smart Contract...' : 'Execute registerProperty()'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Verification Queue & Quick Approvals (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Unverified Queue Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Verification Queue
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Maker-checker dual approval step: Unverified titles pending surveyor inspection.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs font-mono">
                {properties.filter((p) => !p.verified && p.status !== PropertyStatus.DISPUTED).length} Pending
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {properties.filter((p) => !p.verified && p.status !== PropertyStatus.DISPUTED).length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-stone-700">Verification Queue Clear</p>
                  <p className="text-stone-400 mt-0.5">All registered properties have been authenticated.</p>
                </div>
              ) : (
                properties
                  .filter((p) => !p.verified && p.status !== PropertyStatus.DISPUTED)
                  .map((prop) => (
                    <div
                      key={prop.propertyId}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-orange-300 transition space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {prop.propertyId}
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          REGISTERED
                        </span>
                      </div>

                      <div className="font-semibold text-stone-800 truncate">{prop.location}</div>

                      <div className="text-[11px] text-stone-500 flex items-center justify-between">
                        <span>Area: {prop.area} {prop.areaUnit}</span>
                        <span className="font-mono font-semibold text-stone-700">{formatEth(prop.valuationEth)}</span>
                      </div>

                      <div className="text-[10px] font-mono text-stone-400 truncate bg-white p-1.5 rounded border border-stone-200">
                        IPFS: {prop.documentHash}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="flex-1 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 font-semibold text-[11px] text-center"
                        >
                          Inspect Deed
                        </button>
                        <button
                          onClick={() => handleQuickVerify(prop.propertyId)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          verifyProperty()
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Quick Dispute Governance Widget */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <h3 className="text-base font-bold text-stone-900">Legal Dispute Control</h3>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                Admin Modifier
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Allows the Land Authority to lock title transfers when court injunctions or boundary contests occur.
            </p>

            <div className="space-y-2">
              {properties.slice(0, 3).map((p) => {
                const isDisputed = p.status === PropertyStatus.DISPUTED;
                return (
                  <div
                    key={p.propertyId}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-stone-900">{p.propertyId}</div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[180px]">{p.location}</div>
                    </div>

                    <button
                      onClick={() => {
                        setDisputeModalProp(p);
                        setDisputeAction(!isDisputed);
                        setDisputeReason(
                          isDisputed
                            ? 'Legal dispute resolved by High Court ruling'
                            : 'Boundary contest filed with Cadastral Court'
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        isDisputed
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {isDisputed ? 'Lift Dispute' : 'Flag Dispute'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cadastral Registry Master Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              On-Chain Cadastral Registry Directory
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live view of all properties registered on the LandRegistry smart contract.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, parcel, location, owner..."
                className="text-xs px-3 py-2 pl-8 rounded-xl border border-stone-300 w-56 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="h-3.5 w-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="PENDING">Pending Verification</option>
              <option value="DISPUTED">Disputed</option>
              <option value="TRANSFERRED">Transferred</option>
            </select>
          </div>
        </div>

        {/* Properties Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Property UID</th>
                <th className="py-3 px-3">Parcel / Type</th>
                <th className="py-3 px-4">Physical Location</th>
                <th className="py-3 px-3">Area</th>
                <th className="py-3 px-4">Current Owner</th>
                <th className="py-3 px-3">Valuation</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filteredProperties.map((prop) => (
                <tr key={prop.propertyId} className="hover:bg-orange-50/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    {prop.propertyId}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-mono text-stone-800 font-semibold">{prop.propertyNumber}</div>
                    <span className="text-[10px] text-stone-500">{prop.propertyType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-stone-900 max-w-xs truncate">{prop.location}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{prop.coordinates}</div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-stone-800">
                    {prop.area.toLocaleString()} {prop.areaUnit}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                      {shortenAddress(prop.currentOwner, 5)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-stone-900 font-mono">
                    {formatEth(prop.valuationEth)}
                  </td>
                  <td className="py-3.5 px-3">
                    {prop.status === PropertyStatus.VERIFIED && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" /> VERIFIED
                      </span>
                    )}
                    {prop.status === PropertyStatus.REGISTERED && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="h-3 w-3" /> REGISTERED
                      </span>
                    )}
                    {prop.status === PropertyStatus.TRANSFERRED && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        TRANSFERRED
                      </span>
                    )}
                    {prop.status === PropertyStatus.TRANSFER_PENDING && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        ESCROW
                      </span>
                    )}
                    {prop.status === PropertyStatus.DISPUTED && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" /> DISPUTED
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-orange-50 hover:border-orange-300 text-stone-800 font-semibold transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Modal */}
      {disputeModalProp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                {disputeAction ? 'Flag Property Dispute' : 'Lift Legal Dispute'}
              </h3>
              <button
                onClick={() => setDisputeModalProp(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2">
              <div>
                <strong>Target Property:</strong> {disputeModalProp.propertyId} ({disputeModalProp.location})
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                  Reason / Court Order Reference
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setDisputeModalProp(null)}
                className="px-3.5 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition ${
                  disputeAction ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {disputeAction ? 'Lock Property & Mark Disputed' : 'Unlock Property & Lift Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
