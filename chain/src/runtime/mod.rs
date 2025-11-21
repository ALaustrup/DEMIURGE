//! Runtime module registry and dispatch system.
//!
//! This module provides the infrastructure for routing transactions to
//! runtime modules. In Phase 3, concrete modules (bank_cgt, nft_dgen, etc.)
//! will be registered here and handle transaction execution.

use crate::core::state::State;
use crate::core::transaction::Transaction;

/// Trait that all runtime modules must implement.
///
/// Runtime modules handle specific domains of functionality:
/// - `bank_cgt`: CGT token balances and transfers
/// - `nft_dgen`: D-GEN NFT minting and transfers
/// - `fabric_manager`: Fabric asset registration and seeder rewards
/// - `abyss_registry`: Marketplace listings and purchases
/// - `avatars_profiles`: Archon role flags and identity profiles
pub trait RuntimeModule {
    /// Returns the unique identifier for this module (e.g., "bank_cgt").
    fn module_id(&self) -> &'static str;

    /// Dispatches a call to this module.
    ///
    /// # Arguments
    /// - `call_id`: The specific function to call (e.g., "transfer", "mint_dgen")
    /// - `payload`: Bincode-serialized call parameters
    /// - `state`: Mutable reference to chain state for reading/writing
    ///
    /// # Returns
    /// - `Ok(())` if the call succeeded
    /// - `Err(String)` with an error message if the call failed
    fn dispatch(&self, call_id: &str, payload: &[u8], state: &mut State) -> Result<(), String>;
}

/// Runtime registry that holds all registered modules.
///
/// In Phase 3, this will be populated with concrete module instances
/// (BankCgtModule, NftDgenModule, etc.) that implement `RuntimeModule`.
pub struct Runtime {
    /// List of registered runtime modules.
    modules: Vec<Box<dyn RuntimeModule>>,
}

impl Runtime {
    /// Create a new empty runtime registry.
    ///
    /// In Phase 3, this will be extended to register all runtime modules:
    /// ```rust
    /// let mut runtime = Runtime::new();
    /// runtime.register(Box::new(BankCgtModule::new()));
    /// runtime.register(Box::new(NftDgenModule::new()));
    /// // ... etc
    /// ```
    pub fn new() -> Self {
        // TODO: Phase 3 will register modules here:
        //  - bank_cgt module
        //  - nft_dgen module
        //  - fabric_manager module
        //  - abyss_registry module
        //  - avatars_profiles module
        Runtime {
            modules: Vec::new(),
        }
    }

    /// Register a new runtime module.
    ///
    /// This will be used in Phase 3 to add concrete module implementations.
    #[allow(dead_code)]
    pub fn register(&mut self, module: Box<dyn RuntimeModule>) {
        self.modules.push(module);
    }

    /// Dispatch a transaction to the appropriate runtime module.
    ///
    /// Looks up the module by `module_id` and calls its `dispatch` method
    /// with the transaction's `call_id` and `payload`.
    ///
    /// # Returns
    /// - `Ok(())` if the transaction was successfully dispatched and executed
    /// - `Err(String)` if the module was not found or execution failed
    pub fn dispatch_tx(&self, tx: &Transaction, state: &mut State) -> Result<(), String> {
        let module = self
            .modules
            .iter()
            .find(|m| m.module_id() == tx.module_id)
            .ok_or_else(|| format!("Unknown module: {}", tx.module_id))?;

        module.dispatch(&tx.call_id, &tx.payload, state)
    }
}

impl Default for Runtime {
    fn default() -> Self {
        Self::new()
    }
}
