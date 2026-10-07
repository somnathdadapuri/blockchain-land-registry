import {
  Property,
  PropertyStatus,
  PropertyType,
  UserRole,
  TestAccount,
  BlockchainTransaction,
  BlockchainEvent,
  TransferRequest,
} from '../types/blockchain';

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    name: 'Land Authority (Admin)',
    role: UserRole.AUTHORITY,
    balanceEth: 1000.0,
    avatarColor: 'from-orange-500 to-amber-600',
    description: 'Government Land Registrar & Official Cadastral Administrator',
  },
  {
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    name: 'Alice Vance (Owner A)',
    role: UserRole.OWNER,
    balanceEth: 45.8,
    avatarColor: 'from-emerald-500 to-teal-600',
    description: 'Registered Property Investor & Title Deed Holder',
  },
  {
    address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    name: 'Bob Sterling (Buyer B)',
    role: UserRole.BUYER,
    balanceEth: 180.5,
    avatarColor: 'from-blue-500 to-indigo-600',
    description: 'Prospective Real Estate Purchaser & Title Claimant',
  },
  {
    address: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    name: 'David Clark (Surveyor/Verifier)',
    role: UserRole.VERIFIER,
    balanceEth: 12.4,
    avatarColor: 'from-purple-500 to-pink-600',
    description: 'Certified Government Surveyor & Legal Notary',
  },
  {
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    name: 'Eve Hacker (Unauthorized)',
    role: UserRole.UNAUTHORIZED,
    balanceEth: 0.85,
    avatarColor: 'from-rose-500 to-red-700',
    description: 'Unauthorized External Entity without Registrar Privileges',
  },
];

