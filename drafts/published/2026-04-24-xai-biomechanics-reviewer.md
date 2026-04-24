---
id: xai-biomechanics-reviewer
category: method
title: 為什麼生醫論文審稿人總是問「你的模型可解釋嗎」：從 XAI 文獻回應這個問題
excerpt: 投稿生物力學或醫學工程期刊，Reviewer 幾乎必然會問一個問題：「你的模型可解釋嗎？」這不是刁難，而是一個有深刻臨床理由的要求。這篇筆記整理 XAI 文獻，幫你在下一次回應審稿意見時說得有憑有據。
publishedAt: 2026-04-24
readingTime: 10 分鐘
featured: false
sources:
  - title: "Explainable artificial intelligence for gait analysis: advances, pitfalls, and challenges - a systematic review"
    url: https://doi.org/10.3389/fbioe.2025.1671344
    tier: primary
    note: "Systematic Review, 31 studies from 3676 records; Frontiers in Bioengineering and Biotechnology, 2025"
  - title: "Artificial Intelligence in Biomechanics: A Narrative Review of Current Applications in Diagnostic and Physical Rehabilitation"
    url: https://doi.org/10.1002/pri.70120
    tier: primary
    note: "Narrative Review; Physiotherapy Research International, 2025"
  - title: "A historical perspective of biomedical explainable AI research"
    url: https://doi.org/10.1016/j.patter.2023.100830
    tier: primary
    note: "Meta-review of 1603 labeled papers; Patterns (Cell Press), 2023"
  - title: "A domain knowledge-based interpretable deep learning system for improving clinical breast ultrasound diagnosis"
    url: https://doi.org/10.1038/s43856-024-00518-7
    tier: primary
    note: "Communications Medicine (Nature Portfolio), 2024; n=1348 patients"
---

## 一、這個問題為什麼每次都出現

如果你最近投稿了一篇結合機器學習的生物力學或醫學工程論文，審稿人的意見裡幾乎一定出現過這句話：

> "The authors should address the interpretability / explainability of the proposed model."

這不是審稿人的個人口味，而是近年來生醫 AI 領域的共識性轉變。根據 Malinverno et al.（2023）對 PubMed 資料庫中 1,603 篇相關論文的大規模分析，生醫 XAI（Explainable Artificial Intelligence）的發表量在 2020 年之後明顯加速——COVID-19 的臨床壓力放大了「模型不可信任」的代價，使整個社群意識到「高準確度」和「臨床可部署」之間還差了一個解釋性的門檻 [ref: 10.1016/j.patter.2023.100830]。

換句話說，審稿人問這個問題，是因為他們知道：**一個沒辦法被臨床醫師理解的黑盒模型，很難真正落地。**

---

## 二、XAI 在生物力學領域的現況

Xiang et al.（2025）發表了迄今最完整的步態分析 XAI 系統性回顧。他們從 3,676 篇文獻中篩選出 31 篇符合標準的研究，清楚描繪了這個領域的方法全貌 [ref: 10.3389/fbioe.2025.1671344]：

**應用的臨床族群**包括帕金森氏症患者、中風後步態異常者、肌少症、腦性麻痺，以及一般肌骨系統障礙。這些族群的共同特徵，是步態資料的個體間差異大、標記數量少，正是「小資料 + 黑盒模型 = 審稿人最擔心過擬合又不知道為什麼」的高風險情境。

**常見的 XAI 方法**可以分為三類：

- **模型無關（Model-agnostic）**：SHAP（SHapley Additive exPlanations）和 LIME（Local Interpretable Model-agnostic Explanations）是最多論文採用的方法，可以在訓練完模型之後，事後（post hoc）解釋每個特徵對單一預測的貢獻量。優點是適用任何模型；缺點是解釋本身是近似值，不等同模型真實內部機制。
- **模型特異（Model-specific）**：Grad-CAM（影像類任務）與 Attention Mechanism（序列類任務，例如 IMU 時間序列）屬於這類，解釋與模型計算緊密結合，較適合作為 reviewer 要求的「內建式可解釋性」。
- **混合（Hybrid）**：少數論文同時使用 intrinsically interpretable 模型（例如決策樹）和 post hoc 方法，兼顧透明度與性能。

這篇系統性回顧進一步指出，在生物力學語境下，XAI 方法確認的關鍵辨別特徵包括**步幅長度（stride length）**與**關節角度（joint angles）**——這些本來就有臨床意義的指標，被 XAI 方法「重新確認」，反過來增加了模型預測結果的臨床公信力。

