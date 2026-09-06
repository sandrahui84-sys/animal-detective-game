import type { Animal, AnsweredQuestion } from '../types';

/**
 * Keep every animal in the notebook. This function only decides whether its
 * traits are still compatible with the answers already collected.
 */
export function getRemainingCandidates(
  animals: Animal[],
  answers: AnsweredQuestion[],
): Animal[] {
  return animals.filter((animal) =>
    answers.every(({ questionId, answer }) => animal.traits[questionId] === answer),
  );
}

export function isCandidateEliminated(
  animal: Animal,
  answers: AnsweredQuestion[],
): boolean {
  return !answers.every(({ questionId, answer }) => animal.traits[questionId] === answer);
}
