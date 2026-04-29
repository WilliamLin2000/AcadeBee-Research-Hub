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

export const articleCategories = [
  { value: 'method', label: '方法論筆記', color: 'teal' },
  { value: 'case', label: '專案經驗', color: 'gold' },
  { value: 'industry', label: '產業觀察', color: 'navy' },
  { value: 'community', label: '社群精選', color: 'coral' },
]

export const articles = [
  {
    id: 'small-dataset-deep-learning-biomechanics',
    category: 'method',
    title: '小資料集 + 深度學習：生物力學研究的五個方向（一起聊聊）',
    excerpt:
      '收 50 位受試者已經是奢侈，遑論 ImageNet 級的百萬樣本。當實驗室只擠得出 30~40 位受試者、卻被審稿人問「樣本數需要再增加」。這篇整理 2021–2026 文獻裡看到的五個方向：合成資料、遷移學習、自監督預訓練、嚴格的跨受試者驗證、輕量模型。每個方向都附原文 RMSE / F1 / DSC 數字，想跟大家一起討論在小資料場景下這些選項各自的取捨。',
    publishedAt: '2026-04-29',
    readingTime: '13 分鐘',
    featured: false,
    coverImage: smallDatasetDLBiomechanicsCover,
    tableOfContents: [
      { id: 'why-small-data', title: '一、為什麼小資料是我們的常態，不是例外' },
      { id: 'synthetic-data', title: '二、方向 1：用肌肉骨骼模型生成合成資料' },
      { id: 'transfer-learning', title: '三、方向 2：遷移學習 + 個體化 fine-tune' },
      { id: 'ssl-pretraining', title: '四、方向 3：自監督預訓練（SSL）—— 用沒標註的資料先學表徵' },
      { id: 'validation', title: '五、方向 4：嚴格一點的跨受試者 / 跨資料集驗證' },
      { id: 'lightweight-models', title: '六、方向 5：模型先輕量化，再談深度學習' },
      { id: 'decision-tree', title: '七、五個方向能怎麼搭配 —— 一個草稿級的決策邏輯' },
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
        text: '對照影像領域動輒 ImageNet（128 萬張）、UK Biobank（70 萬人日穿戴資料）的規模，我們手上的資料規模真的是另一個世界。但這兩三年，我看到的審稿意見裡「為什麼不試試 deep learning？」這個問題出現得越來越頻繁，相信不少朋友也遇過。',
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
      { type: 'h2', id: 'ssl-pretraining', text: '四、方向 3：自監督預訓練（SSL）—— 用沒標註的資料先學表徵' },
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
        text: '更嚴格的標準是跨資料集驗證（cross-dataset validation）。Benchekroun 等人 2023 年在《Sensors》用兩個不同協議、不同感測器、不同壓力源設計的 HRV 資料集做交叉驗證——一個訓練、另一個測試。Logistic Regression 在 LOSO 內表現好，但跨資料集表現大幅退化；Random Forest 跨資料集穩定維持 F1 = 61%。這個結果其實蠻打臉「同資料集 cross-validation 看似好的模型」這種直覺，給了我們一個具體的經驗證據。',
      },
      {
        type: 'callout',
        text: 'Benchekroun et al. (2023), Cross Dataset Analysis for Generalizability of HRV-Based Stress Detection Models. Sensors. https://doi.org/10.3390/s23041807',
      },
      {
        type: 'p',
        text: '兒童發展研究中，Mutersbaugh 等人 2025 年在《JMIR Medical Informatics》用 41 位兒童 IMU 手部追蹤資料訓練自閉症分類器，CAE+LSTM 在傳統 k-fold 上 accuracy 90.21% / F1 90.02%；切換到 patient-separated 切分（保證測試集的人從沒出現在訓練集）後，accuracy 反而提升到 91.87% / F1 93.66%。這個案例很有趣的地方是：patient-separated 不一定退化，前提是模型架構足夠泛化。我自己想知道的是，如果換成更小的樣本（< 20 人），這個結論還站得住嗎——如果有朋友試過類似切分，蠻想交流一下。',
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
        text: '我自己會傾向先試 1D-CNN / TCN / 小型 LSTM，把這當成 baseline 看資料夠不夠支持任務複雜度；再考慮 transformer。如果一開始就上大型架構，把它列為比較對象就好——但我會把更多時間花在 cascaded、multi-task、multi-stage 這些設計上，這往往才是 paper 真正的核心貢獻。',
      },
      { type: 'h2', id: 'decision-tree', text: '七、五個方向能怎麼搭配 —— 一個草稿級的決策邏輯' },
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
        text: '寫到這裡，我自己腦中還有幾個沒想清楚的問題，蠻想跟同樣在做小資料 + 深度學習的朋友交換意見：在 N < 20 的極小樣本下，patient-separated cross-validation 是否還能維持上面引用的結論？文獻裡的例子大多 N ≥ 30。合成資料 + fine-tune 的「最少真實樣本」到底是多少？Bicer et al. 用 3 位就能把 RMSE 拉回，但這是健康成人——病人組需要多少？跨資料集驗證的 F1 退化如果超過 30%，論文還能發嗎？或者該怎麼把它寫成「未來工作」而不是「致命缺陷」？',
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
      '眼動訓練、Quiet Eye、Strobe glasses、Sports Vision Training——名詞愈來愈多，廠商也愈來愈會行銷。這篇從近兩年的 meta-analysis、RCT 與系統性回顧，整理眼動訓練對運動員表現實際上有多大效果、適用什麼運動類型，以及生醫工程介入的切入點。',
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
        text: '主要結果有兩個：決策反應時間（decision-making response time）的標準化平均差 SMD = 0.85，95% CI [0.45, 1.24]，I² = 30%，p < 0.01——這是一個大效果量（large effect size，Cohen 約定 SMD > 0.8）；運動專項表現（sport-specific performance）SMD = 0.49，95% CI [0.13, 0.85]，I² = 61%，p = 0.01——中等效果量，但 I² 偏高顯示研究間異質性明顯。',
      },
      {
        type: 'callout',
        text: 'Guo et al. (2025), Does Visual Training Enhance Athletes\' Decision-Making Skills and Sport-Specific Performance? A Systematic Review and Meta-Analysis. Scand J Med Sci Sports. https://doi.org/10.1111/sms.70140',
      },
      {
        type: 'p',
        text: '這份 meta-analysis 的子群分析顯示，無論受試者特性（菁英 / 業餘）或訓練方案（時長、頻率），組間差異未達統計顯著——換言之，在現有證據量下，「該怎麼做」還沒有高解析度的答案，只能說「做了比沒做好」。實務上的解讀：對反應時間敏感的運動（拳擊、桌球、電競、守門員），證據傾向支持有實質提升；對專項表現的提升存在但效果量較小，且因運動類型差異大。',
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
        text: '第四類，Multisensory / Anticipation Training（多感官整合）。不只看，還要聽，且通常要結合動作回饋。Wang 等人（2025）將羽球新手分為純視覺、視聽整合、模糊視聽、對照四組，進行兩週共六次訓練。結果顯示：訓練組在預判準確率上顯著提升、且效果可保留兩週；在高認知負荷與模擬動作任務下，純視覺訓練組的提升幅度最大，其次是視聽整合組——這個結果反直覺地提示：多感官不一定總是優於單感官，要看任務本身的感官依賴性。',
      },
      {
        type: 'callout',
        text: 'Wang et al. (2025), Multisensory training enhances anticipation skills in badminton novices. Scientific Reports. https://doi.org/10.1038/s41598-025-93475-7',
      },
      { type: 'h2', id: 'closed-vs-open', text: '四、項目差異：定點瞄準 vs 開放技能' },
      {
        type: 'p',
        text: '這是文獻裡最一致的分裂——眼動訓練在閉鎖技能（closed skill）運動上的效果比開放技能（open skill）顯著。閉鎖技能（高爾夫推桿、射擊、射箭、撞球）的動作模式固定、環境變動小，QE / fixation 時間長度與成績的因果關係相對清楚。開放技能（球類對抗、守門員、團隊運動）的 gaze behavior 跟成績的關係比較複雜，既要看 anticipation（預判），又要看在快速變化的場景中是否抓對 cue。',
      },
      {
        type: 'p',
        text: 'Huesmann 等人（2025）在《Journal of Sports Sciences》發表的兩篇 scoping review 整理了：第一篇納入 20 篇研究，發現菁英守門員的 anticipation 表現整體優於低技術等級者，cue utilisation 更有效率；第二篇納入 13 篇訓練研究，提示顯式（explicit）、引導發現式（guided discovery）、與隱式（implicit）三種訓練取向都可能有效，但各有不同的應用情境。作者也明確指出，現有研究男性成人為主，且多在實驗室標準化罰球情境下進行——對女性與真實比賽情境的證據缺口仍大。',
      },
      {
        type: 'callout',
        text: 'Huesmann et al. (2025), Expertise and training of anticipation in goalkeeping: Two scoping reviews. J Sports Sci. https://doi.org/10.1080/02640414.2025.2533002',
      },
      {
        type: 'p',
        text: '性別差異有專門證據。Jedziniak 等人（2025）以 40 位菁英手球守門員（20 男 + 20 女）測量罰球攔截時的眼動行為。男性守門員主要凝視擲球者的擲球臂與球本身，女性守門員主要凝視軀幹與頭部 AOI；且兩性在 quiet eye duration 對「成功攔截 vs 失敗」上都有顯著差異（女性 MD = 92.26 ms，p = 0.005；男性 MD = 122.83 ms，p < 0.001）。這項結果直接挑戰了「眼動訓練 protocol 男女通用」的常見假設——訓練設計可能需要按性別調整。',
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
        text: '三個重要結果：(1) 接受 QET 的受試者，真實世界推桿表現提升（命中數、徑向誤差均顯著），且這個提升在「練習在 VR 中」與「練習在真實場上」兩種條件下都有發生。(2) 但若測試環境改成 VR，那麼「在真實場上練習的人」進步、「在 VR 中練習的人」沒進步——真實場上技能可以遷移到 VR 環境，反向遷移較差。(3) 這對生醫工程介入的啟示是：VR 作為「訓練眼動策略本身」是有效的（因為眼動策略是可移植的認知技能），但 VR 作為「動作技能練習場」目前還無法取代真實環境。',
      },
      {
        type: 'callout',
        text: 'Bennett et al. (2025), Quiet Eye Training in Virtual Reality and in the Real-World. Human Movement Science. https://doi.org/10.1016/j.humov.2025.103370',
      },
      { type: 'h2', id: 'practical-tips', text: '六、給研究者 / 教練的務實建議' },
      {
        type: 'p',
        text: '對研究者（含碩博生）：訓練介入研究務必設標準對照組，且對照組要做等量、相關但無目標訓練的工作——Guo 2024、He 2024 都這樣設計，這也是目前 meta-analysis 收得進來的研究的共同特徵。「做了 vs 完全不做」的設計只能證明「有人介入比沒人介入好」，不能證明眼動訓練本身的效果。',
      },
      {
        type: 'p',
        text: '對教練 / 運動科學支援團隊：現有證據支持眼動訓練值得加入訓練菜單，但項目差異大、訓練週期需要至少 2–6 週、需要有適配的訓練範式（閉鎖技能用 QET / SVT、開放技能用 anticipation / multisensory）。不要直接把高爾夫的 QET protocol 套用到籃球上。',
      },
      {
        type: 'p',
        text: '對想做相關工程介入研究的生醫工程領域，可以切入的工程議題包括：(1) eye-tracker 在場上情境（汗、強光、大幅頭部運動）下的訊號穩定性；(2) gaze behavior 自動分析的演算法（saccade / fixation / smooth pursuit 分類器，配合 ML 模型對照專家標記）；(3) 結合 IMU 的 head-eye coordination 量測，特別是開放技能項目；(4) AI 驅動的個人化訓練 protocol——Alemanno 2025 與 Huesmann 2025 的回顧都明確指出，「整合 AI 進行 gaze-based 訓練個人化」是下一階段的重點研究方向。',
      },
      { type: 'h2', id: 'summary', text: '七、小結' },
      {
        type: 'p',
        text: 'Guo 2025 的 meta-analysis 提供了目前最高等級的證據：對反應時間有大效果量、對運動專項表現有中等效果量。閉鎖技能項目的證據比開放技能更扎實，多感官訓練不一定總優於單感官，男女守門員的 gaze 策略可能本質就不同——這些細節都意味著訓練設計必須客製化，而客製化正是工程介入可以發揮的地方。',
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
