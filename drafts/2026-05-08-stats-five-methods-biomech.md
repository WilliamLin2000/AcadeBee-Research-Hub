---
id: stats-five-methods-biomech
category: method
title: 生醫工程博士生必讀的五種統計檢定：從 t-test 到 mixed model
excerpt: 進入生物力學 / 生醫工程領域，你很快會發現「用 t-test 就好」在審稿意見裡活不過第一輪。這篇整理五種在 Clinical Biomechanics、Gait & Posture、Journal of Biomechanics 上反覆出現的統計方法，說清楚每一種的適用時機、常見誤用、以及對應的真實論文範例，每個核心數字都附 PubMed DOI。
publishedAt: 2026-05-08
readingTime: 14 分鐘
featured: false
sources:
  - title: "Meier MK, et al. Does the dGEMRIC Index Recover 3 Years After Surgical FAI Correction? Am J Sports Med. 2023;51(7):1808–1817."
    url: https://doi.org/10.1177/03635465231167854
    tier: primary
    note: "重複量測設計（基線、1 年、3 年）使用 mixed-effects model；FAI 術後軟骨變化"
  - title: "Albert C, et al. Bone properties by nanoindentation in mild and severe osteogenesis imperfecta. Clin Biomech. 2012;28(1):110–6."
    url: https://doi.org/10.1016/j.clinbiomech.2012.10.003
    tier: primary
    note: "兩型 OI 骨質比較；linear mixed model 同時控制個體差異與微結構區域"
  - title: "Attar S, et al. Variations over time in proximal femoral strength in young adult men. JBMR Plus. 2025;9(10):ziaf136."
    url: https://doi.org/10.1093/jbmrpl/ziaf136
    tier: primary
    note: "1101 人大樣本 LME；FN aBMD、幾何參數、肌力共同解釋 ~78% 股骨強度變異"
  - title: "Ruan Y, et al. Compliant buffer layer achieves native-like cartilage stress in talar prosthesis. J Orthop Surg Res. 2025;20(1):620."
    url: https://doi.org/10.1186/s13018-025-05996-6
    tier: primary
    note: "有限元分析 + 重複量測 ANOVA + Tukey HSD + LME；9 種材料、5 步態期"
  - title: "Kugach K, et al. Total ankle arthroplasty improves discrete and continuous stance phase gait symmetry. Gait Posture. 2024;113:272–279."
    url: https://doi.org/10.1016/j.gaitpost.2024.06.022
    tier: primary
    note: "141 例 TAA；LME（固定效果：隨訪時間點；隨機效果：個體）+ SPM1D 重複量測 ANOVA"
  - title: "Zhang B, et al. Testing Gait with Ankle-Foot Orthoses in Children with Cerebral Palsy by Using Functional Mixed-Effects ANOVA. Sci Rep. 2017;7:11081."
    url: https://doi.org/10.1038/s41598-017-11282-1
    tier: primary
    note: "functional F-test 與傳統 scalar ANOVA 比較；腦性麻痺兒童 AFO 步態研究"
  - title: "Robinson MA, Vanrenterghem J, Pataky TC. Statistical Parametric Mapping (SPM) for alpha-based statistical analyses of multi-muscle EMG time-series. J Electromyogr Kinesiol. 2015;25(1):14–9."
    url: https://doi.org/10.1016/j.jelekin.2014.10.018
    tier: primary
    note: "SPM vector-field 分析在多肌肉 EMG 時間序列的應用；說明 scalar 分析的 Type II error 問題"
  - title: "Nüesch C, et al. The effect of different running shoes on treadmill running mechanics and muscle activity assessed using SPM. Gait Posture. 2019;69:1–7."
    url: https://doi.org/10.1016/j.gaitpost.2019.01.013
    tier: primary
    note: "SPM repeated measures ANOVA 用於跑步鞋研究；inertial sensor + instrumented treadmill"
  - title: "De Pieri E, et al. Patient characteristics affect hip contact forces during gait. Osteoarthritis Cartilage. 2019;27(6):895–905."
    url: https://doi.org/10.1016/j.joca.2019.01.016
    tier: primary
    note: "132 例全髖置換 + SPM1D 相關分析；BMI、年齡、功能性對 HCF 的影響"
  - title: "Cavaggion C, et al. Reliability of coracohumeral distance and subcoracoid tendons in subacromial pain syndrome. Sci Rep. 2023;13:2383."
    url: https://doi.org/10.1038/s41598-023-29601-0
    tier: primary
    note: "ICC（intra/inter-rater）+ Bland-Altman；肩部超音波量測信度研究"
  - title: "Puig-Diví A, et al. Validity and reliability of the Kinovea program in obtaining angles and distances. PLoS One. 2019;14(6):e0216448."
    url: https://doi.org/10.1371/journal.pone.0216448
    tier: primary
    note: "ICC 用於動作分析軟體的多角度 / 多測者信度評估"
