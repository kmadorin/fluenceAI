#![allow(non_snake_case)]
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
// use llm::Model;

module_manifest!();

pub fn main() {}

#[marine]
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}

// #[marine]
// pub fn get(hash: String) -> Vec<u8> {
//     log::info!("get called with hash: {}", hash);

//     let file_path = ipfs_get(hash);
//     fs::read(file_path).unwrap_or_else(|_| b"error while reading file".to_vec())
// }

// #[marine]
// #[module_import("ipfs_effector")]
// extern "C" {
//     /// Put provided file to ipfs, return ipfs hash of the file.
//     #[link_name = "put"]
//     pub fn ipfs_put(file_path: String) -> String;

//     /// Get file from ipfs by hash.
//     #[link_name = "get"]
//     pub fn ipfs_get(hash: String) -> String;
// }


