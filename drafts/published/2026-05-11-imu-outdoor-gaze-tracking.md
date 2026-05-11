---
id: imu-outdoor-gaze-tracking
category: method
title: 把眼動研究從實驗室搬到馬路上：2024 年最新的 IMU + 眼動 + AI 整合範例
excerpt: 2024 年 Moore 等人連發兩篇研究，把「IMU 步態資料 + 頭戴 eye tracker + YOLOv8 物件偵測」整合成巴金森症（PwPD）真實生活跌倒風險的評估管線。這篇圍繞這兩篇最新研究，拆解技術細節、量化結果、以及對生醫工程研究者的設計啟示。
publishedAt: 2026-05-11
readingTime: 8 分鐘
featured: false
sources:
  - title: "Moore J, Catena R, Fournier L, Jamali P, McMeekin P, Stuart S, Walker R, Salisbury T, Godfrey A. Enhancing fall risk assessment: instrumenting vision with deep learning during walks. J Neuroeng Rehabil. 2024;21(1):106."
    url: https://doi.org/10.1186/s12984-024-01400-2
    tier: primary
    note: "VARFA 演算法（YoloV8 物件偵測 + U-NET 路徑分割）；mAP50 = 0.93、路徑 IoU = 0.82；實驗室步態場景"
  - title: "Moore J, Celik Y, Stuart S, McMeekin P, Walker R, Hetherington V, Godfrey A. Using Video Technology and AI within Parkinson's Disease Free-Living Fall Risk Assessment. Sensors (Basel). 2024;24(15):4914."
    url: https://doi.org/10.3390/s24154914
    tier: primary
    note: "YoloV8 微調版（mAP50 = 0.81）+ 巴金森症患者焦點團體；探討倫理 / 隱私 / 接受度"
---

## 一、為什麼這篇要寫

傳統眼動研究幾乎都被「下巴墊 + 螢幕」綁死，但 IMU + mobile eye tracker 的組合正在把場景搬到真實世界。問題是：**眼動儀只告訴你受試者看哪個方向，IMU 只告訴你身體在動什麼**──兩者單獨用都解釋不了「為什麼這個人會跌倒」。

2024 年 Northumbria 大學的 Moore 團隊在兩本期刊連發兩篇研究，剛好把這個拼圖補上：用深度學習自動標注眼動影像裡的「環境物件」與「行走路徑」，再跟 IMU 的步態訊號合起來，產出一個可在病人家中跑的跌倒風險評估管線。這篇圍繞這兩篇最新研究展開。

> **與前文的關係**：之前那篇〈眼動訓練對運動員表現提升的證據與方法〉討論的是「眼動訓練的效果」，本文則是「如果你想在病人真實生活場景量眼動 + 動作，技術上要怎麼做」──兩者互補。

---

## 二、第一篇：用深度學習給眼動影像「貼標籤」

### 研究問題

