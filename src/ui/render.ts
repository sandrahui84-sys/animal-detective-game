import { animals } from '../data/animals';
import {
  categoryById,
  categoryDefinitions,
} from '../data/categories';
import {
  questionById,
  questionCategoryEmojis,
  questionCategoryLabels,
  questionDefinitions,
} from '../data/questions';
import { getRemainingCandidates, isCandidateEliminated } from '../game/candidates';
import { remainingQuestions, TOTAL_QUESTIONS } from '../game/logic';
import { scoreMessage } from '../game/scoring';
import type {
  CategoryId,
  GameState,
  LevelId,
  QuestionCategory,
} from '../types';

const levelNames: Record<LevelId, string> = {
  1: '特徵新手',
  2: '分類偵探',
  3: '動物專家',
};

const levelDescriptions: Record<LevelId, string> = {
  1: '從一批現成問題出發，熟習動物的關鍵特徵。',
  2: '先選問題類別，再挑選最有用的線索。',
  3: '用自己的說法提問，挑戰關鍵字推理能力。',
};

const levelTags: Record<LevelId, string[]> = {
  1: ['點擊問題', '認識特徵'],
  2: ['分類選擇', '比較線索'],
  3: ['自由輸入', '關鍵字辨識'],
};

const levelEmojis: Record<LevelId, string> = {
  1: '🌱',
  2: '🔎',
  3: '🧠',
};

const levelSuitableFor: Record<LevelId, string> = {
  1: '第一次挑戰',
  2: '進階推理',
  3: '高手挑戰',
};

const questionIconById: Record<string, string> = {
  hasFeathers: '🪶',
  hasHair: '🧶',
  hasThreePairsOfLegs: '🐾',
  hasAntennae: '〰️',
  bodyHasHeadThoraxAbdomen: '🧩',
  hasBeak: '🪿',
  hasWings: '🪽',
  hasFourLegs: '🐾',
  hasMoistSkin: '💧',
  hasDrySkin: '☀️',
  hasHardScales: '🐢',
  hasScales: '🔹',
  hasShell: '🐚',
  breathesWithGills: '🐟',
  breathesWithLungs: '🫁',
  feedsMilk: '🍼',
  laysEggs: '🥚',
  hasAquaticLarva: '🌊',
  livesInWater: '🌊',
  canSwim: '🏊',
  canFly: '💨',
};

const starterDisplayQuestionIds = [
  'hasFeathers',
  'breathesWithLungs',
  'breathesWithGills',
  'feedsMilk',
  'hasThreePairsOfLegs',
  'hasMoistSkin',
  'hasHardScales',
  'hasWings',
];

const classificationPrinciple = '判斷動物所屬類別時，要考慮多個特徵，尤其是該類動物的重要或獨有特徵。';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const levelCard = (level: LevelId, selectedLevel: LevelId): string => {
  const selected = level === selectedLevel;
  return `
    <article class="level-card mission-card mission-level-${level} ${selected ? 'is-selected' : ''}">
      <div class="level-card-topline">
        <span class="level-number">Level ${level}</span>
        <span class="mission-free-mark">可自由挑戰</span>
      </div>
      <div class="mission-icon" aria-hidden="true">${levelEmojis[level]}</div>
      <h3>${levelEmojis[level]} ${levelNames[level]}</h3>
      <p>${levelDescriptions[level]}</p>
      <div class="mission-suitable"><span>適合：</span>${levelSuitableFor[level]}</div>
      <div class="tag-row mission-tags">
        ${levelTags[level].map((tag) => `<span class="mini-tag">${tag}</span>`).join('')}
      </div>
      <button class="primary-button level-start-button" data-action="start-game" data-level="${level}">
        開始 Level ${level} <span aria-hidden="true">→</span>
      </button>
    </article>
  `;
};

const categoryCard = (categoryId: CategoryId): string => {
  const category = categoryById[categoryId];
  return `
    <article class="category-card category-${category.color}">
      <div class="category-icon" aria-hidden="true">${category.emoji}</div>
      <div class="category-card-content">
        <h3>${category.label}</h3>
        <p>${category.tagline}</p>
        <ul>
          ${category.coreFeatures.map((feature) => `<li>${feature}</li>`).join('')}
        </ul>
        ${category.importantFeature ? `<div class="category-important">⭐ ${category.importantFeature}</div>` : ''}
      </div>
    </article>
  `;
};

