// 研究筆記範例資料 — 後續可改為從後端載入
// 主題對齊 William 的實際研究領域：生物力學 / 醫學工程 / AI 整合
// 詳細文章內容之後會每週三篇（一 / 三 / 五）逐步補上，現為結構 + excerpt

import eyeMovementTrainingAthletesCover from '../assets/covers/eye-movement-training-athletes.svg'
import xaiBiomechanicsReviewerCover from '../assets/covers/xai-biomechanics-reviewer.svg'
import biomechAiDecisionMapCover from '../assets/covers/biomech-ai-decision-map.svg'
import firstWearableCollabCover from '../assets/covers/first-wearable-collab.svg'
import taiwanMedAi2026Cover from '../assets/covers/taiwan-medai-2026.svg'
import communityPicksAprilCover from '../assets/covers/community-picks-april.svg'
import imuDataPitfallsCover from '../assets/covers/imu-data-pitfalls.svg'
import phdTopicPivotsCover from '../assets/covers/phd-topic-pivots.svg'
import smallDatasetDLBiomechanicsCover from '../assets/covers/small-dataset-deep-learning-biomechanics.svg'
import aiPromptingWorkflowCover from '../assets/covers/ai-prompting-workflow.svg'
import aiMedicalImaging2026PapersCover from '../assets/covers/ai-medical-imaging-2026-papers.svg'
import eventCameraMotionAnalysisCover from '../assets/covers/event-camera-motion-analysis.svg'
import dapoRlvrFourTechniquesCover from '../assets/covers/dapo-rlvr-four-techniques.svg'
import imuOutdoorGazeTrackingCover from '../assets/covers/imu-outdoor-gaze-tracking.svg'
import samdAiTaiwanClassificationCover from '../assets/covers/samd-ai-taiwan-classification.svg'

export const articleCategories = [
  { value: 'method', label: '方法論筆記', color: 'teal' },
  { value: 'case', label: '專案經驗', color: 'gold' },
  { value: 'industry', label: '產業觀察', color: 'navy' },
  { value: 'community', label: '社群精選', color: 'coral' },
]

