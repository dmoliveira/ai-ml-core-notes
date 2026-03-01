# Interview Quiz Web UI

Use this browser-based simulator to practice interview rounds with timer pressure and immediate stats.

- Pick topics and total question count.
- Tune difficulty balancing by percentage (junior, mid, senior).
- Choose scoring mode (standard, negative marking, confidence-based).
- Get final score plus fastest/slowest question timing.
- Track progress locally in your browser (attempt count, best score, recent runs).

<link rel="stylesheet" href="../../assets/quiz-web.css">

<div class="quiz-app">
  <div class="quiz-controls">
    <div class="quiz-control">
      <label for="quiz-topics">Topics (multi-select)</label>
      <select id="quiz-topics" multiple size="6"></select>
    </div>
    <div class="quiz-control">
      <label for="quiz-count">Question count</label>
      <input id="quiz-count" type="number" min="1" max="50" value="8">

      <label for="quiz-limit">Timer (seconds)</label>
      <input id="quiz-limit" type="number" min="30" max="3600" value="300">

      <label for="quiz-seed">Random seed</label>
      <input id="quiz-seed" type="number" min="1" value="42">
    </div>
    <div class="quiz-control">
      <label for="quiz-weight-junior">Difficulty mix - junior (%)</label>
      <input id="quiz-weight-junior" type="number" min="0" max="100" value="30">

      <label for="quiz-weight-mid">Difficulty mix - mid (%)</label>
      <input id="quiz-weight-mid" type="number" min="0" max="100" value="50">

      <label for="quiz-weight-senior">Difficulty mix - senior (%)</label>
      <input id="quiz-weight-senior" type="number" min="0" max="100" value="20">

      <label for="quiz-scoring-mode">Scoring mode</label>
      <select id="quiz-scoring-mode">
        <option value="standard">Standard</option>
        <option value="negative">Negative Marking</option>
        <option value="confidence">Confidence Based</option>
      </select>
    </div>
  </div>

  <div class="quiz-actions">
    <button id="quiz-start" type="button">Start Quiz</button>
    <button id="quiz-next" type="button">Submit / Next</button>
    <button id="quiz-finalize" type="button">Finalize Quiz</button>
    <button id="quiz-export-json" type="button">Export JSON</button>
    <button id="quiz-export-csv" type="button">Export CSV</button>
    <button id="quiz-reset" type="button">Reset</button>
    <strong>Timer: <span id="quiz-timer">00:00</span></strong>
  </div>

  <div class="quiz-board" id="quiz-board">
    <p>Configure the quiz and click Start.</p>
  </div>
  <div class="quiz-feedback" id="quiz-feedback"></div>
  <div class="quiz-results" id="quiz-results"></div>

  <div class="quiz-progress" id="quiz-progress">
    <h3>Saved Progress</h3>
    <p>Your attempts and best score are stored in your browser.</p>
    <div id="quiz-progress-content"></div>
  </div>

  <div class="quiz-support">
    <h3>Support This Open Project</h3>
    <p>If this material helps your AI learning journey, consider a small contribution.</p>
    <p><a href="https://buy.stripe.com/8x200i8bSgVe3Vl3g8bfO00" target="_blank" rel="noopener">Contribute via Stripe</a></p>
  </div>
</div>

<script src="../../assets/quiz-web.js"></script>