const renderHeader = (compact = false): string => `
  <header class="site-header ${compact ? 'site-header-compact' : ''}">
    <button class="brand-lockup" data-action="home" aria-label="返回首頁">
      <span class="brand-icon" aria-hidden="true">🔎</span>
      <span><strong>動物偵探王</strong><small>九龍婦女福利會李炳紀念學校</small></span>
    </button>
    <div class="header-note"><span class="live-dot"></span> 科學探索進行中</div>
  </header>
`;

export function renderHome(state: GameState): string {
  const levels: LevelId[] = [1, 2, 3];
  return `
    ${renderHeader()}
    <section class="home-hero panel-glass">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot"></span> LPMS・動物分類任務</span>
        <h1>🔍 動物偵探王<br /><em>4問破解動物身份</em></h1>
        <p class="hero-subtitle">運用動物的關鍵特徵，找出牠屬於哪一類！</p>
        <p class="hero-question">你能在 4 個問題內找出秘密動物嗎？</p>
        <p class="hero-intro">不要只看牠住在哪裏、會不會飛。<br />問對問題，才可以找到真正重要的科學證據。</p>
        <div class="hero-actions">
          <button class="primary-button" data-action="scroll-to-levels">
            <span aria-hidden="true">🔍</span> 開始偵探任務
          </button>
          <span class="action-hint">先選任務難度，再開始調查</span>
        </div>
      </div>
      <div class="hero-stamp" aria-label="每局最多四條線索">
        <span class="stamp-icon" aria-hidden="true">4</span>
        <strong>次提問機會</strong>
        <small>揪出秘密動物</small>
      </div>
      <div class="hero-ribbon" aria-hidden="true"><span>問</span><span>想</span><span>推</span><span>證</span></div>
    </section>

    <section class="stats-strip" aria-label="遊戲資料">
      <div><strong>🐾 32</strong><span>種動物</span></div>
      <div><strong>🧩 6</strong><span>大類別</span></div>
      <div><strong>❤️ 4</strong><span>次提問</span></div>
    </section>

    <section class="section-block" aria-labelledby="levels-title">
      <div class="section-heading">
        <div><span class="section-kicker">選擇你的任務</span><h2 id="levels-title">選擇你的偵探任務</h2></div>
        <p>三個 Level 都可以自由挑戰！選一個任務，立即開始搜證。</p>
      </div>
      <div class="level-grid">${levels.map((level) => levelCard(level, state.selectedLevel)).join('')}</div>
    </section>

    <section class="section-block category-section" aria-labelledby="categories-title">
      <div class="section-heading">
        <div><span class="section-kicker">偵探分類手冊</span><h2 id="categories-title">偵探分類手冊</h2></div>
        <p>${classificationPrinciple}</p>
      </div>
      <div class="category-grid">${categoryDefinitions.map((category) => categoryCard(category.id)).join('')}</div>
    </section>

    <aside class="principle-callout">
      <div class="callout-icon" aria-hidden="true">🧠</div>
      <div><strong>偵探貼士：特徵比印象可靠</strong><p>「住在水中」不一定是魚，「有翅膀」也不一定是鳥。${classificationPrinciple}</p></div>
    </aside>
    <footer class="site-footer">動物偵探王 <span>・</span> 九龍婦女福利會李炳紀念學校製作</footer>
  `;
}

const renderHeartMeter = (state: GameState): string => {
  const remaining = remainingQuestions(state);
  return `
    <div class="question-meter" aria-label="剩餘 ${remaining} 次提問">
      <div class="heart-row">
        ${Array.from({ length: TOTAL_QUESTIONS }, (_, index) => `<span class="heart ${index < remaining ? 'heart-full' : 'heart-empty'}" aria-hidden="true">${index < remaining ? '♥' : '♡'}</span>`).join('')}
      </div>
      <strong class="remaining-questions">剩餘 ${remaining} 問</strong>
    </div>
  `;
};

