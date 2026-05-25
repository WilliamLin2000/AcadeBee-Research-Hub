---
id: agent-harness-engineering
category: community
title: Harness engineering 是什麼：兩篇 2026 上半年 arXiv 的「LLM 外殼工程」拆解，給生醫研究者的借鏡
excerpt: 「harness」這個詞從工程部落格滲進學術論文：stateless 的 LLM 怎麼被一層 orchestration 包成可以跑長任務的 agent，這層東西就叫 harness。文章先從零開始拆解 harness 的元件與它跟 prompt / context engineering 的差異，再進到兩篇 2026 上半年 arXiv preprint：一篇講靜態結構（OPENDEV），一篇講自動演化（AHE），最後談這套思維對生醫研究 pipeline 的借鏡。
publishedAt: 2026-05-25
readingTime: 16 分鐘
featured: false
sources:
  - title: "Building Effective AI Coding Agents for the Terminal: Scaffolding, Harness, Context Engineering, and Lessons Learned"
    url: https://arxiv.org/abs/2603.05344
    tier: primary
    note: "arXiv preprint, 尚未同儕審查；作者 Nghi D. Q. Bui"
  - title: "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses"
    url: https://arxiv.org/abs/2604.25850
    tier: primary
    note: "arXiv preprint, 尚未同儕審查"
---

## 一、為什麼這個月要聊「harness engineering」這個詞

過去一年「harness」這個詞，從工程部落格慢慢滲到 arXiv 論文裡，但中文社群對它的定義還挺鬆散：有人翻成「框架」、有人翻成「外殼」、有人乾脆不翻。對在做 AI × 生醫的研究者來說，這不只是 SWE 圈內的詞彙問題，你做自動化實驗 pipeline、跑文獻回顧 agent、設計多步驟資料前處理流程，**寫的其實就是 harness**，只是沒人這樣叫。

本月（2026 年 5 月）挑兩篇放在一起讀：一篇從 OPENDEV 這個 CLI coding agent 出發，把 harness 的靜態結構畫出來；另一篇直接把「harness engineering 本身」變成研究對象，問：harness 能不能自動演化？兩篇都是 preprint，**尚未經過同儕審查**，下面所有引用數字都附原文連結。

不過在進入論文細節前，先把 harness 這個詞本身講清楚，因為很多人讀完論文還是分不清楚 harness、framework、agent 三者差在哪裡。

## 二、Harness engineering 是什麼：從零開始的基礎介紹

### 2.1 名詞起源：從「test harness」借過來的概念

在軟體工程裡，「harness」原本指 **test harness**：包在被測程式外面的那一層腳手架，負責準備輸入、呼叫待測函式、檢查輸出、產生報告。換句話說，**被測程式本身不會自己跑、自己驗證；harness 就是讓它能跑起來、能被觀察的那層外殼**。

把這個比喻搬到 LLM 上幾乎是 1:1 對應：一次 `chat.completions.create()` API 呼叫，就只是「丟一段文字進去、拿一段文字出來」，是純函式。它不會自己呼叫 PubMed API、不會記得三十秒前的對話、不會在算錯時重試、更不會自動把長對話壓縮成摘要。**所有讓 LLM「看起來像 agent」的能力，都是外面那層 harness 給的**。

社群早期還有另一個相近詞「lm-evaluation-harness」（EleutherAI 開源的 LLM 評測框架，後來被 HuggingFace 的 Open LLM Leaderboard 採用），那個 harness 是「評測框架」意義上的；現在學術論文裡講的 agent harness，則是「執行框架」意義上的。兩者共用比喻來源，但解決的問題不一樣。

### 2.2 為什麼 LLM 必須有 harness：四個 stateless 帶來的問題

LLM 本身是 stateless function。直接拿它去做任何「長一點、複雜一點」的任務，會立刻撞到四面牆：

第一，**沒有記憶**。同一個對話裡你想讓它記得「我剛才已經查過 PubMed」，得自己把對話歷史塞回 prompt。

第二，**沒有工具**。模型本身只會吐文字，無法真的去 query 資料庫、跑程式、讀檔案，這些動作要由外面的 harness 解析模型輸出（例如 function call 格式）、實際執行、把結果再餵回去。

第三，**沒有重試 / 自我修正**。模型算錯一步就會繼續錯下去，除非 harness 在每一步加上驗證、發現錯誤時觸發重新生成。

第四，**context window 有上限**。一個跑十幾步的任務，原始對話歷史很快就會炸掉 context；harness 要負責壓縮舊訊息、保留關鍵狀態、決定哪些東西該被丟掉。

Harness engineering 就是**系統性地解這四個問題**的工程實踐。

### 2.3 一個 harness 內部典型有哪幾塊

