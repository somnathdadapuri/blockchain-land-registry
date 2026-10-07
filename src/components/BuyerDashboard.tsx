import React, { useState } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Coins,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Info,
  ExternalLink,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { Property, TestAccount, TransferRequest, UserRole } from '../types/blockchain';
import { shortenAddress, formatEth, formatUsd, formatDate, triggerConfetti } from '../utils/formatters';

interface Props {
  properties: Property[];
  transferRequests: TransferRequest[];
  currentAccount: TestAccount;
  accounts?: TestAccount[];
  onSelectAccount?: (acc: TestAccount) => void;
  onAcceptTransfer: (requestId: string) => { success: boolean; txHash?: string; error?: string };
  onFinalizeTransfer: (requestId: string) => { success: boolean; txHash?: string; error?: string };
  onSelectProperty: (property: Property) => void;
}

export const BuyerDashboard: React.FC<Props> = ({
  properties,
  transferRequests,
  currentAccount,
  accounts = [],
  onSelectAccount,
  onAcceptTransfer,
  onFinalizeTransfer,
  onSelectProperty,
}) => {
  const isBuyer = currentAccount.role === UserRole.BUYER;
  const [activeTab, setActiveTab] = useState<'pending' | 'all-escrows' | 'catalog'>('pending');

  // Filter requests where current account is designated buyer
  const myIncomingRequests = transferRequests.filter(
    (req) =>
      req.buyerAddress &&
      currentAccount?.address &&
      req.buyerAddress.toLowerCase() === currentAccount.address.toLowerCase()
  );

  const handleAccept = (reqId: string) => {
    const res = onAcceptTransfer(reqId);
    if (res.success) {
      triggerConfetti();
    } else {
      alert(res.error);
    }
  };

  const handleFinalize = (reqId: string) => {
    const res = onFinalizeTransfer(reqId);
    if (res.success) {
      triggerConfetti();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Escrow Process Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Briefcase className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Buyer & Escrow Settlement Portal
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Simulate multi-party property conveyance with escrow payment validation on EVM.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200">
            <Coins className="h-4 w-4 text-blue-600" />
            <div className="text-xs">
              <span className="text-stone-500">Available Buyer Balance: </span>
              <strong className="font-mono text-stone-900">{formatEth(currentAccount.balanceEth)}</strong>
            </div>
          </div>
        </div>

        {/* 3-Step Escrow Workflow Infographic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-orange-950">
              <span className="flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Seller Initiates
              </span>
              <span className="text-[10px] text-orange-700 bg-orange-100 px-2 py-0.5 rounded font-mono">
                requestTransfer()
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Current verified deed holder locks the property and proposes conveyance to the buyer wallet.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-blue-950">
              <span className="flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                Buyer Deposits
              </span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono">
                acceptTransferAndPay()
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Buyer reviews verified title, signs acceptance, and deposits consideration into smart contract escrow.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                Settlement & Mint
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                completeTransfer()
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Smart contract atomically assigns ownership to buyer and disburses escrow funds to seller.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>My Incoming Offers</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-white text-[10px]">
            {myIncomingRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all-escrows')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'all-escrows'
              ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>All On-Chain Escrows</span>
          <span className="px-1.5 py-0.2 rounded-md bg-stone-200 text-stone-800 text-[10px]">
            {transferRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Public Registry Catalog</span>
          <span className="px-1.5 py-0.2 rounded-md bg-stone-200 text-stone-800 text-[10px]">
            {properties.length}
          </span>
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {myIncomingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500 space-y-4">
              <Briefcase className="h-12 w-12 text-stone-300 mx-auto" />
              <h4 className="text-base font-bold text-stone-800">No Pending Transfer Requests for Current Account</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Current account (<strong>{currentAccount.name}</strong>) does not have any pending incoming offers. Switch to Bob Sterling (Buyer) or inspect all on-chain escrows:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {accounts
                  .filter((a) => a.role === UserRole.BUYER)
                  .map((acc) => (
                    <button
                      key={acc.address}
                      onClick={() => {
                        if (onSelectAccount) onSelectAccount(acc);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Switch to {acc.name}
                    </button>
                  ))}
                <button
                  onClick={() => setActiveTab('all-escrows')}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition"
                >
                  View All On-Chain Escrows ({transferRequests.length})
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myIncomingRequests.map((req) => {
                const prop = properties.find((p) => p.propertyId === req.propertyId);
                if (!prop) return null;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                            {req.propertyId}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">{req.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-1">{prop.location}</h4>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          req.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.buyerAccepted
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-stone-600">
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-400">Seller / Current Owner</div>
                        <div className="font-mono text-xs text-stone-800 font-semibold mt-0.5">
                          {shortenAddress(req.sellerAddress, 5)}
                        </div>
                      </div>

                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-400">Agreed Consideration</div>
                        <div className="font-bold text-stone-900 text-sm mt-0.5">
                          {formatEth(req.agreedPriceEth)}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200 flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">IPFS Document CID:</span>
                      <span className="font-mono text-[10px] text-orange-800 font-bold bg-white px-2 py-0.5 rounded border border-orange-200">
                        {shortenAddress(prop.documentHash, 6)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2 border-t border-stone-100">
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-center transition"
                      >
                        Inspect Title
                      </button>

                      {!req.buyerAccepted && (
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1 shadow-xs transition"
                        >
                          <Coins className="h-3.5 w-3.5" />
                          Deposit Escrow & Accept
                        </button>
                      )}

                      {req.buyerAccepted && req.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleFinalize(req.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1 shadow-xs transition"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Finalize Conveyance
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'all-escrows' && (
        <div className="space-y-4">
          {transferRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
              <Briefcase className="h-12 w-12 text-stone-300 mx-auto" />
              <h4 className="text-base font-bold text-stone-800">No Escrow Transactions Recorded</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No properties are currently under multi-party escrow conveyance. Initiate a transfer from the Owner dashboard to test this smart contract flow.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transferRequests.map((req) => {
                const prop = properties.find((p) => p.propertyId === req.propertyId);
                const isDesignatedBuyer =
                  currentAccount?.address &&
                  req.buyerAddress &&
                  req.buyerAddress.toLowerCase() === currentAccount.address.toLowerCase();

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                            {req.propertyId}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">{req.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-1">
                          {prop ? prop.location : 'Parcel on Registry'}
                        </h4>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          req.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.buyerAccepted
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-stone-600">
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-400">Seller Wallet</div>
                        <div className="font-mono text-xs text-stone-800 font-semibold mt-0.5">
                          {shortenAddress(req.sellerAddress, 5)}
                        </div>
                      </div>

                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-400">Buyer Wallet</div>
                        <div className="font-mono text-xs text-stone-800 font-semibold mt-0.5">
                          {shortenAddress(req.buyerAddress, 5)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200 flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">Escrow Consideration:</span>
                      <span className="font-bold text-blue-900 text-sm">
                        {formatEth(req.agreedPriceEth)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2 border-t border-stone-100">
                      {prop && (
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-center transition"
                        >
                          Inspect Title
                        </button>
                      )}

                      {isDesignatedBuyer && !req.buyerAccepted && (
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1 shadow-xs transition"
                        >
                          <Coins className="h-3.5 w-3.5" />
                          Deposit Escrow
                        </button>
                      )}

                      {isDesignatedBuyer && req.buyerAccepted && req.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleFinalize(req.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1 shadow-xs transition"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Finalize Conveyance
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop.propertyId}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative h-40 bg-stone-900">
                <img
                  src={prop.imageUrl}
                  alt={prop.propertyId}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3 bg-orange-600 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
                  {prop.propertyId}
                </div>
                <div className="absolute top-3 right-3">
                  {prop.verified ? (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" /> UNVERIFIED
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div>
                  <div className="font-bold text-stone-900 text-sm truncate">{prop.location}</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                    Owner: {shortenAddress(prop.currentOwner, 5)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="font-bold text-stone-900 font-mono text-sm">
                    {formatEth(prop.valuationEth)}
                  </div>
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-900 font-semibold transition"
                  >
                    View Title
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
