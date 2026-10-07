export enum PropertyStatus {
  REGISTERED = 'REGISTERED',
  VERIFIED = 'VERIFIED',
  TRANSFER_PENDING = 'TRANSFER_PENDING',
  TRANSFERRED = 'TRANSFERRED',
  DISPUTED = 'DISPUTED',
}

export enum PropertyType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  AGRICULTURAL = 'Agricultural',
  INDUSTRIAL = 'Industrial',
  SPECIAL_PURPOSE = 'Special Purpose',
}

export enum UserRole {
  AUTHORITY = 'AUTHORITY',
  OWNER = 'OWNER',
  BUYER = 'BUYER',
  VERIFIER = 'VERIFIER',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export interface OwnershipHistoryEntry {
  from: string;
  to: string;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
  transferType: 'REGISTRATION' | 'TRANSFER' | 'DISPUTE_RESOLVED';
  priceEth?: number;
  documentHash: string;
  notes?: string;
}

export interface Property {
  propertyId: string;
  propertyNumber: string; // Cadastral / Parcel Number e.g. "CAD-9042-TX"
  location: string;
  coordinates?: string;
  area: number; // in square feet or square meters
  areaUnit: 'sq.ft' | 'sq.m' | 'acres';
  propertyType: PropertyType;
  currentOwner: string;
  previousOwner: string;
  documentHash: string; // IPFS CID e.g. "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
  verified: boolean;
  status: PropertyStatus;
  registeredAt: number;
  lastTransferredAt: number;
  valuationEth: number;
  disputeReason?: string;
  history: OwnershipHistoryEntry[];
  imageUrl?: string;
  cadastralZone?: string;
  legalDescription?: string;
}

export interface TransferRequest {
  id: string;
  propertyId: string;
  sellerAddress: string;
  buyerAddress: string;
  agreedPriceEth: number;
  createdAt: number;
  status: 'PENDING_BUYER_ACCEPTANCE' | 'PENDING_AUTHORITY_APPROVAL' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  sellerSigned: boolean;
  buyerAccepted: boolean;
  authorityApproved: boolean;
  escrowLocked: boolean;
}

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  functionName: string;
  timestamp: number;
  status: 'SUCCESS' | 'REVERTED';
  gasUsed: number;
  valueEth?: number;
  eventsEmitted: BlockchainEvent[];
  revertReason?: string;
}

export interface BlockchainEvent {
  eventName: 'PropertyRegistered' | 'PropertyVerified' | 'TransferRequested' | 'OwnershipTransferred' | 'PropertyStatusChanged' | 'TransferRejected';
  propertyId: string;
  data: Record<string, any>;
  timestamp: number;
  blockNumber: number;
  txHash: string;
}

export interface TestAccount {
  address: string;
  name: string;
  role: UserRole;
  balanceEth: number;
  avatarColor: string;
  description: string;
}
