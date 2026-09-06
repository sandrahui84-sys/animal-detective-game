import { animals } from './data/animals';
import { questionById } from './data/questions';
import {
  askDefinedQuestion,
  askFreeQuestion,
  chooseRandomAnimal,
  closeGuessPanel,
  createGameState,
  createHomeState,
  openGuessPanel,
  selectAnimalGuess,
  selectCategoryGuess,
  setActiveQuestionCategory,
  submitGuess,
} from './game/logic';
import { renderApp } from './ui/render';
import type { CategoryId, GameState, LevelId, QuestionCategory } from './types';
import './styles.css';

const appElement = document.querySelector<HTMLDivElement>('#app');

if (!appElement) {
  throw new Error('找不到遊戲容器。');
}

const app = appElement;

const forestBackground = `${import.meta.env.BASE_URL}images/animal-detective-bg.png`;
document.documentElement.style.setProperty('--forest-background', `url("${forestBackground}")`);

let state: GameState = createHomeState();
let previousView = state.view;

function render(shouldScroll = false): void {
  app.innerHTML = renderApp(state);

  if (shouldScroll || state.view !== previousView) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousView = state.view;
}

function startGame(level: LevelId): void {
  state = createGameState(level, chooseRandomAnimal(animals, state.secretAnimal?.id));
  render(true);
}

function goHome(): void {
  const selectedLevel = state.selectedLevel;
  state = { ...createHomeState(), selectedLevel };
  render(true);
}

function chooseLevel(): void {
  const selectedLevel = state.level;
  state = { ...createHomeState(), selectedLevel };
  render(true);
}

app.addEventListener('click', (event) => {
  const element = event.target instanceof Element
    ? event.target.closest<HTMLElement>('[data-action]')
    : null;

  if (!element) {
    return;
  }

  const action = element.dataset.action;

  switch (action) {
    case 'scroll-to-levels':
      document.querySelector('#levels-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 'select-level': {
      const level = Number(element.dataset.level) as LevelId;
      if (level === 1 || level === 2 || level === 3) {
        state = { ...state, selectedLevel: level };
        render();
      }
      break;
    }
    case 'start-game': {
      const level = Number(element.dataset.level) as LevelId;
      startGame(level === 1 || level === 2 || level === 3 ? level : state.selectedLevel);
      break;
    }
    case 'home':
      goHome();
      break;
    case 'restart':
      startGame(state.level);
      break;
    case 'choose-level':
      chooseLevel();
      break;
    case 'select-question-category': {
      const category = element.dataset.questionCategory as QuestionCategory;
      state = setActiveQuestionCategory(state, category);
      render();
      break;
    }
    case 'ask-question': {
      const questionId = element.dataset.questionId;
      if (questionId && questionById[questionId as keyof typeof questionById]) {
        state = askDefinedQuestion(state, questionById[questionId as keyof typeof questionById]);
        render();
      }
      break;
    }
    case 'open-guess':
      state = openGuessPanel(state);
      render();
      document.querySelector('#guess-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 'close-guess':
      state = closeGuessPanel(state);
      render();
      break;
    case 'select-animal': {
      const animalId = element.dataset.animalId;
      if (animalId) {
        state = selectAnimalGuess(state, animalId);
        render();
      }
      break;
    }
    case 'select-category': {
      const categoryId = element.dataset.categoryId as CategoryId;
      state = selectCategoryGuess(state, categoryId);
      render();
      break;
    }
    case 'submit-guess':
      state = submitGuess(state);
      render(true);
      break;
    default:
      break;
  }
});

app.addEventListener('submit', (event) => {
  const form = event.target instanceof HTMLFormElement
    ? event.target.closest<HTMLFormElement>('[data-form="free-question"]')
    : null;

  if (!form) {
    return;
  }

  event.preventDefault();
  const formData = new FormData(form);
  const input = String(formData.get('question') ?? '');
  state = askFreeQuestion(state, input).state;
  render();

  if (state.inputMessage) {
    document.querySelector<HTMLInputElement>('#free-question-input')?.focus();
  }
});

render();
