---
id: ai-medical-imaging-2026-papers
category: community
title: 這週社群熱門：三個 2026 AI × 醫學影像新 paper（Medical SAM3、RDBCycleGAN-CBAM、VascFlexMap）解讀
excerpt: 五月初 FB 生醫工程社群與 X 上熱度最高的三篇 2026 預印本，分別處理「文字提示通用分割」「低劑量 CT 去噪」「稀疏微血管超音波重建」三個截然不同的問題。本篇是初版讀後心得，所有具體 Dice / PSNR / SSIM / 重建時間都附原文連結；三篇都還在 preprint 階段，尚未同儕審查，文中會提醒大家哪些聲明需要等 peer review 之後才能拿來引用。
publishedAt: 2026-05-04
readingTime: 12 分鐘
featured: false
sources:
  - title: "Medical SAM3: A Foundation Model for Universal Prompt-Driven Medical Image Segmentation"
    url: https://arxiv.org/abs/2601.10880
    tier: primary
    note: "preprint, 尚未同儕審查；arXiv 2601.10880, 2026 年 1 月；33 個資料集、10 個影像模態微調 SAM3"
  - title: "A NOVEL DEEP LEARNING MODEL, RDBCYCYLEGAN-CBAM FOR LOW-DOSE CT IMAGE DENOISING"
    url: https://www.biorxiv.org/content/10.64898/2026.02.17.706311v1
    tier: primary
    note: "preprint, 尚未同儕審查；bioRxiv 2026.02.17；CycleGAN + Residual Dense Block + CBAM；quarter-dose CT 去噪 +3.97 dB PSNR / +0.053 SSIM"
  - title: "VascFlexMap: Microvascular Ultrasound Imaging at Low Frame Rates Using Sparse Data and a Transformer-Decoder Network"
    url: https://www.biorxiv.org/content/10.64898/2026.02.27.708398v1
    tier: primary
    note: "preprint, 尚未同儕審查；bioRxiv 2026.02.27；transformer-decoder 從稀疏 CEUS 重建微血管圖；H100 上 28–133 秒"
---

## 一、為什麼挑這三篇

最近兩週社群裡看到不少朋友在轉貼 2026 開年的幾篇 AI × 醫學影像 preprint，我自己花了點時間把連結點開來看。下面挑三篇我覺得「方向不一樣，但都可以代表 2026 年初社群在討論什麼」的論文：

- **Medical SAM3**（arXiv 2601.10880）：從 SAM3 微調到醫學影像通用分割，是 foundation model 路線的最新 instance。 [ref: arXiv:2601.10880]
- **RDBCycleGAN-CBAM**（bioRxiv 2026.02.17.706311）：低劑量 CT 去噪，方向比較傳統但有具體 PSNR/SSIM 數字。 [ref: bioRxiv 10.64898/2026.02.17.706311v1]
- **VascFlexMap**（bioRxiv 2026.02.27.708398）：用 transformer-decoder 從稀疏 contrast-enhanced ultrasound（CEUS）資料重建微血管圖。 [ref: bioRxiv 10.64898/2026.02.27.708398v1]

**先講重要前提**：三篇都還在 arXiv / bioRxiv 階段，尚未通過同儕審查。我會把每篇文獻自報的數字直接引用，但我們在自己論文裡轉引這些數字的時候，至少要等到正式期刊版本出來再說。下面看到的所有 Dice、PSNR、SSIM、加速倍數都是作者自陳，**還沒有第三方驗證**。

我自己讀的時候會問三個問題：(a) 它解決了哪個臨床或工程上具體的痛點；(b) 自陳的指標進步有多大；(c) 我們博士生在做小資料生醫工程題目時，有什麼地方可以借鏡。下面就照這個框架走。

## 二、Medical SAM3：把 SAM3 變成「能聽懂醫學名詞的通用分割器」

### 痛點

SAM（Segment Anything Model）系列的 promptable segmentation 在自然影像很強，但搬到醫學影像時泛化通常會掉。原因是醫學影像跟自然影像的視覺先驗差太多——CT、MRI、retinal fundus、超音波，每一種模態的對比度、雜訊分布都不一樣，SAM 從未在這些分布上見過足夠的樣本。

### 作者怎麼做

Medical SAM3 的策略是**全參數微調**，不是 PEFT、不是 adapter，而是直接拿 SAM3 在 33 個資料集、橫跨 10 個醫學影像模態的資料上做完整 fine-tuning，搭配分割 mask + 文字 prompt 的配對訓練 [ref: arXiv:2601.10880]。論文強調這樣能「強化醫學領域視覺先驗、改善 text-to-mask 對齊」，讓使用者只給類別名稱（例如 "retinal vessel"）也能拿到合理 mask。

### 自陳數字

