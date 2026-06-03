# 黃仁勳 COMPUTEX 2026 GTC Taipei 演講技術重點整理

> 整理時間：2026-06-03
> 演講時間：2026-06-01 上午 11:00（台灣時間）
> 演講地點：台北流行音樂中心（北流）
> 形式：NVIDIA GTC Taipei × COMPUTEX 2026 聯合主題演講，全程約兩小時

![Jensen Huang 在 COMPUTEX 2026 GTC Taipei 演講現場](https://www.servethehome.com/wp-content/uploads/2026/05/NVIDIA-Computex-2026-Keynote-Jensen-800x450.jpg)

*圖：黃仁勳於台北流行音樂中心發表 GTC Taipei 主題演講（來源：ServeTheHome 現場拍攝）*

---

## 一、整體框架：AI 的「五層蛋糕」架構

黃仁勳這次把 NVIDIA 對 AI 基礎建設的觀點具象成一個「五層蛋糕」分層：能源 → 晶片 → 基礎設施（資料中心/系統）→ 模型 → 應用生態系。這個架構同時是定位圖，也是 NVIDIA 自己的產品線地圖——從矽到 agent 都有對應產品。

對研究者來說，這張圖最直接的訊號是：NVIDIA 不再只把自己當作「賣 GPU 的」，而是把「整個 AI factory 的全堆疊」視為產品邊界。

## 二、資料中心硬體：Vera Rubin 正式進入量產

這場演講最具體的硬體訊息是 **Vera Rubin 平台正式進入 full production**。技術規格摘要：

- **Vera CPU**：88-core 設計，基於 NVIDIA 自家的 Olympus CPU core 架構，專為 AI agent 規模化執行（agentic AI at hyperscale）而設計
- **Rubin GPU**：採用 Rubin 架構
- **製程**：TSMC 3nm（相較於現行 Grace Blackwell 所用的 N4 製程，新一個世代）
- **量產時程**：2026 秋季開始出貨
- **組裝效率**：單一 Grace Blackwell rack 現在可以在 5 分鐘內組裝完成（演講中宣稱）

對台灣供應鏈而言，這條訊息直接連動 TSMC、台達電、廣達、緯穎等代工/系統廠的 2026 H2 訂單能見度。

## 三、下一代資料中心路線圖：Feynman 架構與光學 NVLink

Vera Rubin 之後，NVIDIA 下一個資料中心 GPU 架構代號為 **Feynman**（以理論物理學家 Richard Feynman 命名）。本次演講透露的技術細節：

- **Die stacking（晶片堆疊）**：用 3D 封裝堆疊提升每 socket 算力與密度
- **客製 HBM（high-bandwidth memory）**：自製 HBM 配置，擴大記憶體頻寬
- **共封光學 NVLink（co-packaged optics NVLink switches）**：Feynman 將是 NVIDIA 第一個導入 co-packaged optics 的世代——這是把光收發器直接和 switch IC 共封進同一個 package，大幅降低高速互連的功耗與延遲

NVIDIA 同時揭露了一顆新的資料中心 CPU 代號 **Rosa**，將與 Feynman 配對成下下世代平台。

## 四、PC 側新品：RTX Spark + Vera Rubin Spark 路線圖

NVIDIA 把資料中心級的 AI 算力下放到 PC 端：

- **RTX Spark**：把 CUDA、RTX 圖形堆疊與 NVIDIA 的 AI 平台整合到單一 superchip，定位是「Windows AI PC 的核心矽」
- **首波合作夥伴**：ASUS、Dell、HP、Lenovo、Microsoft Surface、MSI，2026 秋季上市
- **路線圖**：本次演講宣告了 RTX Spark 三世代路線——當前 Spark → Vera Rubin Spark（搭配 LPDDR6 記憶體）→ Rosa Feynman Spark（記憶體規格未公開）

對生醫工程研究者的意義：本地端跑中等規模模型（10–30B 參數）的門檻會在 2027 進一步下移，這對 IRB 不允許資料上雲的臨床研究情境是有用的訊號。

## 五、Physical AI：Cosmos 3 世界基礎模型

機器人與實體 AI 端，這次的旗艦產品是 **NVIDIA Cosmos 3**：

- **定位**：開放式世界基礎模型（open world foundation model）for physical AI
- **架構創新**：採用 mixture-of-transformers 架構，把「視覺推理 + 世界生成 + 動作預測」三項任務整合到單一系統內
- **應用情境**：人形機器人、自駕、AI factory 的 digital twin

這代表 NVIDIA 把過去分散在 Cosmos、Isaac、Omniverse 三條產品線的能力，往「單一 foundation model 多任務」的方向收斂。

## 六、Agentic AI 與 N1X 晶片

演講中另一個被點名的方向是 **agentic AI 的 harness 與基礎設施**：

- **N1X 晶片**：採用 Arm 架構的新晶片，鎖定 agentic AI 工作負載
- **架構主軸**：把 agent 的「記憶 + 工具呼叫 + 多步推理」的執行流，視為一種可被硬體加速的負載類型（類似當年 CUDA 之於圖形運算的定位轉換）

這條訊息和我們先前 5/25「Agent harness engineering」那篇剛好可以連起來看——產業界正在把「agent 外殼工程」從軟體層往下沉到硬體層。

## 七、對台灣產業與研究的三個觀察

1. **AMD 同期宣布百億級台灣投資**——COMPUTEX 2026 不只是 NVIDIA 的舞台，AMD 也在同檔期釋出對台投資加碼訊號，台灣作為 AI 全堆疊製造節點的地位在 2026 進一步強化
2. **法規節奏的落差**：硬體升級速度遠超過 TFDA / 健保署對 SaMD 與 AI 醫材的審查節奏（先前 5/13 SaMD 那篇有提到這個 gap）
3. **生醫研究的本地推論**：RTX Spark 三世代路線意味著 2027 前後，「本地跑 30B 參數模型 + 不上雲的醫療資料分析」會變成可行配置

---

## 引用來源

主要來源：
- [NVIDIA GTC Taipei 2026 Keynote 官方頁](https://www.nvidia.com/en-tw/gtc/taipei/keynote/) — 廠商公開資料
- [ServeTheHome — NVIDIA Computex 2026 Keynote Live Coverage](https://www.servethehome.com/nvidia-computex-2026-keynote-live-coverage/) — 第三方現場逐項紀錄（含本文照片來源）
- [ServeTheHome — Vera Rubin Now In Production, DGX Station Gets Windows](https://www.servethehome.com/nvidia-computex-2026-news-bytes-vera-rubin-now-in-production-dgx-station-gets-windows/)
- [Tom's Hardware — Nvidia updates data center roadmap with Rosa CPU and stacked Feynman GPUs](https://www.tomshardware.com/pc-components/gpus/nvidia-updates-data-center-roadmap-with-rosa-cpu-and-stacked-feynman-gpus-optical-nvlink-groq-lpus-with-nvfp4-and-nvlink-also-on-deck)
- [Tom's Hardware — RTX Spark Roadmap for Laptops and Desktop PCs](https://www.tomshardware.com/pc-components/cpus/nvidia-unveils-dgx-sparrk-roadmap-for-laptops-and-desktop-pcs-at-computex-2026-three-generations-outlined-rubin-followed-by-rosa-feynman)

中文媒體：
- [經濟日報 — COMPUTEX 大戲六巨頭釋風向，黃仁勳今談 Feynman 更多細節](https://money.udn.com/money/story/5612/9537253)
- [動區動趨 — COMPUTEX 2026 完整攻略：黃仁勳 GTC 必看](https://www.blocktempo.com/computex-2026-taipei-nvidia-jensen-huang-ai-robotics-keynote-guide/)
- [商周 — COMPUTEX 2026 6/2 登場](https://www.businessweekly.com.tw/focus/blog/3021537)

> 註：本整理為「演講技術重點摘要」用途，並非 AcadeBee 平台正式文章草稿。若要進一步發展成 industry 類發文，建議補上 1–2 篇 IEEE / arXiv 的同儕審查文獻支撐技術論述（例如 co-packaged optics 或 mixture-of-transformers 的學術源頭）。
