import type { QuestionDefinition } from '../types';

export function pointsForQuestion(question: QuestionDefinition): number {
  return question.score;
}

export function scoreMessage(score: number): string {
  if (score >= 6) {
    return '你很懂得找關鍵特徵！';
  }

  if (score >= 3) {
    return '你已經掌握分類方向！';
  }

  return '下次試試先問呼吸方式、身體表面或育幼方式！';
}

export function scoreLabel(score: number): string {
  return score > 0 ? `+${score} 推理分` : '無分類價值';
}