不同團隊的 harness 設計細節不同，但拆解一下，幾乎都會涵蓋以下幾類模組（用 Paper A 對 harness 的工程定義為基準 [ref: arXiv:2603.05344]）：

| 模組 | 它做什麼 | 在生醫研究類比 |
|---|---|---|
| Control loop（控制迴圈） | 決定「下一步要不要再呼叫一次 LLM、要不要 call tool、要不要結束」 | 像實驗 SOP 的主流程：每個受試者跑完一輪後決定要不要進下一輪 |
| Tool registry & dispatcher | 維護可用工具清單、解析模型的 tool call、實際執行並回傳結果 | 像實驗室裡的儀器登記簿：什麼設備可以用、由誰啟動、結果寫到哪 |
| Context manager | 壓縮 / 修剪舊對話，控制 token budget | 像論文寫作時的「精簡 method 描述」：保留必要、丟掉冗餘 |
| Memory（短期 + 長期） | 跨對話記住先前結論、使用者偏好 | 像 lab notebook：今天的進度寫進去，明天可以查 |
| System prompt + role | 設定模型的身份、規則、行為邊界 | 像實驗倫理規範：限定模型不能做什麼 |
| Verification / self-critique | 在執行前後檢查輸出合理性 | 像 peer review：在送出前自己先 check 一輪 |
| Observability / logging | 把每一步 trace 下來，讓人 debug | 像 raw data 與 metadata 紀錄：之後才能歸因 |

注意：上表的「生醫類比」是為了讓研究者建立直覺，不是論文裡的對應；如果寫進自己的論文，建議只引用左兩欄。

### 2.4 Harness vs. Prompt engineering vs. Context engineering vs. Framework

這四個詞最常被混用，但其實是不同抽象層的東西：

- **Prompt engineering** 處理的是「單次 LLM call 該怎麼寫」：寫得清楚、給範例、定格式。範圍最小。
- **Context engineering** 處理的是「這一次 LLM call 該看到哪些上下文」：要 retrieve 哪些文件、塞多少歷史、放哪些 tool 描述進去。比 prompt engineering 大一層。
- **Harness engineering** 處理的是「整個多步驟系統的結構」：控制迴圈、工具呼叫、狀態管理、驗證、記憶。Context engineering 是 harness 的其中一個子問題 [ref: arXiv:2603.05344]。
- **Framework**（如 LangChain、LlamaIndex、AutoGen）是別人已經幫你寫好的 harness 模板。你選一個 framework，就是選某個 harness 設計者的偏好。

用一張概念上的同心圓來理解就是：**prompt ⊂ context ⊂ harness ⊂ framework（其實 framework 是 harness 的封裝版本）**。

研究者常見的誤區是把問題定位錯：以為自己在做 prompt engineering（調 prompt 文字），其實真正瓶頸在 context engineering（沒給對資料）；或以為自己在做 context engineering，其實瓶頸是 harness 設計（控制迴圈一開始就不該讓模型走那條路）。

掌握這個層次圖，再回頭看下面兩篇論文會清楚很多。

## 三、Paper A：把 OPENDEV 拆開看，「harness」到底由哪幾層組成

第一篇是 arXiv:2603.05344，題目〈Building Effective AI Coding Agents for the Terminal: Scaffolding, Harness, Context Engineering, and Lessons Learned〉，作者 Nghi D. Q. Bui，2026 年 3 月上線。他們發表了一個用 Rust 寫的開源終端 coding agent，名為 **OPENDEV** [ref: arXiv:2603.05344]。

這篇論文最有價值的地方不是 OPENDEV 本身有多強，而是**它幫「harness」下了個清楚的工程定義**：

> Agent harness 是把 stateless 的 LLM 變成 persistent、tool-using、self-correcting 的那一層 orchestration 基礎建設；中心是 ReAct 執行迴圈，外圍是餵養它、約束它、持久化其工作的子系統 [ref: arXiv:2603.05344]。

這句話之所以重要：它把「prompt engineering」「context engineering」「tool design」「state management」全部放進同一個概念傘下面。對研究者來說，這層東西過去常常分散在各人各 repo 裡、沒有統一名稱。

具體拆解，OPENDEV 的中心 ReAct 迴圈含 **六個 phase**：pre-check + compaction、thinking、self-critique、action、tool execution、post-processing，迴圈外圍又有 **七個支援子系統** [ref: arXiv:2603.05344]。這個「6 + 7」的數字本身只是 OPENDEV 的設計選擇，但它示範了一件事：一個能跑長任務的 agent，內部其實有十幾個可調參數的子系統，每一個都會牽動最終行為。

論文進一步描述 OPENDEV 採用的幾個關鍵設計：**workload-specialized model routing**（依任務種類路由到不同模型）、**dual-agent architecture**（規劃 agent 與執行 agent 分離）、**lazy tool discovery**（不一次塞所有工具給模型）、以及 **adaptive context compaction**（隨對話進行漸進壓縮舊觀察） [ref: arXiv:2603.05344]。

