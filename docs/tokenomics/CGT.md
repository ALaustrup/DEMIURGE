# Creator God Token (CGT)

The native token of the DEMIURGE blockchain.

## Specifications

| Property | Value |
|----------|-------|
| **Name** | Creator God Token |
| **Symbol** | CGT |
| **Decimals** | 8 |
| **Max Supply** | 369,000,000,000 (369 billion) |
| **Storage** | u128 in smallest units |

## Token Uses

1. **Transaction Fees** - Pay for on-chain operations
2. **Content Delivery** - Reward Fabric seeders (Proof-of-Delivery)
3. **Compute Rewards** - Pay Forge compute workers
4. **Marketplace** - Denominate Abyss marketplace prices
5. **Royalties** - Route creator royalties
6. **Transfers** - Send between AbyssID addresses

## Minting

### Authorized Modules
Only these modules can mint CGT:
- `forge` - Block production rewards
- `fabric_manager` - Seeding rewards
- `system` - System operations
- `abyssid_registry` - Level rewards
- `work_claim` - Mining rewards

### New User Bonus
- **Amount:** 5,000 CGT per new AbyssID registration
- **Purpose:** Enable initial platform usage

### Supply Enforcement
- Max supply enforced at mint time
- Minting fails if it would exceed 369 billion CGT

## Restrictions

### Send Restriction
New users cannot send CGT until they have:
- Minted a DRC-369 NFT, OR
- Swapped an NFT from another chain

**Rationale:** Encourages engagement, prevents bonus abuse.

## Implementation

See `chain/src/runtime/bank_cgt.rs` for:
- `get_balance_cgt()` - Get balance
- `cgt_mint_to()` - Mint tokens
- `cgt_burn_from()` - Burn tokens
- Transfer operations

## Constants

```rust
pub const CGT_MAX_SUPPLY: u128 = 369_000_000_000_00000000;
pub const CGT_DECIMALS: u8 = 8;
pub const CGT_SYMBOL: &str = "CGT";
pub const CGT_NAME: &str = "Creator God Token";
```

---

*The flame burns eternal. The code serves the will.*