const renderChatHistory = (state: GameState): string => {
  if (state.answers.length === 0) {
    return `
      <div class="chat-turn chat-turn-welcome chat-latest">
        <div class="chat-line assistant-line">
          <span class="chat-avatar" aria-hidden="true">🤖</span>
          <div class="chat-copy"><small>動物偵探助手</small><p>我已經選定了一隻動物！<br />你有 4 次機會問「是／不是」問題。<br />請利用動物的特徵來推理！</p></div>
        </div>
      </div>
    `;
  }

  return state.answers.map((answer, index) => `
    <div class="chat-turn ${index === state.answers.length - 1 ? 'chat-latest' : 'chat-old'}">
      <div class="chat-line user-line">
        <span class="chat-avatar" aria-hidden="true">👤</span>
        <div class="chat-copy"><small>你</small><p>${escapeHtml(answer.askedText)}</p></div>
      </div>
      <div class="chat-line assistant-line">
        <span class="chat-avatar" aria-hidden="true">🤖</span>
        <div class="chat-copy"><small>動物偵探助手</small><p class="chat-answer">${answer.answer ? '是。' : '不是。'}</p><span class="chat-meta">第 ${index + 1} 次問題・還有 ${TOTAL_QUESTIONS - index - 1} 次機會</span></div>
      </div>
    </div>
  `).join('');
};

const renderResponsePanel = (state: GameState): string => `
  <section class="assistant-panel panel-card" aria-live="polite">
    <div class="assistant-heading">
      <div class="assistant-avatar" aria-hidden="true">🔎</div>
      <div><span class="section-kicker">偵探對話紀錄</span><h2>AI 動物偵探助手</h2></div>
      <span class="online-pill"><span class="live-dot"></span> 已準備</span>
    </div>
    <div class="chat-history" aria-label="你的問題及 AI 回答">
      ${renderChatHistory(state)}
    </div>
  </section>
`;

const questionButton = (questionId: string, state: GameState): string => {
  const question = questionById[questionId as keyof typeof questionById];
  const asked = state.askedQuestionIds.includes(question.id);
  const disabled = asked || remainingQuestions(state) === 0 || state.isGuessing;
  const scoreText = question.score === 2 ? '關鍵 +2' : '線索 +1';
  return `
    <button class="question-card ${asked ? 'question-asked' : ''}" data-action="ask-question" data-question-id="${question.id}" ${disabled ? 'disabled' : ''}>
      <span class="question-card-icon" aria-hidden="true">${asked ? '✓' : questionIconById[question.id] ?? '🔍'}</span>
      <span class="question-card-copy"><strong>${question.text}</strong><small>${asked ? '已經問過' : scoreText}</small></span>
      <span class="question-card-arrow" aria-hidden="true">${asked ? '✓ 已問' : '→'}</span>
    </button>
  `;
};

const renderStarterQuestions = (state: GameState): string => `
  <div class="question-intro"><span class="question-intro-icon">🔍</span><div><strong>選擇一條線索</strong><p>每次只能問一個「是／不是」問題。</p></div></div>
  <div class="question-grid">${starterDisplayQuestionIds.map((questionId) => questionButton(questionId, state)).join('')}</div>
`;

const renderCategoryTabs = (state: GameState): string => {
  const categories: QuestionCategory[] = ['body', 'surface', 'respiration', 'movement', 'reproduction', 'lifeHistory'];
  return `
    <div class="question-intro"><span class="question-intro-icon">🔎</span><div><strong>你想調查甚麼？</strong><p>先選一種特徵，再挑選最有用的線索。</p></div></div>
    <div class="category-tabs" role="tablist" aria-label="問題類別">
      ${categories.map((category) => `
        <button class="category-tab ${state.activeQuestionCategory === category ? 'is-active' : ''}" data-action="select-question-category" data-question-category="${category}" role="tab" aria-selected="${state.activeQuestionCategory === category}">
          <span aria-hidden="true">${questionCategoryEmojis[category]}</span>${questionCategoryLabels[category]}
        </button>
      `).join('')}
    </div>
  `;
};

