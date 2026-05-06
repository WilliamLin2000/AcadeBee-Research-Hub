---
id: force-plate-grf-calibration
category: method
title: 從力板到 ground reaction force 的座標系校正：新手最常踩的三個坑
excerpt: 力板資料看似乾淨，但從原始 Fx/Fy/Fz 走到下游的 inverse dynamics 之前，至少有三個座標系與校正環節最常被新手忽略。本篇用 Journal of Biomechanics、Journal of Applied Biomechanics、Sports Biomechanics、Medical Engineering & Physics 上的實測研究，把三個坑攤開來講，每個聲明都附 DOI；沒找到 primary 來源支撐的部分，文中會誠實標註。
publishedAt: 2026-05-06
readingTime: 12 分鐘
featured: false
sources:
  - title: "Camargo-Junior F, Ackermann M, Loss JF, Sacco ICN. Influence of center of pressure estimation errors on 3D inverse dynamics solutions during gait at different velocities. Journal of Applied Biomechanics, 2013;29(6):790–7."
    url: https://doi.org/10.1123/jab.29.6.790
    tier: primary
    note: "5 mm 與 10 mm COP 誤差對下肢 inverse dynamics joint moment 的傳播研究；本文最重要的數字來源"
  - title: "Exell TA, Gittoes MJR, Irwin G, Kerwin DG. Considerations of force plate transitions on centre of pressure calculation for maximal velocity sprint running. Sports Biomechanics, 2012;11(4):532–41."
    url: https://doi.org/10.1080/14763141.2012.684698
    tier: primary
    note: "兩塊力板交界處 COP 誤差實測；提供跨板轉移 inverse dynamics 敏感度數字"
  - title: "Fortune E, Crenshaw J, Lugade V, Kaufman KR. Dynamic assessment of center of pressure measurements from an instrumented AMTI treadmill with controlled precision. Medical Engineering & Physics, 2017;42:99–104."
    url: https://doi.org/10.1016/j.medengphy.2017.01.002
    tier: primary
    note: "instrumented treadmill 上 COP 準確度隨體重 / 速度系統性變化的量化方法"
  - title: "Robert T, Causse J, Monnet T, Dumas R. Comparison of base of support size during gait initiation using force-plate and motion-capture system: A Bland and Altman analysis. Journal of Biomechanics, 2016;49(16):3961–6."
    url: https://doi.org/10.1016/j.jbiomech.2016.11.008
    tier: primary
    note: "force-plate 估計步態起始 base of support 與 motion capture gold standard 的 Bland-Altman 比較"
  - title: "Leitch J, Stebbins J, Paolini G, Zavatsky AB. Identifying gait events without a force plate during running: a comparison of methods. Gait & Posture, 2011;33(1):130–2."
    url: https://doi.org/10.1016/j.gaitpost.2010.06.009
    tier: primary
    note: "明確以 10 N 為力板偵測 foot-strike / toe-off 的閾值；比較四種無力板事件偵測方法（PMID 21084195）"
---

## 一、為什麼這篇要寫

力板（force plate）這個器材對台灣的步態實驗室來說已經是基礎配備，幾乎所有做下肢生物力學的博士生第一年都會碰到。但奇妙的是，**從「力板原始訊號」走到「可以丟進 inverse dynamics 的 ground reaction force（GRF）」這條路，現場踩坑率非常高**——而且大部分坑不是寫在哪本教科書最顯眼的章節，而是散落在儀器手冊、補充資料、跟某幾篇被引用率不算最高但極度重要的方法論論文裡。

這篇就是把三個我看過的最常見坑攤開來：

1. **力板座標系與實驗室座標系沒對齊**（origin 與軸向誤判）
2. **小負載 / 邊界區 COP 誤差被低估**，下游 joint moment 直接被汙染
3. **跨力板（cross-plate）腳掌接觸**沒處理對

每個坑都會盡量引用一篇 Journal of Biomechanics、Journal of Applied Biomechanics、Sports Biomechanics 或 Medical Engineering & Physics 上的實測論文，把「誤差量級」量化出來——光知道「會有誤差」不夠，要知道「多大誤差」才有辦法決定要不要花時間 debug。

