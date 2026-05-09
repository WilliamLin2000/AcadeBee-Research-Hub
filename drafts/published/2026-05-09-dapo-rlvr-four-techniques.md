---
id: dapo-rlvr-four-techniques
category: community
title: "DAPO 拆解：填補 DeepSeek-R1 技術黑盒的四個關鍵設計"
excerpt: DeepSeek-R1 一月發布後讓整個社群瘋狂嘗試復現，卻發現核心訓練細節幾乎是黑盒。三月，ByteDance 丟出 DAPO——全名 Decoupled Clip and Dynamic sAmpling Policy Optimization——用四項技術說清楚「大規模 RLVR 要怎麼做才會穩定」，Qwen2.5-32B 跑出 AIME 2024 的 50 分。這篇把這四項技術逐一拆開，說清楚它們各自對應 GRPO 的哪個問題、設計直覺是什麼。
publishedAt: 2026-05-09
readingTime: 14 分鐘
featured: false
sources:
  - title: "Yu Q, et al. DAPO: An Open-Source LLM Reinforcement Learning System at Scale. arXiv:2503.14476. 2025."
    url: https://arxiv.org/abs/2503.14476
    tier: primary
    note: "preprint，尚未同儕審查；HuggingFace Papers 146 upvotes（截至 2026-05）"
  - title: "DeepSeek-AI. DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning. arXiv:2501.12948. 2025."
    url: https://arxiv.org/abs/2501.12948
    tier: primary
    note: "preprint，尚未同儕審查；HuggingFace Papers 449 upvotes；背景脈絡來源"
  - title: "Liu Z, et al. Understanding R1-Zero-Like Training: A Critical Perspective. arXiv:2503.20783. 2025."
    url: https://arxiv.org/abs/2503.20783
    tier: primary
    note: "preprint，尚未同儕審查；Dr. GRPO；GRPO 長度偏差的實證分析"
  - title: "Simoni M, et al. GTPO: Trajectory-Based Policy Optimization in Large Language Models. arXiv:2508.03772. 2025."
    url: https://arxiv.org/abs/2508.03772
    tier: primary
    note: "preprint，尚未同儕審查；衝突 token 分析補充背景"
  - title: "Xi Z, et al. BAPO: Stabilizing Off-Policy Reinforcement Learning for LLMs via Balanced Policy Optimization with Adaptive Clipping. arXiv:2510.18927. 2025."
    url: https://arxiv.org/abs/2510.18927
    tier: primary
    note: "preprint，尚未同儕審查；HuggingFace Papers 85 upvotes；entropy collapse 補充脈絡"
---

> **讀前說明**：本文所有技術描述以 DAPO 論文 arXiv:2503.14476 為 primary 來源（preprint，尚未同儕審查）。部分 GRPO 演算法細節為社群廣為引用的通識背景知識。標有 `[待補引用]` 的細節為目前尚未有 primary 文件明確記載、但對技術理解有幫助的說明，William 審稿時請自行決定是否保留。

---

## 一、為什麼 DAPO 值得讀

2025 年一月，DeepSeek-AI 發布 DeepSeek-R1 [ref: arXiv:2501.12948]。

論文宣稱：只靠大規模強化學習（RL），不用 Supervised Fine-Tuning（SFT）作為前置步驟，模型就能**自然湧現**出長鏈推理、自我反省、「啊哈時刻」等行為，最終在數學推理任務上達到與 OpenAI o1-1217 相當的水準。這個結果震驚了整個 AI 社群，也引發了一波復現潮。

問題來了：論文發布的時候，訓練細節幾乎是黑盒。

- 用什麼 clip 係數？
- 怎麼處理「全部答對」或「全部答錯」的 batch？
- 怎麼防止模型在訓練過程中輸出越來越長的廢話（length hacking）？
- 怎麼防止策略分佈在幾千步之後 entropy 崩潰？

這些問題，DeepSeek-R1 技術報告沒有完整說清楚。社群花了兩個月試圖填補這個空白，大多數人的復現結果都差得遠。

**三月，ByteDance 發表 DAPO** [ref: arXiv:2503.14476]。

DAPO 的目標很明確：不是做一個新的大模型，而是做一個**可以被完整復現的 RLVR 訓練系統**，解釋清楚大規模 LLM 強化學習為什麼能成功——並且把程式碼、訓練框架（verl）、資料集全部開源。

結果：**Qwen2.5-32B base model，在 AIME 2024 上跑出 50 分**。在當時的開源系統中是頂尖水準 [ref: arXiv:2503.14476]。