const INITIAL_PROPERTIES: Property[] = [
  {
    propertyId: 'PROP-2026-8821',
    propertyNumber: 'CAD-9042-TX',
    location: 'Plot 42, Silicon Boulevard, Austin, TX 78701',
    coordinates: '30.2672° N, 97.7431° W',
    area: 4850,
    areaUnit: 'sq.ft',
    propertyType: PropertyType.RESIDENTIAL,
    currentOwner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', // Alice
    previousOwner: '0x0000000000000000000000000000000000000000',
    documentHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    verified: true,
    status: PropertyStatus.VERIFIED,
    registeredAt: Date.now() - 86400000 * 45,
    lastTransferredAt: Date.now() - 86400000 * 45,
    valuationEth: 145.0,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    cadastralZone: 'Zone-R4 (High Density Residential)',
    legalDescription: 'Lot 14, Block 8, Section 3 of Travis County Urban Cadastre Survey.',
    history: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        timestamp: Date.now() - 86400000 * 45,
        blockNumber: 18452010,
        transactionHash: '0x7a3f89e451b6cd98f2490b4112e45da812bc81534ef03681423e84128f92a104',
        transferType: 'REGISTRATION',
        priceEth: 145.0,
        documentHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        notes: 'Initial cadastral title mint by Land Authority registrar.',
      },
    ],
  },
  {
    propertyId: 'PROP-2026-9412',
    propertyNumber: 'CAD-7718-CA',
    location: '1280 Vineyard Valley Road, Napa, CA 94558',
    coordinates: '38.2975° N, 122.2869° W',
    area: 12.5,
    areaUnit: 'acres',
    propertyType: PropertyType.AGRICULTURAL,
    currentOwner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', // Alice
    previousOwner: '0x0000000000000000000000000000000000000000',
    documentHash: 'QmPZ9gcCEpqKTo6aq61g2nXGUhM49BoKSreQHyC6ZvnUp7',
    verified: true,
    status: PropertyStatus.VERIFIED,
    registeredAt: Date.now() - 86400000 * 90,
    lastTransferredAt: Date.now() - 86400000 * 90,
    valuationEth: 320.0,
    imageUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80',
    cadastralZone: 'Zone-AG2 (Protected Viticulture)',
    legalDescription: 'Parcel 204, Napa River Alluvial Plain Agricultural Survey #91.',
    history: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        timestamp: Date.now() - 86400000 * 90,
        blockNumber: 18399120,
        transactionHash: '0x991fbc521190ca8817ebef87201889a712ccb3001882ea61b181a4192bdfb772',
        transferType: 'REGISTRATION',
        priceEth: 320.0,
        documentHash: 'QmPZ9gcCEpqKTo6aq61g2nXGUhM49BoKSreQHyC6ZvnUp7',
        notes: 'Agricultural deed authenticated and surveyed.',
      },
    ],
  },
  {
    propertyId: 'PROP-2026-3104',
    propertyNumber: 'CAD-1092-IL',
    location: '400 Industrial Parkway, Chicago, IL 60607',
    coordinates: '41.8781° N, 87.6298° W',
    area: 28500,
    areaUnit: 'sq.ft',
    propertyType: PropertyType.INDUSTRIAL,
    currentOwner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', // Alice
    previousOwner: '0x0000000000000000000000000000000000000000',
    documentHash: 'QmTPy259VmswYxZ1H1dG7L2K1nUvM8jX2oQ9z1aB5c4de3',
    verified: false,
    status: PropertyStatus.REGISTERED,
    registeredAt: Date.now() - 86400000 * 3,
    lastTransferredAt: Date.now() - 86400000 * 3,
    valuationEth: 210.0,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    cadastralZone: 'Zone-M1 (Light Manufacturing)',
    legalDescription: 'Industrial Park Substation 4, Cook County Land Registry.',
    history: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        timestamp: Date.now() - 86400000 * 3,
        blockNumber: 18512400,
        transactionHash: '0x21a4bc8819ef3471029ba871239aa8123bfd8291029cba8818293710293817aa',
        transferType: 'REGISTRATION',
        priceEth: 210.0,
        documentHash: 'QmTPy259VmswYxZ1H1dG7L2K1nUvM8jX2oQ9z1aB5c4de3',
        notes: 'Submitted for official verification by Surveyor.',
      },
    ],
  },
  {
    propertyId: 'PROP-2026-7750',
    propertyNumber: 'CAD-5520-NY',
    location: '750 Fifth Avenue, Floor 32, New York, NY 10019',
    coordinates: '40.7628° N, 73.9748° W',
    area: 8200,
    areaUnit: 'sq.ft',
    propertyType: PropertyType.COMMERCIAL,
    currentOwner: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', // Bob Sterling
    previousOwner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', // Alice Vance
    documentHash: 'QmZr7721NmKx9VbRtPq1WwL4M8Jk7H9tS2A5dF6g8h1jK3',
    verified: true,
    status: PropertyStatus.TRANSFERRED,
    registeredAt: Date.now() - 86400000 * 120,
    lastTransferredAt: Date.now() - 86400000 * 12,
    valuationEth: 480.0,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    cadastralZone: 'Zone-C5 (Midtown Core Commercial)',
    legalDescription: 'Unit 3201, Midtown Manhattan High-Rise Commercial Condominium.',
    history: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        timestamp: Date.now() - 86400000 * 120,
        blockNumber: 18310020,
        transactionHash: '0x12903710293817aa1829371029cba8818291029cba8818293710293817aa2102',
        transferType: 'REGISTRATION',
        priceEth: 450.0,
        documentHash: 'QmGenesisDeed7750A',
        notes: 'Initial corporate deed registered.',
      },
      {
        from: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        to: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        timestamp: Date.now() - 86400000 * 12,
        blockNumber: 18491820,
        transactionHash: '0x88921cb910293817aa1829371029cba8818291029cba8818293710293817aa09',
        transferType: 'TRANSFER',
        priceEth: 480.0,
        documentHash: 'QmZr7721NmKx9VbRtPq1WwL4M8Jk7H9tS2A5dF6g8h1jK3',
        notes: 'Commercial title conveyance executed on-chain.',
      },
    ],
  },
  {
    propertyId: 'PROP-2026-5519',
    propertyNumber: 'CAD-3391-WA',
    location: 'Cascade Ridge Wilderness Plot, King County, WA 98024',
    coordinates: '47.5819° N, 121.8471° W',
    area: 50.0,
    areaUnit: 'acres',
    propertyType: PropertyType.SPECIAL_PURPOSE,
    currentOwner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    previousOwner: '0x0000000000000000000000000000000000000000',
    documentHash: 'QmDisputedBoundarySurveyClaim9912048218',
    verified: false,
    status: PropertyStatus.DISPUTED,
    disputeReason: 'Contested riparian water boundary rights with neighboring timber estate.',
    registeredAt: Date.now() - 86400000 * 60,
    lastTransferredAt: Date.now() - 86400000 * 60,
    valuationEth: 95.0,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    cadastralZone: 'Zone-F1 (Forestry Conservation)',
    legalDescription: 'Section 19 North Ridge Boundary Reservation.',
    history: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        timestamp: Date.now() - 86400000 * 60,
        blockNumber: 18410290,
        transactionHash: '0x55018291029cba8818293710293817aa1829371029cba8818291029cba881829',
        transferType: 'REGISTRATION',
        priceEth: 95.0,
        documentHash: 'QmDisputedBoundarySurveyClaim9912048218',
        notes: 'Flagged with dispute moratorium.',
      },
    ],
  },
];