---

## 三、為什麼「準確率高」不夠

Abdelmohsen（2025）的敘述性回顧明確點出，生醫 AI 目前面臨的主要挑戰包括：**模型泛化能力、預測解釋、資料隱私，以及倫理問題**。作者特別強調，XAI 策略是 AI 驅動生物力學研究的「下一步必要條件」，而非可選附加項目 [ref: 10.1002/pri.70120]。

從臨床落地的角度看，Yan et al.（2024）的研究提供了一個有力的佐證。他們設計了一套整合領域知識的可解釋深度學習系統，用於乳房超音波的腫瘤診斷（n=1,348 名患者）。結果顯示：系統的 AUC 達到 0.902（95% CI: 0.882–0.921），敏感度 75.2%，特異度 91.8%。**更值得注意的是**，在 XAI 功能輔助下，資淺放射科醫師的診斷表現顯著提升，資深醫師則回報對自身判斷的信心增加 [ref: 10.1038/s43856-024-00518-7]。

這個結果直接回答了審稿人的深層疑慮：**可解釋性不是在犧牲準確率，而是讓模型變得有用。**

---

## 四、審稿人的問題背後有哪些子題

根據上述文獻，審稿人問「可解釋嗎」通常隱含以下幾個實質問題，需要分別回應：

**1. 你用的是 post hoc 解釋還是 inherently interpretable 模型？**
Post hoc 方法（SHAP、LIME）事後解釋黑盒，inherently interpretable 方法（決策樹、線性模型、attention）在模型結構上就有透明度。兩者的局限不同，論文裡必須說清楚你選擇的是哪種路線，以及為什麼。

**2. 你的解釋結果有沒有生物力學或臨床意義？**
純粹說「特徵 A 的 SHAP 值最大」並不夠。你需要連結到既有的生物力學知識：「步幅長度對分類貢獻最大，這與帕金森步態縮短的文獻一致」，這樣審稿人才知道你不是在背誦工具說明書。

**3. 模型解釋在不同受試者或不同採集日的穩定性如何？**
這是 Xiang et al. 系統性回顧點名的主要研究缺口之一——現有論文少有對 XAI 輸出的穩定性進行驗證。如果你的論文有這個驗證，是加分項；如果沒有，在 limitation 裡主動提出，比等審稿人問更有說服力 [ref: 10.3389/fbioe.2025.1671344]。

**4. 你有沒有讓臨床或領域專家確認解釋的合理性？**
這是「人機協作」的體現，也是高階期刊（如 Nature 系列）越來越看重的面向。即使只是一位物理治療師或骨科醫師確認「這個特徵的貢獻方向符合我的臨床直覺」，都能大幅提升審稿人對結果的接受度。

---

## 五、給生物力學研究者的務實建議

如果你正在準備投稿，或正在回應審稿意見，以下幾點可以直接使用：

**選模型前先決定解釋策略。** 如果你的目標期刊、目標臨床族群，或資料特性（時間序列、小樣本）要求可解釋性，應該在模型選型時就納入考量，而不是訓練完模型後再補 SHAP 圖。

**SHAP 圖要搭配文字解讀，不是裝飾品。** 很多論文放了 SHAP beeswarm plot，但沒有對應的討論段落。審稿人看到的會是：「作者可能不知道這個圖在說什麼。」

**Limitation 要主動提 XAI 的侷限性。** SHAP 值在特徵共線性高時會不穩定，LIME 的解釋範圍是局部線性近似，Grad-CAM 適用於卷積結構。主動說明你選擇的方法的邊界條件，是學術誠信，也是讓審稿人放心的方式。

**把「可解釋性」視為研究問題，不是附錄。** 最好的情況，是讓 XAI 分析成為你的 Research Question 之一，例如：「哪些步態特徵對病理分類最具辨別力？」而不只是：「我們用 SHAP 解釋了一下我們的模型。」

---

## 六、小結：審稿人問的，其實是臨床信任

綜合以上文獻，生醫 AI 審稿人對可解釋性的要求，背後是一個更大的問題：**這個模型值得醫師信任嗎？** XAI 是目前學術界回應這個問題最主流的工具語言。

不管你使用的是 SHAP、Grad-CAM、Attention，還是 inherently interpretable 模型，重點都是同一件事：**讓模型的決策過程可以被領域專家審視**。這不是為了通過審稿，而是為了讓你的研究有機會真正被用到。

---

*本文引用來源均來自 PubMed 索引期刊。*

*[根據 PubMed 資料庫檢索，2026-04-24]*
