# Interview Quiz Web UI

Use this browser-based simulator to practice interview rounds with timer pressure and immediate stats.

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
  </div>

  <div class="quiz-actions">
    <button id="quiz-start" type="button">Start Quiz</button>
    <button id="quiz-next" type="button">Submit / Next</button>
    <button id="quiz-reset" type="button">Reset</button>
    <strong>Timer: <span id="quiz-timer">00:00</span></strong>
  </div>

  <div class="quiz-board" id="quiz-board">
    <p>Configure the quiz and click Start.</p>
  </div>
  <div class="quiz-feedback" id="quiz-feedback"></div>
  <div class="quiz-results" id="quiz-results"></div>
</div>

<script src="../../assets/quiz-web.js"></script>
