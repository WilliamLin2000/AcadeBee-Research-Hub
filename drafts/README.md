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

## 自動發布流程（William 2026-05-11 指定）

**目標**：William 確認文章內容後，Claude 一次完成 commit + push，Vercel 偵測到 GitHub push 自動 redeploy。

**授權方式**：William 用 Fine-grained PAT，每次新對話手動貼給 Claude（不寫入任何檔案、不進 repo）。

**PAT 規格**：
- Fine-grained Personal Access Token
- Repository access：僅 `WilliamLin2000/AcadeBee-Research-Hub`
- Permissions：Contents = Read and write；Metadata = Read（自動）
- Expiration：90 天

**Claude 收到 PAT 後的執行順序**（每次必跑）：

1. **檔案版本一致性檢查**（防 sandbox stale cache）：
   - 用 bash 跑 `wc -l src/data/articles.js`
   - 用 Read 工具讀同一個檔案的最後幾行
   - 兩邊行數 / 結尾內容**必須一致**才能繼續，不一致就停下來、請 William 手動 push
2. **配置 git**：
   - `git config user.name "William Lin"` / `user.email`（用 William 指定的 email）
   - 用 PAT 設定 remote URL：`https://x-access-token:<PAT>@github.com/WilliamLin2000/AcadeBee-Research-Hub.git`
3. **執行**：
   - `git add` 只加當次發布相關的檔案（articles.js、新封面 SVG、drafts/published/ 的新檔案、drafts/NEXT_TOPICS.md），**不要 add 不相關的 working tree 變動**
   - `git commit -m "publish: <文章 title>"`
   - `git push origin <當前 branch>`
4. **確認**：
   - 給 William GitHub commit 連結
   - Vercel 自動觸發 redeploy（無需手動操作），給 William 預期的線上文章 URL
5. **清理**：
   - Session 結束時 PAT 隨環境變數消失；Claude 不保留任何認證資訊

**如果第 1 步檢查失敗**：明確跟 William 說「sandbox 看到的版本不對，這次請手動 push」，不要硬跑 push。

---

## 每篇文章一定要附社群文案（William 2026-05-11 指定）

每次 Claude 產出新草稿（或執行發布）後，**必須附一段社群媒體發文用的短文案**，給 William 直接複製貼到 Facebook / Threads / LinkedIn 用。

文案規格：

- **Hook**：一個能讓讀者停下來的問題、反直覺數字、或痛點
- **核心數字**：1–2 個從文章來的具體量化結果（必須有 DOI 支撐）
- **價值主張**：讀者點開能拿到什麼（一句話）
- **CTA + 連結**：明確「全文連結」字樣 + 文章 URL placeholder（William 自己填）
- **Hashtag**：3–5 個，混合中英文，對齊主題（例如 #生醫工程 #IMU #AI醫療）
- **長度**：80–150 字（適合多平台），避免過長

文案放在 Claude 回覆的最後（不寫進草稿 md 檔，避免汙染版本控制）。

---

## 引用密度偏好（William 2026-05-11 指定）

- **每篇草稿只圍繞 1-2 篇最新的 peer-reviewed 研究做深入探討**，避免一次塞太多文獻
- 「最新」優先選 2024 年以後的，找不到再放寬到 2021-2023
- 文章結構：開場 → 主研究 1（量化結果 + 技術細節）→ 主研究 2（若有，互補視角）→ 對研究者的 takeaway
- 仍維持「具體數字必須有引用 + DOI」的硬性規則
- 找不到 1-2 篇可支撐主題核心論點的最新研究時，依舊照原規則 SKIP 並改建議改寫成個人觀點

## 主題範圍（對齊 William 的領域）

- **生物力學**：步態分析、關節負荷、運動傷害、感測器（IMU / 力板 / 肌電）
- **醫學工程**：醫材設計、臨床試驗方法、SaMD 認證、健保資料庫
- **AI 整合**：生醫資料的特徵工程、小資料下的模型選擇、XAI、臨床落地
- **跨領域方法論**：PhD 學習策略、與臨床團隊協作、投稿流程
- **社群精選**：FB 社群熱門討論、工具評測、新 paper 解讀

詳細待寫清單請見 `NEXT_TOPICS.md`。
