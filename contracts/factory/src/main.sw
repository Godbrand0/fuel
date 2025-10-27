contract;

use std::{
    hash::Hash,
    contract_id::ContractId,
};

/// Factory contract for tracking NFT collection deployments
/// Note: In Fuel, contracts cannot deploy other contracts directly.
/// This contract tracks deployments that are done externally.
abi NFTFactory {
    #[storage(read, write)]
    fn register_deployment(contract_id: ContractId, deployment_type: u8);

    #[storage(read)]
    fn get_user_deployment_count(user: Identity) -> u64;

    #[storage(read)]
    fn get_deployment_info(deployment_id: u64) -> (Identity, ContractId, u8);

    #[storage(read)]
    fn get_creation_fee() -> u64;

    #[storage(read)]
    fn get_total_deployments() -> u64;
}

/// Storage for factory contract
storage {
    creation_fee: u64 = 1000000,
    user_deployment_count: StorageMap<Identity, u64> = StorageMap {},
    deployments: StorageMap<u64, (Identity, ContractId, u8)> = StorageMap {},
    total_deployments: u64 = 0,
}

/// Implementation of NFTFactory ABI
impl NFTFactory for Contract {
    #[storage(read, write)]
    fn register_deployment(contract_id: ContractId, deployment_type: u8) {
        let sender = msg_sender().unwrap();

        // Validate deployment type (0 = single edition, 1 = collection)
        require(deployment_type <= 1, "Invalid deployment type");

        // Get current total deployments (this will be the ID)
        let deployment_id = storage.total_deployments.read();

        // Store deployment info
        storage.deployments.insert(deployment_id, (sender, contract_id, deployment_type));

        // Update user's deployment count
        let user_count = storage.user_deployment_count.get(sender).try_read().unwrap_or(0);
        storage.user_deployment_count.insert(sender, user_count + 1);

        // Update total deployments
        storage.total_deployments.write(deployment_id + 1);
    }

    #[storage(read)]
    fn get_user_deployment_count(user: Identity) -> u64 {
        storage.user_deployment_count.get(user).try_read().unwrap_or(0)
    }

    #[storage(read)]
    fn get_deployment_info(deployment_id: u64) -> (Identity, ContractId, u8) {
        let info = storage.deployments.get(deployment_id).try_read();
        require(info.is_some(), "Deployment not found");
        info.unwrap()
    }

    #[storage(read)]
    fn get_creation_fee() -> u64 {
        storage.creation_fee.read()
    }

    #[storage(read)]
    fn get_total_deployments() -> u64 {
        storage.total_deployments.read()
    }
}