---

## 一、為什麼這篇要寫

生醫工程 / 生物力學領域有個特殊的統計困境：

- 受試者人數通常不多（臨床族群更難募集），但量測的變項維度很高（三維運動學、六軸力矩、多通道 EMG、多時間點……）
- 資料結構常常是「巢狀的」——同一個人跑了三次試驗、術前術後各量一次、左腳右腳各有數據
- 研究問題橫跨「這兩組有沒有差」（group comparison）、「量測結果可不可信」（reliability）、「這個連續曲線在哪個時間段有顯著差異」（time-series inference）

以上三種問題加起來，光靠 t-test 是解決不了的。但實務上很多博士生用統計就像選隨機應答：「有幾組就用幾個 ANOVA」「不知道怎麼辦就 Mann-Whitney U」——結果在審稿意見裡被批「statistical approach inappropriate for the repeated-measures design」。

這篇整理五種真實論文裡反覆出現的統計方法，每一種都說清楚：**適用場景、前提假設、常見誤用、以及一篇用它的真實論文範例**。所有具體數字都來自 PubMed 可查的 peer-reviewed 論文，沒有 primary 來源支撐的地方我會誠實標 `[待補引用]`。

> **先說邊界**：這篇不是教科書，不推導公式。如果你需要 step-by-step 的計算教學，請配合 Tabachnick & Fidell 或 Field (2013) *Discovering Statistics* 一起看。

---

## 二、方法一：獨立樣本 t-test / 配對 t-test

### 適用場景

- **獨立樣本（independent samples）**：兩個不相關的群體（例如：手術組 vs 保守治療組）在同一個連續變項上的比較。
- **配對（paired）**：同一批受試者在兩個條件下（術前 vs 術後；左腳 vs 右腳；有矯具 vs 無矯具）的比較。

這是所有統計的出發點，優點是直覺、前提假設少。

### 最常犯的錯誤

**用獨立樣本 t-test 處理配對資料**。兩者的計算方式根本不同：配對 t-test 是在「差值」上跑，把個體間的變異消掉，對小樣本研究而言通常統計力更強。如果你把配對設計的資料當成兩組獨立樣本跑，**你正在把本來可以控制的個體差異膨脹到誤差項裡**，等效於讓自己的研究更難得出顯著結論——或更糟，沒有找出真正存在的效應。

另一個常見問題是**多重比較（multiple comparisons）**：你不能對同一個資料集跑七個 t-test，然後只報 p < 0.05 的那幾個。這是 p-hacking，也是很多審稿人會直接要求返修的理由。

### 進一步的選擇

當你只有兩個時間點，且受試者少、分佈不正常時，可考慮非參數的 Wilcoxon signed-rank test（配對）或 Mann-Whitney U test（獨立）。但如果你有**三個以上時間點**，或者資料是**巢狀結構**，你就該移動到方法二或方法四。

---

## 三、方法二：重複量測 ANOVA（Repeated Measures ANOVA）

### 適用場景

同一批受試者有三個以上的觀測條件或時間點，且你的問題是「這些條件之間有沒有整體差異」。

### 真實論文範例

