# AcadeBee 文章草稿工作流程

> 由 William Lin 與 Claude 共同維運。每週一 / 三 / 五產出一篇草稿，經 William 審稿後發布到 `src/data/articles.js`。

## 資料夾結構

```
drafts/
├── README.md              ← 本檔
├── NEXT_TOPICS.md         ← 待寫主題清單（Claude 會自動更新）
├── 2026-04-22-xxx.md      ← 每篇草稿（檔名 = 發文日-slug）
└── published/             ← 已發布的草稿歸檔
```

## 工作流程（Plan A — 輕量版）

### 排程觸發（自動）
每週一 / 三 / 五 早上 08:00，Claude 會：
1. 讀 `NEXT_TOPICS.md` 挑一個主題
2. 在 `drafts/` 產生一個 markdown 草稿（檔名：`YYYY-MM-DD-slug.md`）
3. 草稿 frontmatter 包含：category、title、excerpt、readingTime 預估
4. 等 William 審稿

### William 審稿（手動）
1. 打開 Cowork，檢視當天的新草稿
2. 回饋方式：
   - **接受**：告訴 Claude「這篇發布」→ 會轉成 `articles.js` 的一筆資料、把 md 移到 `drafts/published/`
   - **修改**：直接編輯 md 檔、或告訴 Claude 怎麼改，Claude 會重新修稿
   - **換題目**：說「這題不要，換成 XXX」→ Claude 重新產一篇

### 發布（手動觸發）
William 確認後，Claude 會：
1. 把 markdown 內容轉成 `articles.js` 的結構（id、tableOfContents、content blocks）
2. 更新 `articles` 陣列
3. 把 md 檔移到 `drafts/published/`
4. 附上該文章在本地 dev 的預覽連結（`http://localhost:5173/articles/<id>`）

## 草稿 markdown 格式範例

```markdown
---
id: biomech-ai-xai
category: method          # method / case / industry / community
title: 為什麼你的生物力學論文審稿人總是問「你的模型可解釋嗎」
excerpt: 近三年我審過的 11 篇相關論文，這個問題出現了 7 次...
publishedAt: 2026-04-22
readingTime: 10 分鐘
featured: false
---

## 一、為什麼這個問題會一直出現

（內文開始）
```

## 主題範圍（對齊 William 的領域）

- **生物力學**：步態分析、關節負荷、運動傷害、感測器（IMU / 力板 / 肌電）
- **醫學工程**：醫材設計、臨床試驗方法、SaMD 認證、健保資料庫
- **AI 整合**：生醫資料的特徵工程、小資料下的模型選擇、XAI、臨床落地
- **跨領域方法論**：PhD 學習策略、與臨床團隊協作、投稿流程
- **社群精選**：FB 社群熱門討論、工具評測、新 paper 解讀

詳細待寫清單請見 `NEXT_TOPICS.md`。
