# 動物偵探王：5問破解動物身份

適合香港小學六年級科學活動的純前端動物分類遊戲。所有 AI 回答均由本地 TypeScript 規則引擎處理，不需要後端、API key、登入或付費服務。

## 本地啟動

```bash
npm install
npm run dev
```

## QA 指令

```bash
npm run lint
npm run typecheck
npm run build
```

production 檔案會輸出到 `dist/`。Vite 已設定 `base: './'`，可直接把 `dist/` 發佈到 GitHub Pages，或在 GitHub Pages 的 Actions workflow 中執行 `npm run build` 後發佈 `dist/`。

## 內容結構

- `src/data/animals.ts`：動物題庫、特徵、關鍵證據及迷思解說
- `src/data/questions.ts`：問題定義、分類、分數及 Level 3 關鍵字配對
- `src/game/`：提問、候選排除、作答判斷及計分
- `src/ui/render.ts`：首頁、遊戲頁、作答 panel 及結果頁渲染
- `public/images/animal-detective-bg.png`：森林探險背景圖
