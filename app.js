'use strict';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EXAM_MC_COUNT  = 13;
const EXAM_OPEN_COUNT = 4;
const EXAM_DURATION  = 90 * 60; // 5400 seconds
const LS_KEY         = 'eds4_progress';

// ─── STATE ────────────────────────────────────────────────────────────────────
const state = {
  screen: 'home',
  pickerMode: 'quiz', // 'quiz' | 'flashcard'
  session: {
    mode: null,
    topics: [],
    questionTypes: ['mc', 'tf', 'open'],
    difficulty: 'all',
    questions: [],
    index: 0,
    answers: [],
    examTimer: null,
    examSecondsLeft: EXAM_DURATION,
    flashcardPool: [],
    flashcardDone: [],
    flashcardFlipped: false,
    examSubmitted: false
  },
  progress: null
};

// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────
function defaultProgress() {
  const byTopic = {};
  Object.keys(TOPIC_META).forEach(t => {
    byTopic[t] = { answered: 0, correct: 0, lastPracticed: null };
  });
  return { version: 1, totalSessions: 0, totalAnswered: 0, totalCorrect: 0,
    lastSession: null, byTopic, byQuestion: {}, examHistory: [] };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      // ensure all topics exist
      Object.keys(TOPIC_META).forEach(t => {
        if (!p.byTopic[t]) p.byTopic[t] = { answered: 0, correct: 0, lastPracticed: null };
      });
      state.progress = p;
    } else {
      state.progress = defaultProgress();
    }
  } catch (e) {
    state.progress = defaultProgress();
  }
}

function saveProgress() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state.progress)); } catch (e) {}
}

function resetProgress() {
  state.progress = defaultProgress();
  saveProgress();
}

// ─── SHUFFLE & SELECTION ──────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function questionWeight(q) {
  const h = state.progress.byQuestion[q.id];
  let w = 1;
  if (!h || h.seen === 0) {
    w = 1.5; // unseen bonus
  } else {
    const ratio = h.correct / h.seen;
    w = 1 + 2 * (1 - ratio); // poor performance → higher weight
  }
  const diffBonus = { easy: 0, medium: 0.3, hard: 0.6 };
  w += (diffBonus[q.difficulty] || 0);
  return Math.max(0.1, w);
}

function weightedSample(pool, count) {
  if (pool.length === 0) return [];
  const weights = pool.map(questionWeight);
  const totalW = weights.reduce((a, b) => a + b, 0);
  const selected = [];
  const remaining = [...pool];
  const remW = [...weights];
  const n = Math.min(count, remaining.length);
  for (let i = 0; i < n; i++) {
    const total = remW.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let idx = 0;
    while (idx < remW.length - 1 && r > remW[idx]) { r -= remW[idx]; idx++; }
    selected.push(remaining[idx]);
    remaining.splice(idx, 1);
    remW.splice(idx, 1);
  }
  return selected;
}

function buildQuizSet(topics, types, difficulty, count) {
  let pool = QUESTIONS.filter(q => {
    const topicOk = topics.length === 0 || topics.includes(q.topic);
    const typeOk  = types.includes(q.type);
    const diffOk  = difficulty === 'all' || q.difficulty === difficulty;
    return topicOk && typeOk && diffOk;
  });
  if (pool.length === 0) return [];
  const selected = weightedSample(pool, count);
  return shuffle(selected);
}

function buildFlashcardSet(topics) {
  let pool = QUESTIONS.filter(q => {
    const topicOk = topics.length === 0 || topics.includes(q.topic);
    return q.type === 'flashcard' && topicOk;
  });
  if (pool.length === 0) {
    // fallback: convert mc questions to flashcards
    pool = QUESTIONS.filter(q => (topics.length === 0 || topics.includes(q.topic)) && q.type === 'mc');
  }
  return shuffle(pool);
}

