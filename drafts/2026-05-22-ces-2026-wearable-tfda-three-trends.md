---
id: ces-2026-wearable-tfda-three-trends
category: industry
title: 從 CES 2026 看穿戴式裝置三個趨勢：台灣 TFDA 法規節奏對得上嗎
excerpt: CES 2026 健康科技焦點落在智慧戒指、AI 連續監測與居家健康作業系統。對照 TFDA 2025 年 8 月修訂的 AI/ML CADe/CADx 技術指引，台灣的法規節奏其實沒有想像中慢，但要落地到穿戴裝置仍有幾個關鍵卡點。
publishedAt: 2026-05-22
readingTime: 9 分鐘
featured: false
sources:
  - title: 修正之「人工智慧/機器學習技術之電腦輔助偵測(CADe)及電腦輔助診斷(CADx)醫療器材查驗登記技術指引」及相關問答集（FDA器字第1141617758號）
    url: https://regulation.cde.org.tw/10254/8725/70679/regPost
    tier: primary
    note: TFDA 2025-08-12 公告，2025-08-22 函轉
  - title: 本署核准應用 AI/ML 技術之醫療器材清單（109 至 114 年）
    url: https://www.fda.gov.tw/tc/siteListContent.aspx?id=42528&sid=310
    tier: primary
    note: TFDA 醫療器材及化粧品組，發布 2025-02-12，維護 2026-03-05
  - title: 智慧醫療器材資訊暨媒合平台（AI/ML Medical Device Information and Matchmaking Platform）
    url: https://aimd.fda.gov.tw/
    tier: primary
    note: TFDA 智慧醫療器材專案辦公室 2021-05-07 成立之單一窗口平台
  - title: Ōura to pursue FDA clearance of blood pressure feature for smart ring
    url: https://www.medtechdive.com/news/oura-fda-clearance-smart-ring-blood-pressure/803181/
    tier: supplementary
    note: 補充來源（MedTech Dive）
  - title: Movano receives FDA nod for smart ring's pulse oximeter feature
    url: https://www.medtechdive.com/news/movano-fda-smart-ring-pulse-oximeter/734407/
    tier: supplementary
    note: 補充來源（MedTech Dive）
  - title: Tidepool, Ōura partner on diabetes research
    url: https://www.medtechdive.com/news/tidepool-oura-partner-diabetes-research/804939/
    tier: supplementary
    note: 補充來源（MedTech Dive）
  - title: ARPA-H kicks off wearable biosensor development program
    url: https://www.fiercebiotech.com/medtech/arpa-h-kicks-wearable-biosensor-development-program
    tier: supplementary
    note: 補充來源（Fierce Biotech）
  - title: Smartphone-enabled continuous glucose monitoring system earns CE mark
    url: https://www.fiercebiotech.com/medical-devices/smartphone-enabled-continuous-glucose-monitoring-system-earns-ce-mark
    tier: supplementary
    note: 補充來源（Fierce Biotech）
---

## 一、為什麼要從 CES 2026 看 TFDA

CES 2026 的數位健康主軸已經不是「會走路的智慧手錶」，而是把感測器藏進更小、更不打擾人的硬體（戒指、貼片、隱形感測器），再用 AI 把資料變成可以送回臨床的判讀。對台灣的生醫工程研究者而言，CES 觀察的價值不在「跟風買新玩具」，而在於先看 FDA、CE 核准了什麼樣的功能宣稱，再回頭比對台灣 TFDA 的法規節奏，因為這直接決定了「我手上的研究題目，幾年內能不能真的落地成一張許可證」。

本篇從 CES 2026 三個明顯的趨勢出發，每個趨勢都對照一份 TFDA 的官方文件，讓研究者知道台灣的對應位置在哪裡。

## 二、趨勢一：智慧戒指從消費玩具走向臨床器材

CES 2026 健康科技舞台上，智慧戒指（smart ring）變成新的主場之一。值得注意的是，這類產品的 FDA 510(k) 申請案陸續落地：Movano 的 Evie 戒指針對脈搏血氧（pulse oximeter）取得 FDA 許可 [ref: MedTech Dive, Movano FDA nod pulse oximeter]；Ōura 則進一步把目標放在血壓功能的 FDA 申請 [ref: MedTech Dive, Ōura blood pressure FDA]，並與糖尿病管理平台 Tidepool 合作探討連續代謝資料的臨床應用 [ref: MedTech Dive, Tidepool-Ōura diabetes]。

換句話說，智慧戒指正在從「健身腕帶」躍升為「需要走 510(k) / De Novo 的醫療器材」，這一步差異對研究者意義很大：研究設計從 user study 開始就要納入金標準量測、誤差分析、族群代表性。

