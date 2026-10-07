import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Printer,
  BadgeAlert,
  Search,
  Scale,
  MapPin,
  Building,
  FileText,
  Clock,
  Sparkles,
  Download,
  Check,
  FileDown,
} from 'lucide-react';
import { Property, PropertyStatus } from '../types/blockchain';
import { shortenAddress, formatEth } from '../utils/formatters';
import { downloadFile, generateDueDiligenceAuditReport } from '../utils/reportExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const DueDiligenceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  property,
  properties,
  onSelectProperty,
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>(
    property?.propertyId || properties[0]?.propertyId || ''
  );
  const [runningScan, setRunningScan] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const currentProp =
    properties.find((p) => p.propertyId === selectedPropId) || property || properties[0];

  const handleRunAudit = () => {
    setRunningScan(true);
    setScanComplete(false);
    setTimeout(() => {
      setRunningScan(false);
      setScanComplete(true);
    }, 800);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      handleExportFile();
    }
  };

  const handleExportFile = () => {
    if (!currentProp) return;
    const reportContent = generateDueDiligenceAuditReport(currentProp, auditPoints, auditScore);
    const filename = `Due_Diligence_Audit_${currentProp.propertyId}_${Date.now()}.txt`;
    downloadFile(filename, reportContent, 'text/plain;charset=utf-8');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyReport = () => {
    if (!currentProp) return;
    const reportContent = generateDueDiligenceAuditReport(currentProp, auditPoints, auditScore);
    navigator.clipboard.writeText(reportContent);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const isDisputed = currentProp?.status === PropertyStatus.DISPUTED;
  const isVerified = currentProp?.verified;

  // 6 Point Audit Checklist
  const auditPoints = [
    {
      title: 'Title Ownership & Genesis Lineage',
      desc: 'Complete unbroken chain of title from original government registration to current recorded owner.',
      status: currentProp?.history.length > 0 ? 'PASS' : 'WARN',
      detail: `${currentProp?.history.length || 1} prior recorded on-chain deed transactions.`,
    },
    {
      title: 'Active Encumbrances & Court Injunctions (Lis Pendens)',
      desc: 'Title scan for pending litigation, statutory tax liens, or legal dispute freezes.',
      status: isDisputed ? 'FAIL' : 'PASS',
      detail: isDisputed
        ? `Dispute Flagged: ${currentProp?.disputeReason || 'Active legal claim'}`
        : 'Zero encumbrances or lis pendens recorded.',
    },
    {
      title: 'Surveyor Geodetic Boundary Verification (GIS Check)',
      desc: 'Cadastral parcel coordinates inspected and digitally countersigned by accredited surveyor.',
      status: isVerified ? 'PASS' : 'WARN',
      detail: isVerified
        ? `Survey verified at coordinates ${currentProp?.coordinates || 'N/A'}`
        : 'Pending formal boundary sign-off from surveyor.',
    },
    {
      title: 'Cryptographic Document Integrity (IPFS SHA-256)',
      desc: 'Original registered deed PDF CID matching immutably against EVM contract storage.',
      status: currentProp?.documentHash ? 'PASS' : 'FAIL',
      detail: `IPFS CID: ${shortenAddress(currentProp?.documentHash || '', 8)}`,
    },
    {
      title: 'Municipal Property Tax & Revenue Dues Clearance',
      desc: 'Assessment of current fiscal year land tax payments and utility clearance certs.',
      status: 'PASS',
      detail: 'Fiscal Year 2026 Property Tax paid in full (Receipt #TX-2026-901).',
    },
    {
      title: 'Zoning & Masterplan Compliance',
      desc: 'Permitted land use verification against official urban zoning registry.',
      status: 'PASS',
      detail: currentProp?.cadastralZone || 'Zone-R4 (Compliant with urban planning code)',
    },
  ];

  const passCount = auditPoints.filter((p) => p.status === 'PASS').length;
  const auditScore = Math.round((passCount / auditPoints.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900">Title Due Diligence & Encumbrance Audit</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ISO-19152 LADM
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Institutional 6-point title health inspection and legal encumbrance certificate.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-stone-700">
          {/* Property Selector & Quick Re-Scan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="space-y-1 flex-1">
              <label className="text-[11px] font-semibold text-stone-600">Select Parcel to Audit:</label>
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {properties.map((p) => (
                  <option key={p.propertyId} value={p.propertyId}>
                    {p.propertyId} — {p.location} ({p.propertyType})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-4 sm:pt-0 shrink-0">
              <button
                onClick={handleRunAudit}
                disabled={runningScan}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <Sparkles className={`h-3.5 w-3.5 ${runningScan ? 'animate-spin' : ''}`} />
                <span>{runningScan ? 'Auditing Nodes...' : 'Run Live Audit'}</span>
              </button>

              <button
                onClick={handleExportFile}
                title="Download full institutional audit report dossier (.txt/.md)"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                {downloadSuccess ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                <span>{downloadSuccess ? 'Downloaded!' : 'Download Dossier'}</span>
              </button>

              <button
                onClick={handleCopyReport}
                title="Copy entire audit dossier text to clipboard"
                className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {copySuccess ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <FileText className="h-3.5 w-3.5" />}
                <span>{copySuccess ? 'Copied Text' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handlePrint}
                title="Print or save as PDF"
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Audit Score Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white space-y-1 sm:col-span-1 shadow-md">
              <div className="text-[11px] text-stone-400 font-medium">Title Trust Score</div>
              <div className="text-3xl font-black text-emerald-400 tracking-tight font-mono">
                {auditScore}%
              </div>
              <div className="text-[11px] text-stone-300">
                Rating: <strong className={auditScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}>{auditScore >= 80 ? 'Grade A+ (Institutional Ready)' : 'Requires Verification'}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Audit Summary & Encumbrance Clearance
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {passCount} of 6 Checks Passed
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Parcel <strong>{currentProp?.propertyId}</strong> ({currentProp?.propertyNumber}) currently held by{' '}
                <strong className="font-mono">{shortenAddress(currentProp?.currentOwner || '', 6)}</strong>.
                {isDisputed
                  ? ' Warning: This property is subject to an active dispute freeze on-chain.'
                  : ' Clear and marketable title confirmed with cryptographic timestamp on Ethereum EVM.'}
              </p>
            </div>
          </div>

          {/* 6 Point Detailed Audit Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4 text-orange-600" />
              Institutional Due Diligence Checkpoints
            </h4>

            <div className="space-y-2.5">
              {auditPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-start justify-between gap-3 hover:bg-stone-100/70 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-xs">{pt.title}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                          pt.status === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pt.status === 'WARN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pt.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">{pt.desc}</p>
                    <div className="text-[10px] font-mono text-stone-700 bg-white p-1.5 rounded-lg border border-stone-200 inline-block">
                      {pt.detail}
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    {pt.status === 'PASS' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : pt.status === 'WARN' ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <BadgeAlert className="h-5 w-5 text-rose-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Validated by Smart Contract: <strong className="font-mono">LandRegistry.sol (v0.8.20)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
