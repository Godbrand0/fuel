library;

/// Shared library for NFT creator contracts
/// Contains validation functions, fee calculations, and common utilities

/// Error types for validation
pub enum NFTError {
    InvalidAmount: (),
    InvalidMetadata: (),
    InsufficientFee: (),
    MaxSupplyExceeded: (),
    InvalidAddress: (),
    DuplicateToken: (),
}

/// Fee calculation functions
pub fn calculate_creation_fee() -> u64 {
    // Base creation fee: 1,000,000 = 0.001 ETH
    1_000_000
}

pub fn calculate_mint_fee_per_nft() -> u64 {
    // Per NFT mint fee: 100,000 = 0.0001 ETH
    100_000
}

pub fn calculate_total_mint_cost(amount: u64) -> u64 {
    let fee_per_nft = calculate_mint_fee_per_nft();
    fee_per_nft * amount
}

/// Validation functions
pub fn validate_amount(amount: u64) -> bool {
    amount > 0 && amount <= 10_000
}

pub fn validate_max_supply(current_supply: u64, max_supply: u64, amount: u64) -> bool {
    current_supply + amount <= max_supply
}

pub fn validate_fee_payment(paid_amount: u64, required_amount: u64) -> bool {
    paid_amount >= required_amount
}

/// Common utilities
pub fn generate_token_id(next_id: u64) -> u64 {
    next_id
}
