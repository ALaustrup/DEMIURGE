/*!
 * AbyssID operations
 */

use crate::client::DemiurgeClient;
use crate::error::Result;
use crate::types::{Address, AbyssIdProfile, AbyssIdProgress};
use serde_json::json;

pub struct AbyssIdApi<'a> {
    client: &'a DemiurgeClient,
}

impl<'a> AbyssIdApi<'a> {
    pub fn new(client: &'a DemiurgeClient) -> Self {
        Self { client }
    }

    /// Get AbyssID profile for an address
    pub async fn get_profile(&self, address: &str) -> Result<AbyssIdProfile> {
        self.client
            .call("abyssid_get", Some(json!({ "address": address })))
            .await
    }

    /// Resolve username to address
    pub async fn resolve_username(&self, username: &str) -> Result<Option<Address>> {
        #[derive(serde::Deserialize)]
        struct Response {
            address: Option<String>,
        }
        let result: Response = self
            .client
            .call("abyssid_resolveUsername", Some(json!({ "username": username })))
            .await?;
        Ok(result.address)
    }

    /// Get AbyssID progress
    pub async fn get_progress(&self, address: &str) -> Result<AbyssIdProgress> {
        self.client
            .call("abyssid_getProgress", Some(json!({ "address": address })))
            .await
    }

    /// Check if an address is an Archon
    pub async fn is_archon(&self, address: &str) -> Result<bool> {
        self.client
            .call("cgt_isArchon", Some(json!({ "address": address })))
            .await
    }
}
