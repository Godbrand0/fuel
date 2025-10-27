contract;

use std::{
    hash::Hash,
    storage::storage_string::*,
    string::String,
};

/// Single Edition NFT Contract
/// Mints multiple copies of the same NFT design
abi SingleEditionNFT {
    #[storage(read, write)]
    fn mint(to: Identity, amount: u64);

    #[storage(read, write)]
    fn transfer(to: Identity, token_id: u64);

    #[storage(read)]
    fn owner_of(token_id: u64) -> Identity;

    #[storage(read)]
    fn total_supply() -> u64;

    #[storage(read)]
    fn metadata_uri() -> String;

    #[storage(read)]
    fn max_supply() -> u64;
}

/// Storage for single edition NFT contract
storage {
    metadata_uri: StorageString = StorageString {},
    total_supply: u64 = 0,
    max_supply: u64 = 10000,
    owners: StorageMap<u64, Identity> = StorageMap {},
    mint_fee: u64 = 100000,
}

/// Implementation of SingleEditionNFT ABI
impl SingleEditionNFT for Contract {
    #[storage(read, write)]
    fn mint(to: Identity, amount: u64) {
        // Validate amount
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= 10000, "Amount exceeds maximum per mint");

        // Validate max supply
        let current_supply = storage.total_supply.read();
        let max = storage.max_supply.read();

        require(current_supply + amount <= max, "Max supply exceeded");

        // Mint tokens
        let start_id = current_supply;

        // Loop through amount to mint each token
        let mut i = 0;
        while i < amount {
            let token_id = start_id + i;
            storage.owners.insert(token_id, to);
            i = i + 1;
        }

        // Update total supply
        storage.total_supply.write(current_supply + amount);
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
    fn total_supply() -> u64 {
        storage.total_supply.read()
    }

    #[storage(read)]
    fn metadata_uri() -> String {
        storage.metadata_uri.read_slice().unwrap()
    }

    #[storage(read)]
    fn max_supply() -> u64 {
        storage.max_supply.read()
    }
}
