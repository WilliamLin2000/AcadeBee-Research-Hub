---
id: small-dataset-deep-learning-biomechanics
category: method
title: 小資料集 + 深度學習：生物力學研究的五個方向（一起聊聊）
excerpt: 收 50 位受試者已經是奢侈，遑論 ImageNet 級的百萬樣本。當實驗室只擠得出 30~40 位受試者、卻被審稿人問「為什麼不試試 deep learning」，我自己也會卡很久。這篇整理 2021–2026 文獻裡看到的五個方向：合成資料、遷移學習、自監督預訓練、嚴格的跨受試者驗證、輕量模型。每個方向都附原文 RMSE / F1 / DSC 數字，想跟大家一起討論在小資料場景下這些選項各自的取捨。
publishedAt: 2026-04-29
readingTime: 13 分鐘
featured: false
sources:
  - title: "The Use of Synthetic IMU Signals in the Training of Deep Learning Models Significantly Improves the Accuracy of Joint Kinematic Predictions"
    url: https://doi.org/10.3390/s21175876
    tier: primary
    note: "Sensors, 2021; OpenSim 合成 IMU 資料訓練 NN，髖關節 RMSE 從 4.5° 降到 2.3°（純合成）/1.9°（合成+量測）"
  - title: "Predicting human gait kinematics and kinetics from a single inertial measurement unit using deep learning and synthetic datasets: A blinded assessment study"
    url: https://doi.org/10.1016/j.jbiomech.2026.113149
    tier: primary
    note: "Journal of Biomechanics, 2026; 49 位健康成人合成訓練 + 7 位盲測 + 3 位 fine-tuning；合成→真實 IMU 退化 RMSE 2.6°→4.5°，fine-tune 後回到 2.6°"
  - title: "Learning based lower limb joint kinematic estimation using open source IMU data"
    url: https://doi.org/10.1038/s41598-025-89716-4
    tier: primary
    note: "Scientific Reports (Nature Portfolio), 2025; 開源 IMU 資料 + transfer learning，建議感測器位置：femur + calcaneus"
  - title: "Personalization of Wearable Sensor-Based Joint Kinematics Estimation Using Computer Vision for Hip Exoskeleton Applications"
    url: https://doi.org/10.1109/ICORR66766.2025.11063180
    tier: primary
    note: "IEEE ICORR, 2025; 1–2 個步態週期 fine-tune TCN，stiff knee 病人 RMSE 比 able-bodied 模型降 9.7%、比僅用 stiff knee 訓練降 19.9%"
  - title: "Self-supervised learning for human activity recognition using 700,000 person-days of wearable data"
    url: https://doi.org/10.1038/s41746-024-01062-3
    tier: primary
    note: "NPJ Digital Medicine, 2024; UK Biobank 70 萬人日資料自監督預訓練，8 個下游 benchmark 的 F1 相對提升 2.5–130.9%（中位數 24.4%）"
  - title: "MaskCAE: Masked Convolutional AutoEncoder via Sensor Data Reconstruction for Self-Supervised Human Activity Recognition"
    url: https://doi.org/10.1109/JBHI.2024.3373019
    tier: primary
    note: "IEEE JBHI, 2024; masked autoencoder 重建感測器資料，無需 augmentation 即超越 SSL/SL/SemiSL baseline"
  - title: "Cross Dataset Analysis for Generalizability of HRV-Based Stress Detection Models"
    url: https://doi.org/10.3390/s23041807
    tier: primary
    note: "Sensors, 2023; LOSO + cross-dataset 雙重驗證；RF F1=61% 仍可跨資料集穩定，LR 大幅退化"
  - title: "User- and Speed-Independent Slope Estimation for Lower-Extremity Wearable Robots"
    url: https://doi.org/10.1007/s10439-023-03391-y
    tier: primary
    note: "Annals of Biomedical Engineering, 2023; LOSOCV (N=9)，靜態斜率 MAE 0.88°、動態 1.73°；thigh IMU 貢獻最大"
  - title: "Deep Learning Approaches for Classifying Children With and Without Autism Spectrum Disorder Using Inertial Measurement Unit Hand Tracking Data"
    url: https://doi.org/10.2196/73440
    tier: primary
    note: "JMIR Medical Informatics, 2025; n=41 兒童 IMU 手部資料；CAE+LSTM 在 patient-separated 切分下 accuracy 91.87% / F1 93.66%"
  - title: "Automatic quadriceps and patellae segmentation of MRI with cascaded U-Net and SASSNet deep learning model"
    url: https://doi.org/10.1002/mp.15335
    tier: primary
    note: "Medical Physics, 2022; n=40 兒童 MRI、leave-one-out testing；兩階段 cascaded 設計 DSC 93.7–95.1%"
  - title: "Finite element models with automatic computed tomography bone segmentation for failure load computation"
    url: https://doi.org/10.1038/s41598-024-66934-w
    tier: primary
    note: "Scientific Reports (Nature Portfolio), 2024; 在受限 CT 資料下 U-Net 自動分割股骨/椎體，FE failure load 與手動分割相當"
  - title: "Deep Transfer Learning with Enhanced Feature Fusion for Detection of Abnormalities in X-ray Images"
    url: https://doi.org/10.3390/cancers15154007
    tier: primary
    note: "Cancers, 2023; MURA musculoskeletal X-ray；醫療領域內預訓練優於 ImageNet 預訓練（humerus accuracy 87.85% / wrist 85.58%）"
