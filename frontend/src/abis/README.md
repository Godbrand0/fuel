# Contract ABIs

This directory contains the Application Binary Interfaces (ABIs) for all NFT contracts in this project.

## Files

- `factory-abi.json` - ABI for the Factory contract (deployed at address in .env)
- `collection-abi.json` - ABI for the Collection NFT contract
- `single-edition-abi.json` - ABI for the Single Edition NFT contract
- `factory.bin` - Binary bytecode for Factory contract
- `collection.bin` - Binary bytecode for Collection contract
- `single-edition.bin` - Binary bytecode for Single Edition contract

## Generated TypeScript Types

The TypeScript types have been automatically generated from these ABIs and are located in `../lib/contracts/`. You can import them like this:

```typescript
import { Factory, Collection, SingleEdition } from '../lib/contracts';
```

## Contract Overview

### Factory Contract
- **Purpose**: Tracks deployments of NFT contracts
- **Key Functions**:
  - `register_deployment(contract_id, deployment_type)` - Register a new contract deployment
  - `get_deployment_info(deployment_id)` - Get information about a deployment
  - `get_user_deployment_count(user)` - Get number of deployments by a user
  - `get_total_deployments()` - Get total number of deployments
  - `get_creation_fee()` - Get the fee required for deployment

### Collection NFT Contract
- **Purpose**: Creates collections with unique NFTs
- **Key Functions**:
  - `mint(to, metadata_uri)` - Mint a new unique NFT
  - `transfer(to, token_id)` - Transfer an NFT to another address
  - `owner_of(token_id)` - Get the owner of an NFT
  - `token_uri(token_id)` - Get the metadata URI for an NFT
  - `total_supply()` - Get total number of NFTs minted
  - `max_supply()` - Get maximum number of NFTs that can be minted

### Single Edition NFT Contract
- **Purpose**: Creates multiple copies of the same NFT design
- **Key Functions**:
  - `mint(to, amount)` - Mint multiple copies of the same NFT
  - `transfer(to, token_id)` - Transfer an NFT to another address
  - `owner_of(token_id)` - Get the owner of an NFT
  - `metadata_uri()` - Get the metadata URI for the NFT design
  - `total_supply()` - Get total number of NFTs minted
  - `max_supply()` - Get maximum number of NFTs that can be minted

## Deployment Types

When registering deployments with the Factory contract:
- Type 0 = Single Edition NFT
- Type 1 = Collection NFT

## Regenerating Types

If you make changes to any contract, you can regenerate the TypeScript types with:

```bash
cd frontend
npx fuels typegen -i ./src/abis/*-abi.json -o ./src/lib/contracts