Ruan 等人（2025）在 *Journal of Orthopaedic Surgery and Research* 上的研究是一個很好的示範 [ref: https://doi.org/10.1186/s13018-025-05996-6]。他們用有限元分析（FEA）模擬距骨假體在五個步態期的軟骨接觸應力，對象是 9 種不同彈性模數的假體材料搭配不同緩衝層厚度——這是個標準的「多條件 × 多時間點」設計。他們同時使用了：重複量測 ANOVA 做整體效應檢驗，再用 Tukey HSD 做事後多重比較，最後再補 linear mixed-effects model 做更細緻的材料屬性與緩衝層厚度效應分析。結果顯示，所有硬質假體材料（Al₂O₃、Ti-6Al-4V、CoCrMo、PyC、PEEK）的軟骨應力峰值均顯著高於自然狀態（p < 0.01）[ref: https://doi.org/10.1186/s13018-025-05996-6]。

另一個例子：Kugach 等人（2024）在 *Gait & Posture* 對 141 例全踝關節置換（TAA）患者追蹤至術後兩年，用一維重複量測 ANOVA（SPM 框架）檢驗步態曲線在術前、術後一年、術後兩年之間的整體差異 [ref: https://doi.org/10.1016/j.gaitpost.2024.06.022]。

### 前提假設：球形假設（Sphericity）

重複量測 ANOVA 有一個你一定要知道的假設：**球形假設（Mauchly's test of sphericity）**。它要求不同條件之間差值的變異量大致相等。如果違反，必須用 Greenhouse-Geisser 或 Huynh-Feldt 校正，否則 F 統計量會偏高（Type I error 膨脹）。這在大部分商業軟體（SPSS、R `ez` 包）裡是預設輸出的，但很多初學者直接忽略這欄。

### 什麼時候不該用 RM-ANOVA

如果你的資料有**缺失值（missing data）**（某位受試者某個時間點沒來量），RM-ANOVA 的傳統實作方式（listwise deletion）會把整個受試者的資料都丟掉，造成嚴重的樣本損耗。這種情況應該升級到方法四：linear mixed effects model，它在 maximum likelihood 框架下對缺失值更有包容性。

---

## 四、方法三：組內相關係數 ICC（Intraclass Correlation Coefficient）

### 適用場景

**信度研究（reliability study）**：你想知道某個量測方法是否穩定。常見的問題形式：

- **Test-retest reliability**：同一個受試者同一天或隔天測兩次，結果一不一致？
- **Inter-rater reliability**：兩個不同測量者用同一套方法量同一批受試者，結果是否一致？
- **Intra-rater reliability**：同一個測量者自己量兩次，前後一致嗎？

ICC 是把「受試者之間的真實差異」與「量測誤差」拆開來的方法，輸出值介於 0 到 1，越接近 1 代表信度越高。

### 真實論文範例

Cavaggion 等人（2023）在 *Scientific Reports* 發表了肩部超音波量測的信度研究 [ref: https://doi.org/10.1038/s41598-023-29601-0]。他們量測 21 名肩峰下疼痛症候群（SAPS）患者與 20 名無症狀受試者的肱骨喙骨間距（coracohumeral distance）與肌腱厚度，分別計算 intra-rater 與 inter-rater ICC。主要發現是：喙肱間距在初學超音波操作者的 **intra-rater ICC 達到 0.88–0.98**（良好至優秀），但**同一指標的 inter-rater ICC 在二頭肌長頭腱與肩胛下肌腱的量測上僅有 0.10–0.46**（差），意味著兩個不同操作者之間的再現性很低 [ref: https://doi.org/10.1038/s41598-023-29601-0]。這種模式在臨床量測研究裡非常常見——機器學很快，但量測框架一有差異，inter-rater 就垮了。

Puig-Diví 等人（2019）在 *PLoS ONE* 評估 Kinovea 動作分析軟體在四個相機角度（90°、75°、60°、45°）下的角度與距離量測信度，以 ICC 為主要信度指標，結果顯示在 90° 角度下所有 ICC 均達可接受水準，但隨著拍攝角度偏離垂直，信度逐漸下降 [ref: https://doi.org/10.1371/journal.pone.0216448]。

### ICC 的 6 種版本：你用對了嗎？

ICC 有 Shrout & Fleiss（1979）的 2×3 分類（ICC(1,1)、ICC(1,k)、ICC(2,1)、ICC(2,k)、ICC(3,1)、ICC(3,k)），選錯版本會讓你的 ICC 數值看起來比實際更好或更差。2016 年 Koo & Mae 在 *Journal of Chiropractic Medicine* 發表的 guideline（PMID 27330520）是目前最常被引用的操作指南 [待補引用：Koo & Mae 2016 原文 DOI，需從 PubMed 確認]。簡單的選擇邏輯：

- 你的測量者是**隨機從一個母群體抽來的**（generalizable to other raters）→ 用 ICC(2,x)（two-way random）
- 你的測量者是**特定指定的**（results only apply to these specific raters）→ 用 ICC(3,x)（two-way mixed）
- 你只有**一個測量者**（one-way random）→ ICC(1,x)

同時要報 ICC 的 95% 信賴區間，只報點估計是不完整的。

---

## 五、方法四：線性混合效果模型（Linear Mixed Effects Model，LME）

### 為什麼它是「萬用進階版」

LME 的核心概念是把資料裡的效應分成：

- **固定效應（fixed effects）**：你感興趣的處置、時間點、組別等
- **隨機效應（random effects）**：受試者個體差異（以及巢狀在受試者裡的重複量測）

它可以優雅地處理：重複量測資料、有缺失值的縱向設計、巢狀結構（例如：同一個人多次步行試驗、同一個臨床中心多個受試者）、以及協變項的控制。

### 真實論文範例 #1：大樣本縱向設計

Attar 等人（2025）在 *JBMR Plus* 對 1101 名 18–28 歲男性的股骨頸骨密度（aBMD）與有限元預測股骨近端強度進行了 LME 分析 [ref: https://doi.org/10.1093/jbmrpl/ziaf136]。固定效應包含年齡、股骨頸骨密度、股骨頸面積、跳躍高度、握力、最大膝伸展力矩；以個體作為隨機效應。結果顯示 **FN aBMD、FN 面積、與身高聯合解釋了約 78% 的股骨近端強度個體間差異**，而跳躍高度（β = 0.13, p < 0.001）、握力（β = 0.23, p < 0.001）與最大膝伸展力矩（β = 0.31, p < 0.001）均與股骨強度顯著正相關 [ref: https://doi.org/10.1093/jbmrpl/ziaf136]。這種多重預測因子同時進入模型的設計，如果用傳統 RM-ANOVA 是做不到的。

### 真實論文範例 #2：術後縱向追蹤（三時間點 + 缺失資料）

Meier 等人（2023）在 *American Journal of Sports Medicine* 追蹤 39 例股骨髖臼夾擊症（FAI）患者在基線、術後 1 年、術後 3 年的 dGEMRIC 指標（反映關節軟骨品質的 MRI 參數），並使用 mixed-effects model 分析重複量測資料 [ref: https://doi.org/10.1177/03635465231167854]。核心發現：手術組在術後 1 年的髖臼軟骨 dGEMRIC 指標從術前 512 ± 174 ms 下降至 392 ± 123 ms（p < 0.001）；但到術後 3 年又回升至 456 ± 163 ms（p < 0.001）。這種 U 型趨勢只有在三個時間點的縱向資料下才能觀察到，而 mixed-effects model 在存在少量缺失資料的情況下，比傳統 RM-ANOVA 更能保留受試者的資訊 [ref: https://doi.org/10.1177/03635465231167854]。

### 真實論文範例 #3：材料力學 × 微結構的交叉設計

Albert 等人（2012）在 *Clinical Biomechanics* 對成骨不全症（OI）患兒的骨組織進行奈米壓痕（nanoindentation），同時比較 OI type I（輕度）與 type III（重度）兩型，並比較同一骨骼內的骨單位（osteonal）與間質（interstitial）兩種微結構區域 [ref: https://doi.org/10.1016/j.clinbiomech.2012.10.003]。這是一個典型的「個體間效應（OI type）× 個體內效應（微結構區域）」交叉設計，linear mixed model 可以同時估計兩個效應並控制個體差異。結果：OI 型別對彈性模量有統計顯著影響（差異 7%，p = 0.02）；間質骨區域的模量與硬度平均高於骨單位區域 13%（p < 0.001）[ref: https://doi.org/10.1016/j.clinbiomech.2012.10.003]。

### 常見「坑」：隨機效應沒有指定正確

最常見的錯誤是「隨機效應結構太簡單」：只放了 random intercept（個體基線不同），沒有放 random slope（個體隨時間的變化斜率也不同）。在許多縱向設計裡，不同受試者對時間的反應速率本身就有個體差異，這部分如果沒放進模型，你的標準誤是低估的，p 值是虛假的。

另一個常見問題是：不報模型的 AIC/BIC 比較，讀者無從判斷你選的模型結構是否合理。建議同時報 null model、random intercept only model 和完整 model 的 likelihood ratio test 結果。

---

## 六、方法五：統計參數映射（Statistical Parametric Mapping，SPM）

### 為什麼它在生物力學領域特別重要

步態分析、EMG、關節運動學輸出的不是一個點，而是整條**時間序列曲線**（通常歸一化為 0–100% 步態週期）。傳統做法是：從每條曲線抽幾個 scalar 特徵（peak value、mean value、time to peak），對這些 scalar 跑 t-test 或 ANOVA。

問題是：你怎麼知道哪幾個「特徵點」是有意義的？如果膝蓋彎曲曲線在整條曲線的 47–62% 步態期才有差異，但你只看了 peak flexion 和 mean stance phase value，你可能完全找不到效應——這就是 **Type II error**，**你放掉了真實存在的效應**。

SPM 的核心思想是：把整條時間序列當作一個隨機場（random field），在整條曲線上做推論，同時控制多重比較（family-wise error rate）。

### 真實論文範例 #1：EMG 時間序列

Robinson 等人（2015）在 *Journal of Electromyography and Kinesiology* 示範了 SPM vector-field 分析在多肌肉 EMG 步態資料的應用 [ref: https://doi.org/10.1016/j.jelekin.2014.10.018]。他們重新分析了一組公開的年輕人 vs 成人 EMG 步態資料。傳統 scalar 分析在 35–45% 站立期沒有找到顯著差異；但 SPM vector-field 分析在這個時間段發現了顯著差異——前者出現了 Type II error（漏掉了真實存在的差異）[ref: https://doi.org/10.1016/j.jelekin.2014.10.018]。

### 真實論文範例 #2：跑步力學 × 鞋款

Nüesch 等人（2019）在 *Gait & Posture* 用 SPM 重複量測 ANOVA 分析 19 名後足著地跑者在三種不同跑鞋下的關節運動學、肌肉活動與地面反作用力 [ref: https://doi.org/10.1016/j.gaitpost.2019.01.013]。SPM 分析揭示，實驗跑鞋在承重初期顯著降低了脛前肌、腓骨長肌、股內側肌與股外側肌的活動，以及在擺動期降低腓骨長肌活動——這些效應出現在特定的步態時相，而不是整條曲線都有差異 [ref: https://doi.org/10.1016/j.gaitpost.2019.01.013]。

### 真實論文範例 #3：全髖置換 × SPM 相關分析

De Pieri 等人（2019）在 *Osteoarthritis and Cartilage* 對 132 例全髖關節置換患者的步態資料，用 SPM1D 分析 BMI、年齡、功能能力與髖關節接觸力（HCF）的一維相關性 [ref: https://doi.org/10.1016/j.joca.2019.01.016]。他們發現 BMI 與 HCF 在大部分站立期有顯著正相關（obese 患者接觸力更大），但年齡只在晚期擺動期才有顯著負相關 [ref: https://doi.org/10.1016/j.joca.2019.01.016]。這種「只在某個時相顯著」的模式，如果用 scalar 分析很容易被埋掉。

### 注意事項

SPM 的主要工具包是 Todd Pataky 的 `spm1d`（Python / MATLAB 都有）。它假設時間序列在每個時間點的殘差服從常態分佈，且要求連續性（continuity）。對小樣本（n < 15）要特別謹慎，因為隨機場理論的估計在小樣本下穩定性較差 [待補引用：需從 spm1d 文檔或對應方法論論文補充具體樣本量建議]。

---

## 七、選擇流程：給博士生的快速對照表

```
你的問題是...
│
├─ 比較兩組 / 兩個條件？
│   ├─ 資料獨立（兩批不同的人）→ Independent t-test
│   └─ 資料配對（同一批人兩個條件）→ Paired t-test
│
├─ 比較三個以上條件 / 時間點？
│   ├─ 同一批人 + 無缺失值 + 只想要整體效應 → Repeated Measures ANOVA
│   ├─ 有缺失值 / 要控制協變項 / 需要隨機效應 → Linear Mixed Effects Model
│   └─ 資料是時間序列曲線 → SPM（+ 以上任一架構）
│
└─ 你的問題是「這個量測方法可信嗎」？ → ICC
    ├─ 測量者是隨機代表母群體 → ICC(2,x)
    ├─ 測量者是特定指定的 → ICC(3,x)
    └─ 只有一個測量者 → ICC(1,x)
```

---

## 八、最後一個建議

統計方法選擇要在**研究設計階段**就確定，而不是收完資料後再想。因為樣本量計算（power analysis）是對應特定的統計方法的——你用 mixed model 和用 t-test 需要的樣本數不同。如果你資料已經收完才意識到統計方法不對，你能做的修補空間非常有限。

下次開始一個新研究之前，把這張問題清單過一遍：

- 我的觀測單位（unit of observation）是什麼？受試者？還是受試者 × 時間點的組合？
- 我的依變項是 scalar 還是時間序列？
- 我的設計裡有沒有巢狀結構（nesting）？
- 受試者之間的個體差異會不會汙染我的主要效應估計？

這四個問題的答案，幾乎可以決定你該用哪一種方法。

---

*本文所有具體數字均來自 PubMed 可查詢的 peer-reviewed 論文（DOI 標注於文中）。標有 `[待補引用]` 的聲明目前未找到合適的 primary 層來源支撐，William 審稿時可決定是否補充或刪除。*
