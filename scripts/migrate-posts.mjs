// One-off migration: bbs/blog/*.md -> src/content/posts/*.md (Fuwari frontmatter)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "E:/999-Git/bbs/blog";
const DST = new URL("../src/content/posts", import.meta.url).pathname.replace(/^\/(\w:)/, "$1");

const categoryOf = (n) =>
  n <= 5 ? "Agent 基础" : n <= 13 ? "Agent 框架" : "多智能体实战";

const tagsOf = {
  1: ["AI Agent", "LLM", "入门"],
  2: ["AI Agent", "ReAct"],
  3: ["Function Calling", "OpenAI"],
  4: ["AI Agent", "Python"],
  5: ["AI Agent", "Memory"],
  6: ["smolagents", "源码解析"],
  7: ["LangChain", "框架对比"],
  8: ["LangChain"],
  9: ["AI Agent", "Tool Use"],
  10: ["LangGraph"],
  11: ["LangGraph", "Code Review"],
  12: ["OpenAI Agents SDK"],
  13: ["Claude Agent SDK"],
  14: ["CrewAI", "多智能体"],
  15: ["多智能体", "From Scratch"],
  16: ["实战项目", "Code Analyzer"],
};

const files = readdirSync(SRC)
  .filter((f) => f.endsWith(".md") && !f.includes("公众号"))
  .sort();

const startDate = new Date("2026-06-29");

for (const [i, file] of files.entries()) {
  const num = parseInt(file.split("-")[0], 10);
  if (!num || !tagsOf[num]) {
    console.warn(`skip (no mapping): ${file}`);
    continue;
  }
  let text = readFileSync(join(SRC, file), "utf8");

  // strip the leading H1 (Fuwari renders title itself)
  const titleMatch = text.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : file;
  text = text.replace(/^# .+\r?\n/, "");

  // first blockquote line as description, fallback to title
  const quoteMatch = text.match(/^> (.+)$/m);
  const description = quoteMatch ? quoteMatch[1].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim() : title;

  // sequential realistic publish dates, one post every 4 days
  const d = new Date(startDate.getTime() + (num - 1) * 4 * 86400000);
  const published = d.toISOString().slice(0, 10);

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `published: ${published}`,
    `description: ${JSON.stringify(description)}`,
    `tags: [${tagsOf[num].map((t) => JSON.stringify(t)).join(", ")}]`,
    `category: ${JSON.stringify(categoryOf(num))}`,
    "draft: false",
    "---",
    "",
  ].join("\n");

  const out = frontmatter + text.replace(/\r\n/g, "\n");
  writeFileSync(join(DST, file), out);
  console.log(`${file}  <-  "${title}"  [${published}] (${categoryOf(num)})`);
}
console.log(`\nmigrated ${files.length} posts`);