論文提出四項核心技術，每一項都對應 GRPO 一個已知的失效模式。以下逐一拆開來看。

---

## 二、GRPO 複習：DAPO 繼承的起點

在進入四項技術之前，先確認 GRPO（Group Relative Policy Optimization）的基本架構，因為 DAPO 是在它上面修改的。

GRPO 的運作邏輯是這樣的：

1. 對每個 prompt，從當前模型 π_θ 採樣 G 條完整回應（例如 G = 8）
2. 用一個驗證器（verifiable reward，例如數學解題答案是否正確）對每條回應給 0 或 1 的 reward
3. 計算這 G 條回應的「群組相對優勢」（Group-Relative Advantage）：把每條回應的 reward 減去群組均值，再除以群組標準差，作為 advantage 估計
4. 用 PPO 風格的 clipped surrogate objective 更新模型——簡單來說，**鼓勵模型增加高 advantage 回應的機率，降低低 advantage 回應的機率，但不能走太遠**（clip 機制）

GRPO 的優雅之處是：不需要訓一個獨立的 value/critic network（PPO 要），訓練比較穩定，適合規模化。DeepSeek-R1-Zero 就是基於這個架構 [ref: arXiv:2501.12948]。

但 GRPO 在大規模 RLVR 訓練中有幾個已知問題：

- **Entropy 崩潰**：訓練到一定程度，模型對某些 token 的輸出機率過於集中，停止探索，訓練效益急劇下降
- **Response length 膨脹**：模型學到「寫更長的回應更可能踩到正確答案的 token」，開始無意義延長輸出，尤其對錯誤回應更明顯 [ref: arXiv:2503.20783, Dr. GRPO 的分析]
- **全對 / 全錯 batch 浪費計算資源**：如果 G 條回應全部答對或全部答錯，群組優勢等於零（分母方差趨近零），這批資料完全沒有梯度訊號
- **Clip 機制的不對稱問題**：PPO 的對稱 clip 在正向 advantage 和負向 advantage 上施加相同的約束，但這對訓練動態不見得最佳（下面細講）

DAPO 的四項技術，每一項對應其中一個問題。

---

## 三、技術一：Clip-Higher（非對稱 Clip）

**對應問題**：標準 PPO clip 機制限制了模型在「好回應」上的學習速率。

### 標準 clip 的邏輯

PPO 的 clipped surrogate objective 把概率比值 r(θ) = π_θ(a) / π_old(a) 限制在 [1 − ε, 1 + ε] 之間（ε 通常設為 0.2）。

背後的直覺是：防止策略更新步伐過大，確保新舊策略不要偏離太遠（trust region 概念）。

### 問題在哪裡

想象一條高 advantage 的好回應（模型做對了，reward = 1）。我們希望模型**大幅提高**這條回應的機率。

但對稱 clip 的 [1 − ε, 1 + ε] 同等地限制了「機率增加的上限」和「機率降低的下限」。

對高 advantage 的回應，clip 上限 (1 + ε) 經常被觸及——也就是說，梯度被截斷了，模型**想學但被 clip 擋住**。

對低 advantage 的負回應，clip 下限同樣被觸及——機率下降的速度也被限制了。

DAPO 提出的想法是：**正向和負向的更新不應該對稱地被 clip**。

### DAPO 的解法：Clip-Higher

DAPO 引入了**非對稱 clip**：

- **低端 clip**（clip_low）：保持與 PPO 相同，防止模型在負向更新時走太遠，維持 on-policy 穩定性
- **高端 clip**（clip_high）：**放寬上限**，允許模型在正向 advantage 回應上更積極地增加機率

這樣，對「好回應」，模型可以學得更快；對「壞回應」，仍保有保守性。

這個設計背後的哲學是：**探索（向好回應移動）應該比保守（離壞回應）更自由一點**。在 RLVR 訓練的早中期，加快對正確推理模式的強化，對最終的推理能力提升有顯著幫助 [ref: arXiv:2503.14476，具體 clip 數值參見原論文 Table 1] `[待補引用：確切 ε_low 與 ε_high 數值]`。

---

## 四、技術二：Dynamic Sampling（動態採樣過濾）

**對應問題**：全對 / 全錯的 batch 沒有學習訊號，浪費計算資源。

### 問題重述

在 GRPO 的框架裡，advantage 是群組相對值。如果 G 條回應的 reward 完全相同（全 0 或全 1），那麼所有回應的 advantage 都是 0（或分母的方差趨近於 0，數值不穩定）。

這有兩種情況：

