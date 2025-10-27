# NFT Creator Contracts - Complete Guide

## Overview

This project contains three smart contracts that work together to create a no-code NFT creation platform on the Fuel Network. Users can create NFT collections without writing any code.

---

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend dApp                           │
│         (User uploads images, fills metadata)                │
└───────────────┬──────────────────────┬──────────────────────┘
                │                      │
                ▼                      ▼
    ┌───────────────────┐  ┌───────────────────────┐
    │ Single Edition    │  │ Collection Contract   │
    │    Contract       │  │  (Multi-NFT)          │
    └─────────┬─────────┘  └──────────┬────────────┘
              │                       │
              │  (Register)          │ (Register)
              └───────────┬───────────┘
                          ▼
                  ┌───────────────┐
                  │    Factory    │
                  │   Contract    │
                  │  (Tracking)   │
                  └───────────────┘
```

---

## 1. Factory Contract

**Location**: `contracts/factory/src/main.sw`

### Purpose
The Factory contract acts as a **registry** that tracks all NFT collections deployed by users. It doesn't deploy contracts itself (Fuel limitation), but records deployments made via the frontend.

### Key Features
- ✅ Tracks all NFT contract deployments
- ✅ Links contracts to their creators
- ✅ Stores deployment type (single edition vs collection)
- ✅ Provides creation fee information

### Storage Structure
```sway
storage {
    creation_fee: u64 = 1000000,                              // Fee to create collection
    user_deployment_count: StorageMap<Identity, u64>,         // User → count
    deployments: StorageMap<u64, (Identity, ContractId, u8)>, // ID → (owner, contract, type)
    total_deployments: u64 = 0,                               // Total deployments
}
```

### Functions

#### `register_deployment(contract_id: ContractId, deployment_type: u8)`
**Purpose**: Register a newly deployed NFT contract

**Parameters**:
- `contract_id`: The contract ID of the deployed NFT contract
- `deployment_type`: 0 = Single Edition, 1 = Collection

**Usage**:
```typescript
// After deploying a single edition contract via frontend
const factory = new FactoryContract(FACTORY_ADDRESS, wallet);
await factory.functions
  .register_deployment(nftContractId, 0) // 0 = single edition
  .call();
```

**What it does**:
1. Gets the caller's identity
2. Validates deployment type (must be 0 or 1)
3. Stores deployment info: (owner, contractId, type)
4. Increments user's deployment count
5. Increments total deployments

---

#### `get_user_deployment_count(user: Identity) -> u64`
**Purpose**: Get how many contracts a user has deployed

**Parameters**:
- `user`: The wallet address to check

**Returns**: Number of deployments

**Usage**:
```typescript
const count = await factory.functions
  .get_user_deployment_count(userAddress)
  .get();

console.log(`User has deployed ${count} collections`);
```

---

#### `get_deployment_info(deployment_id: u64) -> (Identity, ContractId, u8)`
**Purpose**: Get details about a specific deployment

**Parameters**:
- `deployment_id`: The deployment index (0, 1, 2, ...)

**Returns**: Tuple of (owner, contractId, type)

**Usage**:
```typescript
const [owner, contractId, type] = await factory.functions
  .get_deployment_info(0)
  .get();

