export const LAND_REGISTRY_SOLIDITY_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LandRegistry
 * @dev Decentralized Land Registry and Property Title Ownership System.
 * Implements role-based authority, immutable provenance, IPFS document hashing,
 * verification workflows, dispute management, and multi-party transfer flows.
 * 
 * DISCLAIMER: This is an academic and technological reference implementation
 * intended for educational and simulation purposes on testnets/simulators.
 */
contract LandRegistry {
    // -------------------------------------------------------------------------
    // ENUMS & STRUCTS
    // -------------------------------------------------------------------------
    
    enum PropertyStatus {
        REGISTERED,       // 0: Property registered, awaiting official verification
        VERIFIED,         // 1: Authenticated by Land Authority / Verifier
        TRANSFER_PENDING, // 2: Transfer request in escrow / review
        TRANSFERRED,      // 3: Successfully transferred to new owner
        DISPUTED          // 4: Blocked due to legal contest or boundary dispute
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
        string propertyId;        // Unique Property UID (e.g., "PROP-2026-8821")
        string propertyNumber;    // Cadastral / Survey Parcel Number
        string location;          // Geographic / Physical Address
        uint256 area;             // Area in square units
        PropertyType propertyType;// Property classification
        address currentOwner;     // Current verified owner wallet
        address previousOwner;    // Immediate previous owner (0x0 if initial)
        string documentHash;      // IPFS CID of survey deed & title documents
        bool verified;            // True if authorized by Land Authority
        PropertyStatus status;    // Current status state machine
        uint256 registeredAt;     // Timestamp of initial on-chain registration
        uint256 lastTransferredAt;// Timestamp of latest ownership transfer
        uint256 valuationWei;     // Assessed tax / market valuation
    }

    struct TransferRequest {
        string propertyId;
        address seller;
        address buyer;
        uint256 agreedPriceWei;
        bool sellerApproved;
        bool buyerApproved;
        bool authorityApproved;
        bool escrowDeposited;
        bool completed;
        bool active;
    }

    // -------------------------------------------------------------------------
    // STATE VARIABLES
    // -------------------------------------------------------------------------

    address public immutable landAuthorityAdmin;
    uint256 public totalPropertiesCount;

    mapping(address => bool) public isAuthorizedRegistrar;
    mapping(address => bool) public isAuthorizedVerifier;

    // propertyId (string) => Property
    mapping(string => Property) private properties;
    
    // propertyId => exists
    mapping(string => bool) private propertyExists;

    // ownerAddress => array of propertyIds
    mapping(address => string[]) private ownerProperties;

    // propertyId => historical transfer log
    mapping(string => OwnershipRecord[]) private propertyHistory;

    // propertyId => active TransferRequest
    mapping(string => TransferRequest) public transferRequests;

    // -------------------------------------------------------------------------
    // EVENTS (Indexed for Frontend Querying & History Reconstruction)
    // -------------------------------------------------------------------------

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

    event TransferRejected(
        string indexed propertyId,
        address indexed rejectedBy,
        string reason,
        uint256 timestamp
    );

    // -------------------------------------------------------------------------
    // MODIFIERS
    // -------------------------------------------------------------------------

    modifier onlyAdmin() {
        require(msg.sender == landAuthorityAdmin, "LandRegistry: Caller is not the Land Authority Admin");
        _;
    }

    modifier onlyAuthorizedRegistrar() {
        require(
            msg.sender == landAuthorityAdmin || isAuthorizedRegistrar[msg.sender],
            "LandRegistry: Caller is not an authorized Land Authority registrar"
        );
        _;
    }

    modifier onlyAuthorizedVerifier() {
        require(
            msg.sender == landAuthorityAdmin || isAuthorizedVerifier[msg.sender],
            "LandRegistry: Caller is not an authorized Verifier/Notary"
        );
        _;
    }

    modifier onlyCurrentOwner(string memory _propertyId) {
        require(propertyExists[_propertyId], "LandRegistry: Property does not exist");
        require(properties[_propertyId].currentOwner == msg.sender, "LandRegistry: Caller is not current property owner");
        _;
    }

    // -------------------------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------------------------

    constructor() {
        landAuthorityAdmin = msg.sender;
        isAuthorizedRegistrar[msg.sender] = true;
        isAuthorizedVerifier[msg.sender] = true;
    }

    // -------------------------------------------------------------------------
    // ROLE MANAGEMENT
    // -------------------------------------------------------------------------

    function setRegistrarStatus(address _account, bool _status) external onlyAdmin {
        require(_account != address(0), "LandRegistry: Invalid account address");
        isAuthorizedRegistrar[_account] = _status;
    }

    function setVerifierStatus(address _account, bool _status) external onlyAdmin {
        require(_account != address(0), "LandRegistry: Invalid account address");
        isAuthorizedVerifier[_account] = _status;
    }

    // -------------------------------------------------------------------------
    // 8. PROPERTY REGISTRATION LOGIC
    // -------------------------------------------------------------------------

    /**
     * @notice Registers a new land parcel into the decentralized registry.
     * @dev Only callable by verified Land Authority / authorized registrar.
     */
    function registerProperty(
        string calldata _propertyId,
        string calldata _propertyNumber,
        string calldata _location,
        uint256 _area,
        PropertyType _propertyType,
        address _initialOwner,
        string calldata _documentHash,
        uint256 _valuationWei
    ) external onlyAuthorizedRegistrar {
        // Validation rules
        require(bytes(_propertyId).length > 0, "LandRegistry: Property ID cannot be empty");
        require(!propertyExists[_propertyId], "LandRegistry: Property ID already registered");
        require(_initialOwner != address(0), "LandRegistry: Initial owner cannot be zero address");
        require(_area > 0, "LandRegistry: Property area must be greater than zero");
        require(bytes(_documentHash).length > 0, "LandRegistry: IPFS document hash required");
        require(bytes(_location).length > 0, "LandRegistry: Location required");

        // Construct property record
        Property memory newProp = Property({
            propertyId: _propertyId,
            propertyNumber: _propertyNumber,
            location: _location,
            area: _area,
            propertyType: _propertyType,
            currentOwner: _initialOwner,
            previousOwner: address(0),
            documentHash: _documentHash,
            verified: false,
            status: PropertyStatus.REGISTERED,
            registeredAt: block.timestamp,
            lastTransferredAt: block.timestamp,
            valuationWei: _valuationWei
        });

        properties[_propertyId] = newProp;
        propertyExists[_propertyId] = true;
        ownerProperties[_initialOwner].push(_propertyId);
        totalPropertiesCount++;

        // Record initial provenance log
        propertyHistory[_propertyId].push(OwnershipRecord({
            from: address(0),
            to: _initialOwner,
            timestamp: block.timestamp,
            blockNumber: block.number,
            documentHash: _documentHash,
            priceWei: _valuationWei
        }));

        emit PropertyRegistered(
            _propertyId,
            _propertyNumber,
            _initialOwner,
            _location,
            _area,
            _documentHash,
            block.timestamp
        );
    }

    // -------------------------------------------------------------------------
    // 9. PROPERTY VERIFICATION LOGIC
    // -------------------------------------------------------------------------

    /**
     * @notice Official verification of cadastral boundary and legal deed.
     * @dev Separated from registration to enforce maker-checker multi-party governance.
     */
    function verifyProperty(string calldata _propertyId) external onlyAuthorizedVerifier {
        require(propertyExists[_propertyId], "LandRegistry: Property does not exist");
        Property storage prop = properties[_propertyId];
        require(!prop.verified, "LandRegistry: Property already verified");
        require(prop.status != PropertyStatus.DISPUTED, "LandRegistry: Cannot verify disputed property");

        prop.verified = true;
        prop.status = PropertyStatus.VERIFIED;

        emit PropertyVerified(_propertyId, msg.sender, block.timestamp);
        emit PropertyStatusChanged(
            _propertyId,
            PropertyStatus.REGISTERED,
            PropertyStatus.VERIFIED,
            "Official verification completed by surveyor/authority",
            block.timestamp
        );
    }

    // -------------------------------------------------------------------------
    // 10. DIRECT OWNERSHIP TRANSFER LOGIC
    // -------------------------------------------------------------------------

    /**
     * @notice Direct transfer from current owner to verified buyer.
     * @dev Simple atomic transfer mechanism.
     */
    function transferOwnership(
        string calldata _propertyId,
        address _newOwner,
        string calldata _newDocumentHash,
        uint256 _salePriceWei
    ) external onlyCurrentOwner(_propertyId) {
        require(_newOwner != address(0), "LandRegistry: New owner cannot be zero address");
        require(_newOwner != msg.sender, "LandRegistry: Cannot transfer property to yourself");

        Property storage prop = properties[_propertyId];
        require(prop.verified, "LandRegistry: Unverified property cannot be transferred");
        require(prop.status != PropertyStatus.DISPUTED, "LandRegistry: Disputed property cannot be transferred");

        address previousOwner = prop.currentOwner;

        // Update state
        prop.previousOwner = previousOwner;
        prop.currentOwner = _newOwner;
        prop.status = PropertyStatus.TRANSFERRED;
        prop.lastTransferredAt = block.timestamp;
        if (bytes(_newDocumentHash).length > 0) {
            prop.documentHash = _newDocumentHash;
        }

        // Maintain owner array mappings
        _removePropertyFromOwner(previousOwner, _propertyId);
        ownerProperties[_newOwner].push(_propertyId);

        // Record provenance
        propertyHistory[_propertyId].push(OwnershipRecord({
            from: previousOwner,
            to: _newOwner,
            timestamp: block.timestamp,
            blockNumber: block.number,
            documentHash: prop.documentHash,
            priceWei: _salePriceWei
        }));

        emit OwnershipTransferred(
            _propertyId,
            previousOwner,
            _newOwner,
            prop.documentHash,
            block.timestamp,
            _salePriceWei
        );

        emit PropertyStatusChanged(
            _propertyId,
            PropertyStatus.VERIFIED,
            PropertyStatus.TRANSFERRED,
            "Ownership transferred to new deed holder",
            block.timestamp
        );
    }

    // -------------------------------------------------------------------------
    // MULTI-STEP ESCROW TRANSFER LOGIC (ADVANCED FLOW)
    // -------------------------------------------------------------------------

    function requestTransfer(
        string calldata _propertyId,
        address _buyer,
        uint256 _agreedPriceWei
    ) external onlyCurrentOwner(_propertyId) {
        require(_buyer != address(0), "LandRegistry: Invalid buyer");
        require(_buyer != msg.sender, "LandRegistry: Buyer cannot be current owner");
        Property storage prop = properties[_propertyId];
        require(prop.verified, "LandRegistry: Property must be verified before sale");
        require(prop.status != PropertyStatus.DISPUTED, "LandRegistry: Cannot transfer disputed property");

        transferRequests[_propertyId] = TransferRequest({
            propertyId: _propertyId,
            seller: msg.sender,
            buyer: _buyer,
            agreedPriceWei: _agreedPriceWei,
            sellerApproved: true,
            buyerApproved: false,
            authorityApproved: false,
            escrowDeposited: false,
            completed: false,
            active: true
        });

        prop.status = PropertyStatus.TRANSFER_PENDING;

        emit TransferRequested(_propertyId, msg.sender, _buyer, _agreedPriceWei, block.timestamp);
    }

    function acceptTransferAndPay(string calldata _propertyId) external payable {
        TransferRequest storage req = transferRequests[_propertyId];
        require(req.active, "LandRegistry: No active transfer request");
        require(msg.sender == req.buyer, "LandRegistry: Caller is not specified buyer");
        require(!req.buyerApproved, "LandRegistry: Already approved by buyer");
        require(msg.value >= req.agreedPriceWei, "LandRegistry: Insufficient escrow payment");

        req.buyerApproved = true;
        req.escrowDeposited = true;
    }

    function completeTransfer(
        string calldata _propertyId,
        string calldata _newDocumentHash
    ) external {
        TransferRequest storage req = transferRequests[_propertyId];
        require(req.active, "LandRegistry: No active transfer request");
        require(
            msg.sender == req.seller || msg.sender == landAuthorityAdmin,
            "LandRegistry: Only seller or Authority can finalize"
        );
        require(req.buyerApproved, "LandRegistry: Buyer has not accepted/escrowed yet");

        Property storage prop = properties[_propertyId];
        address oldOwner = prop.currentOwner;
        address newOwner = req.buyer;

        prop.previousOwner = oldOwner;
        prop.currentOwner = newOwner;
        prop.status = PropertyStatus.TRANSFERRED;
        prop.lastTransferredAt = block.timestamp;
        if (bytes(_newDocumentHash).length > 0) {
            prop.documentHash = _newDocumentHash;
        }

        _removePropertyFromOwner(oldOwner, _propertyId);
        ownerProperties[newOwner].push(_propertyId);

        propertyHistory[_propertyId].push(OwnershipRecord({
            from: oldOwner,
            to: newOwner,
            timestamp: block.timestamp,
            blockNumber: block.number,
            documentHash: prop.documentHash,
            priceWei: req.agreedPriceWei
        }));

        req.completed = true;
        req.active = false;

        // Release escrow funds to seller
        if (req.agreedPriceWei > 0) {
            (bool success, ) = payable(oldOwner).call{value: req.agreedPriceWei}("");
            require(success, "LandRegistry: Escrow payout failed");
        }

        emit OwnershipTransferred(
            _propertyId,
            oldOwner,
            newOwner,
            prop.documentHash,
            block.timestamp,
            req.agreedPriceWei
        );
    }

    // -------------------------------------------------------------------------
    // DISPUTE MANAGEMENT
    // -------------------------------------------------------------------------

    function setDisputeStatus(
        string calldata _propertyId,
        bool _isDisputed,
        string calldata _reason
    ) external onlyAuthorizedRegistrar {
        require(propertyExists[_propertyId], "LandRegistry: Property does not exist");
        Property storage prop = properties[_propertyId];

        PropertyStatus previousStatus = prop.status;
        if (_isDisputed) {
            prop.status = PropertyStatus.DISPUTED;
        } else {
            prop.status = prop.verified ? PropertyStatus.VERIFIED : PropertyStatus.REGISTERED;
        }

        emit PropertyStatusChanged(
            _propertyId,
            previousStatus,
            prop.status,
            _reason,
            block.timestamp
        );
    }

    // -------------------------------------------------------------------------
    // GETTERS & VIEWS
    // -------------------------------------------------------------------------

    function getProperty(string calldata _propertyId) external view returns (Property memory) {
        require(propertyExists[_propertyId], "LandRegistry: Property does not exist");
        return properties[_propertyId];
    }

    function isPropertyVerified(string calldata _propertyId) external view returns (bool) {
        require(propertyExists[_propertyId], "LandRegistry: Property does not exist");
        return properties[_propertyId].verified;
    }

    function getPropertiesByOwner(address _owner) external view returns (string[] memory) {
        return ownerProperties[_owner];
    }

    function getOwnershipHistory(string calldata _propertyId) external view returns (OwnershipRecord[] memory) {
        require(propertyExists[_propertyId], "LandRegistry: Property does not exist");
        return propertyHistory[_propertyId];
    }

    // -------------------------------------------------------------------------
    // INTERNAL HELPERS
    // -------------------------------------------------------------------------

    function _removePropertyFromOwner(address _owner, string memory _propertyId) internal {
        string[] storage list = ownerProperties[_owner];
        for (uint256 i = 0; i < list.length; i++) {
            if (keccak256(bytes(list[i])) == keccak256(bytes(_propertyId))) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }
}`;

export const HARDHAT_TEST_CODE = `const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry Smart Contract Comprehensive Test Suite", function () {
  let LandRegistry;
  let landRegistry;
  let admin, ownerA, buyerB, unauthorizedEve, verifierDavid;

  const PROP_ID_1 = "PROP-2026-8821";
  const PROP_NUM_1 = "CAD-9042-TX";
  const LOCATION_1 = "Plot 42, Silicon Boulevard, Austin, TX";
  const AREA_1 = 4500; // sq ft
  const DOC_HASH_1 = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
  const VALUATION_1 = ethers.parseEther("150");

  beforeEach(async function () {
    [admin, ownerA, buyerB, unauthorizedEve, verifierDavid] = await ethers.getSigners();
    LandRegistry = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy();
    await landRegistry.waitForDeployment();
  });

  describe("1. Deployment & Roles", function () {
    it("1.1 Should set correct deployer as landAuthorityAdmin", async function () {
      expect(await landRegistry.landAuthorityAdmin()).to.equal(admin.address);
      expect(await landRegistry.isAuthorizedRegistrar(admin.address)).to.be.true;
    });

    it("1.2 Admin can grant verifier status", async function () {
      await landRegistry.connect(admin).setVerifierStatus(verifierDavid.address, true);
      expect(await landRegistry.isAuthorizedVerifier(verifierDavid.address)).to.be.true;
    });
  });

  describe("2. Property Registration", function () {
    it("2.1 Authority registers property successfully & emits PropertyRegistered", async function () {
      await expect(
        landRegistry.connect(admin).registerProperty(
          PROP_ID_1, PROP_NUM_1, LOCATION_1, AREA_1, 0, ownerA.address, DOC_HASH_1, VALUATION_1
        )
      ).to.emit(landRegistry, "PropertyRegistered")
       .withArgs(PROP_ID_1, PROP_NUM_1, ownerA.address, LOCATION_1, AREA_1, DOC_HASH_1, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

      const prop = await landRegistry.getProperty(PROP_ID_1);
      expect(prop.currentOwner).to.equal(ownerA.address);
      expect(prop.verified).to.be.false;
      expect(prop.status).to.equal(0); // REGISTERED
    });

    it("2.2 Reverts on duplicate property ID", async function () {
      await landRegistry.connect(admin).registerProperty(
        PROP_ID_1, PROP_NUM_1, LOCATION_1, AREA_1, 0, ownerA.address, DOC_HASH_1, VALUATION_1
      );
      await expect(
        landRegistry.connect(admin).registerProperty(
          PROP_ID_1, "CAD-9999", "Another Location", 2000, 0, ownerA.address, DOC_HASH_1, VALUATION_1
        )
      ).to.be.revertedWith("LandRegistry: Property ID already registered");
    });

    it("2.3 Reverts if initial owner is zero address", async function () {
      await expect(
        landRegistry.connect(admin).registerProperty(
          "PROP-FAIL", PROP_NUM_1, LOCATION_1, AREA_1, 0, ethers.ZeroAddress, DOC_HASH_1, VALUATION_1
        )
      ).to.be.revertedWith("LandRegistry: Initial owner cannot be zero address");
    });

    it("2.4 Reverts if unauthorized user attempts to register", async function () {
      await expect(
        landRegistry.connect(unauthorizedEve).registerProperty(
          "PROP-EVE", PROP_NUM_1, LOCATION_1, AREA_1, 0, unauthorizedEve.address, DOC_HASH_1, VALUATION_1
        )
      ).to.be.revertedWith("LandRegistry: Caller is not an authorized Land Authority registrar");
    });
  });

  describe("3. Property Verification", function () {
    beforeEach(async function () {
      await landRegistry.connect(admin).registerProperty(
        PROP_ID_1, PROP_NUM_1, LOCATION_1, AREA_1, 0, ownerA.address, DOC_HASH_1, VALUATION_1
      );
    });

    it("3.1 Authority verifies property & updates status to VERIFIED", async function () {
      await expect(landRegistry.connect(admin).verifyProperty(PROP_ID_1))
        .to.emit(landRegistry, "PropertyVerified");

      const prop = await landRegistry.getProperty(PROP_ID_1);
      expect(prop.verified).to.be.true;
      expect(prop.status).to.equal(1); // VERIFIED
    });

    it("3.2 Unauthorized user cannot verify property", async function () {
      await expect(
        landRegistry.connect(unauthorizedEve).verifyProperty(PROP_ID_1)
      ).to.be.revertedWith("LandRegistry: Caller is not an authorized Verifier/Notary");
    });

    it("3.3 Reverts if already verified", async function () {
      await landRegistry.connect(admin).verifyProperty(PROP_ID_1);
      await expect(
        landRegistry.connect(admin).verifyProperty(PROP_ID_1)
      ).to.be.revertedWith("LandRegistry: Property already verified");
    });
  });

  describe("4. Ownership Transfer", function () {
    beforeEach(async function () {
      await landRegistry.connect(admin).registerProperty(
        PROP_ID_1, PROP_NUM_1, LOCATION_1, AREA_1, 0, ownerA.address, DOC_HASH_1, VALUATION_1
      );
      await landRegistry.connect(admin).verifyProperty(PROP_ID_1);
    });

    it("4.1 Current owner transfers property to Buyer B successfully", async function () {
      const NEW_DOC = "QmNewDeedHashWithBuyerBSignature111222333444";
      await expect(
        landRegistry.connect(ownerA).transferOwnership(PROP_ID_1, buyerB.address, NEW_DOC, ethers.parseEther("160"))
      ).to.emit(landRegistry, "OwnershipTransferred")
       .withArgs(PROP_ID_1, ownerA.address, buyerB.address, NEW_DOC, anyValue, ethers.parseEther("160"));

      const prop = await landRegistry.getProperty(PROP_ID_1);
      expect(prop.currentOwner).to.equal(buyerB.address);
      expect(prop.previousOwner).to.equal(ownerA.address);
    });

    it("4.2 Old owner A cannot transfer again after transferring to B", async function () {
      await landRegistry.connect(ownerA).transferOwnership(PROP_ID_1, buyerB.address, DOC_HASH_1, 0);
      await expect(
        landRegistry.connect(ownerA).transferOwnership(PROP_ID_1, unauthorizedEve.address, DOC_HASH_1, 0)
      ).to.be.revertedWith("LandRegistry: Caller is not current property owner");
    });

    it("4.3 Reverts if non-owner attempts transfer", async function () {
      await expect(
        landRegistry.connect(unauthorizedEve).transferOwnership(PROP_ID_1, buyerB.address, DOC_HASH_1, 0)
      ).to.be.revertedWith("LandRegistry: Caller is not current property owner");
    });

    it("4.4 Reverts if new owner is zero address", async function () {
      await expect(
        landRegistry.connect(ownerA).transferOwnership(PROP_ID_1, ethers.ZeroAddress, DOC_HASH_1, 0)
      ).to.be.revertedWith("LandRegistry: New owner cannot be zero address");
    });

    it("4.5 Reverts if property is unverified", async function () {
      const UNVERIFIED_ID = "PROP-UNVERIFIED";
      await landRegistry.connect(admin).registerProperty(
        UNVERIFIED_ID, "CAD-99", "Location", 1000, 0, ownerA.address, DOC_HASH_1, 0
      );
      await expect(
        landRegistry.connect(ownerA).transferOwnership(UNVERIFIED_ID, buyerB.address, DOC_HASH_1, 0)
      ).to.be.revertedWith("LandRegistry: Unverified property cannot be transferred");
    });
  });

  describe("5. Historical Provenance & Querying", function () {
    it("5.1 Ownership history preserves genesis and subsequent transfers", async function () {
      await landRegistry.connect(admin).registerProperty(
        PROP_ID_1, PROP_NUM_1, LOCATION_1, AREA_1, 0, ownerA.address, DOC_HASH_1, VALUATION_1
      );
      await landRegistry.connect(admin).verifyProperty(PROP_ID_1);
      await landRegistry.connect(ownerA).transferOwnership(PROP_ID_1, buyerB.address, "QmDeed2", ethers.parseEther("160"));

      const history = await landRegistry.getOwnershipHistory(PROP_ID_1);
      expect(history.length).to.equal(2);
      expect(history[0].from).to.equal(ethers.ZeroAddress);
      expect(history[0].to).to.equal(ownerA.address);
      expect(history[1].from).to.equal(ownerA.address);
      expect(history[1].to).to.equal(buyerB.address);
    });
  });
});`;