const renderLevelTwoQuestions = (state: GameState): string => {
  const questions = questionDefinitions.filter((question) => question.category === state.activeQuestionCategory);
  return `${renderCategoryTabs(state)}<div class="selected-category-label"><span>${questionCategoryEmojis[state.activeQuestionCategory]}</span>${questionCategoryLabels[state.activeQuestionCategory]}問題</div><div class="question-grid">${questions.map((question) => questionButton(question.id, state)).join('')}</div>`;
};

const renderFreeQuestion = (state: GameState): string => `
  <div class="question-intro"><span class="question-intro-icon">🧠</span><div><strong>自己提出一條「是／不是」問題 <span class="question-tip">（先用動物獨有特徵提問）</span></strong><p>程式會找出你問到的已知特徵；無法理解的問題不會扣次數。</p></div></div>
  <form class="free-question-form" data-form="free-question">
    <label for="free-question-input">你的問題</label>
    <div class="input-row">
      <input id="free-question-input" name="question" type="text" autocomplete="off" placeholder="例如：牠有羽毛嗎？" aria-describedby="free-question-hint" />
      <button class="primary-button small-button" type="submit" ${remainingQuestions(state) === 0 || state.isGuessing ? 'disabled' : ''}>送出問題 <span aria-hidden="true">→</span></button>
    </div>
    <div class="hint-chips" id="free-question-hint"><span>身體表面</span><span>呼吸方式</span><span>育幼方式</span></div>
  </form>
  ${state.inputMessage ? `<div class="inline-message ${state.responseText.includes('聽不懂') || state.inputMessage.includes('未能') ? 'message-warn' : ''}" role="status">💬 ${escapeHtml(state.inputMessage)}</div>` : ''}
`;

const renderOtherQuestion = (state: GameState): string => {
  const remaining = remainingQuestions(state);
  const available = (state.level === 1 || state.level === 2)
    && remaining > 0
    && remaining <= 2
    && !state.isGuessing;

  if (!available) {
    return '';
  }

  if (!state.isOtherQuestionOpen) {
    return `
      <button class="other-question-trigger" type="button" data-action="open-other-question">
        <span class="other-question-trigger-icon" aria-hidden="true">✍️</span>
        <span class="other-question-trigger-copy"><strong>其他：自己輸入問題</strong><small>還有 ${remaining} 問，可以用自己的說法找更細的線索</small></span>
        <span class="other-question-trigger-arrow" aria-hidden="true">→</span>
      </button>
    `;
  }

  return `
    <div class="other-question-editor">
      <div class="other-question-editor-heading">
        <div class="other-question-editor-title">
          <span class="other-question-editor-icon" aria-hidden="true">✍️</span>
          <div><strong>其他：自己輸入一條「是／不是」問題</strong><p>試試問一個能分辨動物的獨有特徵。</p></div>
        </div>
        <button class="subtle-button" type="button" data-action="close-other-question">返回選擇問題</button>
      </div>
      <form class="free-question-form" data-form="free-question">
        <label for="free-question-input">你的問題</label>
        <div class="input-row">
          <input id="free-question-input" name="question" type="text" autocomplete="off" placeholder="例如：牠有羽毛嗎？" aria-describedby="free-question-hint" />
          <button class="primary-button small-button" type="submit">送出問題 <span aria-hidden="true">→</span></button>
        </div>
        <div class="hint-chips" id="free-question-hint"><span>身體表面</span><span>呼吸方式</span><span>育幼方式</span></div>
      </form>
    </div>
  `;
};

