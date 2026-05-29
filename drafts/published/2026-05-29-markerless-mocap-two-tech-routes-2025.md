---
id: markerless-mocap-two-tech-routes-2025
category: method
title: Markerless motion capture 的兩條技術路線：2025 兩篇 J Biomech 研究的方法與結果
excerpt: 2025 年 Journal of Biomechanics 連刊兩篇 markerless 驗證研究——一篇用 2D + DeepLabCut 比較不同訓練資料比例在學步兒與成人身上的效度；另一篇用單一消費級深度攝影機開發 3DGait 系統並以 TUG 測試驗證。本文整理兩篇研究的方法細節與量化結果。
publishedAt: 2026-05-29
readingTime: 12 分鐘
featured: false
sources:
  - title: "From marker to markerless: Validating DeepLabCut for 2D sagittal plane gait analysis in adults and newly walking toddlers"
    url: https://doi.org/10.1016/j.jbiomech.2025.112708
    tier: primary
    note: "Verhoeven et al., Journal of Biomechanics, 2025；15 toddlers + 16 adults 雙族群驗證"
  - title: "Artificial intelligence-enhanced 3D gait analysis with a single consumer-grade camera"
    url: https://doi.org/10.1016/j.jbiomech.2025.112738
    tier: primary
    note: "Guo et al., Journal of Biomechanics, 2025；3DGait 單深度攝影機 + TUG 場景"
---

## 一、為什麼需要 markerless motion capture

### Marker-based 系統的限制

長期以來，臨床步態分析與運動科學研究的黃金標準是 **3D marker-based motion capture**：在受試者身上反光球標記點，用多台校正過的紅外線攝影機追蹤這些標記點的 3D 位置，再以逆向運動學求解關節角度與軌跡。Vicon、OptiTrack、Qualisys 等系統的角度量測精度可以做到 1° 以內，是過去三十年生物力學量測的主力工具。

但這套流程在實務上有幾個結構性限制 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708] [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]：

第一，**設備成本高**：一套 marker-based 系統的硬體成本動輒新台幣數百萬至千萬，限制其在實驗室以外的可近性。
第二，**場域限制**：系統需要固定校正、特定背景與光源條件，幾乎只能在實驗室內運作，難以搬到病房、家庭、運動場域。
第三，**人力需求**：標記點貼附需要解剖學訓練、追蹤標記點掉落與雜訊也需要技術員處理，一次完整評估常需 30–60 分鐘。
第四，**部分族群難以執行**：兒童、術後病患、認知功能受限的長者，難以接受長時間的標記點貼附流程，影響資料品質與招募效率。

### Markerless 路線的興起

近十年隨著深度學習人體姿態估測（pose estimation）的快速進展，**markerless motion capture** 成為一條積極發展的替代路徑——僅需 RGB 影片或消費級深度攝影機，透過 OpenPose、DeepLabCut、Theia3D、OpenCap 等工具進行關鍵點偵測，再轉換為關節角度與運動學參數。

Markerless 路線的核心承諾有三：取消標記點貼附流程、降低硬體成本、把步態分析從實驗室搬到更生態（ecological）的場域。但要把這個承諾兌現，前提是 markerless 系統需要與 marker-based 黃金標準**做嚴謹的同步效度驗證**，並清楚描述其在不同族群、不同關節平面與不同動作場景下的表現。

2025 年 *Journal of Biomechanics* 連刊兩篇 markerless 效度驗證研究，剛好分別對應兩條主要技術路線：**Verhoeven 等人**走 2D + DeepLabCut 自訓模型路線 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]，**Guo 等人**走 3D + 單一消費級深度攝影機整合系統路線 [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]。以下分別整理兩篇研究的方法細節與量化結果。

## 二、主研究 1：Verhoeven 等 2025 — 2D DeepLabCut 在成人與學步兒的效度

### 研究設計

Verhoeven 等人這篇針對 DeepLabCut 在 **2D 矢狀面（sagittal plane）步態分析**的效度進行驗證 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]。

受試者分兩個族群：

- **15 名學步兒（toddlers）**：正在進行人生中第一批獨立行走的兒童
- **16 名健康成人**

兩種行走條件：

- **地面行走（overground）**：自選舒適速度
- **跑步機行走（treadmill）**：自選舒適速度

每位受試者皆同步使用 3D marker-based 系統（Vicon）作為 ground truth 進行對照量測 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]。

### 技術方法

作者從 2D 矢狀面影片中以 DeepLabCut 抽取下肢解剖標誌點，再以這些標誌點計算下肢步態運動學（gait kinematics），最後與同步取得的 3D marker-based 系統結果做比對 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]。

為了釐清「訓練資料量」對效度的影響，作者刻意設計了兩種訓練策略：

- **25% 模型**：以四分之一的受試者影片作為 DeepLabCut 網路訓練輸入
- **75% 模型**：以四分之三的受試者影片作為訓練輸入

兩個模型分別在兩個族群（成人、學步兒）與兩種條件（地面、跑步機）上做效度評估。

### 量化結果

**25% 模型**：

