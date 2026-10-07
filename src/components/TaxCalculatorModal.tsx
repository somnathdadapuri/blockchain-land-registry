import React, { useState } from 'react';
import {
  X,
  Calculator,
  Building,
  DollarSign,
  Receipt,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Printer,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Property, PropertyType } from '../types/blockchain';
import { formatEth, formatUsd } from '../utils/formatters';
import { downloadFile, generateClosingStatement } from '../utils/reportExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialProperty?: Property | null;
  properties: Property[];
}

export const TaxCalculatorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialProperty,
  properties,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialProperty?.propertyId || properties[0]?.propertyId || ''
  );
  const [valuationEth, setValuationEth] = useState<number>(
    initialProperty?.valuationEth || 150
  );
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialProperty?.propertyType || PropertyType.RESIDENTIAL
  );
  const [jurisdiction, setJurisdiction] = useState<'TX' | 'CA' | 'NY' | 'IN' | 'UK'>('TX');
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const ethPriceUsd = 3450;
  const valuationUsd = valuationEth * ethPriceUsd;

  // Real estate closing fees calculation based on jurisdiction and property type
  const getTaxRates = () => {
    switch (jurisdiction) {
      case 'TX':
        return { name: 'Texas (Travis County)', stampDuty: 0.025, registrySurcharge: 0.005, titleInsurance: 0.006 };
      case 'CA':
        return { name: 'California (Napa County)', stampDuty: 0.038, registrySurcharge: 0.008, titleInsurance: 0.007 };
      case 'NY':
        return { name: 'New York (Manhattan)', stampDuty: 0.045, registrySurcharge: 0.012, titleInsurance: 0.008 };
      case 'IN':
        return { name: 'Maharashtra (India Cadastre)', stampDuty: 0.060, registrySurcharge: 0.010, titleInsurance: 0.005 };
      case 'UK':
        return { name: 'London (HM Land Registry)', stampDuty: 0.050, registrySurcharge: 0.006, titleInsurance: 0.004 };
      default:
        return { name: 'Standard Cadastre', stampDuty: 0.030, registrySurcharge: 0.005, titleInsurance: 0.005 };
    }
  };

  const rates = getTaxRates();
  const effectiveStampRate = isFirstTimeBuyer ? Math.max(0.01, rates.stampDuty - 0.015) : rates.stampDuty;

  const stampDutyEth = valuationEth * effectiveStampRate;
  const registrySurchargeEth = valuationEth * rates.registrySurcharge;
  const titleInsuranceEth = valuationEth * rates.titleInsurance;
  const gasFeeEstimateEth = 0.0085; // Simulated EVM transaction fee

  const totalClosingFeesEth = stampDutyEth + registrySurchargeEth + titleInsuranceEth + gasFeeEstimateEth;
  const grandTotalEth = valuationEth + totalClosingFeesEth;

  const handleSelectProperty = (propId: string) => {
    setSelectedPropertyId(propId);
    const found = properties.find((p) => p.propertyId === propId);
    if (found) {
      setValuationEth(found.valuationEth || 100);
      setPropertyType(found.propertyType);
    }
  };

  const getStatementData = () => {
    const selectedProp = properties.find((p) => p.propertyId === selectedPropertyId);
    return {
      propertyId: selectedPropertyId || 'PARCEL-ESTIMATE',
      location: selectedProp?.location || 'General Jurisdiction Municipality',
      jurisdictionName: rates.name,
      valuationEth,
      valuationUsd,
      stampDutyEth,
      registrySurchargeEth,
      titleInsuranceEth,
      gasFeeEth: gasFeeEstimateEth,
      totalClosingFeesEth,
      grandTotalEth,
      grandTotalUsd: grandTotalEth * ethPriceUsd,
      isFirstTimeBuyer,
    };
  };

  const handleDownloadStatement = () => {
    const data = getStatementData();
    const statement = generateClosingStatement(data);
    const filename = `Closing_Statement_${data.propertyId}_${Date.now()}.txt`;
    downloadFile(filename, statement, 'text/plain;charset=utf-8');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyStatement = () => {
    const data = getStatementData();
    const statement = generateClosingStatement(data);
    navigator.clipboard.writeText(statement);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      handleDownloadStatement();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center shadow-xs">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Stamp Duty & Closing Cost Calculator</h3>
              <p className="text-xs text-stone-500">
                Official automated land tax, registry fees, and title insurance estimator.
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
          {/* Inputs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-semibold text-stone-700">Select Existing Property (Optional):</label>
              <select
                value={selectedPropertyId}
                onChange={(e) => handleSelectProperty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">Custom Parcel Assessment</option>
                {properties.map((p) => (
                  <option key={p.propertyId} value={p.propertyId}>
                    {p.propertyId} — {p.location} ({formatEth(p.valuationEth)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-700">Cadastral Valuation (ETH):</label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="1"
                  value={valuationEth}
                  onChange={(e) => setValuationEth(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none pr-14"
                />
                <span className="absolute right-3 top-2.5 text-stone-400 font-mono text-xs">ETH</span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                ≈ {formatUsd(valuationUsd)} (at $3,450/ETH)
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-700">Jurisdiction / Cadastral District:</label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="TX">Texas (Travis County) - 2.5%</option>
                <option value="CA">California (Napa County) - 3.8%</option>
                <option value="NY">New York (Manhattan) - 4.5%</option>
                <option value="IN">Maharashtra (India) - 6.0%</option>
                <option value="UK">London (HM Land Registry) - 5.0%</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-700">Property Classification:</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value={PropertyType.RESIDENTIAL}>Residential</option>
                <option value={PropertyType.COMMERCIAL}>Commercial</option>
                <option value={PropertyType.AGRICULTURAL}>Agricultural</option>
                <option value={PropertyType.INDUSTRIAL}>Industrial</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="firstTime"
                checked={isFirstTimeBuyer}
                onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 border-stone-300"
              />
              <label htmlFor="firstTime" className="text-xs text-stone-700 font-semibold cursor-pointer">
                First-Time Home Buyer (1.5% Stamp Duty Concession)
              </label>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-orange-600" />
                Fee Breakdown & Stamp Duty Assessment
              </span>
              <span className="text-[10px] text-stone-500 font-mono">{rates.name}</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">
                  Stamp Duty & Land Tax ({(effectiveStampRate * 100).toFixed(1)}%):
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {formatEth(stampDutyEth)} ({formatUsd(stampDutyEth * ethPriceUsd)})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">
                  Cadastral Registry Surcharge ({(rates.registrySurcharge * 100).toFixed(1)}%):
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {formatEth(registrySurchargeEth)} ({formatUsd(registrySurchargeEth * ethPriceUsd)})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">
                  Title Insurance & Escrow Underwriting ({(rates.titleInsurance * 100).toFixed(1)}%):
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {formatEth(titleInsuranceEth)} ({formatUsd(titleInsuranceEth * ethPriceUsd)})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">Estimated EVM Smart Contract Gas Fee:</span>
                <span className="font-mono font-bold text-stone-900">
                  {formatEth(gasFeeEstimateEth)} ({formatUsd(gasFeeEstimateEth * ethPriceUsd)})
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-bold text-xs">
                <span className="text-stone-900">Total Statutory Closing Fees:</span>
                <span className="font-mono text-orange-700 text-sm">
                  {formatEth(totalClosingFeesEth)} ({formatUsd(totalClosingFeesEth * ethPriceUsd)})
                </span>
              </div>
            </div>

            {/* Total Settlement Box */}
            <div className="p-4 bg-orange-100/70 rounded-xl border border-orange-300 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-orange-950">
                  Grand Total Buyer Consideration (Purchase + Closing)
                </div>
                <div className="text-xl font-black font-mono text-orange-950 mt-0.5">
                  {formatEth(grandTotalEth)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-orange-800 font-medium">Fiat Valuation</div>
                <div className="text-sm font-bold text-orange-900 font-mono">
                  {formatUsd(grandTotalEth * ethPriceUsd)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadStatement}
              title="Download official real estate closing statement (.txt)"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
            >
              {downloadSuccess ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Statement'}</span>
            </button>

            <button
              onClick={handleCopyStatement}
              title="Copy closing statement to clipboard"
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition"
            >
              {copySuccess ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copySuccess ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print closing statement"
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition hidden sm:flex"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition ml-auto"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
