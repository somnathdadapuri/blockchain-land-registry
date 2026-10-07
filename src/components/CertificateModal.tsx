import React, { useState } from 'react';
import { X, Award, ShieldCheck, QrCode, Printer, CheckCircle2, Lock, Download, Copy, Check, FileText } from 'lucide-react';
import { Property } from '../types/blockchain';
import { shortenAddress, formatEth, formatDate } from '../utils/formatters';
import { downloadFile, generateCertificateData } from '../utils/reportExport';

interface Props {
  property: Property | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ property, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      handleDownloadCert();
    }
  };

  const handleDownloadCert = () => {
    const certText = generateCertificateData(property);
    const filename = `Land_Deed_Certificate_${property.propertyId}.txt`;
    downloadFile(filename, certText, 'text/plain;charset=utf-8');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleCopyCert = () => {
    const certText = generateCertificateData(property);
    navigator.clipboard.writeText(certText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-300 overflow-hidden flex flex-col my-8">
        {/* Actions bar (hidden in print) */}
        <div className="p-4 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-stone-700 font-semibold">
            <Award className="h-4 w-4 text-orange-600" />
            Official Decentralized Title Certificate
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCert}
              title="Download Certificate File (.txt)"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            >
              {downloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
              <span>{downloaded ? 'Downloaded' : 'Download'}</span>
            </button>
            <button
              onClick={handleCopyCert}
              title="Copy Certificate Text"
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / PDF
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="p-8 sm:p-12 bg-gradient-to-b from-amber-50/40 via-white to-orange-50/30 text-stone-900 relative border-8 border-double border-orange-200 m-4 rounded-2xl">
          {/* Subtle Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Award className="w-96 h-96 text-orange-950" />
          </div>

          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/30 mb-2">
              <Award className="h-9 w-9" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-wider uppercase text-stone-900">
              Certificate of Land Title
            </h1>
            <p className="text-xs uppercase tracking-widest text-orange-700 font-bold">
              Decentralized Land Registry Protocol • EVM Network Verified
            </p>
            <div className="w-24 h-0.5 bg-orange-500 mx-auto mt-2" />
          </div>

          <div className="mt-8 space-y-6 text-xs relative z-10">
            <p className="text-center text-stone-600 leading-relaxed max-w-lg mx-auto italic font-serif text-sm">
              This cryptographically asserts that the parcel of real property described herein is immutably recorded in the decentralized cadastral ledger, with undisputed ownership conveyed to the recorded holder.
            </p>

            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">PROPERTY UID:</span>
                <span className="font-bold text-stone-900 text-right">{property.propertyId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">CADASTRAL PARCEL NUMBER:</span>
                <span className="font-bold text-stone-900 text-right">{property.propertyNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">PHYSICAL LOCATION:</span>
                <span className="font-bold text-stone-900 text-right">{property.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">SURVEY AREA:</span>
                <span className="font-bold text-stone-900 text-right">
                  {property.area.toLocaleString()} {property.areaUnit}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">CURRENT TITLE HOLDER:</span>
                <span className="font-bold text-stone-900 text-right text-[11px] truncate">
                  {property.currentOwner}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">REGISTRAR GENERAL:</span>
                <span className="font-bold text-stone-900 text-right text-[11px] truncate">
                  {property.history[0]?.from || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">REGISTRATION DATE:</span>
                <span className="font-bold text-stone-900 text-right">{formatDate(property.registeredAt)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-sans">IPFS DEED DOCUMENT CID:</span>
                <span className="font-bold text-stone-900 text-right text-[11px] truncate">
                  {property.documentHash}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-stone-500 font-sans">ASSESSED VALUATION:</span>
                <span className="font-bold text-orange-600 text-right">
                  {formatEth(property.valuationEth)}
                </span>
              </div>
            </div>

            {/* Seal & Signature Badges */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-stone-200/80">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center p-2 text-center font-mono text-[9px] border-2 border-orange-500">
                  <QrCode className="h-8 w-8 text-orange-400" />
                </div>
                <div className="space-y-0.5 font-sans">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                    Cadastral Registry Seal
                  </div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Verified by Surveyor
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Node: #31337-EVM-TX
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right font-sans">
                <div className="font-serif italic text-base font-bold text-stone-800">
                  State Registrar General
                </div>
                <div className="text-[10px] uppercase tracking-widest text-stone-400">
                  Cadastral Executive Officer
                </div>
                <div className="text-[9px] font-mono text-emerald-700 font-bold mt-0.5">
                  STATUS: TITLE RECORDED ON BLOCKCHAIN
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
