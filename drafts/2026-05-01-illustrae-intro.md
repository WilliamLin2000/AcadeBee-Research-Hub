---
id: illustrae-intro
category: community
title: Illustrae 試用筆記：AI 學術插畫平台到底能不能幫研究生省掉一個下午
excerpt: 學術圖製作這件事，過去十年大家都在 PowerPoint、Inkscape、Adobe Illustrator、BioRender 之間來回。最近我自己默默開始試 Illustrae 這個 2025 年才上線的 AI 學術插畫平台，這篇整理它的核心流程、適合哪種使用情境，以及目前我還沒搞清楚的幾個問題——一起討論。
publishedAt: 2026-05-01
readingTime: 7 分鐘
featured: false
sources:
  - title: Illustrae 官方首頁
    url: https://illustrae.co/
    tier: primary
    note: 平台官方資訊，本文的功能描述以此為主要根據
  - title: Illustrae Blog · 7 Best AI Scientific Illustration Software Tools for Researchers in 2025
    url: https://illustrae.co/blog/ai-scientific-illustration-software
    tier: supplementary
    note: 廠商自家文章，僅作為平台定位的背景資料
  - title: Illustrae Blog · How To Make A Standout Graphical Abstract (2026 Step-By-Step Guide)
    url: https://illustrae.co/blog/how-to-make-graphical-abstract
    tier: supplementary
    note: 廠商自家教學文章，引用其工作流程描述
---

## 一、先講清楚這篇的範圍

我自己對 Illustrae 還只是默默試過幾次的階段，**不是長期重度使用者**，所以這篇不會寫成「半年使用心得」那種文章。我的目的是：

1. 把這個平台**做什麼**講清楚，讓還沒看過的人有具體想像
2. 整理它的**典型使用流程**，讓有興趣的人知道從哪開始
3. 老實列出**目前我自己也還沒搞清楚的問題**——歡迎用過更深的人在社群留言補充

如果你想看「Illustrae vs BioRender vs Adobe Illustrator 全面評比」那種文，這篇不是 [ref: 進階比較需要更深入的長期使用，我目前資歷不到]。

## 二、Illustrae 是什麼

Illustrae 是 2025 年 5 月上線的 AI 學術插畫平台 [ref: 上線時間取自 Illustrae 官方相關報導；準確日期請以官網為主]，核心定位是「**讓沒設計背景的研究者也能在短時間內產出 publication-ready 的學術視覺**」。

根據官方公開資訊，它做的事情主要分兩塊：

