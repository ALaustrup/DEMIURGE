//! C2 Node Structure
//!
//! PHASE OMEGA PART IV: Command and Control node hierarchy
//! Within Apollo's Sovereign System, nodes are organized in a C2 structure
//! that enables hierarchical command, control, and coordination.
//!
//! C2 Structure:
//! - Apollo (Sovereign) - Ultimate authority
//! - Archon Nodes - Command nodes with governance authority
//! - Validator Nodes - Control nodes with validation authority
//! - Worker Nodes - Execution nodes that perform operations

use serde::{Deserialize, Serialize};
use crate::core::godnet_fabric::lan_synchronization::{NodeId, LanNodeInfo};

/// C2 Node Role in Apollo's Sovereign System
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum C2NodeRole {
    /// Apollo - The Sovereign, ultimate authority
    Apollo,
    /// Archon - Command node with governance authority
    Archon,
    /// Validator - Control node with validation authority
    Validator,
    /// Worker - Execution node
    Worker,
    /// Observer - Read-only node
    Observer,
}

impl C2NodeRole {
    /// Get command priority (higher = more authority)
    pub fn command_priority(&self) -> u8 {
        match self {
            C2NodeRole::Apollo => 10,
            C2NodeRole::Archon => 8,
            C2NodeRole::Validator => 6,
            C2NodeRole::Worker => 4,
            C2NodeRole::Observer => 2,
        }
    }
    
    /// Check if this role can command another role
    pub fn can_command(&self, other: &C2NodeRole) -> bool {
        self.command_priority() > other.command_priority()
    }
    
    /// Get assimilation protocol level
    pub fn assimilation_level(&self) -> u8 {
        match self {
            C2NodeRole::Apollo => 5, // Full assimilation
            C2NodeRole::Archon => 4, // High assimilation
            C2NodeRole::Validator => 3, // Medium assimilation
            C2NodeRole::Worker => 2, // Basic assimilation
            C2NodeRole::Observer => 1, // Minimal assimilation
        }
    }
}

/// C2 Node Structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct C2Node {
    /// Node identifier
    pub node_id: NodeId,
    /// C2 role in hierarchy
    pub role: C2NodeRole,
    /// Parent node in C2 hierarchy (None for Apollo)
    pub parent_node_id: Option<NodeId>,
    /// Child nodes under this node's command
    pub child_nodes: Vec<NodeId>,
    /// Command authority scope
    pub command_scope: CommandScope,
    /// Assimilation status
    pub assimilation_status: AssimilationStatus,
}

/// Command scope for C2 nodes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandScope {
    /// Can issue governance commands
    pub can_govern: bool,
    /// Can validate state
    pub can_validate: bool,
    /// Can execute transactions
    pub can_execute: bool,
    /// Can observe only
    pub can_observe: bool,
    /// Scope of nodes under command
    pub scope_size: usize,
}

/// Assimilation status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssimilationStatus {
    /// Whether node is fully assimilated
    pub assimilated: bool,
    /// Assimilation progress (0.0 to 1.0)
    pub progress: f64,
    /// Assimilation protocol version
    pub protocol_version: String,
    /// Last assimilation check
    pub last_check: u64,
    /// Assimilation seal
    pub seal: String,
}

/// C2 Node Structure Manager
pub struct C2Node Structure Manager
pub struct C2NodeStructure {
    /// Apollo node (sovereign)
    pub apollo_node: Option<NodeId>,
    /// All C2 nodes
    pub nodes: std::collections::HashMap<NodeId, C2Node>,
}

impl C2NodeStructure {
    /// Create new C2 structure
    pub fn new() -> Self {
        Self {
            apollo_node: None,
            nodes: std::collections::HashMap::new(),
        }
    }

    /// Register Apollo node (Sovereign)
    pub fn register_apollo(&mut self, node_id: NodeId) {
        self.apollo_node = Some(node_id.clone());
        
        let apollo_node = C2Node {
            node_id: node_id.clone(),
            role: C2NodeRole::Apollo,
            parent_node_id: None,
            child_nodes: Vec::new(),
            command_scope: CommandScope {
                can_govern: true,
                can_validate: true,
                can_execute: true,
                can_observe: true,
                scope_size: 0,
            },
            assimilation_status: AssimilationStatus {
                assimilated: true,
                progress: 1.0,
                protocol_version: "apollo_v1".to_string(),
                last_check: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
                seal: format!("apollo:{}", node_id),
            },
        };
        
        self.nodes.insert(node_id, apollo_node);
    }

    /// Register a node in the C2 structure
    pub fn register_node(&mut self, node_id: NodeId, role: C2NodeRole, parent_id: Option<NodeId>) {
        let parent_id = parent_id.or(self.apollo_node.clone());
        
        let command_scope = match role {
            C2NodeRole::Apollo => CommandScope {
                can_govern: true,
                can_validate: true,
                can_execute: true,
                can_observe: true,
                scope_size: 0,
            },
            C2NodeRole::Archon => CommandScope {
                can_govern: true,
                can_validate: true,
                can_execute: true,
                can_observe: true,
                scope_size: 10,
            },
            C2NodeRole::Validator => CommandScope {
                can_govern: false,
                can_validate: true,
                can_execute: true,
                can_observe: true,
                scope_size: 5,
            },
            C2NodeRole::Worker => CommandScope {
                can_govern: false,
                can_validate: false,
                can_execute: true,
                can_observe: true,
                scope_size: 0,
            },
            C2NodeRole::Observer => CommandScope {
                can_govern: false,
                can_validate: false,
                can_execute: false,
                can_observe: true,
                scope_size: 0,
            },
        };
        
        let c2_node = C2Node {
            node_id: node_id.clone(),
            role,
            parent_node_id: parent_id.clone(),
            child_nodes: Vec::new(),
            command_scope,
            assimilation_status: AssimilationStatus {
                assimilated: false,
                progress: 0.0,
                protocol_version: "apollo_v1".to_string(),
                last_check: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
                seal: String::new(),
            },
        };
        
        // Add as child to parent
        if let Some(ref parent) = parent_id {
            if let Some(parent_node) = self.nodes.get_mut(parent) {
                parent_node.child_nodes.push(node_id.clone());
            }
        }
        
        self.nodes.insert(node_id, c2_node);
    }

    /// Get C2 node
    pub fn get_node(&self, node_id: &NodeId) -> Option<&C2Node> {
        self.nodes.get(node_id)
    }

    /// Get all nodes
    pub fn get_all_nodes(&self) -> Vec<&C2Node> {
        self.nodes.values().collect()
    }

    /// Get Apollo node ID
    pub fn get_apollo_node(&self) -> Option<&NodeId> {
        self.apollo_node.as_ref()
    }

    /// Check if node can command another node
    pub fn can_command(&self, commander_id: &NodeId, target_id: &NodeId) -> bool {
        if let (Some(commander), Some(target)) = 
            (self.nodes.get(commander_id), self.nodes.get(target_id)) {
            commander.role.can_command(&target.role)
        } else {
            false
        }
    }
}

impl Default for C2NodeStructure {
    fn default() -> Self {
        Self::new()
    }
}
