# Public Leaderboard Viewer

Use this read-only page to load and browse shared leaderboard scores.

<link rel="stylesheet" href="../../assets/leaderboard-viewer.css">

<div class="lb-app">
  <div class="lb-controls">
    <div class="lb-control">
      <label for="lb-endpoint">Leaderboard endpoint (GET)</label>
      <input id="lb-endpoint" type="url" placeholder="https://example.com/api/leaderboard">
    </div>
    <div class="lb-control">
      <label for="lb-filter-name">Filter by learner name</label>
      <input id="lb-filter-name" type="text" placeholder="Learner">
    </div>
    <div class="lb-control">
      <label for="lb-filter-score">Minimum score %</label>
      <input id="lb-filter-score" type="number" min="0" max="100" value="0">
    </div>
    <div class="lb-control">
      <label for="lb-sort">Sort</label>
      <input id="lb-sort" type="text" value="score_desc" list="lb-sort-options">
      <datalist id="lb-sort-options">
        <option value="score_desc"></option>
        <option value="time_asc"></option>
        <option value="newest"></option>
      </datalist>
    </div>
  </div>

  <div class="lb-actions">
    <button id="lb-load" type="button">Load</button>
    <button id="lb-apply" type="button">Apply Filters</button>
    <button id="lb-export-csv" type="button">Export CSV</button>
    <button id="lb-prev" type="button">Prev</button>
    <button id="lb-next" type="button">Next</button>
  </div>

  <div class="lb-status" id="lb-status">Set an endpoint and click Load.</div>

  <table class="lb-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Learner</th>
        <th>Score</th>
        <th>Total Time</th>
        <th>Submitted At</th>
      </tr>
    </thead>
    <tbody id="lb-table-body">
      <tr><td colspan="5">No data loaded.</td></tr>
    </tbody>
  </table>
</div>

<script src="../../assets/leaderboard-viewer.js"></script>
