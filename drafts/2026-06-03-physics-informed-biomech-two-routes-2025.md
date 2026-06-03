---
id: physics-informed-biomech-two-routes-2025
category: method
title: Physics-informed neural network 怎麼把生物力學常識塞進深度學習：2025 兩篇研究的兩條路線
excerpt: PINN 不是把物理方程「丟」進 loss 就結束。本篇從 2025 兩篇剛上線的同儕審查研究（Yu 2025 Gait & Posture、Guo 2025 IEEE TNSRE）拆出兩條落地路線：用 physics 當「解耦約束」把單塊力板拆成雙腳 GRF，與用 physics 當「感測器降維約束」把 4 顆以上 IMU 壓到 2 顆，並對照 Ma 2025 PITCN 在股骨內力估計上的延伸應用。
publishedAt: 2026-06-03
readingTime: 11 分鐘
featured: false
sources:
  - title: "Yu et al. 2025 — A physics-informed deep learning approach to predicting bilateral ground reaction forces and centre of pressure from a single forceplate during gait (Gait & Posture)"
    url: https://doi.org/10.1016/j.gaitpost.2025.07.005
    tier: primary
    note: "NTU 生醫工程團隊，315 人 6765 trials"
  - title: "Guo et al. 2025 — Physics-Informed Learning Framework for Lower Limb Kinematic Prediction With Sparse Sensors and Its Application in Chronic Stroke (IEEE TNSRE)"
    url: https://doi.org/10.1109/TNSRE.2025.3581352
    tier: primary
    note: "2 IMUs + TCN + 幾何物理約束"
  - title: "Ma et al. 2025 — Design of a Portable Biofeedback System for Monitoring Femoral Load During Partial Weight-Bearing Walking (IEEE TNSRE)"
    url: https://doi.org/10.1109/TNSRE.2025.3540062
    tier: primary
    note: "PITCN 估計股骨內力，部分負重步行回饋"
---

## 一、為什麼這篇要寫 PINN：純資料驅動的盲區

在 IMU → GRF 系列（前篇 2026-06-01 拆解了架構優化路線與自監督學習路線）之後，我一直在等一條「不一定要更多資料」的路線。Physics-informed neural network（PINN）就是其中一個答案：把生物力學裡早就有的剛體動力學、關節幾何、質量守恆等限制，當成 loss 的一部分或網路結構的約束，逼模型在訓練時無法「為了像 ground truth 而違背物理常識」。

2025 上半年一口氣出現了三篇同儕審查的應用研究，剛好示範三種把 physics 塞進網路的方式。本文挑兩條最具方法論代表性的路線拆開講，第三篇做延伸應用對照。

## 二、路線 A：用 physics 當「解耦約束」——單塊力板拆出雙腳 GRF

第一篇來自台大生醫工程與骨科聯合團隊。臨床步態分析的標準做法是兩塊力板、雙腳分別踩，但對神經肌肉骨骼疾患而言，這個「分腳踩」動作本身會誘發 trial 失敗或步態改變。Yu 2025 直接問：可不可以只用一塊力板，把 double-contact 階段的合力訊號拆回左右兩腳？[ref: 10.1016/j.gaitpost.2025.07.005]

### 方法重點

- 模型：Physics-Informed Residual Recurrent Neural Network（PI-ResRNN），核心是 residual RNN 殘差結構，physics 約束扮演 decomposition 限制角色 [ref: 10.1016/j.gaitpost.2025.07.005]
- 資料規模：315 人、共 6765 次 trial，涵蓋健康者與六類神經肌肉骨骼疾病患者 [ref: 10.1016/j.gaitpost.2025.07.005]
- 任務：在 double-contact 階段，把單力板量到的合 GRF 與合 COP，拆解成左右腳各自的 GRF 三向量（vertical / anteroposterior / mediolateral）與 COP

### 量化結果

PI-ResRNN 在三個方向 GRF 的 mean relative RMSE 分別是 vertical < 0.34%、anteroposterior < 0.38%、mediolateral < 0.56%；雙腳 COP 的 mean RMSE < 3.0 mm [ref: 10.1016/j.gaitpost.2025.07.005]。更重要的是，這個模型在族群間統計差異的偵測上，與雙力板 ground truth 的結果一致——也就是說，臨床上原本要分析「健康 vs. 患者」的 between-group 差異，用單力板 + PI-ResRNN 不會跑出與雙力板版本不同的結論 [ref: 10.1016/j.gaitpost.2025.07.005]。

### 為什麼這條路線值得記住

它示範了一種把 physics 約束「用在輸出空間」的做法：不是去算 ODE 殘差，而是把「左右腳力的和必須等於合力」這個 trivially 成立的物理關係，轉成網路結構（residual + recurrent）的歸納偏置。這條路線最適合的情境是——你的量測本身是某個合成量，你想拆回組成分量，而且分量之間有清楚的物理約束。

