use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

use jsonrpc_core::types::request::Call;
use jsonrpc_core::Output;
use serde_json::json;
use serde_json::Value;
use web3::futures::future::BoxFuture;
use web3::{RequestId, Transport};

use crate::curl_request;

pub type FutResult = BoxFuture<'static, web3::error::Result<Value>>;

#[derive(Debug, Clone)]
pub struct CurlTransport {
    pub uri: String,
    id: Arc<AtomicUsize>,
}
impl CurlTransport {
    pub fn new(uri: String) -> Self {
        Self {
            uri,
            id: Arc::new(AtomicUsize::new(0)),
        }
    }

    pub fn next_id(&self) -> RequestId {
        self.id.fetch_add(1, Ordering::AcqRel)
    }
}