---

## 一、為什麼小資料是我們的常態，不是例外

我猜大家在做生物力學或醫材臨床研究時，看到下面這幾個情況都會很有共鳴：

- IRB 雖然過了，但儀器排程、受試者招募、退出率一路扣下來，最後拿到完整資料的可能就 20–40 人。
- 每位受試者貢獻幾十到幾百個步態週期，但個體間變異往往遠大於個體內變異。
- 病人組或特殊族群（腦性麻痺、術後復健、運動傷害）更稀缺，常常只有十幾位。

對照影像領域動輒 ImageNet（128 萬張）、UK Biobank（70 萬人日穿戴資料）的規模 [ref: Yuan 2024, NPJ Digital Medicine, DOI:10.1038/s41746-024-01062-3]，我們手上的資料規模真的是另一個世界。但這兩三年，我看到的審稿意見裡「為什麼不試試 deep learning？」這個問題出現得越來越頻繁，相信不少朋友也遇過。

所以想跟大家整理一下 2021–2026 文獻裡看到的五個方向，每個都有 peer-reviewed 文獻支持。重點不是「深度學習比較好」這種二元判斷，而是想跟大家一起討論：在小資料場景下，**這些選項各自的成本、效益、適用範圍是什麼**——這樣我們在面對自己題目的時候，比較有判斷依據。

## 二、方向 1：用肌肉骨骼模型生成合成資料

最直接的補資料方法，是用 OpenSim 等肌肉骨骼模型，從動作捕捉資料**反推**身上某個位置的虛擬 IMU 訊號，再拿來訓練模型。Sharifi Renani 等人 2021 年在 _Sensors_ 的研究做了完整示範：他們用合成資料訓練神經網路預測髖、膝關節三軸旋轉角度，純合成訓練的模型在六個自由度中有五個贏過純量測訓練；髖關節 RMSE 從 4.5° 降到 2.3°（−38%），膝關節從 3.3° 降到 2.9°（−11%）。當合成 + 量測一起訓練時，髖關節 RMSE 進一步降到 1.9°（vs. 純量測 4.5°，−54%）、膝關節到 1.7°（−45%） [ref: Sharifi Renani et al. 2021, Sensors, DOI:10.3390/s21175876]。

不過合成資料一直有個大家都知道的問題：**虛擬 IMU 訊號跟真實穿戴的 IMU 之間有 sim-to-real gap**。Bicer 等人 2026 年在 _Journal of Biomechanics_ 用一個盲測設計把這個落差量化得很清楚：他們用 49 位健康成人的公開動捕資料合成虛擬 IMU 訓練 NN，再用另一個實驗室、不同收案協議的 7 位健康成人**真實 IMU** 盲測。模型在虛擬 IMU 上 RMSE 只有 2.6°（角度）/0.10 Nm/kg（力矩），但搬到真實 IMU 退化到 4.5° / 0.21 Nm/kg；後來用 3 位額外受試者的真實 IMU 做 fine-tune 後，回到 2.6° / 0.19 Nm/kg [ref: Bicer et al. 2026, J Biomech, DOI:10.1016/j.jbiomech.2026.113149]。