console.log(`Deployment 0: Owner ${owner}, Contract ${contractId}, Type ${type}`);
```

---

#### `get_creation_fee() -> u64`
**Purpose**: Get the fee required to create a collection

**Returns**: Fee amount (currently 1,000,000)

**Usage**:
```typescript
const fee = await factory.functions.get_creation_fee().get();
console.log(`Creation fee: ${fee}`);
```

---

#### `get_total_deployments() -> u64`
**Purpose**: Get total number of deployments across all users

**Returns**: Total count

**Usage**:
```typescript
const total = await factory.functions.get_total_deployments().get();
console.log(`Total deployments: ${total}`);
```

---

### Frontend Integration Pattern

```typescript
// Query all user's deployments
async function getUserCollections(userAddress: Identity) {
  const total = await factory.functions.get_total_deployments().get();
  const userCollections = [];

  for (let i = 0; i < total; i++) {
    const [owner, contractId, type] = await factory.functions
      .get_deployment_info(i).get();

    if (owner === userAddress) {
      userCollections.push({
        id: i,
        contractId,
        type: type === 0 ? 'Single Edition' : 'Collection'
      });
    }
  }

  return userCollections;
}
```

---

## 2. Single Edition NFT Contract

**Location**: `contracts/single-edition/src/main.sw`

### Purpose
Allows users to mint **multiple copies** of the **same NFT design**. All tokens share the same metadata and image.

### Use Case
- Limited edition art prints (e.g., 100 copies of the same artwork)
- Event tickets (e.g., 500 identical concert tickets)
- Membership badges (e.g., 1000 identical club memberships)

### Storage Structure
```sway
storage {
    metadata_uri: StorageString,              // IPFS URI for metadata (same for all)
    total_supply: u64 = 0,                    // Current minted count
    max_supply: u64 = 10000,                  // Maximum mintable (1-10,000)
    owners: StorageMap<u64, Identity>,        // Token ID → Owner
    mint_fee: u64 = 100000,                   // Fee per token
}
```

### Functions

#### `mint(to: Identity, amount: u64)`
**Purpose**: Mint multiple copies of the NFT

**Parameters**:
- `to`: Recipient address (who receives the NFTs)
- `amount`: How many copies to mint (1-10,000)

**Usage**:
```typescript
const nft = new SingleEditionContract(CONTRACT_ID, wallet);

// Mint 10 copies to current user
await nft.functions
  .mint(wallet.address, 10)
  .call();
```

**What it does**:
1. Validates amount > 0 and amount <= 10,000
2. Checks max supply won't be exceeded
3. Mints tokens with sequential IDs
4. Assigns ownership to `to` address
5. Updates total supply

**Example**:
- Current supply: 5
- Mint amount: 3
- Creates tokens: #5, #6, #7
- New supply: 8

---

#### `transfer(to: Identity, token_id: u64)`
**Purpose**: Transfer an NFT to another address

**Parameters**:
- `to`: Recipient address
- `token_id`: The token ID to transfer

**Usage**:
```typescript
// Transfer token #5 to another user
await nft.functions
  .transfer(recipientAddress, 5)
  .call();
```

**What it does**:
1. Gets caller's identity
2. Verifies caller owns the token
3. Updates ownership to recipient

---

#### `owner_of(token_id: u64) -> Identity`
**Purpose**: Get the owner of a specific token

**Parameters**:
- `token_id`: The token ID to check

**Returns**: Owner's address

**Usage**:
```typescript
const owner = await nft.functions.owner_of(5).get();
console.log(`Token #5 is owned by ${owner}`);
```

---

#### `total_supply() -> u64`
**Purpose**: Get total number of minted tokens

**Returns**: Total minted count

**Usage**:
```typescript
const supply = await nft.functions.total_supply().get();
console.log(`${supply} tokens minted so far`);
```

---

#### `metadata_uri() -> String`
**Purpose**: Get the metadata URI (same for all tokens)

**Returns**: IPFS URI string

**Usage**:
```typescript
const uri = await nft.functions.metadata_uri().get();
console.log(`Metadata: ${uri}`);
// Example: "ipfs://QmX123.../metadata.json"
```

---

#### `max_supply() -> u64`
**Purpose**: Get the maximum number of tokens that can be minted

**Returns**: Max supply

**Usage**:
```typescript
const max = await nft.functions.max_supply().get();
console.log(`Max supply: ${max}`);
```

---

### Complete User Flow Example

```typescript
// 1. User uploads image to IPFS
const imageUrl = await uploadToIPFS(imageFile);
// Returns: "ipfs://QmX123.../image.png"

// 2. Create metadata and upload to IPFS
const metadata = {
  name: "Cool NFT",
  description: "My first NFT",
  image: imageUrl,
  attributes: [
    { trait_type: "Color", value: "Blue" }
  ]
};
const metadataUrl = await uploadToIPFS(JSON.stringify(metadata));
// Returns: "ipfs://QmY456.../metadata.json"

// 3. Deploy Single Edition contract (via SDK)
const deployedContract = await deploySingleEdition({
  maxSupply: 100,
  metadataUri: metadataUrl
});

