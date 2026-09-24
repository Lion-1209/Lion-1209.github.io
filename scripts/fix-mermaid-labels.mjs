// Fix mermaid node labels containing parentheses: A[LLM (大语言模型)] -> A["LLM (大语言模型)"]
// Unquoted parens inside [] labels are a mermaid syntax error.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../src/content/posts", import.meta.url).pathname.replace(/^\/(\w:)/, "$1");

// node id + [label] where label has ( or ) and is not already quoted
const labelRe = /([A-Za-z0-9_-]+)\[([^\][]*[(（][^\][]*)\]/g;

let totalFixed = 0;
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
	const path = join(DIR, file);
	let text = readFileSync(path, "utf8");
	const outLines = [];
	let inMermaid = false;
	let fixes = 0;

	for (const line of text.split("\n")) {
		if (line.trim().startsWith("```mermaid")) {
			inMermaid = true;
			outLines.push(line);
			continue;
		}
		if (inMermaid && line.trim() === "```") {
			inMermaid = false;
			outLines.push(line);
			continue;
		}
		if (inMermaid) {
			const fixed = line.replace(labelRe, (_m, id, label) => {
				if (label.includes('"')) return _m;
				fixes++;
				return `${id}["${label}"]`;
			});
			outLines.push(fixed);
		} else {
			outLines.push(line);
		}
	}

	if (fixes > 0) {
		writeFileSync(path, outLines.join("\n"));
		console.log(`${file}: fixed ${fixes} labels`);
		totalFixed += fixes;
	}
}
console.log(`\ntotal: ${totalFixed} labels fixed`);
