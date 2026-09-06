import type { CategoryDefinition } from '../types';

export const categoryDefinitions: CategoryDefinition[] = [
  {
    id: 'insect',
    label: '昆蟲類',
    emoji: '🐞',
    color: 'green',
    tagline: '小小身體，大大線索',
    coreFeatures: ['三對腳', '頭、胸、腹', '一對觸角'],
  },
  {
    id: 'fish',
    label: '魚類',
    emoji: '🐟',
    color: 'blue',
    tagline: '水中的游泳專家',
    coreFeatures: ['用鰓呼吸', '有鰭', '皮膚濕潤'],
  },
  {
    id: 'bird',
    label: '鳥類',
    emoji: '🦉',
    color: 'yellow',
    tagline: '羽毛是重要證據',
    coreFeatures: ['全身羽毛', '有喙', '用肺呼吸'],
  },
  {
    id: 'mammal',
    label: '哺乳類',
    emoji: '🦇',
    color: 'pink',
    tagline: '別忘了育幼線索',
    coreFeatures: ['有毛髮', '母乳餵幼兒', '用肺呼吸'],
    importantFeature: '母乳餵養幼兒是非常重要的判斷特徵',
  },
  {
    id: 'reptile',
    label: '爬行類',
    emoji: '🐢',
    color: 'purple',
    tagline: '乾燥鱗片很關鍵',
    coreFeatures: ['皮膚乾燥', '乾硬鱗片', '用肺呼吸'],
  },
  {
    id: 'amphibian',
    label: '兩棲類',
    emoji: '🐸',
    color: 'teal',
    tagline: '一生有不同階段',
    coreFeatures: ['皮膚濕潤', '幼體水中生活', '肺和皮膚呼吸'],
  },
];

export const categoryById = Object.fromEntries(
  categoryDefinitions.map((category) => [category.id, category]),
) as Record<CategoryDefinition['id'], CategoryDefinition>;