function buildExamSet() {
  const mcPool  = shuffle(QUESTIONS.filter(q => q.type === 'mc'));
  const openPool = shuffle(QUESTIONS.filter(q => q.type === 'open'));
  // prefer examRelevant
  const mcER  = mcPool.filter(q => q.examRelevant);
  const mcOth = mcPool.filter(q => !q.examRelevant);
  const openER  = openPool.filter(q => q.examRelevant);
  const openOth = openPool.filter(q => !q.examRelevant);
  const mcSet   = [...mcER, ...mcOth].slice(0, EXAM_MC_COUNT);
  const openSet = [...openER, ...openOth].slice(0, EXAM_OPEN_COUNT);
  return shuffle(mcSet).concat(shuffle(openSet));
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function navigate(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  state.screen = screen;
  const renders = { home: renderHome, picker: renderPicker, quiz: renderQuiz,
    flashcard: renderFlashcard, results: renderResults };
  if (renders[screen]) renders[screen]();
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function renderHome() {
  const p = state.progress;
  // compute overall mastery %
  let totalA = 0, totalC = 0;
  Object.values(p.byTopic).forEach(t => { totalA += t.answered; totalC += t.correct; });
  const pct = totalA > 0 ? Math.round(totalC / totalA * 100) : 0;
  const circ = 2 * Math.PI * 50; // 314.16
  const offset = circ - (pct / 100) * circ;
  document.getElementById('ring-fill').style.strokeDashoffset = offset;
  document.getElementById('ring-pct').textContent = pct + '%';

  const stats = document.getElementById('home-stats');
  if (p.lastSession) {
    stats.textContent = `Last session: ${Math.round((p.lastSession.score || 0) * 100)}% · ${p.totalAnswered} total answered`;
  } else {
    stats.textContent = 'No sessions yet — start practising!';
  }
}

// ─── PICKER ───────────────────────────────────────────────────────────────────
function renderPicker() {
  const mode = state.pickerMode;
  document.getElementById('picker-title').textContent = mode === 'flashcard' ? 'Flashcard Session' : 'Practice Session';
  document.getElementById('picker-types-section').style.display = mode === 'flashcard' ? 'none' : '';
  document.getElementById('picker-count-section').style.display = mode === 'flashcard' ? 'none' : '';

  // build topic grid
  const grid = document.getElementById('topic-grid');
  grid.innerHTML = '';
  const p = state.progress;
  Object.entries(TOPIC_META).forEach(([slug, meta]) => {
    const t = p.byTopic[slug];
    const pct = t.answered > 0 ? Math.round(t.correct / t.answered * 100) : null;
    const tile = document.createElement('button');
    tile.className = 'topic-tile';
    tile.dataset.slug = slug;
    tile.style.setProperty('--tc', meta.color);
    tile.innerHTML = `
      <span class="tile-icon">${meta.icon}</span>
      <span class="tile-name">${meta.label}</span>
      <span class="tile-pct">${pct !== null ? pct + '%' : '—'}</span>
      <span class="tile-check">✓</span>`;
    tile.addEventListener('click', () => toggleTopic(slug, tile));
    grid.appendChild(tile);
  });

  updatePickerStart();
}

function toggleTopic(slug, tile) {
  tile.classList.toggle('selected');
  updatePickerStart();
}

function updatePickerStart() {
  const selected = document.querySelectorAll('.topic-tile.selected');
  document.getElementById('picker-start').disabled = selected.length === 0;
  // update all-toggle label
  const total = Object.keys(TOPIC_META).length;
  document.getElementById('picker-all-toggle').textContent =
    selected.length === total ? 'Deselect All' : 'Select All';
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
function renderQuiz() {
  const s = state.session;
  const q = s.questions[s.index];
  if (!q) { endSession(); return; }

  // top bar meta
  const topicLabel = (TOPIC_META[q.topic] || {}).label || q.topic;
  document.getElementById('quiz-meta').textContent = topicLabel;
  document.getElementById('quiz-counter').textContent = `${s.index + 1} / ${s.questions.length}`;

  // progress bar
  document.getElementById('quiz-progress').style.width =
    ((s.index / s.questions.length) * 100) + '%';

  // exam timer visibility
  const timerEl = document.getElementById('exam-timer');
  timerEl.classList.toggle('hidden', s.mode !== 'exam');

  const body = document.getElementById('quiz-body');
  body.innerHTML = '';

  // badges
  const badges = document.createElement('div');
  badges.className = 'q-badges';
  badges.innerHTML = `<span class="badge badge-diff-${q.difficulty}">${q.difficulty}</span>
    <span class="badge badge-topic">${topicLabel}</span>`;
  body.appendChild(badges);

  // question text
  const qText = document.createElement('div');
  qText.className = 'q-text';
  qText.style.whiteSpace = 'pre-wrap';
  qText.textContent = q.question;
  body.appendChild(qText);

  // render question type
  if (q.type === 'mc') renderMCQuestion(q, body);
  else if (q.type === 'tf') renderTFQuestion(q, body);
  else if (q.type === 'open') renderOpenQuestion(q, body);
  else renderMCQuestion(q, body); // flashcard fallback shouldn't happen in quiz
}

function renderMCQuestion(q, body) {
  // shuffle options
  const indices = shuffle([0, 1, 2, 3]);
  const newCorrect = indices.indexOf(q.correct);

  const grid = document.createElement('div');
  grid.className = 'mc-grid';

  let selected = null;
  const optBtns = [];

  indices.forEach((origIdx, newIdx) => {
    const btn = document.createElement('button');
    btn.className = 'mc-opt';
    btn.textContent = q.options[origIdx];
    btn.addEventListener('click', () => {
      if (selected !== null) return;
      selected = newIdx;
      optBtns.forEach((b, i) => b.classList.toggle('selected', i === newIdx));
      submitBtn.disabled = false;
    });
    optBtns.push(btn);
    grid.appendChild(btn);
  });
  body.appendChild(grid);

  // submit
  const submitRow = document.createElement('div');
  submitRow.className = 'submit-row';
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary submit-btn';
  submitBtn.textContent = 'Submit Answer';
  submitBtn.disabled = true;
  submitBtn.addEventListener('click', () => {
    const isCorrect = selected === newCorrect;
    optBtns.forEach((b, i) => {
      b.disabled = true;
      if (i === newCorrect) b.classList.add('correct');
      else if (i === selected && !isCorrect) b.classList.add('wrong');
    });
    submitBtn.style.display = 'none';
    recordAnswer(q, isCorrect ? 1 : 0);
    showExplanation(q, isCorrect ? 1 : 0, body);
  });
  submitRow.appendChild(submitBtn);
  body.appendChild(submitRow);
}

function renderTFQuestion(q, body) {
  const list = document.createElement('div');
  list.className = 'tf-list';
  const stateArr = [null, null];
  const btnPairs = [];

  q.statements.forEach((stmt, si) => {
    const item = document.createElement('div');
    item.className = 'tf-item';
    const stmtEl = document.createElement('div');
    stmtEl.className = 'tf-stmt';
    stmtEl.textContent = `Statement ${si + 1}: "${stmt.text}"`;
    const btnsEl = document.createElement('div');
    btnsEl.className = 'tf-btns';
    const trueBtn = document.createElement('button');
    trueBtn.className = 'tf-btn';
    trueBtn.textContent = 'True';
    const falseBtn = document.createElement('button');
    falseBtn.className = 'tf-btn';
    falseBtn.textContent = 'False';

    const pick = (val) => {
      stateArr[si] = val;
      trueBtn.classList.toggle('sel-true', val === true);
      trueBtn.classList.toggle('sel-false', false);
      falseBtn.classList.toggle('sel-false', val === false);
      falseBtn.classList.toggle('sel-true', false);
      submitBtn.disabled = stateArr.includes(null);
    };
    trueBtn.addEventListener('click', () => pick(true));
    falseBtn.addEventListener('click', () => pick(false));
    btnsEl.appendChild(trueBtn);
    btnsEl.appendChild(falseBtn);
    item.appendChild(stmtEl);
    item.appendChild(btnsEl);
    list.appendChild(item);
    btnPairs.push({ trueBtn, falseBtn, stmt });
  });
  body.appendChild(list);

  const submitRow = document.createElement('div');
  submitRow.className = 'submit-row';
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary submit-btn';
  submitBtn.textContent = 'Submit Answer';
  submitBtn.disabled = true;

  submitBtn.addEventListener('click', () => {
    let correctCount = 0;
    btnPairs.forEach(({ trueBtn, falseBtn, stmt }, si) => {
      trueBtn.disabled = true; falseBtn.disabled = true;
      const userAns = stateArr[si];
      const isRight = userAns === stmt.correct;
      if (isRight) correctCount++;
      const correctBtn = stmt.correct ? trueBtn : falseBtn;
      const wrongBtn   = stmt.correct ? falseBtn : trueBtn;
      correctBtn.classList.add('correct');
      if (!isRight) wrongBtn.classList.add('wrong');
    });
    const score = correctCount / q.statements.length; // 0, 0.5, or 1
    submitBtn.style.display = 'none';
    recordAnswer(q, score);
    showExplanation(q, score, body);
  });
  submitRow.appendChild(submitBtn);
  body.appendChild(submitRow);
}

function renderOpenQuestion(q, body) {
  const textarea = document.createElement('textarea');
  textarea.className = 'open-textarea';
  textarea.placeholder = 'Write your answer here…';
  body.appendChild(textarea);

  const revealBtn = document.createElement('button');
  revealBtn.className = 'btn btn-ghost open-reveal-btn';
  revealBtn.textContent = 'Show Sample Answer';
  body.appendChild(revealBtn);

  let revealed = false;
  revealBtn.addEventListener('click', () => {
    if (revealed) return;
    revealed = true;
    revealBtn.style.display = 'none';

    const sampleBox = document.createElement('div');
    sampleBox.className = 'sample-answer';
    sampleBox.style.whiteSpace = 'pre-wrap';
    sampleBox.innerHTML = `<strong>Sample Answer:</strong>\n${q.sampleAnswer}`;
    body.appendChild(sampleBox);

    if (q.rubric && q.rubric.length) {
      const rubricLabel = document.createElement('p');
      rubricLabel.style.cssText = 'font-weight:700;margin:12px 0 6px;font-size:14px;';
      rubricLabel.textContent = 'Key Points to Check:';
      body.appendChild(rubricLabel);
      const ul = document.createElement('ul');
      ul.className = 'rubric-list';
      q.rubric.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    const gradeLabel = document.createElement('p');
    gradeLabel.style.cssText = 'font-weight:700;margin:12px 0 6px;font-size:14px;';
    gradeLabel.textContent = 'How well did you do?';
    body.appendChild(gradeLabel);

    const gradeRow = document.createElement('div');
    gradeRow.className = 'self-grade-row';
    const grades = [
      { label: '✓ Got it', score: 1, cls: 'btn-success' },
      { label: '~ Partially', score: 0.5, cls: 'btn-ghost' },
      { label: '✗ Missed it', score: 0, cls: 'btn-danger' }
    ];
    grades.forEach(({ label, score, cls }) => {
      const btn = document.createElement('button');
      btn.className = `btn ${cls}`;
      btn.textContent = label;
      btn.addEventListener('click', () => {
        gradeRow.querySelectorAll('button').forEach(b => b.disabled = true);
        recordAnswer(q, score);
        showExplanation(q, score, body);
      });
      gradeRow.appendChild(btn);
    });
    body.appendChild(gradeRow);
  });
}

function showExplanation(q, score, body) {
  const isGood = score >= 0.9;
  const isPartial = score > 0 && score < 0.9;

  const banner = document.createElement('div');
  banner.className = 'feedback-banner ' + (isGood ? 'correct-banner' : isPartial ? 'partial-banner' : 'wrong-banner');
  banner.textContent = isGood ? '✓ Correct!' : isPartial ? '~ Partially correct' : '✗ Incorrect';
  body.appendChild(banner);

  if (q.explanation) {
    const box = document.createElement('div');
    box.className = 'explanation-box' + (isGood ? '' : ' wrong-bg');
    const lbl = document.createElement('div');
    lbl.className = 'explanation-label' + (isGood ? '' : ' wrong-label');
    lbl.textContent = 'Explanation';
    const txt = document.createElement('div');
    txt.style.whiteSpace = 'pre-wrap';
    txt.textContent = q.explanation;
    box.appendChild(lbl);
    box.appendChild(txt);
    body.appendChild(box);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary next-btn';
  const s = state.session;
  const isLast = s.index >= s.questions.length - 1;
  nextBtn.textContent = isLast ? 'See Results' : 'Next Question →';
  nextBtn.addEventListener('click', () => {
    s.index++;
    if (s.index >= s.questions.length) endSession();
    else renderQuiz();
  });
  body.appendChild(nextBtn);
}

function recordAnswer(q, score) {
  const s = state.session;
  s.answers.push({ qId: q.id, score, topic: q.topic, type: q.type });

  // update progress
  const p = state.progress;
  const bq = p.byQuestion[q.id] || { seen: 0, correct: 0 };
  bq.seen++;
  bq.correct += score;
  p.byQuestion[q.id] = bq;

  const bt = p.byTopic[q.topic];
  bt.answered++;
  bt.correct += score;
  bt.lastPracticed = new Date().toISOString().slice(0, 10);
  p.totalAnswered++;
  p.totalCorrect += score;
  saveProgress();
}

// ─── FLASHCARD ────────────────────────────────────────────────────────────────
function renderFlashcard() {
  const s = state.session;
  if (s.flashcardPool.length === 0) { endSession(); return; }

  const total = s.flashcardPool.length + s.flashcardDone.length;
  const done  = s.flashcardDone.length;
  document.getElementById('fc-counter').textContent = `${done} / ${total}`;
  document.getElementById('fc-progress').style.width = (done / total * 100) + '%';

  const q = s.flashcardPool[0];
  const card  = document.getElementById('fc-card');
  const front = document.getElementById('fc-front');
  const back  = document.getElementById('fc-back');

  card.classList.remove('flipped');
  s.flashcardFlipped = false;

  // determine content
  let frontText, backText;
  if (q.type === 'flashcard') {
    frontText = q.front;
    backText  = q.back;
  } else {
    // MC used as flashcard
    frontText = q.question;
    backText  = q.options ? q.options[q.correct] : q.explanation;
  }

  front.innerHTML = `<div class="fc-front-label">Question</div><div class="fc-front-text">${frontText}</div>`;
  back.innerHTML  = `<div class="fc-front-label">Answer</div><div class="fc-back-text" style="white-space:pre-wrap">${backText}</div>`;

  document.getElementById('fc-hint').textContent = 'Tap card to reveal answer';
  document.getElementById('fc-actions').innerHTML = '';

  document.getElementById('fc-hint').style.display = '';
}

function flipCard() {
  const s = state.session;
  if (s.flashcardFlipped) return;
  s.flashcardFlipped = true;
  document.getElementById('fc-card').classList.add('flipped');
  document.getElementById('fc-hint').style.display = 'none';

  const actions = document.getElementById('fc-actions');
  actions.innerHTML = '';

  const gotIt = document.createElement('button');
  gotIt.className = 'btn btn-success';
  gotIt.textContent = '✓ Got it';
  gotIt.addEventListener('click', () => {
    const q = s.flashcardPool.shift();
    s.flashcardDone.push(q);
    recordAnswer(q, 1);
    if (s.flashcardPool.length === 0) endSession();
    else renderFlashcard();
  });

  const again = document.createElement('button');
  again.className = 'btn btn-danger';
  again.textContent = '✗ Again';
  again.addEventListener('click', () => {
    const q = s.flashcardPool.shift();
    s.flashcardPool.push(q); // move to end
    recordAnswer(q, 0);
    renderFlashcard();
  });

  actions.appendChild(gotIt);
  actions.appendChild(again);
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function endSession() {
  if (state.session.examTimer) {
    clearInterval(state.session.examTimer);
    state.session.examTimer = null;
  }
  navigate('results');
}

function renderResults() {
  const s = state.session;
  const answers = s.answers;
  const mode = s.mode;

  document.getElementById('results-title').textContent =
    mode === 'exam' ? 'Exam Results' : mode === 'flashcard' ? 'Flashcard Session Done' : 'Session Complete';

  // compute stats
  const total = answers.length;
  const correct = answers.reduce((a, b) => a + b.score, 0);
  const pct = total > 0 ? Math.round(correct / total * 100) : 0;

  // ring
  const circ = 314;
  const offset = circ - (pct / 100) * circ;
  document.getElementById('results-ring-fill').style.strokeDashoffset = offset;
  document.getElementById('results-pct').textContent = pct + '%';
  document.getElementById('results-pts').textContent = `${correct.toFixed(1)} / ${total} pts`;

  // exam grade
  const gradeEl = document.getElementById('results-grade');
  if (mode === 'exam') {
    const mcAnswers  = answers.slice(0, EXAM_MC_COUNT);
    const openAnswers = answers.slice(EXAM_MC_COUNT);
    const mcPts   = mcAnswers.reduce((a, b) => a + (b.score >= 1 ? 3 : 0), 0);
    const openPts = openAnswers.reduce((a, b) => a + b.score * (51 / EXAM_OPEN_COUNT), 0);
    const totalPts = mcPts + openPts;
    const grade = Math.max(1.0, 1.0 + totalPts / 10).toFixed(1);
    gradeEl.textContent = `Grade: ${grade}`;
    gradeEl.className = 'results-grade' + (parseFloat(grade) >= 5.5 ? ' pass' : ' fail');
    document.getElementById('results-pts').textContent = `${totalPts.toFixed(1)} / 90 pts · MC: ${mcPts}/39`;

    // store exam history
    state.progress.examHistory.push({
      date: new Date().toISOString().slice(0, 10),
      score: parseFloat(grade), points: totalPts,
      breakdown: { mc: mcPts, open: Math.round(openPts) }
    });
    saveProgress();
  } else {
    gradeEl.className = 'results-grade hidden';
  }

  // by-topic table
  const byTopic = {};
  answers.forEach(a => {
    if (!byTopic[a.topic]) byTopic[a.topic] = { answered: 0, correct: 0 };
    byTopic[a.topic].answered++;
    byTopic[a.topic].correct += a.score;
  });

  const tableWrap = document.getElementById('results-table-wrap');
  tableWrap.innerHTML = '';
  if (Object.keys(byTopic).length > 0) {
    const tbl = document.createElement('table');
    tbl.className = 'results-table';
    tbl.innerHTML = '<thead><tr><th>Topic</th><th>Answered</th><th>Score</th></tr></thead>';
    const tbody = document.createElement('tbody');
    Object.entries(byTopic).forEach(([topic, data]) => {
      const p = data.answered > 0 ? Math.round(data.correct / data.answered * 100) : 0;
      const cls = p >= 70 ? 'good' : p >= 50 ? 'mid' : 'bad';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${(TOPIC_META[topic] || {}).label || topic}</td>
        <td>${data.answered}</td>
        <td class="pct-cell ${cls}">${p}%</td>`;
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    tableWrap.appendChild(tbl);
  }

  // smart CTA
  let weakest = null, weakestPct = 101;
  Object.entries(byTopic).forEach(([topic, data]) => {
    if (data.answered > 0) {
      const p = data.correct / data.answered * 100;
      if (p < weakestPct) { weakestPct = p; weakest = topic; }
    }
  });
  const ctaEl = document.getElementById('results-smart-cta');
  if (weakest && weakestPct < 70) {
    const label = (TOPIC_META[weakest] || {}).label || weakest;
    ctaEl.textContent = `💡 Weakest topic: ${label} (${Math.round(weakestPct)}%). Practice it next!`;
    ctaEl.style.display = '';
  } else {
    ctaEl.style.display = 'none';
  }

  // update session progress
  const p = state.progress;
  p.totalSessions++;
  p.lastSession = {
    date: new Date().toISOString().slice(0, 10),
    mode, topics: s.topics,
    score: total > 0 ? correct / total : 0
  };
  saveProgress();

  // buttons
  const btns = document.getElementById('results-btns');
  btns.innerHTML = '';

  if (mode === 'exam') {
    addResultBtn(btns, 'Retry Exam', 'btn-accent', () => startExam());
  } else {
    addResultBtn(btns, 'Practice Again', 'btn-primary', () => {
      state.pickerMode = 'quiz'; navigate('picker');
    });
  }
  addResultBtn(btns, 'Home', 'btn-ghost', () => navigate('home'));
}

function addResultBtn(parent, text, cls, handler) {
  const btn = document.createElement('button');
  btn.className = `btn ${cls}`;
  btn.textContent = text;
  btn.addEventListener('click', handler);
  parent.appendChild(btn);
}

// ─── EXAM TIMER ───────────────────────────────────────────────────────────────
function startExamTimer() {
  const s = state.session;
  s.examSecondsLeft = EXAM_DURATION;
  const timerEl = document.getElementById('exam-timer');
  timerEl.classList.remove('danger', 'hidden');

  s.examTimer = setInterval(() => {
    s.examSecondsLeft--;
    timerEl.textContent = formatTime(s.examSecondsLeft);
    if (s.examSecondsLeft <= 300) timerEl.classList.add('danger');
    if (s.examSecondsLeft <= 0) {
      clearInterval(s.examTimer);
      endSession();
    }
  }, 1000);
  timerEl.textContent = formatTime(EXAM_DURATION);
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── SESSION STARTERS ─────────────────────────────────────────────────────────
function startQuiz() {
  const topics = [...document.querySelectorAll('.topic-tile.selected')].map(t => t.dataset.slug);
  const types  = [...document.querySelectorAll('#type-checks input:checked')].map(i => i.value);
  const diff   = document.querySelector('.pill.active').dataset.diff;
  const count  = parseInt(document.getElementById('count-slider').value, 10);

  const questions = buildQuizSet(topics, types.length ? types : ['mc', 'tf', 'open'], diff, count);
  if (questions.length === 0) { alert('No questions match your selection. Try different options.'); return; }

  Object.assign(state.session, {
    mode: 'quiz', topics, questionTypes: types, difficulty: diff,
    questions, index: 0, answers: [], examTimer: null
  });
  navigate('quiz');
}

function startFlashcards() {
  const topics = [...document.querySelectorAll('.topic-tile.selected')].map(t => t.dataset.slug);
  const cards  = buildFlashcardSet(topics);
  if (cards.length === 0) { alert('No flashcards found for selected topics.'); return; }

  Object.assign(state.session, {
    mode: 'flashcard', topics,
    flashcardPool: cards, flashcardDone: [], flashcardFlipped: false, answers: []
  });
  navigate('flashcard');
}

function startExam() {
  const questions = buildExamSet();
  if (questions.length < EXAM_MC_COUNT) { alert('Not enough exam questions available.'); return; }

  Object.assign(state.session, {
    mode: 'exam', topics: [], questions, index: 0, answers: [],
    examSecondsLeft: EXAM_DURATION, examSubmitted: false
  });
  navigate('quiz');
  startExamTimer();
}

// ─── EVENT BINDING ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  navigate('home');

  // Home buttons
  document.getElementById('btn-practice').addEventListener('click', () => {
    state.pickerMode = 'quiz'; navigate('picker');
  });
  document.getElementById('btn-flashcards').addEventListener('click', () => {
    state.pickerMode = 'flashcard'; navigate('picker');
  });
  document.getElementById('btn-exam').addEventListener('click', startExam);

  // Picker back
  document.getElementById('picker-back').addEventListener('click', () => navigate('home'));

  // Picker all-toggle
  document.getElementById('picker-all-toggle').addEventListener('click', () => {
    const tiles = document.querySelectorAll('.topic-tile');
    const allSelected = [...tiles].every(t => t.classList.contains('selected'));
    tiles.forEach(t => t.classList.toggle('selected', !allSelected));
    updatePickerStart();
  });

  // Count slider
  document.getElementById('count-slider').addEventListener('input', function () {
    document.getElementById('count-label').textContent = this.value;
  });

  // Difficulty pills
  document.getElementById('diff-pills').addEventListener('click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });

  // Picker start
  document.getElementById('picker-start').addEventListener('click', () => {
    if (state.pickerMode === 'flashcard') startFlashcards();
    else startQuiz();
  });

  // Quiz exit
  document.getElementById('quiz-exit').addEventListener('click', () => {
    if (state.session.mode === 'exam') {
      if (!confirm('Exit exam? Your current answers will be scored.')) return;
      endSession();
    } else {
      if (state.session.answers.length > 0) endSession();
      else navigate('home');
    }
  });

  // Flashcard card flip
  document.getElementById('fc-scene').addEventListener('click', flipCard);

  // Flashcard back button
  document.getElementById('fc-back').addEventListener('click', () => {
    if (state.session.examTimer) clearInterval(state.session.examTimer);
    navigate('home');
  });
});
