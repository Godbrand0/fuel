/* Example usage of NFT contracts */

import { 
  Factory, 
  Collection, 
  SingleEdition,
  FactoryFactory,
  CollectionFactory,
  SingleEditionFactory
} from './index';
import { Provider, Wallet } from 'fuels';

// Initialize provider (connect to Fuel network)
const provider = new Provider('https://beta-3.fuel.network');

// Example: Connect to deployed Factory contract
export async function connectToFactory(wallet: Wallet) {
  // Factory contract address should be stored in .env
  const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x...';
  
  const factory = new Factory(factoryAddress, wallet);
  return factory;
}

// Example: Deploy a new Collection NFT contract
export async function deployCollectionContract(wallet: Wallet) {
  // Create a factory instance for deploying
  const factory = new CollectionFactory(wallet);
  
  // Deploy the contract with configurable parameters
  const collection = await factory.deployContract({
    maxSupply: 10000,
    mintFee: 100000,
  });
  
  return collection;
}

// Example: Deploy a new Single Edition NFT contract
export async function deploySingleEditionContract(wallet: Wallet) {
  // Create a factory instance for deploying
  const factory = new SingleEditionFactory(wallet);
  
  // Deploy the contract with configurable parameters
  const singleEdition = await factory.deployContract({
    maxSupply: 10000,
    mintFee: 100000,
    metadataUri: 'ipfs://Qm...',
  });
  
  return singleEdition;
}

// Example: Register a deployment with Factory contract
export async function registerDeployment(
  factory: Factory,
  contractId: string,
  deploymentType: number // 0 for single edition, 1 for collection
) {
  try {
    const tx = await factory.register_deployment(contractId, deploymentType);
    const result = await tx.waitForResult();
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
    const tx = await collection.mint(recipientAddress, metadataUri);
    const result = await tx.waitForResult();
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
    const tx = await singleEdition.mint(recipientAddress, amount);
    const result = await tx.waitForResult();
    return result;
  } catch (error) {
    console.error('Failed to mint NFTs:', error);
    throw error;
  }
}

// Example: Get deployment info from Factory
export async function getDeploymentInfo(factory: Factory, deploymentId: number) {
  try {
    const [deployer, contractId, deploymentType] = await factory.get_deployment_info(deploymentId);
    return { deployer, contractId, deploymentType };
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
    const owner = await contract.owner_of(tokenId);
    return owner;
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
    const uri = await collection.token_uri(tokenId);
    return uri;
  } catch (error) {
    console.error('Failed to get NFT metadata:', error);
    throw error;
  }
}

// Example: Get Single Edition metadata URI
export async function getSingleEditionMetadata(singleEdition: SingleEdition) {
  try {
    const uri = await singleEdition.metadata_uri();
    return uri;
  } catch (error) {
    console.error('Failed to get Single Edition metadata:', error);
    throw error;
  }
}