## 三、路線 B：用 physics 當「感測器降維約束」——把 4+ IMU 壓到 2 IMU

第二篇來自東北大學 Hayashibe 團隊。臨床慢性中風患者的下肢運動學監測，傳統 IMU 方案常需要 4 顆以上感測器才能涵蓋大腿、小腿、足部與骨盆——患者每天日常生活中要戴這麼多感測器並不實際。Guo 2025 把目標訂在：能不能只用 2 顆 IMU，把預測精度逼近 4+ IMU 配置？[ref: 10.1109/TNSRE.2025.3581352]

### 方法重點

- 模型：Temporal Convolutional Network（TCN）作為主幹，PINN 約束來自人類步態建模衍生的幾何物理關係 [ref: 10.1109/TNSRE.2025.3581352]
- 物理嵌入位置：在訓練階段把幾何物理約束加進 loss，限制網路在「IMU 量測 → 關節角度」的映射不能違反人體連桿幾何
- 受試者：6 名健康者 + 17 名慢性中風患者 [ref: 10.1109/TNSRE.2025.3581352]

### 量化結果

只用 2 顆 IMU 的 PINN-TCN，在下肢關節角度預測上達到了「與使用 4 顆以上 IMU 的非物理約束方法相當」的準確度 [ref: 10.1109/TNSRE.2025.3581352]。論文本身沒有揭露具體 RMSE 對照數字 [待補引用]，但兩組 sensor 數量在統計效能上「comparable」的結論已被審稿驗證。

### 為什麼這條路線值得記住

它示範了 physics 在「輸入空間」當降維約束的用法。實務上對穿戴式臨床監測，每少一顆 IMU 就意味著少一個充電節點、少一次 misplacement 風險、少一個讓使用者放棄的理由。PINN 在這條路線上的價值不是「準確度更高」，而是「在相同準確度下用更少感測器」——這是一個工程上很值錢的等價交換。

## 四、延伸應用對照：PITCN 估計股骨內力

第三篇 Ma 2025 把同樣的 physics-informed TCN（PITCN）概念延伸到「無法直接量測的內部變數」：股骨在部分負重步行（partial weight-bearing, PWB）下的內力 [ref: 10.1109/TNSRE.2025.3540062]。傳統 GRF 量測對外部地面反作用力很準，但患者真正關心的——癒合中的股骨承受多少力——並沒有辦法直接讀。

### 關鍵發現

- PITCN 比兩種非物理 ML baseline 在股骨內力預測上效能更好 [ref: 10.1109/TNSRE.2025.3540062]
- 12 名受試者的資料顯示：股骨內力的峰值穩定地高於 GRF 峰值，且兩者峰值出現時間並不一致 [ref: 10.1109/TNSRE.2025.3540062]
- 這個發現直接挑戰了「監測 GRF 就等於監測股骨負荷」的臨床假設

PITCN 路線適合的情境是——當你想預測一個「永遠拿不到 ground truth 但有清楚力學模型」的內部變數時，物理嵌入幾乎是必選項，因為純資料驅動連訓練目標都沒有。

## 五、三條路線的 takeaway 對照

把三篇放一起看，physics-informed 在 2025 的生醫應用大致可以分成三種嵌入位置：

第一種，輸出端 decomposition 約束（Yu 2025 PI-ResRNN）——適合合成量拆分量；第二種，輸入端感測器降維約束（Guo 2025 PI-TCN）——適合穿戴式臨床監測；第三種，內部不可量測變數預測（Ma 2025 PITCN）——適合需要力學模型補無監督真值的內力估計。

## 六、對研究者的 takeaway

如果你的研究在 2026 下半年要碰 PINN，這三條路線給出的決策樹是清楚的：

先問你的問題屬於「拆合成量」「降維 sensor」還是「估不可量測內力」哪一類；如果答案是其中之一，PINN 比再多堆資料的純 DL 路線更值得投資。如果你的問題不在這三類，例如只是「現有資料做分類做不準」，那 PINN 不一定是對的解，先檢查 architecture、特徵工程與資料品質可能更務實。

另外值得提醒的是——三篇研究的 physics 嵌入方式都不是公式級可重現的細節 [待補引用 — 三篇論文皆未提供完整 physics loss 表達式於可公開讀取的位置]，要實作得自己對應論文 supplementary 或聯絡作者。這也是 PINN 領域目前最常見的 reproducibility 痛點。

---

註：本文引用的三篇研究皆為 2025 同儕審查發表，主研究為 Yu et al. 2025 Gait & Posture 與 Guo et al. 2025 IEEE TNSRE，延伸應用對照為 Ma et al. 2025 IEEE TNSRE。所有 DOI 連結見 frontmatter sources。
