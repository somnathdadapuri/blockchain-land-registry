import React, { useState } from 'react';
import {
  Home,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  AlertTriangle,
  FileText,
  MapPin,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Property, PropertyStatus, TestAccount, UserRole } from '../types/blockchain';
import { shortenAddress, formatEth, formatUsd, formatDate } from '../utils/formatters';

interface Props {
  properties: Property[];
  currentAccount: TestAccount;
  accounts: TestAccount[];
  onOpenTransfer: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
  onOpenCertificate: (property: Property) => void;
  onSelectAccount?: (account: TestAccount) => void;
}

export const OwnerDashboard: React.FC<Props> = ({
  properties,
  currentAccount,
  accounts,
  onOpenTransfer,
  onSelectProperty,
  onOpenCertificate,
  onSelectAccount,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [scopeMode, setScopeMode] = useState<'owned' | 'all'>('owned');

  // Filter properties owned by the current active account
  const myProperties = properties.filter(
    (p) =>
      p.currentOwner &&
      currentAccount?.address &&
      p.currentOwner.toLowerCase() === currentAccount.address.toLowerCase()
  );

  const displayProperties = scopeMode === 'owned' ? myProperties : properties;

  const totalArea = myProperties.reduce((acc, p) => acc + p.area, 0);
  const totalValuationEth = myProperties.reduce((acc, p) => acc + (p.valuationEth || 0), 0);
  const verifiedCount = myProperties.filter((p) => p.verified).length;

  const filteredProperties = displayProperties.filter((p) => {
    if (filterType === 'ALL') return true;
    return p.propertyType === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Portfolio Header Stats */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-600/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Deed Title Portfolio
              </span>
              <span className="text-xs text-orange-100 font-mono">
                {shortenAddress(currentAccount.address, 6)}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">{currentAccount.name}</h2>
            <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
              {currentAccount.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-right">
              <div className="text-xs text-orange-100 font-medium">Estimated Title Value</div>
              <div className="text-2xl font-black text-white">{formatEth(totalValuationEth)}</div>
              <div className="text-[11px] text-orange-200">{formatUsd(totalValuationEth)}</div>
            </div>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
          <div>
            <div className="text-xs text-orange-100 font-medium">Properties Owned</div>
            <div className="text-xl font-bold text-white mt-0.5">{myProperties.length}</div>
          </div>
          <div>
            <div className="text-xs text-orange-100 font-medium">Verified On-Chain</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">
              {verifiedCount} of {myProperties.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-orange-100 font-medium">Wallet Balance</div>
            <div className="text-xl font-bold text-white mt-0.5 font-mono">{formatEth(currentAccount.balanceEth)}</div>
          </div>
          <div>
            <div className="text-xs text-orange-100 font-medium">Total Area Footprint</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {totalArea.toLocaleString()} sq. units
            </div>
          </div>
        </div>
      </div>

      {/* Property Cards Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Home className="h-5 w-5 text-orange-600" />
              {scopeMode === 'owned' ? 'My Real Estate Titles' : 'All Registered Land Titles'}
            </h3>
            <p className="text-xs text-stone-500">
              {scopeMode === 'owned'
                ? 'Only recorded title owners can initiate transferOwnership() or request escrow conveyance.'
                : 'Viewing all on-chain registered parcels across the EVM state.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-stone-200/70 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setScopeMode('owned')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  scopeMode === 'owned'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                My Titles ({myProperties.length})
              </button>
              <button
                onClick={() => setScopeMode('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  scopeMode === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Parcels ({properties.length})
              </button>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-stone-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="ALL">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Industrial">Industrial</option>
              <option value="Special Purpose">Special Purpose</option>
            </select>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500 space-y-4">
            <Home className="h-12 w-12 text-stone-300 mx-auto" />
            <h4 className="text-base font-bold text-stone-800">No Properties Owned by Active Account</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Active account (<strong>{currentAccount.name}</strong>) does not hold any registered deeds under this filter. Switch to an owner wallet below or toggle to view all parcels:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {accounts
                .filter((a) => a.role === UserRole.OWNER)
                .map((acc) => (
                  <button
                    key={acc.address}
                    onClick={() => {
                      if (onSelectAccount) onSelectAccount(acc);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    Switch to {acc.name}
                  </button>
                ))}
              <button
                onClick={() => setScopeMode('all')}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition"
              >
                Browse All Parcels ({properties.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => {
              const isDisputed = prop.status === PropertyStatus.DISPUTED;
              const isPending = prop.status === PropertyStatus.TRANSFER_PENDING;

              return (
                <div
                  key={prop.propertyId}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col group"
                >
                  {/* Property Image Header */}
                  <div className="relative h-48 bg-stone-900 overflow-hidden">
                    <img
                      src={prop.imageUrl}
                      alt={prop.propertyId}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-orange-600 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {prop.propertyId}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                        {prop.propertyType}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {prop.verified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <ShieldCheck className="h-3 w-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <Clock className="h-3 w-3" /> UNVERIFIED
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div className="text-white">
                        <div className="text-xs text-orange-200 font-mono font-medium">
                          {prop.propertyNumber}
                        </div>
                        <div className="text-sm font-bold truncate max-w-[200px]">{prop.location}</div>
                      </div>
                      <div className="text-right text-white">
                        <div className="text-xs font-bold text-amber-300">{formatEth(prop.valuationEth)}</div>
                        <div className="text-[10px] text-stone-300">{formatUsd(prop.valuationEth)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-stone-600">
                        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                          <div className="text-[10px] text-stone-400 uppercase font-semibold">Survey Area</div>
                          <div className="font-bold text-stone-900 mt-0.5">
                            {prop.area.toLocaleString()} {prop.areaUnit}
                          </div>
                        </div>

                        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                          <div className="text-[10px] text-stone-400 uppercase font-semibold">Zoning Code</div>
                          <div className="font-bold text-stone-900 mt-0.5 truncate">
                            {prop.cadastralZone || 'Zone-R4'}
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-orange-50/50 rounded-xl border border-orange-200/80 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-stone-600">IPFS Document CID:</span>
                        <span className="font-mono text-[10px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200">
                          {shortenAddress(prop.documentHash, 6)}
                        </span>
                      </div>

                      {isDisputed && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                          <span>Title Disputed: Transfers locked pending court resolution.</span>
                        </div>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs text-center transition"
                      >
                        Inspect Title
                      </button>

                      <button
                        onClick={() => onOpenCertificate(prop)}
                        title="View Official Certificate of Title"
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition"
                      >
                        <Award className="h-4 w-4 text-amber-700" />
                      </button>

                      <button
                        onClick={() => onOpenTransfer(prop)}
                        disabled={isDisputed}
                        className={`flex-1 py-2 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-xs ${
                          isDisputed
                            ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                            : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/30'
                        }`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Transfer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
