#![allow(non_snake_case)]
use marine_rs_sdk::{marine, MountedBinaryResult};
use marine_rs_sdk::module_manifest;
use serde_json::json;
use serde::{Serialize, Deserialize};

#[marine]
#[derive(Serialize, Deserialize)]
pub struct Message {
	pub role: String,
	pub content: String,
}

module_manifest!();

pub fn main() {}

#[marine]
pub fn get() -> String {
	let cmd = vec![
		"-X".to_string(),
		"GET".to_string(),
		"https://mocki.io/v1/ba10fae7-ec2e-4ce6-bbe4-3ee50543def5".to_string(),
	];
	let res = curl_request(cmd);
	let res = String::from_utf8(res.stdout).unwrap();
	res
}


#[marine]
pub fn openai(api_key: &str, model: &str, messages: Vec<Message>, temperature: f64, max_tokens: i32, top_p: f64) -> String {
	let messages_json = json!(messages).to_string();

	let data = format!(r#"{{
			"model": "{}",
			"messages": {},
			"temperature": {},
			"max_tokens": {},
			"top_p": {}
	}}"#, model, messages_json, temperature, max_tokens, top_p);

	let cmd = vec![
			"-X".to_string(),
			"POST".to_string(),
			"-H".to_string(),
			"Content-Type: application/json".to_string(),
			"-H".to_string(),
			"Authorization: Bearer ".to_string() + api_key,
			"-d".to_string(),
			data,
			"https://api.openai.com/v1/chat/completions".to_string(),
	];

	let res = curl_request(cmd);
	let res = String::from_utf8(res.stdout).unwrap();
	res
}

#[marine]
pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult {
	curl(cmd)
}

#[marine]
#[module_import("host")]
extern "C" {
		fn curl(cmd: Vec<String>) -> MountedBinaryResult;
}