- **prompt 太難**：模型現在完全不會做，G 條都答錯，沒有正向訊號可學
- **prompt 太簡單**：模型已經完全掌握，G 條都答對，沒有訊號告訴它改進什麼

這兩種 prompt 都是在「浪費」這個 batch 的計算。

### DAPO 的解法

**在每個訓練步驟動態過濾這類 prompt**。

具體做法是：在採樣 G 條回應後，計算這個 prompt 的 reward 分佈。如果所有回應 reward 相同，直接跳過這個 prompt，不計入梯度更新。

同時，DAPO 從更大的 prompt 候選集裡補充新的「有效 prompt」，確保每個訓練步驟的有效 batch size 維持在目標大小。

這個設計的好處：

- **每個 gradient step 都對應有信號的資料**，訓練更有效率
- **隱式地執行課程學習**：訓練初期「太難」的 prompt 被過濾，隨著模型能力提升，這些 prompt 逐漸變成有效訊號來源
- **數值穩定性提升**：消除了 advantage 分母接近零的邊界情況

Liu 等人（Understanding R1-Zero）的分析也指出，適當控制 prompt 難度分佈（query difficulty control）對訓練動態有顯著影響 [ref: arXiv:2503.20783]。Dynamic Sampling 在機制上達成了類似的效果。

---

## 五、技術三：Token-Level Policy Gradient Loss

**對應問題**：Sequence-level 的 loss 歸一化方式引入隱性的長度偏差。

### 為什麼這很重要

GRPO 的 loss 計算方式，是把一條回應裡所有 token 的 log-prob loss 加總後，除以這條回應的 token 數（sequence-level 歸一化）。

看起來人畜無害——但這製造了一個問題：

**相同的 reward，短回應的每個 token 得到更強的梯度訊號，長回應的每個 token 得到更弱的訊號。**

在 RLVR 設置下（0/1 reward），這個不均衡會被放大：

- 短的正確回應 → reward = 1 → 每個 token 的梯度很強 → 模型快速學會這個模式
- 長的錯誤回應 → reward = 0（或 −1）→ 每個 token 的懲罰梯度很弱 → 模型沒有強烈誘因縮短錯誤回應

結果：**模型在訓練中逐漸傾向於對錯誤回應產生更長的輸出**，因為這樣每個 token 的懲罰更小。這正是 Liu 等人（Understanding R1-Zero，Dr. GRPO）用實驗量化的 GRPO 長度偏差現象 [ref: arXiv:2503.20783]。

### DAPO 的解法

改用 **Token-Level Policy Gradient Loss**：

把整個 batch 的 loss 計算從「每條 sequence 歸一化後求和」改成「對所有 token 平等對待」——或者說，用 token 數而非 sequence 數作為歸一化分母。

這樣，不管回應有多長，每個 token 的梯度貢獻量是可比較的，長度偏差被消除。

從工程實作角度看，這個修改很小（幾行 code），但對訓練穩定性和最終效果的影響是可觀的 [ref: arXiv:2503.14476]。

---

## 六、技術四：Entropy Bonus + Overlong Reward Shaping

**對應問題**：entropy 崩潰 + length hacking。

### Entropy 崩潰是什麼

在 RLVR 訓練的中後期，一個常見的失效模式是：模型的輸出分佈變得越來越尖銳（entropy 持續下降），最終某些 token 的輸出機率接近 1，模型停止探索其他可能的推理路徑。

Xi 等人（BAPO）在理論上說明，固定 clip 機制在 off-policy 設置下會系統性地**阻止 entropy 上升的更新**，把策略推向過度利用（over-exploitation）[ref: arXiv:2510.18927]。這個現象在 on-policy GRPO 訓練中也類似地出現。

### Entropy Bonus

DAPO 在 reward 函數裡**加入 entropy bonus 項**，直接鼓勵輸出分佈的多樣性：

```
reward_total = reward_verifiable + λ × H(π_θ)
```

其中 H(π_θ) 是當前策略的 Shannon entropy，λ 是權重係數。

這讓模型在最大化推理準確度的同時，保持輸出分佈的探索性，防止過早收斂到某個局部最優策略。

### Overlong Reward Shaping

Length hacking 的另一面是：模型在拿不到推理 reward 的時候，可能轉向靠「輸出更長的回應」來刷 token-level 的機率，最終輸出大量無意義的填充文字。

DAPO 的 Overlong Reward Shaping 是：對超過設定最大長度的回應施加一個**軟性懲罰**，懲罰力度與超出長度成正比（而非硬截斷）。硬截斷的問題是可能在訓練訊號上造成突然的不連續性；軟性懲罰提供了平滑的梯度，讓模型學會「寫到夠長就好，不要無限延伸」`[待補引用：具體懲罰函數形式請見原論文]`。

