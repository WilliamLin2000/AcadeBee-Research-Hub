---
id: event-camera-motion-analysis
category: method
title: Event Camera 是什麼、能解決動作分析的哪些痛點：一個給生物力學研究者的入門整理
excerpt: Event camera（事件相機，又稱 neuromorphic vision sensor / DVS）跟一般 RGB 相機在感測機制上根本不同——它不是固定 frame rate 拍照，而是每個 pixel 各自非同步地回報亮度變化。本篇用 IEEE TPAMI 的兩篇 survey 與幾篇 peer-reviewed 應用論文，把它的技術特性整理出來，再針對動作分析、生物力學與運動相關研究，討論三個比較具體的切入點。所有具體數字都附 DOI；尚未有 primary 來源支撐的部分文中標註。
publishedAt: 2026-05-06
readingTime: 13 分鐘
featured: false
sources:
  - title: "Gallego G, Delbrück T, Orchard G, Bartolozzi C, Taba B, Censi A, Leutenegger S, Davison AJ, Conradt J, Daniilidis K, Scaramuzza D. Event-Based Vision: A Survey. IEEE Trans Pattern Anal Mach Intell, 2022;44(1):154–180."
    url: https://doi.org/10.1109/TPAMI.2020.3008413
    tier: primary
    note: "事件相機領域目前最主流的 survey，本文中關於感測原理、μs 時間解析度、140 dB 動態範圍、低功耗等核心數字均出自此處（PubMed PMID 32750812）"
  - title: "Cimarelli C, Millan-Romera JA, Voos H, Sanchez-Lopez JL. Hardware, Algorithms, and Applications of the Neuromorphic Vision Sensor: A Review. Sensors, 2025;25(19):6208."
    url: https://doi.org/10.3390/s25196208
    tier: primary
    note: "2025 年新出的綜合 review，整合硬體、演算法、應用三個面向，補足 Gallego 2021 之後的進展"
  - title: "Ghosh S, Gallego G. Event-Based Stereo Depth Estimation: A Survey. IEEE Trans Pattern Anal Mach Intell, 2025;47(10):9130–9149."
    url: https://doi.org/10.1109/TPAMI.2025.3586559
    tier: primary
    note: "事件相機 stereo / 3D depth 領域 survey；3D 動作分析必經的 pipeline"
  - title: "Sehara K, Bahr V, Mitchinson B, Pearson MJ, Larkum ME, Sachdev RNS. Fast, Flexible Closed-Loop Feedback: Tracking Movement in \"Real-Millisecond-Time\". eNeuro, 2019;6(6):ENEURO.0147-19.2019."
    url: https://doi.org/10.1523/ENEURO.0147-19.2019
    tier: primary
    note: "DVS 即時追蹤小鼠 25 Hz 觸鬚運動、2 ms 內回饋——生物動作即時追蹤的代表性論文"
  - title: "Ceolini E, Frenkel C, Shrestha SB, Taverni G, Khacef L, Payvand M, Donati E. Hand-Gesture Recognition Based on EMG and Event-Based Camera Sensor Fusion: A Benchmark in Neuromorphic Computing. Front Neurosci, 2020;14:637."
    url: https://doi.org/10.3389/fnins.2020.00637
    tier: primary
    note: "DVS 與 EMG 融合做手勢辨識；本文中與穿戴感測整合的論點來源"
  - title: "Tenzin S, Rassau A, Chai D. Application of Event Cameras and Neuromorphic Computing to VSLAM: A Survey. Biomimetics, 2024;9(7):444."
    url: https://doi.org/10.3390/biomimetics9070444
    tier: primary
    note: "事件相機在 VSLAM（視覺定位）的 review，動作場景中 ego-motion / 環境定位的演算法基礎"
  - title: "Calabrese E, Taverni G, Awai Easthope C, Skriabine S, Corradi F, Longinotti L, Eng K, Delbruck T. DHP19: Dynamic Vision Sensor 3D Human Pose Dataset. CVPRW (IEEE/CVF), 2019."
    url: https://ieeexplore.ieee.org/document/9025364/
    tier: primary
    note: "首個公開的 DVS 人體 3D pose 資料集；17 受試者、33 種動作、4 台同步 DVS；3D pose error 約 8 cm（IEEE Xplore 收錄）"
  - title: "Du F, Shao Z, Wang X, Yang J, Dai J. A Joint Global and Local Temporal Modeling for Human Pose Estimation with Event Cameras (JGLTM). Sensors, 2025;25(9):2868."
    url: https://doi.org/10.3390/s25092868
    tier: primary
    note: "2025 年事件相機人體 pose 估計新方法；在公開 event-based pose 資料集上做 benchmark（PMID 40363305）"
  - title: "Wang Y, et al. Action Recognition and Benchmark Using Event Cameras. IEEE Trans Pattern Anal Mach Intell, 2023."
    url: https://ieeexplore.ieee.org/document/10198747/
    tier: primary
    note: "EV-ACT 框架與事件相機動作辨識基準資料集；IEEE TPAMI 收錄"