我自己會這樣理解：合成資料比較像是「預訓練 + 量測 fine-tune」流程的前段，單獨用合成資料就宣稱在真實場景下的表現，看起來是會被現有文獻的盲測設計挑戰的。不知道大家在自己的題目上會怎麼處理這個落差？

## 三、方向 2：遷移學習 + 個體化 fine-tune

第二個方向是把別人訓練好的模型搬過來，再用手上少量資料 fine-tune。醫療影像領域已經是慣例做法，這兩年在穿戴式感測器領域也累積了一些驗證。

Hur 等人 2025 年在 _Scientific Reports_ 比較了三種策略：(a) 單一受試者個人化模型、(b) 多受試者通用模型、(c) 多受試者通用 + 新使用者 fine-tune。結果是 (a) 對該人準度最高但完全不通用，(b) 因為步態個體差異大導致準度下降，(c) 用新使用者一小部分資料 fine-tune 後可達到與 inverse kinematics 相當的表現。他們也分析了感測器位置，整理出在大多數情況下**股骨（femur）+ 跟骨（calcaneus）兩個 IMU** 是不錯的組合 [ref: Hur et al. 2025, Sci Rep, DOI:10.1038/s41598-025-89716-4]。

更積極的版本是 Song 等人 2025 年在 IEEE ICORR 的工作：他們只用 **1–2 個步態週期**做 fine-tune，把原本在健康受試者上訓練的 TCN 模型遷移到 stiff knee 步態病人，RMSE 比僅用健康者訓練的模型降低 9.7%，比僅用 stiff knee 資料訓練的模型降低 19.9% [ref: Song et al. 2025, IEEE ICORR, DOI:10.1109/ICORR66766.2025.11063180]。對於罕見病或臨床收案困難的群體，這個資料量級看起來是可以接受的。

醫療影像端有個我覺得很容易被忽略的細節：**預訓練資料的領域相似度可能比模型本身的選擇更重要**。Alammar 等人 2023 年在 _Cancers_ 比較了「ImageNet 預訓練」vs.「醫療領域內大量 X-ray 預訓練」，後者在 MURA musculoskeletal X-ray 上明顯較好（humerus accuracy 87.85%、wrist 85.58%、Cohen's Kappa 75.69% / 70.46%） [ref: Alammar et al. 2023, Cancers, DOI:10.3390/cancers15154007]。

這給我的啟發是：在做 X-ray、CT、MRI、IMU 訊號這類任務時，比起直接拿 ImageNet 預訓練的 backbone，可能可以先看看領域內有沒有更接近的大型預訓練模型（RadImageNet、MoCo-CXR、UK Biobank SSL 模型等）。當然這只是文獻支持的一個方向，實際效果還是要看自己的資料分布。

## 四、方向 3：自監督預訓練（SSL）—— 用沒標註的資料先學表徵

如果連標註都做不出來、但手上有大量未標註資料，自監督學習（SSL）是 2023–2025 年文獻裡很值得參考的解法。

代表作是 Yuan 等人 2024 年在 _NPJ Digital Medicine_ 的工作：他們用 UK Biobank 加速度計資料（**70 萬人日，未標註**）做自監督預訓練，再轉到 8 個下游 benchmark 做活動辨識，相對 F1 提升 **2.5–130.9%（中位數 24.4%）**，而且**跨資料集、跨受試族群、跨感測器**都能維持優勢 [ref: Yuan et al. 2024, NPJ Digit Med, DOI:10.1038/s41746-024-01062-3]。這個模型已經開源，作為 baseline 來比較自己手上的方法挺方便的。