> **先說限制**：這篇是方法論整理，不是實驗報告。文中所有具體數字都來自下面引用的論文，**我自己沒有重做這些實驗**。如果你的實驗室實作跟某一條敘述衝突，以你自己的資料為準，回頭來社群討論。

## 二、坑 #1：力板座標系沒對齊到實驗室座標系

### 概念

幾乎所有商用力板（AMTI、Kistler、Bertec 都同樣處理方式）回傳的訊號，原始上是定義在**力板自己的本體座標系**裡：原點通常落在力板幾何中心或上表面中心、軸向定義由廠商決定 [待補引用：各廠商手冊版本差異需以實際使用設備為準]。但 inverse dynamics 要的是「實驗室座標系下的 GRF 三維向量 + COP 位置」——這兩個座標系如果沒對齊，**力的方向會直接錯**，下游所有 joint moment / power 都跟著錯。

新手最常踩的具體錯誤有三種：

- **(a) 軸向定義搞反**：力板的 +Z 朝下還是朝上、+Y 是前進方向還是側向，廠商之間沒有統一慣例。
- **(b) 力板原點 vs 實驗室原點偏移量沒設定到動作分析軟體（Vicon Nexus、Qualisys QTM、Visual3D 等）**：軟體預設值不一定對應你實驗室實際擺設。
- **(c) 力板沒水平**：geometric tilt 直接把 Fx/Fy 中混入一部分 Fz 分量。

### 實際代價

