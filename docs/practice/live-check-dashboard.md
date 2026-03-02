# Live Check Dashboard

This page renders the latest available live-pages smoke JSON snapshot.

<link rel="stylesheet" href="../../assets/leaderboard-viewer.css">

<div class="lb-app">
  <div class="lb-actions">
    <button id="live-load" type="button">Load Latest Snapshot</button>
  </div>
  <div class="lb-status" id="live-status">Click Load Latest Snapshot.</div>
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
async function loadLiveSnapshot() {
  const status = document.getElementById("live-status");
  const body = document.getElementById("live-table-body");
  status.textContent = "Loading snapshot...";
  try {
    const response = await fetch("../stats/live-pages-latest.json");
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
          (row) => `<tr><td>${row.url || "-"}</td><td>${row.status || "-"}</td><td>${row.elapsedSeconds ?? "-"}</td><td>${row.checkedAt || "-"}</td></tr>`,
        )
        .join("");
    }
    status.textContent = `Snapshot generated at: ${payload.generatedAt || "-"}`;
  } catch (error) {
    status.textContent = String(error.message || error);
    body.innerHTML = "<tr><td colspan='4'>Unable to load snapshot.</td></tr>";
  }
}

document.getElementById("live-load").addEventListener("click", loadLiveSnapshot);
</script>
