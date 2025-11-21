//! JSON-RPC server implementation using Axum.
//!
//! This module provides HTTP/JSON-RPC endpoints for interacting with the
//! Demiurge chain node. Supported methods:
//! - cgt_getChainInfo: Get current chain status
//! - cgt_getBlockByHeight: Get a block by height (stubbed for now)
//! - cgt_sendRawTransaction: Submit a transaction to the mempool

use std::sync::Arc;

use axum::{extract::Extension, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::core::transaction::Transaction;
use crate::node::Node;

/// JSON-RPC request envelope.
#[derive(Debug, Deserialize)]
pub struct JsonRpcRequest<T> {
    /// JSON-RPC version (should be "2.0").
    pub jsonrpc: String,
    /// Method name (e.g., "cgt_getChainInfo").
    pub method: String,
    /// Method parameters (can be null or an object).
    pub params: Option<T>,
    /// Request ID for matching responses.
    pub id: Option<serde_json::Value>,
}

/// JSON-RPC response envelope.
#[derive(Debug, Serialize)]
pub struct JsonRpcResponse<R> {
    /// JSON-RPC version (should be "2.0").
    pub jsonrpc: String,
    /// Result value (null if error occurred).
    pub result: Option<R>,
    /// Error object (null if successful).
    pub error: Option<JsonRpcError>,
    /// Request ID matching the request.
    pub id: Option<serde_json::Value>,
}

/// JSON-RPC error object.
#[derive(Debug, Serialize)]
pub struct JsonRpcError {
    /// Error code (standard JSON-RPC codes or custom).
    pub code: i32,
    /// Human-readable error message.
    pub message: String,
}

/// Create the JSON-RPC router.
///
/// # Arguments
/// - `node`: Shared reference to the Node instance
///
/// # Returns
/// An Axum Router configured with the RPC endpoint
pub fn rpc_router(node: Arc<Node>) -> Router {
    Router::new()
        .route("/rpc", post(handle_rpc))
        .layer(Extension(node))
}

/// Handle JSON-RPC requests.
///
/// This function dispatches requests to the appropriate handler based on
/// the method name. Unsupported methods return a "Method not found" error.
async fn handle_rpc(
    Extension(node): Extension<Arc<Node>>,
    Json(req): Json<JsonRpcRequest<serde_json::Value>>,
) -> Json<JsonRpcResponse<serde_json::Value>> {
    let id = req.id.clone();

    match req.method.as_str() {
        "cgt_getChainInfo" => {
            let info = node.chain_info();
            Json(JsonRpcResponse {
                jsonrpc: "2.0".to_string(),
                result: Some(json!({ "height": info.height })),
                error: None,
                id,
            })
        }
        "cgt_getBlockByHeight" => {
            let height = req
                .params
                .as_ref()
                .and_then(|p| p.get("height"))
                .and_then(|v| v.as_u64())
                .unwrap_or(0);

            let block = node.get_block_by_height(height);

            Json(JsonRpcResponse {
                jsonrpc: "2.0".to_string(),
                result: Some(serde_json::to_value(block).unwrap_or(serde_json::Value::Null)),
                error: None,
                id,
            })
        }
        "cgt_sendRawTransaction" => {
            let tx_hex = req
                .params
                .as_ref()
                .and_then(|p| p.get("tx"))
                .and_then(|v| v.as_str())
                .unwrap_or("");

            let bytes = match hex::decode(tx_hex) {
                Ok(b) => b,
                Err(e) => {
                    return Json(JsonRpcResponse {
                        jsonrpc: "2.0".to_string(),
                        result: None,
                        error: Some(JsonRpcError {
                            code: -32602, // Invalid params
                            message: format!("invalid tx hex: {}", e),
                        }),
                        id,
                    });
                }
            };

            let tx = match Transaction::from_bytes(&bytes) {
                Ok(tx) => tx,
                Err(e) => {
                    return Json(JsonRpcResponse {
                        jsonrpc: "2.0".to_string(),
                        result: None,
                        error: Some(JsonRpcError {
                            code: -32602, // Invalid params
                            message: format!("invalid tx encoding: {}", e),
                        }),
                        id,
                    });
                }
            };

            node.submit_transaction(tx);

            Json(JsonRpcResponse {
                jsonrpc: "2.0".to_string(),
                result: Some(json!({ "accepted": true })),
                error: None,
                id,
            })
        }
        _ => Json(JsonRpcResponse {
            jsonrpc: "2.0".to_string(),
            result: None,
            error: Some(JsonRpcError {
                code: -32601, // Method not found
                message: "Method not found".to_string(),
            }),
            id,
        }),
    }
}
