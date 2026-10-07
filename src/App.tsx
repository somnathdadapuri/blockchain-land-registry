import React, { useState, useEffect } from 'react';
import {
  DisclaimerBanner,
} from './components/DisclaimerBanner';
import { RolePermissionTable } from './components/RolePermissionTable';
import { Navbar } from './components/Navbar';
import { QuickStartBar } from './components/QuickStartBar';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { PropertyVerificationPage } from './components/PropertyVerificationPage';
import { SmartContractHub } from './components/SmartContractHub';
import { BlockExplorer } from './components/BlockExplorer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { TransferModal } from './components/TransferModal';
import { CertificateModal } from './components/CertificateModal';
import { ProfileModal } from './components/ProfileModal';
import { TaxCalculatorModal } from './components/TaxCalculatorModal';
import { DueDiligenceModal } from './components/DueDiligenceModal';
import { blockchainService } from './services/blockchainService';
import {
  Property,
  TestAccount,
  UserRole,
  BlockchainTransaction,
  BlockchainEvent,
  TransferRequest,
} from './types/blockchain';

export const App: React.FC = () => {
  // Navigation & Active View
  const [activeTab, setActiveTab] = useState<
    'authority' | 'owner' | 'buyer' | 'verify' | 'contract' | 'explorer'
  >('authority');

  // Accounts state
  const [accounts, setAccounts] = useState<TestAccount[]>(blockchainService.getAccounts());
  const [currentAccount, setCurrentAccount] = useState<TestAccount>(
    blockchainService.getCurrentAccount()
  );

  // Blockchain Entities state
  const [properties, setProperties] = useState<Property[]>(blockchainService.getProperties());
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(
    blockchainService.getTransactions()
  );
  const [events, setEvents] = useState<BlockchainEvent[]>(blockchainService.getEvents());
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    blockchainService.getTransferRequests()
  );
  const [currentBlock, setCurrentBlock] = useState<number>(blockchainService.getCurrentBlock());

  // Modals state
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(
    null
  );
  const [selectedPropertyForTransfer, setSelectedPropertyForTransfer] = useState<Property | null>(
    null
  );
  const [selectedPropertyForCertificate, setSelectedPropertyForCertificate] =
    useState<Property | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTaxCalculatorOpen, setIsTaxCalculatorOpen] = useState(false);
  const [isDueDiligenceOpen, setIsDueDiligenceOpen] = useState(false);
  const [selectedPropertyForAudit, setSelectedPropertyForAudit] = useState<Property | null>(null);

  // Refresh reactive state from blockchain service
  const refreshState = () => {
    setAccounts(blockchainService.getAccounts());
    setCurrentAccount(blockchainService.getCurrentAccount());
    setProperties(blockchainService.getProperties());
    setTransactions(blockchainService.getTransactions());
    setEvents(blockchainService.getEvents());
    setTransferRequests(blockchainService.getTransferRequests());
    setCurrentBlock(blockchainService.getCurrentBlock());
  };

  // Switch active wallet
  const handleSelectAccount = (account: TestAccount) => {
    blockchainService.setCurrentAccount(account);
    refreshState();

    // Contextual switch of active tab based on chosen role
    if (account.role === UserRole.AUTHORITY && activeTab !== 'authority') {
      setActiveTab('authority');
    } else if (account.role === UserRole.OWNER && activeTab !== 'owner') {
      setActiveTab('owner');
    } else if (account.role === UserRole.BUYER && activeTab !== 'buyer') {
      setActiveTab('buyer');
    }
  };

  // Reset database simulation
  const handleResetData = () => {
    if (
      window.confirm(
        'Reset all simulated property titles, transfer requests, and transactions to default genesis state?'
      )
    ) {
      blockchainService.resetData();
      refreshState();
    }
  };

  // Actions wrapped with auto-refresh
  const handleRegisterProperty = (data: Parameters<typeof blockchainService.registerProperty>[0]) => {
    const res = blockchainService.registerProperty(data);
    refreshState();
    return res;
  };

  const handleVerifyProperty = (propertyId: string) => {
    const res = blockchainService.verifyProperty(propertyId);
    refreshState();
    return res;
  };

  const handleFlagDispute = (propertyId: string, isDisputed: boolean) => {
    const res = blockchainService.flagDispute(propertyId, isDisputed);
    refreshState();
    return res;
  };

  const handleDirectTransfer = (
    propertyId: string,
    newOwnerAddress: string,
    newDocHash?: string,
    salePriceEth?: number
  ) => {
    const res = blockchainService.transferOwnership(
      propertyId,
      newOwnerAddress,
      newDocHash,
      salePriceEth
    );
    refreshState();
    return res;
  };

  const handleRequestEscrowTransfer = (
    propertyId: string,
    buyerAddress: string,
    agreedPriceEth: number
  ) => {
    const res = blockchainService.requestEscrowTransfer(
      propertyId,
      buyerAddress,
      agreedPriceEth
    );
    refreshState();
    return res;
  };

  const handleAcceptTransfer = (requestId: string) => {
    const res = blockchainService.acceptTransferAndPay(requestId);
    refreshState();
    return res;
  };

  const handleFinalizeTransfer = (requestId: string) => {
    const res = blockchainService.finalizeEscrowTransfer(requestId);
    refreshState();
    return res;
  };

  // 1-Click Quick Demo Shortcuts
  const handleQuickTransferDemo = () => {
    const ownerAcc = accounts.find((a) => a.role === UserRole.OWNER) || accounts[1];
    if (ownerAcc) {
      handleSelectAccount(ownerAcc);
      setActiveTab('owner');
      const ownedProp = properties.find(
        (p) => p.currentOwner && p.currentOwner.toLowerCase() === ownerAcc.address.toLowerCase()
      );
      if (ownedProp) {
        setSelectedPropertyForTransfer(ownedProp);
      }
    }
  };

  const handleQuickRegisterDemo = () => {
    const adminAcc = accounts.find((a) => a.role === UserRole.AUTHORITY) || accounts[0];
    if (adminAcc) {
      handleSelectAccount(adminAcc);
      setActiveTab('authority');
    }
  };

  const handleFaucetRefill = (address: string, amountEth: number) => {
    blockchainService.addFundsToAccount(address, amountEth);
    refreshState();
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Academic Course Disclaimer */}
      <DisclaimerBanner />

      {/* Main Navigation Bar with Role/Wallet Switcher */}
      <Navbar
        accounts={accounts}
        currentAccount={currentAccount}
        onSelectAccount={handleSelectAccount}
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        onResetState={handleResetData}
        blockNumber={currentBlock}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTaxCalculator={() => setIsTaxCalculatorOpen(true)}
        onOpenDueDiligence={() => {
          setSelectedPropertyForAudit(properties[0] || null);
          setIsDueDiligenceOpen(true);
        }}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Action & Guided Demo Bar */}
        <QuickStartBar
          currentAccount={currentAccount}
          accounts={accounts}
          properties={properties}
          onSelectAccount={handleSelectAccount}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onQuickTransferDemo={handleQuickTransferDemo}
          onQuickRegisterDemo={handleQuickRegisterDemo}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenTaxCalculator={() => setIsTaxCalculatorOpen(true)}
          onOpenDueDiligence={() => {
            setSelectedPropertyForAudit(properties[0] || null);
            setIsDueDiligenceOpen(true);
          }}
        />

        {/* Dynamic Views */}
        {activeTab === 'authority' && (
          <AuthorityDashboard
            properties={properties}
            accounts={accounts}
            currentAccount={currentAccount}
            onRegisterProperty={handleRegisterProperty}
            onVerifyProperty={handleVerifyProperty}
            onFlagDispute={handleFlagDispute}
            onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
            onOpenCertificate={(prop) => setSelectedPropertyForCertificate(prop)}
          />
        )}

        {activeTab === 'owner' && (
          <OwnerDashboard
            properties={properties}
            currentAccount={currentAccount}
            accounts={accounts}
            onSelectAccount={handleSelectAccount}
            onOpenTransfer={(prop) => setSelectedPropertyForTransfer(prop)}
            onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
            onOpenCertificate={(prop) => setSelectedPropertyForCertificate(prop)}
          />
        )}

        {activeTab === 'buyer' && (
          <BuyerDashboard
            properties={properties}
            transferRequests={transferRequests}
            currentAccount={currentAccount}
            accounts={accounts}
            onSelectAccount={handleSelectAccount}
            onAcceptTransfer={handleAcceptTransfer}
            onFinalizeTransfer={handleFinalizeTransfer}
            onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
          />
        )}

        {activeTab === 'verify' && (
          <PropertyVerificationPage
            properties={properties}
            onOpenCertificate={(prop) => setSelectedPropertyForCertificate(prop)}
          />
        )}

        {activeTab === 'contract' && <SmartContractHub />}

        {activeTab === 'explorer' && (
          <BlockExplorer
            transactions={transactions}
            events={events}
            currentBlockNumber={currentBlock}
          />
        )}

        {/* Universal Role & Access Control Matrix (Collapsible bottom guide) */}
        <RolePermissionTable
          currentRole={currentAccount?.role || UserRole.AUTHORITY}
          onSelectRole={(role) => {
            const acc = accounts.find((a) => a.role === role);
            if (acc) handleSelectAccount(acc);
          }}
        />
      </main>

      {/* Footer with Academic Note & Smart Contract Identity */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="font-bold text-stone-900">
              Blockchain-Based Land Registry & Property Ownership System
            </div>
            <p className="text-[11px] text-stone-500">
              Academic Course Prototype • Decentralized Cadastral Records & Title Conveyance Architecture
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>EVM Network: Simulated Local Node</span>
            <span>•</span>
            <span>Solidity v0.8.20</span>
            <span>•</span>
            <span>IPFS Content Addressing</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedPropertyForDetail && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          onClose={() => setSelectedPropertyForDetail(null)}
          onOpenTransfer={(prop) => {
            setSelectedPropertyForDetail(null);
            setSelectedPropertyForTransfer(prop);
          }}
          onOpenCertificate={(prop) => {
            setSelectedPropertyForDetail(null);
            setSelectedPropertyForCertificate(prop);
          }}
        />
      )}

      {selectedPropertyForTransfer && (
        <TransferModal
          property={selectedPropertyForTransfer}
          accounts={accounts}
          currentAccount={currentAccount}
          onClose={() => setSelectedPropertyForTransfer(null)}
          onDirectTransfer={handleDirectTransfer}
          onRequestEscrow={handleRequestEscrowTransfer}
        />
      )}

      {selectedPropertyForCertificate && (
        <CertificateModal
          property={selectedPropertyForCertificate}
          onClose={() => setSelectedPropertyForCertificate(null)}
        />
      )}

      {/* Profile & Digital Identity Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentAccount={currentAccount}
        accounts={accounts}
        transactions={transactions}
        properties={properties}
        onFaucetRefill={handleFaucetRefill}
        onSwitchAccount={(acc) => {
          blockchainService.setCurrentAccount(acc);
          refreshState();
        }}
        onOpenCertificate={(prop) => {
          setSelectedPropertyForCertificate(prop);
        }}
      />

      {/* Stamp Duty & Closing Cost Calculator */}
      <TaxCalculatorModal
        isOpen={isTaxCalculatorOpen}
        onClose={() => setIsTaxCalculatorOpen(false)}
        properties={properties}
      />

      {/* Title Due Diligence & Encumbrance Audit */}
      <DueDiligenceModal
        isOpen={isDueDiligenceOpen}
        onClose={() => setIsDueDiligenceOpen(false)}
        property={selectedPropertyForAudit}
        properties={properties}
      />
    </div>
  );
};

export default App;