// 4. Register with factory
await factory.functions
  .register_deployment(deployedContract.id, 0)
  .call();

// 5. Mint NFTs
await deployedContract.functions
  .mint(wallet.address, 10) // Mint 10 copies
  .call();

// 6. View owned tokens
const supply = await deployedContract.functions.total_supply().get();
console.log(`You own 10 out of ${supply} tokens`);
```

---

## 3. Collection NFT Contract

**Location**: `contracts/collection/src/main.sw`

### Purpose
Allows users to create collections where **each NFT is unique** with different metadata and images.

### Use Case
- NFT art collections (e.g., 100 unique artworks)
- Trading cards (e.g., different characters)
- Generative art collections (e.g., 10,000 unique avatars)

### Storage Structure
```sway
storage {
    total_supply: u64 = 0,                         // Current minted count
    max_supply: u64 = 10000,                       // Max collection size
    mint_fee: u64 = 100000,                        // Fee per token
    owners: StorageMap<u64, Identity>,             // Token ID → Owner
    token_uris: StorageMap<u64, StorageString>,    // Token ID → Unique IPFS URI
    next_token_id: u64 = 0,                        // Auto-incrementing ID
}
```

### Functions

#### `mint(to: Identity, metadata_uri: String) -> u64`
**Purpose**: Mint a unique NFT with its own metadata

**Parameters**:
- `to`: Recipient address
- `metadata_uri`: IPFS URI for this specific token's metadata

**Returns**: The newly minted token ID

**Usage**:
```typescript
const collection = new CollectionContract(CONTRACT_ID, wallet);

// Mint unique NFT #1
const tokenId1 = await collection.functions
  .mint(wallet.address, "ipfs://QmABC.../nft1.json")
  .call();

// Mint unique NFT #2 (different metadata)
const tokenId2 = await collection.functions
  .mint(wallet.address, "ipfs://QmDEF.../nft2.json")
  .call();

console.log(`Minted tokens: ${tokenId1}, ${tokenId2}`);
```

**What it does**:
1. Validates max supply not exceeded
2. Generates next token ID
3. Stores unique metadata URI for this token
4. Assigns ownership to `to` address
5. Increments supply and next ID
6. Returns the token ID

---

#### `transfer(to: Identity, token_id: u64)`
**Purpose**: Transfer a specific NFT to another address

**Parameters**:
- `to`: Recipient address
- `token_id`: The token ID to transfer

**Usage**:
```typescript
// Transfer token #3 to another user
await collection.functions
  .transfer(recipientAddress, 3)
  .call();
```

---

#### `owner_of(token_id: u64) -> Identity`
**Purpose**: Get the owner of a specific token

**Parameters**:
- `token_id`: The token ID to check

**Returns**: Owner's address

**Usage**:
```typescript
const owner = await collection.functions.owner_of(3).get();
console.log(`Token #3 is owned by ${owner}`);
```

---

#### `token_uri(token_id: u64) -> String`
**Purpose**: Get the unique metadata URI for a specific token

**Parameters**:
- `token_id`: The token ID

**Returns**: IPFS URI for that specific token

**Usage**:
```typescript
const uri = await collection.functions.token_uri(3).get();
console.log(`Token #3 metadata: ${uri}`);

// Fetch metadata from IPFS
const metadata = await fetch(uri.replace('ipfs://', 'https://ipfs.io/ipfs/'));
console.log(metadata.name, metadata.image);
```

**Key Difference from Single Edition**: Each token has its own unique URI!

---

#### `total_supply() -> u64`
**Purpose**: Get total number of minted tokens in collection

**Returns**: Total minted count

**Usage**:
```typescript
const supply = await collection.functions.total_supply().get();
console.log(`Collection has ${supply} NFTs`);
```

---

#### `max_supply() -> u64`
**Purpose**: Get the maximum size of the collection

**Returns**: Max supply (1-10,000)

**Usage**:
```typescript
const max = await collection.functions.max_supply().get();
const current = await collection.functions.total_supply().get();
console.log(`${current} / ${max} minted`);
```

---

### Complete User Flow Example

```typescript
// 1. User uploads multiple images to IPFS
const image1 = await uploadToIPFS(imageFile1);
const image2 = await uploadToIPFS(imageFile2);
const image3 = await uploadToIPFS(imageFile3);

