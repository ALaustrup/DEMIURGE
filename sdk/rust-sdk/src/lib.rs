/*!
 * Demiurge Rust SDK
 * 
 * High-level Rust APIs for interacting with the Demiurge Blockchain.
 */

pub mod client;
pub mod cgt;
pub mod abyssid;
// Note: urgeid module was renamed to abyssid. Use abyssid instead.
pub mod nft;
pub mod marketplace;
pub mod signing;
pub mod types;
pub mod error;

pub use client::DemiurgeClient;
pub use error::{DemiurgeError, Result};

/// Main SDK struct that provides access to all Demiurge APIs
pub struct DemiurgeSDK {
    client: DemiurgeClient,
}

impl DemiurgeSDK {
    /// Create a new SDK instance
    pub fn new(rpc_url: impl Into<String>) -> Self {
        Self {
            client: DemiurgeClient::new(rpc_url),
        }
    }

    /// Get the CGT API
    pub fn cgt(&self) -> cgt::CgtApi<'_> {
        cgt::CgtApi::new(&self.client)
    }

    /// Get the QorID API
    pub fn abyssid(&self) -> qorid::AbyssIdApi<'_> {
        qorid::AbyssIdApi::new(&self.client)
    }

    /// Get the NFT API
    pub fn nft(&self) -> nft::NftApi<'_> {
        nft::NftApi::new(&self.client)
    }

    /// Get the Marketplace API
    pub fn marketplace(&self) -> marketplace::MarketplaceApi<'_> {
        marketplace::MarketplaceApi::new(&self.client)
    }

    /// Get the underlying RPC client (for advanced usage)
    pub fn client(&self) -> &DemiurgeClient {
        &self.client
    }
}

