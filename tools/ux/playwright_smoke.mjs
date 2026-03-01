import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:8000";

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
  "/practice/lab-01-tabular/",
  "/practice/lab-02-rag/",
  "/practice/lab-03-agent/",
  "/summaries/",
  "/deep-dives/",
  "/wiki/Home/",
  "/faq/",
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const failures = [];

for (const path of pages) {
  const url = `${baseUrl}${path}`;
  const consoleErrors = [];
  page.removeAllListeners("console");
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  const response = await page.goto(url, { waitUntil: "networkidle" });
  const status = response ? response.status() : 0;

  if (status >= 400) {
    failures.push(`${path} returned status ${status}`);
    continue;
  }
  if (consoleErrors.length > 0) {
    failures.push(`${path} console errors: ${consoleErrors.join(" | ")}`);
  }

  if (path === "/practice/quiz-web/") {
    await page.screenshot({ path: "site/quiz-web-smoke.png", fullPage: true });
  }
}

await browser.close();

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log(`Smoke navigation passed for ${pages.length} pages.`);
