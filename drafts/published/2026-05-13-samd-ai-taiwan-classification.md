---
id: samd-ai-taiwan-classification
category: industry
title: SaMD 分級認證拆解：AI 醫材在台灣的上市門檻怎麼看（對照歐盟 2025 兩篇新研究）
excerpt: TFDA 的《醫用軟體分類分級參考指引》把 AI/ML SaMD 拆成第一到第三等級，分界線決定了臨床試驗強度與上市時間。本文拆解台灣現行分級邏輯，並對照 2025 年歐洲放射學會 (ESR) 的 AIaMD 監管共識與《Diagnostics》期刊上 AI 醫材市場分佈分析，整理研究者 / 創業團隊在台灣送件前該先想清楚的三件事。
publishedAt: 2026-05-13
readingTime: 9 分鐘
featured: false
sources:
  - title: "TFDA《醫用軟體分類分級參考指引》（104.4.13 制定；109.12.24、111.9.15 修正）"
    url: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1
    tier: primary
    note: "TFDA 公告，第五節列出 PACS、CADe/CADx、手術導航、生理監控等品項對應等級"
  - title: "TFDA《人工智慧/機器學習技術之醫療器材軟體查驗登記送件常見問答集》(110.5.7)"
    url: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637559984474447747&type=1
    tier: primary
    note: "TFDA 公告，AI/ML-Based SaMD 查驗登記送件技術 / 臨床資料要件"
  - title: "TFDA 公告：本署核准應用 AI/ML 技術之醫療器材清單（109 至 114 年）"
    url: https://www.fda.gov.tw/tc/siteListContent.aspx?sid=310&id=42528
    tier: primary
    note: "TFDA 公告，發布 2025-02-12，維護 2026-03-05"
  - title: "Cuocolo R, Bernardini D, Pinto Dos Santos D, et al. AI medical device post-market surveillance regulations: consensus recommendations by the European Society of Radiology. Insights Imaging. 2025;16(1):275."
    url: https://doi.org/10.1186/s13244-025-02146-8
    tier: primary
    note: "16 位專家、14 位 panelist 的 modified Delphi 共識；2025 年 12 月發表"
  - title: "Obuchowicz R, Lasek J, Wodziński M, et al. Artificial Intelligence-Empowered Radiology—Current Status and Critical Review. Diagnostics. 2025;15(3):282."
    url: https://doi.org/10.3390/diagnostics15030282
    tier: primary
    note: "2025 年回顧 AI 醫材市場 MDR / MDD 認證分佈"
---

## 一、為什麼這篇要寫

每隔幾週都會有人問我：「我做了一個 AI 模型，能輔助看影像或處理生理訊號，這在台灣到底要不要送 TFDA？要送的話是哪一級？」這個問題的答案直接決定後續兩件事：**要花多少時間做臨床性能驗證、需要多嚴格的資訊安全要件**。等級判斷錯了，最壞的情況是整套臨床試驗設計推翻重來。

這篇圍繞兩個材料展開：

