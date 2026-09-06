import type { FeatureKey, QuestionCategory, QuestionDefinition } from '../types';

export const questionCategoryLabels: Record<QuestionCategory, string> = {
  body: '身體外形',
  surface: '皮膚／身體表面',
  respiration: '呼吸方式',
  movement: '移動方式',
  reproduction: '繁殖／育幼',
  lifeHistory: '生活史',
};

export const questionCategoryEmojis: Record<QuestionCategory, string> = {
  body: '🧩',
  surface: '✨',
  respiration: '💨',
  movement: '🪽',
  reproduction: '🪺',
  lifeHistory: '🌱',
};

export const questionDefinitions: QuestionDefinition[] = [
  {
    id: 'hasFeathers',
    text: '牠有羽毛嗎？',
    category: 'body',
    score: 2,
    keywords: ['羽毛', '鳥毛'],
  },
  {
    id: 'hasHair',
    text: '牠有毛髮嗎？',
    category: 'body',
    score: 2,
    keywords: ['毛髮', '體毛', '毛'],
  },
  {
    id: 'hasThreePairsOfLegs',
    text: '牠有三對腳嗎？',
    category: 'body',
    score: 2,
    keywords: ['三對腳', '六隻腳', '六條腿', '六腳'],
  },
  {
    id: 'hasAntennae',
    text: '牠有一對觸角嗎？',
    category: 'body',
    score: 1,
    keywords: ['觸角', '觸鬚'],
  },
  {
    id: 'bodyHasHeadThoraxAbdomen',
    text: '牠的身體分為頭、胸、腹三部分嗎？',
    category: 'body',
    score: 2,
    keywords: ['頭胸腹', '頭胸腹三部分', '頭胸腹三部'],
  },
  {
    id: 'hasBeak',
    text: '牠有喙嗎？',
    category: 'body',
    score: 1,
    keywords: ['喙', '鳥嘴'],
  },
  {
    id: 'hasWings',
    text: '牠有翅膀嗎？',
    category: 'body',
    score: 1,
    keywords: ['翅膀', '翼'],
  },
  {
    id: 'hasFourLegs',
    text: '牠有四隻腳嗎？',
    category: 'body',
    score: 1,
    keywords: ['四隻腳', '四條腿', '四腳'],
  },
  {
    id: 'hasMoistSkin',
    text: '牠的皮膚濕潤嗎？',
    category: 'surface',
    score: 1,
    keywords: ['皮膚濕潤', '濕潤皮膚', '濕皮膚', '皮膚濕', '濕唔濕'],
  },
  {
    id: 'hasDrySkin',
    text: '牠的皮膚乾燥嗎？',
    category: 'surface',
    score: 2,
    keywords: ['皮膚乾燥', '乾燥皮膚', '乾皮膚', '皮膚乾', '乾唔乾'],
  },
  {
    id: 'hasHardScales',
    text: '牠身體有乾硬的鱗片嗎？',
    category: 'surface',
    score: 2,
    keywords: ['乾硬鱗片', '硬鱗片', '乾硬的鱗片'],
  },
  {
    id: 'hasScales',
    text: '牠的身體表面有鱗片嗎？',
    category: 'surface',
    score: 1,
    keywords: ['身體表面有鱗片', '身體有鱗片', '有鱗片', '鱗片'],
  },
  {
    id: 'hasShell',
    text: '牠有硬殼保護身體嗎？',
    category: 'surface',
    score: 1,
    keywords: ['硬殼', '殼保護', '有殼'],
  },
  {
    id: 'breathesWithGills',
    text: '牠用鰓呼吸嗎？',
    category: 'respiration',
    score: 2,
    keywords: ['鰓呼吸', '用鰓', '腮呼吸', '用腮'],
  },
  {
    id: 'breathesWithLungs',
    text: '牠用肺呼吸嗎？',
    category: 'respiration',
    score: 2,
    keywords: ['肺呼吸', '用肺'],
  },
  {
    id: 'breathesWithSkin',
    text: '牠可以用皮膚呼吸嗎？',
    category: 'respiration',
    score: 2,
    keywords: ['皮膚呼吸', '用皮膚'],
  },
  {
    id: 'hasFins',
    text: '牠有鰭嗎？',
    category: 'movement',
    score: 1,
    keywords: ['鰭', '魚鰭'],
  },
  {
    id: 'canSwim',
    text: '牠會游泳嗎？',
    category: 'movement',
    score: 1,
    keywords: ['游泳', '游水', '游動'],
  },
  {
    id: 'canFly',
    text: '牠會飛嗎？',
    category: 'movement',
    score: 1,
    keywords: ['會飛', '飛行'],
  },
  {
    id: 'feedsMilk',
    text: '牠會用母乳餵養幼兒嗎？',
    category: 'reproduction',
    score: 2,
    keywords: ['母乳', '哺乳', '餵奶', '餵幼兒', '餵bb', '餵baby'],
  },
  {
    id: 'laysEggs',
    text: '牠會產卵嗎？',
    category: 'reproduction',
    score: 1,
    keywords: ['產卵', '生蛋', '下蛋'],
  },
  {
    id: 'livesInWater',
    text: '牠主要生活在水中嗎？',
    category: 'lifeHistory',
    score: 1,
    keywords: ['生活在水中', '住在水中', '水中生活', '水裏生活', '生活在海中', '海裏生活'],
  },
  {
    id: 'juvenileAquatic',
    text: '牠的幼體需要在水中生活嗎？',
    category: 'lifeHistory',
    score: 2,
    keywords: ['幼體水中', '幼兒水中', '幼體在水', '小時候在水', '幼體需要在水中'],
  },
  {
    id: 'adultMostlyLand',
    text: '牠成長後主要在陸上生活嗎？',
    category: 'lifeHistory',
    score: 1,
    keywords: ['主要在陸上', '陸上生活', '成長後在陸上'],
  },
  {
    id: 'hasMetamorphosis',
    text: '牠的成長會經歷明顯的變態嗎？',
    category: 'lifeHistory',
    score: 1,
    keywords: ['變態', '成長階段不同', '幼體成體不同'],
  },
];

