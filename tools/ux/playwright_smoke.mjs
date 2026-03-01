import { execSync } from "node:child_process";

const baseUrl = process.argv[2] || "file://./site/";
const playwrightCmd = process.env.PLAYWRIGHT_CMD || "npx -y playwright@1.53.0";

const pages = [
  "/",
  "/plan/project-plan/",
  "/foundations/",
  "/machine-learning/",
  "/deep-learning/",
  "/ai-engineering/",
  "/ai-agents/",
  "/interview-prep/",
  "/interview-prep/junior/",
  "/interview-prep/mid/",
  "/interview-prep/senior/",
  "/interview-prep/question-bank/",
  "/practice/",
  "/practice/interview-quiz/",
  "/practice/quiz-web/",
  "/practice/leaderboard-endpoint/",
  "/practice/verify-shared-result/",
  "/practice/lab-01-tabular/",
  "/practice/lab-02-rag/",
  "/practice/lab-03-agent/",
  "/summaries/",
  "/deep-dives/",
  "/wiki/Home/",
  "/faq/",
];

function resolveTarget(path) {
  if (baseUrl.startsWith("file://")) {
    const suffix = path === "/" ? "index.html" : `${path.replace(/^\//, "")}index.html`;
    return `${baseUrl}${suffix}`;
  }
  return `${baseUrl}${path}`;
}

const failures = [];
let counter = 0;

for (const path of pages) {
  counter += 1;
  const out = `/tmp/playwright-smoke-${counter}.png`;
  const target = resolveTarget(path);
  const cmd = `${playwrightCmd} screenshot --browser=chromium \"${target}\" \"${out}\"`;

  try {
    execSync(cmd, {
      stdio: "pipe",
      env: {
        ...process.env,
        npm_config_script_shell: process.env.npm_config_script_shell || "/bin/bash",
      },
    });
  } catch (error) {
    failures.push(`${path} failed: ${String(error.message || error)}`);
    continue;
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log(`Smoke navigation passed for ${pages.length} pages.`);
