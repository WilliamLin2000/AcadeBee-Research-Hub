---
id: imu-grf-estimation-two-routes-2024-2025
category: method
title: IMU 估計地面反作用力（GRF）的兩條 2024–2025 路線：架構優化 vs. 自監督學習
excerpt: 把 GRF 從力板搬到穿戴 IMU 是過去兩年最熱的方法論題目之一。本文挑兩篇互補的同儕審查研究：Chen 2025（CNN-BiGRU-Attention + ACLR 患者三任務）走「架構優化」路線；Tan 2024（IEEE TBME，自監督預訓練）走「資料效率」路線。看完你會知道下一個案子該往哪邊投資。
publishedAt: 2026-06-01
readingTime: 9 分鐘
featured: false
sources:
  - title: "Wearable monitoring for rehabilitation: Deep learning-driven vertical ground reaction force estimation for anterior cruciate ligament reconstruction (Chen et al., Clin Biomech 2025)"
    url: https://doi.org/10.1016/j.clinbiomech.2025.106663
    tier: primary
  - title: "Self-Supervised Learning Improves Accuracy and Data Efficiency for IMU-Based Ground Reaction Force Estimation (Tan et al., IEEE Trans Biomed Eng 2024)"
    url: https://doi.org/10.1109/TBME.2024.3361888
    tier: primary
  - title: "Consumer-priced wearable sensors combined with deep learning can be used to accurately predict ground reaction forces during various treadmill running conditions (Carter et al., PeerJ 2024)"
    url: https://doi.org/10.7717/peerj.17896
    tier: primary
    note: 互補背景：消費級 IMU + 鞋墊壓力陣列 + LSTM 的 50 人 treadmill 驗證
---

## 一、為什麼這題在 2024–2025 突然熱起來

「用穿戴式 IMU 取代實驗室力板來估 GRF」這個題目其實提了十年以上。早期是回歸模型 + 手工特徵，後來換成 LSTM／CNN，但長期卡在兩個瓶頸：第一，臨床族群（術後復健、老人、病患）的資料量永遠不夠；第二，運動越複雜（跑步、上下樓、跳落）模型準度掉得越快。

過去 18 個月有兩條方向同時成熟：一條繼續推架構（attention、跨時序建模），另一條換思路用自監督學習（SSL）解標籤稀缺。本文挑這兩條路線各一篇代表性研究來對照。挑選原則：兩篇都是 2024–2025 的同儕審查、開源或公開可重現、量化結果清楚到可以直接拿來做專案決策。

## 二、路線 A — 架構優化：Chen 2025（Clinical Biomechanics）

Chen et al. 2025 在前十字韌帶重建（ACLR）術後復健場景做了一個直接對照：找 25 名 ACLR 病患，同步穿戴下肢 IMU + Vicon 光學動作捕捉 + 力板，做三個日常動作 — 平地走、跑、下樓梯 — 各蒐集對應的下肢 kinematics 與垂直 GRF（vGRF）資料 [ref: 10.1016/j.clinbiomech.2025.106663]。然後比三個深度學習架構，挑出表現最好的 **CNN-BiGRU-Attention**。

結果（與光學系統 + 力板測得的 vGRF 比對的相關係數 R）：

- 走路：R = 0.953 ± 0.006
- 跑步：R = 0.971 ± 0.005
- 下樓梯：R = 0.979 ± 0.003

[ref: 10.1016/j.clinbiomech.2025.106663]

有兩個觀察值得留意。第一，**跑步和下樓梯反而比走路準**。作者的解釋是衝擊性動作的 vGRF 訊號特徵更明顯，IMU 加速度量級大、訊噪比好，模型抓得到結構。走路反而 GRF 變化平緩、被姿勢漂移和軟組織抖動稀釋，是難題。第二，**這是臨床族群**，不是健康年輕受試者。對研究設計者來說，這代表「在 ACLR 患者上跑得動」的證據，比同類在健康族群跑出來的數字更有臨床意義。

方法層面值得抄回去的，是這個 CNN-BiGRU-Attention 的結構選擇：CNN 抓區域 kinematics 特徵、BiGRU 處理雙向時序、Attention 加權步態週期內不同 phase 的貢獻。如果你手邊有 IMU + 同步 GRF 的小型臨床資料集（< 30 人），這個架構是 2025 的合理起點。

## 三、路線 B — 資料效率：Tan 2024（IEEE TBME）

