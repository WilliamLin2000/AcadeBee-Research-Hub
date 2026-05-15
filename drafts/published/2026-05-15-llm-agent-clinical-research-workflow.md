---
id: llm-agent-clinical-research-workflow
category: community
title: Agent AI 是什麼？一份偏向技術背景的整理（不談特定應用）
excerpt: Agent AI 這個詞最近頻繁出現，但「它在技術上跟一般 LLM 差在哪、是怎麼演進到現在的、還有哪些相關新興技術正在配套發展」這幾件事，比起應用實例更值得先弄清楚。本文嘗試整理這些背景，不討論個別應用研究的結果。
publishedAt: 2026-05-15
readingTime: 10 分鐘
featured: false
sources:
  - title: "ReAct: Synergizing Reasoning and Acting in Language Models"
    url: https://arxiv.org/abs/2210.03629
    tier: primary
    note: "Yao et al., arXiv 2022/10；後於 ICLR 2023 發表（peer-reviewed conference paper）"
  - title: "Toolformer: Language Models Can Teach Themselves to Use Tools"
    url: https://arxiv.org/abs/2302.04761
    tier: primary
    note: "Schick et al., arXiv 2023/02；後於 NeurIPS 2023 發表（peer-reviewed conference paper）"
  - title: "Multi-Agent Collaboration Mechanisms: A Survey of LLMs"
    url: https://arxiv.org/abs/2501.06322
    tier: primary
    note: "Tran et al., arXiv 2025/01 preprint, 尚未同儕審查；multi-agent 系統協作機制 taxonomy"
  - title: "From LLM Reasoning to Autonomous AI Agents: A Comprehensive Review"
    url: https://arxiv.org/abs/2504.19678
    tier: primary
    note: "Ferrag et al., arXiv 2025/04 preprint, 尚未同儕審查；整理 60+ benchmarks 與 MCP / A2A / ACP 等協定"
---

## 一、寫在前面

這篇刻意不討論「某某 agent 在某某任務跑出 N% 準確率」這類應用層面的研究結果。我自己讀完幾篇近期文獻後的感覺是，**應用結果的數字目前還比較不穩定**，反倒是技術層面的概念框架、與整個演進脈絡，比較適合先看清楚——這樣讀後續的應用論文時才不容易被表面數字帶著走。

本文引用的文獻偏向 arXiv 上的技術原始論文與綜述。其中 ReAct 與 Toolformer 後續分別在 ICLR 2023 與 NeurIPS 2023 發表，屬於 peer-reviewed conference papers；Tran 2025 與 Ferrag 2025 則仍是預印本，引用時會標清楚。

> 語氣標示：以下整理偏保留，盡量避開強斷言。這個領域目前還在快速演變，半年後不少描述可能需要修正。

## 二、Agent 這個概念並不新，新的是「LLM 當 agent」這條路

在 LLM 出現之前，AI 領域早就有 agent 的概念。古典意義上，agent 大致是指「能感知環境、能對環境採取行動、並且某種程度上是自主的系統」。強化學習裡的 agent、機器人控制裡的 agent，都是這個傳統。

那為什麼最近才又被熱烈討論？變化的不是 agent 這個概念本身，而是**作為「決策核心」的那個元件**從規則系統 / RL policy 變成了 LLM。這個轉變的關鍵時間點大致落在 2022 年——ReAct 那篇論文示範了 LLM 不只能生成「推理 traces」，還能交錯生成「行動指令」並跟外部環境互動 [ref: arXiv:2210.03629]，這讓 LLM 開始具備扮演 agent 的條件。

換句話說，目前社群討論的 agent AI 大致可以理解為：**以 LLM 為決策核心、能呼叫外部工具、能執行多步任務的系統**，而不是一個全新的範式。它跟古典 agent 的差別主要在「決策核心的彈性」，不在「agent 這個架構本身」。

## 三、把 LLM 變成 agent，技術上大致有哪些元件

社群文獻在描述 agent 系統時，常用一組類似的元件式分類——大致包含「規劃、行動、反思、記憶」四個面向。這個分類在 2024–2025 年多篇綜述裡反覆出現，雖然各家的細節定義略有差異，但骨幹相近 [ref: arXiv:2501.06322 preprint, 尚未同儕審查; arXiv:2504.19678 preprint, 尚未同儕審查]：