1. **TFDA 現行《醫用軟體分類分級參考指引》**（104 年制定、109 年與 111 年兩次修正）[ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1]，這份指引明確列出了影像、CAD、手術導航、生理監控等品項對應的等級。
2. **2025 年兩篇歐洲視角的最新研究**：歐洲放射學會 (ESR) 對 AIaMD post-market surveillance 的 Delphi 共識 [ref: https://doi.org/10.1186/s13244-025-02146-8]，以及《Diagnostics》期刊上對歐洲市場 AI 醫材分佈的回顧 [ref: https://doi.org/10.3390/diagnostics15030282]。

兩邊對照可以看出：**台灣的分級邏輯與歐美其實接軌**，但 post-market 階段的責任歸屬，歐洲也還在補規則。

---

## 二、台灣端：TFDA 怎麼分級 AI/ML SaMD

### 先決定「是不是醫療器材軟體」

TFDA 在 AI/ML SaMD 查驗登記送件問答集裡，把 AI/ML-Based SaMD 定義為「使用臨床資料（含量測數據、資料庫或影像等）為來源，透過人為設計軟體之學習模式或訓練方法來使程式模擬人類推論或自主學習，進而調適其效能之醫療器材軟體」[ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637559984474447747&type=1]。

但「是不是 SaMD」與「是不是醫療器材」是兩個問題。《醫用軟體分類分級參考指引》第三節列出六個判定原則 [ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1]：

1. 是否符合醫療器材管理法第 3 條醫療器材定義
2. 是否符合醫療器材分類分級管理辦法附表所列品項
3. 是否宣稱具診斷、治療功能或協助診斷、治療
4. 對疾病治療的重要性
5. 對疾病診斷的貢獻度、參考價值
6. 對人類生命健康可能產生的危害程度

幾個常被誤判的例子，指引明確說**不是**醫療器材 [ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1]：

- 醫院行政管理軟體（HIS、電子病歷、實驗室資訊系統）：只是把紙本電子化、不取代醫事人員臨床決策
- 健康促進軟體（飲食、運動、睡眠、減重 App）：即使宣稱可降低糖尿病風險，只要不是治療或改善「特定疾病或症狀」，不屬於醫療器材
- 用藥紀錄軟體：若內容只是電子化既有藥品仿單、不直接取代醫事人員開立處方，不屬於醫療器材

### 再決定「分到哪一級」

這是大多數 AI 開發者真正關心的部分。指引第五節把常見品類對應如下 [ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1]：

**第一等級（低風險）**
- 醫學影像儲存裝置（P.2010）
- 醫學影像傳輸裝置（P.2020）
- 條件：**單純**傳輸、儲存、顯示影像，不做加工或處理

**第二等級（中風險）**
- 醫學圖像紀錄傳輸系統 PACS（P.2050）、醫學影像數位器（P.2030）：對影像做加工 / 處理 / 編輯 / 分析
- 電腦輔助偵測軟體（CADe）：對影像、生理訊號或病理檢驗加工後，協助醫事人員偵測病變
- 電腦輔助診斷軟體（CADx），**只要還是「輔助」醫事人員、由醫事人員做最終決策**
- 電腦輔助分流軟體（Computer Aided Triage）：例如急性腦出血篩檢分流
- 手術導航 / 手術計畫軟體：腦神經外科、整形外科、骨科、脊椎外科等
- 植牙計畫軟體
- 病人生理參數監控軟體：連結多項生理量測儀器、提供警示
- 遠距醫療軟體，**只要會解釋資料或協助診斷 / 治療**（純資料轉發則不屬於醫療器材）

**第三等級（高風險）**
- CADx 軟體**宣稱可取代專業醫事人員決策、直接進行疾病診斷或治療**

### 一條最容易踩到的線

CADx 的「輔助」與「取代」這條線是**台灣最容易被低估**的分界。指引把它寫得很白：「若 CADx 軟體僅用於輔助醫事人員診斷、治療……屬於第二等級；倘 CADx 軟體**宣稱可取代專業醫事人員決策**、直接進行疾病診斷、治療功能，屬於第三等級」[ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1]。

差別在於**「宣稱」**兩個字。同樣一套深度學習模型，仿單上寫「輔助放射科醫師判讀」與「自主進行影像診斷」，會把產品從第二等級推到第三等級，臨床試驗強度、QMS 要求、上市時程都會完全不同。

---

## 三、技術 / 安全資料要準備什麼

AI/ML SaMD 查驗登記送件問答集第三條明列要附的兩類資料 [ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637559984474447747&type=1]：

**技術性資料**：軟體概要、演算法架構、AI/ML 之資料限制、輸出結果、使用環境與人員限制。

**安全與效能評估資料**：資訊安全、功能性驗證、臨床性能驗證。

臨床性能驗證的撰寫架構，TFDA 直接引用 IMDRF 2017 年公告的 *Software as a Medical Device: Clinical Evaluation* [ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637559984474447747&type=1]，三大流程是：

1. **證實臨床關聯（Valid Clinical Association）**：模型輸出與目標臨床狀況之間有 well-established 的關係
2. **分析性能驗證（Analytical Validation）**：模型輸入到輸出的計算正確性
3. **臨床性能驗證（Clinical Validation）**：在 intended use population 中，模型輸出真的能達到宣稱的臨床效益

對研究者來說，這三個層次**不能合併處理**。常見的錯誤是把「在公開資料集上 AUC = 0.9」當成臨床性能驗證——但那其實只完成了 analytical validation 的一部分，連 valid clinical association 都沒寫清楚。

---

## 四、歐洲對照：AI 醫材實際長什麼樣

2025 年《Diagnostics》上一篇大型回顧整理了歐洲市場 AI 影像產品的分佈，幾個對台灣團隊有用的觀察 [ref: https://doi.org/10.3390/diagnostics15030282]：

- 大多數 AI 影像產品的 MDR / MDD 認證落在 **Class IIa 或 Class I**，也就是中低風險區間
- 神經影像 (neuroimaging) 與胸部影像是主要產品聚焦點
- 鎖定的疾病多是高盛行率：肺癌、中風、乳癌
- AI 醫材產品數量在 **2017–2020 年快速成長，2020 年達到高峰，之後進入相對停滯**

這個分佈與台灣的 TFDA 指引邏輯一致：CADe / CADx 輔助用、PACS、影像加工 → 第二等級（對應歐洲 Class IIa）；真正自主診斷、進到第三等級 / Class III 的產品仍是少數。

換句話說，**「AI 取代醫師」是新聞標題，「AI 輔助醫師」才是市場常態**。

---

## 五、規範還沒補上的洞：post-market surveillance

如果說「上市前分級」是已經有指引的部分，那「上市後監測」就是規範仍在補的部分。2025 年 12 月歐洲放射學會 (ESR) 用 modified Delphi 程序找了 16 位專家、其中 14 人作為 panelist，整理出一套 AIaMD post-market surveillance 共識 [ref: https://doi.org/10.1186/s13244-025-02146-8]。

幾個對研究者 / 廠商有啟發的點：

1. **歐盟的 MDR 與 AI Act 都沒有針對 AI 元件的明確條款**，導致「high-risk AI」的分類與部署實務之間存在灰色地帶 [ref: https://doi.org/10.1186/s13244-025-02146-8]
2. **PMS 法律責任主要在軟體提供者**，但放射科醫師（deployer）也被期待持續貢獻於安全與效能監測 [ref: https://doi.org/10.1186/s13244-025-02146-8]
3. ESR 的共識把 PMS 與 post-market clinical feedback (PMCF) 視為**provider 與 deployer 共同負責的循環**，不只是「賣完就算」[ref: https://doi.org/10.1186/s13244-025-02146-8]

對台灣團隊的對照意義：TFDA 端的 AI/ML 醫材清單從 109 年（2020）持續更新到 114 年（2025）[ref: https://www.fda.gov.tw/tc/siteListContent.aspx?sid=310&id=42528]，**上市後監測在台灣與歐盟都是現在進行式**。提早把 PMCF 機制（資料收集、版本控管、re-training trigger）放進產品設計，比事後補救成本低很多。

---

## 六、給研究者 / 創業團隊的 takeaway

如果你正在規劃一個 AI 醫材產品，TFDA 指引 + 兩篇 2025 年研究放在一起看，可以萃取出三件事：

1. **仿單裡的「宣稱」是分級槓桿**。同一套模型，宣稱「輔助診斷」會落在第二等級，宣稱「取代醫師決策」會跳到第三等級 [ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1]。送件前先盤點 marketing 語言與技術文件的一致性。
2. **臨床性能驗證 ≠ AUC**。IMDRF 三層架構（valid clinical association、analytical validation、clinical validation）要分別交代 [ref: https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637559984474447747&type=1]。
3. **PMS 機制要在產品設計階段就放進去**。歐洲市場目前仍在補規則的階段 [ref: https://doi.org/10.1186/s13244-025-02146-8]，但這代表台灣團隊有機會以「PMS-ready」當差異化條件，而不是被動等規範補齊。

對博士生與年輕研究者來說，這條路看起來繁瑣，但其實**指引給的等級對應比想像中清楚**。比較難的是「把研究端的 model performance 翻譯成 regulatory grade evidence」這件事——而這正是生醫工程跨領域訓練的價值所在。

---

*本文圍繞 TFDA 公告指引與 2025 年兩篇歐洲 AIaMD 相關 peer-reviewed 研究展開，所有具體聲明均附 DOI 或官方文件連結。*