// 2. Create unique metadata for each
const metadata1 = {
  name: "NFT #1",
  description: "First in collection",
  image: image1,
  attributes: [{ trait_type: "Rarity", value: "Common" }]
};
const metadata2 = {
  name: "NFT #2",
  description: "Second in collection",
  image: image2,
  attributes: [{ trait_type: "Rarity", value: "Rare" }]
};
const metadata3 = {
  name: "NFT #3",
  description: "Third in collection",
  image: image3,
  attributes: [{ trait_type: "Rarity", value: "Legendary" }]
};

const uri1 = await uploadToIPFS(JSON.stringify(metadata1));
const uri2 = await uploadToIPFS(JSON.stringify(metadata2));
const uri3 = await uploadToIPFS(JSON.stringify(metadata3));

// 3. Deploy Collection contract
const collection = await deployCollection({ maxSupply: 100 });

// 4. Register with factory
await factory.functions
  .register_deployment(collection.id, 1) // 1 = collection
  .call();

// 5. Mint unique NFTs
const token1 = await collection.functions.mint(wallet.address, uri1).call();
const token2 = await collection.functions.mint(wallet.address, uri2).call();
const token3 = await collection.functions.mint(wallet.address, uri3).call();

console.log(`Minted 3 unique NFTs: ${token1}, ${token2}, ${token3}`);

// 6. Verify each has unique metadata
const uri_check = await collection.functions.token_uri(token1).get();
console.log(`Token #${token1} metadata: ${uri_check}`);
```

---

## Comparison: Single Edition vs Collection

| Feature | Single Edition | Collection |
|---------|---------------|------------|
| **Metadata** | Same for all tokens | Unique per token |
| **Image** | Same for all tokens | Unique per token |
| **Use Case** | Limited editions, tickets | Art collections, trading cards |
| **Minting** | Batch mint same design | One-by-one unique mints |
| **Storage** | One metadata URI | Metadata URI per token |
| **Example** | 100 copies of poster | 100 unique artworks |

---

## Complete dApp User Journey

### Creating a Single Edition NFT

1. **User opens dApp** → Connects Fuel wallet
2. **Clicks "Create" tab** → Selects "Single Edition"
3. **Uploads image** → Frontend uploads to IPFS
4. **Fills metadata form**:
   - Name: "My Cool NFT"
   - Description: "Limited edition art"
   - Attributes: Color = Blue, Style = Modern
5. **Sets amount** → 50 copies
6. **Clicks "Create & Mint"**
7. **Frontend**:
   - Creates metadata JSON with IPFS image URL
   - Uploads metadata to IPFS
   - Deploys Single Edition contract with metadata URI
   - Registers contract with Factory
   - Mints 50 tokens to user's wallet
8. **User sees** → "50 NFTs created successfully!"
9. **Navigate to "My NFTs"** → Sees 50 tokens with same image

### Creating a Collection

1. **User opens dApp** → Connects Fuel wallet
2. **Clicks "Create" tab** → Selects "Collection"
3. **Uploads multiple images** → 10 different images
4. **Fills metadata**:
   - Option 1: Same metadata for all (name, description)
   - Option 2: Unique metadata per NFT
5. **Sets collection size** → Max 100 NFTs
6. **Clicks "Create Collection"**
7. **Frontend**:
   - Uploads all images to IPFS
   - Creates unique metadata JSON for each
   - Uploads all metadata to IPFS
   - Deploys Collection contract
   - Registers with Factory
   - Batch mints all NFTs
8. **User sees** → "Collection of 10 NFTs created!"
9. **Navigate to "My NFTs"** → Sees 10 unique NFTs

### Transferring an NFT

1. **Navigate to "Transfer" page**
2. **Select NFT** → Dropdown shows all owned NFTs
3. **Enter recipient address** → 0x1234...
4. **Click "Transfer"**
5. **Confirm transaction** → In Fuel wallet
6. **Transfer complete** → NFT now owned by recipient

### Viewing NFTs

1. **Navigate to "My NFTs"**
2. **See all collections** → Query Factory for user's contracts
3. **For each collection**:
   - Query contract for total supply
   - Check which tokens user owns
   - Fetch metadata from IPFS
   - Display images and details
4. **Click on NFT** → See full details, transfer option

---

## IPFS Metadata Standard

All NFTs follow this JSON structure:

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

---

## Error Handling

### Common Errors

**"Amount must be greater than 0"**
- Trying to mint 0 tokens
- **Fix**: Set amount to 1 or more

**"Max supply exceeded"**
- Trying to mint more than available supply
- **Fix**: Reduce mint amount or create new collection

**"Token does not exist"**
- Querying non-existent token ID
- **Fix**: Check token ID is valid

**"Not token owner"**
- Trying to transfer someone else's NFT
- **Fix**: Only transfer tokens you own

**"Max supply reached"**
- Collection is fully minted
- **Fix**: Cannot mint more, collection is complete

---

## Gas Fees & Costs

| Action | Cost |
|--------|------|
| Deploy Factory | One-time (testnet free) |
| Deploy Single Edition | Creation fee (1,000,000) |
| Deploy Collection | Creation fee (1,000,000) |
| Mint NFT | Per token fee (100,000) |
| Transfer NFT | Gas fee only |
| Query data (read) | Free |

**Example Costs:**
- Single Edition (100 copies): 1,000,000 + (100 × 100,000) = 11,000,000
- Collection (10 unique): 1,000,000 + (10 × 100,000) = 2,000,000

---

## Security Considerations

### What's Protected

✅ Only token owner can transfer
✅ Max supply enforced (can't mint more than limit)
✅ Token IDs are sequential and predictable
✅ Ownership tracked on-chain
✅ Metadata URIs immutable after minting

### What Users Should Know

⚠️ **IPFS is permanent** - Uploaded images/metadata cannot be changed
⚠️ **Transfers are final** - Cannot undo a transfer
⚠️ **Max supply is fixed** - Set carefully during deployment
⚠️ **Gas fees required** - Ensure wallet has enough balance

---

## Testing the Contracts

### Local Testing

```bash
# Build contracts
cd contracts/factory && forc build
cd contracts/single-edition && forc build
cd contracts/collection && forc build