const STORAGE_KEYS = {
  PROPERTIES: 'landregistry_properties_v1',
  TRANSACTIONS: 'landregistry_transactions_v1',
  EVENTS: 'landregistry_events_v1',
  TRANSFERS: 'landregistry_transfer_requests_v1',
  BLOCK_NUMBER: 'landregistry_current_block_v1',
};

// Helper for generating realistic crypto hashes
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateIpfsCid(contentSummary: string): string {
  // Compute deterministic synthetic IPFS v0 CID (Qm...)
  let hashNum = 0;
  for (let i = 0; i < contentSummary.length; i++) {
    hashNum = (hashNum << 5) - hashNum + contentSummary.charCodeAt(i);
    hashNum |= 0;
  }
  const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = 'Qm';
  let seed = Math.abs(hashNum) + Date.now();
  for (let i = 0; i < 44; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    result += base58chars[seed % base58chars.length];
  }
  return result;
}

class BlockchainService {
  private properties: Property[] = [];
  private transactions: BlockchainTransaction[] = [];
  private events: BlockchainEvent[] = [];
  private transferRequests: TransferRequest[] = [];
  private currentBlockNumber = 18512450;
  private currentAccount: TestAccount = TEST_ACCOUNTS[0];
  private accounts: TestAccount[] = [...TEST_ACCOUNTS];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedProps = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      const savedTxs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const savedTransfers = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
      const savedBlock = localStorage.getItem(STORAGE_KEYS.BLOCK_NUMBER);

      if (savedProps) {
        this.properties = JSON.parse(savedProps);
      } else {
        this.properties = [...INITIAL_PROPERTIES];
        this.saveProperties();
      }

