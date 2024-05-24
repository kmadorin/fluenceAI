#![allow(non_snake_case)]
#![allow(improper_ctypes)]

use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;


module_manifest!();
pub fn main() {}

#[marine]
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}

#[marine]
pub fn download(url: String) -> String {
    curl(url)
}

#[marine]
#[link(wasm_import_module = "host")]
extern "C" {
    fn curl(url: String) -> String;
}