**1. Planning（規劃）**
讓 LLM 在執行前先把任務拆解成步驟。常見做法包括 chain-of-thought 與 tree-of-thought。實務上常見的問題是 plan 過於樂觀、執行時卡住——這也是後來「反思」機制被加入的主因。

**2. Action（行動）**
讓 LLM 能對外部世界做事：呼叫 API、執行程式碼、查資料庫、控制瀏覽器或控制機器人。這層的關鍵技術可以追溯到兩條早期主線——其一是 2022 年由 Yao 等人提出的 **ReAct**，把「推理 traces」與「行動指令」交錯生成，讓 LLM 能在過程中跟外部來源（如 Wikipedia API）互動 [ref: arXiv:2210.03629]；其二是 2023 年初 Meta 團隊的 **Toolformer**，用 self-supervised 方式讓模型學會「該叫哪個 API、何時叫、傳什麼參數」 [ref: arXiv:2302.04761]。這兩篇是後來「tool calling」生態的源頭之一。

**3. Reflection（反思）**
讓 agent 看到行動結果之後，能評估自己做得好不好、需不需要修正。這是相對晚近被認真討論的元件，社群裡常見的設計包括 self-critique、Reflexion 等。Tran 等人 2025 年的 multi-agent 綜述把「反思 / 自我評估」列為協作機制裡的關鍵維度之一 [ref: arXiv:2501.06322 preprint, 尚未同儕審查]。

**4. Memory（記憶）**
LLM 本身的 context window 有限，agent 要在較長的工作流裡維持一致性，需要某種記憶機制。常見實作包括 vector store、結構化的對話歷史摘要、或是外掛 episodic memory（這部分多數綜述都有提及，但具體實作分類各家略有不同 [待補引用]）。

需要保留的一個觀察：**這四元件不是嚴格分割的工程模組**，現實中常常彼此交織。它比較像是分析 agent 系統時的一個 checklist，而不是建造 agent 時非要照著做的藍圖。

## 四、演進脈絡：從 tool use 到多 agent 協作

以下時間軸主要整理自 Ferrag 等人 2025 年那份比較完整的 LLM agent comprehensive review [ref: arXiv:2504.19678 preprint, 尚未同儕審查]，搭配兩篇技術原始論文。各文獻的分期劃法略有差異，這裡採取折衷：

- **～2022**：以 LLM 直接回答為主，沒有「執行」這個層次。
- **2022 末 –2023**：tool use 概念出現。代表性技術論文包括 ReAct（Yao et al., arXiv 2022/10，後於 ICLR 2023）[ref: arXiv:2210.03629] 與 Toolformer（Schick et al., arXiv 2023/02，後於 NeurIPS 2023）[ref: arXiv:2302.04761]，分別代表 prompting-based 與 fine-tuning-based 兩條設計路線。
- **2023–2024**：多 agent 框架湧現，例如讓多個 LLM 扮演不同角色協作。Tran 等人 2025 的綜述把這段時期的 multi-agent 系統依「actors / types / structures / strategies / coordination protocols」整理成五維度的 taxonomy [ref: arXiv:2501.06322 preprint, 尚未同儕審查]。
- **2024–2025**：planning–action–reflection–memory 的框架式描述開始穩定，agent 系統設計從單一 LLM 包工具，走向多 agent 協作與更明確的角色分工。
- **2025–2026**：論文層次開始討論協作協定（MCP、A2A、ACP）的標準化，以及 agent 行為的安全性、評估方法等議題 [ref: arXiv:2504.19678 preprint, 尚未同儕審查]。

這條時間軸大致可以看出一個趨勢：**從「讓 LLM 會用工具」走向「讓 agent 系統可被理解、被信任，並且能彼此溝通」**。

## 五、跟 agent AI 一起浮上來的相關新興技術

agent AI 不是孤立的方向。同期還有幾條技術線在演進，彼此互相影響：