Tan et al. 2024 把問題從「我要更好的架構」改成「我要更少的標籤」。理由很實際：GRF 標籤必須在實驗室力板上量，每多收一個受試者就要一次完整 lab visit，成本高、難 scale。如果可以利用未標註的 IMU 大資料集做預訓練，再用少量標註資料 fine-tune，就解了臨床落地的痛點。

他們用的方法是 **masked transformer self-supervised learning**：隨機遮掉一段 IMU 訊號，讓 transformer 重建被遮的部分。預訓練資料含真實 IMU 與合成 IMU 兩類。預訓練完成後再用 GRF 標籤資料做 fine-tune，做三個任務：overground 走路、treadmill 走路、drop landing [ref: 10.1109/TBME.2024.3361888]。

兩個核心數字：

- 在相同標籤量下，SSL 預訓練模型估 3 軸 GRF 的準度顯著優於傳統 supervised baseline [ref: 10.1109/TBME.2024.3361888]。
- 用 **1–10% 的走路標籤資料 fine-tune**，可以達到 baseline 用 **100% 標籤資料** 訓練的同等準度 [ref: 10.1109/TBME.2024.3361888]。
- 最佳遮罩比例（masking ratio）落在 **6.25–12.5%**，比 NLP 領域常見的 15% 略低 [ref: 10.1109/TBME.2024.3361888]。

這個發現對研究設計的意義很大：如果你打算做 IMU-GRF 估計，過去的隱性假設是「越多 paired lab data 越好」，現在的合理路徑反而是「先用所有手邊未標註的 IMU 訊號做 SSL 預訓練，再用最小規模的 paired data fine-tune」。Tan et al. 也把模型與程式碼開源，意味著別的實驗室可以從這個 pre-trained backbone 開始接自己的下游任務。

## 四、兩條路線如何互補

把兩篇放在一起看，會發現它們其實不是競爭關係，是組合關係：

| 維度 | Chen 2025（路線 A） | Tan 2024（路線 B） |
|---|---|---|
| 主要創新 | 架構（CNN-BiGRU-Attention） | 訓練策略（SSL pre-training） |
| 目標族群 | ACLR 復健臨床 | 健康族群 + 走路 / 跳落 |
| 標籤需求 | 高（需 paired GRF） | 低（1–10% 即可達 baseline 100% 表現） |
| 任務複雜度 | 多任務（走/跑/下樓） | 多任務（overground / treadmill / drop landing） |
| 開源程度 | 文中未明示 | 開源 code + model |

如果你正在規劃下一個 IMU + AI 案子，這兩篇給的工程化路徑大致是：

1. 先用 Tan 2024 的 SSL backbone 把未標註 IMU 資料的價值榨出來
2. 在目標臨床任務上接 Chen 2025 風格的 CNN-BiGRU-Attention head
3. 用最小規模 paired GRF data fine-tune

這條路徑能同時拿到「資料效率」與「複雜動作準度」兩個好處。當然，是否真的疊加有效是經驗問題 — 但至少現在你有兩篇對照組可以驗證自己的 baseline。

## 五、給研究者的 takeaway

第一，**「我資料少」不再是 GRF estimation 題目的萬用藉口**。SSL 的證據已經夠強到可以要求審稿人把這條路徑列入 minimum baseline。

第二，**臨床族群（病患/老人/兒童）的 IMU-GRF 研究數量還是少**。Chen 2025 給的是 ACLR 25 人這個尺度的證據，意味著如果你能在其他臨床族群（中風、帕金森、人工關節術後）做出類似驗證，題目本身就有發表價值。

第三，**架構選擇開始收斂**。CNN + 雙向時序 + attention 這三件套在多個 2024–2025 的 IMU-kinetics 研究都出現（包括 Carter 2024 的 LSTM + 鞋墊 + IMU 跑步 GRF 驗證，rRMSE 約 3.1–3.2%，n=50 [ref: 10.7717/peerj.17896]）。如果你要提自己的新架構，請給出明確的 ablation 證明它比 CNN-BiGRU-Attention 在哪個 phase 真的更好，否則審稿人會問「為什麼不直接用標準三件套」。

---

**Source attribution**：本文研究內容皆依 PubMed 索引之同儕審查論文撰寫。Chen et al. 2025 [DOI](https://doi.org/10.1016/j.clinbiomech.2025.106663)、Tan et al. 2024 [DOI](https://doi.org/10.1109/TBME.2024.3361888)、Carter et al. 2024 [DOI](https://doi.org/10.7717/peerj.17896)。
