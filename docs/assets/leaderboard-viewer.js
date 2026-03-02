const lbState = {
  rows: [],
  filtered: [],
  sorted: [],
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

function sortRows(rows) {
  const mode = readControl("lb-sort") || "score_desc";
  const list = [...rows];

  if (mode === "time_asc") {
    list.sort((a, b) => Number(a.totalTimeSeconds || 0) - Number(b.totalTimeSeconds || 0));
    return list;
  }
  if (mode === "newest") {
    list.sort((a, b) => String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")));
    return list;
  }

  list.sort(
    (a, b) =>
      Number(b.scorePercent || 0) - Number(a.scorePercent || 0) ||
      Number(a.totalTimeSeconds || 0) - Number(b.totalTimeSeconds || 0),
  );
  return list;
}

function toCsvRow(values) {
  return values
    .map((value) => {
      const text = String(value ?? "");
      return `"${text.replaceAll('"', '""')}"`;
    })
    .join(",");
}

function exportCsv() {
  if (lbState.sorted.length === 0) {
    setStatus("No rows to export.");
    return;
  }
  const rows = [toCsvRow(["rank", "displayName", "scorePercent", "totalTimeSeconds", "submittedAt"])];
  lbState.sorted.forEach((row, idx) => {
    rows.push(
      toCsvRow([
        idx + 1,
        String(row.displayName || "Learner"),
        Number(row.scorePercent || 0).toFixed(1),
        Number(row.totalTimeSeconds || 0).toFixed(1),
        String(row.submittedAt || ""),
      ]),
    );
  });

  const blob = new Blob([`${rows.join("\n")}\n`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "leaderboard.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function applyFilters() {
  const name = readControl("lb-filter-name").toLowerCase();
  const minScore = Number(readControl("lb-filter-score") || 0);

  lbState.filtered = lbState.rows.filter((row) => {
    const display = String(row.displayName || "").toLowerCase();
    const score = Number(row.scorePercent || 0);
    return display.includes(name) && score >= minScore;
  });

  lbState.sorted = sortRows(lbState.filtered);
  lbState.page = 1;
  renderTable();
}

function renderTable() {
  const target = document.getElementById("lb-table-body");
  const totalPages = Math.max(1, Math.ceil(lbState.sorted.length / lbState.pageSize));
  lbState.page = Math.min(lbState.page, totalPages);

  const start = (lbState.page - 1) * lbState.pageSize;
  const pageRows = lbState.sorted.slice(start, start + lbState.pageSize);

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

  setStatus(`Showing page ${lbState.page}/${totalPages} (${lbState.sorted.length} rows)`);
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
  document.getElementById("lb-export-csv").addEventListener("click", exportCsv);
  document.getElementById("lb-prev").addEventListener("click", () => {
    lbState.page = Math.max(1, lbState.page - 1);
    renderTable();
  });
  document.getElementById("lb-next").addEventListener("click", () => {
    lbState.page += 1;
    renderTable();
  });
});