另一個值得參考的路線是 Cheng 等人 2024 在 IEEE JBHI 發表的 MaskCAE（masked convolutional autoencoder）：直接重建被遮蔽的感測器訊號，**沒有依賴 contrastive learning 那一套需要精心設計的資料增強組合**，在 self-supervised、fully supervised、semi-supervised 三種設定下都贏過當時 SOTA [ref: Cheng et al. 2024, IEEE JBHI, DOI:10.1109/JBHI.2024.3373019]。對嵌入式裝置部署也比 transformer 友善很多。

對博士生來說，比較實際的入手點看起來是直接拿 Yuan et al. 開源的 UK Biobank SSL 模型 fine-tune，省掉自己預訓練的算力負擔。如果有人試過、效果跟原文有出入，蠻想知道是哪些步態 / 任務類型容易掉。

## 五、方向 4：嚴格一點的跨受試者 / 跨資料集驗證

這個方向其實比上面四個都重要。小資料的最大風險不是訓練不出模型，而是**驗證做得太寬鬆，論文發表後到別人實驗室就失效**。文獻裡看到的趨勢是大家越來越重視這塊，光做隨機切分（random split）越來越站不住腳。

最低標準看起來是 **Leave-One-Subject-Out Cross-Validation (LOSOCV)**。Maldonado-Contreras 等人 2023 年在 _Annals of Biomedical Engineering_ 用 N=9 受試者的 LOSOCV，訓練 XGBoost 預測穿戴式機器人應用的斜坡角度。靜態斜率 MAE 0.88°、動態斜率 MAE 1.73°，並且發現大腿（thigh）IMU 對誤差貢獻最大 [ref: Maldonado-Contreras et al. 2023, Ann Biomed Eng, DOI:10.1007/s10439-023-03391-y]。LOSOCV 真正的價值是讓「模型沒看過這個人」，避免 within-subject 資料洩漏。

更嚴格的標準是 **跨資料集驗證（cross-dataset validation）**。Benchekroun 等人 2023 年在 _Sensors_ 用兩個不同協議、不同感測器、不同壓力源設計的 HRV 資料集做交叉驗證——一個訓練、另一個測試。Logistic Regression 在 LOSO 內表現好，但跨資料集表現大幅退化；Random Forest 跨資料集穩定維持 F1 = 61% [ref: Benchekroun et al. 2023, Sensors, DOI:10.3390/s23041807]。這個結果其實蠻打臉「同資料集 cross-validation 看似好的模型」這種直覺，給了我們一個具體的經驗證據。

兒童發展研究中，Mutersbaugh 等人 2025 年在 _JMIR Medical Informatics_ 用 41 位兒童 IMU 手部追蹤資料訓練自閉症分類器，CAE+LSTM 在傳統 k-fold 上 accuracy 90.21% / F1 90.02%；切換到 **patient-separated 切分**（保證測試集的人從沒出現在訓練集）後，accuracy 反而提升到 91.87% / F1 93.66% [ref: Mutersbaugh et al. 2025, JMIR Med Inform, DOI:10.2196/73440]。這個案例很有趣的地方是：patient-separated 不一定退化，前提是模型架構足夠泛化。我自己想知道的是，如果換成更小的樣本（< 20 人），這個結論還站得住嗎——如果有朋友試過類似切分，蠻想交流一下。

對於有志投生醫工程期刊的朋友，我自己會傾向至少把 LOSOCV 列為基本配置；如果題目涉及臨床落地（SaMD、醫材試驗），再加做 cross-dataset 或多中心驗證。

## 六、方向 5：模型先輕量化，再談深度學習

最後一個方向是反過來想：**不一定模型越大越好，匹配資料規模的模型也許才是更好的選擇**。深度學習在小資料容易過擬合，輕量化、結構先驗、多階段設計，看起來常常比直接堆 transformer 更有用。

Cheng 等人 2022 年在 _Medical Physics_ 處理 N=40 兒童 MRI 的 quadriceps 自動分割問題，用 cascaded U-Net + SASSNet 兩階段設計（第一階段粗定位、第二階段精細分割）。在 leave-one-out 測試下，rectus femoris、vastus medialis、patella 達到 DSC 93.7–95.1%，超越當時 template-based 與單階段 NN 方法 [ref: Cheng et al. 2022, Med Phys, DOI:10.1002/mp.15335]。我覺得這個案例的重點不是模型多深，而是**用領域知識把問題切分（先粗後細），每一步只用必要的容量**。