- **內部驗證**：平均 Dice 從 SAM3 原版的 54.0% 提升到 77.0%（+23 百分點）；平均 IoU 從 43.3% 提升到 67.3%（+24 百分點） [ref: arXiv:2601.10880]。
- **外部測試（跨資料集泛化）**：平均 Dice 從 11.9% 跳到 73.9%；平均 IoU 從 8.0% 跳到 64.4% [ref: arXiv:2601.10880]。這個外部數字看起來很驚人，但我會謹慎讀——因為原本 11.9% 接近隨機水準，提升空間本來就很大；「外部」具體是哪些資料集、跟訓練分布的距離有多遠，要看正式版才能下判斷。
- **細結構 vessel-level**：retinal vessel 的 DRIVE 資料集 Dice 從 24.8% 提升到 55.8%；COph100 從 34.1% 提升到 63.1% [ref: arXiv:2601.10880]。

### 我自己會怎麼讀

兩個方向想跟大家討論：

1. **「foundation model 微調 + 領域內資料」目前看起來是 2025–2026 年生醫影像分割的主流路徑**，但全參數微調的算力門檻不低，這對沒有大型 GPU cluster 的實驗室是個現實限制。如果原文釋出 LoRA / adapter 版本的對照實驗，會比現在的「全參數 vs. zero-shot」更有實務意義。
2. **DRIVE 在 retinal vessel 領域是被研究透徹的 benchmark，55.8% Dice 在這個資料集上其實不算特別高**——傳統 U-Net + 領域特化技巧的 SOTA 多年來都在 80%+ 區間。所以我傾向把這個結果讀成「通用 prompt-driven 模型在窄領域 benchmark 上仍輸給專用模型，但通用性是賣點」，不是「Medical SAM3 在 retinal vessel 上贏過 SOTA」。社群裡看到有些朋友把這個數字直接寫成「打敗 SOTA」，我覺得是過度解讀。

> **小結**：方向值得追，但等正式版（peer review）+ 第三方獨立 benchmark 之後再放進自己的 related work，會比較穩。

## 三、RDBCycleGAN-CBAM：低劑量 CT 去噪的「組合拳」

### 痛點

低劑量 CT（low-dose CT, LDCT）是輻射劑量的折衷產物：劑量降到四分之一（quarter-dose）對病人較友善，但雜訊提高、會掩蓋細節（小結節、微鈣化），影響診斷。深度學習去噪的目標是把 LDCT 還原到接近 normal-dose CT 的影像品質。

### 作者怎麼做

RDBCycleGAN-CBAM 把三個既有元件組合在一起 [ref: bioRxiv 10.64898/2026.02.17.706311v1]：

- **CycleGAN**：unpaired 訓練（不需要配對的 LDCT/NDCT），這對臨床資料的取得是個重要優勢。
- **Residual Dense Block (RDB)**：強化特徵重用，是影像超解析領域常用元件。
- **Convolutional Block Attention Module (CBAM)**：通道 + 空間注意力，幫模型抓細節。

### 自陳數字

相對於 quarter-dose 輸入，平均 PSNR +3.97 dB、平均 SSIM +0.053 [ref: bioRxiv 10.64898/2026.02.17.706311v1]。論文還特別補了 Wilcoxon signed-rank test、報告 rank-biserial correlation 接近 1.0、bootstrap CI 也很窄——這些統計細節我覺得是作者比較負責的地方，比起「我們 PSNR 比較高」這種單一數字更可信。

### 我自己會怎麼讀

1. **+3.97 dB PSNR 在 LDCT 去噪文獻裡是中段表現，不是 SOTA**。這幾年低劑量 CT 去噪的論文很多，PSNR 提升 4–7 dB 的方法也有人做出來。原文也誠實寫到「outperforms most existing deep learning-based methods」而不是「SOTA」，這句話的措辭值得學習——我自己讀同類題目時，看到「outperforms most」這種用詞會比看到「SOTA」更願意往下讀。
2. **CycleGAN 路線的 unpaired 訓練在臨床很實用**：要拿到完美配對的 LDCT/NDCT 影像幾乎不可能（同一病人不會被掃兩次劑量），所以 unpaired 是必要設計，不是研究花樣。對博士生來說，這是個值得借鏡的「題目選擇邏輯」——把臨床取得限制當成方法設計的起點。
3. **這篇 preprint 的價值不在 SOTA 數字**，而在它把 RDB、CBAM、CycleGAN 這幾個既有 building block 組合起來、做完整的對照與統計檢定。我自己讀類似題目時也比較喜歡這種「老元件、新組合、完整實驗」的論文，比堆 transformer 但實驗只跑一遍的論文有資訊量。

> **小結**：方法不算最新潮，但實驗扎實。可以拿來當做去噪題目 baseline 比較對象，不用當成必引 SOTA。

## 四、VascFlexMap：把超音波 microvascular imaging 的「資料量」門檻降下來

### 痛點

Super-Resolution Ultrasound（SR-US）/ Ultrasound Localization Microscopy（ULM）這幾年發展快，可以看到傳統超音波看不到的微血管結構。但這類技術通常需要**極高的 frame rate（kHz 級）+ 數萬 frame 累積**，才能定位足夠的微氣泡，重建血管圖。對臨床部署是個門檻：要特殊硬體、長掃描時間、儲存成本高。