export const articles = [
  {
    id: 'samd-ai-taiwan-classification',
    category: 'industry',
    title: 'SaMD 分級認證拆解：AI 醫材在台灣的上市門檻怎麼看（對照歐盟 2025 兩篇新研究）',
    excerpt:
      'TFDA《醫用軟體分類分級參考指引》把 AI/ML SaMD 拆成第一到第三等級，分界線決定臨床試驗強度與上市時間。',
    publishedAt: '2026-05-13',
    readingTime: '9 分鐘',
    featured: false,
    coverImage: samdAiTaiwanClassificationCover,
    tableOfContents: [
      { id: 'why-this-topic', title: '一、為什麼這篇要寫' },
      { id: 'tfda-classification', title: '二、台灣端：TFDA 怎麼分級 AI/ML SaMD' },
      { id: 'tech-clinical', title: '三、技術 / 安全資料要準備什麼' },
      { id: 'eu-distribution', title: '四、歐洲對照：AI 醫材實際長什麼樣' },
      { id: 'post-market', title: '五、規範還沒補上的洞：post-market surveillance' },
      { id: 'takeaway', title: '六、給研究者 / 創業團隊的 takeaway' },
    ],
    content: [
      {
        type: 'callout',
        text: '本文圍繞 TFDA 公告指引與 2025 年兩篇歐洲 AIaMD peer-reviewed 研究展開：Cuocolo R, et al. Insights Imaging 2025;16(1):275（DOI: 10.1186/s13244-025-02146-8）；Obuchowicz R, et al. Diagnostics 2025;15(3):282（DOI: 10.3390/diagnostics15030282）。',
      },
      { type: 'h2', id: 'why-this-topic', text: '一、為什麼這篇要寫' },
      {
        type: 'p',
        text: '相信很多人會有類似的疑問：「我做了一個 AI 模型，能輔助看影像或處理生理訊號，這在台灣到底要不要送 TFDA？要送的話是哪一級？」這個問題的答案直接決定後續兩件事：要花多少時間做臨床性能驗證、需要多嚴格的資訊安全要件。等級判斷錯了，最壞的情況是整套臨床試驗設計推翻重來。',
      },
      {
        type: 'p',
        text: '這篇圍繞兩個材料展開。一是 TFDA 現行《醫用軟體分類分級參考指引》（104 年制定、109 年與 111 年兩次修正），這份指引明確列出了影像、CAD、手術導航、生理監控等品項對應的等級。二是 2025 年兩篇歐洲視角的最新研究：歐洲放射學會 (ESR) 對 AIaMD post-market surveillance 的 Delphi 共識，以及《Diagnostics》期刊上對歐洲市場 AI 醫材分佈的回顧。兩邊對照可以看出：台灣的分級邏輯與歐美其實接軌，但 post-market 階段的責任歸屬，歐洲也還在補規則。',
      },
      { type: 'h2', id: 'tfda-classification', text: '二、台灣端：TFDA 怎麼分級 AI/ML SaMD' },
      {
        type: 'p',
        text: 'TFDA 在 AI/ML SaMD 查驗登記送件問答集裡，把 AI/ML-Based SaMD 定義為「使用臨床資料（含量測數據、資料庫或影像等）為來源，透過人為設計軟體之學習模式或訓練方法來使程式模擬人類推論或自主學習，進而調適其效能之醫療器材軟體」。但「是不是 SaMD」與「是不是醫療器材」是兩個問題。《醫用軟體分類分級參考指引》第三節列出六個判定原則：是否符合醫療器材管理法第 3 條定義、是否符合醫療器材分類分級管理辦法附表所列品項、是否宣稱具診斷 / 治療功能、對疾病治療的重要性、對疾病診斷的貢獻度、對人類生命健康可能產生的危害程度。',
      },
      {
        type: 'p',
        text: '幾個常被誤判的例子，指引明確說「不是」醫療器材：醫院行政管理軟體（HIS、電子病歷、實驗室資訊系統）——只是把紙本電子化、不取代醫事人員臨床決策；健康促進軟體（飲食、運動、睡眠、減重 App）——即使宣稱可降低糖尿病風險，只要不是治療或改善「特定疾病或症狀」，不屬於醫療器材；用藥紀錄軟體（內容只是電子化既有藥品仿單、不直接取代醫事人員開立處方）。',
      },
      {
        type: 'p',
        text: '再來是大多數 AI 開發者真正關心的部分：分到哪一級。指引第五節把常見品類對應如下。第一等級（低風險）包含醫學影像儲存裝置（P.2010）、醫學影像傳輸裝置（P.2020）——條件是「單純」傳輸、儲存、顯示影像，不做加工或處理。第二等級（中風險）包含 PACS（P.2050）、醫學影像數位器（P.2030）（對影像做加工 / 處理 / 編輯 / 分析）、CADe 電腦輔助偵測軟體、CADx 電腦輔助診斷軟體（只要還是「輔助」醫事人員、由醫事人員做最終決策）、電腦輔助分流軟體、手術導航 / 手術計畫軟體、植牙計畫軟體、病人生理參數監控軟體，以及會「解釋資料或協助診斷 / 治療」的遠距醫療軟體。第三等級（高風險）則是 CADx 軟體宣稱「可取代專業醫事人員決策、直接進行疾病診斷或治療」。',
      },
      {
        type: 'callout',
        text: 'CADx 的「輔助」與「取代」這條線是台灣最容易被低估的分界。差別在於「宣稱」兩個字：同一套深度學習模型，仿單上寫「輔助放射科醫師判讀」與「自主進行影像診斷」，會把產品從第二等級推到第三等級，臨床試驗強度、QMS 要求、上市時程都會完全不同。',
      },
      { type: 'h2', id: 'tech-clinical', text: '三、技術 / 安全資料要準備什麼' },
      {
        type: 'p',
        text: 'AI/ML SaMD 查驗登記送件問答集第三條明列要附的兩類資料。技術性資料包含：軟體概要、演算法架構、AI/ML 之資料限制、輸出結果、使用環境與人員限制。安全與效能評估資料包含：資訊安全、功能性驗證、臨床性能驗證。',
      },
      {
        type: 'p',
        text: '臨床性能驗證的撰寫架構，TFDA 直接引用 IMDRF 2017 年公告的《Software as a Medical Device: Clinical Evaluation》，三大流程是：證實臨床關聯（Valid Clinical Association）——模型輸出與目標臨床狀況之間有 well-established 的關係；分析性能驗證（Analytical Validation）——模型輸入到輸出的計算正確性；臨床性能驗證（Clinical Validation）——在 intended use population 中，模型輸出真的能達到宣稱的臨床效益。',
      },
      {
        type: 'p',
        text: '對研究者來說，這三個層次不能合併處理。常見的錯誤是把「在公開資料集上 AUC = 0.9」當成臨床性能驗證——但那其實只完成了 analytical validation 的一部分，連 valid clinical association 都沒寫清楚。',
      },
      { type: 'h2', id: 'eu-distribution', text: '四、歐洲對照：AI 醫材實際長什麼樣' },
      {
        type: 'p',
        text: '2025 年《Diagnostics》上一篇大型回顧整理了歐洲市場 AI 影像產品的分佈，幾個對台灣團隊有用的觀察：大多數 AI 影像產品的 MDR / MDD 認證落在 Class IIa 或 Class I，也就是中低風險區間；神經影像 (neuroimaging) 與胸部影像是主要產品聚焦點；鎖定的疾病多是高盛行率（肺癌、中風、乳癌）；AI 醫材產品數量在 2017–2020 年快速成長、2020 年達到高峰、之後進入相對停滯。',
      },
      {
        type: 'p',
        text: '這個分佈與台灣的 TFDA 指引邏輯一致：CADe / CADx 輔助用、PACS、影像加工這類產品 → 第二等級（對應歐洲 Class IIa）；真正自主診斷、進到第三等級 / Class III 的產品仍是少數。換句話說，「AI 取代醫師」是新聞標題，「AI 輔助醫師」才是市場常態。',
      },
      { type: 'h2', id: 'post-market', text: '五、規範還沒補上的洞：post-market surveillance' },
      {
        type: 'p',
        text: '如果說「上市前分級」是已經有指引的部分，那「上市後監測」就是規範仍在補的部分。2025 年 12 月歐洲放射學會 (ESR) 用 modified Delphi 程序找了 16 位專家、其中 14 人作為 panelist，整理出一套 AIaMD post-market surveillance 共識。',
      },
      {
        type: 'list',
        items: [
          '歐盟的 MDR 與 AI Act 都沒有針對 AI 元件的明確條款，導致「high-risk AI」的分類與部署實務之間存在灰色地帶。',
          'PMS 法律責任主要在軟體提供者，但放射科醫師（deployer）也被期待持續貢獻於安全與效能監測。',
          'ESR 的共識把 PMS 與 post-market clinical feedback (PMCF) 視為 provider 與 deployer 共同負責的循環，不只是「賣完就算」。',
        ],
      },
      {
        type: 'p',
        text: '對台灣團隊的對照意義：TFDA 端的 AI/ML 醫材清單從 109 年（2020）持續更新到 114 年（2025），上市後監測在台灣與歐盟都是現在進行式。提早把 PMCF 機制（資料收集、版本控管、re-training trigger）放進產品設計，比事後補救成本低很多。',
      },
      { type: 'h2', id: 'takeaway', text: '六、給研究者 / 創業團隊的 takeaway' },
      {
        type: 'p',
        text: '如果你正在規劃一個 AI 醫材產品，TFDA 指引 + 兩篇 2025 年研究放在一起看，可以萃取出三件事：',
      },
      {
        type: 'list',
        items: [
          '仿單裡的「宣稱」是分級槓桿。同一套模型，宣稱「輔助診斷」會落在第二等級，宣稱「取代醫師決策」會跳到第三等級。送件前先盤點 marketing 語言與技術文件的一致性。',
          '臨床性能驗證 ≠ AUC。IMDRF 三層架構（valid clinical association、analytical validation、clinical validation）要分別交代。',
          'PMS 機制要在產品設計階段就放進去。歐洲市場目前仍在補規則的階段，但這代表台灣團隊有機會以「PMS-ready」當差異化條件，而不是被動等規範補齊。',
        ],
      },
      {
        type: 'p',
        text: '對多數人來說這條路看起來或許繁瑣，但其實指引給的等級對應比想像中清楚。比較難的是「把研究端的 model performance 翻譯成 regulatory grade evidence」這件事——而這正是生醫工程跨領域訓練的價值所在。',
      },
      {
        type: 'callout',
        text: 'TFDA《醫用軟體分類分級參考指引》(111.9.15 修正) https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637988574332883487&type=1',
      },
      {
        type: 'callout',
        text: 'TFDA《人工智慧/機器學習技術之醫療器材軟體查驗登記送件常見問答集》(110.5.7) https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f637559984474447747&type=1',
      },
      {
        type: 'callout',
        text: 'TFDA「本署核准應用 AI/ML 技術之醫療器材清單（109 至 114 年）」https://www.fda.gov.tw/tc/siteListContent.aspx?sid=310&id=42528',
      },
      {
        type: 'callout',
        text: 'Cuocolo R, Bernardini D, Pinto Dos Santos D, et al. AI medical device post-market surveillance regulations: consensus recommendations by the European Society of Radiology. Insights Imaging. 2025;16(1):275. https://doi.org/10.1186/s13244-025-02146-8',
      },
      {
        type: 'callout',
        text: 'Obuchowicz R, Lasek J, Wodziński M, et al. Artificial Intelligence-Empowered Radiology—Current Status and Critical Review. Diagnostics. 2025;15(3):282. https://doi.org/10.3390/diagnostics15030282',
      },
    ],
  },
  {
    id: 'imu-outdoor-gaze-tracking',
    category: 'method',
    title: '把眼動研究從實驗室搬到馬路上：2024 年最新的 IMU + 眼動 + AI 整合範例',
    excerpt:
      '2024 年 Moore 等人連發兩篇研究，把「IMU 步態資料 + 頭戴 eye tracker + YOLOv8 物件偵測」整合成巴金森症（PwPD）真實生活跌倒風險的評估工作流。',
    publishedAt: '2026-05-11',
    readingTime: '8 分鐘',
    featured: false,
    coverImage: imuOutdoorGazeTrackingCover,
    tableOfContents: [
      { id: 'why-this-topic', title: '一、為什麼這篇要寫' },
      { id: 'paper-one-varfa', title: '二、第一篇：用深度學習給眼動影像「貼標籤」' },
      { id: 'paper-two-pwpd', title: '三、第二篇：把演算法搬到病人家中' },
      { id: 'takeaway', title: '四、Takeaways' },
    ],
    content: [
      {
        type: 'callout',
        text: '與前文的關係：之前那篇〈眼動訓練對運動員表現提升的證據與方法〉討論的是「眼動訓練的效果」，本文則是「如果你想在病人真實生活場景量眼動 + 動作，技術上要怎麼做」。',
      },
      { type: 'h2', id: 'why-this-topic', text: '一、為什麼這篇要寫' },
      {
        type: 'p',
        text: '傳統眼動研究幾乎都被「下巴墊 + 螢幕」綁死，但 IMU + mobile eye tracker 的組合正在把場景搬到真實世界。問題是：眼動儀只告訴你受試者看哪個方向，IMU 只告訴你身體在動什麼，兩者單獨用都解釋不了「為什麼這個人會跌倒」。',
      },
      {
        type: 'p',
        text: '2024 年 Northumbria 大學的 Moore 團隊在兩本期刊連發兩篇研究，剛好把這個拼圖補上：用深度學習自動標注眼動影像裡的「環境物件」與「行走路徑」，再跟 IMU 的步態訊號合起來，產出一個可在病人家中跑的跌倒風險評估工作流。這篇圍繞這兩篇最新研究展開。',
      },
      { type: 'h2', id: 'paper-one-varfa', text: '二、第一篇：用深度學習給眼動影像「貼標籤」' },
      {
        type: 'p',
        text: 'Moore 等人（2024）在《Journal of NeuroEngineering and Rehabilitation》提出了 VARFA（Visual Attention and Risk Factors during Activity）：用 YOLOv8 自動偵測眼動儀拍到的影像中的物件、再用 U-NET 把行走路徑切出來。',
      },
      {
        type: 'p',
        text: '為什麼這值得做？IMU 可以告訴你「步態變慢了」，但慢的原因可能是：地上有障礙物？光線變暗了？前面有人擋路？傳統做法是研究員手動看每一秒的影像，導致成本高、主觀、無法在臨床落地。',
      },
      {
        type: 'p',
        text: '量化結果方面，YoloV8 在實驗室步態資料集上達到 mAP50 = 0.93，平均偵測準確度約 93%；U-NET 預測的行走路徑與真實路徑的 IoU = 0.82，重疊度 82%；兩個模型都能在 real-time 速度下處理影像，足以在配戴期間連續分析。',
      },
      {
        type: 'p',
        text: '兩個技術細節值得注意。第一，作者特別建立了一個 lab-based 的步態場景資料集來訓練模型，這暗示著「現成的 COCO / ImageNet 模型不能直接用」，因為眼動儀的視角、光線、構圖跟一般網路圖片差很多。對生醫工程研究者來說，這代表眼動 + 物件偵測的整合往往需要客製化資料集，不能拿開源模型套用了事。第二，mAP50 是物件偵測的精度（「有沒有看到這個物件」），IoU 是分割的精度（「邊界畫得多準」）。如果你的研究只需知道「環境中有沒有障礙物」，0.93 的 mAP50 已經夠；但如果要計算「障礙物與行走路徑的距離」，那 IoU 0.82 的邊界誤差會直接影響距離估計準度。',
      },
      { type: 'h2', id: 'paper-two-pwpd', text: '三、第二篇：把演算法搬到病人家中' },
      {
        type: 'p',
        text: '第一篇證明了「演算法行得通」，但真實落地還有兩個問題：演算法對巴金森症（PwPD）患者家中環境的泛化能力、以及病人願不願意全天配戴一台會錄影的眼鏡。Moore 等人（2024）在《Sensors》同時處理了這兩件事。',
      },
      {
        type: 'p',
        text: '量化結果上，微調過的 YoloV8 在 PwPD free-living 場景的物件偵測 mAP50 = 0.81；與第一篇實驗室場景的 0.93 相比，真實世界場景的精度下降了約 13 個百分點，這是「lab-to-real-world」泛化落差的典型量級。',
      },
      {
        type: 'p',
        text: '這篇研究最特別的部分不是演算法，而是它做了 PwPD 的焦點團體訪談，整理出兩個核心發現：',
      },
      {
        type: 'list',
        items: [
          '「人因設計」是接受度的關鍵：受訪者偏好「外觀像一般眼鏡的 ergonomically designed wearable video glasses」，低調、不像研究設備，才能在公共場合配戴而不引起異樣眼光。',
          'AI 處理流程的「控制權」是隱私關鍵：受訪者要求自己對 AI 怎麼處理影像、誰能看到原始資料有控制權；換句話說，單純強調「演算法準度」是不夠的，使用者體驗的設計同等重要。',
        ],
      },
      {
        type: 'p',
        text: '如果要做類似的 IMU + 眼動 + AI 系統，可以從這兩篇研究萃取出兩個操作原則：演算法精度的「lab → 真實世界」會打約 13% 折扣，規劃 power analysis 時要把這個落差納入考量；倫理 / 隱私 / 配戴體驗的設計不可外包，Moore 團隊把焦點團體訪談放進研究主軸，是值得學的做法。',
      },
      { type: 'h2', id: 'takeaway', text: '四、Takeaways' },
      {
        type: 'p',
        text: '從這兩篇 2024 年研究，可以萃取出幾個可操作的設計原則：',
      },
      {
        type: 'list',
        items: [
          '「光只有 IMU」不夠：步態變慢的原因可以是視覺刺激、環境障礙、注意力分配，沒有同步的眼動資料就只能猜。',
          '「光只有 eye tracker」也不夠：眼動儀本身不知道身體是否在動、地面是否平坦、患者是否在轉彎避障。',
          '「IMU + 眼動 + AI」是 2024 年的新做法，但 lab-to-real-world 仍有約 13 個百分點的泛化落差。',
          '倫理 / 隱私 / 配戴體驗是落地關鍵，不是錦上添花。',
        ],
      },
      {
        type: 'p',
        text: '對於正在規劃或想在臨床步態研究裡加入「真實場域眼動」的研究者，這兩篇是可以提供相對完整的方法論示範。',
      },
      {
        type: 'callout',
        text: 'Moore J, Catena R, Fournier L, Jamali P, McMeekin P, Stuart S, Walker R, Salisbury T, Godfrey A. Enhancing fall risk assessment: instrumenting vision with deep learning during walks. J Neuroeng Rehabil. 2024;21(1):106. https://doi.org/10.1186/s12984-024-01400-2',
      },
      {
        type: 'callout',
        text: 'Moore J, Celik Y, Stuart S, McMeekin P, Walker R, Hetherington V, Godfrey A. Using Video Technology and AI within Parkinson\'s Disease Free-Living Fall Risk Assessment. Sensors (Basel). 2024;24(15):4914. https://doi.org/10.3390/s24154914',
      },
    ],
  },
  {
    id: 'dapo-rlvr-four-techniques',
    category: 'community',
    title: 'DAPO 拆解：填補 DeepSeek-R1 技術黑盒的四個關鍵設計',
    excerpt:
      '透過 DeepSeek-R1 把這篇 DAPO 的四項技術逐一拆開，說清楚它們各自對應 GRPO 的哪個問題、設計直覺是什麼。',
    publishedAt: '2026-05-09',
    readingTime: '14 分鐘',
    featured: false,
    coverImage: dapoRlvrFourTechniquesCover,
    tableOfContents: [
      { id: 'why-dapo', title: '一、為什麼 DAPO 值得讀' },
      { id: 'grpo-review', title: '二、GRPO 複習：DAPO 繼承的起點' },
      { id: 'clip-higher', title: '三、技術一：Clip-Higher（非對稱 Clip）' },
      { id: 'dynamic-sampling', title: '四、技術二：Dynamic Sampling' },
      { id: 'token-level-pg', title: '五、技術三：Token-Level Policy Gradient Loss' },
      { id: 'entropy-bonus', title: '六、技術四：Entropy Bonus + Overlong Reward Shaping' },
      { id: 'integration', title: '七、整合：四項技術的系統效果' },
      { id: 'after-dapo', title: '八、DAPO 之後：這個領域還在快速演進' },
    ],
    content: [
      {
        type: 'callout',
        text: '本文所有技術描述以 DAPO 論文 arXiv:2503.14476 為 primary 來源（preprint，尚未同儕審查）。部分 GRPO 演算法細節為社群廣為引用的通識背景知識。標有「待補引用」的細節為目前尚未有 primary 文件明確記載但對技術理解有幫助的說明。',
      },
      { type: 'h2', id: 'why-dapo', text: '一、為什麼 DAPO 值得讀' },
      {
        type: 'p',
        text: '2025 年一月，DeepSeek-AI 發布 DeepSeek-R1（arXiv:2501.12948）。論文宣稱：只靠大規模強化學習（RL），不用 Supervised Fine-Tuning（SFT）作為前置步驟，模型就能自然湧現出長鏈推理、自我反省、「啊哈時刻」等行為，最終在數學推理任務上達到與 OpenAI o1-1217 相當的水準。這個結果震驚了整個 AI 社群，也引發了一波復現潮。',
      },
      {
        type: 'p',
        text: '問題來了：論文發布的時候，訓練細節幾乎是黑盒。用什麼 clip 係數？怎麼處理「全部答對」或「全部答錯」的 batch？怎麼防止模型在訓練過程中輸出越來越長的廢話（length hacking）？怎麼防止策略分佈在幾千步之後 entropy 崩潰？這些問題，DeepSeek-R1 技術報告沒有完整說清楚。社群花了兩個月試圖填補這個空白，大多數人的復現結果都差得遠。',
      },
      {
        type: 'p',
        text: '三月，ByteDance 發表 DAPO（arXiv:2503.14476）。DAPO 的目標很明確：不是做一個新的大模型，而是做一個可以被完整復現的 RLVR 訓練系統，解釋清楚大規模 LLM 強化學習為什麼能成功——並且把程式碼、訓練框架（verl）、資料集全部開源。結果：Qwen2.5-32B base model，在 AIME 2024 上跑出 50 分，在當時的開源系統中達到頂尖水準。論文提出四項核心技術，每一項都對應 GRPO 一個已知的失效模式。',
      },
      { type: 'h2', id: 'grpo-review', text: '二、GRPO 複習：DAPO 繼承的起點' },
      {
        type: 'p',
        text: '在進入四項技術之前，先確認 GRPO（Group Relative Policy Optimization）的基本架構，因為 DAPO 是在它上面修改的。GRPO 的運作邏輯是：對每個 prompt，從當前模型 π_θ 採樣 G 條完整回應（例如 G = 8）；用驗證器（verifiable reward，例如數學解題答案是否正確）對每條回應給 0 或 1 的 reward；計算群組相對優勢（把每條回應的 reward 減去群組均值、除以群組標準差）；再用 PPO 風格的 clipped surrogate objective 更新模型。GRPO 的優雅之處是不需要訓練獨立的 value/critic network，DeepSeek-R1-Zero 就是基於這個架構。',
      },
      {
        type: 'p',
        text: '但 GRPO 在大規模 RLVR 訓練中有幾個已知問題：Entropy 崩潰（訓練到一定程度，輸出機率過於集中，停止探索）；Response length 膨脹（模型學到靠延長輸出增加踩中正確 token 的機率，尤其在錯誤回應上更明顯——Liu 等人 arXiv:2503.20783 用受控實驗量化了這個偏差）；全對 / 全錯 batch 浪費計算資源（群組優勢等於零，這批資料完全沒有梯度訊號）；以及 clip 機制的不對稱問題（下面細講）。DAPO 的四項技術，每一項對應其中一個問題。',
      },
      { type: 'h2', id: 'clip-higher', text: '三、技術一：Clip-Higher（非對稱 Clip）' },
      {
        type: 'callout',
        text: '對應問題：標準 PPO clip 機制限制了模型在「好回應」上的學習速率。',
      },
      {
        type: 'p',
        text: 'PPO 的 clipped surrogate objective 把概率比值 r(θ) = π_θ(a) / π_old(a) 限制在 [1 − ε, 1 + ε] 之間（ε 通常設為 0.2）。背後的直覺是防止策略更新步伐過大（trust region 概念）。問題在於這個對稱 clip 同等地限制了「機率增加的上限」和「機率降低的下限」。對高 advantage 的好回應，clip 上限 (1 + ε) 經常被觸及——梯度被截斷，模型想學但被 clip 擋住。',
      },
      {
        type: 'p',
        text: 'DAPO 的解法是引入非對稱 clip：低端 clip（clip_low）保持與 PPO 相同，防止模型在負向更新時走太遠；高端 clip（clip_high）放寬上限，允許模型在正向 advantage 回應上更積極地增加機率。這樣，對「好回應」模型可以學得更快；對「壞回應」仍保有保守性。設計哲學是：探索（向好回應移動）應該比保守（離壞回應）更自由一點。在 RLVR 訓練的早中期，加快對正確推理模式的強化，對最終的推理能力提升有顯著幫助（具體 clip 數值請見 arXiv:2503.14476 原論文）。',
      },
      { type: 'h2', id: 'dynamic-sampling', text: '四、技術二：Dynamic Sampling（動態採樣過濾）' },
      {
        type: 'callout',
        text: '對應問題：全對 / 全錯的 batch 沒有學習訊號，浪費計算資源。',
      },
      {
        type: 'p',
        text: '在 GRPO 框架裡，advantage 是群組相對值。如果 G 條回應的 reward 完全相同（全 0 或全 1），所有回應的 advantage 都是 0，這個 batch 完全沒有梯度訊號。有兩種情況：prompt 太難，模型完全不會做，G 條都答錯，沒有正向訊號；或 prompt 太簡單，模型已掌握，G 條都答對，沒有訊號告訴它如何改進。兩種都在浪費這個 batch 的計算。',
      },
      {
        type: 'p',
        text: 'DAPO 的解法是在每個訓練步驟動態過濾這類 prompt：在採樣 G 條回應後，如果所有回應 reward 相同，直接跳過，不計入梯度更新；同時從更大的候選集補充新的「有效 prompt」，確保每個訓練步驟的有效 batch size 維持在目標大小。好處是每個 gradient step 都對應有訊號的資料、隱式地執行課程學習（訓練初期太難的 prompt 被過濾，隨著模型能力提升這些 prompt 逐漸變為有效訊號），以及消除 advantage 分母接近零的數值不穩定邊界情況。',
      },
      { type: 'h2', id: 'token-level-pg', text: '五、技術三：Token-Level Policy Gradient Loss' },
      {
        type: 'callout',
        text: '對應問題：Sequence-level 的 loss 歸一化方式引入隱性的長度偏差。',
      },
      {
        type: 'p',
        text: 'GRPO 的 loss 計算方式，是把一條回應裡所有 token 的 log-prob loss 加總後，除以這條回應的 token 數（sequence-level 歸一化）。這製造了一個問題：相同的 reward，短回應的每個 token 得到更強的梯度訊號，長回應的每個 token 得到更弱的訊號。在 RLVR 設置（0/1 reward）下，短的正確回應每個 token 梯度很強；長的錯誤回應每個 token 懲罰梯度很弱。結果：模型在訓練中逐漸傾向對錯誤回應產生更長的輸出，因為這樣每個 token 的懲罰更小。這正是 Liu 等人（arXiv:2503.20783, Dr. GRPO）用實驗量化的 GRPO 長度偏差現象。',
      },
      {
        type: 'p',
        text: 'DAPO 改用 Token-Level Policy Gradient Loss：把整個 batch 的 loss 計算從「每條 sequence 歸一化後求和」改成「對所有 token 平等對待」——用 token 數而非 sequence 數作為歸一化分母。這樣不管回應有多長，每個 token 的梯度貢獻量是可比較的，長度偏差被消除。從工程實作角度看，這個修改只需幾行 code，但對訓練穩定性和最終效果的影響是可觀的（arXiv:2503.14476）。',
      },
      { type: 'h2', id: 'entropy-bonus', text: '六、技術四：Entropy Bonus + Overlong Reward Shaping' },
      {
        type: 'callout',
        text: '對應問題：entropy 崩潰（過度利用）+ length hacking（無意義延長輸出）。',
      },
      {
        type: 'p',
        text: 'RLVR 訓練的中後期，常見失效模式是：模型的輸出分佈變得越來越尖銳（entropy 持續下降），最終某些 token 的輸出機率接近 1，模型停止探索其他可能的推理路徑。Xi 等人（BAPO，arXiv:2510.18927）在理論上說明，固定 clip 機制在 off-policy 設置下會系統性地阻止 entropy 上升的更新，把策略推向過度利用（over-exploitation）——這個現象在 on-policy GRPO 訓練中也類似地出現。',
      },
      {
        type: 'p',
        text: 'DAPO 在 reward 函數裡加入 Entropy Bonus 項，直接鼓勵輸出分佈的多樣性：reward_total = reward_verifiable + λ × H(π_θ)，其中 H(π_θ) 是當前策略的 Shannon entropy，λ 是權重係數。這讓模型在最大化推理準確度的同時，保持輸出分佈的探索性，防止過早收斂。',
      },
      {
        type: 'p',
        text: 'Length hacking 的另一面是：模型在拿不到推理 reward 時，可能轉向靠「輸出更長的回應」刷機率，最終輸出大量無意義填充文字。DAPO 的 Overlong Reward Shaping 對超過設定最大長度的回應施加軟性懲罰，懲罰力度與超出長度成正比（而非硬截斷）。硬截斷在訓練訊號上造成突然的不連續性；軟性懲罰提供平滑的梯度，讓模型學會「寫到夠長就好，不要無限延伸」（具體懲罰函數形式見 arXiv:2503.14476 原論文）。',
      },
      { type: 'h2', id: 'integration', text: '七、整合：四項技術的系統效果' },
      {
        type: 'p',
        text: '把這四項技術放在一起看，DAPO 做的事情是在訓練流程的四個不同環節各修一個洞，互相補強。DAPO 論文做了完整的 ablation study，說明每一項的獨立貢獻（詳見 arXiv:2503.14476 原論文 ablation tables）。最終結果：以 Qwen2.5-32B base model 為起點，DAPO 在 AIME 2024 上達到 50 分，在當時的開源系統中達到頂尖水準。',
      },
      {
        type: 'list',
        items: [
          'Clip-Higher（非對稱 clip）→ 優化目標層：正向更新被對稱 clip 壓制的問題',
          'Dynamic Sampling → 資料效率層：無效 batch 浪費算力的問題',
          'Token-Level PG Loss → 梯度計算層：長度偏差誘導廢話輸出的問題',
          'Entropy Bonus + Overlong Shaping → 獎勵設計層：Entropy 崩潰 + length hacking 的問題',
        ],
      },
      { type: 'h2', id: 'after-dapo', text: '八、DAPO 之後：這個領域還在快速演進' },
      {
        type: 'p',
        text: 'DAPO 在三月發布之後，整個 RLVR 方法論領域噴發了大量後續工作，每一篇都在 DAPO 的基礎上做一個特定問題的修補。核心問題始終是同樣那幾個：clip 機制的設計、採樣策略的效率、reward shaping 的穩定性，以及梯度計算層的偏差。',
      },
      {
        type: 'list',
        items: [
          'Understanding R1-Zero / Dr. GRPO（arXiv:2503.20783）：用受控實驗量化 GRPO 的長度偏差，提出更無偏的梯度估計方法，以 7B base model 達到 AIME 2024 的 43.3% 準確率。',
          'BAPO（arXiv:2510.18927，HuggingFace Papers 85 upvotes）：針對 off-policy 設置下的 entropy 崩潰問題，理論推導出 Entropy-Clip Rule，提出自適應 clip 邊界。其 32B 模型宣稱超越 o3-mini 和 Gemini-2.5-Flash-Thinking（注意：preprint 結果，待同儕審查確認）。',
          'GTPO（arXiv:2508.03772）：分析「衝突 token」問題——同一 token 在正確回應和錯誤回應裡都出現，導致梯度方向互相衝突——提出 trajectory-level 的梯度保護機制。',
          'DHPO（arXiv:2601.05607）：在 token-level 和 sequence-level importance ratio 之間做動態混合，試圖同時保留兩者的優勢，在 Qwen3 系列 dense 和 MoE 模型上均超越 GRPO。',
        ],
      },
      {
        type: 'callout',
        text: '讀 DAPO，是進入這個領域的最好起點，因為它把問題分析得最完整、最系統，而且完全開源（程式碼 + verl 框架 + 資料集全部釋出）。之後再讀 Dr. GRPO、BAPO、GTPO，會清楚知道每一篇在解決什麼，不會迷失。',
      },
      {
        type: 'callout',
        text: '所有引用來源均為 arXiv preprint，尚未同儕審查。Benchmark 數字以各論文發表當下為準，此後可能有更新結果。',
      },
    ],
  },
  {
    id: 'event-camera-motion-analysis',
    category: 'method',
    title: 'Event Camera 是什麼、能解決動作分析的哪些痛點：給生物力學研究者的入門整理',
    excerpt:
      'Event camera（事件相機 / DVS）跟一般 RGB 相機在感測機制上根本不同，不是固定 frame rate 拍照，而是每個 pixel 各自非同步回報亮度變化。這篇用 IEEE TPAMI 兩篇 survey 與幾篇 peer-reviewed 應用論文，整理它的技術特性與動作分析切入點。',
    publishedAt: '2026-05-06',
    readingTime: '13 分鐘',
    featured: false,
    coverImage: eventCameraMotionAnalysisCover,
    tableOfContents: [
      { id: 'why-this-topic', title: '一、為什麼想寫這一篇' },
      { id: 'what-is-event-camera', title: '二、Event camera 是什麼：感測機制的根本差異' },
      { id: 'four-key-numbers', title: '三、四個常被引用的關鍵技術數字' },
      { id: 'three-entry-points', title: '四、動作分析 / 生物力學的三個切入點' },
      { id: 'practical-reminders', title: '五、評估事件相機適不適合你的研究時，可以注意的幾件事' },
      { id: 'when-to-use', title: '六、總結：什麼樣的研究題目適合用 event camera' },
    ],
    content: [
      { type: 'h2', id: 'why-this-topic', text: '一、為什麼想寫這一篇' },
      {
        type: 'p',
        text: '生物力學實驗室裡每個人都熟悉 Vicon / Qualisys 那種光學動作分析、IMU、力板、EMG，但 event camera（事件相機）這個器材在台灣的 lab 還不算普及，一方面是設備價格 / 取得管道的問題，一方面是它的訊號型態跟一般相機差太多，要重新學一套處理邏輯。我自己這陣子讀了一些相關論文，覺得它有幾個特性對「動作分析 / 運動相關研究」確實有意義，特別是高速動作的瞬態量測（一般相機 fps 不夠）、低光 / 高動態對比場景（一般相機 over-/under-expose）、低功耗的長期居家或穿戴監測。',
      },
      {
        type: 'p',
        text: '這篇要做四件事：把 event camera 的感測機制講清楚；整理四個最常被引用的技術數字，每個都附 IEEE Xplore / PubMed primary 引用；列三個動作分析與生物力學的可能應用方向，並對應到具體的論文；最後給打算試用前的研究者一些務實提醒。',
      },
      {
        type: 'callout',
        text: '先說限制：我自己沒實際操作過 event camera 跑下肢生物力學實驗，這篇是「整理現有文獻 + 標出可能切入點」，不是「使用心得」。實際採購 / 使用前請以官方文件與你親自測試結果為準。',
      },
      { type: 'h2', id: 'what-is-event-camera', text: '二、Event camera 是什麼：感測機制的根本差異' },
      {
        type: 'p',
        text: '一般 RGB / monochrome 相機（frame-based camera）的工作方式是：以固定 frame rate（30 / 60 / 240 fps）對整個感光元件「同步曝光」一次，輸出一張完整 image。Event camera 完全不是這個模式。用 Gallego 等人在 IEEE TPAMI（2022）survey 裡的講法摘要一下：事件相機是 bio-inspired 感測器，不以固定 frame rate 拍照，而是讓每個 pixel 非同步地測量亮度變化，輸出一串事件流，每筆事件編碼時間、座標、變化正負號。',
      },
      {
        type: 'p',
        text: '翻成生物力學研究者比較熟悉的講法：每個 pixel 是獨立、非同步的感測元件，類似獨立的微小亮度變化偵測器；當某個 pixel 偵測到亮度（log intensity）變化超過一個閾值，才會輸出一筆 event，事件包含時間戳 t、座標 (x, y)、極性 ±1（亮 / 暗變化）；沒動作的場景就完全沒輸出，動作越快 / 對比越強，輸出 event 密度越高。',
      },
      {
        type: 'p',
        text: '這跟你習慣的 video 完全不一樣，它輸出的不是「圖」，而是「事件流（event stream）」。下游演算法（深度學習、optic flow、SLAM 等）都需要重新設計才能消化這種訊號。',
      },
      {
        type: 'callout',
        text: 'Gallego G, Delbrück T, Orchard G, Bartolozzi C, et al. Event-Based Vision: A Survey. IEEE Trans Pattern Anal Mach Intell, 2022;44(1):154–180. https://doi.org/10.1109/TPAMI.2020.3008413',
      },
      {
        type: 'callout',
        text: 'Cimarelli C, Millan-Romera JA, Voos H, Sanchez-Lopez JL. Hardware, Algorithms, and Applications of the Neuromorphic Vision Sensor: A Review. Sensors, 2025;25(19):6208. https://doi.org/10.3390/s25196208',
      },
      { type: 'h2', id: 'four-key-numbers', text: '三、四個常被引用的關鍵技術數字' },
      {
        type: 'p',
        text: '下面四個是讀任何 event camera 相關論文必會看到的特性，以下數字主要來自 Gallego 等人 2022 IEEE TPAMI survey。',
      },
      {
        type: 'p',
        text: '(1) 微秒級時間解析度：Event 的時間戳精度為微秒（μs）等級。一般高速相機要做到等效時間解析度（μs 級單一事件偵測），需要極高 fps（>10 kHz）才能逼近，但這在傳統相機面臨儲存、計算、頻寬全面 bottleneck。',
      },
      {
        type: 'p',
        text: '(2) 動態範圍 140 dB：Event camera 的動態範圍可達 140 dB，相比之下傳統相機通常為 60 dB。在日光直射跟陰影同時出現的場景（例如戶外田徑場、復健治療室裡的 sun spot、半開窗的居家環境）一般相機會局部過曝或過暗，而 event camera 仍能輸出有效訊號。',
      },
      {
        type: 'p',
        text: '(3) 低功耗、kHz 級 pixel bandwidth：Gallego 等人 2022 survey 描述事件相機具備低功耗、kHz 量級的 pixel bandwidth，因此 motion blur 大幅減少。實際意義是適合做穿戴式 / 邊緣裝置，特別是長期居家或運動場域監測，不需要傳大量 frame 回伺服器，只需要傳事件流，頻寬與電力預算都比 frame-based 低很多。',
      },
      {
        type: 'p',
        text: '(4) 稀疏訊號適合 spiking neural network 處理：Event camera 輸出的稀疏、非同步訊號型態，與 spiking neural network（SNN）與 neuromorphic processor（如 Intel Loihi、IBM TrueNorth）天生匹配。具體實證：Ceolini 等人（2020，Frontiers in Neuroscience）做了一個 DVS + EMG 感測融合做手勢辨識的 benchmark，在 Loihi、ODIN+MorphIC 等 neuromorphic 平台上跑出與 GPU baseline 相當的分類精度，但 energy-delay product 是 GPU 系統的 30× 到 600× 更省電（推論時間慢 20–40%）。',
      },
      {
        type: 'callout',
        text: 'Ceolini E, Frenkel C, Shrestha SB, Taverni G, Khacef L, Payvand M, Donati E. Hand-Gesture Recognition Based on EMG and Event-Based Camera Sensor Fusion: A Benchmark in Neuromorphic Computing. Front Neurosci, 2020;14:637. https://doi.org/10.3389/fnins.2020.00637',
      },
      {
        type: 'callout',
        text: 'Tenzin S, Rassau A, Chai D. Application of Event Cameras and Neuromorphic Computing to VSLAM: A Survey. Biomimetics, 2024;9(7):444. https://doi.org/10.3390/biomimetics9070444',
      },
      {
        type: 'quote',
        text: '一句話總結這節：Event camera 不是「更快的一般相機」，而是「一種訊號型態完全不同的感測器」。它不會取代 Vicon / GoPro / IMU，但在「一般相機做不到」的窄場景裡有獨特價值。',
      },
      { type: 'h2', id: 'three-entry-points', text: '四、動作分析 / 生物力學的三個切入點' },
      {
        type: 'p',
        text: '這節我把 event camera 對動作分析「比較有可能落地」的三個方向整理出來，每個都對應到具體論文。這不是研究題目建議，只是「這個技術能解的痛點」清單。',
      },
      {
        type: 'p',
        text: '切入點 (a) 高速、瞬態動作的精確時間量測：棒球揮棒、衝刺起步、跳躍著地、跑步腳跟著地的瞬間（< 50 ms），這些是運動生物力學最關心的瞬態事件，但用 240 fps GoPro / 1000 fps 高速相機要付出儲存與後製代價，且需要精確光源同步。μs 級時間解析度 + 高動態範圍，理論上能精確標定瞬態事件的時間點，且不會因為快速移動而 motion blur。Sehara 等人（2019，eNeuro）的 DVS 系統就是一個實際示範：他們追蹤小鼠以約 25 Hz 揮動的觸鬚，用 event-driven 系統做到 2 ms 內的位置反饋觸發，傳統 frame-based 影像處理 pipeline 很難達到這個延遲。',
      },
      {
        type: 'p',
        text: '把這個概念搬到人類運動：人體 pose 估計與動作辨識在過去六年已經有一系列 peer-reviewed 工作。代表性的有 DHP19（Calabrese 等人 2019，IEEE/CVF CVPRW），首個公開的 DVS 人體 3D pose 資料集，用 4 台同步 DVS 攝影機收 17 位受試者的 33 種動作，paper 中報告的 3D pose error 約為 8 cm；以及 EV-ACT（IEEE TPAMI）的事件相機動作辨識 benchmark、Du 等人 2025 年在 Sensors 提出的 JGLTM 方法。把這條 pose 估計的精度進一步推進、並整合到下肢生物力學流程裡，是後續可以延伸的研究方向。',
      },
      {
        type: 'callout',
        text: 'Sehara K, Bahr V, Mitchinson B, Pearson MJ, Larkum ME, Sachdev RNS. Fast, Flexible Closed-Loop Feedback: Tracking Movement in "Real-Millisecond-Time". eNeuro, 2019;6(6):ENEURO.0147-19.2019. https://doi.org/10.1523/ENEURO.0147-19.2019',
      },
      {
        type: 'callout',
        text: 'Calabrese E, Taverni G, Awai Easthope C, Skriabine S, Corradi F, Longinotti L, Eng K, Delbruck T. DHP19: Dynamic Vision Sensor 3D Human Pose Dataset. CVPRW (IEEE/CVF), 2019. https://ieeexplore.ieee.org/document/9025364/',
      },
      {
        type: 'p',
        text: '切入點 (b) 低光 / HDR 環境的居家監測：老人居家跌倒、夜間意外、半開窗陽光斜射的客廳，一般 RGB 相機在這些場景下訊號常常不可用，但研究社群長期關心這些情境。140 dB 動態範圍意味著可以在「同一個畫面同時有強光與陰影」的情況下還能輸出有效事件。再加上稀疏輸出特性，事件流相較於 RGB frame 不直接呈現顏色與紋理細節，在「看到動作輪廓、但臉部紋理不清晰」的應用情境上有概念性的優勢，這對居家監測這種介意被錄影的場景是個方向。',
      },
      {
        type: 'p',
        text: '切入點 (c) 穿戴 / 邊緣裝置的低功耗動作感測：穿戴式動作分析裝置最大限制是電池，加上 frame-based camera 模組功耗高，多數做不到全天 always-on。低功耗 + kHz 級 bandwidth + 稀疏輸出，特別適合穿戴 / 嵌入式場景。Ceolini 等人 2020 的工作就是把 DVS 跟 EMG 整合，做手勢辨識；他們的 30×–600× energy-delay product 改善是這個切入點的具體量化證據。把這個概念搬到生醫工程的研究題目：可以是 prosthetic hand 控制、rehab exercise 計次、運動表現監測手環，任何「需要動作偵測但不能背一塊大電池」的應用都是候選。',
      },
      {
        type: 'p',
        text: '補一個尚未成熟但值得追的方向 — 3D 動作分析：事件相機的 stereo / 3D depth 估計在過去五年是熱門研究主題，2025 年 IEEE TPAMI 上 Ghosh & Gallego 做了一篇 survey。但 stereo event 演算法的精度與穩定度還沒到能取代光學 motion capture 的程度，這篇 survey 自己也明確指出 accuracy 與 efficiency 都還有 gap。如果你的研究需要替代 Vicon，現在還早；但如果是「補充訊號 + 用其他特性彌補光學系統的弱點」，就有空間。',
      },
      {
        type: 'callout',
        text: 'Ghosh S, Gallego G. Event-Based Stereo Depth Estimation: A Survey. IEEE Trans Pattern Anal Mach Intell, 2025;47(10):9130–9149. https://doi.org/10.1109/TPAMI.2025.3586559',
      },
      {
        type: 'callout',
        text: 'Du F, Shao Z, Wang X, Yang J, Dai J. A Joint Global and Local Temporal Modeling for Human Pose Estimation with Event Cameras (JGLTM). Sensors, 2025;25(9):2868. https://doi.org/10.3390/s25092868',
      },
      {
        type: 'callout',
        text: 'Wang Y, et al. Action Recognition and Benchmark Using Event Cameras. IEEE Trans Pattern Anal Mach Intell, 2023. https://ieeexplore.ieee.org/document/10198747/',
      },
      { type: 'h2', id: 'practical-reminders', text: '五、評估事件相機適不適合你的研究時，可以注意的幾件事' },
      {
        type: 'p',
        text: '這節不是 open problem 清單，而是給打算試用事件相機的研究者一些務實的提醒。',
      },
      {
        type: 'list',
        items: [
          '公開人體事件相機資料集偏通用 daily action：DHP19（17 受試者、33 動作、4 台 DVS）跟 EV-ACT 等動作辨識 benchmark 是目前最常用的公開資源，但動作集合並不是專為 gait / running / 復健動作設計，所以如果你的應用題目偏臨床或運動科學，多數情況可能要自己錄資料。',
          'pose 估計精度跟光學 motion capture 還有差距：DHP19 自報的 3D pose error 約 8 cm，Du 等人 2025 的 JGLTM 雖在 event-based 資料集上推進了精度，但還在 image-domain pose error 等級，跟 Vicon 的 sub-mm 仍差一個量級。所以目前定位上比較像「補時間解析度」、不是「取代光學 motion capture 主訊號」。',
          '採購可及性：DVS / Prophesee / iniLabs 的硬體取得管道、價格、技術支援，相較 IMU / GoPro 沒那麼普及；這部分屬於現實限制，採購前直接問代理商比看文獻更有效。',
        ],
      },
      { type: 'h2', id: 'when-to-use', text: '六、總結：什麼樣的研究題目適合用 event camera' },
      {
        type: 'p',
        text: '下面這幾個 checklist 可以幫你判斷 event camera 是不是合適工具。',
      },
      {
        type: 'list',
        items: [
          '你關心的物理量是「亮度有變化的瞬態事件」（heel-strike、揮棒接觸點、肌肉抽搐）→ event camera 強項。',
          '你的場景是「一般相機會 over/under expose」（戶外、半逆光、夜間）→ event camera 強項。',
          '你需要「長期、低功耗、不收完整 RGB 紋理」的居家或穿戴監測 → event camera 強項。',
        ],
      },
      {
        type: 'quote',
        text: '跟你現有的 toolchain 搭著用，例如「光學 mocap 主訊號 + event camera 補捕快速瞬態」，比「全套換成 event camera」現實得多。',
      },
    ],
  },
  {
    id: 'ai-medical-imaging-2026-papers',
    category: 'community',
    title: '這週社群熱門：三個 2026 AI × 醫學影像新 paper 解讀',
    excerpt:
      '五月初社群熱度最高的三篇：Medical SAM3（通用醫學影像分割）、RDBCycleGAN-CBAM（低劑量 CT 去噪）、VascFlexMap（稀疏微血管超音波重建）。',
    publishedAt: '2026-05-04',
    readingTime: '12 分鐘',
    featured: false,
    coverImage: aiMedicalImaging2026PapersCover,
    tableOfContents: [
      { id: 'why-these-three', title: '一、為什麼挑這三篇' },
      { id: 'medical-sam3', title: '二、Medical SAM3：把 SAM3 變成「能聽懂醫學名詞的通用分割器」' },
      { id: 'rdbcyclegan-cbam', title: '三、RDBCycleGAN-CBAM：低劑量 CT 去噪的「組合拳」' },
      { id: 'vascflexmap', title: '四、VascFlexMap：把超音波 microvascular imaging 的資料量門檻降下來' },
      { id: 'three-trends', title: '五、三篇放在一起，看到的三個 2026 趨勢' },
    ],
    content: [
      { type: 'h2', id: 'why-these-three', text: '一、為什麼挑這三篇' },
      {
        type: 'p',
        text: '最近兩週社群裡看到不少朋友在轉貼 2026 開年的幾篇 AI × 醫學影像 preprint，我自己花了點時間把連結點開來看。下面挑三篇我覺得「方向不一樣，但值得討論的論文」：Medical SAM3（arXiv 2601.10880）從 SAM3 微調到醫學影像通用分割，是 foundation model 路線的最新 instance；RDBCycleGAN-CBAM（bioRxiv 2026.02.17.706311）做低劑量 CT 去噪，方向比較傳統但有具體 PSNR/SSIM 數字；VascFlexMap（bioRxiv 2026.02.27.708398）用 transformer-decoder 從稀疏 contrast-enhanced ultrasound（CEUS）資料重建微血管圖。',
      },
      {
        type: 'callout',
        text: '先講重要前提：三篇都還在 arXiv / bioRxiv 階段，尚未通過同儕審查。下面看到的所有 Dice、PSNR、SSIM、加速倍數都是作者自陳，還沒有第三方驗證。我們在自己論文裡轉引這些數字的時候，至少要等到正式期刊版本出來再說。',
      },
      {
        type: 'p',
        text: '我自己讀的時候會問三個問題：(a) 它解決了哪個臨床或工程上具體的痛點；(b) 指標進步有多大；(c) 我們在做小資料生醫工程題目時，有什麼地方可以借鏡。下面就照這個框架走。',
      },
      { type: 'h2', id: 'medical-sam3', text: '二、Medical SAM3：把 SAM3 變成「能聽懂醫學名詞的通用分割器」' },
      {
        type: 'p',
        text: '痛點：SAM（Segment Anything Model）系列的 promptable segmentation 在自然影像很強，但搬到醫學影像時泛化通常會掉。原因是醫學影像跟自然影像的視覺先驗差太多，CT、MRI、retinal fundus、超音波，每一種模態的對比度、雜訊分布都不一樣，SAM 從未在這些分布上見過足夠的樣本。',
      },
      {
        type: 'p',
        text: 'Medical SAM3 的策略是全參數微調，不是 PEFT、不是 adapter，而是直接拿 SAM3 在 33 個資料集、橫跨 10 個醫學影像模態的資料上做完整 fine-tuning，搭配分割 mask + 文字 prompt 的配對訓練。論文強調這樣能「強化醫學領域視覺先驗、改善 text-to-mask 對齊」，讓使用者只給類別名稱（例如 "retinal vessel"）也能拿到合理 mask。',
      },
      {
        type: 'p',
        text: '在數字方面：內部驗證的平均 Dice 從 SAM3 原版的 54.0% 提升到 77.0%（+23 百分點）；平均 IoU 從 43.3% 提升到 67.3%（+24 百分點）。外部測試（跨資料集泛化）的平均 Dice 從 11.9% 跳到 73.9%；平均 IoU 從 8.0% 跳到 64.4%。retinal vessel 的 DRIVE 資料集 Dice 從 24.8% 提升到 55.8%；COph100 從 34.1% 提升到 63.1%。',
      },
      {
        type: 'callout',
        text: 'Medical SAM3: A Foundation Model for Universal Prompt-Driven Medical Image Segmentation. arXiv:2601.10880（preprint, 尚未同儕審查；2026 年 1 月）。https://arxiv.org/abs/2601.10880',
      },
      {
        type: 'p',
        text: '第一，「foundation model 微調 + 領域內資料」目前看起來是 2025–2026 年生醫影像分割的主流路徑，但全參數微調的算力門檻不低，這對沒有大型 GPU cluster 的實驗室是個現實限制。如果原文釋出 LoRA / adapter 版本的對照實驗，會比現在的「全參數 vs. zero-shot」更有實務意義。第二，DRIVE 在 retinal vessel 領域是被研究透徹的 benchmark，55.8% Dice 在這個資料集上其實不算特別高，傳統 U-Net + 領域特化技巧的 SOTA 多年來都在 80%+ 區間。所以我傾向把這個結果讀成「通用 prompt-driven 模型在窄領域 benchmark 上仍輸給專用模型，但通用性是賣點」，不是「Medical SAM3 在 retinal vessel 上贏過 SOTA」。社群裡看到有些朋友把這個數字直接寫成「打敗 SOTA」，我覺得是過度解讀。',
      },
      {
        type: 'p',
        text: '另外，「外部 Dice 11.9% → 73.9%」這個數字看起來很驚人，但因為原本 11.9% 接近隨機水準，提升空間本來就很大；「外部」具體是哪些資料集、跟訓練分布的距離有多遠，要看正式版才能下判斷。',
      },
      {
        type: 'quote',
        text: '小結：方向值得追，但等正式版（peer review）+ 第三方獨立 benchmark 之後再放進自己的 related work，會比較穩。',
      },
      { type: 'h2', id: 'rdbcyclegan-cbam', text: '三、RDBCycleGAN-CBAM：低劑量 CT 去噪的「組合拳」' },
      {
        type: 'p',
        text: '痛點：低劑量 CT（low-dose CT, LDCT）是輻射劑量的折衷產物：劑量降到四分之一（quarter-dose）對病人較友善，但雜訊提高、會掩蓋細節（小結節、微鈣化），影響診斷。深度學習去噪的目標是把 LDCT 還原到接近 normal-dose CT 的影像品質。',
      },
      {
        type: 'p',
        text: 'RDBCycleGAN-CBAM 把三個既有元件組合在一起：CycleGAN 提供 unpaired 訓練（不需要配對的 LDCT/NDCT），這對臨床資料的取得是個重要優勢；Residual Dense Block (RDB) 強化特徵重用，是影像超解析領域常用元件；Convolutional Block Attention Module (CBAM) 是通道 + 空間注意力，幫模型抓細節。',
      },
      {
        type: 'p',
        text: '在數字方面，相對於 quarter-dose 輸入，平均 PSNR +3.97 dB、平均 SSIM +0.053。論文還補了 Wilcoxon signed-rank test、報告 rank-biserial correlation 接近 1.0、bootstrap CI 也很窄，這些統計細節比起「我們 PSNR 比較高」這種單一數字更可信。',
      },
      {
        type: 'callout',
        text: 'A NOVEL DEEP LEARNING MODEL, RDBCYCYLEGAN-CBAM FOR LOW-DOSE CT IMAGE DENOISING. bioRxiv 10.64898/2026.02.17.706311v1（preprint, 尚未同儕審查；2026 年 2 月）。https://www.biorxiv.org/content/10.64898/2026.02.17.706311v1',
      },
      {
        type: 'p',
        text: '第一，+3.97 dB PSNR 在 LDCT 去噪文獻裡是中段表現，不是 SOTA。這幾年低劑量 CT 去噪的論文很多，PSNR 提升 4–7 dB 的方法也有人做出來。原文也誠實寫到「outperforms most existing deep learning-based methods」而不是「SOTA」，這句話的措辭值得學習，我自己讀同類題目時，看到「outperforms most」這種用詞會比看到「SOTA」更願意往下讀。第二，CycleGAN 路線的 unpaired 訓練在臨床很實用：要拿到完美配對的 LDCT/NDCT 影像幾乎不可能（同一病人不會被掃兩次劑量），所以 unpaired 是必要設計，不是研究花樣。這是個值得借鏡的「題目選擇邏輯」，把臨床取得限制當成方法設計的起點。',
      },
      {
        type: 'p',
        text: '第三，這篇 preprint 的價值不在 SOTA 數字，而在它把 RDB、CBAM、CycleGAN 這幾個既有 building block 組合起來、做完整的對照與統計檢定。我自己讀類似題目時也比較喜歡這種「老元件、新組合、完整實驗」的論文，比堆 transformer 但實驗只跑一遍的論文有資訊量。',
      },
      {
        type: 'quote',
        text: '小結：方法不算最新潮，但實驗扎實。可以拿來當做去噪題目 baseline 比較對象，不用當成必引 SOTA。',
      },
      { type: 'h2', id: 'vascflexmap', text: '四、VascFlexMap：把超音波 microvascular imaging 的資料量門檻降下來' },
      {
        type: 'p',
        text: '痛點：Super-Resolution Ultrasound（SR-US）/ Ultrasound Localization Microscopy（ULM）這幾年發展快，可以看到傳統超音波看不到的微血管結構。但這類技術通常需要極高的 frame rate（kHz 級）+ 數萬 frame 累積，才能定位足夠的微氣泡，重建血管圖。對臨床部署是個門檻：要特殊硬體、長掃描時間、儲存成本高。',
      },
      {
        type: 'p',
        text: 'VascFlexMap 用一個 transformer-decoder 網路（單頭 self-attention），在稀疏採樣的 CEUS 序列上重建血管 probability map，跳過顯式的微氣泡定位與追蹤步驟。後處理階段再做空間細化，輸出最終血管圖。',
      },
      {
        type: 'p',
        text: '在數字方面：重建時間在 NVIDIA H100 GPU 上 28–133 秒完成端到端重建，依使用的 frame 數而定；解析度折衷上，相對於 reference SR-US，apparent vessel width 平均寬約 3 倍，主分支與較高階微血管仍可見；在原本 conventional ULM pipeline 在同樣稀疏資料下無法產生連續血管網絡的條件下，VascFlexMap 仍能恢復連貫的微血管拓撲。',
      },
      {
        type: 'callout',
        text: 'VascFlexMap: Microvascular Ultrasound Imaging at Low Frame Rates Using Sparse Data and a Transformer-Decoder Network. bioRxiv 10.64898/2026.02.27.708398v1（preprint, 尚未同儕審查；2026 年 2 月）。https://www.biorxiv.org/content/10.64898/2026.02.27.708398v1',
      },
      {
        type: 'p',
        text: '第一，這篇是「方法 + trade-off」的典型例子。作者明白自陳「以解析度換速度與資料量」，沒有假裝它是 SR-US 的全面替代。這種誠實的 trade-off 描述對博士生來說是好示範，你做的方法不一定要全面贏對照組，明確指出你贏在哪個 axis、輸在哪個 axis，論文會更可信。第二，vessel width 變寬約 3 倍這個代價要不要付，看臨床問題：如果是看「腫瘤血管化整體拓撲」，3 倍寬度可能還是有用；如果是看「血管直徑量化」，那這個方法不適合。生醫工程研究者選工具時，從臨床問題的容忍度反推技術規格比「比較指標誰大」重要很多。第三，算力部分，H100 是高階卡，論文沒明確報告在中階 GPU（A100 / 4090 / 3090）上的延遲。對台灣多數實驗室部署來說，這是個會影響 reproducibility 的細節，等正式版希望作者能補上。',
      },
      {
        type: 'quote',
        text: '小結：方向（少 frame、低硬體門檻 SR-US）很有臨床轉譯潛力，但解析度退化的代價要看具體應用評估，且 H100 依賴值得追問。',
      },
      { type: 'h2', id: 'three-trends', text: '五、三篇放在一起，看到的三個 2026 趨勢' },
      {
        type: 'p',
        text: '把這三篇對照看，浮現幾個我從這三篇 + 最近社群討論得出的觀察(不是嚴謹的 systematic review)：',
      },
      {
        type: 'list',
        items: [
          'Foundation model + 醫學特化微調仍是熱題，但社群開始更謹慎地比較「通用」與「專用」模型的 trade-off，而不是直接宣稱通用模型贏。Medical SAM3 在 DRIVE 上 55.8% Dice 不到傳統 SOTA 就是個例子。',
          'CycleGAN / unpaired 訓練在 2026 並沒有被 diffusion model 取代，反而在臨床資料配對困難的場景（CT 去噪、MRI 跨序列轉換）依然有人在優化既有架構。這樣的啟示是：不是新就一定好，舊方法 + 領域知識的組合有時更實用。',
          'Trade-off explicit 的論文寫作風格越來越受歡迎：VascFlexMap 與 RDBCycleGAN-CBAM 都明確寫出自己輸在哪、為什麼這個 trade-off 對特定臨床問題可接受。從這幾年生醫期刊的 review guideline 趨勢看，主動承認限制看起來比刻意藏起來更有利於通過審稿，這部分等大家在自己的投稿經驗裡再驗證。',
        ],
      },
    ],
  },
  {
    id: 'ai-prompting-workflow',
    category: 'community',
    title: '給 AI 寫精準指令的六個要素 + 一套可重複執行的工作流程',
    excerpt:
      '同樣一個任務，給 AI 不同寫法的 prompt 結果差很多，這幾乎是現在每個研究生都會遇到的情況。希望能給正在把 AI 放進日常工作的朋友一個可以馬上複製、再依自己領域微調的起手式。',
    publishedAt: '2026-05-01',
    readingTime: '6 分鐘',
    featured: false,
    coverImage: aiPromptingWorkflowCover,
    tableOfContents: [
      { id: 'why-this-topic', title: '一、為什麼想聊這個' },
      { id: 'six-elements', title: '二、六個要素：一個精準 prompt 通常包含什麼' },
      { id: 'four-step-workflow', title: '三、四步驟工作流程' },
      { id: 'common-failures', title: '四、幾個常見的 prompt 失敗模式' },
      { id: 'open-questions', title: '五、想跟大家討論的幾個問題' },
    ],
    content: [
      { type: 'h2', id: 'why-this-topic', text: '一、為什麼想聊這個' },
      {
        type: 'p',
        text: 'AI 工具進實驗室之後，有一個常見現象是同一個任務、不同人寫的 prompt 拿到的結果差很遠。有時候不是模型不夠強，而是指令本身就模糊。這篇想跟大家分享一個我自己看完文獻後常用的「六要素 + 四步驟」框架，比較簡單、可重複，也方便依自己的研究領域再加細節。',
      },
      {
        type: 'p',
        text: '文獻裡關於 prompt 設計對結果影響有多大，已經有一些蠻具體的數字。Kojima 等人 2022 年的 arXiv preprint 報告了一個經典例子，對 LLM 加上「Let\'s think step by step」這一句話，MultiArith 的 zero-shot accuracy 從 17.7% 提升到 78.7%、GSM8K 從 10.4% 提升到 40.7%。Wei 等人 2022 年的 chain-of-thought paper 也在 540B 模型上以 8 個 few-shot 推理範例達到 GSM8K SOTA。換句話說，prompt 的形狀對結果的影響量級，跟換更大模型有時候是同等級的。',
      },
      {
        type: 'callout',
        text: 'Kojima et al. (2022), Large Language Models are Zero-Shot Reasoners. arXiv:2205.11916（preprint, 尚未同儕審查；後收於 NeurIPS 2022）。https://arxiv.org/abs/2205.11916',
      },
      {
        type: 'callout',
        text: 'Wei et al. (2022), Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. arXiv:2201.11903（preprint, 尚未同儕審查；後收於 NeurIPS 2022）。https://arxiv.org/abs/2201.11903',
      },
      { type: 'h2', id: 'six-elements', text: '二、六個要素：一個精準 prompt 通常包含什麼' },
      {
        type: 'p',
        text: '我自己會把一個 prompt 拆成下面六塊。不是每塊都一定要寫，但缺哪一塊通常就是後面要重 prompt 的原因。',
      },
      {
        type: 'list',
        items: [
          '角色 (Role)：讓 AI 知道用什麼視角回答。例：「你是一位熟悉生物力學步態分析的審稿人」。',
          '背景 (Context)：手上的素材、限制、已知條件。例：「我手上有 N=18 的步態資料，採樣率 100 Hz，受試者為健康成人」。',
          '任務 (Task)：要 AI 做的具體動作，動詞清楚。例：「列出三個適合的統計檢定，並說明各自前提假設」。',
          '輸出格式 (Format)：表格、條列、Markdown、JSON、字數上限。例：「請用 Markdown 表格，欄位包含『方法』『前提假設』『不適用情境』」。',
          '範例 (Examples)：1 到 3 個 few-shot 示範，特別是輸出格式不易用文字描述時。CoT 文獻顯示加幾個推理範例可以顯著拉高複雜任務表現。',
          '約束與失敗條件 (Constraints)：不要做什麼、找不到答案時怎麼回答。例：「找不到 peer-reviewed 文獻支持時請寫『資料不足』，不要編造引用」。',
        ],
      },
      {
        type: 'p',
        text: '我自己看到比較容易被省略的是第 4（格式）和第 6（約束）。少了格式會讓我每次都要手動整理輸出，少了約束則容易讓 AI 在不確定時硬補引用或數字，這在學術場景上比較不好處理。',
      },
      { type: 'h2', id: 'four-step-workflow', text: '三、四步驟工作流程' },
      {
        type: 'p',
        text: '把上面六要素拼成一次性 prompt 通常還不夠。我自己看到比較穩的做法是把它包進一個小型迭代流程：',
      },
      {
        type: 'p',
        text: 'Step 1：定義可驗收的輸出。先用一句話寫下「我會接受什麼樣的結果」。例如：「一份 Markdown 表格、3 列、每列含方法 + 前提假設 + 一個適用情境，且每個方法都附 PubMed DOI」。這一步的目的是幫自己想清楚什麼算成功，避免後面看到輸出才模糊地說「不太對」。',
      },
      {
        type: 'p',
        text: 'Step 2：草擬 prompt（六要素填一遍）。把上一段六要素過一遍，缺什麼補什麼。寫完先自己讀一次，看 Task 跟 Format 是否一致、Constraints 有沒有涵蓋自己最擔心 AI 出錯的點。',
      },
      {
        type: 'p',
        text: 'Step 3：小樣本測試 + 比對驗收標準。我自己會傾向不要一次跑全資料。先丟一個小範例（一筆資料、一段文字），看輸出能不能對上 Step 1 的驗收標準。如果對不上，回到 Step 2 修 prompt，通常修的是 Format 或 Constraints，不是 Task。',
      },
      {
        type: 'p',
        text: 'Step 4：紀錄能用的 prompt + 條件。這一步最常被跳過，但長期最有用。能用的 prompt 存下來、註明「在哪個模型、哪一版」「適用在什麼樣的輸入」。下一次同類任務直接套，不用每次重想。我自己會建一個 prompts/ 資料夾，每個檔案頂端寫三行：用途、適用輸入、輸出格式。',
      },
      { type: 'h2', id: 'common-failures', text: '四、幾個常見的 prompt 失敗模式' },
      {
        type: 'p',
        text: '從文獻加上我自己看到大家分享的經驗整理出來的：',
      },
      {
        type: 'list',
        items: [
          '任務太大顆：例如「幫我寫一篇文獻回顧」，AI 會給一個鬆散結構。改成「列出 5 篇 2023 年後的 IMU 步態 paper，每篇 50 字摘要 + DOI」我自己拿到的結果通常會穩很多。',
          '角色與任務不匹配：把角色寫成「資深教授」但任務是「幫我修語法」，AI 容易在小任務上加上不必要的批判語氣。我自己會傾向把角色設定跟任務複雜度對齊。',
          '沒設失敗條件：AI 在不確定時容易硬補（特別是引用、統計數字）。明確寫「找不到就回答『資料不足』」可以擋掉很大一部分幻覺。',
          '一次堆太多要求：六要素都寫滿、加上五個範例、再加三層條件，AI 反而會抓重點抓錯。我自己會傾向先寫精簡版，不夠再補。',
        ],
      },
      { type: 'h2', id: 'open-questions', text: '五、想跟大家討論的幾個問題' },
      {
        type: 'p',
        text: '寫到這裡有幾個我也還在摸索的：prompt 該寫多長（有人主張越精簡越好、有人覺得寫長一點 AI 比較不會誤會，文獻在不同任務上看到的結論不太一致）；要不要每次都加 CoT（對推理型任務 CoT 顯著有用，但對「請翻譯這段」這種任務反而會讓回答變囉嗦）；prompt 版本管理（把 prompt 當作 code 來 git 管理是不是過度，還是其實這樣做才比較長久）。',
      },
      {
        type: 'quote',
        text: '如果這幾個問題大家有自己的做法，蠻歡迎在社群裡分享。AI prompting 是「每個人都在做、但很少寫成方法論」的那種題目，多交流可能會比閉門摸索快一些。',
      },
    ],
  },
  {
    id: 'small-dataset-deep-learning-biomechanics',
    category: 'method',
    title: '小資料集 + 深度學習：生物力學研究的五個方向',
    excerpt:
      '整理 2021–2026 文獻裡看到的五個方向：合成資料、遷移學習、自監督預訓練、嚴格的跨受試者驗證、輕量模型，在小資料場景下這些選項各自的取捨。',
    publishedAt: '2026-04-29',
    readingTime: '13 分鐘',
    featured: false,
    coverImage: smallDatasetDLBiomechanicsCover,
    tableOfContents: [
      { id: 'why-small-data', title: '一、為什麼小資料是我們的常態，不是例外' },
      { id: 'synthetic-data', title: '二、方向 1：用肌肉骨骼模型生成合成資料' },
      { id: 'transfer-learning', title: '三、方向 2：遷移學習 + 個體化 fine-tune' },
      { id: 'ssl-pretraining', title: '四、方向 3：自監督預訓練（SSL），用沒標註的資料先學表徵' },
      { id: 'validation', title: '五、方向 4：嚴格一點的跨受試者 / 跨資料集驗證' },
      { id: 'lightweight-models', title: '六、方向 5：模型先輕量化，再談深度學習' },
      { id: 'decision-tree', title: '七、五個方向能怎麼搭配，一個草稿級的決策邏輯' },
      { id: 'open-questions', title: '八、想跟大家一起討論的幾個問題' },
    ],
    content: [
      { type: 'h2', id: 'why-small-data', text: '一、為什麼小資料是我們的常態，不是例外' },
      {
        type: 'p',
        text: '我猜大家在做生物力學或醫材臨床研究時，看到下面這幾個情況都會很有共鳴：IRB 雖然過了，但儀器排程、受試者招募、退出率一路扣下來，最後拿到完整資料的可能就 20–40 人；每位受試者貢獻幾十到幾百個步態週期，但個體間變異往往遠大於個體內變異；病人組或特殊族群（腦性麻痺、術後復健、運動傷害）更稀缺，常常只有十幾位。',
      },
      {
        type: 'p',
        text: '對照影像領域動輒 ImageNet（128 萬張）、UK Biobank（70 萬人日穿戴資料）的規模，我們手上的資料規模真的是另一個世界。但很多審稿意見裡提到「為什麼不試試 deep learning？」這個問題出現得越來越頻繁，相信不少朋友也遇過。',
      },
      {
        type: 'quote',
        text: '所以這篇想跟大家整理 2021–2026 文獻裡看到的五個方向。重點不是「深度學習比較好」這種二元判斷，而是想一起討論：在小資料場景下，這些選項各自的成本、效益、適用範圍是什麼。',
      },
      { type: 'h2', id: 'synthetic-data', text: '二、方向 1：用肌肉骨骼模型生成合成資料' },
      {
        type: 'p',
        text: '最直接的補資料方法，是用 OpenSim 等肌肉骨骼模型，從動作捕捉資料反推身上某個位置的虛擬 IMU 訊號，再拿來訓練模型。Sharifi Renani 等人 2021 年在《Sensors》的研究做了完整示範：他們用合成資料訓練神經網路預測髖、膝關節三軸旋轉角度，純合成訓練的模型在六個自由度中有五個贏過純量測訓練；髖關節 RMSE 從 4.5° 降到 2.3°（−38%），膝關節從 3.3° 降到 2.9°（−11%）。當合成 + 量測一起訓練時，髖關節 RMSE 進一步降到 1.9°（vs. 純量測 4.5°，−54%）、膝關節到 1.7°（−45%）。',
      },
      {
        type: 'callout',
        text: 'Sharifi Renani et al. (2021), The Use of Synthetic IMU Signals in the Training of Deep Learning Models Significantly Improves the Accuracy of Joint Kinematic Predictions. Sensors. https://doi.org/10.3390/s21175876',
      },
      {
        type: 'p',
        text: '不過合成資料一直有個大家都知道的問題：虛擬 IMU 訊號跟真實穿戴的 IMU 之間有 sim-to-real gap。Bicer 等人 2026 年在《Journal of Biomechanics》用一個盲測設計把這個落差量化得很清楚：他們用 49 位健康成人的公開動捕資料合成虛擬 IMU 訓練 NN，再用另一個實驗室、不同收案協議的 7 位健康成人真實 IMU 盲測。模型在虛擬 IMU 上 RMSE 只有 2.6°（角度）/ 0.10 Nm/kg（力矩），但搬到真實 IMU 退化到 4.5° / 0.21 Nm/kg；後來用 3 位額外受試者的真實 IMU 做 fine-tune 後，回到 2.6° / 0.19 Nm/kg。',
      },
      {
        type: 'callout',
        text: 'Bicer et al. (2026), Predicting human gait kinematics and kinetics from a single inertial measurement unit using deep learning and synthetic datasets: A blinded assessment study. Journal of Biomechanics. https://doi.org/10.1016/j.jbiomech.2026.113149',
      },
      {
        type: 'p',
        text: '我自己會這樣理解：合成資料比較像是「預訓練 + 量測 fine-tune」流程的前段，單獨用合成資料就宣稱在真實場景下的表現，看起來是會被現有文獻的盲測設計挑戰的。不知道大家在自己的題目上會怎麼處理這個落差？',
      },
      { type: 'h2', id: 'transfer-learning', text: '三、方向 2：遷移學習 + 個體化 fine-tune' },
      {
        type: 'p',
        text: '第二個方向是把別人訓練好的模型搬過來，再用手上少量資料 fine-tune。醫療影像領域已經是慣例做法，這兩年在穿戴式感測器領域也累積了一些驗證。Hur 等人 2025 年在《Scientific Reports》比較了三種策略：(a) 單一受試者個人化模型、(b) 多受試者通用模型、(c) 多受試者通用 + 新使用者 fine-tune。結果是 (a) 對該人準度最高但完全不通用，(b) 因為步態個體差異大導致準度下降，(c) 用新使用者一小部分資料 fine-tune 後可達到與 inverse kinematics 相當的表現。他們也分析了感測器位置，整理出在大多數情況下股骨（femur）+ 跟骨（calcaneus）兩個 IMU 是不錯的組合。',
      },
      {
        type: 'callout',
        text: 'Hur et al. (2025), Learning based lower limb joint kinematic estimation using open source IMU data. Scientific Reports. https://doi.org/10.1038/s41598-025-89716-4',
      },
      {
        type: 'p',
        text: '更積極的版本是 Song 等人 2025 年在 IEEE ICORR 的工作：他們只用 1–2 個步態週期做 fine-tune，把原本在健康受試者上訓練的 TCN 模型遷移到 stiff knee 步態病人，RMSE 比僅用健康者訓練的模型降低 9.7%，比僅用 stiff knee 資料訓練的模型降低 19.9%。對於罕見病或臨床收案困難的群體，這個資料量級看起來是可以接受的。',
      },
      {
        type: 'callout',
        text: 'Song et al. (2025), Personalization of Wearable Sensor-Based Joint Kinematics Estimation Using Computer Vision for Hip Exoskeleton Applications. IEEE ICORR. https://doi.org/10.1109/ICORR66766.2025.11063180',
      },
      {
        type: 'p',
        text: "醫療影像端有個我覺得很容易被忽略的細節：預訓練資料的領域相似度可能比模型本身的選擇更重要。Alammar 等人 2023 年在《Cancers》比較了「ImageNet 預訓練」vs.「醫療領域內大量 X-ray 預訓練」，後者在 MURA musculoskeletal X-ray 上明顯較好（humerus accuracy 87.85%、wrist 85.58%、Cohen's Kappa 75.69% / 70.46%）。這給我的啟發是：在做 X-ray、CT、MRI、IMU 訊號這類任務時，比起直接拿 ImageNet 預訓練的 backbone，可能可以先看看領域內有沒有更接近的大型預訓練模型（RadImageNet、MoCo-CXR、UK Biobank SSL 模型等）。",
      },
      {
        type: 'callout',
        text: 'Alammar et al. (2023), Deep Transfer Learning with Enhanced Feature Fusion for Detection of Abnormalities in X-ray Images. Cancers. https://doi.org/10.3390/cancers15154007',
      },
      { type: 'h2', id: 'ssl-pretraining', text: '四、方向 3：自監督預訓練（SSL），用沒標註的資料先學表徵' },
      {
        type: 'p',
        text: '如果連標註都做不出來、但手上有大量未標註資料，自監督學習（SSL）是 2023–2025 年文獻裡很值得參考的解法。代表作是 Yuan 等人 2024 年在《NPJ Digital Medicine》的工作：他們用 UK Biobank 加速度計資料（70 萬人日，未標註）做自監督預訓練，再轉到 8 個下游 benchmark 做活動辨識，相對 F1 提升 2.5–130.9%（中位數 24.4%），而且跨資料集、跨受試族群、跨感測器都能維持優勢。這個模型已經開源，作為 baseline 來比較自己手上的方法挺方便的。',
      },
      {
        type: 'callout',
        text: 'Yuan et al. (2024), Self-supervised learning for human activity recognition using 700,000 person-days of wearable data. NPJ Digital Medicine. https://doi.org/10.1038/s41746-024-01062-3',
      },
      {
        type: 'p',
        text: '另一個值得參考的路線是 Cheng 等人 2024 在 IEEE JBHI 發表的 MaskCAE（masked convolutional autoencoder）：直接重建被遮蔽的感測器訊號，沒有依賴 contrastive learning 那一套需要精心設計的資料增強組合，在 self-supervised、fully supervised、semi-supervised 三種設定下都贏過當時 SOTA。對嵌入式裝置部署也比 transformer 友善很多。對博士生來說，比較實際的入手點看起來是直接拿 Yuan et al. 開源的 UK Biobank SSL 模型 fine-tune，省掉自己預訓練的算力負擔。如果有人試過、效果跟原文有出入，蠻想知道是哪些步態 / 任務類型容易掉。',
      },
      {
        type: 'callout',
        text: 'Cheng et al. (2024), MaskCAE: Masked Convolutional AutoEncoder via Sensor Data Reconstruction for Self-Supervised Human Activity Recognition. IEEE JBHI. https://doi.org/10.1109/JBHI.2024.3373019',
      },
      { type: 'h2', id: 'validation', text: '五、方向 4：嚴格一點的跨受試者 / 跨資料集驗證' },
      {
        type: 'p',
        text: '這個方向其實比上面四個都重要。小資料的最大風險不是訓練不出模型，而是驗證做得太寬鬆，論文發表後到別人實驗室就失效。文獻裡看到的趨勢是大家越來越重視這塊，光做隨機切分（random split）越來越站不住腳。',
      },
      {
        type: 'p',
        text: '最低標準看起來是 Leave-One-Subject-Out Cross-Validation (LOSOCV)。Maldonado-Contreras 等人 2023 年在《Annals of Biomedical Engineering》用 N=9 受試者的 LOSOCV，訓練 XGBoost 預測穿戴式機器人應用的斜坡角度。靜態斜率 MAE 0.88°、動態斜率 MAE 1.73°，並且發現大腿（thigh）IMU 對誤差貢獻最大。LOSOCV 真正的價值是讓「模型沒看過這個人」，避免 within-subject 資料洩漏。',
      },
      {
        type: 'callout',
        text: 'Maldonado-Contreras et al. (2023), User- and Speed-Independent Slope Estimation for Lower-Extremity Wearable Robots. Annals of Biomedical Engineering. https://doi.org/10.1007/s10439-023-03391-y',
      },
      {
        type: 'p',
        text: '更嚴格的標準是跨資料集驗證（cross-dataset validation）。Benchekroun 等人 2023 年在《Sensors》用兩個不同協議、不同感測器、不同壓力源設計的 HRV 資料集做交叉驗證，一個訓練、另一個測試。Logistic Regression 在 LOSO 內表現好，但跨資料集表現大幅退化；Random Forest 跨資料集穩定維持 F1 = 61%。這個結果其實蠻打臉「同資料集 cross-validation 看似好的模型」這種直覺，給了我們一個具體的經驗證據。',
      },
      {
        type: 'callout',
        text: 'Benchekroun et al. (2023), Cross Dataset Analysis for Generalizability of HRV-Based Stress Detection Models. Sensors. https://doi.org/10.3390/s23041807',
      },
      {
        type: 'p',
        text: '兒童發展研究中，Mutersbaugh 等人 2025 年在《JMIR Medical Informatics》用 41 位兒童 IMU 手部追蹤資料訓練自閉症分類器，CAE+LSTM 在傳統 k-fold 上 accuracy 90.21% / F1 90.02%；切換到 patient-separated 切分（保證測試集的人從沒出現在訓練集）後，accuracy 反而提升到 91.87% / F1 93.66%。這個案例很有趣的地方是：patient-separated 不一定退化，前提是模型架構足夠泛化。我自己想知道的是，如果換成更小的樣本（< 20 人），這個結論還站得住嗎，如果有朋友試過類似切分，蠻想交流一下。',
      },
      {
        type: 'callout',
        text: 'Mutersbaugh et al. (2025), Deep Learning Approaches for Classifying Children With and Without Autism Spectrum Disorder Using Inertial Measurement Unit Hand Tracking Data. JMIR Medical Informatics. https://doi.org/10.2196/73440',
      },
      {
        type: 'p',
        text: '對於醫工領域的研究設計，我自己會傾向至少把 LOSOCV 列為基本配置；如果題目涉及臨床落地（SaMD、醫材試驗），再加做 cross-dataset 或多中心驗證。',
      },
      { type: 'h2', id: 'lightweight-models', text: '六、方向 5：模型先輕量化，再談深度學習' },
      {
        type: 'p',
        text: '最後一個方向是反過來想：不一定模型越大越好，匹配資料規模的模型也許才是更好的選擇。深度學習在小資料容易過擬合，輕量化、結構先驗、多階段設計，看起來常常比直接堆 transformer 更有用。Cheng 等人 2022 年在《Medical Physics》處理 N=40 兒童 MRI 的 quadriceps 自動分割問題，用 cascaded U-Net + SASSNet 兩階段設計（第一階段粗定位、第二階段精細分割）。在 leave-one-out 測試下，rectus femoris、vastus medialis、patella 達到 DSC 93.7–95.1%，超越當時 template-based 與單階段 NN 方法。我覺得這個案例的重點不是模型多深，而是用領域知識把問題切分（先粗後細），每一步只用必要的容量。',
      },
      {
        type: 'callout',
        text: 'Cheng et al. (2022), Automatic quadriceps and patellae segmentation of MRI with cascaded U-Net and SASSNet deep learning model. Medical Physics. https://doi.org/10.1002/mp.15335',
      },
      {
        type: 'p',
        text: 'Saillard 等人 2024 年在《Scientific Reports》處理生醫工程經典難題：股骨、椎體 CT 自動分割→建 finite element 模型計算骨折承載力。原文裡有句話我蠻有共鳴的：「it is not always possible to have access to a multitude of CT-scans with the associated ground truth」，所以重點是前處理 + U-Net 微調 + 後處理的整體 pipeline。最終自動分割產生的 FE failure load 與手動分割相當。對骨科生醫工程的朋友，這個是很直接可以拿來參考的範例。',
      },
      {
        type: 'callout',
        text: 'Saillard et al. (2024), Finite element models with automatic computed tomography bone segmentation for failure load computation. Scientific Reports. https://doi.org/10.1038/s41598-024-66934-w',
      },
      {
        type: 'p',
        text: '回到 Mutersbaugh 等人的 ASD 研究，他們明確寫到：small-scale models can still achieve a high accuracy and good generalization when classifying medical data, opening the door for future research into diagnostic models that may not require massive amounts of data。我自己覺得這句話可以蠻溫和地放進論文 discussion，回應「為什麼不用更大的模型」這類意見。',
      },
      {
        type: 'p',
        text: '我自己會傾向先試 1D-CNN / TCN / 小型 LSTM，把這當成 baseline 看資料夠不夠支持任務複雜度；再考慮 transformer。如果一開始就上大型架構，把它列為比較對象就好，但我會把更多時間花在 cascaded、multi-task、multi-stage 這些設計上，這往往才是 paper 真正的核心貢獻。',
      },
      { type: 'h2', id: 'decision-tree', text: '七、五個方向能怎麼搭配，一個草稿級的決策邏輯' },
      {
        type: 'p',
        text: '把五個方向放在一起，可以整理成這樣的思路（純粹是我自己看完文獻後的整理，蠻歡迎大家補充或挑戰）：第一，手上有沒有大量未標註的同類型資料？有就走方向 3（SSL 預訓練）。第二，領域內有沒有開源的預訓練模型 / 大型公開資料集？有就走方向 2（轉移學習 fine-tune）。第三，問題能不能用肌肉骨骼模型 / 物理模擬產生合成資料？能就走方向 1（合成資料 + fine-tune）。第四，不論走哪條路，驗證都加做 LOSOCV，臨床題目再加 cross-dataset（方向 4）。第五，不論走哪條路，從輕量化模型開始建立 baseline，再增加複雜度（方向 5）。',
      },
      {
        type: 'p',
        text: '這五個方向不是互斥而是疊加的：UK Biobank SSL 預訓練（3）+ 自己實驗室資料 fine-tune（2）+ 加合成資料補罕見步態（1）+ LOSOCV 驗證（4）+ 用 TCN 而不是 transformer（5），看起來是 2025 年生醫工程小資料 + 深度學習文獻裡浮現的一個典型 pipeline。但這只是文獻整理出來的整體輪廓，每個人手上的題目細節差很多，這個邏輯不見得直接適用。',
      },
      { type: 'h2', id: 'open-questions', text: '八、想跟大家一起討論的幾個問題' },
      {
        type: 'p',
        text: '寫到這裡，我自己腦中還有幾個沒想清楚的問題，蠻想跟同樣在做小資料 + 深度學習的朋友交換意見：在 N < 20 的極小樣本下，patient-separated cross-validation 是否還能維持上面引用的結論？文獻裡的例子大多 N ≥ 30。合成資料 + fine-tune 的「最少真實樣本」到底是多少？Bicer et al. 用 3 位就能把 RMSE 拉回，但這是健康成人，病人組需要多少？跨資料集驗證的 F1 退化如果超過 30%，論文還能發嗎？或者該怎麼把它寫成「未來工作」而不是「致命缺陷」？',
      },
      {
        type: 'quote',
        text: '如果這些問題大家有看到的文獻或自己的踩坑經驗，歡迎在社群裡分享。',
      },
    ],
  },
  {
    id: 'eye-movement-training-athletes',
    category: 'method',
    title: '眼動訓練對運動員表現有效嗎：從 2024–2025 文獻看「該不該做」與「怎麼做」',
    excerpt:
      '眼動訓練、Quiet Eye、Strobe glasses、Sports Vision Training，名詞愈來愈多，廠商也愈來愈會行銷。這篇從近兩年的 meta-analysis、RCT 與系統性回顧，整理眼動訓練對運動員表現實際上有多大效果、適用什麼運動類型，以及生醫工程介入的切入點。',
    publishedAt: '2026-04-27',
    readingTime: '12 分鐘',
    featured: false,
    coverImage: eyeMovementTrainingAthletesCover,
    tableOfContents: [
      { id: 'why-care', title: '一、為什麼一個生醫工程的人要關心眼動訓練' },
      { id: 'meta-analysis', title: '二、最新的 meta-analysis 怎麼說：效果有，但量級分項目而異' },
      { id: 'four-paradigms', title: '三、訓練範式的四大類' },
      { id: 'closed-vs-open', title: '四、項目差異：定點瞄準 vs 開放技能' },
      { id: 'vr-integration', title: '五、VR 整合：值得買硬體嗎？' },
      { id: 'practical-tips', title: '六、給研究者 / 教練的務實建議' },
      { id: 'summary', title: '七、小結' },
    ],
    content: [
      { type: 'h2', id: 'why-care', text: '一、為什麼要關心眼動訓練' },
      {
        type: 'p',
        text: '過去十年，運動表現提升的市場跑出一堆名詞：Quiet Eye Training（QET）、Sports Vision Training（SVT）、Strobe Glasses、Perceptual-Cognitive Training、Anticipation Training、VR Gaze Training……廠商行銷話術做得很滿，但實證研究到底支持多少？',
      },
      {
        type: 'p',
        text: '這個題目其實跟我們很近：不僅生活中多仰賴眼動功能，正所謂靈魂之窗。而眼動訓練本質上是在量測一條訊號來提供相關意義資訊（gaze trajectory、fixation duration、saccade latency），用某種介入改變這條訊號，再看下游行為（命中率、反應時間、決策正確率）有沒有改變。這不就是我們做生物訊號研究的標準範式？只是把肌電、力板換成 mobile eye-tracker。',
      },
      {
        type: 'quote',
        text: '這篇整理 2024–2025 年發表在 PubMed 索引期刊上的證據，回答兩件事：(1) 眼動訓練到底有沒有效？(2) 不同運動項目該用什麼樣的訓練範式？',
      },
      { type: 'h2', id: 'meta-analysis', text: '二、最新的 meta-analysis 怎麼說：效果有，但量級分項目而異' },
      {
        type: 'p',
        text: 'Guo 等人（2025）發表在《Scandinavian Journal of Medicine & Science in Sports》的系統性回顧與整合分析，是目前這個領域最完整的一份證據總結。研究團隊在 Web of Science、PubMed、MEDLINE、SPORTDiscus 進行系統性檢索，從 3,435 篇候選文獻中篩出 27 篇 RCT 納入分析，總受試者 n=669，PROSPERO 註冊 CRD42024568547。',
      },
      {
        type: 'p',
        text: '主要結果有兩個：決策反應時間（decision-making response time）的標準化平均差 SMD = 0.85，95% CI [0.45, 1.24]，I² = 30%，p < 0.01，這是一個大效果量（large effect size，Cohen 約定 SMD > 0.8）；運動專項表現（sport-specific performance）SMD = 0.49，95% CI [0.13, 0.85]，I² = 61%，p = 0.01，中等效果量，但 I² 偏高顯示研究間異質性明顯。',
      },
      {
        type: 'callout',
        text: 'Guo et al. (2025), Does Visual Training Enhance Athletes\' Decision-Making Skills and Sport-Specific Performance? A Systematic Review and Meta-Analysis. Scand J Med Sci Sports. https://doi.org/10.1111/sms.70140',
      },
      {
        type: 'p',
        text: '這份 meta-analysis 的子群分析顯示，無論受試者特性（菁英 / 業餘）或訓練方案（時長、頻率），組間差異未達統計顯著。換言之，在現有證據量下，「該怎麼做」還沒有高解析度的答案，只能說「做了比沒做好」。實務上的解讀：對反應時間敏感的運動（拳擊、桌球、電競、守門員），證據傾向支持有實質提升；對專項表現的提升存在但效果量較小，且因運動類型差異大。',
      },
      { type: 'h2', id: 'four-paradigms', text: '三、訓練範式的四大類' },
      {
        type: 'p',
        text: '整理近年文獻，眼動訓練在運動領域大致分為四種範式，對應不同的生理機轉與工程介入點。',
      },
      {
        type: 'p',
        text: '第一類，Quiet Eye Training（QET）。教練式介入，目的在於延長最後一次 fixation 在「關鍵目標區」的駐留時間。He 等人（2024）發表在《Scientific Reports》的研究，將 22 位中國國家隊 13–18 歲青少年高爾夫選手隨機分組，兩週訓練後在加壓情境下測試推桿表現。結果：QET 組的推桿命中率顯著高於對照組（技術指導組），同時 quiet eye movement time 與總 fixation time 在加壓情境下變長，且 state anxiety（S-AI 量表）下降。',
      },
      {
        type: 'callout',
        text: 'He et al. (2024), The effect of quiet eye training on golf putting performance in pressure situation. Scientific Reports. https://doi.org/10.1038/s41598-024-55716-z',
      },
      {
        type: 'p',
        text: '第二類，Sports Vision Training（SVT，硬體儀器化訓練）。以 Senaptec Sensory Station、NeuroTracker 等商用平台進行的標準化視覺技能訓練。Guo 等人（2024）的研究將 20 位菁英 skeet（飛靶射擊）選手隨機分為實驗組（n=10，6 週 Senaptec SVT，每週兩次）與對照組（n=10，等量目標追蹤訓練）。實驗組在 Near-Far Quickness、Perception Span、Eye-hand Coordination 顯著提升（p < 0.05），命中率（p < 0.01）與舉槍反應時間（p < 0.01）同步顯著改善，第二發開槍時 X 軸（p = 0.033）、Y 軸（p = 0.001）位移與峰值速度（p < 0.01）也有差異。',
      },
      {
        type: 'callout',
        text: 'Guo et al. (2024), Impact of sports vision training on visuomotor skills and shooting performance in elite skeet shooters. Front Hum Neurosci. https://doi.org/10.3389/fnhum.2024.1476649',
      },
      {
        type: 'p',
        text: '第三類，Strobe Glasses Training（間歇性視覺剝奪）。利用可程式化的閃爍鏡片，週期性切斷視覺輸入，迫使腦部以更少的視覺取樣完成決策。Vasile 與 Stănescu（2024）以羅馬尼亞國家青年攀岩隊（17 位、10 男 7 女）做完整一個年度週期的對照試驗，每週一次 strobe 訓練。結果：strobe 組在心像轉換（d = 1.27）、空間定向（d = 1.14）、影像生成（d = 1.59）、簡單反應時間（d = 0.99）、視覺記憶錯誤（d = 1.96）、視覺處理錯誤（d = 1.94）、認知敏捷度（d = 1.30）皆顯著優於對照組；on-sight 與 red-point 攀岩表現的效果量分別為 d = 0.38 與 d = 0.36。',
      },
      {
        type: 'callout',
        text: 'Vasile & Stănescu (2024), Strobe training as a visual training method that improves performance in climbing. Front Sports Act Living. https://doi.org/10.3389/fspor.2024.1366448',
      },
      {
        type: 'p',
        text: '第四類，Multisensory / Anticipation Training（多感官整合）。不只看，還要聽，且通常要結合動作回饋。Wang 等人（2025）將羽球新手分為純視覺、視聽整合、模糊視聽、對照四組，進行兩週共六次訓練。結果顯示：訓練組在預判準確率上顯著提升、且效果可保留兩週；在高認知負荷與模擬動作任務下，純視覺訓練組的提升幅度最大，其次是視聽整合組，這個結果反直覺地提示：多感官不一定總是優於單感官，要看任務本身的感官依賴性。',
      },
      {
        type: 'callout',
        text: 'Wang et al. (2025), Multisensory training enhances anticipation skills in badminton novices. Scientific Reports. https://doi.org/10.1038/s41598-025-93475-7',
      },
      { type: 'h2', id: 'closed-vs-open', text: '四、項目差異：定點瞄準 vs 開放技能' },
      {
        type: 'p',
        text: '這是文獻裡最一致的分裂，眼動訓練在閉鎖技能（closed skill）運動上的效果比開放技能（open skill）顯著。閉鎖技能（高爾夫推桿、射擊、射箭、撞球）的動作模式固定、環境變動小，QE / fixation 時間長度與成績的因果關係相對清楚。開放技能（球類對抗、守門員、團隊運動）的 gaze behavior 跟成績的關係比較複雜，既要看 anticipation（預判），又要看在快速變化的場景中是否抓對 cue。',
      },
      {
        type: 'p',
        text: 'Huesmann 等人（2025）在《Journal of Sports Sciences》發表的兩篇 scoping review 整理了：第一篇納入 20 篇研究，發現菁英守門員的 anticipation 表現整體優於低技術等級者，cue utilisation 更有效率；第二篇納入 13 篇訓練研究，提示顯式（explicit）、引導發現式（guided discovery）、與隱式（implicit）三種訓練取向都可能有效，但各有不同的應用情境。作者也明確指出，現有研究男性成人為主，且多在實驗室標準化罰球情境下進行，對女性與真實比賽情境的證據缺口仍大。',
      },
      {
        type: 'callout',
        text: 'Huesmann et al. (2025), Expertise and training of anticipation in goalkeeping: Two scoping reviews. J Sports Sci. https://doi.org/10.1080/02640414.2025.2533002',
      },
      {
        type: 'p',
        text: '性別差異有專門證據。Jedziniak 等人（2025）以 40 位菁英手球守門員（20 男 + 20 女）測量罰球攔截時的眼動行為。男性守門員主要凝視擲球者的擲球臂與球本身，女性守門員主要凝視軀幹與頭部 AOI；且兩性在 quiet eye duration 對「成功攔截 vs 失敗」上都有顯著差異（女性 MD = 92.26 ms，p = 0.005；男性 MD = 122.83 ms，p < 0.001）。這項結果直接挑戰了「眼動訓練 protocol 男女通用」的常見假設，訓練設計可能需要按性別調整。',
      },
      {
        type: 'callout',
        text: 'Jedziniak et al. (2025), Differences in Gaze Behavior Between Male and Female Elite Handball Goalkeepers During Penalty Throws. Brain Sciences. https://doi.org/10.3390/brainsci15030312',
      },
      {
        type: 'p',
        text: '籃球的證據也已系統化。Alemanno 等人（2025）從 1,706 篇候選中篩出 19 篇進行系統性回顧，結果顯示：菁英籃球選手有更長的 quiet eye 時長與更有效率的 gaze behavior；高壓情境下熟練選手的 QE 特徵更穩定，與較高投籃命中率相關；裁判的 gaze 策略也有專家 / 新手差異。',
      },
      {
        type: 'callout',
        text: 'Alemanno et al. (2025), From Gaze to Game: A Systematic Review of Eye-Tracking Applications in Basketball. Brain Sciences. https://doi.org/10.3390/brainsci15040421',
      },
      { type: 'h2', id: 'vr-integration', text: '五、VR 整合：值得買硬體嗎？' },
      {
        type: 'p',
        text: '近兩年的熱門問題是：「VR 訓練可以取代真實場上訓練嗎？」初步證據是部分可以，但有條件。Bennett 等人（2025）發表在《Human Movement Science》的 RCT，將 46 位高爾夫推桿新手按 2×2 設計分組（QET 有/無 × VR 練習 / 真實場練習），測量基線、訓後、一週後保留三個時間點。',
      },
      {
        type: 'p',
        text: '三個重要結果：(1) 接受 QET 的受試者，真實世界推桿表現提升（命中數、徑向誤差均顯著），且這個提升在「練習在 VR 中」與「練習在真實場上」兩種條件下都有發生。(2) 但若測試環境改成 VR，那麼「在真實場上練習的人」進步、「在 VR 中練習的人」沒進步，真實場上技能可以遷移到 VR 環境，反向遷移較差。(3) 這對生醫工程介入的啟示是：VR 作為「訓練眼動策略本身」是有效的（因為眼動策略是可移植的認知技能），但 VR 作為「動作技能練習場」目前還無法取代真實環境。',
      },
      {
        type: 'callout',
        text: 'Bennett et al. (2025), Quiet Eye Training in Virtual Reality and in the Real-World. Human Movement Science. https://doi.org/10.1016/j.humov.2025.103370',
      },
      { type: 'h2', id: 'practical-tips', text: '六、給研究者 / 教練的務實建議' },
      {
        type: 'p',
        text: '對研究者（含碩博生）：訓練介入研究務必設標準對照組，且對照組要做等量、相關但無目標訓練的工作，Guo 2024、He 2024 都這樣設計，這也是目前 meta-analysis 收得進來的研究的共同特徵。「做了 vs 完全不做」的設計只能證明「有人介入比沒人介入好」，不能證明眼動訓練本身的效果。',
      },
      {
        type: 'p',
        text: '對教練 / 運動科學支援團隊：現有證據支持眼動訓練值得加入訓練菜單，但項目差異大、訓練週期需要至少 2–6 週、需要有適配的訓練範式（閉鎖技能用 QET / SVT、開放技能用 anticipation / multisensory）。不要直接把高爾夫的 QET protocol 套用到籃球上。',
      },
      {
        type: 'p',
        text: '對想做相關工程介入研究的生醫工程領域，可以切入的工程議題包括：(1) eye-tracker 在場上情境（汗、強光、大幅頭部運動）下的訊號穩定性；(2) gaze behavior 自動分析的演算法（saccade / fixation / smooth pursuit 分類器，配合 ML 模型對照專家標記）；(3) 結合 IMU 的 head-eye coordination 量測，特別是開放技能項目；(4) AI 驅動的個人化訓練 protocol，Alemanno 2025 與 Huesmann 2025 的回顧都明確指出，「整合 AI 進行 gaze-based 訓練個人化」是下一階段的重點研究方向。',
      },
      { type: 'h2', id: 'summary', text: '七、小結' },
      {
        type: 'p',
        text: 'Guo 2025 的 meta-analysis 提供了目前最高等級的證據：對反應時間有大效果量、對運動專項表現有中等效果量。閉鎖技能項目的證據比開放技能更扎實，多感官訓練不一定總優於單感官，男女守門員的 gaze 策略可能本質就不同，這些細節都意味著訓練設計必須客製化，而客製化正是工程介入可以發揮的地方。',
      },
    ],
  },
  {
    id: 'xai-biomechanics-reviewer',
    category: 'method',
    title: '為什麼生醫論文審稿人總是問「你的模型可解釋嗎」：從 XAI 文獻回應這個問題',
    excerpt:
      '投稿生物力學或醫學工程期刊，Reviewer 幾乎必然會問一個問題：「你的模型可解釋嗎？」這不是刁難，而是一個有深刻臨床理由的要求。這篇筆記整理 XAI 文獻，幫你在下一次回應審稿意見時說得有憑有據。',
    publishedAt: '2026-04-24',
    readingTime: '10 分鐘',
    featured: false,
    coverImage: xaiBiomechanicsReviewerCover,
    tableOfContents: [
      { id: 'why-always', title: '一、這個問題為什麼每次都出現' },
      { id: 'xai-status', title: '二、XAI 在生物力學領域的現況' },
      { id: 'accuracy-not-enough', title: '三、為什麼「準確率高」不夠' },
      { id: 'reviewer-subtopics', title: '四、審稿人的問題背後有哪些子題' },
      { id: 'practical-tips', title: '五、給生物力學研究者的務實建議' },
      { id: 'summary', title: '六、小結：審稿人問的，其實是臨床信任' },
    ],
    content: [
      { type: 'h2', id: 'why-always', text: '一、這個問題為什麼每次都出現' },
      {
        type: 'p',
        text: '如果你最近投稿了一篇結合機器學習的生物力學或醫學工程論文，審稿人的意見裡幾乎一定出現過這句話：「The authors should address the interpretability / explainability of the proposed model.」',
      },
      {
        type: 'p',
        text: '這不是審稿人的個人口味，而是近年來生醫 AI 領域的共識性轉變。根據 Malinverno et al.（2023）對 PubMed 資料庫中 1,603 篇相關論文的大規模分析，生醫 XAI（Explainable Artificial Intelligence）的發表量在 2020 年之後明顯加速，COVID-19 的臨床壓力放大了「模型不可信任」的代價，使整個社群意識到「高準確度」和「臨床可部署」之間還差了一個解釋性的門檻。',
      },
      {
        type: 'callout',
        text: 'Malinverno et al. (2023), A historical perspective of biomedical explainable AI research. Patterns (Cell Press). https://doi.org/10.1016/j.patter.2023.100830',
      },
      {
        type: 'quote',
        text: '審稿人問這個問題，是因為他們知道：一個沒辦法被臨床醫師理解的黑盒模型，很難真正落地。',
      },
      { type: 'h2', id: 'xai-status', text: '二、XAI 在生物力學領域的現況' },
      {
        type: 'p',
        text: 'Xiang et al.（2025）發表了迄今最完整的步態分析 XAI 系統性回顧。他們從 3,676 篇文獻中篩選出 31 篇符合標準的研究，清楚描繪了這個領域的方法全貌。應用的臨床族群包括帕金森氏症患者、中風後步態異常者、肌少症、腦性麻痺，以及一般肌骨系統障礙，這些族群共同特徵是步態資料個體間差異大、標記數量少，正是「小資料 + 黑盒模型」的高風險情境。',
      },
      {
        type: 'p',
        text: '常見的 XAI 方法可以分為三類：（1）模型無關（Model-agnostic）：SHAP 和 LIME 是最多論文採用的方法，可以事後解釋每個特徵對單一預測的貢獻量，適用任何模型，但解釋本身是近似值。（2）模型特異（Model-specific）：Grad-CAM 與 Attention Mechanism 與模型計算緊密結合，較適合作為「內建式可解釋性」。（3）混合（Hybrid）：同時使用 intrinsically interpretable 模型和 post hoc 方法，兼顧透明度與性能。',
      },
      {
        type: 'p',
        text: '這篇系統性回顧進一步指出，在生物力學語境下，XAI 方法確認的關鍵辨別特徵包括步幅長度（stride length）與關節角度（joint angles），這些本來就有臨床意義的指標，被 XAI 方法「重新確認」，反過來增加了模型預測結果的臨床公信力。',
      },
      {
        type: 'callout',
        text: 'Xiang et al. (2025), Explainable artificial intelligence for gait analysis: advances, pitfalls, and challenges - a systematic review. Frontiers in Bioengineering and Biotechnology. https://doi.org/10.3389/fbioe.2025.1671344',
      },
      { type: 'h2', id: 'accuracy-not-enough', text: '三、為什麼「準確率高」不夠' },
      {
        type: 'p',
        text: 'Abdelmohsen（2025）的敘述性回顧明確點出，生醫 AI 目前面臨的主要挑戰包括：模型泛化能力、預測解釋、資料隱私，以及倫理問題。作者特別強調，XAI 策略是 AI 驅動生物力學研究的「下一步必要條件」，而非可選附加項目。',
      },
      {
        type: 'callout',
        text: 'Abdelmohsen (2025), Artificial Intelligence in Biomechanics: A Narrative Review of Current Applications in Diagnostic and Physical Rehabilitation. Physiotherapy Research International. https://doi.org/10.1002/pri.70120',
      },
      {
        type: 'p',
        text: '從臨床落地的角度看，Yan et al.（2024）的研究提供了一個有力的佐證。他們設計了一套整合領域知識的可解釋深度學習系統，用於乳房超音波的腫瘤診斷（n=1,348 名患者）。系統的 AUC 達到 0.902（95% CI: 0.882–0.921），敏感度 75.2%，特異度 91.8%。更值得注意的是，在 XAI 功能輔助下，資淺放射科醫師的診斷表現顯著提升，資深醫師則回報對自身判斷的信心增加。這個結果直接回答了審稿人的深層疑慮：可解釋性不是在犧牲準確率，而是讓模型變得有用。',
      },
      {
        type: 'callout',
        text: 'Yan et al. (2024), A domain knowledge-based interpretable deep learning system for improving clinical breast ultrasound diagnosis. Communications Medicine. https://doi.org/10.1038/s43856-024-00518-7',
      },
      { type: 'h2', id: 'reviewer-subtopics', text: '四、審稿人的問題背後有哪些子題' },
      {
        type: 'p',
        text: '審稿人問「可解釋嗎」通常隱含以下幾個實質問題，需要分別回應：第一，你用的是 post hoc 解釋還是 inherently interpretable 模型？Post hoc 方法（SHAP、LIME）事後解釋黑盒，inherently interpretable 方法（決策樹、線性模型、attention）在模型結構上就有透明度。兩者的局限不同，論文裡必須說清楚你選擇的是哪種路線，以及為什麼。',
      },
      {
        type: 'p',
        text: '第二，你的解釋結果有沒有生物力學或臨床意義？純粹說「特徵 A 的 SHAP 值最大」並不夠，你需要連結到既有的生物力學知識。第三，模型解釋在不同受試者或不同採集日的穩定性如何？這是 Xiang et al. 系統性回顧點名的主要研究缺口之一，現有論文少有對 XAI 輸出的穩定性進行驗證。第四，你有沒有讓臨床或領域專家確認解釋的合理性？即使只是一位物理治療師確認「這個特徵的貢獻方向符合臨床直覺」，都能大幅提升審稿人的接受度。',
      },
      { type: 'h2', id: 'practical-tips', text: '五、給生物力學研究者的務實建議' },
      {
        type: 'p',
        text: '選模型前先決定解釋策略。如果你的目標期刊、臨床族群，或資料特性（時間序列、小樣本）要求可解釋性，應該在模型選型時就納入考量，而不是訓練完模型後再補 SHAP 圖。',
      },
      {
        type: 'p',
        text: 'SHAP 圖要搭配文字解讀，不是裝飾品。很多論文放了 SHAP beeswarm plot，但沒有對應的討論段落，審稿人看到的會是：「作者可能不知道這個圖在說什麼。」',
      },
      {
        type: 'p',
        text: 'Limitation 要主動提 XAI 的侷限性。SHAP 值在特徵共線性高時會不穩定，LIME 的解釋範圍是局部線性近似，Grad-CAM 適用於卷積結構。主動說明你選擇的方法的邊界條件，是學術誠信，也是讓審稿人放心的方式。',
      },
      {
        type: 'p',
        text: '最後，把「可解釋性」視為研究問題，不是附錄。最好的情況，是讓 XAI 分析成為你的 Research Question 之一，例如：「哪些步態特徵對病理分類最具辨別力？」而不只是：「我們用 SHAP 解釋了一下我們的模型。」',
      },
      { type: 'h2', id: 'summary', text: '六、小結：審稿人問的，其實是臨床信任' },
      {
        type: 'p',
        text: '綜合以上文獻，生醫 AI 審稿人對可解釋性的要求，背後是一個更大的問題：這個模型值得醫師信任嗎？XAI 是目前學術界回應這個問題最主流的工具語言。不管你使用的是 SHAP、Grad-CAM、Attention，還是 inherently interpretable 模型，重點都是同一件事：讓模型的決策過程可以被領域專家審視。這不是為了通過審稿，而是為了讓你的研究有機會真正被用到。',
      },
    ],
  },
  {
    id: 'biomech-ai-decision-map',
    category: 'method',
    title: '生物力學 × AI 整合的五個決策節點：給跨領域博士生的學習地圖',
    excerpt:
      '做生物力學的人開始導入 AI 常常卡在「要從哪裡切入」。我把這段跨領域學習拆成五個決策節點：從問題定義、感測資料品質、特徵設計、模型選擇到臨床可解釋性，每一步你都能問自己三個關鍵問題，避免變成「用錯方法解錯題目」。',
    publishedAt: '2026-04-20',
    readingTime: '14 分鐘',
    featured: true,
    coverImage: biomechAiDecisionMapCover,
    tableOfContents: [
      { id: 'why', title: '一、當生物力學導入 AI 應用時，你可能需要先釐清以下情況' },
      { id: 'node1', title: '二、決策節點 1：先定義「臨床/研究問題」，再談模型' },
      { id: 'node2', title: '三、決策節點 2：資料是否能支撐這個問題（量測品質、標註品質、樣本代表性）' },
      { id: 'node3', title: '四、決策節點 3：選擇「機制導向」或「預測導向」建模路線' },
      { id: 'node4', title: '五、決策節點 4：驗證策略是否真的回答了你的問題（內部效度 vs 外部效度）' },
      { id: 'node5', title: '六、決策節點 5：可解釋性與部署成本是否達到實際採用門檻' },
      { id: 'summary', title: '七、給跨領域研究生的三個建議' },
    ],
    content: [
      { type: 'h2', id: 'why', text: '一、當生物力學導入 AI 應用時，你可能需要先釐清以下情況' },
      {
        type: 'p',
        text: '過去很多研究是「找一個現成訓練過的模型，並直接拿生物力學資料集來套」。這通常產不出有意義的結果，原因是：生物力學資料不僅物理限制明確、資料特異性，且臨床可解釋性要求高。隨意的搭配模型分析會讓你的結果解釋不好釐清',
      },
      {
        type: 'p',
        text: '因此這篇文章會從「我有一個生物力學問題，什麼時候該加入 AI？」的角度，把整個跨領域工作流程拆成五個決策節點。',
      },
      {
        type: 'quote',
        text: '好的跨領域研究不是把兩個工具綁在一起，而是在每個決策節點都能清楚說明為什麼選這個方法。',
      },
      { type: 'h2', id: 'node1', text: '二、決策節點 1：先定義「臨床/研究問題」，再談模型' },
      {
        type: 'p',
        text: '跨領域研究最常見的錯誤，是先選模型、再找問題。生物力學與醫工場景通常同時有量測限制、樣本限制與解釋需求，因此第一步應該明確界定：你要解的是風險預測、機制推論，還是介入成效評估。',
        text: '這三類問題對資料設計、特徵選擇與評估指標的要求完全不同。實務上，建議先規劃在什麼族群、什麼情境、用什麼訊號，預測或解釋哪個結果。當問題被定義成可驗證命題後，模型才是回答問題的工具。'
      },
      { type: 'h2', id: 'node2', text: '三、決策節點 2：資料是否能支撐這個問題（量測品質、標註品質、樣本代表性）' },
      {
        type: 'p',
        text: '生物力學任務裡，資料品質通常比模型複雜度更早決定天花板。若感測訊號的品質過低、標註標準不一致、或樣本只集中在單一族群，即使訓練誤差很低，模型也可能學到儀器偏差或流程偏差，而非真正的生理或動作規律。',
        text: '因此，資料檢查不應只看「有多少筆」，還要看「每筆是否可信、可比、可重現」。最低限度應交代量測流程、前處理規則、缺失值處理、標註一致性，以及訓練/測試資料是否跨受試者與跨情境。這些資訊決定研究是否具備基本可解釋性與可外推性。'
      },
      { type: 'h2', id: 'node3', text: '四、決策節點 3：選擇「機制導向」或「預測導向」建模路線' },
      {
        type: 'p',
        text: '建模路線應回到研究目的：若重點是找出關鍵機制或提供可溝通的臨床線索，應優先考慮機制導向或可解釋架構；若重點是短期預測效能，則可使用較高容量模型，但仍需設計可檢驗其穩定性的實驗。兩者不是對立，而是優先順序不同。',
        text: '更務實的做法是分層策略：先用可解釋基線建立「可被領域專家接受」的參考，再評估複雜模型是否帶來實質增益。若增益僅出現在特定切分或特定資料批次，通常代表模型對情境過度敏感，不足以支持強結論。'
      },
      { type: 'h2', id: 'node4', text: '五、決策節點 4：驗證策略是否真的回答了你的問題（內部效度 vs 外部效度）' },
      {
        type: 'p',
        text: '很多研究在驗證階段把「模型表現」等同於「研究成立」，但兩者並不完全相同。',
        text: '內部效度回答的是：在既有資料與實驗設計下，結果是否穩定可信；外部效度回答的是：換族群、換場域、換設備後，結論是否仍可成立。若只做單一資料集切分，通常不足以支持廣泛外推。'
      },
      { type: 'h2', id: 'node5', text: '六、決策節點 5：可解釋性與部署成本是否達到實際採用門檻' },
      {
        type: 'p',
        text: '研究成果能否落地，通常不只取決於準確率。臨床或實務場域更在意：結果是否可理解、是否能嵌入現有流程、是否增加人力負擔、是否能在合理時間內產出可行建議。若模型需要高維護成本或難以說明決策依據，採用機率通常會顯著下降。',
        text: '換句話說，落地門檻是一個「效能—可解釋—成本」的平衡問題。真正有價值的系統，不一定是指標最高的模型，而是能在真實場域持續運作、被多方信任、並能支持後續迭代的解決方案。'
      },
    ],
  },
  {
    id: 'first-wearable-collab',
    category: 'case',
    title: '我第一次跨領域合作與資料分析，學到的三件事',
    excerpt:
      '碩士期間是一個國衛院的眼動分析合作案。研究過程中有很多需要跨域合作的地方，這時候容易遇到像是「資料格式不一致」、「臨床團隊想要的不是我準備的圖」、「IRB 範圍重新定義」等類似的問題。這是一篇給跨域研究生以及我自己的筆記。',
    publishedAt: '2026-04-13',
    readingTime: '9 分鐘',
    coverImage: firstWearableCollabCover,
    tableOfContents: [],
    content: [
      { type: 'h2', id: 'node1', text: '一、我以為要先做分析，結果第一步其實是對齊問題定義' },
      { type: 'p', 
        text: '第一次跨領域合作時，技術團隊準備的是模型流程與可視化範本，但臨床團隊真正關心的是：「這個分析會改變哪一個決策？」如果這個問題沒有先講清楚，後面再漂亮的結果也容易變成「看起來很厲害，但不知道能怎麼用」。',
        text: '我後來學到，專案啟動時要先把需求寫成一句可驗證的敘述：在什麼族群、什麼情境、希望預測或比較哪個結果，最後要支援哪種決策。這一步做對，資料欄位、分析方法與呈現格式才會自然收斂。跨領域合作不是先展示技術，而是先建立共同語言。' 
      },
      { type: 'h2', id: 'node2', text: '二、計畫統籌的核心不是做更多，而是把研究方向持續聚焦' },
      { type: 'p', 
        text: '跨領域專案最常見的風險，不是「事情不夠多」，而是「同時做太多」。統籌者的第一個任務，是把研究問題收斂成可執行的核心目標，明確界定本期要回答的問題、要交付的成果，以及不在本期範圍內的事項。當邊界沒有先劃清，團隊很容易在看似重要的支線上投入過多時間，導致進度延遲與主軸失焦。',
        text: '技術背景成員通常具備很強的優化能力，也容易傾向把單一環節做到極致，例如模型調校、訊號處理或系統效能。這種追求深度本身是優勢，但若缺乏階段性里程碑與優先序，可能讓「局部最佳」取代「整體可交付」。在計畫管理上，更需要持續檢查：目前投入是否直接服務核心研究問題，而不是只提升技術指標。',
        text: '另一方面，臨床端在專案早期就必須同步釐清法規與研究設計條件，例如 IRB 範圍、資料使用限制、受試者納入排除標準與文件流程。這些前置條件若定義不完整，常會在專案中後期才暴露風險，造成返工甚至停擺。跨域合作真正有效的做法，是讓技術路線、研究規劃與法規要求從一開始就同時對齊，而不是分段處理。'
      },
      { type: 'h2', id: 'node3', text: '三、專案卡住通常不是技術不夠，而是協作節奏沒有被設計' },
      { type: 'p', 
        text: '第一次合作最痛的經驗，是我以為每次會議都在討論同一件事，但其實各方進度與期待不同步：技術端在優化模型，臨床端在確認定義，管理端在追時程。沒有固定節奏時，資訊會在各方之間漂移，最後造成重工與誤解。',
        text: '後來改成每次固定輸出一頁摘要，包含本期假設、資料變更、初步結果、風險與下步決策。這種節奏讓合作從「等結果」變成「持續共同決策」。跨領域專案的核心能力，不只是分析能力，而是把不確定性透明化、讓不同角色都能在同一張地圖上前進。' 
      },
    ],
  },
  {
    id: 'taiwan-medai-2026',
    category: 'industry',
    title: '2026 台灣醫材 AI 產業三個觀察：SaMD 認證、健保資料庫、臨床驗證',
    excerpt:
      '依據 TFDA與MOHW 公開資料，整理 2026 台灣醫材 AI 的三個關鍵觀察：SaMD 監管走向證據品質、健保資料利用進入法律治理、臨床驗證從「模型指標」走向「可審查證據」。',
    publishedAt: '2026-04-06',
    readingTime: '11 分鐘',
    coverImage: taiwanMedAi2026Cover,
    tableOfContents: [
      { id: 'obs1', title: '一、SaMD 監管進入「證據品質競爭」階段' },
      { id: 'obs2', title: '二、健保資料治理升級為法律位階，合規成為基本門檻' },
      { id: 'obs3', title: '三、臨床驗證重點從高分模型轉向可審查、可落地證據' },
    ],
    content: [
      { type: 'h2', id: 'obs1', text: '一、SaMD 監管進入「證據品質競爭」階段' },
      {
        type: 'p',
        text: '近年的趨勢顯示，台灣 AI 醫材已從「是否有規範」走到「能否提出可審查、可重現的證據」。對開發團隊而言，重點不只在模型表現，還包括預期用途、資料來源、效能評估設計與風險揭露是否完整。也就是說，法規文件與技術開發需要從專案早期就同步規劃，而不是送件前才補資料。',
      },
      {
        type: 'callout',
        text: 'TFDA 技術指引頁 https://www.fda.gov.tw/tc/siteListContent.aspx?sid=3787&id=34961',
      },
      { type: 'h2', id: 'obs2', text: '二、健保資料治理升級為法律位階，合規成為基本門檻' },
      {
        type: 'p',
        text: '進入 2026 後，業界面對的是更明確的健保資料法制框架。這代表資料利用不再只是行政流程問題，而是涉及申請資格、用途正當性、審查機制與安全作業環境的整體治理能力。對醫材 AI 團隊來說，資料策略必須同時回答「能不能取得資料」與「能不能在可監督、可審計的程序下使用資料」。',
      },
      {
        type: 'callout',
        text: '「全民健康保險資料管理條例」 https://www.president.gov.tw/Page/294/50094',
      },
      { type: 'h2', id: 'obs3', text: '三、臨床驗證重點從高分模型轉向可審查、可落地證據' },
      {
        type: 'p',
        text: '第三個觀察是，臨床驗證的評價標準正在提高。單一數值指標（例如準確率或 AUC）已不足以支撐落地決策，團隊需要更早規劃目標族群代表性、評估流程、偏差控制與使用情境限制。當驗證設計可以被臨床端與審查端共同理解，模型才有機會從研究成果進入實際應用。',
      },
      {
        type: 'callout',
        text: 'TFDA 醫療器材最新消息（含 AI/ML 指引更新）https://www.fda.gov.tw/tc/siteListContent.aspx?sid=310&id=49448',
      },
    ],
  },
  {
    id: 'community-picks-april',
    category: 'community',
    title: 'FB 社群精選：大家在討論的 AI Agent 研究工具',
    excerpt:
      '這週社群討論聚焦在三件事：Agent 與外部工具串接的標準化、評測方法從單題正確率轉向任務完成度，以及安全治理如何在部署前就納入流程。',
    publishedAt: '2026-03-30',
    readingTime: '7 分鐘',
    coverImage: communityPicksAprilCover,
    tableOfContents: [
      { id: 'tooling', title: '一、Agent 工具鏈正在標準化：MCP 成為熱門關鍵字' },
      { id: 'eval', title: '二、評測焦點改變：從模型分數走向任務完成能力' },
      { id: 'safety', title: '三、安全與治理從附錄變成上線門檻' },
    ],
    content: [
      { type: 'h2', id: 'tooling', text: '一、Agent 工具鏈正在標準化：MCP 成為熱門關鍵字' },
      {
        type: 'p',
        text: '社群最近最常提到的不是單一模型版本，而是 Agent 如何穩定連接外部系統。當一個 Agent 需要同時讀文件、查資料庫、呼叫工作流工具時，整合方式是否一致會直接影響可維護性與擴充速度。MCP 的討論熱度上升，反映出大家開始把 Agent 視為「需要標準介面」的工程系統，而不只是 prompt 技巧集合。',
      },
      {
        type: 'callout',
        text: 'Anthropic, Introducing the Model Context Protocol (2024) https://www.anthropic.com/news/model-context-protocol',
      },
      { type: 'h2', id: 'eval', text: '二、評測焦點改變：從模型分數走向任務完成能力' },
      {
        type: 'p',
        text: '第二個明顯趨勢是評測方法的轉向。研究與實務都發現，傳統單輪問答分數無法完整反映 Agent 在真實任務中的表現，尤其是涉及多步推理、工具使用與跨來源資訊整合時。像 GAIA 這類 benchmark 強調「人類看似容易但代理系統不一定穩定完成」的任務，讓大家更重視端到端任務成功率，而非只看單點指標。',
      },
      {
        type: 'callout',
        text: 'Mialon et al., GAIA: a benchmark for General AI Assistants (arXiv:2311.12983) https://arxiv.org/abs/2311.12983',
      },
      { type: 'h2', id: 'safety', text: '三、安全與治理從附錄變成上線門檻' },
      {
        type: 'p',
        text: '第三個討論焦點是治理。當 Agent 能自主觸發操作、存取更多工具與資料，團隊開始把安全審查前移到設計與驗證階段。這包含權限邊界、資料保護、可追溯紀錄與風險管理流程。從近期公開研究與框架可以看出，產業已逐步形成共識：Agent 的競爭力不只在能力，也在是否能被安全、可持續地部署。',
      },
      {
        type: 'callout',
        text: 'NIST AI Risk Management Framework 官方頁 https://www.nist.gov/itl/ai-risk-management-framework',
      },
    ],
  },
  {
    id: 'imu-data-pitfalls',
    category: 'method',
    title: '2026 國內 IRB 申請重點更新：最新公告與調整原因整理',
    excerpt:
      '依據衛福部 114 年 12 月公告與現行查核機制，整理國內 IRB 申請最近的重點變化：合格效期管理、不定時追蹤查核，以及重大違規後的新案審查限制，並說明背後的制度調整邏輯。',
    publishedAt: '2026-03-23',
    readingTime: '8 分鐘',
    coverImage: imuDataPitfallsCover,
    tableOfContents: [
      { id: 'update', title: '一、最新公告在說什麼：合格名單與效期管理更明確' },
      { id: 'why', title: '二、為什麼要調整：從一次性審查走向持續監管' },
      { id: 'action', title: '三、對申請者的實務影響：提早做好文件與風險管理' },
    ],
    content: [
      { type: 'h2', id: 'update', text: '一、最新公告在說什麼：合格名單與效期管理更明確' },
      {
        type: 'p',
        text: '依衛福部醫事司公告，114 年度人體研究倫理審查委員會查核合格名單已公布，並明確區分新設立審查會與既有審查會的效期安排。公告同時指出，合格效期內仍可能進行不定時追蹤查核，若發生重大違規，須依限改善後才能審查新案，且主管機關得縮短或註銷合格效期。',
      },
      {
        type: 'callout',
        text: '衛福部醫事司「公告114年度人體研究倫理審查委員會查核合格名單」https://dep.mohw.gov.tw/DOMA/cp-3131-84962-106.html',
      },
      { type: 'h2', id: 'why', text: '二、為什麼要調整：從一次性審查走向持續監管' },
      {
        type: 'p',
        text: '這波調整的核心，不只是「通過與否」，而是把 IRB 品質管理從單次審查擴大為全週期監管。當研究案型態更複雜、跨機構合作增加，主管機關需要確保受試者保護機制在核准後仍可被持續驗證。因此制度上強化效期管理、追蹤查核與重大違規處置，目的在於降低審查品質落差與執行風險。',
      },
      { type: 'h2', id: 'action', text: '三、對申請者的實務影響：提早做好文件與風險管理' },
      {
        type: 'p',
        text: '對計畫主持人與研究團隊而言，最實際的改變是：IRB 送審不能只看送件日程，還要把研究期間的變更管理、偏差通報與受試者保護文件一致性一起納入規劃。建議在啟動前先完成版本控管、資料治理與風險情境盤點，避免計畫進行到中後段才發現文件或程序不符，造成補件、暫停或延遲收案。',
      },
    ],
  },
  {
    id: 'phd-topic-pivots',
    category: 'case',
    title: 'AI 時代的學習加速與落差：一般人更快上手，專家更快放大',
    excerpt:
      '現行 AI 應用讓一般人的學習速度與廣度顯著提升，但也可能讓專家把原有優勢放大，進一步拉開理解深度與實作品質的差距。這篇整理我對這個趨勢的三個觀察。',
    publishedAt: '2026-03-16',
    readingTime: '10 分鐘',
    coverImage: phdTopicPivotsCover,
    tableOfContents: [
      { id: 'gain', title: '一、AI 讓一般人的學習門檻下降，速度與廣度同步上升' },
      { id: 'gap', title: '二、但同一波工具，也在放大專家與一般人的差距' },
      { id: 'strategy', title: '三、面對差距擴大的趨勢，學習策略要從「蒐集資訊」轉向「建立判斷」' },
    ],
    content: [
      { type: 'h2', id: 'gain', text: '一、AI 讓一般人的學習門檻下降，速度與廣度同步上升' },
      {
        type: 'p',
        text: '過去學一個新領域，常卡在資料搜尋、術語理解與入門路徑不清楚；現在透過生成式 AI，一般人可以更快把零散資訊整理成可讀的學習地圖。從摘要論文、整理比較表到產生練習題，AI 明顯縮短了「從不知道到能開始做」的時間，讓學習效率與主題涵蓋範圍都提升。',
      },
      { type: 'h2', id: 'gap', text: '二、但同一波工具，也在放大專家與一般人的差距' },
      {
        type: 'p',
        text: '問題在於，AI 不只幫助新手，也同時幫助專家。對專家而言，AI 是加速器：可以更快驗證假設、拓展跨域連結、壓縮重複作業，把更多時間投入高價值判斷。當專家把 AI 用在「放大既有知識結構」時，產出的深度與品質往往遠高於只把 AI 當搜尋引擎的一般使用者，因此整體差距可能不是縮小，而是被重新拉大。',
      },
      { type: 'h2', id: 'strategy', text: '三、面對差距擴大的趨勢，學習策略要從「蒐集資訊」轉向「建立判斷」' },
      {
        type: 'p',
        text: '在這個情境下，關鍵不再是誰拿到更多答案，而是誰能判斷答案是否可靠、是否適用於特定場景。對一般學習者來說，最重要的升級是建立問題定義能力、評估依據與驗證流程：先定義要解的問題，再用 AI 生成候選方案，最後用資料、實作或專家回饋做迭代。當學習重心從「快讀」轉向「可驗證的理解」，AI 才會成為縮短成長曲線的工具，而不是製造認知幻覺的捷徑。',
      },
    ],
  },
]

export const getCategoryLabel = (value) =>
  articleCategories.find((c) => c.value === value)?.label || value

export const getCategoryColor = (value) =>
  articleCategories.find((c) => c.value === value)?.color || 'navy'

export const findArticle = (id) => articles.find((a) => a.id === id)

export const formatArticleDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}/${m}/${day}`
}
