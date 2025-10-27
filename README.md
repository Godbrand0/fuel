# NFT Creator dApp - Fuel Network

A decentralized application that allows users to create, mint, and manage NFT collections on the Fuel Network without writing any code.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Development Phases](#development-phases)
- [Smart Contracts](#smart-contracts)
- [Frontend Application](#frontend-application)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Technical Specifications](#technical-specifications)
- [Resources](#resources)

---

## Overview

This dApp enables users to:
- Create NFT collections through a user-friendly interface
- Mint single edition NFTs (multiple copies of the same design)
- Create multi-asset collections (unique NFTs in one collection)
- Transfer NFTs to other users
- View and manage all their created NFTs

All NFTs are stored on the Fuel Network with metadata and images hosted on IPFS.

---

## Features

### For Users
- **No-Code NFT Creation**: Upload images and metadata through a simple UI
- **Two Creation Modes**:
  - **Single Edition**: Mint 1-10,000 copies of the same NFT
  - **Collection**: Create collections with multiple unique NFTs (max 10,000 per collection)
- **IPFS Storage**: Automatic image and metadata upload to IPFS
- **Wallet Integration**: Connect with Fuel wallet
- **NFT Gallery**: View all created and owned NFTs
- **Transfer Functionality**: Send NFTs to other addresses
- **Flexible Metadata**: Choose between unique or shared metadata for collections

### Technical Features
- **Factory Pattern**: Automated contract deployment for each collection
- **Fuel Native Assets**: Using SRC-20, SRC-3, and SRC-7 standards
- **Cost-Based Limits**: Minting costs scale with quantity
- **Event Logging**: Full on-chain event tracking
- **Ownership Verification**: Secure transfer mechanisms

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend dApp                          │
│  (React/Next.js + Fuel TypeScript SDK + IPFS Client)       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Factory Contract                          │
│  - Deploys new NFT contracts (SRC-12)                       │
│  - Tracks user → contract mappings                          │
│  - Charges creation fees                                    │
└────────────┬─────────────────────────┬──────────────────────┘
             │                         │
     ┌───────▼────────┐       ┌───────▼────────────┐
     │ Single Edition │       │ Collection Contract│
     │   Contract     │       │  (Multi-NFT)       │
     │                │       │                    │
     │ - Same IPFS URI│       │ - Unique URIs      │
     │ - N copies     │       │ - Batch mint       │
     │ - SRC-20/3/7   │       │ - SRC-20/3/7       │
     └────────────────┘       └────────────────────┘
             │                         │
             └─────────┬───────────────┘
                       ▼
              ┌─────────────────┐
              │  IPFS Network   │
              │  (Metadata +    │
              │   Images)       │
              └─────────────────┘
```

### Contract Hierarchy

1. **Factory Contract**: Main entry point, deploys child contracts
2. **Single Edition Contract**: Mints multiple copies of one NFT design
3. **Collection Contract**: Mints unique NFTs with different metadata
4. **Shared Libraries**: Common utilities and validation functions

---

## Prerequisites

### Required Tools

1. **Fuel Toolchain**
   - `fuelup` (Fuel toolchain manager)
   - `forc` (Sway compiler and package manager)
   - `fuel-core` (Fuel node)

2. **Node.js & Package Manager**
   - Node.js v18+
   - npm or yarn or pnpm

3. **Fuel Wallet**
   - Browser extension wallet for Fuel Network

4. **IPFS Tools** (Choose one)
   - Pinata account (recommended for beginners)
   - Web3.Storage account
   - Local IPFS node

5. **Development Tools**
   - Git
   - Code editor (VS Code recommended with Sway extension)

---

## Installation

### Step 1: Install Fuel Toolchain

```bash
# Install fuelup (Fuel toolchain installer)
curl https://install.fuel.network | sh

# Source the environment
source ~/.bashrc  # or ~/.zshrc for zsh users

# Install the latest toolchain
fuelup toolchain install latest
fuelup default latest

# Verify installation
forc --version
fuel-core --version
```

### Step 2: Clone the Repository

```bash
git clone https://github.com/yourusername/fuel-nft-creator.git
cd fuel-nft-creator
```

### Step 3: Install Node Dependencies (After Frontend Setup)

```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

### Step 4: Set Up IPFS

**Option A: Pinata (Recommended)**
```bash
# Sign up at https://pinata.cloud
# Get your API Key and Secret
# Add to .env file (see Environment Setup)
```

**Option B: Web3.Storage**
```bash
# Sign up at https://web3.storage
# Get your API token
# Add to .env file
```

### Step 5: Install Fuel Wallet

1. Go to https://wallet.fuel.network
2. Install browser extension
3. Create or import wallet
4. Switch to testnet

---

## Project Structure

```
fuel-nft-creator/
├── contracts/
│   ├── factory/
│   │   ├── src/
│   │   │   └── main.sw              # Factory contract
│   │   ├── tests/
│   │   │   └── harness.rs           # Contract tests
│   │   └── Forc.toml                # Contract manifest
│   │
│   ├── single-edition/
│   │   ├── src/
│   │   │   └── main.sw              # Single edition NFT
│   │   ├── tests/
│   │   └── Forc.toml
│   │
│   ├── collection/
│   │   ├── src/
│   │   │   └── main.sw              # Collection NFT
│   │   ├── tests/
│   │   └── Forc.toml
│   │
│   └── libs/
│       ├── src/
│       │   ├── lib.sw               # Shared library
│       │   ├── validation.sw       # Validation functions
│       │   └── fees.sw             # Fee calculations
│       └── Forc.toml
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js app directory
│   │   │   ├── create/            # Create NFT page
│   │   │   ├── my-nfts/           # User's NFTs page
│   │   │   ├── transfer/          # Transfer page
│   │   │   └── layout.tsx         # Root layout
│   │   │
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx  # Wallet connection
│   │   │   ├── NFTCard.tsx        # NFT display card
│   │   │   ├── CreateForm.tsx     # NFT creation form
│   │   │   └── TransferForm.tsx   # Transfer form
│   │   │
│   │   ├── hooks/
│   │   │   ├── useWallet.ts       # Wallet hook
│   │   │   ├── useIPFS.ts         # IPFS upload hook
│   │   │   └── useContracts.ts    # Contract interaction
│   │   │
│   │   ├── lib/
│   │   │   ├── fuel.ts            # Fuel SDK setup
│   │   │   ├── ipfs.ts            # IPFS client
│   │   │   └── contracts.ts       # Contract ABIs
│   │   │
│   │   └── types/
│   │       └── nft.ts             # TypeScript types
│   │
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── scripts/
│   ├── deploy-factory.ts          # Deploy factory contract
│   ├── deploy-templates.ts        # Deploy NFT templates
│   └── setup-testnet.ts           # Testnet setup
│
├── tests/
│   └── integration/               # E2E tests
│
├── .env.example                   # Environment variables template
├── .gitignore
├── Forc.toml                      # Workspace manifest
└── README.md                      # This file
```

---

## Development Phases

### Phase 1: Smart Contract Development (Week 1-2)

#### 1.1 Setup Sway Workspace
```bash
# Initialize workspace
forc new --workspace fuel-nft-creator
cd fuel-nft-creator

# Create contract projects
forc new contracts/factory
forc new contracts/single-edition
forc new contracts/collection
forc new contracts/libs --library
```

#### 1.2 Implement Contracts

**Tasks:**
- [ ] Implement Factory Contract (SRC-12)
  - Contract deployment logic
  - Bytecode verification
  - User tracking (StorageMap)
  - Creation fee logic
  - Events

- [ ] Implement Single Edition Contract
  - SRC-20 (Native Asset)
  - SRC-3 (Mint/Burn)
  - SRC-7 (Metadata)
  - Minting with amount parameter
  - Ownership tracking (StorageMap<SubId, Identity>)
  - Transfer function
  - Fee validation

- [ ] Implement Collection Contract
  - Same standards as Single Edition
  - Batch minting
  - Unique metadata URIs per token
  - Token ID → URI mapping
  - Max supply enforcement (10,000)

- [ ] Implement Shared Library
  - Validation functions
  - Fee calculations
  - Common storage helpers

#### 1.3 Write Contract Tests
```bash
# Run tests
forc test
```

### Phase 2: Frontend Development (Week 3-4)

#### 2.1 Setup Frontend Project
```bash
# Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app

cd frontend

# Install Fuel SDK
npm install fuels @fuel-ts/wallet @fuel-ts/contract

# Install IPFS client
npm install @pinata/sdk
# or
npm install @web3-storage/w3up-client

# Install UI libraries
npm install @headlessui/react @heroicons/react
```

#### 2.2 Generate Contract Types
```bash
# Build contracts first
cd ../contracts/factory
forc build

# Generate TypeScript types
npx fuels typegen -i ./out/debug/*-abi.json -o ../../frontend/src/lib/contracts
```

#### 2.3 Implement Frontend Pages

**Tasks:**
- [ ] Setup Fuel provider and wallet connection
- [ ] Create page with tabs
  - Single Edition form
  - Collection form
  - IPFS upload integration
  - Contract deployment + minting
- [ ] My NFTs page
  - Query factory for user contracts
  - Display NFT cards
  - Fetch metadata from IPFS
- [ ] Transfer page
  - NFT selection
  - Transfer form
  - Transaction confirmation

#### 2.4 IPFS Integration
- [ ] Image upload to IPFS
- [ ] Metadata JSON creation and upload
- [ ] Retrieval and display

### Phase 3: Integration & Testing (Week 5)

#### 3.1 Local Testing
```bash
# Start local Fuel node
fuel-core run --db-type in-memory

# Deploy contracts to local node
npm run deploy:local

# Start frontend
npm run dev
```

#### 3.2 Testnet Deployment
```bash
# Deploy to Fuel testnet
npm run deploy:testnet

# Update contract addresses in frontend
```

#### 3.3 End-to-End Testing
- [ ] User flow testing
- [ ] Contract interaction testing
- [ ] IPFS upload/retrieval testing
- [ ] Error handling

### Phase 4: Production Deployment (Week 6)

- [ ] Mainnet contract deployment
- [ ] Frontend deployment (Vercel/Netlify)
- [ ] Documentation
- [ ] User guides

---

## Smart Contracts

### Factory Contract

**Purpose**: Deploys and tracks NFT collection contracts

**Key Functions:**
```sway
abi NFTFactory {
    #[storage(read, write), payable]
    fn create_single_edition(metadata_uri: String, amount: u64) -> ContractId;

    #[storage(read, write), payable]
    fn create_collection(max_supply: u64) -> ContractId;

    #[storage(read)]
    fn get_user_contracts(user: Identity) -> Vec<ContractId>;

    #[storage(read)]
    fn get_creation_fee() -> u64;
}
```

**Standards**: SRC-12 (Contract Factory)

**Storage:**
```sway
storage {
    creation_fee: u64 = 1000000, // Base creation fee
    user_contracts: StorageMap<Identity, StorageVec<ContractId>> = StorageMap {},
    total_deployments: u64 = 0,
}
```

### Single Edition NFT Contract

**Purpose**: Mint multiple copies of the same NFT

**Key Functions:**
```sway
abi SingleEditionNFT {
    #[storage(read, write), payable]
    fn mint(amount: u64);

    #[storage(read, write)]
    fn transfer(to: Identity, token_id: SubId);

    #[storage(read)]
    fn owner_of(token_id: SubId) -> Identity;

    #[storage(read)]
    fn total_supply() -> u64;

    #[storage(read)]
    fn metadata_uri() -> String;
}
```

**Standards**: SRC-20, SRC-3, SRC-7

**Storage:**
```sway
storage {
    metadata_uri: StorageString = StorageString {},
    total_supply: u64 = 0,
    max_supply: u64 = 0,
    mint_fee: u64 = 100000,
    owners: StorageMap<SubId, Identity> = StorageMap {},
}
```

### Collection NFT Contract

**Purpose**: Create collections with unique NFTs

**Key Functions:**
```sway
abi CollectionNFT {
    #[storage(read, write), payable]
    fn mint(metadata_uri: String) -> SubId;

    #[storage(read, write), payable]
    fn batch_mint(metadata_uris: Vec<String>) -> Vec<SubId>;

    #[storage(read, write)]
    fn transfer(to: Identity, token_id: SubId);

    #[storage(read)]
    fn owner_of(token_id: SubId) -> Identity;

    #[storage(read)]
    fn token_uri(token_id: SubId) -> String;

    #[storage(read)]
    fn total_supply() -> u64;
}
```

**Standards**: SRC-20, SRC-3, SRC-7

**Storage:**
```sway
storage {
    total_supply: u64 = 0,
    max_supply: u64 = 10000,
    mint_fee: u64 = 100000,
    owners: StorageMap<SubId, Identity> = StorageMap {},
    token_uris: StorageMap<SubId, StorageString> = StorageMap {},
    next_token_id: u64 = 0,
}
```

---

## Frontend Application

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Fuel TypeScript SDK (@fuel-ts)
- **Storage**: IPFS (Pinata or Web3.Storage)
- **State Management**: React Context + Hooks
- **UI Components**: Headless UI

### Key Pages

#### 1. Create Page (`/create`)

**Two Tabs:**

**Single Edition Tab:**
- Image upload (drag & drop)
- Metadata form:
  - Name
  - Description
  - Attributes (key-value pairs)
- Amount input (1-10,000)
- Cost calculator (shows total minting cost)
- "Create & Mint" button

**Collection Tab:**
- Multiple image uploads
- Batch metadata input
- Toggle: Same metadata / Unique metadata
- Preview grid
- Max 10,000 NFTs warning
- "Create Collection" button

#### 2. My NFTs Page (`/my-nfts`)

**Features:**
- Grid view of all owned NFTs
- Filter by collection
- Search functionality
- NFT cards showing:
  - Image
  - Name
  - Collection name
  - Token ID
- Click to view details
- "Transfer" quick action

#### 3. Transfer Page (`/transfer`)

**Features:**
- Dropdown to select NFT
- NFT preview
- Recipient address input (with validation)
- Transfer confirmation modal
- Transaction status tracking

### Environment Variables

Create `.env.local` in `frontend/`:

```env
# Fuel Network
NEXT_PUBLIC_FUEL_NETWORK=testnet
NEXT_PUBLIC_FUEL_PROVIDER_URL=https://testnet.fuel.network/v1/graphql

# Contract Addresses (update after deployment)
NEXT_PUBLIC_FACTORY_CONTRACT_ID=0x...
NEXT_PUBLIC_SINGLE_EDITION_TEMPLATE_ID=0x...
NEXT_PUBLIC_COLLECTION_TEMPLATE_ID=0x...

# IPFS (Pinata)
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
NEXT_PUBLIC_PINATA_JWT=your_jwt

# OR Web3.Storage
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token

# App Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
NEXT_PUBLIC_MAX_COLLECTION_SIZE=10000
```

---

## Development Workflow

### Building Contracts

```bash
# Build all contracts
forc build --path contracts/

# Build specific contract
forc build --path contracts/factory

# Build with release optimizations
forc build --release
```

### Testing Contracts

```bash
# Run all tests
forc test

# Run specific contract tests
forc test --path contracts/factory

# Run with logs
forc test --logs
```

### Running Local Node

```bash
# Start Fuel node
fuel-core run \
  --db-type in-memory \
  --debug

# In another terminal, deploy contracts
npm run deploy:local
```

### Running Frontend

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Deploying Contracts

```bash
# Deploy to testnet
forc deploy \
  --testnet \
  --path contracts/factory

# Or use deployment script
ts-node scripts/deploy-factory.ts --network testnet
```

---

## Testing

### Unit Tests (Contracts)

Located in `contracts/*/tests/`

```rust
// Example: factory/tests/harness.rs
#[tokio::test]
async fn test_create_single_edition() {
    let (factory, _wallets) = setup().await;

    let metadata_uri = "ipfs://QmX...";
    let amount = 10;

    let contract_id = factory
        .methods()
        .create_single_edition(metadata_uri, amount)
        .call()
        .await
        .unwrap();

    assert!(!contract_id.is_zero());
}
```

Run: `forc test`

### Integration Tests

Located in `tests/integration/`

```typescript
// Example: tests/integration/create-nft.test.ts
describe('NFT Creation Flow', () => {
  it('should create single edition NFT', async () => {
    const wallet = await setupWallet();
    const factory = new FactoryContract(FACTORY_ID, wallet);

    const metadataUri = await uploadToIPFS({
      name: "Test NFT",
      image: "ipfs://..."
    });

    const { value: contractId } = await factory.functions
      .create_single_edition(metadataUri, 5)
      .call();

    expect(contractId).toBeDefined();
  });
});
```

Run: `npm test`

### E2E Tests

Using Playwright or Cypress:

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npm run test:e2e
```

---

## Deployment

### Testnet Deployment

```bash
# 1. Deploy Factory Contract
forc deploy --testnet --path contracts/factory
# Note the contract ID

# 2. Deploy Single Edition Template
forc deploy --testnet --path contracts/single-edition
# Note the contract ID

# 3. Deploy Collection Template
forc deploy --testnet --path contracts/collection
# Note the contract ID

# 4. Update frontend .env with contract IDs

# 5. Deploy frontend
cd frontend
vercel deploy
```

### Mainnet Deployment

```bash
# Same as testnet, but use --mainnet flag
forc deploy --mainnet --path contracts/factory

# Update .env for mainnet
NEXT_PUBLIC_FUEL_NETWORK=mainnet
NEXT_PUBLIC_FUEL_PROVIDER_URL=https://mainnet.fuel.network/v1/graphql
```

---

## Usage Guide

### For End Users

#### Creating a Single Edition NFT

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve connection in Fuel Wallet

2. **Navigate to Create**
   - Click "Create" in navigation
   - Select "Single Edition" tab

3. **Upload Image**
   - Drag & drop or click to upload
   - Wait for IPFS upload

4. **Fill Metadata**
   - Name: "My First NFT"
   - Description: "This is my first NFT on Fuel"
   - Add attributes (optional)

5. **Set Amount**
   - Enter number of copies (1-10,000)
   - View total cost

6. **Create & Mint**
   - Click "Create & Mint"
   - Approve transaction in wallet
   - Wait for confirmation

7. **View NFT**
   - Navigate to "My NFTs"
   - See your newly created NFT

#### Creating a Collection

1. **Select Collection Tab**
2. **Upload Multiple Images**
3. **Choose Metadata Option**:
   - Same metadata for all
   - Unique metadata per NFT
4. **Fill Metadata**
5. **Create Collection**
6. **Approve Transaction**

#### Transferring an NFT

1. **Go to Transfer Page**
2. **Select NFT from Dropdown**
3. **Enter Recipient Address**
4. **Confirm Transfer**
5. **Approve Transaction**

---

## Technical Specifications

### NFT Standards Implementation

#### SRC-20: Native Asset
- Total supply tracking per asset
- Decimals = 0 for NFTs
- Asset ID generation using SubId

#### SRC-3: Mint and Burn
- Mint function with amount parameter
- Burn functionality (optional)
- Total minted tracking

#### SRC-7: Metadata
- Metadata URI storage
- On-chain metadata retrieval
- IPFS integration

#### SRC-12: Contract Factory
- Bytecode root verification
- Contract deployment tracking
- Registration system

### IPFS Metadata Standard

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "ipfs://QmX.../image.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Common"
    }
  ],
  "external_url": "https://example.com",
  "animation_url": "ipfs://QmY.../animation.mp4"
}
```

### Fee Structure

```
Creation Fee: 0.001 ETH (configurable)
Mint Fee: 0.0001 ETH per NFT (configurable)

Examples:
- Single Edition (10 copies): 0.001 + (10 × 0.0001) = 0.002 ETH
- Collection (100 NFTs): 0.001 + (100 × 0.0001) = 0.011 ETH
```

### Limits

- Max NFTs per collection: 10,000
- Max image size: 10MB
- Max metadata size: 100KB
- Supported formats: PNG, JPG, GIF, SVG, MP4, WEBM

---

## Resources

### Official Documentation

- [Fuel Network Docs](https://docs.fuel.network/)
- [Sway Language Book](https://fuellabs.github.io/sway/latest/)
- [Fuel TypeScript SDK](https://docs.fuel.network/docs/fuels-ts/)
- [Sway Standards](https://docs.fuel.network/docs/sway-standards/)

### Standards

- [SRC-20: Native Asset](https://docs.fuel.network/docs/sway-standards/src-20-native-asset/)
- [SRC-3: Mint and Burn](https://docs.fuel.network/docs/sway-standards/src-3-minting-and-burning/)
- [SRC-7: Asset Metadata](https://docs.fuel.network/docs/sway-standards/src-7-asset-metadata/)
- [SRC-12: Contract Factory](https://docs.fuel.network/docs/sway-standards/src-12-contract-factory/)

### Examples & References

- [Sway Applications](https://github.com/FuelLabs/sway-applications)
- [Sway Examples](https://github.com/FuelLabs/sway-examples)
- [Fuel NFT Example](https://github.com/FuelLabs/sway-applications/tree/master/NFT)

### IPFS Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [Web3.Storage Docs](https://web3.storage/docs/)
- [IPFS Best Practices](https://docs.ipfs.tech/concepts/best-practices/)

### Community

- [Fuel Forum](https://forum.fuel.network/)
- [Discord](https://discord.gg/fuelnetwork)
- [GitHub Discussions](https://github.com/FuelLabs/fuel-core/discussions)

---

## Troubleshooting

### Common Issues

**Forc command not found**
```bash
# Reinstall fuelup
curl https://install.fuel.network | sh
source ~/.bashrc
fuelup default latest
```

**Contract compilation errors**
```bash
# Update toolchain
fuelup update
forc --version

# Clean and rebuild
forc clean
forc build
```

**IPFS upload failures**
```bash
# Check API keys in .env
# Verify file size < 10MB
# Try different IPFS provider
```

**Wallet connection issues**
```bash
# Clear browser cache
# Reinstall Fuel Wallet extension
# Check network setting (testnet vs mainnet)
```

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details

---

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/fuel-nft-creator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/fuel-nft-creator/discussions)
- **Email**: support@example.com

---

## Roadmap

### Version 1.0 (Current)
- ✅ Factory contract
- ✅ Single edition NFTs
- ✅ Collection NFTs
- ✅ Basic UI
- ✅ IPFS integration

### Version 1.1 (Planned)
- [ ] Batch transfers
- [ ] NFT marketplace integration
- [ ] Advanced metadata editor
- [ ] Collection analytics

### Version 2.0 (Future)
- [ ] Royalty system
- [ ] Lazy minting
- [ ] Gasless transactions
- [ ] Mobile app

---

**Built with ❤️ on Fuel Network**
