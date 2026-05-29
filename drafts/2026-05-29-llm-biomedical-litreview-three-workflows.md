---
id: llm-biomedical-litreview-three-workflows
category: method
title: 用 LLM 跑生醫文獻回顧的三種 workflow：從 2025 兩篇 JAMIA 研究拆解可複製的工程化路徑
excerpt: 2025 年兩篇 JAMIA 的方法學論文剛好把「LLM 怎麼進入文獻回顧」這件事拆得很乾淨：一篇把整個地景畫出來，一篇做了實際的五模組系統並給出具體的 sensitivity / F1 / Cohen's κ。把這兩篇放在一起讀，可以反推出三條對研究生實際可用的 workflow。
publishedAt: 2026-05-29
readingTime: 12 分鐘
featured: false
sources:
  - title: "The emergence of large language models as tools in literature reviews: a large language model-assisted systematic review"
    url: https://doi.org/10.1093/jamia/ocaf063
    tier: primary
    note: "Scherbakov et al., J Am Med Inform Assoc, 2025；系統性回顧 172 篇方法學論文"
  - title: "Enhancing systematic literature reviews with generative artificial intelligence: development, applications, and performance evaluation"
    url: https://doi.org/10.1093/jamia/ocaf030
    tier: primary
    note: "Li et al., J Am Med Inform Assoc, 2025；五模組 HITL 系統 + 多組評估集"
  - title: "Validation of large language models (Llama 3 and ChatGPT-4o mini) for title and abstract screening in biomedical systematic reviews"
    url: https://doi.org/10.1017/rsm.2025.15
    tier: primary
    note: "López-Pineda et al., Res Synth Methods, 2025；1,081 篇 biomedical 摘要的雙模型對照"
---

## 一、為什麼這篇要寫給生醫工程的研究生

任何在生醫工程領域寫過 systematic review 或 scoping review 的人都知道一件事：真正花時間的不是「讀文獻」，而是讀文獻**之前**和**之後**那一大塊雜事——關鍵字組合反覆試、上千篇摘要逐筆判斷、抽取每篇研究的 PICOs、把不一致的表格欄位對齊、做 risk of bias 評分。一篇中等規模的 SLR，光是摘要篩選就可能要兩位 reviewer 各花 80 到 120 小時。

LLM 進來以後，這塊「機械性勞動」變成可以部分外包的對象。但「外包到什麼程度才安全」「該外包哪一個階段」這兩件事，在 2024 年以前其實沒有共識。直到 2025 年上半年，JAMIA 連續刊出兩篇方法學論文，把這件事釐清了不少。一篇是把整個 LLM 進入文獻回顧的地景畫出來的回顧研究 [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]，另一篇是 Regeneron 與 IMO Health 合作開發、針對 health technology assessment（HTA）情境的五模組 HITL 系統 [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]。

把這兩篇放在一起讀，剛好可以反推出三條對研究生實際可用的 workflow。本篇不討論「用哪個模型最好」這種會三個月就過期的問題，而是聚焦在**工作流程的設計原則**——這部分不論你用 ChatGPT、Claude、Llama 還是 Claude Code CLI，邏輯都一樣。

## 二、主研究 1：Scherbakov 等人 2025 — LLM 已經在文獻回顧裡做什麼

Scherbakov 等人這篇本身就是用 LLM 輔助跑出來的 systematic review，作者群來自 MUSC 的 Biomedical Informatics Center。他們從 PubMed、Scopus、Dimensions、Google Scholar 四個資料庫撈出 3,788 篇候選論文，最後納入 172 篇方法學或實作研究 [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]。

幾個數字很值得記下來：

第一，GPT 家族壓倒性地主導這個領域。172 篇研究中有 126 篇（73.2%）使用 ChatGPT 或其他 GPT 衍生模型作為核心架構 [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]。BERT 系列仍有人用，但已經明顯退到次要位置。

第二，自動化集中在兩個階段：搜尋（n=60，34.9%）與資料抽取（n=54，31.4%）[ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]。摘要篩選反而沒有想像中那麼多——這跟一般人的直覺剛好相反，因為「篩選」聽起來最像 LLM 該做的事，但實際上「搜尋查詢設計」和「資料抽取」才是大家投入最多的地方。