const renderQuestionZone = (state: GameState): string => {
  const content = state.level === 1
    ? renderStarterQuestions(state)
    : state.level === 2
      ? renderLevelTwoQuestions(state)
      : renderFreeQuestion(state);

  return `
    <section class="question-panel panel-card" aria-labelledby="question-panel-title">
      <div class="panel-heading"><div><span class="section-kicker">調查白板</span><h2 id="question-panel-title">提出你的問題${state.level === 1 || state.level === 2 ? ' <span class="question-panel-tip">（先用動物的獨有特徵提問）</span>' : ''}</h2></div><span class="points-legend"><span class="legend-dot high"></span>關鍵特徵 +2 <span class="legend-dot normal"></span>一般線索 +1</span></div>
      ${content}
      ${renderOtherQuestion(state)}
      ${state.level !== 3 && state.inputMessage ? `<div class="inline-message" role="status">💬 ${escapeHtml(state.inputMessage)}</div>` : ''}
      <button class="guess-cta ${state.isGuessing ? 'is-open' : ''}" data-action="open-guess" ${state.isGuessing ? 'disabled' : ''}>
        <span class="guess-bulb" aria-hidden="true">💡</span><span><strong>${remainingQuestions(state) === 0 ? '開始作答' : '我知道答案了！'}</strong><small>${remainingQuestions(state) === 0 ? '問題已用完，現在揭開你的推理' : '任何時候都可以進入作答區'}</small></span><span class="guess-arrow" aria-hidden="true">→</span>
      </button>
    </section>
  `;
};

const renderGuessPanel = (state: GameState): string => {
  if (!state.isGuessing) {
    return '';
  }

  const candidates = getRemainingCandidates(animals, state.answers);
  const canSubmit = Boolean(state.selectedAnimalId && state.selectedCategoryId);
  return `
    <section id="guess-panel" class="guess-panel panel-card" aria-labelledby="guess-panel-title">
      <div class="guess-panel-heading"><div><span class="section-kicker">最後推理</span><h2 id="guess-panel-title">揭開你的推理答案</h2></div>${remainingQuestions(state) > 0 ? '<button class="subtle-button" data-action="close-guess">繼續查線索</button>' : '<span class="time-up-pill">4 問完成</span>'}</div>
      <p class="guess-panel-lead">要同時答對秘密動物和牠的分類，才算完成任務。想清楚哪些特徵最重要！</p>
      <div class="guess-step">
        <div class="step-badge">A</div>
        <div class="step-copy"><strong>秘密動物是：</strong><small>從仍未被排除的候選中選一隻</small></div>
      </div>
      <div class="guess-animal-grid">
        ${candidates.map((animal) => `
          <button class="guess-animal ${state.selectedAnimalId === animal.id ? 'is-selected' : ''}" data-action="select-animal" data-animal-id="${animal.id}" aria-pressed="${state.selectedAnimalId === animal.id}">
            <span class="animal-emoji" aria-hidden="true">${animal.emoji}</span><span>${animal.name}</span>${state.selectedAnimalId === animal.id ? '<b class="selection-check">✓</b>' : ''}
          </button>
        `).join('')}
      </div>
      <div class="guess-step category-step">
        <div class="step-badge">B</div>
        <div class="step-copy"><strong>牠屬於哪一類？</strong><small>留意重要或獨有的特徵</small></div>
      </div>
      <div class="guess-category-grid">
        ${categoryDefinitions.map((category) => `
          <button class="guess-category category-${category.color} ${state.selectedCategoryId === category.id ? 'is-selected' : ''}" data-action="select-category" data-category-id="${category.id}" aria-pressed="${state.selectedCategoryId === category.id}">
            <span aria-hidden="true">${category.emoji}</span><strong>${category.label}</strong>${state.selectedCategoryId === category.id ? '<b class="selection-check">✓</b>' : ''}
          </button>
        `).join('')}
      </div>
      ${state.inputMessage ? `<div class="inline-message message-warn" role="status">💬 ${escapeHtml(state.inputMessage)}</div>` : ''}
      <button class="primary-button submit-guess-button" data-action="submit-guess" ${canSubmit ? '' : 'disabled'}>提交我的答案 <span aria-hidden="true">✦</span></button>
    </section>
  `;
};