### 作者怎麼做

VascFlexMap 用一個 transformer-decoder 網路（單頭 self-attention），在**稀疏採樣的 CEUS 序列**上重建血管 probability map，跳過顯式的微氣泡定位與追蹤步驟 [ref: bioRxiv 10.64898/2026.02.27.708398v1]。後處理階段再做空間細化，輸出最終血管圖。

### 自陳數字

- 重建時間：在 NVIDIA H100 GPU 上 **28–133 秒**完成端到端重建，依使用的 frame 數而定 [ref: bioRxiv 10.64898/2026.02.27.708398v1]。
- 解析度折衷：相對於 reference SR-US，apparent vessel width 平均**寬約 3 倍**，主分支與較高階微血管仍可見 [ref: bioRxiv 10.64898/2026.02.27.708398v1]。
- 在原本 conventional ULM pipeline 在同樣稀疏資料下無法產生連續血管網絡的條件下，VascFlexMap 仍能恢復連貫的微血管拓撲 [ref: bioRxiv 10.64898/2026.02.27.708398v1]。

### 我自己會怎麼讀

1. **這篇是「方法 + trade-off」的典型例子**：作者明白自陳「以解析度換速度與資料量」，沒有假裝它是 SR-US 的全面替代。這種誠實的 trade-off 描述對博士生來說是好示範——你做的方法不一定要全面贏對照組，明確指出你贏在哪個 axis、輸在哪個 axis，論文會更可信。
2. **vessel width 變寬 ~3 倍**這個代價要不要付，看臨床問題：如果是看「腫瘤血管化整體拓撲」，3 倍寬度可能還是有用；如果是看「血管直徑量化」，那這個方法不適合。生醫工程研究者選工具時，**從臨床問題的容忍度反推技術規格**比「比較指標誰大」重要很多，這篇是個好例子。
3. **算力**：H100 是高階卡，論文沒明確報告在中階 GPU（A100 / 4090 / 3090）上的延遲。對台灣多數實驗室部署來說，這是個會影響 reproducibility 的細節，等正式版希望作者能補上。

> **小結**：方向（少 frame、低硬體門檻 SR-US）很有臨床轉譯潛力，但解析度退化的代價要看具體應用評估，且 H100 依賴值得追問。

## 五、三篇放在一起，我看到三個 2026 趨勢

把這三篇對照看，浮現幾個 2026 年初的方向（純粹是我從這三篇 + 最近社群討論得出的觀察，不是嚴謹的 systematic review）：

1. **Foundation model + 醫學特化微調**仍是熱題，但社群開始更謹慎地比較「通用」與「專用」模型的 trade-off，而不是直接宣稱通用模型贏。Medical SAM3 在 DRIVE 上 55.8% Dice 不到傳統 SOTA 就是個例子。
2. **CycleGAN / unpaired 訓練在 2026 並沒有被 diffusion model 取代**，反而在臨床資料配對困難的場景（CT 去噪、MRI 跨序列轉換）依然有人在優化既有架構。對博士生選題的啟示是：不是新就一定好，舊方法 + 領域知識的組合有時更實用。
3. **Trade-off explicit 的論文寫作風格越來越受歡迎**：VascFlexMap 與 RDBCycleGAN-CBAM 都明確寫出自己輸在哪、為什麼這個 trade-off 對特定臨床問題可接受。從這幾年生醫期刊的 review guideline 趨勢看，主動承認限制看起來比刻意藏起來更有利於通過審稿——這部分等大家在自己的投稿經驗裡再驗證。

## 六、想跟大家討論的幾個問題

寫完這三篇 preprint 解讀，我自己腦中浮現幾個問題，蠻想跟同樣在做生醫影像 / 深度學習的朋友交換意見：

- Medical SAM3 的「外部 Dice 11.9% → 73.9%」太誇張，我傾向等正式版 + 第三方 benchmark 才採用。如果有人有把它跑在自己手上資料上的經驗，蠻想知道實際表現。
- CycleGAN 在 unpaired 醫學影像任務上的「假影」問題（hallucinated structures），有看到 2026 哪篇論文把這個風險量化得比較好嗎？
- VascFlexMap 的 28–133 秒重建時間在 H100 上是 OK，但如果換到中階 GPU 或 edge 裝置，就完全是另一個故事——大家覺得 SR-US 在臨床部署上，硬體門檻會是下一個瓶頸嗎？

歡迎在社群裡留言或私訊，下一篇我會看看大家提到的延伸閱讀。如果有朋友自己讀了這三篇 preprint 的細節而我寫錯哪裡，也很歡迎指正——畢竟 preprint 的細節多，一次寫三篇難免有誤讀。

---

> 本文三篇主要文獻皆為 arXiv / bioRxiv preprint，**尚未同儕審查**。所有具體 Dice、PSNR、SSIM、重建時間數字皆引自原文連結，請讀者在正式引用前自行確認最新版本。引用層級依 AcadeBee 白名單僅使用 community 類 Primary 層（arXiv、bioRxiv）。