把這套對到生醫研究者熟悉的場景：如果你今天要做一個「自動讀 30 篇 paper 然後寫 systematic review draft」的 agent，這四個設計每一個都對應你會踩到的坑，包括不同階段該不該用不同模型、要不要把規劃跟下手寫的工作切開、是否要等到真的需要 PubMed query 時才把那個工具描述塞進 context、長對話下要怎麼壓縮舊文獻摘要。**Harness 的設計選擇，直接決定你的 agent 在第 20 篇 paper 之後會不會崩。**

## 四、Paper B：當 harness 多到調不動，能不能讓 harness 自己長大

第二篇 arXiv:2604.25850，題目〈Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses〉。它正面回答 Paper A 留下的問題：既然 harness 有十幾個可調子系統，**靠人手調 trial-and-error 是不是已經到天花板了？**

作者提出 **AHE（Agentic Harness Engineering）**，把 harness 本身當成可演化的對象。他們設計了一個 closed loop，靠三根「observability 支柱」來解決自動調 harness 的三個難題 [ref: arXiv:2604.25850]：

- **Component observability**：每個可編輯的 harness 元件都對應到 file-level 表示，讓「能改什麼」變成明確、可撤銷的動作空間 [ref: arXiv:2604.25850]。
- **Experience observability**：把上百萬 token 的 raw trajectory 蒸餾成「分層、可下鑽的 evidence corpus」，讓正在演化中的 agent 能真的消化 [ref: arXiv:2604.25850]。
- **Decision observability**：每一次編輯都搭配一個自我聲明的預測，下一輪 task 跑完後用實際結果驗證 [ref: arXiv:2604.25850]。

論文的核心量化結果是這條：**固定 base model，只演化 harness 元件（system prompts、tool descriptions、tool implementations、middleware、skills、sub-agents、long-term memory），10 個 AHE 迭代下來，Terminal-Bench 2 的 pass@1 從 69.7% 推到 77.0%，超過人類手調的 Codex-CLI（71.9%），也勝過自演化 baseline ACE 與 TF-GRPO** [ref: arXiv:2604.25850]。

這篇的意義不只在於這條數字，而在於**它把「harness 設計」從手藝變成可量化、可自動最佳化的工程對象**。對學術圈來說這比較像研究 paradigm 的轉換：以前是「我手調出一個好 prompt」，現在是「我設計一個能讓 harness 自己變好的 meta loop」。

## 五、給生醫 / AI 研究者的三個 takeaway

**第一，停止把 prompt 跟 tool 跟 memory 當成三件事看。** Paper A 的最大貢獻是把這層東西統合成 harness 這個概念 [ref: arXiv:2603.05344]。當你下次設計一個「跑生醫文獻回顧」「跑 IMU 資料前處理 pipeline」「跑統計分析報告」的 agent 時，請把 prompt + 工具集 + memory + 中介層當作**單一可調的系統**，而不是各做各的。這會直接影響你 debug 時知道該動哪裡。

**第二，先有 observability，再談自動化。** Paper B 的三根支柱其實對所有「想自動化某個複雜流程」的研究者都成立：你必須先能看見每個元件的當前狀態（component）、把過程的 raw log 蒸餾成能讀的證據（experience）、並把每次修改和結果連起來（decision），**然後才有資格談自動演化** [ref: arXiv:2604.25850]。很多人在做 AutoML / 自動化實驗時跳過前兩步直接做第三步，這也是為什麼結果常常難以歸因。

**第三，生醫場域的 harness 設計，限制條件跟 coding agent 不一樣。** 這兩篇都圍繞 coding 任務跑（Terminal-Bench 2、SWE-bench），跟生醫研究情境最大差別在：(a) 我們的 ground truth 常常不是 binary pass/fail，而是統計顯著 / 臨床有意義；(b) 我們的 evaluation 一輪可能要好幾天而非幾分鐘，AHE 那種 10-iteration loop 在生醫場景成本會放大幾個數量級。所以**直接套用 AHE 結論到生醫 agent 上是冒險的**，但「把 harness 變成研究對象」這個 paradigm 值得借鏡。

下個月 community 想跟的方向：harness engineering 在非 coding 任務的應用（例如科學發現 agent、臨床 workflow agent），以及 observability 工具鏈是否會出現生醫專用的 fork。如果讀者手上有相關 case，歡迎在社群留言。

---

> **資料來源說明**
> 兩篇 arXiv preprint **尚未經過同儕審查**，引用時建議標註版本（如 arXiv:2603.05344v2、arXiv:2604.25850v3）。本文未引用任何 supplementary 來源，所有數字皆來自上述兩篇 Primary preprint。