---

## 一、為什麼想寫這一篇

生物力學實驗室裡每個人都熟悉 Vicon / Qualisys 那種光學動作分析、IMU、力板、EMG，但 **event camera（事件相機）這個器材在台灣的 lab 還不算普及**——一方面是設備價格 / 取得管道的問題，一方面是它的**訊號型態跟一般相機差太多**，要重新學一套處理邏輯。

我自己這陣子讀了一些相關論文，覺得它有幾個特性對「動作分析 / 運動相關研究」確實有意義，特別是：

- 高速動作的瞬態量測（一般相機 fps 不夠）
- 低光 / 高動態對比場景（一般相機 over-/under-expose）
- 低功耗、隱私保留的長期居家監測

這篇要做的事：

1. 把 event camera 的**感測機制**講清楚
2. 整理四個**最常被引用的技術數字**，每個都附 IEEE Xplore / PubMed primary 引用
3. 列三個**動作分析與生物力學的可能應用方向**，並對應到具體的論文
4. 誠實列出**目前還沒成熟、值得審稿人挑的問題**

> **先說限制**：我自己**沒實際操作過 event camera 跑下肢生物力學實驗**，這篇是「整理現有文獻 + 標出可能切入點」，不是「使用心得」。實際採購 / 使用前請以官方文件與你親自測試結果為準。

## 二、Event camera 是什麼：感測機制的根本差異

### 一般相機 vs 事件相機

一般 RGB / monochrome 相機（frame-based camera）的工作方式是：以固定 frame rate（30 / 60 / 240 fps）對整個感光元件「同步曝光」一次，輸出一張完整 image。Event camera 完全不是這個模式——

