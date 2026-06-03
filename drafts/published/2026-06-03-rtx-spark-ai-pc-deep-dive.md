# NVIDIA RTX Spark 技術深入：把資料中心級 AI 算力塞進 Windows AI PC

> 整理時間：2026-06-03
> 焦點：黃仁勳 COMPUTEX 2026 主題演講中關於 RTX Spark 的技術細節
> 角度：以生醫工程研究者的本地推論需求為主軸

![Jensen Huang 在 COMPUTEX 2026 GTC Taipei 演講現場](https://www.servethehome.com/wp-content/uploads/2026/05/NVIDIA-Computex-2026-Keynote-Jensen-800x450.jpg)

*圖：黃仁勳於台北流行音樂中心發表 GTC Taipei 主題演講（來源：ServeTheHome 現場拍攝）*

## 一、先回答你的問題：RTX Spark 就是 NVIDIA 的 AI PC 答卷

對。RTX Spark 是 NVIDIA 與 Microsoft 共同推出的 Windows AI PC 平台核心矽，本質上是把過去只在資料中心存在的 superchip 架構（CPU 加 GPU 加高頻寬統一記憶體）縮小封裝後，塞進筆電與小型桌機。

之前 Microsoft 推 Copilot+ PC 時主打的是 Qualcomm Snapdragon X 與 Intel Core Ultra 上的 NPU（神經網路處理器）。RTX Spark 是 NVIDIA 直接跳過 NPU 路線，用一顆完整的 Blackwell GPU 來做 AI PC 的核心算力。Windows 在 RTX Spark 上會被重新定位成 agentic AI OS，讓使用者只下達指令、由作業系統把工作交給本地 agent 執行。

## 二、硬體架構拆解（GB10 Superchip）

正式內部代號是 GB10 Superchip。把規格表整理出來：

### CPU 端

NVIDIA Grace 微架構（Arm 指令集），與 MediaTek 共同開發。20 cores，混合 performance core 與 efficiency core 設計，取代傳統 x86 全面走 Arm 路線。

### GPU 端

GeForce RTX Blackwell 架構，6,144 顆 CUDA cores，第五代 Tensor cores 原生支援 FP4 精度。圖形能力涵蓋完整 DirectX 12 Ultimate、ray tracing、path tracing、DLSS 4.5（未來支援 DLSS 5）。遊戲表現 NVIDIA 官方標稱 1440p 100 FPS。

### 記憶體與互連

統一記憶體（unified memory）128 GB LPDDR5X，最高 300 GB/s 記憶體頻寬。CPU 與 GPU 之間以 NVLink-C2C（chip-to-chip）互連，不走 PCIe。

### 製程

TSMC 3 nm EUV 晶圓代工。

統一記憶體這點對 AI 工作負載特別重要。CPU 與 GPU 共用同一個 128 GB pool，省掉了傳統獨顯架構必須在 PCIe 上來回搬資料的延遲與功耗，這是它能在筆電形態下跑 120B 模型的關鍵設計。

## 三、AI 算力與模型容量

NVIDIA 公布的核心數字：AI 算力 1 petaflop（10^15 FLOPS），可承載 120-billion 參數模型本地推論，context length 可達 100 萬 tokens，支援 agent 多步驟長 context 工作流。

對研究端的意義：120B 參數本地跑得動，意味著像 Llama 3 70B、Mixtral 8x22B、甚至更大的醫療專用 fine-tune 模型，都可以離線在一台筆電上推論。1 petaflop 在 2020 年是頂級資料中心節點的等級，現在能塞進筆電是製程、架構、FP4 精度三件事疊加的結果。

## 四、為什麼是 AI PC 而不是「再快一點的筆電」

RTX Spark 與一般高階遊戲筆電的本質差異在於作業系統介面層的重新定義。NVIDIA 與 Microsoft 把這次合作描述為「Windows for the age of personal AI」，三個技術層次的整合：

第一，本地 agent 執行。模型不上雲，agent 直接在本機跑，敏感資料不離開裝置。第二，agentic UI。作業系統介面從「使用者操作 app」轉向「使用者下指令、agent 操作 app」。第三，CUDA、TensorRT、DLSS 統一在一顆矽上。30 年的 NVIDIA AI 軟體堆疊第一次完整下放到 PC 端。

這個定位才是 AI PC 與「裝了 NPU 的筆電」的真正分水嶺。前者是運算範式的改變，後者只是多了一個加速器。

## 五、上市時程與合作夥伴

發貨時程訂在 2026 年 9 到 11 月（全球）。首波 OEM 包括 ASUS、Dell、HP、Lenovo、Microsoft Surface、MSI，第二波則有 Acer 與 GIGABYTE。產品型態以輕薄筆電（all-day battery）與小型桌機（compact desktop）為主。

ASUS 已宣布 ProArt P16、P14 與一款 Mini PC 採用 RTX Spark，HP 也已發布對應產品線。值得注意的是這些都是「創作加 AI」定位，不是純電競機。

## 六、實測 throughput：120B 模型在 GB10 上跑多快

NVIDIA 官方資料著重「能跑」而非「跑多快」，但社群已有對應 GB10 平台（DGX Spark，同樣的 GB10 Superchip）的實測數字可以參考。重點 benchmark 整理：

GPT-OSS 120B 在 batch 1 配置下測得 11.66 tokens/s [ref: LMSYS DGX Spark Review, 2025-10]。另有測試指出 120B 級模型在 DGX Spark 上 throughput 約 38.55 tokens/s（測試條件不同）[ref: IntuitionLabs DGX Spark Review]。70B 參數模型在 Q4 量化下大約 35 到 45 tps [ref: ProXPC DGX Spark vs 5090 Performance Test]。Qwen 2.5 72B 與 Llama 3.2 90B 在 GB10 上穩定維持約 4.6 tokens/s [ref: Medium "NVIDIA DGX Spark Mini AI Supercomputer overview"]。

換算到使用情境的解讀：11 到 12 tps 大約是「人類閱讀速度」的水平，互動體驗可接受但不算流暢。若處理 100 萬 token 級 context，第一個輸出 token 的等待時間可能達數秒，這是記憶體頻寬 300 GB/s 的物理上限決定的，不是軟體最佳化能解決的瓶頸 [ref: PANews "RTX Spark AI PCs are here"]。對照組是 3 張 RTX 3090（72 GB 總顯存、936 GB/s 頻寬），同樣 120B 模型可達 124 tok/s，約 3 倍速度，但是三卡電腦不可能裝進筆電。

結論是：RTX Spark 的設計目標是「在筆電形態下可以本地跑 120B 模型」，不是「比資料中心 GPU 跑得快」。研究者要根據 throughput 預期決定使用情境是 batch 推論還是即時互動。

## 七、對生醫工程 PhD 研究者的三個實務意涵

### 1. IRB 限制下的本地推論成為可行配置

很多臨床研究的 IRB 條件禁止把識別性醫療資料上傳雲端 LLM。在 RTX Spark 之前，這代表只能用較小的本地模型（7B 到 13B），效能與雲端 GPT-4 或 Claude 差距太大。RTX Spark 把 120B 拉到本地，意味著從 2026 Q4 開始，「離線跑接近雲端等級的醫療 LLM」變成預算內可行的選項。一台筆電就能符合 IRB 對「資料不離開裝置」的硬性條款。

### 2. 邊緣端臨床部署的新基線

過去把 AI 模型部署到診間或復健室，常常卡在「臨床端沒有資料中心、又不能用雲」。RTX Spark 的小型桌機形態（compact desktop）意味著一台機器就能在診間本地跑步態分析模型、醫療影像即時 segmentation、語音轉錄加 SOAP 自動草擬等多任務 agent。對 SaMD（軟體即醫材）申請而言，本地推論的稽核軌跡（audit trail）也比雲端更容易說明。

### 3. PhD 研究的訓練成本曲線會被改寫

128 GB 統一記憶體加 1 petaflop FP4 算力，足以在本地做中型模型（10 到 30B）的 LoRA 或 QLoRA fine-tune。對 PhD 學生而言，原本要排隊用實驗室 cluster 或租 H100 才能跑的微調實驗，2026 Q4 之後可能在自己桌上的 RTX Spark mini PC 就能跑完。這會壓縮研究週期，但也代表「會本地調模型」會從進階技能變成標配。

## 八、要留意的限制與保留意見

互動性 vs. 容量的取捨。120B 模型「跑得動」與「跑得即時」是兩件事。實測顯示 batch 1 約 11 tps，長 context 場景 throughput 還會降，互動體驗會明顯比雲端 GPT-4 慢。

Arm Windows 軟體生態仍在補齊。RTX Spark 走 Arm 路線，部分 x86-only 的傳統科研軟體（OpenSim、特定 MATLAB toolbox、舊版 LabVIEW 驅動）短期內可能要靠相容層執行，效能與穩定性需要實測驗證。

競爭格局未定。Intel 在 COMPUTEX 2026 同期推 Panther Lake，AMD 則加碼台灣百億投資。Windows AI PC 不會是 NVIDIA 一家獨佔，2027 之前生態系仍會有多套標準競合。

## 引用來源

NVIDIA 與 Microsoft 官方資料（廠商公開資料）：

[NVIDIA Newsroom | NVIDIA and Microsoft Reinvent Windows PCs for the Age of Personal AI](https://nvidianews.nvidia.com/news/nvidia-microsoft-windows-pcs-agents-rtx-spark)

[Windows Experience Blog | Introducing a powerful new chapter for Windows PCs, accelerated by NVIDIA RTX Spark](https://blogs.windows.com/windowsexperience/2026/05/31/introducing-a-powerful-new-chapter-for-windows-pcs-accelerated-by-nvidia-rtx-spark/)

[NVIDIA GeForce | NVIDIA at COMPUTEX 2026: RTX Spark, DLSS 4.5, RTX Updates](https://www.nvidia.com/en-us/geforce/news/computex-2026-nvidia-geforce-rtx-announcements/)

[ASUS Press Release | ProArt P16, P14 & Mini PC Powered by NVIDIA RTX Spark at Computex 2026](https://press.asus.com/news/press-releases/asus-proart-p16-p14-mini-pc-nvidia-rtx-spark-computex-2026/)

[HP Newsroom | HP Debuts PCs Built for Next Wave of Windows PC Experiences Powered by NVIDIA RTX Spark](https://www.hp.com/us-en/newsroom/press-releases/2026/computex.html)

第三方科技媒體現場報導與技術解析：

[Tom's Hardware | NVIDIA unveils RTX Spark Superchip at Computex 2026](https://www.tomshardware.com/laptops/nvidia-unveils-rtx-spark-superchip-at-computex-2026-new-platform-promises-to-turn-windows-into-an-agentic-ai-os-with-arm-cpu-blackwell-gpu-and-128gb-unified-memory)

[Tom's Hardware | RTX Spark Roadmap, Rubin then Rosa Feynman](https://www.tomshardware.com/pc-components/cpus/nvidia-unveils-dgx-sparrk-roadmap-for-laptops-and-desktop-pcs-at-computex-2026-three-generations-outlined-rubin-followed-by-rosa-feynman)

[TechPowerUp | NVIDIA Announces RTX Spark, a Supercomputer-grade Processor for Windows PCs](https://www.techpowerup.com/349554/nvidia-announces-rtx-spark-a-supercomputer-grade-processor-for-windows-pcs-with-agentic-user-interfaces)

[Engadget | NVIDIA's RTX Spark is an AI "superchip" that will power Windows laptops and desktops](https://www.engadget.com/2184558/nvidia-rtx-spark-chip-windows-pcs/)

[GSMArena | NVIDIA unveils RTX Spark with 20 cores, RTX 5070 GPU, 128GB RAM](https://www.gsmarena.com/nvidia_unveils_rtx_spark_computer_chip_with_up_to_20_cores_rtx_5070__128gb_ram-news-73061.php)

GB10 平台實測 benchmark 來源：

[LMSYS | NVIDIA DGX Spark In-Depth Review: A New Standard for Local AI Inference (2025-10)](https://www.lmsys.org/blog/2025-10-13-nvidia-dgx-spark/)

[IntuitionLabs | NVIDIA DGX Spark Review: Pros, Cons & Performance Benchmarks](https://intuitionlabs.ai/articles/nvidia-dgx-spark-review)

[ProXPC | NVIDIA DGX Spark (GB10) Performance test vs 5090: LLM, Image and Video generation](https://www.proxpc.com/blogs/nvidia-dgx-spark-gb10-performance-test-vs-5090-llm-image-and-video-generation)

[Medium (Robert McDermott) | NVIDIA DGX Spark Mini AI Supercomputer overview and review](https://robert-mcdermott.medium.com/the-nvidia-dgx-spark-0e2ca7833c2c)

[PANews | RTX Spark AI PCs are here, capable of locally powering 120B large models](https://www.panewslab.com/en/articles/019e81e4-5dbc-721c-8e3f-6ad4301a4058)

> 註：本整理為演講技術深入摘要用途，並非 AcadeBee 平台正式文章草稿。若要升級成 industry 類發文，建議補上 1 到 2 篇 IEEE 或 arXiv 同儕審查文獻（例如 unified memory architecture、Arm Windows 在 ML inference 上的實測 benchmark），並把 SaMD 與 IRB 影響拆成獨立段落延伸。
