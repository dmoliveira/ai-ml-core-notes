const lbState = {
  rows: [],
  filtered: [],
  page: 1,
  pageSize: 10,
};

function readControl(id) {
  return String(document.getElementById(id).value || "").trim();
}

function setStatus(message) {
  document.getElementById("lb-status").textContent = message;
}

function parseRows(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && Array.isArray(payload.scores)) {
    return payload.scores;
  }
  return [];
}

function applyFilters() {
  const name = readControl("lb-filter-name").toLowerCase();
  const minScore = Number(readControl("lb-filter-score") || 0);

  lbState.filtered = lbState.rows.filter((row) => {
    const display = String(row.displayName || "").toLowerCase();
    const score = Number(row.scorePercent || 0);
    return display.includes(name) && score >= minScore;
  });

  lbState.page = 1;
  renderTable();
}

function renderTable() {
  const target = document.getElementById("lb-table-body");
  const totalPages = Math.max(1, Math.ceil(lbState.filtered.length / lbState.pageSize));
  lbState.page = Math.min(lbState.page, totalPages);

  const start = (lbState.page - 1) * lbState.pageSize;
  const pageRows = lbState.filtered.slice(start, start + lbState.pageSize);

  if (pageRows.length === 0) {
    target.innerHTML = "<tr><td colspan='5'>No rows match current filters.</td></tr>";
  } else {
    target.innerHTML = pageRows
      .map(
        (row, idx) => `
      <tr>
        <td>${start + idx + 1}</td>
        <td>${String(row.displayName || "Learner")}</td>
        <td>${Number(row.scorePercent || 0).toFixed(1)}%</td>
        <td>${Number(row.totalTimeSeconds || 0).toFixed(1)}s</td>
        <td>${String(row.submittedAt || "-")}</td>
      </tr>`,
      )
      .join("");
  }

  setStatus(`Showing page ${lbState.page}/${totalPages} (${lbState.filtered.length} rows)`);
  document.getElementById("lb-prev").disabled = lbState.page <= 1;
  document.getElementById("lb-next").disabled = lbState.page >= totalPages;
}

async function loadLeaderboard() {
  const endpoint = readControl("lb-endpoint");
  if (!endpoint) {
    setStatus("Set endpoint URL first.");
    return;
  }

  try {
    setStatus("Loading leaderboard...");
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const payload = await response.json();
    lbState.rows = parseRows(payload);
    applyFilters();
  } catch (error) {
    setStatus(String(error.message || error));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lb-load").addEventListener("click", loadLeaderboard);
  document.getElementById("lb-apply").addEventListener("click", applyFilters);
  document.getElementById("lb-prev").addEventListener("click", () => {
    lbState.page = Math.max(1, lbState.page - 1);
    renderTable();
  });
  document.getElementById("lb-next").addEventListener("click", () => {
    lbState.page += 1;
    renderTable();
  });
});