關鍵是：**這個誤差會線性傳遞到 COP**，再由 COP 傳遞到 joint moment。Camargo-Junior 等人在 *Journal of Applied Biomechanics*（2013）做了一個很乾淨的數值實驗：他們在五位健康成人的步態資料上，人為把 COP 位置加上 5 mm 與 10 mm 的誤差，跑 inverse dynamics，看下肢三個關節的 joint moment 怎麼跑掉 [ref: Camargo-Junior 2013, https://doi.org/10.1123/jab.29.6.790]。

他們發現：
- **COP 誤差與 joint moment 不確定度呈線性關係**——10 mm COP 誤差會讓部分關節的 moment peak 不確定度增加到 **0.04 N·m/kg**。
- **knee joint moment 受影響最大**，相對不確定度最高。
- 在不同步速（1.0 / 1.5 / 2.0 m/s）下，**步速越快誤差越大**。
- **整體相對不確定度落在 5–31% 區間**，視關節與運動平面而定。 [ref: https://doi.org/10.1123/jab.29.6.790]

換句話說：你的力板原點如果在實驗室座標系裡偏了 1 公分，knee moment 報出來的數字最壞情況可以有 30% 是「假的」。對博士論文裡那種「介入組與對照組 knee moment 差 15%」的結論，這種誤差等級足以**直接吃掉你的統計顯著性**。

### 現場 checklist

我整理三條最常被忽略的檢查（這份 checklist 是我整理常見實作要點，**不是引用某篇特定論文**——若你想看完整的標準作業程序請參考廠商技術文件）：

1. **每次重新校正動作分析系統時，重新測一次力板四角的世界座標**：不要相信去年量過的數字。
2. **用一根校正桿（calibration wand）人工點力板四角，比對 motion capture 給出的座標與廠商提供的力板尺寸**：兩者差距應該 < 2 mm，否則查擺位螺絲。
3. **在分析軟體裡（Visual3D / OpenSim 等）顯示 GRF 向量箭頭，確認向量起點落在腳底**——如果向量飄到腳上方 / 旁邊，幾乎一定是座標轉換出錯。

## 三、坑 #2：小負載 / 邊界區 COP 誤差被低估

### 概念

COP 是用 Fz、Mx、My 的比值算出來的：

```
COPx = -My / Fz
COPy =  Mx / Fz
```

當 Fz 很小（腳剛踩上力板的瞬間、或 toe-off 將離地時），分母接近零，COP 數值會劇烈跳動。**這不是儀器壞掉，是定義上的固有問題**。但很多新手把 stance phase 的全段 COP 都放進 inverse dynamics，沒做下限門檻過濾，於是著地與離地瞬間的 COP「飛走」，把 joint moment 的時間序列汙染掉。

另外，COP 在**力板物理邊界附近**也有系統性誤差——當壓力中心接近力板邊角時，部分壓力可能落到力板外，計算出的 COP 會被推回力板內側 [待補引用：邊界效應的廠商規格頁差異很大，請以實際儀器為準]。

### 實際代價

這部分有幾條 primary 證據可以引用：

**(a) 跑步機式力板的 COP 動態誤差**

Fortune 等人（2017，*Medical Engineering & Physics*）開發了一套 controlled-precision 的方法，用一顆滾動鋼珠在 instrumented AMTI treadmill 上施加 68.0 / 102.1 / 136.1 kg 三種重量、配合 0.5 / 0.75 / 1.0 m/s 三種帶速，量化 COP 誤差 [ref: Fortune et al. 2017, https://doi.org/10.1016/j.medengphy.2017.01.002]。重點結論：

- **靜態狀態下，treadmill COP 誤差與一般地嵌式力板相當**——這部分新手不太會踩坑。
- **動態狀態下**，COP 誤差會「**隨體重與速度系統性變化**」，特別是 anteroposterior 方向、再加上剪力（shear force）的耦合。 [ref: https://doi.org/10.1016/j.medengphy.2017.01.002]

意思是：你 24 公斤兒童的 COP 誤差不會跟 80 公斤成人一樣，更不會跟你 lab 裡那個跑得很快的運動員一樣。**用同一組校正參數套到所有受試者，本身就是個埋下的坑。**

**(b) 力板 vs gold standard motion capture 的系統偏差**

Robert 等人（2016，*Journal of Biomechanics*）用 Bland-Altman 比較了力板（COP 計算）與 motion capture 兩種方法估計的步態起始 base of support 大小，量化兩者的差距 [ref: Robert et al. 2016, https://doi.org/10.1016/j.jbiomech.2016.11.008]。具體偏差量級的數字請看原文（我這邊不轉述，避免變成二手引用），但這篇的價值是它讓我們知道**力板法不是「正確答案」，它跟 motion capture 之間有可量化的系統偏差**——選哪個當研究 outcome 要看你關心的是什麼物理量。

### 現場 checklist

1. **設一個 Fz 下限門檻**：Leitch 等人（2011，*Gait & Posture*）在比較四種無力板步態事件偵測法時，**明確採用 10 N 作為力板偵測 foot-strike / toe-off 的閾值** [ref: Leitch et al. 2011, https://doi.org/10.1016/j.gaitpost.2010.06.009]，這也是社群常見值；有些 lab 用 20 N 以追求更穩定的觸發訊號（**確切數字請以你的儀器規格與審稿人接受值為準**）。低於門檻的 COP 直接從分析中拿掉。
2. **整段 stance phase 開頭與結尾各 5–10% 不要拿來算 inverse dynamics**——這部分文獻有不同建議，主流共識是這個區間 COP 不可信 `[待補引用：審稿時若有人挑這條請貼具體文獻]`。
3. **做完一個受試者就看 COP 軌跡圖**：正常人的 COP 應該從腳跟平滑滑到腳尖；如果中間有跳點、回鉤、或 stance 末段往後跑，不是受試者怪，是你的訊號處理漏了。

## 四、坑 #3：跨力板腳掌接觸沒處理對

### 概念

雙力板實驗室常見：受試者走過力板區，左腳剛好踩在力板 1、右腳踩在力板 2。但**很多時候單腳會橫跨兩塊力板交界**——尤其受試者 cadence 對不上力板間距、或步幅小的小孩 / 老人。

對單一力板而言，COP = -My / Fz；但對「兩塊力板分擔一隻腳重量」的情境，正確算法是把兩塊力板的 Fz、Mx、My 在實驗室座標系裡先合成，再算合成後的 COP。**新手常見錯誤**是：

- (a) 直接拿力板 1 的 COP 用，忽略力板 2 的貢獻 → 會看到 COP 在交界處「卡住」
- (b) 兩塊 COP 分別算後直接平均（沒以 Fz 為權重） → 數學就錯
- (c) 直接放棄這個 trial → 你的可用 trial 數會掉得驚人

### 實際代價

Exell 等人（2012，*Sports Biomechanics*）特別研究了這個情境 [ref: Exell et al. 2012, https://doi.org/10.1080/14763141.2012.684698]。他們用一台手推車的滾輪滾過兩塊壓電力板的交界，同時用光學動作分析量輪子的真實位置：

- **跨板過渡的平均 COP 誤差為 0.003 ± 0.002 m**（也就是大約 3 mm）。 [ref: https://doi.org/10.1080/14763141.2012.684698]
- 用八位短跑運動員的衝刺資料驗證，當 COP 用上述跨板合成方式處理時，**ankle、knee、hip 的 joint moment 在整段 stance phase 的敏感度小於 5%、joint power 小於 3%**。 [ref: https://doi.org/10.1080/14763141.2012.684698]
- 結論：**只要合成做對，跨板 trial 不需要丟掉**，可以納入 inverse dynamics 分析。 [ref: https://doi.org/10.1080/14763141.2012.684698]

這個結論對台灣很多空間有限的 lab 來說很實用——很多老師習慣性跟學生說「跨板 trial 直接丟」，但 Exell 等人的數據顯示沒這個必要，重點是要會合成。

### 現場 checklist

1. **每個 stance trial 都要視覺化 COP 軌跡**，看有沒有在板交界出現不連續。
2. **檢查你用的分析軟體（Visual3D、OpenSim Scone、Anybody 等）是否內建跨板 COP 合成**——很多軟體有內建選項，但預設值不一定打開 `[待補引用：各軟體版本差異請以你使用的版本為準]`。
3. **報告方法時明確寫出**：跨板 trial 是被合成、還是被排除——這是審稿人愈來愈會挑的地方。

## 五、總結：把這三個坑當成你的力板資料 sanity check

如果這篇對你做下肢生物力學有點用，下次拿到一筆新的力板資料、在跑 inverse dynamics 前，至少先過這三層篩：

| 檢查項 | 失敗會吃掉的 | 引用的數字級距 |
| --- | --- | --- |
| 座標系對齊（坑 #1） | knee moment 最差可達 31% 相對不確定度 | Camargo-Junior 2013 |
| 小負載 / 邊界 COP（坑 #2） | COP 誤差隨體重 / 速度系統變化 | Fortune 2017 |
| 跨板 COP 合成（坑 #3） | 處理對：joint moment 敏感度 < 5% | Exell 2012 |

這篇刻意只挑三個最常見的，**不是說只有三個坑**——濾波器選擇、Fz / GRF 的低通截止頻率、感測器溫度 drift、AD 卡採樣率與 motion capture 同步等等，每一個都還能寫一篇。如果這篇社群反應還可以，下一篇我來談「IMU 與力板同步的三個誤差源」（這篇的姊妹篇）。

---

**社群討論**：

- 你自己的 lab 是怎麼做力板每日 / 每週的 quick check？我聽過從「站上去看是不是體重」到「滾鋼球量 COP」都有，想多收集做法。
- 跨板 trial 你的指導老師是直接丟掉、還是合成？有沒有在審稿被指過？
- 有沒有人實作過自動化的 COP sanity-check pipeline（例如 Python）？歡迎丟連結到社群。

---

**[William 審稿筆記]**

- 第二節 (b) 那條「實驗室原點偏移量」是我整理常見坑的概念說法，不是來自單一篇論文；如果你想加引用，標 `[待補引用]` 即可。
- 第三節「Fz 下限門檻 10 N」**已補引用**：Leitch 等人 2011 *Gait & Posture* 明確以 10 N 為閾值（DOI: 10.1016/j.gaitpost.2010.06.009）。20 N 那條保留為「有些 lab 的更嚴格做法」，沒附引用——若你習慣的具體 lab 引用是別篇請替換。
- 第三節 (b) Robert 2016 的具體 base of support 數字我沒轉述以避免二手引用，如果你覺得讀者需要看到具體數字再請你親自從原文補上。
- 表格的「相對不確定度可達 31%」源自 Camargo-Junior 2013 摘要，是「相對不確定度區間 5–31%」的上界（我目前只看了摘要，全文若有更精確分層數字請以全文為準），措辭如有不精確請改。
- 整篇沒寫個人經歷（沒提到「我審過 N 篇」、「我做過 X 個受試者」之類），如果你想加，請你自己補。
