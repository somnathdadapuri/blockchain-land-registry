import React, { useState } from 'react';
import {
  Layers,
  Activity,
  Search,
  ExternalLink,
  Copy,
  Check,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { BlockchainTransaction, BlockchainEvent } from '../types/blockchain';
import { shortenAddress, formatEth, formatDate } from '../utils/formatters';
import { downloadFile, exportTransactionsAsCsv } from '../utils/reportExport';

interface Props {
  transactions: BlockchainTransaction[];
  events: BlockchainEvent[];
  currentBlockNumber: number;
}

export const BlockExplorer: React.FC<Props> = ({
  transactions,
  events,
  currentBlockNumber,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'txs'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [downloadedCsv, setDownloadedCsv] = useState(false);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportCsv = () => {
    const csvContent = exportTransactionsAsCsv(transactions);
    downloadFile(`EVM_Ledger_Transactions_${Date.now()}.csv`, csvContent, 'text/csv;charset=utf-8');
    setDownloadedCsv(true);
    setTimeout(() => setDownloadedCsv(false), 2500);
  };

  const q = (searchQuery || '').trim().toLowerCase();

  const filteredEvents = events.filter(
    (e) =>
      !q ||
      (e.propertyId && e.propertyId.toLowerCase().includes(q)) ||
      (e.eventName && e.eventName.toLowerCase().includes(q)) ||
      (e.txHash && e.txHash.toLowerCase().includes(q))
  );

  const filteredTxs = transactions.filter(
    (tx) =>
      !q ||
      (tx.hash && tx.hash.toLowerCase().includes(q)) ||
      (tx.from && tx.from.toLowerCase().includes(q)) ||
      (tx.functionName && tx.functionName.toLowerCase().includes(q))
  );

  const getEventBadge = (eventName: string) => {
    switch (eventName) {
      case 'PropertyRegistered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PropertyVerified':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'TransferRequested':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'TransferApproved':
      case 'OwnershipTransferred':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DisputeUpdated':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
                <Layers className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                EVM Block & Event Logs Explorer
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Live index of emitted smart contract events, mined transactions, and state changes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              title="Export complete transaction ledger to CSV"
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
            >
              {downloadedCsv ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Download className="h-3.5 w-3.5" />}
              <span>{downloadedCsv ? 'Exported CSV!' : 'Export CSV Report'}</span>
            </button>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-right">
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Latest Block Height</div>
              <div className="font-mono text-lg font-black text-stone-900">#{currentBlockNumber}</div>
            </div>
          </div>
        </div>

        {/* Tab switch & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'events'
                  ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Contract Events ({events.length})
            </button>

            <button
              onClick={() => setActiveTab('txs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'txs'
                  ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Mined Transactions ({transactions.length})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event, property UID, or tx hash..."
              className="text-xs px-3.5 py-2 pl-9 rounded-xl border border-stone-300 w-full sm:w-72 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <Search className="h-4 w-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tab 1: Contract Events Stream */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl text-xs text-stone-500">
                No contract events matching filter.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-stone-400 font-semibold uppercase text-[10px] border-b border-stone-200 bg-stone-50">
                      <th className="py-2.5 px-3">Event</th>
                      <th className="py-2.5 px-3">Block #</th>
                      <th className="py-2.5 px-3">Property UID</th>
                      <th className="py-2.5 px-3">Payload Data</th>
                      <th className="py-2.5 px-3">Tx Hash</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                    {filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-orange-50/40 transition">
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getEventBadge(
                              evt.eventName
                            )}`}
                          >
                            {evt.eventName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-600 font-bold">#{evt.blockNumber}</td>
                        <td className="py-3 px-3 font-sans font-bold text-orange-950">
                          {evt.propertyId || '—'}
                        </td>
                        <td className="py-3 px-3 max-w-xs truncate text-stone-700">
                          {Object.entries(evt.data)
                            .map(([k, v]) => `${k}: ${String(v)}`)
                            .join(', ')}
                        </td>
                        <td className="py-3 px-3 text-stone-500">
                          <div className="flex items-center gap-1">
                            <span>{shortenAddress(evt.txHash, 5)}</span>
                            <button
                              onClick={() => copyHash(evt.txHash)}
                              className="text-stone-400 hover:text-stone-700"
                            >
                              {copiedHash === evt.txHash ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-500 font-sans text-[11px]">
                          {formatDate(evt.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mined Transactions Table */}
        {activeTab === 'txs' && (
          <div className="space-y-3">
            {filteredTxs.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl text-xs text-stone-500">
                No mined transactions matching filter.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-stone-400 font-semibold uppercase text-[10px] border-b border-stone-200 bg-stone-50">
                      <th className="py-2.5 px-3">Tx Hash</th>
                      <th className="py-2.5 px-3">Block #</th>
                      <th className="py-2.5 px-3">Function / Method</th>
                      <th className="py-2.5 px-3">From</th>
                      <th className="py-2.5 px-3">To (Contract)</th>
                      <th className="py-2.5 px-3">Gas Used</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                    {filteredTxs.map((tx) => (
                      <tr key={tx.hash} className="hover:bg-orange-50/40 transition">
                        <td className="py-3 px-3 text-stone-900 font-bold">
                          <div className="flex items-center gap-1">
                            <span>{shortenAddress(tx.hash, 6)}</span>
                            <button
                              onClick={() => copyHash(tx.hash)}
                              className="text-stone-400 hover:text-stone-700"
                            >
                              {copiedHash === tx.hash ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-600 font-bold">#{tx.blockNumber}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-sans font-bold text-[11px] border border-stone-200">
                            {tx.functionName}()
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-600">{shortenAddress(tx.from, 4)}</td>
                        <td className="py-3 px-3 text-stone-600">{shortenAddress(tx.to, 4)}</td>
                        <td className="py-3 px-3 text-stone-500">{tx.gasUsed.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