**台灣對應位置**：TFDA 早在 2021 年 5 月 7 日就成立「智慧醫療器材專案辦公室」，定位是 AI 醫材的單一窗口、一站式輔導機制 [ref: aimd.fda.gov.tw]。這代表如果你的研究後端要走 SaMD 路徑，台灣已經有官方對口；但要進入這條輔導機制，你的演算法必須有夠完整的獨立性能評估資料，這直接連到趨勢二。

## 三、趨勢二：AI/ML 成為穿戴感測的核心引擎，而 TFDA 剛好把規則寫清楚了

CES 2026 之外，美國 ARPA-H 也在 2025 年啟動 Delphi 計畫，要把多訊號（multi-modal）的低成本生物感測器作為跨年期重點題目，預計支持原型開發與模組化感測元件整合 [ref: Fierce Biotech, ARPA-H Delphi]。這個方向的核心訊息是：穿戴裝置不再只看單一訊號，而是要 AI 整合多通道生理資料給出臨床等級判讀。

而台灣這邊，TFDA 在 **2025 年 8 月 12 日**以 FDA 器字第 1141617758 號公告，發布第三版修訂的「人工智慧／機器學習技術之電腦輔助偵測（CADe）及電腦輔助診斷（CADx）醫療器材查驗登記技術指引」，並同步公布「人工智慧／機器學習技術之醫療器材獨立性能評估常見問答集」[ref: regulation.cde.org.tw, FDA器字第1141618407號函]。

這份指引對穿戴裝置研究者有兩個直接影響：

第一，**適用範圍擴大**：新版定義把 CADe / CADx 的「可分析資料」明確擴及生理參數、ECG 訊號、基因特徵等，不再只侷限影像。也就是說，做 IMU、心電貼片、PPG 戒指等多通道穿戴訊號的 AI 判讀，未來查驗登記都要走這條技術指引。

第二，**獨立性能評估有官方問答集了**：這是研究設計階段最常踩到的坑（測試資料怎麼切、地真值怎麼定、效能指標怎麼選）。問答集等於把官方審查口徑公開出來，論文方法學部分若能對齊，會省下後續法規溝通時間。

## 四、趨勢三：連續監測從醫院走進家裡

第三個趨勢是「Hospital-to-Home」的硬體化。CES 2026 場次有 Dexcom（連續血糖監測）與 Ōura 同台討論連續健康資料如何改寫照護模型；連續血糖監測系統也已陸續取得跨國法規通過，例如最新一款以智慧手機介面為核心的 CGM 系統取得 CE Mark [ref: Fierce Biotech, smartphone CGM CE mark]。這代表「連續監測 + 居家 + 慢病管理」這條鏈在歐美正在快速法規成熟。

**台灣對應位置**：TFDA 於 2025 年 2 月 12 日（維護更新至 2026 年 3 月 5 日）公布「本署核准應用 AI/ML 技術之醫療器材清單（109 至 114 年）」，把 2020–2025 年國產與輸入的 AI/ML 醫材一次列出 [ref: fda.gov.tw, sid=310, id=42528]。對研究者而言，這份清單的價值有兩個：

1. **競品/前案掃描**：寫研究計畫時，這是判斷「台灣已經有沒有類似品項」最快的官方來源，比看單一論文更具實用性。
2. **適應症語言參考**：要把 AI 穿戴研究寫成「臨床上有定位」的論述，可以從清單裡的核准項目觀察台灣官方願意接受的適應症描述語法。

## 五、給台灣研究者的三個 takeaway

第一，**法規節奏其實在加速**。TFDA 在 2025 年連續修訂 AI/ML CADe/CADx 技術指引、更新 AI/ML 醫材清單，這個節奏與 CES 2026 看到的產品端火熱程度大致同步。研究者不必再用「台灣法規太慢」當不做穿戴 SaMD 題目的理由。

第二，**研究設計階段就要對齊獨立性能評估**。TFDA 已把問答集公開（見趨勢二引用），論文方法學若能在 dataset 切分、地真值、評估指標上對齊這份問答集，未來不論是投稿審稿人質疑或法規送審都會輕鬆許多。

第三，**用 TFDA 清單做題目熱度判斷**。AI/ML 醫材核准清單會持續滾動更新（最近一次維護是 2026-03-05），研究生開新題前花十分鐘掃一次清單，可以快速判斷「這個題目國內已經被做掉了、還是空白區」。

CES 的熱度會退，但 TFDA 的指引與清單是逐年積累的研究基礎建設。對博士生而言，把這兩條線同步看，是把穿戴式裝置研究做成「能落地、可投稿、有臨床定位」的最短路徑。