- **Retrieval-Augmented Generation（RAG）**：給 LLM 接外部知識庫的標準做法之一。從 agent 的角度看，retrieval 通常被視為 action 元件下的一個特例。
- **Agent 通訊與工具協定（MCP、A2A、ACP）**：當 agent 需要彼此溝通、或大量呼叫外部工具時，「介面要不要標準化」就變成一個問題。Ferrag 等人 2025 年的綜述把 **Model Context Protocol（MCP）**、**Agent-to-Agent Protocol（A2A）** 與 **Agent Communication Protocol（ACP）** 視為這條線上的代表性協定 [ref: arXiv:2504.19678 preprint, 尚未同儕審查]。需要留意的是，這類協定還很新，安全性議題（例如 prompt injection、tool poisoning）仍在被探討中 [待補引用]。
- **Test-time reasoning / 推理模型**：近一年來的另一條主線。讓模型在推理階段花更多時間「想」（更長的 chain-of-thought、search、self-verification），與 agent 框架結合後可以增強 planning 與 reflection 能力。這條線的具體文獻分歧較大，[待補引用]。
- **Computer use / browser agent**：讓 agent 直接操作圖形介面或瀏覽器。這條線目前仍偏實驗性，外推到醫療場景的速度比較慢。
- **Multi-modal agent**：能處理影像、訊號、結構化資料的 agent。目前的多模態整合多半還是延伸自 vision-language model（VLM）的設計思路，[待補引用]。

這些技術之間的關係，比較像是「相互配套」而不是「彼此競爭」。對研究者而言，比較合理的理解或許是：**agent 是一個整合框架，這些相關技術則是配料**——少了任何一樣，整道菜的層次都會打折。

## 六、目前還在演變、不適合下定論的部分

最後想留幾個我自己暫時不會下結論的問題：

1. **「agent」這個詞的定義還沒收斂**。同一篇文獻裡，「agent」「agentic system」「agentic workflow」「multi-agent」常常混用。讀文獻時要花一點力氣對齊作者用的版本。
2. **評估方法還沒標準化**。不同論文用不同 benchmark、不同 baseline，數字之間不太能直接比較；Ferrag 等人 2025 的綜述把這點列為當前 agent 研究的主要痛點之一 [ref: arXiv:2504.19678 preprint, 尚未同儕審查]。
3. **生醫工程 / 生物力學領域目前的能見度還低**。目前文獻討論的 agent 應用大多落在影像、文字、code 等場景。**步態分析、生物力學模擬、感測器訊號的 agent 化** 還沒有看到代表性的綜述整理 [待補引用]。

寫到這裡，比較負責任的結論大概是：**agent AI 是一個值得花時間理解的方向，但目前還在「概念在收斂、技術在配套、評估在標準化」的早期階段**。把它當成一條長期觀察軸線，比把它當成「下一個一定要追的工具」更合適。

---

**參考文獻**

[1] Yao S, Zhao J, Yu D, et al. ReAct: Synergizing Reasoning and Acting in Language Models. *arXiv preprint*, 2022. arXiv:[2210.03629](https://arxiv.org/abs/2210.03629)（後於 ICLR 2023 發表，peer-reviewed conference paper）

[2] Schick T, Dwivedi-Yu J, Dessì R, et al. Toolformer: Language Models Can Teach Themselves to Use Tools. *arXiv preprint*, 2023. arXiv:[2302.04761](https://arxiv.org/abs/2302.04761)（後於 NeurIPS 2023 發表，peer-reviewed conference paper）

[3] Tran KT, Dao D, Nguyen MD, et al. Multi-Agent Collaboration Mechanisms: A Survey of LLMs. *arXiv preprint*, 2025. arXiv:[2501.06322](https://arxiv.org/abs/2501.06322)（**preprint, 尚未同儕審查**）

[4] Ferrag MA, Tihanyi N, Debbah M. From LLM Reasoning to Autonomous AI Agents: A Comprehensive Review. *arXiv preprint*, 2025. arXiv:[2504.19678](https://arxiv.org/abs/2504.19678)（**preprint, 尚未同儕審查**；整理 60+ benchmarks 與 MCP / A2A / ACP 等協定）
