import { animals } from '../data/animals';
import { categoryById } from '../data/categories';
import { questionById, questionIsNegated, matchQuestionText } from '../data/questions';
import { getRemainingCandidates } from './candidates';
import type {
  Animal,
  AnsweredQuestion,
  CategoryId,
  FeatureKey,
  GameResult,
  GameState,
  LevelId,
  QuestionDefinition,
  QuestionCategory,
} from '../types';
import { pointsForQuestion } from './scoring';

export const TOTAL_QUESTIONS = 5;

export function createHomeState(): GameState {
  return {
    view: 'home',
    selectedLevel: 1,
    level: 1,
    secretAnimal: null,
    askedQuestionIds: [],
    answers: [],
    score: 0,
    activeQuestionCategory: 'body',
    isGuessing: false,
    isOtherQuestionOpen: false,
    selectedAnimalId: null,
    selectedCategoryId: null,
    inputMessage: '',
    responseText: '',
    responseMeta: '',
    result: null,
  };
}

export function chooseRandomAnimal(animals: Animal[], previousId?: string): Animal {
  const choices = previousId ? animals.filter((animal) => animal.id !== previousId) : animals;
  const pool = choices.length > 0 ? choices : animals;
  return pool[Math.floor(Math.random() * pool.length)] ?? animals[0];
}

export function createGameState(level: LevelId, secretAnimal: Animal): GameState {
  return {
    ...createHomeState(),
    view: 'game',
    selectedLevel: level,
    level,
    secretAnimal,
    responseText: '我已經選定了一隻動物！\n你有 5 次機會問「是／不是」問題。\n請利用動物的特徵來推理！',
    responseMeta: '準備好就開始調查吧！',
  };
}

export function remainingQuestions(state: GameState): number {
  return Math.max(0, TOTAL_QUESTIONS - state.askedQuestionIds.length);
}

export function questionWasAsked(state: GameState, questionId: FeatureKey): boolean {
  return state.askedQuestionIds.includes(questionId);
}

export function askDefinedQuestion(
  state: GameState,
  question: QuestionDefinition,
): GameState {
  if (!state.secretAnimal) {
    return state;
  }

  if (remainingQuestions(state) === 0) {
    return {
      ...state,
      isGuessing: true,
      inputMessage: '5 次問題已經用完，現在請選出你的答案吧！',
    };
  }

  if (questionWasAsked(state, question.id)) {
    return {
      ...state,
      inputMessage: '這個問題你已經問過了，試試另一個特徵。',
    };
  }

  const answer = state.secretAnimal.traits[question.id];
  const askedQuestionIds = [...state.askedQuestionIds, question.id];
  const points = pointsForQuestion(question);
  const questionsLeft = TOTAL_QUESTIONS - askedQuestionIds.length;
  const answerRecord: AnsweredQuestion = {
    questionId: question.id,
    answer,
    askedText: question.text,
    points,
  };

  return {
    ...state,
    askedQuestionIds,
    answers: [...state.answers, answerRecord],
    score: state.score + points,
    inputMessage: '',
    responseText: answer ? '是。' : '不是。',
    responseMeta: `這是你的第 ${askedQuestionIds.length} 次問題，你還有 ${questionsLeft} 次機會。`,
    isGuessing: questionsLeft === 0,
  };
}

export interface FreeQuestionResult {
  state: GameState;
  matchedQuestion: QuestionDefinition | null;
}

function invalidQuestionMessage(state: GameState): string {
  const remainingCandidates = getRemainingCandidates(animals, state.answers);
  const categoryIds = new Set(remainingCandidates.map((animal) => animal.category));

  if (remainingCandidates.length > 0 && categoryIds.size === 1) {
    const categoryId = remainingCandidates[0]?.category;
    const categoryLabel = categoryId ? categoryById[categoryId].label : '這一類動物';
    return `這個問題未能幫助找出個別動物。🎯 已鎖定分類：${categoryLabel}！請改問動物的外形、行為或生活習性。`;
  }

  return '這個問題未能幫助判斷分類，請改問動物的身體特徵、呼吸方式或育幼方式。';
}