這兩個機制合在一起——entropy bonus + overlong reward shaping——解決了 RLVR 訓練晚期的兩個對立失效模式（探索不足 vs. 輸出爆長）。

---

## 七、整合：四項技術的系統效果

把這四項技術放在一起看，DAPO 做的事情是：

| 問題 | DAPO 技術 | 作用層面 |
|------|-----------|---------|
| 正向更新被對稱 clip 壓制 | Clip-Higher（非對稱 clip） | 優化目標層 |
| 無效 batch 浪費算力 | Dynamic Sampling | 資料效率層 |
| 長度偏差誘導廢話輸出 | Token-Level PG Loss | 梯度計算層 |
| Entropy 崩潰 + length hacking | Entropy Bonus + Overlong Shaping | 獎勵設計層 |

這四個修改作用在訓練流程的四個不同環節，互相補強。DAPO 論文做了完整的 ablation study，說明每一項的獨立貢獻 [ref: arXiv:2503.14476] `[待補引用：如需引用具體 ablation 數字，請查閱原論文 Table 2–4]`。

最終結果：以 Qwen2.5-32B base model 作為起點，DAPO 在 AIME 2024 上達到 **50 分**，在當時的開源系統中達到頂尖水準 [ref: arXiv:2503.14476]。

---

## 八、DAPO 之後：這個領域還在快速演進

DAPO 在三月發布之後，整個 RLVR 方法論領域噴發了大量後續工作，每一篇都在 DAPO 的基礎上做一個特定問題的修補：

- **Understanding R1-Zero / Dr. GRPO**（arXiv:2503.20783）：用受控實驗量化 GRPO 的長度偏差，提出更無偏的梯度估計方法，以 7B base model 達到 AIME 2024 的 43.3% 準確率 [ref: arXiv:2503.20783]
- **BAPO**（arXiv:2510.18927）：針對 off-policy 設置下的 entropy 崩潰問題，理論推導出 Entropy-Clip Rule，提出自適應 clip 邊界；其 32B 模型宣稱超越 o3-mini 和 Gemini-2.5-Flash-Thinking [ref: arXiv:2510.18927]（**注意：preprint 結果，待同儕審查確認**）
- **GTPO**（arXiv:2508.03772）：分析「衝突 token」問題（同一 token 在正確回應裡和錯誤回應裡都出現，導致梯度方向互相衝突），提出 trajectory-level 的梯度保護機制 [ref: arXiv:2508.03772]
- **DHPO**（arXiv:2601.05607）：在 token-level 和 sequence-level importance ratio 之間做動態混合，試圖同時保留兩者的優勢 `[來源：HuggingFace Papers 搜尋結果，原文為 arXiv preprint]`

這個領域的發展速度非常快——基本上每一兩週就有新的演算法出現。但核心問題始終是同樣那幾個：**clip 機制的設計**、**採樣策略的效率**、**reward shaping 的穩定性**，以及**梯度計算層的偏差**。

讀 DAPO，是進入這個領域的最好起點，因為它把問題分析得最完整、最系統，而且完全開源。

---

## 九、對生醫工程研究者的啟示

你可能會問：RLVR 跟我的生醫工程研究有什麼關係？

至少有兩個層面值得關注：

**第一：工具層面**。RLVR 訓練出來的推理模型（DeepSeek-R1、DAPO 系列模型），現在已經可以用 API 直接呼叫。它們在小樣本下的推理能力遠優於普通 LLM，對生醫文獻整理、臨床方案分析、程式碼生成（包括統計分析腳本）等任務有實際幫助。了解這些模型是怎麼訓練出來的，你才能更好地評估它們的能力邊界——比如為什麼這類模型在數學推理上特別強，但在依賴訓練資料分佈外知識的任務上比較弱。

**第二：方法論遷移**。RLVR 的核心概念——用可驗證的 reward 訊號做強化學習、不依賴人工標注——在原則上可以應用到任何有客觀驗證標準的任務上。生醫工程裡，「運動學參數預測是否正確」「分類模型的診斷準確性」都是可以建立 verifiable reward 的場景。這個方向在醫療 AI 領域還在非常早期，值得持續關注。

---

*本文 primary 來源均為 arXiv preprint，尚未同儕審查。所有 benchmark 數字以各論文發表當下為準，此後可能有更新結果。標有 `[待補引用]` 的細節請 William 審稿時確認是否需要補充原文具體頁碼或數值。*