      if (savedTxs) {
        this.transactions = JSON.parse(savedTxs);
      } else {
        this.seedInitialTransactions();
      }

      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      } else {
        this.seedInitialEvents();
      }

      if (savedTransfers) {
        this.transferRequests = JSON.parse(savedTransfers);
      }

      if (savedBlock) {
        this.currentBlockNumber = parseInt(savedBlock, 10);
      }
    } catch (e) {
      console.warn('Error loading state from localStorage, falling back to seed', e);
      this.properties = [...INITIAL_PROPERTIES];
      this.seedInitialTransactions();
      this.seedInitialEvents();
    }
  }

  private seedInitialTransactions() {
    this.transactions = [
      {
        hash: '0x88921cb910293817aa1829371029cba8818291029cba8818293710293817aa09',
        blockNumber: 18491820,
        from: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        to: '0x0000000000000000000000000000000000000000', // LandRegistry Contract
        functionName: 'transferOwnership(string,address,string,uint256)',
        timestamp: Date.now() - 86400000 * 12,
        status: 'SUCCESS',
        gasUsed: 84210,
        valueEth: 480.0,
        eventsEmitted: [
          {
            eventName: 'OwnershipTransferred',
            propertyId: 'PROP-2026-7750',
            data: {
              previousOwner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
              newOwner: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
              priceEth: 480.0,
            },
            timestamp: Date.now() - 86400000 * 12,
            blockNumber: 18491820,
            txHash: '0x88921cb910293817aa1829371029cba8818291029cba8818293710293817aa09',
          },
        ],
      },
      {
        hash: '0x7a3f89e451b6cd98f2490b4112e45da812bc81534ef03681423e84128f92a104',
        blockNumber: 18452010,
        from: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        to: '0x0000000000000000000000000000000000000000',
        functionName: 'registerProperty(string,string,string,uint256,uint8,address,string,uint256)',
        timestamp: Date.now() - 86400000 * 45,
        status: 'SUCCESS',
        gasUsed: 142850,
        eventsEmitted: [
          {
            eventName: 'PropertyRegistered',
            propertyId: 'PROP-2026-8821',
            data: {
              owner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
              area: 4850,
              propertyNumber: 'CAD-9042-TX',
            },
            timestamp: Date.now() - 86400000 * 45,
            blockNumber: 18452010,
            txHash: '0x7a3f89e451b6cd98f2490b4112e45da812bc81534ef03681423e84128f92a104',
          },
        ],
      },
    ];
    this.saveTransactions();
  }

  private seedInitialEvents() {
    this.events = [
      {
        eventName: 'OwnershipTransferred',
        propertyId: 'PROP-2026-7750',
        data: {
          previousOwner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
          newOwner: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
          priceEth: 480.0,
        },
        timestamp: Date.now() - 86400000 * 12,
        blockNumber: 18491820,
        txHash: '0x88921cb910293817aa1829371029cba8818291029cba8818293710293817aa09',
      },
      {
        eventName: 'PropertyVerified',
        propertyId: 'PROP-2026-8821',
        data: { verifier: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71' },
        timestamp: Date.now() - 86400000 * 44,
        blockNumber: 18452100,
        txHash: '0x441b89ef3471029ba871239aa8123bfd8291029cba8818293710293817aa9910',
      },
      {
        eventName: 'PropertyRegistered',
        propertyId: 'PROP-2026-8821',
        data: {
          owner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
          area: 4850,
          propertyNumber: 'CAD-9042-TX',
        },
        timestamp: Date.now() - 86400000 * 45,
        blockNumber: 18452010,
        txHash: '0x7a3f89e451b6cd98f2490b4112e45da812bc81534ef03681423e84128f92a104',
      },
    ];
    this.saveEvents();
  }

  private saveProperties() {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(this.properties));
  }

  private saveTransactions() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
  }

  private saveEvents() {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
  }

  private saveTransfers() {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(this.transferRequests));
  }

  private saveBlockNumber() {
    localStorage.setItem(STORAGE_KEYS.BLOCK_NUMBER, this.currentBlockNumber.toString());
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSFERS);
    localStorage.removeItem(STORAGE_KEYS.BLOCK_NUMBER);
    this.loadState();
    this.notify();
  }

  public resetData() {
    this.resetToDefault();
  }

  // --- ACCOUNT & WALLET METHODS ---

  public getAccounts(): TestAccount[] {
    return [...this.accounts];
  }

  public getCurrentAccount(): TestAccount {
    return this.currentAccount;
  }

  public setCurrentAccount(account: TestAccount) {
    this.currentAccount = account;
    this.notify();
  }

  public addFundsToAccount(address: string, amountEth: number) {
    this.accounts = this.accounts.map((acc) => {
      if (acc.address.toLowerCase() === address.toLowerCase()) {
        const updated = { ...acc, balanceEth: acc.balanceEth + amountEth };
        if (this.currentAccount.address.toLowerCase() === address.toLowerCase()) {
          this.currentAccount = updated;
        }
        return updated;
      }
      return acc;
    });
    this.notify();
  }

  // --- QUERY APIS ---

  public getProperties(): Property[] {
    return [...this.properties];
  }

  public getPropertyById(id: string): Property | undefined {
    if (!id) return undefined;
    const target = id.toLowerCase();
    return this.properties.find(
      (p) =>
        (p.propertyId && p.propertyId.toLowerCase() === target) ||
        (p.propertyNumber && p.propertyNumber.toLowerCase() === target)
    );
  }

  public getPropertiesByOwner(ownerAddress: string): Property[] {
    if (!ownerAddress) return [];
    const target = ownerAddress.toLowerCase();
    return this.properties.filter(
      (p) => p.currentOwner && p.currentOwner.toLowerCase() === target
    );
  }

  public getTransactions(): BlockchainTransaction[] {
    return [...this.transactions];
  }

  public getEvents(): BlockchainEvent[] {
    return [...this.events];
  }

  public getTransferRequests(): TransferRequest[] {
    return [...this.transferRequests];
  }

  public getCurrentBlockNumber(): number {
    return this.currentBlockNumber;
  }

  public getCurrentBlock(): number {
    return this.currentBlockNumber;
  }

  // --- CONTRACT TRANSACTION EXECUTION METHODS ---

  /**
   * 8. registerProperty()
   * Only callable by Land Authority Registrar
   */
  public registerProperty(
    dataOrCaller:
      | string
      | {
          propertyId: string;
          propertyNumber?: string;
          location: string;
          coordinates?: string;
          area: number;
          areaUnit?: 'sq.ft' | 'sq.m' | 'acres';
          propertyType: PropertyType;
          initialOwner: string;
          documentHash: string;
          valuationEth?: number;
          imageUrl?: string;
          cadastralZone?: string;
          legalDescription?: string;
        },
    explicitData?: {
      propertyId: string;
      propertyNumber?: string;
      location: string;
      coordinates?: string;
      area: number;
      areaUnit?: 'sq.ft' | 'sq.m' | 'acres';
      propertyType: PropertyType;
      initialOwner: string;
      documentHash: string;
      valuationEth?: number;
      imageUrl?: string;
      cadastralZone?: string;
      legalDescription?: string;
    }
  ): { success: boolean; txHash?: string; error?: string } {
    const callerAddress = typeof dataOrCaller === 'string' ? dataOrCaller : this.currentAccount.address;
    const data = typeof dataOrCaller === 'string' ? explicitData! : dataOrCaller;

    // 1. Check Authority permission
    const authorityAccount = TEST_ACCOUNTS.find((a) => a.role === UserRole.AUTHORITY);
    const isAuth = callerAddress.toLowerCase() === authorityAccount?.address.toLowerCase();

    if (!isAuth) {
      return {
        success: false,
        error: 'REVERT: LandRegistry: Caller is not an authorized Land Authority registrar (Only Admin/Registrar allowed)',
      };
    }

    // 2. Validate inputs
    if (!data.propertyId || data.propertyId.trim().length === 0) {
      return { success: false, error: 'REVERT: LandRegistry: Property ID cannot be empty' };
    }

    const existing = this.properties.find((p) => p.propertyId.toLowerCase() === data.propertyId.toLowerCase());
    if (existing) {
      return { success: false, error: 'REVERT: LandRegistry: Property ID already registered' };
    }

    if (!data.initialOwner || data.initialOwner === '0x0000000000000000000000000000000000000000') {
      return { success: false, error: 'REVERT: LandRegistry: Initial owner cannot be zero address' };
    }

    if (data.area <= 0) {
      return { success: false, error: 'REVERT: LandRegistry: Property area must be greater than zero' };
    }

    if (!data.documentHash || data.documentHash.trim().length === 0) {
      return { success: false, error: 'REVERT: LandRegistry: IPFS document hash required' };
    }

    // Advance block
    this.currentBlockNumber += 1;
    const txHash = generateTxHash();
    const now = Date.now();

    const newProperty: Property = {
      propertyId: data.propertyId,
      propertyNumber: data.propertyNumber || `CAD-${Math.floor(1000 + Math.random() * 9000)}-REG`,
      location: data.location,
      coordinates: data.coordinates || '30.2672° N, 97.7431° W',
      area: data.area,
      areaUnit: data.areaUnit || 'sq.ft',
      propertyType: data.propertyType,
      currentOwner: data.initialOwner,
      previousOwner: '0x0000000000000000000000000000000000000000',
      documentHash: data.documentHash,
      verified: false,
      status: PropertyStatus.REGISTERED,
      registeredAt: now,
      lastTransferredAt: now,
      valuationEth: data.valuationEth || 100,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      cadastralZone: data.cadastralZone || 'Zone-R2 (General Residential)',
      legalDescription: data.legalDescription || `Official Cadastral Parcel record ${data.propertyId} registered on-chain.`,
      history: [
        {
          from: '0x0000000000000000000000000000000000000000',
          to: data.initialOwner,
          timestamp: now,
          blockNumber: this.currentBlockNumber,
          transactionHash: txHash,
          transferType: 'REGISTRATION',
          priceEth: data.valuationEth,
          documentHash: data.documentHash,
          notes: 'Genesis land parcel registration by Land Authority registrar.',
        },
      ],
    };

    this.properties.unshift(newProperty);

    const emittedEvent: BlockchainEvent = {
      eventName: 'PropertyRegistered',
      propertyId: data.propertyId,
      data: {
        propertyNumber: newProperty.propertyNumber,
        owner: data.initialOwner,
        location: data.location,
        area: data.area,
        documentHash: data.documentHash,
      },
      timestamp: now,
      blockNumber: this.currentBlockNumber,
      txHash,
    };

    this.events.unshift(emittedEvent);

    const tx: BlockchainTransaction = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: callerAddress,
      to: '0xLandRegistryContract777777777777777777777',
      functionName: 'registerProperty(...)',
      timestamp: now,
      status: 'SUCCESS',
      gasUsed: 138940,
      eventsEmitted: [emittedEvent],
    };

    this.transactions.unshift(tx);

    this.saveProperties();
    this.saveTransactions();
    this.saveEvents();
    this.saveBlockNumber();
    this.notify();

    return { success: true, txHash };
  }

  /**
   * 9. verifyProperty()
   * Only callable by Land Authority or Authorized Verifier
   */
  public verifyProperty(
    callerOrPropertyId: string,
    explicitPropertyId?: string
  ): { success: boolean; txHash?: string; error?: string } {
    const callerAddress = explicitPropertyId ? callerOrPropertyId : this.currentAccount.address;
    const propertyId = explicitPropertyId || callerOrPropertyId;

    const authority = TEST_ACCOUNTS.find((a) => a.role === UserRole.AUTHORITY);
    const verifier = TEST_ACCOUNTS.find((a) => a.role === UserRole.VERIFIER);

    const isAuthorized =
      callerAddress.toLowerCase() === authority?.address.toLowerCase() ||
      callerAddress.toLowerCase() === verifier?.address.toLowerCase();

    if (!isAuthorized) {
      return {
        success: false,
        error: 'REVERT: LandRegistry: Caller is not an authorized Verifier/Notary (Permission Denied)',
      };
    }

    const prop = this.properties.find((p) => p.propertyId.toLowerCase() === propertyId.toLowerCase());
    if (!prop) {
      return { success: false, error: 'REVERT: LandRegistry: Property does not exist' };
    }

    if (prop.verified) {
      return { success: false, error: 'REVERT: LandRegistry: Property already verified' };
    }

    if (prop.status === PropertyStatus.DISPUTED) {
      return { success: false, error: 'REVERT: LandRegistry: Cannot verify disputed property' };
    }

    this.currentBlockNumber += 1;
    const txHash = generateTxHash();
    const now = Date.now();

    prop.verified = true;
    prop.status = PropertyStatus.VERIFIED;

    const emittedEvent: BlockchainEvent = {
      eventName: 'PropertyVerified',
      propertyId: prop.propertyId,
      data: { verifier: callerAddress },
      timestamp: now,
      blockNumber: this.currentBlockNumber,
      txHash,
    };

    this.events.unshift(emittedEvent);

    const statusEvent: BlockchainEvent = {
      eventName: 'PropertyStatusChanged',
      propertyId: prop.propertyId,
      data: { oldStatus: 'REGISTERED', newStatus: 'VERIFIED', reason: 'Surveyor Authenticated' },
      timestamp: now,
      blockNumber: this.currentBlockNumber,
      txHash,
    };
    this.events.unshift(statusEvent);

    const tx: BlockchainTransaction = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: callerAddress,
      to: '0xLandRegistryContract777777777777777777777',
      functionName: 'verifyProperty(string)',
      timestamp: now,
      status: 'SUCCESS',
      gasUsed: 52190,
      eventsEmitted: [emittedEvent, statusEvent],
    };

    this.transactions.unshift(tx);

    this.saveProperties();
    this.saveTransactions();
    this.saveEvents();
    this.saveBlockNumber();
    this.notify();

    return { success: true, txHash };
  }

  /**
   * 10. transferOwnership()
   * Atomic direct transfer by current owner
   */
  public transferOwnership(
    arg1: string,
    arg2: string,
    arg3?: string,
    arg4?: string | number,
    arg5?: number
  ): { success: boolean; txHash?: string; error?: string } {
    let callerAddress: string;
    let propertyId: string;
    let newOwnerAddress: string;
    let newDocumentHash: string;
    let salePriceEth: number;

    // Check if called as transferOwnership(propertyId, newOwner, newDocHash?, salePrice?)
    // or as transferOwnership(caller, propertyId, newOwner, newDocHash, salePrice)
    if (typeof arg4 === 'number' || (arg4 === undefined && typeof arg3 === 'string' && (arg3.startsWith('0x') || arg3.startsWith('Qm') || arg3 === ''))) {
      if (arg2.startsWith('0x')) {
        // (propertyId, newOwnerAddress, newDocHash, salePrice)
        callerAddress = this.currentAccount.address;
        propertyId = arg1;
        newOwnerAddress = arg2;
        newDocumentHash = (arg3 as string) || '';
        salePriceEth = typeof arg4 === 'number' ? arg4 : 0;
      } else {
        // (callerAddress, propertyId, newOwnerAddress, newDocHash, salePrice)
        callerAddress = arg1;
        propertyId = arg2;
        newOwnerAddress = arg3 || '';
        newDocumentHash = typeof arg4 === 'string' ? arg4 : '';
        salePriceEth = typeof arg5 === 'number' ? arg5 : 0;
      }
    } else {
      callerAddress = arg1;
      propertyId = arg2;
      newOwnerAddress = arg3 || '';
      newDocumentHash = typeof arg4 === 'string' ? arg4 : '';
      salePriceEth = typeof arg5 === 'number' ? arg5 : 0;
    }

    const prop = this.properties.find((p) => p.propertyId.toLowerCase() === propertyId.toLowerCase());
    if (!prop) {
      return { success: false, error: 'REVERT: LandRegistry: Property does not exist' };
    }

    if (prop.currentOwner.toLowerCase() !== callerAddress.toLowerCase()) {
      return { success: false, error: 'REVERT: LandRegistry: Caller is not current property owner' };
    }

    if (!newOwnerAddress || newOwnerAddress === '0x0000000000000000000000000000000000000000') {
      return { success: false, error: 'REVERT: LandRegistry: New owner cannot be zero address' };
    }

    if (newOwnerAddress.toLowerCase() === callerAddress.toLowerCase()) {
      return { success: false, error: 'REVERT: LandRegistry: Cannot transfer property to yourself' };
    }

    if (!prop.verified) {
      return { success: false, error: 'REVERT: LandRegistry: Unverified property cannot be transferred' };
    }

    if (prop.status === PropertyStatus.DISPUTED) {
      return { success: false, error: 'REVERT: LandRegistry: Disputed property cannot be transferred' };
    }

    this.currentBlockNumber += 1;
    const txHash = generateTxHash();
    const now = Date.now();

    const previousOwner = prop.currentOwner;
    prop.previousOwner = previousOwner;
    prop.currentOwner = newOwnerAddress;
    prop.status = PropertyStatus.TRANSFERRED;
    prop.lastTransferredAt = now;
    if (newDocumentHash && newDocumentHash.trim().length > 0) {
      prop.documentHash = newDocumentHash;
    }
    if (salePriceEth > 0) {
      prop.valuationEth = salePriceEth;
    }

    const historyEntry = {
      from: previousOwner,
      to: newOwnerAddress,
      timestamp: now,
      blockNumber: this.currentBlockNumber,
      transactionHash: txHash,
      transferType: 'TRANSFER' as const,
      priceEth: salePriceEth,
      documentHash: prop.documentHash,
      notes: `Ownership conveyance from ${previousOwner.slice(0, 8)}... to ${newOwnerAddress.slice(0, 8)}...`,
    };

    prop.history.unshift(historyEntry);

    const emittedEvent: BlockchainEvent = {
      eventName: 'OwnershipTransferred',
      propertyId: prop.propertyId,
      data: {
        previousOwner,
        newOwner: newOwnerAddress,
        newDocumentHash: prop.documentHash,
        priceEth: salePriceEth,
      },
      timestamp: now,
      blockNumber: this.currentBlockNumber,
      txHash,
    };
    this.events.unshift(emittedEvent);

    const tx: BlockchainTransaction = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: callerAddress,
      to: '0xLandRegistryContract777777777777777777777',
      functionName: 'transferOwnership(string,address,string,uint256)',
      timestamp: now,
      status: 'SUCCESS',
      gasUsed: 89400,
      valueEth: salePriceEth,
      eventsEmitted: [emittedEvent],
    };

    this.transactions.unshift(tx);

    this.saveProperties();
    this.saveTransactions();
    this.saveEvents();
    this.saveBlockNumber();
    this.notify();

    return { success: true, txHash };
  }

  /**
   * Request multi-step transfer with escrow
   */
  public requestTransfer(
    arg1: string,
    arg2: string,
    arg3?: string | number,
    arg4?: number
  ): { success: boolean; txHash?: string; error?: string } {
    let callerAddress: string;
    let propertyId: string;
    let buyerAddress: string;
    let agreedPriceEth: number;

    if (typeof arg3 === 'number') {
      callerAddress = this.currentAccount.address;
      propertyId = arg1;
      buyerAddress = arg2;
      agreedPriceEth = arg3;
    } else {
      callerAddress = arg1;
      propertyId = arg2;
      buyerAddress = (arg3 as string) || '';
      agreedPriceEth = arg4 || 0;
    }

    const prop = this.properties.find((p) => p.propertyId.toLowerCase() === propertyId.toLowerCase());
    if (!prop) return { success: false, error: 'Property not found' };
    if (prop.currentOwner.toLowerCase() !== callerAddress.toLowerCase()) {
      return { success: false, error: 'Caller is not current owner' };
    }
    if (!prop.verified) {
      return { success: false, error: 'Property must be verified before sale' };
    }
    if (prop.status === PropertyStatus.DISPUTED) {
      return { success: false, error: 'Cannot transfer disputed property' };
    }

    const reqId = `REQ-${Date.now().toString(36).toUpperCase()}`;
    const newReq: TransferRequest = {
      id: reqId,
      propertyId: prop.propertyId,
      sellerAddress: callerAddress,
      buyerAddress,
      agreedPriceEth,
      createdAt: Date.now(),
      status: 'PENDING_BUYER_ACCEPTANCE',
      sellerSigned: true,
      buyerAccepted: false,
      authorityApproved: false,
      escrowLocked: false,
    };

    prop.status = PropertyStatus.TRANSFER_PENDING;

    this.transferRequests.unshift(newReq);
    this.currentBlockNumber += 1;
    const txHash = generateTxHash();

    const emittedEvent: BlockchainEvent = {
      eventName: 'TransferRequested',
      propertyId: prop.propertyId,
      data: { seller: callerAddress, buyer: buyerAddress, priceEth: agreedPriceEth },
      timestamp: Date.now(),
      blockNumber: this.currentBlockNumber,
      txHash,
    };
    this.events.unshift(emittedEvent);

    this.saveProperties();
    this.saveTransfers();
    this.saveEvents();
    this.saveBlockNumber();
    this.notify();

    return { success: true, txHash };
  }

  public requestEscrowTransfer(
    propertyId: string,
    buyerAddress: string,
    agreedPriceEth: number
  ) {
    return this.requestTransfer(propertyId, buyerAddress, agreedPriceEth);
  }

  public acceptTransferAndPay(
    arg1: string,
    arg2?: string
  ): { success: boolean; txHash?: string; error?: string } {
    const callerAddress = arg2 ? arg1 : this.currentAccount.address;
    const requestId = arg2 || arg1;

    const req = this.transferRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: 'Transfer request not found' };
    if (req.buyerAddress.toLowerCase() !== callerAddress.toLowerCase()) {
      return { success: false, error: 'Caller is not the designated buyer' };
    }

    req.buyerAccepted = true;
    req.escrowLocked = true;
    req.status = 'PENDING_AUTHORITY_APPROVAL';

    this.currentBlockNumber += 1;
    const txHash = generateTxHash();

    this.saveTransfers();
    this.saveBlockNumber();
    this.notify();

    return { success: true, txHash };
  }

  public completeEscrowTransfer(
    arg1: string,
    arg2?: string,
    arg3?: string
  ): { success: boolean; txHash?: string; error?: string } {
    const callerAddress = arg2 ? arg1 : this.currentAccount.address;
    const requestId = arg2 || arg1;
    const updatedDocHash = arg2 ? arg3 : arg2;

    const req = this.transferRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: 'Transfer request not found' };

    const authority = TEST_ACCOUNTS.find((a) => a.role === UserRole.AUTHORITY);
    const isAllowed =
      callerAddress.toLowerCase() === req.sellerAddress.toLowerCase() ||
      callerAddress.toLowerCase() === authority?.address.toLowerCase();

    if (!isAllowed) {
      return { success: false, error: 'Only Seller or Land Authority can complete transfer' };
    }

    if (!req.buyerAccepted) {
      return { success: false, error: 'Buyer has not yet accepted or deposited escrow' };
    }

    const result = this.transferOwnership(
      req.sellerAddress,
      req.propertyId,
      req.buyerAddress,
      updatedDocHash || '',
      req.agreedPriceEth
    );

    if (result.success) {
      req.status = 'COMPLETED';
      req.authorityApproved = true;
      this.saveTransfers();
      this.notify();
    }

    return result;
  }

  public finalizeEscrowTransfer(requestId: string, updatedDocHash?: string) {
    return this.completeEscrowTransfer(this.currentAccount.address, requestId, updatedDocHash);
  }

  /**
   * Dispute management
   */
  public setDisputeStatus(
    arg1: string,
    arg2: string | boolean,
    arg3?: boolean | string,
    arg4?: string
  ): { success: boolean; txHash?: string; error?: string } {
    let callerAddress: string;
    let propertyId: string;
    let isDisputed: boolean;
    let reason: string;

    if (typeof arg2 === 'boolean') {
      callerAddress = this.currentAccount.address;
      propertyId = arg1;
      isDisputed = arg2;
      reason = (arg3 as string) || 'Dispute updated by authority';
    } else {
      callerAddress = arg1;
      propertyId = arg2 as string;
      isDisputed = Boolean(arg3);
      reason = arg4 || 'Dispute updated by authority';
    }

    const authority = TEST_ACCOUNTS.find((a) => a.role === UserRole.AUTHORITY);
    if (callerAddress.toLowerCase() !== authority?.address.toLowerCase()) {
      return { success: false, error: 'REVERT: LandRegistry: Only Land Authority can flag/unflag disputes' };
    }

    const prop = this.properties.find((p) => p.propertyId.toLowerCase() === propertyId.toLowerCase());
    if (!prop) return { success: false, error: 'Property not found' };

    this.currentBlockNumber += 1;
    const txHash = generateTxHash();
    const now = Date.now();

    const oldStatus = prop.status;
    if (isDisputed) {
      prop.status = PropertyStatus.DISPUTED;
      prop.disputeReason = reason || 'Legal contest regarding boundaries or ownership claims';
    } else {
      prop.status = prop.verified ? PropertyStatus.VERIFIED : PropertyStatus.REGISTERED;
      prop.disputeReason = undefined;
    }

    const emittedEvent: BlockchainEvent = {
      eventName: 'PropertyStatusChanged',
      propertyId: prop.propertyId,
      data: { oldStatus, newStatus: prop.status, reason },
      timestamp: now,
      blockNumber: this.currentBlockNumber,
      txHash,
    };

    this.events.unshift(emittedEvent);
    this.saveProperties();
    this.saveEvents();
    this.saveBlockNumber();
    this.notify();

    return { success: true, txHash };
  }

  public flagDispute(propertyId: string, isDisputed: boolean, reason?: string) {
    return this.setDisputeStatus(propertyId, isDisputed, reason || 'Legal boundary contest');
  }
}

export const blockchainService = new BlockchainService();
