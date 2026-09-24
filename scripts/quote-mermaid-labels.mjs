// Quote ALL unquoted [] labels in mermaid fences (safe for @ : / + etc),
// and fix the malformed edge label `-->||≥ 3次|` -> `-->|≥ 3次|`.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../src/content/posts", import.meta.url).pathname.replace(/^\/(\w:)/, "$1");

// node id + [label], label not already quoted, no quotes inside
const labelRe = /([A-Za-z0-9_-]+)\[([^\]["]+)\]/g;

let totalFixed = 0;
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
	const path = join(DIR, file);
	let text = readFileSync(path, "utf8");
	const outLines = [];
	let inMermaid = false;
	let fixes = 0;

	for (let line of text.split("\n")) {
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
				fixes++;
				return `${id}["${label}"]`;
			});
			line = fixed.replace("-->||", "-->|");
			outLines.push(line);
		} else {
			outLines.push(line);
		}
	}

	if (fixes > 0) {
		writeFileSync(path, outLines.join("\n"));
		console.log(`${file}: quoted ${fixes} labels`);
		totalFixed += fixes;
	}
}
console.log(`\ntotal: ${totalFixed} labels quoted`);
