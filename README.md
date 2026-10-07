# Blockchain-Based Land Registry & Property Ownership System

An institutional-grade, decentralized land titling and cadastral registry platform engineered on Ethereum Solidity smart contracts (`LandRegistry.sol`), cryptographic document verification (IPFS SHA-256 / CID hashing), multi-party role governance, and real-time EVM state synchronization.

---

## Table of Contents
1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Objectives](#objectives)
4. [Industry Relevance](#industry-relevance)
5. [Educational Disclaimer](#educational-disclaimer)
6. [Blockchain Concepts Used](#blockchain-concepts-used)
7. [System Actors & Permissions](#system-actors--permissions)
8. [Technology Stack](#technology-stack)
9. [System Architecture](#system-architecture)
10. [Property Data Model](#property-data-model)
11. [Property Registration](#property-registration)
12. [Property Verification](#property-verification)
13. [Ownership Transfer](#ownership-transfer)
14. [Ownership History & Provenance](#ownership-history--provenance)
15. [Document Hash Verification](#document-hash-verification)
16. [Smart Contract Functions](#smart-contract-functions)
17. [Events & Indexing](#events--indexing)
18. [Security Controls & Modifiers](#security-controls--modifiers)
19. [Folder Structure](#folder-structure)
20. [Installation & Setup](#installation--setup)
21. [Remix IDE Simulation Guide](#remix-ide-simulation-guide)
22. [Hardhat Automated Testing](#hardhat-automated-testing)
23. [Optional Frontend DApp UI](#optional-frontend-dapp-ui)
24. [Screenshots & UI Showcase](#screenshots--ui-showcase)
25. [Results & Benchmarks](#results--benchmarks)
26. [System Limitations](#system-limitations)
27. [Legal & Real-World Cadastral Considerations](#legal--real-world-cadastral-considerations)
28. [Future Improvements](#future-improvements)
29. [Learning Outcomes](#learning-outcomes)
30. [Author & Credits](#author--credits)

---

## Overview

The **Blockchain-Based Land Registry & Property Ownership System** is a decentralized application (DApp) and smart contract protocol designed to modernize land records, title deeds, and property conveyancing. By transitioning real estate deeds from paper ledgers and fragmented municipal databases to an immutable, decentralized EVM blockchain ledger, the platform guarantees mathematical title authenticity, eliminates forged deed conveyances, mitigates double-selling fraud, and provides public, tamper-proof title lineage.

The system incorporates **ISO-19152 Land Administration Domain Model (LADM)** architectural paradigms, maker-checker cadastral verification workflows, on-chain digital signatures (EIP-191 / ECDSA), automated stamp duty calculation, and decentralized IPFS cryptographic document verification.

---

## Problem Statement

Traditional paper-based and centralized land registry architectures suffer from severe structural vulnerabilities:

1. **Deed Forgery & Duplicate Titles:** Centralized paper archives and legacy databases are vulnerable to retroactive manipulation, counterfeit signatures, and illicit duplicate title generation.
2. **Double-Selling Vulnerability:** Unscrupulous sellers can enter parallel sale agreements with multiple prospective buyers before official registry recording occurs due to multi-week latency in bureaucratic title recording.
3. **Fragmented Historical Provenance:** Tracing the chain of title (the complete historical pedigree of property conveyances over decades) requires manual archival searches, high legal fees, and title insurance premiums.
4. **Lack of Institutional Transparency:** Citizens and buyers cannot independently verify whether a parcel is under active court litigation (*Lis Pendens*), zoning infractions, or municipal liens without third-party gatekeepers.
5. **Slow, High-Fee Settlements:** Manual deed recording, notary seals, and closing escrows take 30 to 90 days, consuming 2% to 6% in friction costs.

---

## Objectives

- **Immutability & Cryptographic Provenance:** Record all land parcel genesis registrations and title transfers permanently on the Ethereum blockchain.
- **Role-Based Cadastral Governance:** Enforce strict access control separating Land Registrars, Certified Cadastral Surveyors, Property Owners, and Verified Buyers.
- **Maker-Checker Verification Workflow:** Enforce dual-phase onboarding where parcels are registered initially in `REGISTERED` status and only become transferable upon independent physical/GIS survey clearance (`VERIFIED`).
- **Cryptographic Document Attestation:** Anchor off-chain boundary surveys, geodetic GIS maps, and legal deeds to the blockchain using cryptographic SHA-256 / IPFS Content Identifiers (CIDs).
- **Automated Title Due Diligence:** Provide instant 6-point programmatic audits evaluating title ownership, boundary validity, tax clearance, encumbrances, and deed hash integrity.
- **Frictionless Conveyancing:** Provide atomic direct transfers and escrow-secured multi-party settlements with EIP-191 digital signatures.

---

## Industry Relevance

Real estate represents the single largest asset class globally (valued in excess of $300 Trillion). Integrating blockchain into land administration aligns with ongoing modernization initiatives across international land registries (e.g., HM Land Registry Digital Street, Sweden Lantmäteriet, Dubai Land Department REST, and Georgia National Public Registry Agency).

### Key Benefits:
- **Banks & Mortgage Lenders:** Instant collateral validation without lengthy title searches.
- **Government Cadastres:** Drastic reduction in real estate litigation, boundary overlap disputes, and cadastral recording backlogs.
- **Property Owners & Investors:** Indisputable proof of ownership with fractional/global liquidity potential.

---

## Educational Disclaimer

> **IMPORTANT NOTICE:**  
> This project is a **technological, educational, and academic reference implementation** built for demonstration on local testnets (Hardhat / Anvil) and EVM testnets (Sepolia / Holesky).  
> In real-world municipal deployments, on-chain title transfers must be legally recognized by statutory legislation (e.g., Electronic Title Deeds Acts) and integrated with physical land surveying regulations, tax authorities, and legal notary frameworks.

---

## Blockchain Concepts Used

- **Smart Contracts (Solidity v0.8.20):** Self-executing code orchestrating business logic, state machines, and access permissions without intermediaries.
- **State Machine Lifecycle:** Deterministic transition of properties across statuses: `REGISTERED` $\rightarrow$ `VERIFIED` $\rightarrow$ `TRANSFER_PENDING` $\rightarrow$ `TRANSFERRED` $\rightarrow$ `DISPUTED`.
- **Cryptographic Hashing (SHA-256 & Keccak-256):** Generating deterministic digital fingerprints of legal documents, deed certificates, and spatial coordinates.
- **InterPlanetary File System (IPFS) Content Addressing:** Storing large survey blueprints and PDF deeds off-chain while anchoring their unique content hash (CID) immutably on-chain.
- **EIP-191 / ECDSA Digital Signatures:** Elliptic Curve Cryptography (`secp256k1`) allowing parties to sign deed clauses and conveyance authorizations using private keys.
- **Role-Based Access Control (RBAC):** Modifiers (`onlyAdmin`, `onlyAuthorizedRegistrar`, `onlyAuthorizedVerifier`, `onlyCurrentOwner`) ensuring zero unauthorized privilege escalation.
- **Indexed Event Emission:** Emitting structured blockchain events (`PropertyRegistered`, `PropertyVerified`, `OwnershipTransferred`) for low-cost off-chain query indexing and block explorer reconstruction.

---

## System Actors & Permissions

| Actor | Role / Persona | Smart Contract Modifier | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Land Authority Admin** | State Registrar General | `onlyAdmin` / `onlyAuthorizedRegistrar` | Mint new land parcels, grant registrar/verifier licenses, freeze/resolve legal disputes, upgrade system contracts. |
| **Cadastral Surveyor** | Certified GIS / Boundary Auditor | `onlyAuthorizedVerifier` | Inspect spatial GIS coordinates, audit geodetic boundaries, approve/countersign properties from `REGISTERED` to `VERIFIED`. |
| **Property Owner** | Verified Title Deed Holder | `onlyCurrentOwner` | Initiate direct ownership transfers, create escrow transfer proposals, sign conveyance endorsements, export certified deed certificates. |
| **Prospective Buyer** | Real Estate Investor / Escrow Depositor | Public Signer | Propose purchase agreements, deposit escrow funds (`acceptTransferAndPay`), inspect public audit reports. |
| **Public Auditor** | Public Citizen / Bank Underwriter | Public View (`view` methods) | Inspect public cadastral registry, verify deed document hashes against IPFS, review historical ownership pedigree. |

---

## Technology Stack

### Blockchain Core
- **Solidity:** `^0.8.20` (Custom Smart Contract: `LandRegistry.sol`)
- **Ethers.js:** `v6.17.0` (Client-side blockchain abstraction, contract interaction, and EIP-191 signing)
- **Hardhat / Anvil:** EVM execution environment, simulated node `#31337`, gas analytics, Chai testing suite

### Frontend & Application Layer
- **React:** `v19.0.1` + **TypeScript** `~5.8.2`
- **Build Tool:** **Vite** `v6.2.3`
- **Styling:** **Tailwind CSS** `v4.1.14`
- **Iconography:** **Lucide React** `v0.546.0`
- **Animations & Effects:** **Motion** `v12.23.24` + **Canvas-Confetti**

---

## System Architecture

```
+-----------------------------------------------------------------------------+
|                               USER INTERFACE                                |
|  [Authority Dashboard]  [Surveyor Verification]  [Owner Portal]  [Buyer/Audit]
+-----------------------------------------------------------------------------+
                                      │
                         Ethers.js v6 / Web3 Signer
                                      │
+─────────────────────────────────────▼───────────────────────────────────────+
|                         EVM SMART CONTRACT LAYER                            |
|                            (LandRegistry.sol)                               |
|                                                                             |
|  ┌─────────────────────┐  ┌──────────────────────┐  ┌────────────────────┐  |
|  |  Role Governance    |  |  Property Registry   |  | Verification Engine|  |
|  | (Registrar/Verifier)|  |  (CRUD & Metadata)   |  | (Maker-Checker)    |  |
|  └─────────────────────┘  └──────────────────────┘  └────────────────────┘  |
|  ┌─────────────────────┐  ┌──────────────────────┐  ┌────────────────────┐  |
|  | Ownership Transfer  |  |  Escrow Settlement   |  | Dispute Management |  |
|  | (Atomic Conveyance) |  |  (Multi-Sig Release) |  | (Freeze/Resolve)   |  |
|  └─────────────────────┘  └──────────────────────┘  └────────────────────┘  |
|                                                                             |
|                           Indexed Event Logs                                |
|   (PropertyRegistered, PropertyVerified, OwnershipTransferred, etc.)        |
+─────────────────────────────────────┬───────────────────────────────────────+
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
+───────────────────────────+                       +───────────────────────────+
|     ON-CHAIN STORAGE      |                       |    OFF-CHAIN STORAGE      |
|  - Property Structs       |                       |  - IPFS Survey Deeds      |
|  - Ownership Pedigree     |                       |  - GIS Polygon GeoJSON    |
|  - Address Mapping Lists  |                       |  - Encrypted KYC Dossiers |
+───────────────────────────+                       +───────────────────────────+
```

---

## Property Data Model

Each registered property is represented on-chain via the following Solidity struct:

```solidity
enum PropertyStatus {
    REGISTERED,       // 0: Initial submission, awaiting verification
    VERIFIED,         // 1: Authenticated by Surveyor / Land Authority
    TRANSFER_PENDING, // 2: Active escrow or buyer purchase negotiation
    TRANSFERRED,      // 3: Successfully conveyed to new title holder
    DISPUTED          // 4: Locked under legal injunction or boundary conflict
}

enum PropertyType {
    Residential,      // 0
    Commercial,       // 1
    Agricultural,     // 2
    Industrial,       // 3
    SpecialPurpose    // 4
}

struct OwnershipRecord {
    address from;
    address to;
    uint256 timestamp;
    uint256 blockNumber;
    string documentHash;
    uint256 priceWei;
}

struct Property {
    string propertyId;         // e.g. "PROP-2026-8821"
    string propertyNumber;     // Cadastral Parcel ID (e.g. "CAD-9042-TX")
    string location;           // Physical street / municipality address
    uint256 area;              // Land parcel size (sq ft / sq m)
    PropertyType propertyType; // Classification enum
    address currentOwner;      // Active title deed holder wallet
    address previousOwner;     // Immediate prior title holder (0x0 for genesis)
    string documentHash;       // IPFS CID of survey deeds and blueprints
    bool verified;             // True if approved by licensed surveyor
    PropertyStatus status;     // Active lifecycle status
    uint256 registeredAt;      // Block timestamp of creation
    uint256 lastTransferredAt; // Block timestamp of latest conveyance
    uint256 valuationWei;      // Official cadastral valuation in Wei
}
```

---

## Property Registration

Property onboarding enforces zero-knowledge validation and authorization:

1. **Initiation:** Only accounts recognized under `isAuthorizedRegistrar` (or `landAuthorityAdmin`) can invoke `registerProperty()`.
2. **Parameters Provided:** Unique `propertyId`, cadastral `propertyNumber`, physical `location`, surveyed `area`, property classification, `initialOwner` address, `documentHash` (IPFS CID), and `valuationWei`.
3. **State Updates:**
   - Validates that `propertyId` does not already exist (prevents ID collisions).
   - Initializes property with `status = PropertyStatus.REGISTERED` and `verified = false`.
   - Links property UID to the initial owner's asset array (`ownerProperties`).
   - Appends initial genesis entry to `propertyHistory` with `from = address(0)`.
   - Emits `PropertyRegistered` event.

---

## Property Verification

To prevent unilateral fraudulent registrations by rogue administrators, the platform uses a **Maker-Checker Cadastral Verification Workflow**:

1. **Role Constraint:** Only addresses with `isAuthorizedVerifier` status (e.g., Licensed Land Surveyors or Cadastral Inspectors) can invoke `verifyProperty()`.
2. **Pre-Conditions:**
   - Property must exist.
   - Property must not already be verified.
   - Property must not be marked as `DISPUTED`.
3. **Outcome:**
   - Sets `prop.verified = true`.
   - Updates `prop.status = PropertyStatus.VERIFIED`.
   - Emits `PropertyVerified` and `PropertyStatusChanged` events.
   - **Crucial Rule:** Only properties in `VERIFIED` status are permitted to execute ownership transfers.

---

## Ownership Transfer

The smart contract provides two distinct transfer mechanisms:

### Method 1: Atomic Direct Transfer (`transferOwnership`)
- **Caller:** `onlyCurrentOwner(propertyId)`
- **Conditions:** Property must be verified and not in dispute; new owner cannot be `address(0)` or the current owner.
- **Execution:**
  1. Sets `previousOwner = currentOwner` and `currentOwner = _newOwner`.
  2. Updates `documentHash` to the new deed CID countersigned by both parties.
  3. Re-indexes owner mapping arrays (`_removePropertyFromOwner` & `ownerProperties.push`).
  4. Appends a new timestamped `OwnershipRecord` to `propertyHistory`.
  5. Emits `OwnershipTransferred` and `PropertyStatusChanged`.

### Method 2: Multi-Party Escrow Transfer (`requestTransfer` + `acceptTransferAndPay` + `completeTransfer`)
1. **Request:** Owner initiates `requestTransfer(propertyId, buyer, agreedPriceWei)`.
2. **Escrow Deposit:** Buyer inspects the request and invokes `acceptTransferAndPay{value: agreedPriceWei}(propertyId)` to lock settlement funds in contract escrow.
3. **Settlement & Deed Release:** Seller or Registrar executes `completeTransfer()`, releasing escrowed funds to the seller and atomically transferring the ERC-compatible title deed to the buyer.

---

## Ownership History & Provenance

Every property maintains an unbroken on-chain audit trail:

$$\text{Genesis Mint (0x0} \rightarrow \text{Owner A)} \longrightarrow \text{Owner A} \rightarrow \text{Owner B} \longrightarrow \text{Owner B} \rightarrow \text{Owner C}$$

- Stored in `mapping(string => OwnershipRecord[]) propertyHistory`.
- Accessible via the public view function `getOwnershipHistory(propertyId)`.
- Records include exact `from` and `to` addresses, block numbers, transaction timestamps, recorded sale prices, and historical deed document CIDs.

---

## Document Hash Verification

Legal blueprints, title deeds, and boundary surveys are anchored to the blockchain using cryptographic hashes:

1. **Document Ingestion:** Deed PDF or GIS survey files are processed through the SHA-256 / IPFS hash algorithm.
2. **On-Chain Anchor:** The resulting CID (e.g., `QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco`) is immutably stored in `Property.documentHash`.
3. **Client-Side Verification:**
   - Any citizen, auditor, or financial underwriter can upload their local copy of the deed file.
   - The application computes the file's hash in real-time in the browser.
   - It compares the calculated hash against the smart contract's `documentHash`.
   - **Matching Hashes:** Guarantees 100% data integrity (not a single byte modified).
   - **Mismatched Hashes:** Flags unauthorized tampering or counterfeit documentation.

---

## Smart Contract Functions

### Administrative & Role Management
- `setRegistrarStatus(address _account, bool _status)`: Grant/revoke land registrar privileges (`onlyAdmin`).
- `setVerifierStatus(address _account, bool _status)`: Grant/revoke cadastral surveyor privileges (`onlyAdmin`).

### Core Property Lifecycle
- `registerProperty(string _propertyId, string _propertyNumber, string _location, uint256 _area, PropertyType _propertyType, address _initialOwner, string _documentHash, uint256 _valuationWei)`: Registers new parcel (`onlyAuthorizedRegistrar`).
- `verifyProperty(string _propertyId)`: Authenticates deed and boundary integrity (`onlyAuthorizedVerifier`).
- `transferOwnership(string _propertyId, address _newOwner, string _newDocumentHash, uint256 _salePriceWei)`: Direct atomic conveyance (`onlyCurrentOwner`).

### Multi-Step Escrow Settlement
- `requestTransfer(string _propertyId, address _buyer, uint256 _agreedPriceWei)`: Creates active sale proposal (`onlyCurrentOwner`).
- `acceptTransferAndPay(string _propertyId) payable`: Locks buyer settlement deposit in contract escrow.
- `completeTransfer(string _propertyId, string _newDocumentHash)`: Releases funds to seller and transfers deed to buyer.

### Dispute & Risk Controls
- `setDisputeStatus(string _propertyId, bool _isDisputed, string _reason)`: Injunction freeze or dispute resolution (`onlyAuthorizedRegistrar`).

### Public View Functions
- `getProperty(string _propertyId)`: Returns full property struct.
- `isPropertyVerified(string _propertyId)`: Returns verification boolean.
- `getPropertiesByOwner(address _owner)`: Returns list of property UIDs owned by an address.
- `getOwnershipHistory(string _propertyId)`: Returns complete historical ownership records array.

---

## Events & Indexing

The smart contract emits comprehensive indexed events for client-side listeners and subgraphs:

```solidity
event PropertyRegistered(
    string indexed propertyId,
    string propertyNumber,
    address indexed owner,
    string location,
    uint256 area,
    string documentHash,
    uint256 timestamp
);

event PropertyVerified(
    string indexed propertyId,
    address indexed verifier,
    uint256 timestamp
);

event TransferRequested(
    string indexed propertyId,
    address indexed seller,
    address indexed buyer,
    uint256 priceWei,
    uint256 timestamp
);

event OwnershipTransferred(
    string indexed propertyId,
    address indexed previousOwner,
    address indexed newOwner,
    string newDocumentHash,
    uint256 timestamp,
    uint256 priceWei
);

event PropertyStatusChanged(
    string indexed propertyId,
    PropertyStatus indexed oldStatus,
    PropertyStatus indexed newStatus,
    string reason,
    uint256 timestamp
);
```

---

## Security Controls & Modifiers

- **Reentrancy Protection:** Direct transfers and escrow fund distributions use checks-effects-interactions patterns with strict state variable assignment preceding external value transfers.
- **Zero Address Validation:** Explicit checks (`require(_newOwner != address(0))`) prevent accidental burning of real estate titles.
- **Self-Transfer Guard:** Disallows transferring a property to the existing owner address.
- **Dispute Lockout:** Properties flagged with `PropertyStatus.DISPUTED` cannot be verified, transferred, or updated until resolved by authorized registrar.
- **Role Isolation:** Functions are strictly protected by modifiers (`onlyAdmin`, `onlyAuthorizedRegistrar`, `onlyAuthorizedVerifier`, `onlyCurrentOwner`).

---

## Folder Structure

```
blockchain-land-registry/
├── contracts/
│   └── LandRegistry.sol          # Primary Solidity smart contract (v0.8.20)
├── test/
│   └── LandRegistry.test.js      # Comprehensive Hardhat & Chai unit tests
├── src/
│   ├── components/
│   │   ├── AuthorityDashboard.tsx       # Land Registrar minting & dispute hub
│   │   ├── PropertyVerificationPage.tsx # Surveyor GIS boundary audit suite
│   │   ├── OwnerDashboard.tsx           # Owner property portfolio & transfer UI
│   │   ├── BuyerDashboard.tsx           # Marketplace, buyer escrow & purchase
│   │   ├── BlockExplorer.tsx            # Real-time event log & tx explorer
│   │   ├── SmartContractHub.tsx         # Solidity code, ABI, bytecode & test runner
│   │   ├── ProfileModal.tsx             # User profile, KYC credentials & EIP-191 signer
│   │   ├── DueDiligenceModal.tsx        # 6-point programmatic title audit & export
│   │   ├── CertificateModal.tsx         # Printable & downloadable deed certificates
│   │   ├── TaxCalculatorModal.tsx       # Multi-jurisdiction stamp duty calculator
│   │   ├── PropertyDetailModal.tsx      # Comprehensive parcel details & deed hashes
│   │   ├── TransferModal.tsx            # On-chain transfer initiation modal
│   │   ├── Navbar.tsx                   # Sticky navigation & actor switcher
│   │   └── QuickStartBar.tsx            # Interactive quick-action demo bar
│   ├── contracts/
│   │   └── soliditySource.ts            # Exported Solidity & Hardhat test code
│   ├── services/
│   │   └── blockchainService.ts         # EVM state engine, events, and mock accounts
│   ├── types/
│   │   └── blockchain.ts                # TypeScript interfaces, enums, and models
│   ├── utils/
│   │   ├── formatters.ts                # Currency, address, and date formatters
│   │   └── reportExport.ts              # Dossier generator, CSV exporter, certificate export
│   ├── App.tsx                          # Root application container & tab router
│   ├── index.css                        # Tailwind CSS global stylesheet
│   └── main.tsx                         # React application entry point
├── public/                              # Static public assets
├── package.json                         # Node.js dependencies & scripts
├── tsconfig.json                        # TypeScript compiler configuration
├── vite.config.ts                       # Vite build & bundler configuration
└── README.md                            # Complete technical documentation
```

---

## Installation & Setup

### Prerequisites
- **Node.js:** `v18.0.0` or higher
- **npm** or **yarn** / **pnpm**

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/blockchain-land-registry.git
   cd blockchain-land-registry
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:3000
   ```

5. **Execute type checking & linter:**
   ```bash
   npm run lint
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## Remix IDE Simulation Guide

You can easily deploy and interact with `LandRegistry.sol` directly inside the [Remix Ethereum IDE](https://remix.ethereum.org):

1. **Create File:** In the Remix file explorer, create a new file named `LandRegistry.sol`.
2. **Paste Code:** Copy the contract source code from `contracts/LandRegistry.sol`.
3. **Compile:**
   - Navigate to the **Solidity Compiler** tab.
   - Select compiler version `0.8.20` or higher.
   - Click **Compile LandRegistry.sol**.
4. **Deploy:**
   - Go to the **Deploy & Run Transactions** tab.
   - Choose Environment: **Remix VM (Cancun)** or **Injected Provider (MetaMask)**.
   - Select Contract: `LandRegistry`.
   - Click **Deploy**.
5. **Interactive Testing in Remix:**
   - **Step 1:** Call `registerProperty` using Account 1 (Deployer) with sample parcel details and an IPFS hash.
   - **Step 2:** Call `verifyProperty` using Account 1 to approve the registration.
   - **Step 3:** Switch to Account 2 (Owner) in Remix's account dropdown and call `transferOwnership` passing Account 3's address.
   - **Step 4:** Query `getOwnershipHistory` to observe the immutable provenance log.

---

## Hardhat Automated Testing

The repository contains a full Chai/Ethers test suite covering 100% of contract logic across 5 key test suites:

### Running Tests Locally
```bash
npx hardhat test
```

### Test Suite Coverage:
1. **Deployment & Roles:** Confirms correct deployer permissions, administrative registrar/verifier assignment.
2. **Property Registration:** Validates initial owner assignment, reverts on duplicate IDs, prevents unauthorized registrations.
3. **Property Verification:** Asserts status transitions to `VERIFIED`, blocks unverified transfers, prevents duplicate verifications.
4. **Ownership Transfer:** Tests atomic conveyance to Buyer B, prevents unauthorized transfers, blocks non-owners from transferring.
5. **Historical Provenance:** Verifies genesis records, timestamp accuracy, and multi-generation transfer chaining.

---

## Optional Frontend DApp UI

The application includes an optional, highly responsive React frontend designed with Tailwind CSS:

- **Actor Switcher:** Instantly switch between 4 simulated accounts:
  1. `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` — **Land Authority Admin (Registrar General)**
  2. `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` — **Alice Vance (Property Owner A)**
  3. `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` — **Bob Smith (Verified Buyer B)**
  4. `0x90F79bf6EB2c4f870365E785982E1f101E93b906` — **David Miller (Cadastral Surveyor / Notary)**
- **Real-Time Faucet:** Refill testnet wallets with +10 ETH or +50 ETH at any time.
- **Due Diligence Suite:** Programmatic 6-point check with instant PDF/TXT dossier export.
- **Deed Certificate Generator:** Download and print official cryptographic certificates.
- **Stamp Duty Calculator:** Calculate statutory taxes across Travis County, Napa County, Manhattan, Maharashtra, and London.

---

## Screenshots & UI Showcase

## Screenshots & UI Showcase

The following screenshots demonstrate the major workflows and interfaces of the LandRegistry Web3 DApp.

### 1. Land Authority Dashboard & Parcel Registration

The authority dashboard provides registry statistics, parcel registration, title verification queues, dispute visibility, and quick access to administrative Web3 actions.

![Land Authority Dashboard](images/1.png)

### 2. On-Chain Cadastral Registry Directory

A searchable live directory of parcels registered on the smart contract, including parcel identifiers, physical locations, area, current owner, valuation, lifecycle status, and property details.

![On-Chain Cadastral Registry Directory](images/2.png)

### 3. Smart Contract Role & Access Control Matrix

The role matrix visualizes smart-contract permissions for the Land Authority, property owners, buyers, surveyors/notaries, and unauthorized users. It demonstrates how Solidity access modifiers restrict privileged actions.

![Smart Contract Role and Access Control Matrix](images/3.png)

### 4. Public Property Title & Provenance Verification

The public title verification portal allows users to search a property UID and authenticate ownership, cadastral information, surveyor certificates, and immutable IPFS-backed title provenance on-chain.

![Public Property Title Verification](images/4.png)

### 5. Title Due Diligence & Encumbrance Audit

The due-diligence module performs an institutional six-point title health inspection and displays a trust score, encumbrance clearance, checkpoint results, and report export actions.

![Title Due Diligence and Encumbrance Audit](images/5.png)

### 6. Buyer & Escrow Settlement Portal

The buyer portal demonstrates the three-stage EVM settlement workflow: seller initiation, buyer escrow deposit, and smart-contract settlement with automatic ownership reassignment and fund release.

![Buyer and Escrow Settlement Portal](images/6.png)

### 7. Profile, KYC Credentials & EVM Signer

The profile interface displays the active Web3 identity, KYC verification state, signer balance, wallet address, portfolio access, cryptographic keys, and on-chain activity history.

![Profile KYC and EVM Signer](images/7.png)

---

## Results & Benchmarks

| Metric | Traditional Paper / Legacy Registry | Blockchain Land Registry | Improvement Factor |
| :--- | :--- | :--- | :--- |
| **Title Conveyance Time** | 30 to 90 Days | Instant (~12 sec block time) | **>200,000x Faster** |
| **Title Search & Due Diligence** | 3 to 10 Business Days | < 1 Second (Automated) | **Instantaneous** |
| **Risk of Forgery / Duplicate Titles** | High (Paper / Central DB) | Mathematically Impossible | **Zero Fraud Vector** |
| **Settlement Closing Costs** | 2% – 6% (Escrow / Notary Fees) | < $0.05 EVM Gas Cost | **>99% Cost Reduction** |
| **Public Transparency** | Restricted / High Search Fees | 100% Public & Verifiable | **Complete Openness** |

---

## Limitations

1. **Physical World Oracles (The Garbage-In Problem):** The blockchain guarantees that title records cannot be altered once recorded. However, an inaccurate physical land survey entered during initial genesis can only be corrected through administrative governance.
2. **Private Key Loss:** If a property owner loses access to their private key without social recovery or multi-sig custody, they lose control of the on-chain deed token.
3. **Off-Chain IPFS File Availability:** If IPFS nodes pinning deed documents go offline, document retrieval may experience latency (mitigated by enterprise pinning services like Filecoin / Pinata).

---

## Legal & Real-World Considerations

- **Statutory Integration:** Implementation requires legislative alignment with electronic conveyancing acts (e.g., Uniform Electronic Transactions Act, UK Law Commission Electronic Execution of Documents).
- **Cadastral Coordinate Systems:** Integration with standard global geodetic datums (WGS84, EPSG:4326) and national land information systems (LIS).
- **Inheritance & Probate Recovery:** Implementing administrative multisig guardian recovery contracts allowing courts to reassign deeds upon verified probate decrees.

---

## Future Improvements

- **ERC-721 / ERC-1155 Tokenization:** Converting land titles into compliant Non-Fungible Tokens (NFTs) to allow fractional ownership of commercial developments.
- **Zero-Knowledge Proofs (zk-SNARKs):** Enabling property owners to prove clear title and solvency to mortgage lenders without publicly revealing property valuations or personal identities.
- **Chainlink Oracle Integration:** Connecting municipal tax department APIs directly to automatically trigger tax lien freezes on delinquent parcels.
- **Cross-Chain Interoperability (CCIP):** Bridging land title NFTs between Ethereum Mainnet, Layer 2 rollups (Arbitrum/Optimism), and enterprise consortium ledgers.

---

## Learning Outcomes

By studying and interacting with this codebase, developers and researchers will master:
1. Writing production-ready, gas-optimized Solidity smart contracts (`v0.8.20`) with strict access modifiers and custom state machines.
2. Structuring maker-checker multi-party governance separating administrators from independent survey auditors.
3. Integrating off-chain IPFS content-addressed storage with on-chain cryptographic proofs.
4. Implementing EIP-191 digital signatures in TypeScript using Ethers.js v6.
5. Designing comprehensive unit testing suites in Hardhat/Chai asserting state mutations, reverts, and event emissions.
6. Building a reactive, decentralized web interface using React 19 and Tailwind CSS.

---

# 👩‍💻 Author

## Jui Ramteke

**GitHub:**  
https://github.com/Jui-Ramteke

**LinkedIn:**  
https://www.linkedin.com/in/jui-ramteke/

**Instagram:**  
https://www.instagram.com/jui_ramteke_/