export function askFreeQuestion(state: GameState, input: string): FreeQuestionResult {
  const trimmedInput = input.trim();
  const question = matchQuestionText(trimmedInput);

  if (!question) {
    return {
      state: {
        ...state,
        inputMessage: invalidQuestionMessage(state),
        responseText: '我聽不懂這個分類問題。',
        responseMeta: '試試問「牠有羽毛嗎？」或「牠用肺呼吸嗎？」',
      },
      matchedQuestion: null,
    };
  }

  const normalizedAnswer = questionIsNegated(trimmedInput, question)
    ? !state.secretAnimal?.traits[question.id]
    : state.secretAnimal?.traits[question.id];

  if (state.askedQuestionIds.includes(question.id)) {
    return {
      state: {
        ...state,
        inputMessage: '這個問題你已經問過了，試試換一個關鍵特徵。',
        responseText: '這條線索已經記錄過了。',
        responseMeta: '重複問題不會扣提問次數。',
      },
      matchedQuestion: question,
    };
  }

  if (remainingQuestions(state) === 0) {
    return {
      state: {
        ...state,
        isGuessing: true,
        inputMessage: '5 次問題已經用完，現在請選出你的答案吧！',
      },
      matchedQuestion: question,
    };
  }

  const nextState = askDefinedQuestion(state, question);
  const answer = Boolean(normalizedAnswer);

  const lastAnswerIndex = nextState.answers.length - 1;
  const updatedAnswers = nextState.answers.map((record, index) =>
    index === lastAnswerIndex ? { ...record, answer, askedText: trimmedInput } : record,
  );

  // Free-form questions may use a negative form such as 「沒有羽毛嗎？」.
  // Keep the student's wording in the chat while recording the matched feature answer.
  return {
    state: {
      ...nextState,
      answers: updatedAnswers,
      responseText: answer ? '是。' : '不是。',
    },
    matchedQuestion: question,
  };
}

export function setActiveQuestionCategory(
  state: GameState,
  category: QuestionCategory,
): GameState {
  return { ...state, activeQuestionCategory: category, inputMessage: '' };
}

export function openOtherQuestion(state: GameState): GameState {
  return { ...state, isOtherQuestionOpen: true, inputMessage: '' };
}

export function closeOtherQuestion(state: GameState): GameState {
  return { ...state, isOtherQuestionOpen: false, inputMessage: '' };
}

export function openGuessPanel(state: GameState): GameState {
  return {
    ...state,
    isGuessing: true,
    inputMessage: '',
  };
}

export function closeGuessPanel(state: GameState): GameState {
  if (remainingQuestions(state) === 0) {
    return state;
  }

  return { ...state, isGuessing: false, inputMessage: '' };
}

export function selectAnimalGuess(state: GameState, animalId: string): GameState {
  return { ...state, selectedAnimalId: animalId, inputMessage: '' };
}

export function selectCategoryGuess(state: GameState, categoryId: CategoryId): GameState {
  return { ...state, selectedCategoryId: categoryId, inputMessage: '' };
}

export function evaluateGuess(
  state: GameState,
  guessedAnimalId: string | null,
  guessedCategoryId: CategoryId | null,
): GameResult {
  return {
    guessedAnimalId,
    guessedCategoryId,
    animalCorrect: guessedAnimalId === state.secretAnimal?.id,
    categoryCorrect: guessedCategoryId === state.secretAnimal?.category,
  };
}

export function submitGuess(state: GameState): GameState {
  if (!state.selectedAnimalId || !state.selectedCategoryId) {
    return {
      ...state,
      inputMessage: '請完成兩項選擇：秘密動物和牠所屬的類別。',
    };
  }

  return {
    ...state,
    view: 'result',
    isGuessing: false,
    result: evaluateGuess(state, state.selectedAnimalId, state.selectedCategoryId),
    inputMessage: '',
  };
}

export function questionForId(questionId: FeatureKey): QuestionDefinition {
  return questionById[questionId];
}
