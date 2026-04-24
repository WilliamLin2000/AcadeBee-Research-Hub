// 研究筆記範例資料 — 後續可改為從後端載入
// 主題對齊 William 的實際研究領域：生物力學 / 醫學工程 / AI 整合
// 詳細文章內容之後會每週三篇（一 / 三 / 五）逐步補上，現為結構 + excerpt

import xaiBiomechanicsReviewerCover from '../assets/covers/xai-biomechanics-reviewer.svg'
import biomechAiDecisionMapCover from '../assets/covers/biomech-ai-decision-map.svg'
import firstWearableCollabCover from '../assets/covers/first-wearable-collab.svg'
import taiwanMedAi2026Cover from '../assets/covers/taiwan-medai-2026.svg'
import communityPicksAprilCover from '../assets/covers/community-picks-april.svg'
import imuDataPitfallsCover from '../assets/covers/imu-data-pitfalls.svg'
import phdTopicPivotsCover from '../assets/covers/phd-topic-pivots.svg'

export const articleCategories = [
  { value: 'method', label: '方法論筆記', color: 'teal' },
  { value: 'case', label: '專案經驗', color: 'gold' },
  { value: 'industry', label: '產業觀察', color: 'navy' },
  { value: 'community', label: '社群精選', color: 'coral' },
]

export const articles = [
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
        text: '這不是審稿人的個人口味，而是近年來生醫 AI 領域的共識性轉變。根據 Malinverno et al.（2023）對 PubMed 資料庫中 1,603 篇相關論文的大規模分析，生醫 XAI（Explainable Artificial Intelligence）的發表量在 2020 年之後明顯加速——COVID-19 的臨床壓力放大了「模型不可信任」的代價，使整個社群意識到「高準確度」和「臨床可部署」之間還差了一個解釋性的門檻。',
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
        text: 'Xiang et al.（2025）發表了迄今最完整的步態分析 XAI 系統性回顧。他們從 3,676 篇文獻中篩選出 31 篇符合標準的研究，清楚描繪了這個領域的方法全貌。應用的臨床族群包括帕金森氏症患者、中風後步態異常者、肌少症、腦性麻痺，以及一般肌骨系統障礙——這些族群共同特徵是步態資料個體間差異大、標記數量少，正是「小資料 + 黑盒模型」的高風險情境。',
      },
      {
        type: 'p',
        text: '常見的 XAI 方法可以分為三類：（1）模型無關（Model-agnostic）：SHAP 和 LIME 是最多論文採用的方法，可以事後解釋每個特徵對單一預測的貢獻量，適用任何模型，但解釋本身是近似值。（2）模型特異（Model-specific）：Grad-CAM 與 Attention Mechanism 與模型計算緊密結合，較適合作為「內建式可解釋性」。（3）混合（Hybrid）：同時使用 intrinsically interpretable 模型和 post hoc 方法，兼顧透明度與性能。',
      },
      {
        type: 'p',
        text: '這篇系統性回顧進一步指出，在生物力學語境下，XAI 方法確認的關鍵辨別特徵包括步幅長度（stride length）與關節角度（joint angles）——這些本來就有臨床意義的指標，被 XAI 方法「重新確認」，反過來增加了模型預測結果的臨床公信力。',
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
        text: '第二，你的解釋結果有沒有生物力學或臨床意義？純粹說「特徵 A 的 SHAP 值最大」並不夠——你需要連結到既有的生物力學知識。第三，模型解釋在不同受試者或不同採集日的穩定性如何？這是 Xiang et al. 系統性回顧點名的主要研究缺口之一，現有論文少有對 XAI 輸出的穩定性進行驗證。第四，你有沒有讓臨床或領域專家確認解釋的合理性？即使只是一位物理治療師確認「這個特徵的貢獻方向符合臨床直覺」，都能大幅提升審稿人的接受度。',
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
