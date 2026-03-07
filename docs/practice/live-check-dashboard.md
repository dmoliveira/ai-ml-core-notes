# Live Check Dashboard

This page renders the latest available live-pages smoke JSON snapshot with filters, error drill-down, and optional auto-refresh. The snapshot can come from the default production URL or a custom preview URL via `python tools/ux/live_pages_check.py --base-url <url> --paths /,/practice/ --json-out ...`.

## Quick run commands

Generate a production snapshot:

```bash
python tools/ux/live_pages_check.py --json-out docs/stats/live-pages-latest.json
```

Generate a preview snapshot with selected paths:

```bash
python tools/ux/live_pages_check.py --base-url https://example-preview.domain --paths /,/practice/,/practice/quiz-web/ --json-out docs/stats/live-pages-latest.json
```

Render a markdown artifact from the JSON snapshot:

```bash
python tools/ux/render_live_dashboard.py docs/stats/live-pages-latest.json live-pages-dashboard.md
```

## How to read this dashboard

- `Total`, `OK`, and `Errors` summarize the current JSON payload only.
- `Freshness` estimates snapshot age from `generatedAt`.
- `base` in the status line shows which deployment URL the check targeted.
- `paths` in the status line shows how many routes were monitored in that run.
- The `Error` column surfaces `errorType` or message for faster triage.

<link rel="stylesheet" href="../../assets/leaderboard-viewer.css">

<div class="lb-app">
  <div class="lb-actions">
    <button id="live-load" type="button">Load Latest Snapshot</button>
    <button id="live-refresh" type="button">Auto Refresh: Off</button>
    <label for="live-filter">Filter</label>
    <select id="live-filter" aria-label="Filter rows">
      <option value="all">All Rows</option>
      <option value="errors">Errors Only</option>
      <option value="ok">OK Only</option>
    </select>
  </div>
  <div class="lb-status" id="live-status">Click Load Latest Snapshot.</div>
  <div class="lb-actions" id="live-summary" aria-live="polite"></div>
  <table class="lb-table">
    <thead>
      <tr>
        <th>URL</th>
        <th>Status</th>
        <th>Elapsed (s)</th>
        <th>Checked At</th>
        <th>Error</th>
      </tr>
    </thead>
    <tbody id="live-table-body">
      <tr><td colspan="5">No data loaded.</td></tr>
    </tbody>
  </table>
</div>

<script>
let liveRefreshTimer = null;
let cachedRows = [];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAge(timestamp) {
  const parsed = Date.parse(String(timestamp || ""));
  if (!Number.isFinite(parsed)) {
    return "unknown age";
  }
  const seconds = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function renderSummary(payload, rows) {
  const summary = document.getElementById("live-summary");
  const okCount = rows.filter((row) => row.status === "ok").length;
  const errorCount = rows.filter((row) => row.status !== "ok").length;
  const generatedAt = payload.generatedAt || "-";
  const staleWarning = /d ago$/.test(formatAge(generatedAt));
  summary.innerHTML = [
    `<span><strong>Total:</strong> ${rows.length}</span>`,
    `<span><strong>OK:</strong> ${okCount}</span>`,
    `<span><strong>Errors:</strong> ${errorCount}</span>`,
    `<span><strong>Freshness:</strong> ${esc(formatAge(generatedAt))}${staleWarning ? " (stale)" : ""}</span>`,
  ].join(" · ");
}

function renderRows() {
  const body = document.getElementById("live-table-body");
  const filter = document.getElementById("live-filter").value;
  const rows = cachedRows.filter((row) => {
    if (filter === "errors") return row.status !== "ok";
    if (filter === "ok") return row.status === "ok";
    return true;
  });

  if (rows.length === 0) {
    body.innerHTML = "<tr><td colspan='5'>No rows for current filter.</td></tr>";
    return;
  }

  body.innerHTML = rows
    .map((row) => {
      const errorLabel = row.errorType || row.error || "-";
      return `<tr><td>${esc(row.url || "-")}</td><td>${esc(row.status || "-")}</td><td>${esc(row.elapsedSeconds ?? "-")}</td><td>${esc(row.checkedAt || "-")}</td><td>${esc(errorLabel)}</td></tr>`;
    })
    .join("");
}

function toggleAutoRefresh() {
  const refreshButton = document.getElementById("live-refresh");
  if (liveRefreshTimer !== null) {
    window.clearInterval(liveRefreshTimer);
    liveRefreshTimer = null;
    refreshButton.textContent = "Auto Refresh: Off";
    return;
  }
  liveRefreshTimer = window.setInterval(loadLiveSnapshot, 30000);
  refreshButton.textContent = "Auto Refresh: 30s";
}

async function loadLiveSnapshot() {
  const status = document.getElementById("live-status");
  const summary = document.getElementById("live-summary");
  status.textContent = "Loading snapshot...";
  summary.textContent = "";
  try {
    const response = await fetch("../../stats/live-pages-latest.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    const payload = await response.json();
    const rows = Array.isArray(payload.checks) ? payload.checks : [];
    cachedRows = rows;
    if (rows.length === 0) {
      document.getElementById("live-table-body").innerHTML = "<tr><td colspan='5'>No checks recorded yet.</td></tr>";
    } else {
      renderRows();
    }
    renderSummary(payload, rows);
    const sourceBaseUrl = payload.baseUrl || "-";
    const sourcePathsCount = Array.isArray(payload.paths) ? payload.paths.length : "-";
    status.textContent = `Snapshot generated at: ${payload.generatedAt || "-"} (${formatAge(payload.generatedAt)}) · base: ${sourceBaseUrl} · paths: ${sourcePathsCount}`;
  } catch (error) {
    status.textContent = String(error.message || error);
    summary.textContent = "";
    document.getElementById("live-table-body").innerHTML = "<tr><td colspan='5'>Unable to load snapshot.</td></tr>";
  }
}

document.getElementById("live-load").addEventListener("click", loadLiveSnapshot);
document.getElementById("live-refresh").addEventListener("click", toggleAutoRefresh);
document.getElementById("live-filter").addEventListener("change", renderRows);
loadLiveSnapshot();
</script>
