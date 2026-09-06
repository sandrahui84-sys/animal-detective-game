export type CategoryId =
  | 'insect'
  | 'fish'
  | 'bird'
  | 'mammal'
  | 'reptile'
  | 'amphibian';

export type QuestionCategory =
  | 'body'
  | 'surface'
  | 'respiration'
  | 'movement'
  | 'reproduction'
  | 'lifeHistory';

export type FeatureType = 'classification' | 'individual';

export type LevelId = 1 | 2 | 3;

export type FeatureKey =
  | 'hasFeathers'
  | 'hasHair'
  | 'hasThreePairsOfLegs'
  | 'hasAntennae'
  | 'bodyHasHeadThoraxAbdomen'
  | 'hasFins'
  | 'hasBeak'
  | 'hasWings'
  | 'hasFourLegs'
  | 'hasMoistSkin'
  | 'hasDrySkin'
  | 'hasHardScales'
  | 'hasScales'
  | 'hasShell'
  | 'breathesWithGills'
  | 'breathesWithLungs'
  | 'breathesWithSkin'
  | 'feedsMilk'
  | 'laysEggs'
  | 'livesInWater'
  | 'canSwim'
  | 'canFly'
  | 'juvenileAquatic'
  | 'adultMostlyLand'
  | 'hasMetamorphosis'
  | 'isNocturnal'
  | 'cannotFly'
  | 'swimsWell'
  | 'hasWebbedFeet'
  | 'changesColour'
  | 'climbsWell'
  | 'runsFast'
  | 'mainlyMarine'
  | 'hasTailAsAdult'
  | 'jumpsWell'
  | 'longBody'
  | 'noLegs'
  | 'hasLargeHindLegs'
  | 'canInflateBody'
  | 'uprightSwimming'
  | 'hasFlippers'
  | 'hasDorsalFin'
  | 'hasLongNeck'
  | 'buildsNest'
  | 'livesInColony'
  | 'hasFourWings'
  | 'hasHardForewings'
  | 'hasStripedPattern'
  | 'hasCurledTail'
  | 'livesInFreshwater'
  | 'hasBumpySkin'
  | 'usesEcholocation'
  | 'hasLargeEyes'
  | 'hasLongProboscis'
  | 'hasSpinesWhenInflated'
  | 'livesWithSeaAnemone'
  | 'hasLongTail'
  | 'hasMandibles'
  | 'hasBlowhole'
  | 'hasVeryLargeBody'
  | 'hasWhiskers'
  | 'hasNarrowWaist'
  | 'hasColourfulWings'
  | 'hasCoiledProboscis'
  | 'hasStinger'
  | 'hasHairyBody'
  | 'hasTransparentWings'
  | 'hasSlenderAbdomen'
  | 'hasRoundedHardBody'
  | 'hasSlenderBody'
  | 'hasLongLegs'
  | 'hasFanShapedTail'
  | 'hasRoundedBody'
  | 'hasStreamlinedBody'
  | 'hasHorseShapedHead'
  | 'hasIndistinctPairedFins'
  | 'hasRoundBodyWhenInflated'
  | 'hasSmallBody'
  | 'hasShortBeak'
  | 'hasComb'
  | 'groundDwelling'
  | 'hasFlatBroadBeak'
  | 'hasForwardFacingEyes'
  | 'hasGraspingHands'
  | 'hasSkinMembraneWings'
  | 'jumpsOutOfWater'
  | 'hasLongSnout'
  | 'hasStrongTail'
  | 'hasStickyTongue'
  | 'hasGraspingFeet'
  | 'hasStockyBody';

export type TraitSet = Record<FeatureKey, boolean>;

export interface Animal {
  id: string;
  name: string;
  emoji: string;
  category: CategoryId;
  traits: TraitSet;
  evidence: string[];
  explanation: string;
  misconception?: string;
}

export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
  tagline: string;
  coreFeatures: string[];
  importantFeature?: string;
}

export interface QuestionDefinition {
  id: FeatureKey;
  text: string;
  category: QuestionCategory;
  featureType: FeatureType;
  score: 0 | 1 | 2;
  keywords: string[];
}

export interface AnsweredQuestion {
  questionId: FeatureKey;
  answer: boolean;
  askedText: string;
  points: number;
}

export interface GameResult {
  guessedAnimalId: string | null;
  guessedCategoryId: CategoryId | null;
  animalCorrect: boolean;
  categoryCorrect: boolean;
}

export type ViewName = 'home' | 'game' | 'result';

export interface GameState {
  view: ViewName;
  selectedLevel: LevelId;
  level: LevelId;
  secretAnimal: Animal | null;
  askedQuestionIds: FeatureKey[];
  answers: AnsweredQuestion[];
  score: number;
  activeQuestionCategory: QuestionCategory;
  isGuessing: boolean;
  isOtherQuestionOpen: boolean;
  selectedAnimalId: string | null;
  selectedCategoryId: CategoryId | null;
  inputMessage: string;
  responseText: string;
  responseMeta: string;
  result: GameResult | null;
}
