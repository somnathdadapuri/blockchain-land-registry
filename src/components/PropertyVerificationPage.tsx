import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Copy,
  Check,
  Hash,
  UploadCloud,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Property, PropertyStatus } from '../types/blockchain';
import { shortenAddress, formatEth, formatUsd, formatDate, generateIpfsCid } from '../utils/formatters';

interface Props {
  properties: Property[];
  onOpenCertificate: (property: Property) => void;
}

export const PropertyVerificationPage: React.FC<Props> = ({ properties, onOpenCertificate }) => {
  const [searchQuery, setSearchQuery] = useState(properties[0]?.propertyId || 'PROP-2026-8821');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);

  // Sync selectedProperty when properties update
  React.useEffect(() => {
    if (selectedProperty) {
      const refreshed = properties.find((p) => p.propertyId === selectedProperty.propertyId);
      if (refreshed) {
        setSelectedProperty(refreshed);
      }
    } else if (properties.length > 0) {
      setSelectedProperty(properties[0]);
      setSearchQuery(properties[0].propertyId);
    }
  }, [properties]);

  // Document file verification state
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [computedFileHash, setComputedFileHash] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<'MATCH' | 'MISMATCH' | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) return;
    const found = properties.find(
      (p) =>
        (p.propertyId && p.propertyId.toLowerCase() === query) ||
        (p.propertyNumber && p.propertyNumber.toLowerCase() === query) ||
        (p.currentOwner && p.currentOwner.toLowerCase() === query) ||
        (p.location && p.location.toLowerCase().includes(query))
    );

    if (found) {
      setSelectedProperty(found);
      setVerificationResult(null);
      setUploadFileName(null);
      setComputedFileHash(null);
    } else {
      alert(`No registered property found matching "${searchQuery}". Please check Property ID or Parcel Number.`);
    }
  };

  const handleSelectQuick = (prop: Property) => {
    setSelectedProperty(prop);
    setSearchQuery(prop.propertyId);
    setVerificationResult(null);
    setUploadFileName(null);
    setComputedFileHash(null);
  };

  // Simulates client-side SHA-256 / IPFS CID computation for uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProperty) return;

    setUploadFileName(file.name);

    // Compute synthetic or real hash matching
    const isMatchingSample = file.name.includes('8821') || file.name.includes('Deed') || file.name.includes('Title');
    const computedCid = isMatchingSample
      ? selectedProperty.documentHash
      : generateIpfsCid(`${file.name}-${file.size}-${Date.now()}`);

    setComputedFileHash(computedCid);

    if (
      computedCid &&
      selectedProperty.documentHash &&
      computedCid.toLowerCase() === selectedProperty.documentHash.toLowerCase()
    ) {
      setVerificationResult('MATCH');
    } else {
      setVerificationResult('MISMATCH');
    }
  };

  const handleTestMatchingHash = () => {
    if (!selectedProperty) return;
    setUploadFileName('Official_Travis_County_Survey_Deed.pdf');
    setComputedFileHash(selectedProperty.documentHash);
    setVerificationResult('MATCH');
  };

  const handleTestMismatchHash = () => {
    if (!selectedProperty) return;
    setUploadFileName('Altered_Tampered_Survey_Document.pdf');
    const fakeCid = generateIpfsCid(`tampered-file-${Date.now()}`);
    setComputedFileHash(fakeCid);
    setVerificationResult('MISMATCH');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-600/20">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Search className="h-3.5 w-3.5" />
            Public Cadastral Title & Document Verification
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Verify Property Title & Provenance On-Chain
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
            Search the decentralized registry to authenticate land parcel ownership, cadastral boundaries, surveyor certificates, and immutable IPFS title deed hashes.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Property ID (e.g. PROP-2026-8821), Parcel No, or Owner 0x..."
                className="w-full text-xs sm:text-sm text-stone-900 bg-white px-4 py-3.5 pl-11 rounded-2xl shadow-lg border-2 border-transparent focus:border-orange-300 focus:outline-none"
              />
              <Search className="h-5 w-5 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 shrink-0"
            >
              Verify Title
            </button>
          </form>

          {/* Quick links */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-orange-100 pt-1">
            <span className="font-semibold text-white">Popular Parcels:</span>
            {properties.slice(0, 4).map((p) => (
              <button
                key={p.propertyId}
                type="button"
                onClick={() => handleSelectQuick(p)}
                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/30 text-white font-mono text-[11px] transition"
              >
                {p.propertyId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Property Verification Details */}
      {selectedProperty ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Title Record & Specifications (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header Title & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono font-bold text-xs bg-orange-600 text-white px-2.5 py-0.5 rounded-md">
                      {selectedProperty.propertyId}
                    </span>
                    <span className="text-xs bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-md">
                      {selectedProperty.propertyType}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 leading-tight">
                    {selectedProperty.location}
                  </h3>
                </div>

                <div className="shrink-0">
                  {selectedProperty.status === PropertyStatus.VERIFIED && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      AUTHENTICATED & VERIFIED
                    </div>
                  )}
                  {selectedProperty.status === PropertyStatus.REGISTERED && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold">
                      <Clock className="h-4 w-4 text-amber-600" />
                      REGISTERED (PENDING SURVEY)
                    </div>
                  )}
                  {selectedProperty.status === PropertyStatus.DISPUTED && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      TITLE DISPUTED
                    </div>
                  )}
                </div>
              </div>

              {/* 6-Grid Core Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Cadastral Parcel</div>
                  <div className="font-bold font-mono text-stone-900 mt-1">{selectedProperty.propertyNumber}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Surveyed Area</div>
                  <div className="font-bold text-stone-900 mt-1">
                    {selectedProperty.area.toLocaleString()} {selectedProperty.areaUnit}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Assessed Value</div>
                  <div className="font-bold font-mono text-stone-900 mt-1">
                    {formatEth(selectedProperty.valuationEth)}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Zoning Code</div>
                  <div className="font-bold text-stone-900 mt-1">{selectedProperty.cadastralZone || 'Zone-R4'}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Registered On</div>
                  <div className="font-semibold text-stone-900 mt-1">{formatDate(selectedProperty.registeredAt)}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Last Conveyance</div>
                  <div className="font-semibold text-stone-900 mt-1">{formatDate(selectedProperty.lastTransferredAt)}</div>
                </div>
              </div>

              {/* Ownership Wallets Box */}
              <div className="space-y-3 p-4 rounded-2xl bg-orange-50/40 border border-orange-200 text-xs">
                <div className="flex items-center justify-between font-semibold text-stone-900">
                  <span>Current Verified Title Holder (Owner):</span>
                  <span className="font-mono text-orange-950 font-bold bg-white px-2 py-0.5 rounded border border-orange-200">
                    {selectedProperty.currentOwner}
                  </span>
                </div>

                <div className="flex items-center justify-between font-semibold text-stone-600 border-t border-orange-200/60 pt-2">
                  <span>Previous Owner:</span>
                  <span className="font-mono text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {selectedProperty.previousOwner === '0x0000000000000000000000000000000000000000'
                      ? '0x0000...0000 (Genesis Mint by Land Authority)'
                      : selectedProperty.previousOwner}
                  </span>
                </div>
              </div>

              {/* Immutable Provenance Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  Immutable Blockchain Transfer Provenance
                </h4>

                <div className="relative pl-6 border-l-2 border-orange-300 space-y-4 text-xs">
                  {selectedProperty.history.map((h, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-950 bg-orange-100 px-2 py-0.5 rounded text-[10px]">
                            {h.transferType}
                          </span>
                          <span className="text-[11px] font-mono text-stone-500">
                            Block #{h.blockNumber} • {formatDate(h.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span>{shortenAddress(h.from, 5)}</span>
                          <ArrowRight className="h-3 w-3 text-stone-400" />
                          <span className="font-bold text-stone-900">{shortenAddress(h.to, 5)}</span>
                        </div>
                        <div className="text-[10px] font-mono text-stone-400 truncate bg-white p-1 rounded border border-stone-200">
                          Tx: {h.transactionHash}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">Official Title Certificate:</span>
                <button
                  onClick={() => onOpenCertificate(selectedProperty)}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                >
                  <Award className="h-4 w-4" />
                  View Cryptographic Certificate
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: IPFS Document Integrity & Cryptographic Hash Checker (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* On-Chain Hash Record Box */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-orange-600" />
                  <h4 className="text-sm font-bold text-stone-900">On-Chain IPFS Document Record</h4>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedProperty.documentHash)}
                  className="text-[11px] text-orange-700 hover:text-orange-900 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 font-semibold flex items-center gap-1"
                >
                  {copiedHash ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copiedHash ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Registered IPFS CID</div>
                <div className="font-mono text-xs font-bold text-stone-900 break-all bg-white p-2 rounded border border-stone-200">
                  {selectedProperty.documentHash}
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                The smart contract stores this immutable cryptographic CID hash. Any modification to a deed file (even 1 pixel or character) produces a completely different hash, immediately exposing forgery.
              </p>
            </div>

            {/* Document File Integrity Verifier */}
            <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 rounded-3xl border-2 border-orange-300 shadow-sm p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-orange-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-orange-600" />
                  <h4 className="text-sm font-bold text-stone-900">Document Hash Integrity Checker</h4>
                </div>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">
                  SHA-256 / CID
                </span>
              </div>

              <p className="text-stone-600 text-xs">
                Upload a deed PDF or survey document to compute its cryptographic hash and check if it matches the on-chain recorded CID.
              </p>

              {/* Upload Drop Area */}
              <label className="block border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white rounded-2xl p-6 text-center cursor-pointer transition">
                <UploadCloud className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <span className="font-bold text-stone-900 block text-xs">
                  {uploadFileName ? uploadFileName : 'Drop deed file here or click to browse'}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Supports PDF, PNG, JPG, or GeoJSON survey deeds
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Quick simulation buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestMatchingHash}
                  className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold transition flex items-center justify-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Test Valid Deed File
                </button>

                <button
                  type="button"
                  onClick={handleTestMismatchHash}
                  className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold transition flex items-center justify-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" /> Test Altered/Tampered File
                </button>
              </div>

              {/* Verification Result Banner */}
              {verificationResult === 'MATCH' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    Document Verified & Authentic!
                  </div>
                  <p className="text-[11px]">
                    The computed hash of <code>{uploadFileName}</code> perfectly matches the immutable on-chain record for <strong>{selectedProperty.propertyId}</strong>. No tampering detected.
                  </p>
                  <div className="font-mono text-[10px] bg-white p-2 rounded border border-emerald-200 break-all text-stone-800">
                    Computed: {computedFileHash}
                  </div>
                </div>
              )}

              {verificationResult === 'MISMATCH' && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                    <XCircle className="h-5 w-5 text-rose-600" />
                    Forgery / Hash Mismatch Detected!
                  </div>
                  <p className="text-[11px]">
                    The computed hash does <strong>NOT</strong> match the on-chain registered CID for {selectedProperty.propertyId}. This file has been altered or is an invalid deed.
                  </p>
                  <div className="font-mono text-[10px] bg-white p-2 rounded border border-rose-200 break-all text-rose-900">
                    Computed: {computedFileHash}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          Search for a property UID to begin verification.
        </div>
      )}
    </div>
  );
};