用 Gallego 等人在 IEEE TPAMI（2022）survey 裡的講法摘要一下：事件相機是 bio-inspired 感測器，**不以固定 frame rate 拍照，而是讓每個 pixel 非同步地測量亮度變化，輸出一串事件流**——每筆事件編碼時間、座標、變化正負號 [ref: Gallego et al. 2022 IEEE TPAMI, https://doi.org/10.1109/TPAMI.2020.3008413]。

翻成生物力學研究者比較熟悉的講法：

- **每個 pixel 是獨立、非同步的感測元件**，類似獨立的微小亮度變化偵測器。
- 當某個 pixel 偵測到亮度（log intensity）變化超過一個閾值，**才會輸出一筆 event**；事件包含：時間戳 t、座標 (x, y)、極性 ±1（亮 / 暗變化）。
- **沒動作的場景 → 完全沒輸出**。
- **動作越快 / 對比越強 → 輸出 event 密度越高**。

這跟你習慣的 video 完全不一樣——它輸出的不是「圖」，而是「事件流（event stream）」。下游演算法（深度學習、optic flow、SLAM 等）都需要重新設計才能消化這種訊號 [ref: 同 Gallego 2022; Cimarelli et al. 2025 Sensors, https://doi.org/10.3390/s25196208]。

## 三、四個常被引用的關鍵技術數字

下面四個是讀任何 event camera 相關論文必會看到的特性，我把 Gallego 等人 2022 年 IEEE TPAMI survey 裡寫的具體數字摘出來：

### (1) 微秒級時間解析度

Event 的時間戳精度為**微秒（μs）等級**。 [ref: Gallego et al. 2022, https://doi.org/10.1109/TPAMI.2020.3008413]

具體意義：一般高速相機要做到等效時間解析度（μs 級單一事件偵測），需要極高 fps（>10 kHz）才能逼近，但這在傳統相機面臨儲存、計算、頻寬全面 bottleneck。

### (2) 動態範圍 140 dB

Event camera 的動態範圍可達 **140 dB**，相比之下傳統相機通常為 **60 dB**。 [ref: Gallego et al. 2022, https://doi.org/10.1109/TPAMI.2020.3008413]

具體意義：在日光直射跟陰影同時出現的場景（例如戶外田徑場、復健治療室裡的 sun spot、半開窗的居家環境）一般相機會局部過曝或過暗，而 event camera 仍能輸出有效訊號。

### (3) 低功耗、kHz 級 pixel bandwidth

Gallego 等人 2022 survey 描述事件相機具備低功耗、kHz 量級的 pixel bandwidth，因此 motion blur 大幅減少 [ref: 同上, https://doi.org/10.1109/TPAMI.2020.3008413]。

具體意義：適合做穿戴式 / 邊緣裝置，特別是長期居家或運動場域監測——不需要傳大量 frame 回伺服器，只需要傳事件流，**頻寬與電力預算都比 frame-based 低很多**。

### (4) 稀疏訊號 → 適合 spiking neural network 處理

Event camera 輸出的稀疏、非同步訊號型態，與 **spiking neural network（SNN）** 與 **neuromorphic processor**（如 Intel Loihi、IBM TrueNorth）天生匹配 [ref: 同上 Gallego 2022; Tenzin et al. 2024 Biomimetics, https://doi.org/10.3390/biomimetics9070444]。

具體實證：Ceolini 等人（2020，*Frontiers in Neuroscience*）做了一個 DVS + EMG 感測融合做手勢辨識的 benchmark，在 Loihi、ODIN+MorphIC 等 neuromorphic 平台上跑出與 GPU baseline 相當的分類精度，**但 energy-delay product 是 GPU 系統的 30× 到 600× 更省電**（推論時間慢 20–40%）。 [ref: Ceolini et al. 2020, https://doi.org/10.3389/fnins.2020.00637]

> **一句話總結這節**：Event camera 不是「更快的一般相機」，而是「一種訊號型態完全不同的感測器」。它不會取代 Vicon / GoPro / IMU，但在「一般相機做不到」的窄場景裡有獨特價值。

## 四、動作分析 / 生物力學的三個切入點

這節我把 event camera 對動作分析「比較有可能落地」的三個方向整理出來，每個都對應到具體論文。**這不是 William 的研究題目建議，只是「這個技術能解的痛點」清單**。

### 切入點 (a)：高速、瞬態動作的精確時間量測

#### 痛點

棒球揮棒、衝刺起步、跳躍著地、跑步腳跟著地的瞬間（< 50 ms）——這些是運動生物力學最關心的瞬態事件，但用 240 fps GoPro / 1000 fps 高速相機要付出儲存與後製代價，且需要精確光源同步。

#### Event camera 的角色

μs 級時間解析度 + 高動態範圍，**理論上能精確標定瞬態事件的時間點，且不會因為快速移動而 motion blur** [ref: Gallego et al. 2022, https://doi.org/10.1109/TPAMI.2020.3008413]。Sehara 等人（2019，*eNeuro*）的 DVS 系統就是一個實際示範：他們追蹤小鼠以 ~25 Hz 揮動的觸鬚，**用 event-driven 系統做到 2 ms 內的位置反饋觸發**——傳統 frame-based 影像處理 pipeline 很難達到這個延遲 [ref: Sehara et al. 2019, https://doi.org/10.1523/ENEURO.0147-19.2019]。

把這個概念搬到人類運動：人體 pose 估計與動作辨識在過去六年已經有一系列 peer-reviewed 工作。代表性的有 **DHP19**（Calabrese 等人 2019，IEEE/CVF CVPRW），首個公開的 DVS 人體 3D pose 資料集，**用 4 台同步 DVS 攝影機收 17 位受試者的 33 種動作，paper 中報告的 3D pose error 約為 8 cm** [ref: DHP19, https://ieeexplore.ieee.org/document/9025364/]；以及 EV-ACT（IEEE TPAMI）的事件相機動作辨識 benchmark [ref: Wang et al., https://ieeexplore.ieee.org/document/10198747/]、Du 等人 2025 年在 *Sensors* 提出的 JGLTM 方法 [ref: Du et al. 2025, https://doi.org/10.3390/s25092868]。把這條 pose 估計的精度進一步推進、並整合到下肢生物力學流程裡，是後續可以延伸的研究方向。

### 切入點 (b)：低光 / HDR 環境的居家監測

#### 痛點

老人居家跌倒、夜間意外、半開窗陽光斜射的客廳——一般 RGB 相機在這些場景下訊號常常不可用，但研究社群長期關心這些情境。

#### Event camera 的角色

140 dB 動態範圍意味著可以在「同一個畫面同時有強光與陰影」的情況下還能輸出有效事件 [ref: Gallego et al. 2022, https://doi.org/10.1109/TPAMI.2020.3008413]。再加上稀疏輸出特性，事件流相較於 RGB frame 不直接呈現顏色與紋理細節，**在「看到動作輪廓、但臉部紋理不清晰」的應用情境上有概念性的優勢**——這對居家監測這種介意被錄影的場景是個方向。

事件相機在跌倒偵測、家中監測、或長照場景，理論上有它的位置。

### 切入點 (c)：穿戴 / 邊緣裝置的低功耗動作感測

#### 痛點

穿戴式動作分析裝置最大限制是電池——加上 frame-based camera 模組功耗高，多數做不到全天 always-on。

#### Event camera 的角色

低功耗 + kHz 級 bandwidth + 稀疏輸出，特別適合穿戴 / 嵌入式場景 [ref: Gallego et al. 2022, https://doi.org/10.1109/TPAMI.2020.3008413]。Ceolini 等人 2020 的工作就是把 DVS 跟 EMG 整合，做手勢辨識；**他們的 30×–600× energy-delay product 改善是這個切入點的具體量化證據** [ref: https://doi.org/10.3389/fnins.2020.00637]。

把這個概念搬到生醫工程的研究題目：可以是 **prosthetic hand 控制**、**rehab exercise 計次**、**運動表現監測手環**——任何「需要動作偵測但不能背一塊大電池」的應用都是候選。

### 補一個尚未成熟但值得追的方向：3D 動作分析

事件相機的 stereo / 3D depth 估計在過去五年是熱門研究主題，2025 年 IEEE TPAMI 上 Ghosh & Gallego 做了一篇 survey [ref: Ghosh & Gallego 2025, https://doi.org/10.1109/TPAMI.2025.3586559]。**但 stereo event 演算法的精度與穩定度還沒到能取代光學 motion capture 的程度**——這篇 survey 自己也明確指出「accuracy 與 efficiency 都還有 gap」。如果你的研究需要替代 Vicon，現在還早；但如果是「補充訊號 + 用其他特性彌補光學系統的弱點」，就有空間。

## 五、評估事件相機適不適合你的研究時，可以注意的幾件事

這節不是「open problem 清單」，而是給打算試用事件相機的研究者一些務實的提醒：

1. **公開人體事件相機資料集偏通用 daily action**：DHP19 [ref: https://ieeexplore.ieee.org/document/9025364/]（17 受試者、33 動作、4 台 DVS）跟 EV-ACT 等動作辨識 benchmark [ref: https://ieeexplore.ieee.org/document/10198747/] 是目前最常用的公開資源，但它們的動作集合並不是專為 gait / running / 復健動作設計，所以如果你的應用題目偏臨床或運動科學，多數情況可能要自己錄資料。

2. **pose 估計精度跟光學 motion capture 還有差距**：DHP19 自報的 3D pose error 約 8 cm [ref: https://ieeexplore.ieee.org/document/9025364/]，Du 等人 2025 的 JGLTM 雖在 event-based 資料集上推進了精度 [ref: https://doi.org/10.3390/s25092868]，但還在 image-domain pose error 等級，跟 Vicon 的 sub-mm 仍差一個量級。**所以目前定位上比較像「補時間解析度」、不是「取代光學 motion capture 主訊號」**。

3. **採購可及性**：DVS / Prophesee / iniLabs 的硬體取得管道、價格、技術支援，相較 IMU / GoPro 沒那麼普及；這部分屬於現實限制，採購前直接問代理商比看文獻更有效。

## 六、總結：什麼樣的研究題目適合用 event camera

如果你正在想博士題目，下面三個 checklist 可以幫你判斷 event camera 是不是合適工具：

- ✅ 你關心的物理量是「**亮度有變化的瞬態事件**」（heel-strike、揮棒接觸點、肌肉抽搐）→ event camera 強項
- ✅ 你的場景是「**一般相機會 over/under expose**」（戶外、半逆光、夜間）→ event camera 強項
- ✅ 你需要「**長期、低功耗、不收完整 RGB 紋理**」的居家或穿戴監測 → event camera 強項
- ❌ 你需要「**任意時刻取得完整、可肉眼判讀的影像**」（讓 PT 治療師看著 video 評估動作品質）→ frame-based camera 仍是主流
- ❌ 你需要「**取代 Vicon 做 sub-mm 級 3D pose**」→ 目前還早

跟你現有的 toolchain 搭著用——例如「光學 mocap 主訊號 + event camera 補捕快速瞬態」，比「全套換成 event camera」現實得多。

---

**社群討論**：

- 你或你的 lab 有人實際操作過 event camera 嗎？採購 / 校正 / 標註的踩坑點是什麼？
- 對博士題目層級的應用，你會優先想到哪個方向？高速運動、居家監測、還是穿戴整合？

---

**[William 審稿筆記]**

- 全篇定位是「給生物力學研究者的事件相機介紹導引」，不是 open problems 號召文，也不是長期使用心得。
- 主要 primary 引用：Gallego 2022 IEEE TPAMI（核心技術數字）、Cimarelli 2025 Sensors（近期 review）、Sehara 2019 eNeuro（生物動作即時追蹤）、Ceolini 2020 Front Neurosci（DVS+EMG 融合）、DHP19 IEEE CVPRW 2019（人體 3D pose 資料集）、Du 2025 Sensors（JGLTM）、EV-ACT IEEE TPAMI（動作辨識 benchmark）、Ghosh & Gallego 2025 IEEE TPAMI（stereo 3D depth）、Tenzin 2024 Biomimetics（VSLAM）。
- 第四節 (b) 隱私敘述已軟化為「概念性優勢」，不再寫成已驗證；第六節 ✅ 列點原本寫的「隱私保留」也改為「不收完整 RGB 紋理」。
- 第五節由原本「open problem 清單」改寫為「打算試用前可以注意的事」；trim 了原 #2、#4 兩條較重的 open problem 段落。
- 整篇沒寫個人經歷（沒提到「我做過 X 個受試者」、「我用過 Prophesee 一年」這類）；如果你想加實作觀察請自己補。
