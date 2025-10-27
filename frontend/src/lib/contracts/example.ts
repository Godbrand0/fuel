/* Example usage of NFT contracts */

import { 
  Factory, 
  Collection, 
  SingleEdition,
  FactoryFactory,
  CollectionFactory,
  SingleEditionFactory
} from './index';

// Example: Connect to deployed Factory contract
export async function connectToFactory(provider: any, wallet: any) {
  // Factory contract address should be stored in .env
  const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x...';
  
  const factory = new Factory(factoryAddress, wallet);
  return factory;
}

// Example: Deploy a new Collection NFT contract
export async function deployCollectionContract(wallet: any) {
  // Create a factory instance for deploying
  const factory = new CollectionFactory(wallet);
  
  try {
    // Deploy contract with configurable parameters
    const collection = await factory.deploy();
    return collection;
  } catch (error) {
    console.error('Failed to deploy collection contract:', error);
    throw error;
  }
}

// Example: Deploy a new Single Edition NFT contract
export async function deploySingleEditionContract(wallet: any) {
  // Create a factory instance for deploying
  const factory = new SingleEditionFactory(wallet);
  
  try {
    // Deploy contract with configurable parameters
    const singleEdition = await factory.deploy();
    return singleEdition;
  } catch (error) {
    console.error('Failed to deploy single edition contract:', error);
    throw error;
  }
}

// Example: Register a deployment with Factory contract
export async function registerDeployment(
  factory: Factory,
  contractId: string,
  deploymentType: number // 0 for single edition, 1 for collection
) {
  try {
    // Convert contract ID to the correct format
    const contractIdInput = { bits: contractId };
    
    const tx = await factory.functions.register_deployment(contractIdInput, deploymentType);
    const result = await tx.get();
    return result;
  } catch (error) {
    console.error('Failed to register deployment:', error);
    throw error;
  }
}

// Example: Mint a new NFT from Collection contract
export async function mintCollectionNFT(
  collection: Collection,
  recipientAddress: string,
  metadataUri: string
) {
  try {
    // Convert address to the correct format
    const recipientInput = { Address: { bits: recipientAddress } };
    
    const tx = await collection.functions.mint(recipientInput, metadataUri);
    const result = await tx.get();
    return result;
  } catch (error) {
    console.error('Failed to mint NFT:', error);
    throw error;
  }
}

// Example: Mint multiple NFTs from Single Edition contract
export async function mintSingleEditionNFTs(
  singleEdition: SingleEdition,
  recipientAddress: string,
  amount: number
) {
  try {
    // Convert address to the correct format
    const recipientInput = { Address: { bits: recipientAddress } };
    
    const tx = await singleEdition.functions.mint(recipientInput, amount);
    const result = await tx.get();
    return result;
  } catch (error) {
    console.error('Failed to mint NFTs:', error);
    throw error;
  }
}

// Example: Get deployment info from Factory
export async function getDeploymentInfo(factory: Factory, deploymentId: number) {
  try {
    const result = await factory.functions.get_deployment_info(deploymentId);
    return result;
  } catch (error) {
    console.error('Failed to get deployment info:', error);
    throw error;
  }
}

// Example: Get NFT owner
export async function getNFTOwner(
  contract: Collection | SingleEdition,
  tokenId: number
) {
  try {
    const result = await contract.functions.owner_of(tokenId);
    return result;
  } catch (error) {
    console.error('Failed to get NFT owner:', error);
    throw error;
  }
}

// Example: Get NFT metadata URI
export async function getNFTMetadata(
  collection: Collection,
  tokenId: number
) {
  try {
    const result = await collection.functions.token_uri(tokenId);
    return result;
  } catch (error) {
    console.error('Failed to get NFT metadata:', error);
    throw error;
  }
}

// Example: Get Single Edition metadata URI
export async function getSingleEditionMetadata(singleEdition: SingleEdition) {
  try {
    const result = await singleEdition.functions.metadata_uri();
    return result;
  } catch (error) {
    console.error('Failed to get Single Edition metadata:', error);
    throw error;
  }
}

// Example: Get total supply
export async function getTotalSupply(contract: Collection | SingleEdition) {
  try {
    const result = await contract.functions.total_supply();
    return result;
  } catch (error) {
    console.error('Failed to get total supply:', error);
    throw error;
  }
}

// Example: Get max supply
export async function getMaxSupply(contract: Collection | SingleEdition) {
  try {
    const result = await contract.functions.max_supply();
    return result;
  } catch (error) {
    console.error('Failed to get max supply:', error);
    throw error;
  }
}

// Example: Transfer NFT
export async function transferNFT(
  contract: Collection | SingleEdition,
  recipientAddress: string,
  tokenId: number
) {
  try {
    // Convert address to the correct format
    const recipientInput = { Address: { bits: recipientAddress } };
    
    const tx = await contract.functions.transfer(recipientInput, tokenId);
    const result = await tx.get();
    return result;
  } catch (error) {
    console.error('Failed to transfer NFT:', error);
    throw error;
  }
}