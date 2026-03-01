const quizState = {
  questions: [],
  selectedQuestions: [],
  currentIndex: 0,
  answers: [],
  timerId: null,
  remainingSeconds: 0,
  startTimeMs: 0,
  finished: false,
};

const QUESTIONS_PATH = "../../assets/quiz-questions.json";

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
  const disabled = answered ? "disabled" : "";

  const optionsHtml = question.options
    .map((option, index) => {
      const checked = answered && answered.selected === index ? "checked" : "";
      return `<label class="quiz-option"><input type="radio" name="quiz-option" value="${index}" ${checked} ${disabled}> <span>${String.fromCharCode(65 + index)}. ${option}</span></label>`;
    })
    .join("");

  board.innerHTML = `
    <div class="quiz-meta">
      <span>Question ${quizState.currentIndex + 1}/${quizState.selectedQuestions.length}</span>
      <span>Topic: ${question.topic}</span>
      <span>Difficulty: ${question.difficulty}</span>
    </div>
    <div class="quiz-prompt">${question.prompt}</div>
    <div class="quiz-options">${optionsHtml}</div>
  `;

  if (answered) {
    const text = answered.correct
      ? "Correct."
      : `Incorrect. Correct answer: ${String.fromCharCode(65 + question.answer_index)}. ${question.explanation}`;
    feedback.textContent = text;
  }

  const nextButton = document.getElementById("quiz-next");
  nextButton.disabled = !answered;
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
  const elapsedSeconds = Math.max(0, (Date.now() - quizState.startTimeMs) / 1000);

  quizState.answers.push({
    id: question.id,
    topic: question.topic,
    selected: selectedIndex,
    correct,
    elapsedSeconds,
  });
  renderQuestion();
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

function finishQuiz(timedOut) {
  quizState.finished = true;
  clearTimer();
  const total = quizState.answers.length;
  const correct = quizState.answers.filter((item) => item.correct).length;
  const score = total === 0 ? 0 : (correct / total) * 100;
  const totalTimeUsed = (Date.now() - quizState.startTimeMs) / 1000;
  const avgTime = total === 0 ? 0 : totalTimeUsed / total;

  const status = timedOut ? "Time expired." : "Quiz complete.";
  const summary = `${status} Score ${correct}/${total} (${score.toFixed(1)}%) - ${scoreLabel(score)}`;
  document.getElementById("quiz-feedback").textContent = summary;

  const rows = topicStats()
    .map(([topic, values]) => {
      const pct = values.total === 0 ? 0 : (values.correct / values.total) * 100;
      return `<tr><td>${topic}</td><td>${values.correct}/${values.total}</td><td>${pct.toFixed(1)}%</td></tr>`;
    })
    .join("");

  const results = document.getElementById("quiz-results");
  results.innerHTML = `
    <h3>Final Stats</h3>
    <ul>
      <li><strong>Score:</strong> ${correct}/${total} (${score.toFixed(1)}%)</li>
      <li><strong>Total time:</strong> ${totalTimeUsed.toFixed(1)}s</li>
      <li><strong>Average/question:</strong> ${avgTime.toFixed(1)}s</li>
      <li><strong>Questions answered:</strong> ${total}</li>
    </ul>
    <table>
      <thead><tr><th>Topic</th><th>Correct</th><th>Accuracy</th></tr></thead>
      <tbody>${rows || "<tr><td colspan='3'>No topic data.</td></tr>"}</tbody>
    </table>
  `;

  document.getElementById("quiz-next").disabled = true;
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
  document.getElementById("quiz-board").innerHTML = "<p>Configure the quiz and click Start.</p>";
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-results").innerHTML = "";
  document.getElementById("quiz-timer").textContent = "00:00";
  document.getElementById("quiz-next").disabled = true;
}

function startQuiz() {
  const count = Number(document.getElementById("quiz-count").value);
  const limitSeconds = Number(document.getElementById("quiz-limit").value);
  const seed = Number(document.getElementById("quiz-seed").value);
  const topics = selectedTopics();

  const pool = quizState.questions.filter((question) => topics.length === 0 || topics.includes(question.topic));
  if (pool.length === 0) {
    document.getElementById("quiz-feedback").textContent = "No questions match the selected topics.";
    return;
  }

  const shuffled = shuffleArray(pool, seed);
  quizState.selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
  quizState.currentIndex = 0;
  quizState.answers = [];
  quizState.finished = false;
  quizState.startTimeMs = Date.now();

  document.getElementById("quiz-results").innerHTML = "";
  document.getElementById("quiz-next").disabled = false;
  renderQuestion();
  startTimer(limitSeconds);
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
    finishQuiz(false);
    return;
  }
  renderQuestion();
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
  document.getElementById("quiz-reset").addEventListener("click", resetQuiz);
  initializeQuiz();
});