# Run tests (if test files exist)
forc test
```

### Testnet Deployment

```bash
# Deploy to Fuel testnet
forc deploy --testnet

# Note the contract IDs
# Update frontend with contract addresses
```

---

## Contract Addresses (Update After Deployment)

```typescript
// .env
NEXT_PUBLIC_FACTORY_CONTRACT_ID=0x...
NEXT_PUBLIC_SINGLE_EDITION_TEMPLATE_ID=0x...
NEXT_PUBLIC_COLLECTION_TEMPLATE_ID=0x...
```

---

## Troubleshooting

**Q: Contract won't compile?**
A: Ensure you have the latest Fuel toolchain: `fuelup update`

**Q: Transaction failing?**
A: Check wallet has sufficient balance for gas fees

**Q: IPFS upload slow?**
A: Use Pinata or Web3.Storage instead of public gateway

**Q: Can't see NFTs in wallet?**
A: Fuel wallet may not support NFT display yet, use dApp

**Q: How to batch mint in collection?**
A: Call `mint()` multiple times in a loop from frontend

---

## Next Steps

1. ✅ **Contracts are ready** - All three contracts compile
2. 📱 **Build Frontend** - Create React/Next.js dApp
3. 🎨 **IPFS Integration** - Implement image/metadata upload
4. 🔗 **Connect Contracts** - Use Fuel TypeScript SDK
5. 🧪 **Test on Testnet** - Deploy and test full flow
6. 🚀 **Launch on Mainnet** - Production deployment

---

## Resources

- [Fuel Docs](https://docs.fuel.network/)
- [Sway Book](https://fuellabs.github.io/sway/latest/)
- [Fuel TypeScript SDK](https://docs.fuel.network/docs/fuels-ts/)
- [IPFS Docs](https://docs.ipfs.tech/)
- [Pinata](https://pinata.cloud/)

---

**Questions or Issues?** Open an issue in the GitHub repository!