**(1) AI 生成單一視覺元素**
你輸入一個科學概念敘述（例如「a neuron firing」「the cell cycle」），平台會在約一分鐘內產出一張根據科學慣例繪製的插圖 [ref: https://illustrae.co/]。這跟 DALL-E / Midjourney 那種泛用 AI 圖像生成器不同——它的訓練 / 提示限制在學術視覺範式內，理論上比較不會生出科學上錯誤的東西（例如把 DNA 畫反、神經元方向錯誤）。

**(2) 智慧畫布（Intelligent Canvas）做多面板組圖**
畫布上有 frames、arrows、textboxes、live embed links 這些元素 [ref: https://illustrae.co/]，目的是讓你把一張張單元素插圖**組合**成 graphical abstract 或多 panel figure，而不只是停在「生一張漂亮的單圖」。

這兩塊加起來，最常見的用途就是論文投稿前要交的 **graphical abstract**——這也是 Illustrae 自己 blog 的主推使用情境 [ref: https://illustrae.co/blog/how-to-make-graphical-abstract]。

## 三、典型使用流程（演示）

> **以下流程是根據 Illustrae 官方部落格教學整理 [ref: https://illustrae.co/blog/how-to-make-graphical-abstract]，加上我自己試的觀察。具體 UI 名稱、按鈕位置以實際登入後為準。**

**Step 1 — 開新專案，選對應 journal / conference 模板**

Illustrae 提供針對特定期刊 / 研討會的圖規格模板（例如 Cell、Nature 系列要求的長寬比、解析度）[ref: 官方描述]。如果你的目標期刊有提供，直接套版會省掉一個調規格的步驟。

**Step 2 — 用 AI 生成基本元件**

在畫布上叫出 AI 生成功能，輸入英文敘述，例如：
- `a single mitochondrion in cross section`
- `a Western blot with three lanes`
- `a generic mouse in side view`

平台會產出向量化的科學插圖，**據官方說法**約一分鐘內 [ref: https://illustrae.co/]。我自己試的時候**速度差不多**，但插圖品質會跟提示詞細節高度相關——這跟一般 AI 圖像工具一樣，「a neuron」會比「a CA1 pyramidal neuron with apical dendrite extending into stratum lacunosum-moleculare」產出的東西粗糙很多。

**Step 3 — 在 Intelligent Canvas 組裝**

拉幾個 frame 標出 panel A、B、C，把生成的元件擺進去，用 arrows 把因果或時序關係串起來，textboxes 加 figure caption 跟標籤。

**Step 4 — 匯出**

匯出成 PDF / PNG / SVG，丟去投稿系統。**我目前還沒測完匯出的解析度跟向量格式品質**，這部分需要實際投稿才知道有沒有踩坑——歡迎用過的研究者在社群分享經驗。

## 四、跟 BioRender 比，差在哪

我刻意不寫「全面比較」，但有兩個切面值得提：

**(1) BioRender 是「素材庫導向」、Illustrae 是「AI 生成導向」**
BioRender 的核心是十幾萬個預製科學圖示，你拼貼即可；Illustrae 是你描述、AI 生 [ref: 兩平台官方定位差異]。前者品質穩定但受限於既有素材；後者彈性高但仰賴提示詞品質。

**(2) Illustrae 沒有免費方案**
根據官方公開資訊，Illustrae 沒有 free tier，全部訂閱制 [ref: https://illustrae.co/]。BioRender 有教育免費版（圖會帶浮水印）。**對學生 / 自費的研究生來說這是個門檻**，要不要付得看你產 graphical abstract 的頻率。

## 五、我目前還沒搞清楚的問題（誠實清單）

寫這篇之前我特地列了一份「我說不出來的問題」，分享給大家——歡迎用過的研究者在社群討論：

1. **匯出向量檔（SVG）的品質如何？** 學術圖最後常需要在 Illustrator / Inkscape 微調，向量品質會直接影響可用性。
2. **AI 生成的視覺如果出現科學錯誤（例如生化路徑方向反了），平台有沒有審核機制？** 還是完全靠使用者自己抓？
3. **跟學術期刊的「AI 工具揭露」要求怎麼配合？** 越來越多期刊要求作者揭露用過哪些 AI 工具產內容，Illustrae 是否有提供 metadata 或 audit log 可以附在投稿信裡？
4. **訂閱費實際是多少？** 我搜的時候第三方網站的價格都不一致，得自己進去看才準 `[待補引用]`。
5. **一張 graphical abstract 從零做完平均花多久？** 這個只有自己做完才知道。

## 六、總結：我覺得誰會從這個工具受益

根據目前的使用初印象，我會把這個工具推薦給三類人：

- **要交 graphical abstract 但沒設計背景的博士生 / 博後**——能比 PowerPoint 拼貼快，比學 Illustrator 省時間
- **不打算長期養 BioRender 訂閱、但偶爾要做學術海報 / 簡報插圖的研究者**
- **想試試看 AI 生成在自己領域有沒有用的人**——當作一種新工具的低風險入口

不適合：
- 學術插畫已經是工作流程一部分、有自己一套成熟 toolchain 的人（換工具沒效益）
- 預算非常緊、需要免費方案的學生

---

**社群討論**：你用過 Illustrae 嗎？匯出品質如何？跟你原本的工具流程怎麼整合？歡迎在 FB 學術研究社群留言，我也想多聽。

---

**[William 審稿筆記]**
- 第三節「Step 2 我自己試的時候速度差不多」這句是基於你說「默默試過」推測，如果不對請改。
- 第五節「誠實清單」是給社群討論用的引子，如果你已經知道某幾題答案請補上去。
- 標題若覺得太長，可改：「Illustrae 試用筆記：AI 怎麼幫研究生省掉一個下午的圖」。
- 引用第 4 點「訂閱費」標 `[待補引用]`，等你登入後可以親自確認價格再補。