export const starterQuestionIds: FeatureKey[] = [
  'hasFeathers',
  'hasHair',
  'hasThreePairsOfLegs',
  'hasAntennae',
  'breathesWithGills',
  'breathesWithLungs',
  'hasMoistSkin',
  'hasDrySkin',
  'hasHardScales',
  'feedsMilk',
  'hasFins',
  'hasBeak',
  'hasWings',
];

export const questionById = Object.fromEntries(
  questionDefinitions.map((question) => [question.id, question]),
) as Record<FeatureKey, QuestionDefinition>;

const normalizeText = (value: string): string =>
  value.toLocaleLowerCase().replace(/[？?。！!，,、\s]/g, '');

export function matchQuestionText(input: string): QuestionDefinition | null {
  const normalizedInput = normalizeText(input);
  const matches = questionDefinitions
    .map((question) => ({
      question,
      longestKeyword: Math.max(
        ...question.keywords
          .map(normalizeText)
          .filter((keyword) => normalizedInput.includes(keyword))
          .map((keyword) => keyword.length),
        0,
      ),
    }))
    .filter(({ longestKeyword }) => longestKeyword > 0)
    .sort((a, b) => b.longestKeyword - a.longestKeyword);

  return matches[0]?.question ?? null;
}

export function questionIsNegated(input: string, question: QuestionDefinition): boolean {
  const normalizedInput = normalizeText(input);
  const keyword = question.keywords
    .map(normalizeText)
    .filter((candidate) => normalizedInput.includes(candidate))
    .sort((a, b) => b.length - a.length)[0];

  if (!keyword) {
    return false;
  }

  const keywordIndex = normalizedInput.indexOf(keyword);
  const beforeKeyword = normalizedInput.slice(0, keywordIndex);

  // 「有沒有羽毛」及「是不是用肺呼吸」是正面的是／不是問法，不能誤判為否定。
  return (
    /(?:^|[^有是])(?:沒有|沒|無)(?:有|用|會)?$/.test(beforeKeyword) ||
    /(?:^|[^是])不是(?:有|用|會)?$/.test(beforeKeyword) ||
    /(?:^|[^是])不(?:有|用|會)?$/.test(beforeKeyword)
  );
}