Saillard 等人 2024 年在 _Scientific Reports_ 處理生醫工程經典難題：股骨、椎體 CT 自動分割→建 finite element 模型計算骨折承載力。原文裡有句話我蠻有共鳴的："it is not always possible to have access to a multitude of CT-scans with the associated ground truth"，所以重點是**前處理 + U-Net 微調 + 後處理**的整體 pipeline。最終自動分割產生的 FE failure load 與手動分割相當 [ref: Saillard et al. 2024, Sci Rep, DOI:10.1038/s41598-024-66934-w]。對骨科生醫工程的朋友，這個是很直接可以拿來參考的範例。

回到 Mutersbaugh 等人的 ASD 研究，他們明確寫到 "small-scale models can still achieve a high accuracy and good generalization when classifying medical data, opening the door for future research into diagnostic models that may not require massive amounts of data" [ref: Mutersbaugh et al. 2025, JMIR Med Inform, DOI:10.2196/73440]。我自己覺得這句話可以蠻溫和地放進論文 discussion，回應「為什麼不用更大的模型」這類意見。

我自己會傾向先試 1D-CNN / TCN / 小型 LSTM，把這當成 baseline 看資料夠不夠支持任務複雜度；再考慮 transformer。如果一開始就上大型架構，把它列為比較對象就好——但我會把更多時間花在 cascaded、multi-task、multi-stage 這些設計上，這往往才是 paper 真正的核心貢獻。

## 七、五個方向能怎麼搭配 —— 一個草稿級的決策邏輯

把五個方向放在一起，可以整理成這樣的思路（純粹是我自己看完文獻後的整理，蠻歡迎大家補充或挑戰）：

1. **手上有沒有大量未標註的同類型資料？** 有→方向 3（SSL 預訓練）；沒有→2.
2. **領域內有沒有開源的預訓練模型 / 大型公開資料集？** 有→方向 2（轉移學習 fine-tune）；沒有→3.
3. **問題能不能用肌肉骨骼模型 / 物理模擬產生合成資料？** 能→方向 1（合成資料 + fine-tune）；不能→4.
4. **不論走哪條路，驗證都加做 LOSOCV，臨床題目再加 cross-dataset。**（方向 4）
5. **不論走哪條路，從輕量化模型開始建立 baseline，再增加複雜度。**（方向 5）

這五個方向不是互斥而是疊加的：UK Biobank SSL 預訓練（3）+ 自己實驗室資料 fine-tune（2）+ 加合成資料補罕見步態（1）+ LOSOCV 驗證（4）+ 用 TCN 而不是 transformer（5），看起來是 2025 年生醫工程小資料 + 深度學習文獻裡浮現的一個典型 pipeline。但這只是文獻整理出來的整體輪廓，每個人手上的題目細節差很多，這個邏輯不見得直接適用。

## 八、想跟大家一起討論的幾個問題

寫到這裡，我自己腦中還有幾個沒想清楚的問題，蠻想跟同樣在做小資料 + 深度學習的朋友交換意見：

- 在 N < 20 的極小樣本下，patient-separated cross-validation 是否還能維持上面引用的結論？文獻裡的例子大多 N ≥ 30。
- 合成資料 + fine-tune 的「最少真實樣本」到底是多少？Bicer et al. 用 3 位就能把 RMSE 拉回，但這是健康成人——病人組需要多少？
- 跨資料集驗證的 F1 退化如果超過 30%，論文還能發嗎？或者該怎麼把它寫成「未來工作」而不是「致命缺陷」？

如果這些問題大家有看到的文獻或自己的踩坑經驗，蠻歡迎在社群裡分享。我把這篇放在這裡，與其說是結論，不如說是想拋磚引玉。

---

> 本文所有具體 RMSE / DSC / F1 / 受試者數，皆取自 PubMed 索引的 peer-reviewed 文獻並附 DOI。引用層級依 AcadeBee 白名單僅使用 Primary 層（PubMed、Journal of Biomechanics、Nature 系、IEEE Xplore）。