第三，作者直接做了 GPT-based vs BERT-based 的性能比較。在資料抽取任務上，GPT 系列的平均 precision 是 83.0%（SD = 10.4），recall 是 86.0%（SD = 9.8），整體優於 BERT 系列 [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]。但作者同時指出，**對數值型資料的抽取準確度仍然偏低**——這個提醒對生醫工程研究生特別重要，因為我們關心的 outcome 常常就是數值（角度、力量、加速度、誤差率）。

第四，**只有 26 篇（15.1%）的實際 review 在方法學裡明確標示自己用了 LLM** [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]。這意味著大量已發表的 review 可能用了 LLM 卻沒揭露。對審稿人或讀者而言，這是個透明度問題；對自己寫 review 的研究生而言，則是個 reproducibility 與 IRB / 期刊政策的提醒。

## 三、主研究 2：Li 等人 2025 — 一個真的跑得起來的五模組 HITL 系統

Scherbakov 那篇告訴你「整個領域在哪」，Li 等人這篇則給你「一個實際可實作的系統長什麼樣」。作者群來自 Regeneron 與 IMO Health，針對 HTA 提交場景設計了一個五模組系統：搜尋查詢設計、PICOs 研究方案設定、LLM 輔助摘要篩選、LLM 輔助資料抽取、資料摘要 [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]。

整個設計的核心是 **human-in-the-loop（HITL）**：人類審稿員與 LLM 的分歧會被記錄下來，並即時用於調整 PICOs 條件。這個迭代回饋機制是這篇論文最值得抄的設計。

性能數字相當好看：

- 摘要篩選：平均 sensitivity 90%、F1 score 82、accuracy 89%、Cohen's κ = 0.71（這個 κ 值代表「substantial agreement」）[ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]
- 排除理由判讀：在 relapsed/refractory multiple myeloma（RRMM）與 advanced melanoma 兩個資料集上，accuracy 分別為 97% 與 84%，F1 為 98 與 89 [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]
- 資料抽取：F1 = 93 [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]

要注意的是 90% 的 sensitivity 意味著仍然會漏掉大約 10% 的 relevant articles——這在生醫研究中不是可以忽略的數字，所以 Li 的系統並沒有把人完全拿掉，而是讓人來把關「分歧樣本」與「最終 PICOs 修訂」這兩個地方。

如果想對照一個獨立的 biomedical 驗證研究：López-Pineda 等人 2025 在 *Research Synthesis Methods* 上用 1,081 篇摘要對 Llama 3 70B 與 ChatGPT-4o mini 做雙模型比較，Llama 3（LLA_2 設定）拿到 sensitivity 77.5%、specificity 91.4%、accuracy 90.2%；ChatGPT-4o mini（CHAT_2 設定）則是 sensitivity 56.2%、specificity 95.1%、accuracy 92.0% [ref: López-Pineda et al. 2025, DOI 10.1017/rsm.2025.15]。同樣強調 manual validation 不可省略。

把兩篇放在一起看，**LLM 在「篩掉明顯不相關」這件事上已經比較穩定（specificity 高），但在「找出全部相關研究」上仍有缺口（sensitivity 不夠）**。對研究生而言，這代表 LLM 是「初篩」工具，不是「終篩」工具。

## 四、從兩篇研究反推三條對研究生實際可用的 workflow

### Workflow A：搜尋查詢迭代與初篩

Scherbakov 顯示「搜尋」是 LLM 投入最多的階段（34.9%）[ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]，Li 的系統第一個模組也是查詢設計 [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]。對研究生來說，這意味著：

1. 把研究問題寫成 PICOs 結構，丟給 LLM 生成第一版 PubMed query
2. 用 LLM 對前 50–100 筆結果跑 relevance 預判，看 recall / precision 是否符合預期
3. 不滿意就調 PICOs 或 MeSH 詞彙再來一輪

關鍵設計：**每一輪都要保留人工校驗樣本**（例如固定抽 30 篇手判），否則你的 query 會被 LLM 帶歪而不自知。