const renderCandidates = (state: GameState): string => {
  const remainingCandidateCount = getRemainingCandidates(animals, state.answers).length;
  const candidateHint = remainingCandidateCount <= 4
    ? '💡 已經非常接近答案了！'
    : remainingCandidateCount <= 8
      ? '🔍 範圍縮小了！現在可以考慮作出判斷。'
      : '';

  return `
    <section class="candidate-panel panel-card" aria-labelledby="candidate-title">
      <div class="panel-heading candidate-heading"><div><span class="section-kicker">偵探筆記</span><h2 id="candidate-title">🐾 候選動物</h2></div><div class="candidate-heading-right"><div class="candidate-count">剩餘候選：<strong>${remainingCandidateCount}</strong></div><div class="candidate-legend"><span class="legend-cross">×</span>淡色代表已排除，保留作為推理紀錄</div></div></div>
      <div class="candidate-grid">
        ${animals.map((animal) => {
          const eliminated = isCandidateEliminated(animal, state.answers);
          const category = categoryById[animal.category];
          return `
            <div class="candidate-card ${eliminated ? 'is-eliminated' : 'is-possible'}" aria-label="${animal.name}${eliminated ? '，已排除' : '，仍是候選'}">
              <span class="candidate-emoji" aria-hidden="true">${animal.emoji}</span><span class="candidate-name">${animal.name}</span><span class="candidate-category-dot category-dot-${category.color}" aria-hidden="true"></span>${eliminated ? '<span class="elimination-cross" aria-hidden="true">×</span>' : ''}
            </div>
          `;
        }).join('')}
      </div>
      <div class="candidate-footer"><span>目前仍可能是 <strong>${remainingCandidateCount}</strong> 種動物</span><span>提示：不要被外表帶走，逐條核對特徵。</span></div>
      ${candidateHint ? `<div class="candidate-hint" role="status">${candidateHint}</div>` : ''}
    </section>
  `;
};

export function renderGame(state: GameState): string {
  return `
    ${renderHeader(true)}
    <div class="game-topbar">
      <button class="back-button" data-action="home"><span aria-hidden="true">←</span> 返回任務選擇</button>
      <div class="game-title"><span class="game-title-mark" aria-hidden="true">🧭</span><span>4問破解動物身份</span></div>
      <div class="game-meta"><span class="level-pill">Level ${state.level}・${levelNames[state.level]}</span></div>
    </div>
    <section class="game-intro panel-glass">
      <div class="game-intro-copy"><span class="eyebrow"><span class="eyebrow-dot"></span> 動物偵探任務</span><h1>鎖定秘密動物，開始搜證！</h1><div class="secret-status"><span>秘密動物：</span><strong>？？？</strong></div><p>每條答案都會幫你縮小範圍。想一想：哪些是分類的重要特徵？</p></div>
      ${renderHeartMeter(state)}
    </section>
    <main class="game-layout">
      <div class="game-main-column">${renderResponsePanel(state)}${renderQuestionZone(state)}${renderGuessPanel(state)}</div>
      <aside class="game-side-column"><div class="side-tip panel-card"><span class="side-tip-icon" aria-hidden="true">🧪</span><div><strong>分類實驗室</strong><p>${classificationPrinciple}</p></div></div><div class="score-board compact-score-board panel-card"><div class="score-heading"><span class="score-symbol" aria-hidden="true">⭐</span><div><span class="section-kicker">調查進度</span><h2>推理分 <strong>${state.score}</strong></h2></div></div><p>問到關鍵分類特徵可獲較高分</p></div></aside>
    </main>
    ${renderCandidates(state)}
    <footer class="site-footer">問題由本地規則引擎回答・不需要網絡或登入</footer>
  `;
}

const resultFeedback = (state: GameState): string => {
  if (state.result?.animalCorrect && state.result.categoryCorrect) {
    return '你真是動物分類專家！';
  }

  if (state.result?.animalCorrect) {
    return '動物找到了，分類證據再看清楚一點！';
  }

  if (state.result?.categoryCorrect) {
    return '分類方向正確，再留意動物的細節！';
  }

  return '再看看關鍵特徵，你已經很接近了！';
};

const renderResultChecks = (state: GameState): string => {
  const result = state.result;
  if (!result) {
    return '';
  }

  const guessedAnimal = result.guessedAnimalId ? animals.find((animal) => animal.id === result.guessedAnimalId) : null;
  const guessedCategory = result.guessedCategoryId ? categoryById[result.guessedCategoryId] : null;
  return `
    <div class="answer-check-row">
      <div class="answer-check ${result.animalCorrect ? 'is-correct' : 'is-review'}"><span>${result.animalCorrect ? '✓' : '↺'}</span><div><small>秘密動物</small><strong>${guessedAnimal?.name ?? '未選擇'}</strong></div></div>
      <div class="answer-check ${result.categoryCorrect ? 'is-correct' : 'is-review'}"><span>${result.categoryCorrect ? '✓' : '↺'}</span><div><small>你的分類</small><strong>${guessedCategory?.label ?? '未選擇'}</strong></div></div>
    </div>
  `;
};