Moore 等人（2024）在 *Journal of NeuroEngineering and Rehabilitation* 提出了 **VARFA（Visual Attention and Risk Factors during Activity）**：用 YOLOv8 自動偵測眼動儀拍到的影像中的物件、再用 U-NET 把行走路徑切出來 [ref: https://doi.org/10.1186/s12984-024-01400-2]。

為什麼這值得做？IMU 可以告訴你「步態變慢了」，但**慢的原因**可能是：地上有障礙物？光線變暗了？前面有人擋路？傳統做法是研究員手動看每一秒的影像──成本高、主觀、無法在臨床落地。

### 量化結果

- **物件偵測**：YoloV8 在實驗室步態資料集上達到 **mAP50 = 0.93**，平均偵測準確度約 93% [ref: https://doi.org/10.1186/s12984-024-01400-2]
- **路徑分割**：U-NET 預測的行走路徑與真實路徑的 **IoU（intersection over union）= 0.82**，重疊度 82% [ref: https://doi.org/10.1186/s12984-024-01400-2]
- **即時性**：兩個模型都能在 real-time 速度下處理影像，足以在配戴期間連續分析 [ref: https://doi.org/10.1186/s12984-024-01400-2]

### 技術細節值得注意的點

1. **資料集是新建的**：作者特別建立了一個 lab-based 的步態場景資料集來訓練模型──這暗示著「現成的 COCO / ImageNet 模型不能直接用」，因為眼動儀的視角、光線、構圖跟一般網路圖片差很多。對生醫工程研究者來說，這代表 **眼動 + 物件偵測的整合往往需要客製化資料集**，不能拿開源模型套用了事。
2. **mAP50 vs IoU 的差異**：mAP50 是物件偵測的精度（「有沒有看到這個物件」），IoU 是分割的精度（「邊界畫得多準」）。如果你的研究只需知道「環境中有沒有障礙物」，0.93 的 mAP50 已經夠；但如果要計算「障礙物與行走路徑的距離」，那 IoU 0.82 的邊界誤差會直接影響距離估計準度。

---

## 三、第二篇：把演算法搬到病人家中

### 研究問題

第一篇證明了「演算法行得通」，但真實落地還有兩個問題：**演算法對巴金森症（PwPD）患者家中環境的泛化能力**、以及**病人願不願意全天配戴一台會錄影的眼鏡**。

Moore 等人（2024）在 *Sensors* 同時處理了這兩件事 [ref: https://doi.org/10.3390/s24154914]。

### 量化結果

- 微調過的 YoloV8 在 PwPD free-living 場景的物件偵測 **mAP50 = 0.81** [ref: https://doi.org/10.3390/s24154914]
- 與第一篇實驗室場景的 0.93 相比，**真實世界場景的精度下降了約 13 個百分點**──這是「lab-to-real-world」泛化落差的典型量級

### 病人接受度（focus group 質性分析）

這篇研究最特別的部分不是演算法，而是它**做了 PwPD 的焦點團體訪談**，整理出兩個核心發現 [ref: https://doi.org/10.3390/s24154914]：

1. **「人因設計」是接受度的關鍵**：受訪者偏好「外觀像一般眼鏡的 ergonomically designed wearable video glasses」──低調、不像研究設備，才能在公共場合配戴而不引起異樣眼光
2. **AI 處理流程的「控制權」是隱私關鍵**：受訪者要求自己對 AI 怎麼處理影像、誰能看到原始資料有控制權；換句話說，**單純強調「演算法準度」是不夠的，使用者體驗的設計同等重要**

### 對研究者的啟示

如果你要做類似的 IMU + 眼動 + AI 系統：

- **演算法精度的「lab → 真實世界」會打 ~13% 折扣**。在規劃 power analysis 時要把這個落差納入考量
- **倫理 / 隱私 / 配戴體驗的設計不可外包**。Moore 團隊把焦點團體訪談放進研究主軸，是值得學的做法

---

## 四、給生醫工程研究者的 takeaway

從這兩篇 2024 年研究，可以萃取出幾個可操作的設計原則：

- **「光只有 IMU」不夠**：步態變慢的原因可以是視覺刺激、環境障礙、注意力分配──沒有同步的眼動資料就只能猜
- **「光只有 eye tracker」也不夠**：眼動儀本身不知道身體是否在動、地面是否平坦、患者是否在轉彎避障
- **「IMU + 眼動 + AI」是 2024 年的新做法，但 lab-to-real-world 仍有 ~13 個百分點的泛化落差**
- **倫理 / 隱私 / 配戴體驗是落地關鍵**，不是錦上添花

對於正在規劃博士論文題目、想在臨床步態研究裡加入「真實場域眼動」的研究者，這兩篇是目前可以看到最完整的方法論示範。

---

*本文圍繞 2024 年最新的兩篇 peer-reviewed 研究展開，所有具體數字均附 DOI。*
