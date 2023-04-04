use std::{env, path::Path, process};

use oxc_allocator::Allocator;
use oxc_ast::SourceType;
use oxc_parser::Parser;

fn main() {
    let name = env::args().nth(1).unwrap_or_else(|| "test.js".to_string());
    let path = Path::new(&name);
    let source_text = std::fs::read_to_string(path).unwrap_or_else(|_| panic!("{name} not found"));
    let allocator = Allocator::default();
    let source_type = SourceType::from_path(path).unwrap();
    let ret = Parser::new(&allocator, &source_text, source_type).parse();

    if ret.errors.is_empty() {
        // println!("{}", serde_json::to_string_pretty(&ret.program).unwrap());
        // println!("Parsed Successfully.");
    } else {
        for error in ret.errors {
            let error = error.with_source_code(source_text.clone());
            eprintln!("{error:?}");
            process::exit(1);
        }
    }
}
