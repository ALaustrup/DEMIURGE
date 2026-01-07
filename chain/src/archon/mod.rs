//! Prime Archon Subsystem
//!
//! PHASE OMEGA PART VI: THE ASCENSION OF THE PRIME ARCHON
//!
//! This module establishes the Prime Archon as the sovereign, system-wide
//! meta-validator for:
//! - Blockchain runtime consistency
//! - AbyssOS state consistency
//! - SDK alignment
//! - Node-to-node state convergence
//! - Emergent optimization signals
//! - Runtime divergence detection
//! - Autonomous correction pipelines

pub mod archon_state_vector;
pub mod archon_consensus;
pub mod archon_commands;
pub mod archon_diagnostics;
pub mod archon_daemon;
pub mod a0_directive;
pub mod logging;

pub use archon_state_vector::ArchonStateVector;
pub use archon_commands::ArchonDirective;
pub use archon_daemon::ArchonDaemon;
pub use logging::{emit_archon_event, emit_archon_directive, emit_archon_heartbeat};