### Workflow B：結構化資料抽取

Scherbakov 與 Li 都把資料抽取列為高價值階段。Li 報告 F1 = 93 [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]，但 Scherbakov 提醒**數值資料抽取準確度仍偏低** [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]。對生物力學或醫材研究生而言，這是務實 workflow：

1. 用 LLM 抽「結構性強、字串型」的欄位（research design、population、intervention、comparator、outcome 類別）→ 接受自動化
2. 數值欄位（樣本數、平均值±SD、p 值、ROC AUC、ICC 等）→ LLM 抽完一定要人手覆核
3. 把 LLM 的不確定性顯式記錄下來（例如要求模型輸出 confidence 等級），方便後續優先複查

### Workflow C：HITL 的 PICOs 迭代

這條是 Li 系統最創新的地方，也是研究生最容易忽略的設計。傳統 SLR 教科書教的是「先把 PICOs 訂死、再開始篩選」。Li 的做法是**讓篩選過程中產生的分歧反向回去修訂 PICOs** [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]。

實際做法：

1. 用初版 PICOs 跑一輪 LLM + 人工的雙盲篩選
2. 抓出所有「LLM 認為要納入、人類認為要排除」與「LLM 排除、人類納入」的樣本
3. 看分歧的 rationale 集中在哪些 PICOs 條件上（例如 outcome 範圍太寬？population 年齡帶模糊？）
4. 修訂 PICOs 之後重跑

這個流程的價值不在「省時間」，而是**讓 PICOs 從「拍腦袋訂出來的條件」進化成「資料校驗過的條件」**——對 PhD 學生寫 review 章節，光是這個迭代紀錄本身就是論文方法學的一部分。

## 五、對生醫研究生的 takeaway

1. **不要把 LLM 當「終端答案」**：兩篇研究都明確把 LLM 定位為「篩 + 抽 + 摘要」的助手，最終判斷仍在人手上。90% sensitivity 與 F1 = 93 看起來高，但漏掉的那一成仍可能含關鍵 trial。
2. **數值資料一律覆核**：Scherbakov 直接點名 LLM 對數值的抽取準確度偏低 [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]，這對生物力學/醫材這種看數字寫結論的領域是硬性紅線。
3. **保留 LLM 使用揭露段落**：只有 15.1% 的已發表 review 揭露用了 LLM [ref: Scherbakov et al. 2025, DOI 10.1093/jamia/ocaf063]，現在期刊普遍要求標示。寫 method 時請明確說明哪些步驟由 LLM 執行、人工覆核率多少。
4. **把 PICOs 迭代寫進方法學**：Li 的 HITL 設計值得抄 [ref: Li et al. 2025, DOI 10.1093/jamia/ocaf030]。把分歧樣本與修訂理由記錄下來，未來投稿被審稿人問「你怎麼確定 PICOs 不是事後合理化」時，這就是答案。
5. **模型選擇是次要問題**：不論你用 Claude Code、ChatGPT 還是 Llama，上面三條 workflow 的設計原則都一樣。挑模型的時候優先看「能不能拉到 API、能不能自動化、token 成本可不可控」，而不是某個 benchmark 跑分。

## 六、收尾

LLM 不會把 SLR 變成「按一個按鈕就跑完」的事，但它確實把「最痛的三段——查詢迭代、初篩、結構化抽取」變成可以工程化的流程。Scherbakov 與 Li 這兩篇 2025 JAMIA 同一年同期刊的研究剛好構成一個「地景 + 實作」組合，對任何要在博士論文第二章寫 SLR 的學生來說，是值得花一個下午精讀的兩篇。

下一步比較實際的功課，是挑你自己領域裡 30 篇人工已經判讀過的論文當 ground truth，用任一 LLM 跑一次 Workflow A + B，算算你自己的 sensitivity / specificity，再決定哪些子任務你願意外包、哪些一定要自己手做。

---

*本文以 2025 年兩篇 JAMIA 主研究為核心，輔以一篇 Research Synthesis Methods 驗證研究互相對照。所有量化數字皆來自三篇已同儕審查的論文，已附 DOI。*
