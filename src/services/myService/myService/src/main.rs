#![allow(non_snake_case)]

use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use serde::{Serialize, Deserialize};

module_manifest!();
pub fn main() {}

#[marine]
pub fn greeting(name: String) -> String {
    format!("Hi, {}", name)
}

#[marine]
#[derive(Serialize, Deserialize)]
pub struct Message {
	pub role: String,
	pub content: String,
}

#[marine]
pub fn callOpenAI(api_key: &str, model: &str, messages: Vec<Message>, temperature: f64, max_tokens: i32, top_p: f64) -> String {
	openai(api_key, model, messages, temperature, max_tokens, top_p)
}

// importing gpt module
#[marine]
#[module_import("gpt")]
extern "C" {
	pub fn openai(api_key: &str, model: &str, messages: Vec<Message>, temperature: f64, max_tokens: i32, top_p: f64) -> String;
}


