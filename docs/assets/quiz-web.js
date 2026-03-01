const quizState = {
  questions: [],
  selectedQuestions: [],
  currentIndex: 0,
  answers: [],
  timerId: null,
  remainingSeconds: 0,
  startTimeMs: 0,
  questionStartMs: 0,
  finished: false,
  reviewMode: false,
  lastResult: null,
};

const QUESTIONS_PATH = "../../assets/quiz-questions.json";
const PROGRESS_STORAGE_KEY = "aiml_quiz_web_progress_v1";

function shuffleArray(items, seed) {
  const result = [...items];
  let value = Number(seed) || 1;
  for (let idx = result.length - 1; idx > 0; idx -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const pick = Math.floor((value / 233280) * (idx + 1));
    const temp = result[idx];
    result[idx] = result[pick];
    result[pick] = temp;
  }
  return result;
}

function formatSeconds(total) {
  const mins = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const secs = (total % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function clearTimer() {
  if (quizState.timerId !== null) {
    clearInterval(quizState.timerId);
    quizState.timerId = null;
  }
}

function updateActionButtons() {
  const nextButton = document.getElementById("quiz-next");
  const finalizeButton = document.getElementById("quiz-finalize");
  const exportJsonButton = document.getElementById("quiz-export-json");
  const exportCsvButton = document.getElementById("quiz-export-csv");

  if (quizState.finished) {
    nextButton.disabled = true;
    finalizeButton.disabled = true;
    exportJsonButton.disabled = false;
    exportCsvButton.disabled = false;
    return;
  }

  finalizeButton.disabled = !quizState.reviewMode;
  exportJsonButton.disabled = true;
  exportCsvButton.disabled = true;
}

function toCsvRow(values) {
  return values
    .map((value) => {
      const text = String(value ?? "");
      const escaped = text.replaceAll('"', '""');
      return `"${escaped}"`;
    })
    .join(",");
}

function triggerDownload(fileName, mimeType, payload) {
  const blob = new Blob([payload], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

function exportResultsJson() {
  if (!quizState.finished || !quizState.lastResult) {
    return;
  }
  const payload = {
    summary: quizState.lastResult,
    answers: quizState.answers,
    exportedAt: new Date().toISOString(),
  };
  triggerDownload(
    "quiz-results.json",
    "application/json;charset=utf-8",
    `${JSON.stringify(payload, null, 2)}\n`,
  );
}

function exportResultsCsv() {
  if (!quizState.finished || !quizState.lastResult) {
    return;
  }

  const byId = new Map(quizState.selectedQuestions.map((question) => [question.id, question]));
  const rows = [
    toCsvRow([
      "question_id",
      "topic",
      "difficulty",
      "prompt",
      "selected_index",
      "selected_option",
      "correct",
      "confidence",
      "points",
      "max_points",
      "question_seconds",
    ]),
  ];

  for (const answer of quizState.answers) {
    const question = byId.get(answer.id);
    const selectedOption = question && question.options[answer.selected] ? question.options[answer.selected] : "";
    rows.push(
      toCsvRow([
        answer.id,
        answer.topic,
        answer.difficulty,
        question ? question.prompt : "",
        answer.selected,
        selectedOption,
        answer.correct,
        answer.confidence,
        answer.points,
        answer.maxPoints,
        answer.questionSeconds.toFixed(2),
      ]),
    );
  }

  triggerDownload("quiz-results.csv", "text/csv;charset=utf-8", `${rows.join("\n")}\n`);
}

function selectedTopics() {
  const select = document.getElementById("quiz-topics");
  return [...select.options].filter((option) => option.selected).map((option) => option.value);
}

function scoreLabel(score) {
  if (score >= 85) {
    return "Excellent";
  }
  if (score >= 70) {
    return "Strong";
  }
  if (score >= 50) {
    return "Developing";
  }
  return "Needs practice";
}

function getScoringMode() {
  return document.getElementById("quiz-scoring-mode").value;
}

function scoreAnswer(correct, scoringMode, confidence) {
  if (scoringMode === "negative") {
    return {
      points: correct ? 1 : -0.25,
      maxPoints: 1,
    };
  }
  if (scoringMode === "confidence") {
    const confidenceWeights = {
      low: { correct: 1, incorrect: 0 },
      medium: { correct: 2, incorrect: -1 },
      high: { correct: 3, incorrect: -2 },
    };
    const profile = confidenceWeights[confidence] || confidenceWeights.medium;
    return {
      points: correct ? profile.correct : profile.incorrect,
      maxPoints: 3,
    };
  }
  return {
    points: correct ? 1 : 0,
    maxPoints: 1,
  };
}

function getDifficultyWeights() {
  const junior = Number(document.getElementById("quiz-weight-junior").value) || 0;
  const mid = Number(document.getElementById("quiz-weight-mid").value) || 0;
  const senior = Number(document.getElementById("quiz-weight-senior").value) || 0;
  const total = junior + mid + senior;

  if (total <= 0) {
    return {
      junior: 1,
      mid: 1,
      senior: 1,
    };
  }
  return {
    junior,
    mid,
    senior,
  };
}

function buildBalancedQuestionSet(pool, count, seed, difficultyWeights) {
  const grouped = {
    junior: shuffleArray(pool.filter((question) => question.difficulty === "junior"), seed + 11),
    mid: shuffleArray(pool.filter((question) => question.difficulty === "mid"), seed + 23),
    senior: shuffleArray(pool.filter((question) => question.difficulty === "senior"), seed + 37),
  };

  const weights = [
    { key: "junior", value: difficultyWeights.junior },
    { key: "mid", value: difficultyWeights.mid },
    { key: "senior", value: difficultyWeights.senior },
  ];
  const totalWeight = weights.reduce((sum, item) => sum + item.value, 0);

  const targets = {};
  let allocated = 0;
  const withRemainder = [];

  for (const item of weights) {
    const exact = totalWeight <= 0 ? count / 3 : (count * item.value) / totalWeight;
    const base = Math.floor(exact);
    targets[item.key] = base;
    allocated += base;
    withRemainder.push({ key: item.key, remainder: exact - base });
  }

  let remaining = Math.max(0, count - allocated);
  withRemainder.sort((a, b) => b.remainder - a.remainder);
  for (const item of withRemainder) {
    if (remaining === 0) {
      break;
    }
    targets[item.key] += 1;
    remaining -= 1;
  }

  const picked = [];
  const pickedIds = new Set();

  for (const difficulty of ["junior", "mid", "senior"]) {
    let needed = targets[difficulty] || 0;
    while (needed > 0 && grouped[difficulty].length > 0) {
      const next = grouped[difficulty].shift();
      if (!pickedIds.has(next.id)) {
        picked.push(next);
        pickedIds.add(next.id);
        needed -= 1;
      }
    }
  }

  if (picked.length < count) {
    const fallback = shuffleArray(pool, seed + 101);
    for (const question of fallback) {
      if (picked.length >= count) {
        break;
      }
      if (!pickedIds.has(question.id)) {
        picked.push(question);
        pickedIds.add(question.id);
      }
    }
  }

  return picked;
}

function renderQuestion() {
  const board = document.getElementById("quiz-board");
  const feedback = document.getElementById("quiz-feedback");
  feedback.textContent = "";

  const question = quizState.selectedQuestions[quizState.currentIndex];
  if (!question) {
    board.innerHTML = "<p>No question available.</p>";
    return;
  }

  const answered = quizState.answers.find((item) => item.id === question.id);
  const disabled = answered && !quizState.reviewMode ? "disabled" : "";
  if (!answered) {
    quizState.questionStartMs = Date.now();
  }

  const optionsHtml = question.options
    .map((option, index) => {
      const checked = answered && answered.selected === index ? "checked" : "";
      return `<label class="quiz-option"><input type="radio" name="quiz-option" value="${index}" ${checked} ${disabled}> <span>${String.fromCharCode(65 + index)}. ${option}</span></label>`;
    })
    .join("");

  const confidenceHtml = `
    <div class="quiz-meta">
      <label for="quiz-confidence"><strong>Confidence:</strong></label>
      <select id="quiz-confidence" ${disabled}>
        <option value="low" ${answered && answered.confidence === "low" ? "selected" : ""}>Low</option>
        <option value="medium" ${!answered || answered.confidence === "medium" ? "selected" : ""}>Medium</option>
        <option value="high" ${answered && answered.confidence === "high" ? "selected" : ""}>High</option>
      </select>
    </div>
  `;

  board.innerHTML = `
    <div class="quiz-meta">
      <span>Question ${quizState.currentIndex + 1}/${quizState.selectedQuestions.length}</span>
      <span>Topic: ${question.topic}</span>
      <span>Difficulty: ${question.difficulty}</span>
    </div>
    ${confidenceHtml}
    <div class="quiz-prompt">${question.prompt}</div>
    <div class="quiz-options">${optionsHtml}</div>
  `;

  if (answered) {
    const text = answered.correct
      ? `Correct. Time for question: ${answered.questionSeconds.toFixed(1)}s. Points: ${answered.points.toFixed(2)}.`
      : `Incorrect. Correct answer: ${String.fromCharCode(65 + question.answer_index)}. ${question.explanation}`;
    feedback.textContent = text;
  }

  const nextButton = document.getElementById("quiz-next");
  nextButton.disabled = !answered;
  updateActionButtons();
}

function collectAnswer() {
  const question = quizState.selectedQuestions[quizState.currentIndex];
  if (!question) {
    return;
  }

  const selected = document.querySelector('input[name="quiz-option"]:checked');
  if (!selected) {
    const feedback = document.getElementById("quiz-feedback");
    feedback.textContent = "Select an answer before continuing.";
    return;
  }

  const selectedIndex = Number(selected.value);
  const correct = selectedIndex === question.answer_index;
  const confidenceSelect = document.getElementById("quiz-confidence");
  const confidence = confidenceSelect ? confidenceSelect.value : "medium";
  const scoringMode = getScoringMode();
  const scoring = scoreAnswer(correct, scoringMode, confidence);
  const elapsedSinceStart = Math.max(0, (Date.now() - quizState.startTimeMs) / 1000);
  const questionSeconds = Math.max(0, (Date.now() - quizState.questionStartMs) / 1000);

  const nextAnswer = {
    id: question.id,
    topic: question.topic,
    difficulty: question.difficulty,
    selected: selectedIndex,
    confidence,
    correct,
    points: scoring.points,
    maxPoints: scoring.maxPoints,
    elapsedSeconds: elapsedSinceStart,
    questionSeconds,
  };

  const existingIndex = quizState.answers.findIndex((item) => item.id === question.id);
  if (existingIndex >= 0) {
    quizState.answers[existingIndex] = nextAnswer;
  } else {
    quizState.answers.push(nextAnswer);
  }
  renderQuestion();
}

function renderReviewPanel() {
  const results = document.getElementById("quiz-results");
  const cells = quizState.selectedQuestions
    .map((question, index) => {
      const answered = quizState.answers.some((item) => item.id === question.id);
      const classes = ["quiz-review-jump"];
      if (index === quizState.currentIndex) {
        classes.push("quiz-review-current");
      }
      const marker = answered ? "ok" : "pending";
      return `<button type="button" class="${classes.join(" ")}" data-index="${index}">Q${index + 1} ${marker}</button>`;
    })
    .join("");

  results.innerHTML = `
    <h3>Review Mode</h3>
    <p>Jump between questions, adjust answers/confidence, then finalize the quiz.</p>
    <div class="quiz-review-grid">${cells}</div>
  `;

  const buttons = results.querySelectorAll(".quiz-review-jump");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-index"));
      if (!Number.isNaN(index)) {
        quizState.currentIndex = index;
        renderQuestion();
        renderReviewPanel();
      }
    });
  }
}

function enterReviewMode() {
  quizState.reviewMode = true;
  quizState.currentIndex = 0;
  document.getElementById("quiz-feedback").textContent = "All questions answered. Review before final submit.";
  renderQuestion();
  renderReviewPanel();
  updateActionButtons();
}

function finalizeQuiz() {
  if (!quizState.reviewMode || quizState.finished) {
    return;
  }
  finishQuiz(false);
}

function topicStats() {
  const map = new Map();
  for (const answer of quizState.answers) {
    if (!map.has(answer.topic)) {
      map.set(answer.topic, { total: 0, correct: 0 });
    }
    const value = map.get(answer.topic);
    value.total += 1;
    value.correct += answer.correct ? 1 : 0;
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function difficultyStats() {
  const map = new Map();
  for (const answer of quizState.answers) {
    if (!map.has(answer.difficulty)) {
      map.set(answer.difficulty, { total: 0, correct: 0 });
    }
    const value = map.get(answer.difficulty);
    value.total += 1;
    value.correct += answer.correct ? 1 : 0;
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function readProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProgress(items) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(items.slice(-50)));
}

function saveAttempt(summary) {
  const current = readProgress();
  current.push(summary);
  writeProgress(current);
}

function renderProgress() {
  const attempts = readProgress();
  const target = document.getElementById("quiz-progress-content");
  if (attempts.length === 0) {
    target.innerHTML = "<p>No attempts yet.</p>";
    return;
  }

  const sortedByScore = [...attempts].sort((a, b) => {
    if (b.scorePercent !== a.scorePercent) {
      return b.scorePercent - a.scorePercent;
    }
    return a.totalTimeSeconds - b.totalTimeSeconds;
  });
  const best = sortedByScore[0];
  const avgScore = attempts.reduce((sum, item) => sum + item.scorePercent, 0) / attempts.length;
  const recent = attempts.slice(-5).reverse();

  const rows = recent
    .map((item) => `<li>${item.timestamp}: ${item.correct}/${item.total} (${item.scorePercent.toFixed(1)}%) in ${item.totalTimeSeconds.toFixed(1)}s</li>`)
    .join("");

  target.innerHTML = `
    <ul>
      <li><strong>Attempts:</strong> ${attempts.length}</li>
      <li><strong>Best score:</strong> ${best.scorePercent.toFixed(1)}% (${best.correct}/${best.total})</li>
      <li><strong>Average score:</strong> ${avgScore.toFixed(1)}%</li>
    </ul>
    <div class="quiz-leaderboard">
      <strong>Recent attempts</strong>
      <ul>${rows}</ul>
    </div>
  `;
}

function finishQuiz(timedOut) {
  quizState.finished = true;
  quizState.reviewMode = false;
  clearTimer();

  const total = quizState.answers.length;
  const correct = quizState.answers.filter((item) => item.correct).length;
  const score = total === 0 ? 0 : (correct / total) * 100;
  const points = quizState.answers.reduce((sum, item) => sum + item.points, 0);
  const maxPoints = quizState.answers.reduce((sum, item) => sum + item.maxPoints, 0);
  const pointsPercent = maxPoints === 0 ? 0 : (Math.max(0, points) / maxPoints) * 100;
  const totalTimeUsed = (Date.now() - quizState.startTimeMs) / 1000;
  const avgTime = total === 0 ? 0 : totalTimeUsed / total;
  const fastest = total === 0 ? 0 : Math.min(...quizState.answers.map((item) => item.questionSeconds));
  const slowest = total === 0 ? 0 : Math.max(...quizState.answers.map((item) => item.questionSeconds));

  const status = timedOut ? "Time expired." : "Quiz complete.";
  const summary = `${status} Score ${correct}/${total} (${score.toFixed(1)}%), points ${points.toFixed(2)}/${maxPoints.toFixed(2)} - ${scoreLabel(score)}`;
  document.getElementById("quiz-feedback").textContent = summary;

  const topicRows = topicStats()
    .map(([topic, values]) => {
      const pct = values.total === 0 ? 0 : (values.correct / values.total) * 100;
      return `<tr><td>${topic}</td><td>${values.correct}/${values.total}</td><td>${pct.toFixed(1)}%</td></tr>`;
    })
    .join("");

  const difficultyRows = difficultyStats()
    .map(([difficulty, values]) => {
      const pct = values.total === 0 ? 0 : (values.correct / values.total) * 100;
      return `<tr><td>${difficulty}</td><td>${values.correct}/${values.total}</td><td>${pct.toFixed(1)}%</td></tr>`;
    })
    .join("");

  const results = document.getElementById("quiz-results");
  results.innerHTML = `
    <h3>Final Stats</h3>
    <ul>
      <li><strong>Score:</strong> ${correct}/${total} (${score.toFixed(1)}%)</li>
      <li><strong>Points:</strong> ${points.toFixed(2)}/${maxPoints.toFixed(2)} (${pointsPercent.toFixed(1)}%)</li>
      <li><strong>Total time:</strong> ${totalTimeUsed.toFixed(1)}s</li>
      <li><strong>Average/question:</strong> ${avgTime.toFixed(1)}s</li>
      <li><strong>Fastest question:</strong> ${fastest.toFixed(1)}s</li>
      <li><strong>Slowest question:</strong> ${slowest.toFixed(1)}s</li>
      <li><strong>Questions answered:</strong> ${total}</li>
    </ul>
    <h4>By Topic</h4>
    <table>
      <thead><tr><th>Topic</th><th>Correct</th><th>Accuracy</th></tr></thead>
      <tbody>${topicRows || "<tr><td colspan='3'>No topic data.</td></tr>"}</tbody>
    </table>
    <h4>By Difficulty</h4>
    <table>
      <thead><tr><th>Difficulty</th><th>Correct</th><th>Accuracy</th></tr></thead>
      <tbody>${difficultyRows || "<tr><td colspan='3'>No difficulty data.</td></tr>"}</tbody>
    </table>
  `;

  saveAttempt({
    timestamp: new Date().toLocaleString(),
    total,
    correct,
    scorePercent: score,
    points,
    pointsPercent,
    totalTimeSeconds: totalTimeUsed,
  });

  quizState.lastResult = {
    timedOut,
    total,
    correct,
    scorePercent: score,
    points,
    maxPoints,
    pointsPercent,
    totalTimeSeconds: totalTimeUsed,
    averageQuestionSeconds: avgTime,
    fastestQuestionSeconds: fastest,
    slowestQuestionSeconds: slowest,
    scoringMode: getScoringMode(),
  };
  renderProgress();

  document.getElementById("quiz-next").disabled = true;
  updateActionButtons();
}

function tickTimer() {
  if (quizState.remainingSeconds <= 0) {
    document.getElementById("quiz-timer").textContent = "00:00";
    finishQuiz(true);
    return;
  }
  quizState.remainingSeconds -= 1;
  document.getElementById("quiz-timer").textContent = formatSeconds(quizState.remainingSeconds);
}

function startTimer(limitSeconds) {
  quizState.remainingSeconds = limitSeconds;
  document.getElementById("quiz-timer").textContent = formatSeconds(limitSeconds);
  clearTimer();
  quizState.timerId = setInterval(tickTimer, 1000);
}

function resetQuiz() {
  clearTimer();
  quizState.selectedQuestions = [];
  quizState.currentIndex = 0;
  quizState.answers = [];
  quizState.finished = false;
  quizState.reviewMode = false;
  quizState.lastResult = null;
  quizState.questionStartMs = 0;
  document.getElementById("quiz-board").innerHTML = "<p>Configure the quiz and click Start.</p>";
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-results").innerHTML = "";
  document.getElementById("quiz-timer").textContent = "00:00";
  document.getElementById("quiz-next").disabled = true;
  document.getElementById("quiz-finalize").disabled = true;
  renderProgress();
}

function startQuiz() {
  const count = Number(document.getElementById("quiz-count").value);
  const limitSeconds = Number(document.getElementById("quiz-limit").value);
  const seed = Number(document.getElementById("quiz-seed").value);
  const topics = selectedTopics();
  const weights = getDifficultyWeights();

  const pool = quizState.questions.filter((question) => topics.length === 0 || topics.includes(question.topic));
  if (pool.length === 0) {
    document.getElementById("quiz-feedback").textContent = "No questions match the selected topics.";
    return;
  }

  const targetCount = Math.min(Math.max(1, count), pool.length);
  quizState.selectedQuestions = buildBalancedQuestionSet(pool, targetCount, seed, weights);
  quizState.currentIndex = 0;
  quizState.answers = [];
  quizState.finished = false;
  quizState.reviewMode = false;
  quizState.lastResult = null;
  quizState.startTimeMs = Date.now();
  quizState.questionStartMs = Date.now();

  document.getElementById("quiz-results").innerHTML = "";
  document.getElementById("quiz-next").disabled = false;
  document.getElementById("quiz-finalize").disabled = true;
  renderQuestion();
  startTimer(Math.max(30, limitSeconds));
}

function nextQuestion() {
  if (quizState.finished) {
    return;
  }

  const current = quizState.selectedQuestions[quizState.currentIndex];
  const alreadyAnswered = quizState.answers.some((item) => item.id === current.id);
  if (!alreadyAnswered) {
    collectAnswer();
    return;
  }

  quizState.currentIndex += 1;
  if (quizState.currentIndex >= quizState.selectedQuestions.length) {
    enterReviewMode();
    return;
  }
  renderQuestion();
  if (quizState.reviewMode) {
    renderReviewPanel();
  }
}

async function initializeQuiz() {
  try {
    const response = await fetch(QUESTIONS_PATH);
    if (!response.ok) {
      throw new Error(`Unable to load question bank: ${response.status}`);
    }
    quizState.questions = await response.json();

    const topics = [...new Set(quizState.questions.map((item) => item.topic))].sort();
    const topicSelect = document.getElementById("quiz-topics");
    topicSelect.innerHTML = topics.map((topic) => `<option value="${topic}">${topic}</option>`).join("");

    resetQuiz();
  } catch (error) {
    document.getElementById("quiz-feedback").textContent = String(error.message || error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("quiz-start").addEventListener("click", startQuiz);
  document.getElementById("quiz-next").addEventListener("click", nextQuestion);
  document.getElementById("quiz-finalize").addEventListener("click", finalizeQuiz);
  document.getElementById("quiz-export-json").addEventListener("click", exportResultsJson);
  document.getElementById("quiz-export-csv").addEventListener("click", exportResultsCsv);
  document.getElementById("quiz-reset").addEventListener("click", resetQuiz);
  initializeQuiz();
});
