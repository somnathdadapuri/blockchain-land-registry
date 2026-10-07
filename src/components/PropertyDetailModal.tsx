import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Copy,
  Check,
  Hash,
  AlertTriangle,
  FileCheck2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Property, PropertyStatus } from '../types/blockchain';
import { shortenAddress, formatEth, formatUsd, formatDate } from '../utils/formatters';

interface Props {
  property: Property | null;
  onClose: () => void;
  onOpenTransfer?: (property: Property) => void;
  onVerify?: (propertyId: string) => void;
  isAuthority?: boolean;
}

export const PropertyDetailModal: React.FC<Props> = ({
  property,
  onClose,
  onOpenTransfer,
  onVerify,
  isAuthority,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'ipfs' | 'cadastre'>('overview');

  if (!property) return null;

  const copyToClipboard = (text: string, type: 'hash' | 'id') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.VERIFIED:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            VERIFIED TITLE
          </span>
        );
      case PropertyStatus.REGISTERED:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="h-3.5 w-3.5" />
            REGISTERED (AWAITING VERIFICATION)
          </span>
        );
      case PropertyStatus.TRANSFER_PENDING:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="h-3.5 w-3.5" />
            TRANSFER PENDING
          </span>
        );
      case PropertyStatus.TRANSFERRED:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Check className="h-3.5 w-3.5" />
            TRANSFERRED TITLE
          </span>
        );
      case PropertyStatus.DISPUTED:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            DISPUTED TITLE
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with image banner */}
        <div className="relative h-48 bg-stone-900 overflow-hidden shrink-0">
          <img
            src={property.imageUrl}
            alt={property.propertyId}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header Title Information */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-600 text-white text-xs font-mono font-bold tracking-wider">
                  {property.propertyId}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-md text-xs font-semibold">
                  {property.propertyType}
                </span>
                {getStatusBadge(property.status)}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {property.location}
              </h2>
            </div>
            <div className="text-right hidden sm:block shrink-0">
              <div className="text-xs text-stone-300 font-medium">Estimated Valuation</div>
              <div className="text-xl font-bold text-amber-400">{formatEth(property.valuationEth)}</div>
              <div className="text-[11px] text-stone-400">{formatUsd(property.valuationEth)}</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50/70 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Property Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Ownership Provenance ({property.history.length})
          </button>
          <button
            onClick={() => setActiveTab('ipfs')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ipfs'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            IPFS Deed Document
          </button>
          <button
            onClick={() => setActiveTab('cadastre')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'cadastre'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Cadastral Survey
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-700">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Property Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                  <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Land Area</div>
                  <div className="text-lg font-bold text-stone-900 mt-0.5">
                    {property.area.toLocaleString()} {property.areaUnit}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                  <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Cadastral Parcel</div>
                  <div className="text-sm font-bold font-mono text-stone-900 mt-1">
                    {property.propertyNumber}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                  <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Registered Date</div>
                  <div className="text-xs font-semibold text-stone-900 mt-1">
                    {formatDate(property.registeredAt)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                  <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Zoning Code</div>
                  <div className="text-xs font-bold text-stone-900 mt-1">
                    {property.cadastralZone || 'Zone-R4'}
                  </div>
                </div>
              </div>

              {/* Ownership Wallets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-xs font-semibold text-stone-500 mb-1 flex items-center justify-between">
                    <span>Current Title Owner</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      ACTIVE HOLDER
                    </span>
                  </div>
                  <div className="font-mono text-xs text-stone-900 break-all bg-white p-2.5 rounded-lg border border-stone-200">
                    {property.currentOwner}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-xs font-semibold text-stone-500 mb-1">Previous Owner</div>
                  <div className="font-mono text-xs text-stone-600 break-all bg-white p-2.5 rounded-lg border border-stone-200">
                    {property.previousOwner === '0x0000000000000000000000000000000000000000'
                      ? '0x0000...0000 (Genesis Mint from Authority)'
                      : property.previousOwner}
                  </div>
                </div>
              </div>

              {/* Legal Description */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-orange-600" />
                  Legal Survey & Boundaries Description
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {property.legalDescription || 'Official cadastral title boundaries survey recorded in Travis County Land Registry archive.'}
                </p>
                {property.coordinates && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs font-mono text-stone-500">
                    <MapPin className="h-3.5 w-3.5 text-orange-600" />
                    GPS Coordinates: <span className="font-semibold text-stone-800">{property.coordinates}</span>
                  </div>
                )}
              </div>

              {/* Dispute Warning if any */}
              {property.status === PropertyStatus.DISPUTED && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900">
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Property Under Active Legal Dispute
                  </div>
                  <p className="text-xs text-rose-800">
                    {property.disputeReason || 'Transfers and title modifications are locked until resolved by Land Authority.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 mb-2">
                Every title conveyance is stored immutably on-chain. Below is the full cryptographic provenance chain for {property.propertyId}:
              </div>
              <div className="relative pl-6 border-l-2 border-orange-200 space-y-6">
                {property.history.map((record, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                    <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-orange-900 uppercase tracking-wide bg-orange-100 px-2 py-0.5 rounded text-[10px]">
                          {record.transferType}
                        </span>
                        <span className="text-stone-500 font-mono text-[11px]">
                          Block #{record.blockNumber} • {formatDate(record.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-stone-500">From:</span>
                        <span className="text-stone-800 font-semibold">{shortenAddress(record.from, 6)}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
                        <span className="text-stone-500">To:</span>
                        <span className="text-stone-800 font-semibold">{shortenAddress(record.to, 6)}</span>
                      </div>

                      {record.priceEth !== undefined && record.priceEth > 0 && (
                        <div className="text-stone-600">
                          Transfer Consideration: <strong className="text-stone-900">{formatEth(record.priceEth)}</strong>
                        </div>
                      )}

                      <div className="text-[11px] font-mono text-stone-500 break-all bg-white p-2 rounded border border-stone-200">
                        Tx Hash: {record.transactionHash}
                      </div>

                      {record.notes && <p className="text-[11px] text-stone-600 italic">{record.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ipfs' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      IPFS Document CID Hash
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(property.documentHash, 'hash')}
                    className="flex items-center gap-1 text-xs text-orange-700 hover:text-orange-900 bg-white px-2 py-1 rounded-md border border-orange-200 font-medium"
                  >
                    {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedHash ? 'Copied' : 'Copy Hash'}
                  </button>
                </div>
                <div className="font-mono text-xs text-stone-900 break-all bg-white p-3 rounded-xl border border-orange-200 shadow-xs">
                  ipfs://{property.documentHash}
                </div>
              </div>

              {/* Synthetic Deed Viewer */}
              <div className="border border-stone-300 rounded-2xl p-6 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Decentralized Title Deed Document (Synthetic Artifact)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Cryptographically linked to IPFS CID • SHA-256 Verified
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    IMMUTABLE
                  </span>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl text-xs space-y-3 font-serif border border-stone-200 text-stone-800">
                  <p className="font-bold text-center text-sm uppercase tracking-widest text-stone-900">
                    Certificate of Cadastral Ownership
                  </p>
                  <p className="text-center italic text-stone-600">
                    Issued under the Authority of the Decentralized Web3 Land Registry Protocol
                  </p>
                  <div className="border-t border-b border-stone-200 py-2 space-y-1 font-sans text-xs">
                    <div><strong>PROPERTY IDENTIFIER:</strong> {property.propertyId}</div>
                    <div><strong>PARCEL NUMBER:</strong> {property.propertyNumber}</div>
                    <div><strong>RECORDED OWNER:</strong> {property.currentOwner}</div>
                    <div><strong>PHYSICAL SITUS:</strong> {property.location}</div>
                    <div><strong>SURVEYED AREA:</strong> {property.area} {property.areaUnit}</div>
                    <div><strong>DOCUMENT CID:</strong> {property.documentHash}</div>
                  </div>
                  <p className="text-[11px] text-stone-500 text-center font-sans">
                    Digital Proof: Validated on EVM Smart Contract at block height {property.history[0]?.blockNumber || 18452010}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cadastre' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Cadastral Survey Map Coordinates
                  </span>
                  <span className="text-xs font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    WGS84 Datum
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Cadastral survey boundary vectors are cryptographically referenced and checked against conflicting neighboring parcels to prevent double-registration.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <div className="text-[11px] text-stone-500">Center Geocode:</div>
                    <div className="font-mono font-bold text-xs text-stone-800 mt-0.5">
                      {property.coordinates || '30.2672° N, 97.7431° W'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <div className="text-[11px] text-stone-500">Zoning Designation:</div>
                    <div className="font-bold text-xs text-stone-800 mt-0.5">
                      {property.cadastralZone || 'Zone-R4 (Urban High Density)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!property.verified && isAuthority && onVerify && (
              <button
                onClick={() => {
                  onVerify(property.propertyId);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Title
              </button>
            )}

            {property.verified && property.status !== PropertyStatus.DISPUTED && onOpenTransfer && (
              <button
                onClick={() => {
                  onOpenTransfer(property);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition flex items-center gap-1.5 shadow-xs shadow-orange-600/30"
              >
                <ArrowRight className="h-4 w-4" />
                Initiate Transfer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
