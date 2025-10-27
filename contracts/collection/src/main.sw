contract;

use std::{
    hash::Hash,
    storage::storage_string::*,
    string::String,
};

/// Collection NFT Contract
/// Creates collections with unique NFTs
abi CollectionNFT {
    #[storage(read, write)]
    fn mint(to: Identity, metadata_uri: String) -> u64;

    #[storage(read, write)]
    fn transfer(to: Identity, token_id: u64);

    #[storage(read)]
    fn owner_of(token_id: u64) -> Identity;

    #[storage(read)]
    fn token_uri(token_id: u64) -> String;

    #[storage(read)]
    fn total_supply() -> u64;

    #[storage(read)]
    fn max_supply() -> u64;
}

/// Storage for collection NFT contract
storage {
    total_supply: u64 = 0,
    max_supply: u64 = 10000,
    mint_fee: u64 = 100000,
    owners: StorageMap<u64, Identity> = StorageMap {},
    token_uris: StorageMap<u64, StorageString> = StorageMap {},
    next_token_id: u64 = 0,
}

/// Implementation of CollectionNFT ABI
impl CollectionNFT for Contract {
    #[storage(read, write)]
    fn mint(to: Identity, metadata_uri: String) -> u64 {
        // Validate max supply
        let current_supply = storage.total_supply.read();
        let max = storage.max_supply.read();

        require(current_supply < max, "Max supply reached");

        // Generate token ID
        let token_id = storage.next_token_id.read();

        // Mint token
        storage.owners.insert(token_id, to);
        storage.token_uris.get(token_id).write_slice(metadata_uri);

        // Update supply and next ID
        storage.total_supply.write(current_supply + 1);
        storage.next_token_id.write(token_id + 1);

        token_id
    }

    #[storage(read, write)]
    fn transfer(to: Identity, token_id: u64) {
        let sender = msg_sender().unwrap();

        // Check token ownership
        let owner = storage.owners.get(token_id).try_read();
        require(owner.is_some(), "Token does not exist");

        let owner_identity = owner.unwrap();
        require(owner_identity == sender, "Not token owner");

        // Update ownership
        storage.owners.insert(token_id, to);
    }

    #[storage(read)]
    fn owner_of(token_id: u64) -> Identity {
        let owner = storage.owners.get(token_id).try_read();
        require(owner.is_some(), "Token does not exist");
        owner.unwrap()
    }

    #[storage(read)]
    fn token_uri(token_id: u64) -> String {
        let uri = storage.token_uris.get(token_id).read_slice();
        require(uri.is_some(), "Token URI not found");
        uri.unwrap()
    }

    #[storage(read)]
    fn total_supply() -> u64 {
        storage.total_supply.read()
    }

    #[storage(read)]
    fn max_supply() -> u64 {
        storage.max_supply.read()
    }
}
