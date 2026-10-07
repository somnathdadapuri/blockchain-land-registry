import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  User,
  Coins,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Property, TestAccount, PropertyStatus, UserRole } from '../types/blockchain';
import { shortenAddress, formatEth, formatUsd } from '../utils/formatters';
import { generateIpfsCid, triggerConfetti } from '../utils/formatters';

interface Props {
  property: Property | null;
  currentAccount: TestAccount;
  accounts: TestAccount[];
  onClose: () => void;
  onExecuteTransfer: (
    propertyId: string,
    newOwnerAddress: string,
    newDocHash: string,
    salePriceEth: number,
    isEscrowFlow: boolean
  ) => { success: boolean; txHash?: string; error?: string };
}

export const TransferModal: React.FC<Props> = ({
  property,
  currentAccount,
  accounts,
  onClose,
  onExecuteTransfer,
}) => {
  const defaultRecipient =
    accounts.find(
      (a) =>
        a.role === UserRole.BUYER &&
        property?.currentOwner &&
        a.address.toLowerCase() !== property.currentOwner.toLowerCase()
    )?.address ||
    accounts.find(
      (a) =>
        property?.currentOwner && a.address.toLowerCase() !== property.currentOwner.toLowerCase()
    )?.address ||
    '';

  const [recipientAddress, setRecipientAddress] = useState(defaultRecipient);
  const [transferMode, setTransferMode] = useState<'direct' | 'escrow'>('direct');
  const [salePriceEth, setSalePriceEth] = useState<number>(property?.valuationEth || 100);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [generatedHash, setGeneratedHash] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!property) return null;

  const isOwner =
    property.currentOwner &&
    currentAccount?.address &&
    property.currentOwner.toLowerCase() === currentAccount.address.toLowerCase();

  const handleGenerateDeedHash = () => {
    const summary = `${property.propertyId}-${recipientAddress}-${Date.now()}-${newDocTitle || 'ConveyanceDeed'}`;
    const hash = generateIpfsCid(summary);
    setGeneratedHash(hash);
  };

  const handleQuickSelectRecipient = (acc: TestAccount) => {
    setRecipientAddress(acc.address);
    setErrorMessage(null);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!recipientAddress || recipientAddress.trim().length === 0) {
      setErrorMessage('Please select or input a valid recipient Ethereum address.');
      return;
    }

    if (
      recipientAddress &&
      currentAccount?.address &&
      recipientAddress.toLowerCase() === currentAccount.address.toLowerCase()
    ) {
      setErrorMessage('Cannot transfer property to your own current address.');
      return;
    }

    setLoading(true);

    const docHashToUse = generatedHash || property.documentHash;

    const res = onExecuteTransfer(
      property.propertyId,
      recipientAddress,
      docHashToUse,
      salePriceEth,
      transferMode === 'escrow'
    );

    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Transaction failed');
    } else {
      setSuccessTx(res.txHash || '0x...');
      triggerConfetti();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
              {property.propertyId}
            </span>
            <span className="text-xs bg-white/30 text-white px-2 py-0.5 rounded font-semibold">
              Ownership Conveyance
            </span>
          </div>
          <h3 className="text-xl font-black">Initiate Property Title Transfer</h3>
          <p className="text-xs text-orange-100 mt-1">{property.location}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Owner Verification Check */}
          {!isOwner && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> Active wallet (<code>{currentAccount.name}</code>) is not the current recorded owner.
                Executing will simulate a smart contract <code>revert</code> under the <code>onlyCurrentOwner</code> modifier.
              </div>
            </div>
          )}

          {property.status === PropertyStatus.DISPUTED && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Transfer Blocked:</strong> Property is currently marked <strong>DISPUTED</strong> by Land Authority.
              </div>
            </div>
          )}

          {!property.verified && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Unverified Notice:</strong> Property has not received official surveyor verification. In strict mode, transfer will revert.
              </div>
            </div>
          )}

          {/* Transfer Mode Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Select Conveyance Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTransferMode('direct')}
                className={`p-3 rounded-xl border text-left transition ${
                  transferMode === 'direct'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-semibold ring-1 ring-orange-500'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Direct Atomic Transfer</span>
                  {transferMode === 'direct' && <CheckCircle2 className="h-4 w-4 text-orange-600" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Single-step <code>transferOwnership()</code>. Instant title migration to recipient wallet.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode('escrow')}
                className={`p-3 rounded-xl border text-left transition ${
                  transferMode === 'escrow'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-semibold ring-1 ring-orange-500'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Multi-Party Escrow Flow</span>
                  {transferMode === 'escrow' && <CheckCircle2 className="h-4 w-4 text-orange-600" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  3-step <code>requestTransfer()</code>. Buyer deposits payment, Authority/Seller finalizes.
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleTransferSubmit} className="space-y-4">
            {/* Quick Pick Recipient */}
            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                New Owner / Buyer Address
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-[11px] text-stone-400 self-center mr-1">Quick Select:</span>
                {accounts
                  .filter(
                    (a) =>
                      !property.currentOwner ||
                      (a.address && a.address.toLowerCase() !== property.currentOwner.toLowerCase())
                  )
                  .map((acc) => (
                    <button
                      key={acc.address}
                      type="button"
                      onClick={() => handleQuickSelectRecipient(acc)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium ${
                        recipientAddress &&
                        acc.address &&
                        recipientAddress.toLowerCase() === acc.address.toLowerCase()
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      {acc.name.split('(')[0]} ({acc.role})
                    </button>
                  ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => {
                    setRecipientAddress(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="0x... (Recipient Ethereum Address)"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Consideration Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  Sale Consideration (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={salePriceEth}
                    onChange={(e) => setSalePriceEth(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-bold">ETH</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  USD Equivalent
                </label>
                <div className="text-xs font-bold text-stone-700 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  {formatUsd(salePriceEth)}
                </div>
              </div>
            </div>

            {/* Updated Deed / IPFS Hash generator */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">New Deed Addendum IPFS Hash</span>
                <button
                  type="button"
                  onClick={handleGenerateDeedHash}
                  className="text-[11px] text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Generate New IPFS CID
                </button>
              </div>
              <input
                type="text"
                value={generatedHash || property.documentHash}
                onChange={(e) => setGeneratedHash(e.target.value)}
                placeholder="IPFS CID Hash..."
                className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-stone-300 bg-white"
              />
              <p className="text-[10px] text-stone-500">
                Preserves immutable hash proof of the signed sale contract on IPFS.
              </p>
            </div>

            {/* Error message alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  Execution Error (Smart Contract Revert)
                </div>
                <p className="font-mono text-[11px] bg-rose-100/50 p-2 rounded">{errorMessage}</p>
              </div>
            )}

            {/* Success message */}
            {successTx && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2">
                <div className="font-bold text-sm flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Transfer Executed Successfully!
                </div>
                <p className="text-[11px]">
                  Smart contract state updated. Ownership of {property.propertyId} was conveyed on-chain.
                </p>
                <div className="font-mono text-[10px] bg-white p-2 rounded border border-emerald-200 break-all">
                  Tx Hash: {successTx}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
              >
                {successTx ? 'Done' : 'Cancel'}
              </button>

              {!successTx && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition flex items-center gap-2 shadow-md shadow-orange-600/30 disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  {loading ? 'Submitting to EVM...' : transferMode === 'direct' ? 'Sign & Transfer Title' : 'Submit Transfer Request'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