- 在**成人關節角度**上表現良好
- 在**臨床參數**與**學步兒族群**上表現不佳 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]

**75% 模型**：

- 在兩個族群上，多數時間正規化（time-normalized）關節角度與臨床參數均達到 **ICC ≥ 0.60（good）或 ≥ 0.75（excellent）的絕對一致性** [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]
- 相較 25% 模型，Pearson 相關係數提高、RMSE 下降、R 值增加 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]

**族群與條件層次的結果**：

- **成人組的效度高於學步兒組** [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]
- **跑步機行走的效度高於地面行走** [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]

### 研究結論

作者結論：在訓練資料輸入足夠多元的前提下，DeepLabCut 是一個有效工具，可用於取得已知場景的步態運動學參數，並具備在更生態與自然環境下研究典型成人與學步兒步態的潛力 [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]。

## 三、主研究 2：Guo 等 2025 — 3DGait 單一消費級深度攝影機系統

### 研究設計

Guo 等人開發了一套名為 **3DGait** 的 AI 增強 markerless 3D 步態分析系統，特色是**僅需一台消費級深度攝影機**，不需多攝影機陣列、不需固定校正、不需特定相機擺位 [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]。

驗證對象：8 名健康成人，共 16 次 Timed Up and Go（TUG）測試試驗。

Ground truth 系統：OptiTrack marker-based motion capture [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]。

### 技術方法

3DGait 整合進階機器學習演算法，可從單一深度攝影機影片中產出 **49 個常見的角度、空間與時間步態 biomarker**（涵蓋移動性分析常用指標）[ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]。

設計上不需要受試者貼附 marker、不需事前校正、不限制相機擺放位置，目標是讓系統能在非專科診所與居家場域使用。

### 量化結果

**角度 biomarker**：

- **平均 MAE（mean absolute error）= 2.3°**
- **所有 MAE 均小於 5.2°**
- **Pearson 相關係數（PCC）= 0.75** [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]

**時空 biomarker（spatiotemporal）**：

- **所有誤差皆 ≤ 15%** [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]

**時間性 biomarker（不含 TUG 完成時間）**：

- **誤差 < 0.03 秒**，相當於 30 fps 影片的一個 frame [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]

### 研究結論

作者結論：3DGait 相對於 marker-based MoCap 系統，可提供臨床可接受的步態指標，同時去除標記點、校正流程與固定相機擺位的需求；其單攝影機、非侵入性的設計，使其適合在非專科診所與居家場域使用，可支援病患追蹤與慢性病管理。未來研究將驗證 3DGait 在更多元族群（含步態異常者）的表現，以擴展其臨床應用範圍 [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]。

## 四、兩篇研究的並列整理

把兩篇研究的方法與結果並列如下：

| 項目 | Verhoeven 2025 | Guo 2025 |
| --- | --- | --- |
| 期刊 | Journal of Biomechanics | Journal of Biomechanics |
| 輸入裝置 | 一般 RGB 影片 | 消費級深度攝影機（單台） |
| 維度 | 2D 矢狀面 | 3D |
| 核心技術 | DeepLabCut 自訓模型 | 3DGait 整合式 AI 系統 |
| 樣本 | 15 toddlers + 16 adults | 8 healthy adults，16 次 TUG |
| Ground truth | Vicon | OptiTrack |
| 動作場景 | overground + treadmill walking | TUG test |
| 主要指標 | ICC、Pearson、RMSE | MAE、PCC、相對誤差% |
| 代表性結果 | 75% 訓練模型在多數參數 ICC ≥ 0.60–0.75 | 角度 MAE 2.3°、PCC 0.75；時空誤差 ≤ 15%；時間誤差 < 0.03 s |

兩篇研究分別代表 2025 年 markerless motion capture 在生物力學量測上的兩個發展方向：**Verhoeven 著眼於開源 DeepLabCut 框架在不同訓練資料規模、不同年齡族群、不同行走場景下的效度刻畫** [ref: Verhoeven et al. 2025, DOI 10.1016/j.jbiomech.2025.112708]；**Guo 著眼於以單一消費級感測器整合 AI 演算法，建立一套面向臨床部署的端到端 3D 步態分析系統** [ref: Guo et al. 2025, DOI 10.1016/j.jbiomech.2025.112738]。

## 五、結語

從 marker-based 到 markerless 的技術過渡，背後驅動因素是降低硬體成本、移除標記點貼附流程、把步態分析從實驗室搬到更貼近日常生活的場域。2025 年這兩篇 *Journal of Biomechanics* 的研究分別針對「自訓 2D pose estimation」與「單一深度攝影機 3D 系統」兩條主要技術路線，提供了對應的方法描述與量化效度資料。對於有意了解 markerless 目前技術現況的研究者而言，這兩篇可作為近期文獻的起點，後續可再對照各自系統在病理族群、其他關節平面以及其他動作任務上的延伸驗證。

---

*本文整理 2025 年兩篇 Journal of Biomechanics 同年研究。所有量化數字皆來自兩篇已同儕審查的論文，已附 DOI。*
