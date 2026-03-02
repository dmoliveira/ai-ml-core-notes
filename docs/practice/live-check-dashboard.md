# Live Check Dashboard

This page renders the latest available live-pages smoke JSON snapshot.

<link rel="stylesheet" href="../../assets/leaderboard-viewer.css">

<div class="lb-app">
  <div class="lb-actions">
    <button id="live-load" type="button">Load Latest Snapshot</button>
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
      </tr>
    </thead>
    <tbody id="live-table-body">
      <tr><td colspan="4">No data loaded.</td></tr>
    </tbody>
  </table>
</div>

<script>
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

async function loadLiveSnapshot() {
  const status = document.getElementById("live-status");
  const summary = document.getElementById("live-summary");
  const body = document.getElementById("live-table-body");
  status.textContent = "Loading snapshot...";
  summary.textContent = "";
  try {
    const response = await fetch("../../stats/live-pages-latest.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    const payload = await response.json();
    const rows = Array.isArray(payload.checks) ? payload.checks : [];
    if (rows.length === 0) {
      body.innerHTML = "<tr><td colspan='4'>No checks recorded yet.</td></tr>";
    } else {
      body.innerHTML = rows
        .map(
          (row) => `<tr><td>${esc(row.url || "-")}</td><td>${esc(row.status || "-")}</td><td>${esc(row.elapsedSeconds ?? "-")}</td><td>${esc(row.checkedAt || "-")}</td></tr>`,
        )
        .join("");
    }
    renderSummary(payload, rows);
    status.textContent = `Snapshot generated at: ${payload.generatedAt || "-"} (${formatAge(payload.generatedAt)})`;
  } catch (error) {
    status.textContent = String(error.message || error);
    summary.textContent = "";
    body.innerHTML = "<tr><td colspan='4'>Unable to load snapshot.</td></tr>";
  }
}

document.getElementById("live-load").addEventListener("click", loadLiveSnapshot);
loadLiveSnapshot();
</script>