export function renderResult(state: GameState): string {
  const secretAnimal = state.secretAnimal;
  const result = state.result;
  if (!secretAnimal || !result) {
    return renderHome(state);
  }

  const category = categoryById[secretAnimal.category];
  const success = result.animalCorrect && result.categoryCorrect;
  return `
    ${renderHeader(true)}
    <main class="result-page">
      <section class="result-banner panel-glass ${success ? 'result-success' : 'result-learning'}">
        <div class="result-sparkles" aria-hidden="true">✦　·　✧　·　✦</div>
        ${success ? '<div class="result-confetti" aria-hidden="true"><span>✦</span><span>●</span><span>✦</span><span>●</span><span>✦</span></div>' : ''}
        <span class="result-eyebrow">${success ? '案件破解' : '學習筆記已更新'}</span>
        <div class="result-title-row"><div class="result-badge" aria-hidden="true">${success ? '🏆' : '🧭'}</div><div><h1>${success ? '答對了！' : '差一點！再看看關鍵特徵。'}</h1><p>${resultFeedback(state)}</p></div></div>
        ${renderResultChecks(state)}
      </section>
      <section class="result-layout">
        <article class="reveal-card panel-card">
          <div class="reveal-topline"><span class="section-kicker">秘密動物揭曉</span><span class="category-pill category-${category.color}">${category.emoji} ${category.label}</span></div>
          <div class="reveal-animal"><span class="reveal-emoji" aria-hidden="true">${secretAnimal.emoji}</span><div><span class="reveal-label">秘密動物是</span><h2>${secretAnimal.name}</h2><p>${category.tagline}</p></div></div>
          <div class="evidence-box"><div class="evidence-heading"><span>🔬</span><strong>關鍵證據</strong><small>${secretAnimal.evidence.length} 條線索</small></div><ul>${secretAnimal.evidence.map((evidence) => `<li><span aria-hidden="true">✓</span>${evidence}</li>`).join('')}</ul></div>
        </article>
        <aside class="score-result-card panel-card"><span class="section-kicker">你的調查紀錄</span><h2>推理分</h2><div class="big-score"><strong>${state.score}</strong><span>/ 8</span></div><p>${scoreMessage(state.score)}</p><div class="result-stat-row"><span>已用問題</span><strong>${state.askedQuestionIds.length} / ${TOTAL_QUESTIONS}</strong></div><div class="result-stat-row"><span>剩餘候選</span><strong>${getRemainingCandidates(animals, state.answers).length} 種</strong></div></aside>
      </section>
      <section class="explanation-card panel-card">
        <div class="explanation-heading"><span class="explanation-icon" aria-hidden="true">💡</span><div><span class="section-kicker">為甚麼是這一類？</span><h2>分類解說</h2></div></div>
        <p>${secretAnimal.explanation}</p>
        ${secretAnimal.misconception ? `<div class="misconception-note"><span aria-hidden="true">🧠</span><div><strong>迷思破解</strong><p>${secretAnimal.misconception}</p></div></div>` : ''}
        <div class="principle-mini"><strong>記住：</strong>${classificationPrinciple}</div>
      </section>
      <div class="result-actions"><button class="primary-button" data-action="restart"><span aria-hidden="true">↻</span> 再玩一次</button><button class="secondary-button" data-action="choose-level">選擇其他 Level</button><button class="text-button" data-action="home">返回首頁</button></div>
    </main>
    <footer class="site-footer">動物偵探王 <span>・</span> 九龍婦女福利會李炳紀念學校製作</footer>
  `;
}

export function renderApp(state: GameState): string {
  const page = state.view === 'home' ? renderHome(state) : state.view === 'game' ? renderGame(state) : renderResult(state);
  return `<div class="app-shell app-view-${state.view}"><div class="page-shell">${page}</div></div>`;
}
