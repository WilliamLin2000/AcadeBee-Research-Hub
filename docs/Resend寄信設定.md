# Resend 寄信設定（建議用於雲端部署）

本平台支援用 **Resend** 寄送驗證信。在 Render 等雲端主機上，Gmail SMTP 常會連線逾時，改用 Resend 的 API 可穩定寄信，且免費額度約 **3000 封/月**。

---

## 一、取得 API Key

1. 前往 [resend.com](https://resend.com) 註冊／登入。
2. 左側 **API Keys** → **Create API Key**，名稱自訂（例如 `AcadeBee`）。
3. 複製產生的金鑰（開頭為 `re_`），**只會顯示一次**，請妥善保存。

---

## 二、設定環境變數

### 本機（.env）

在專案根目錄的 `.env` 新增：

```env
RESEND_API_KEY=re_你複製的API金鑰
MAIL_FROM=AcadeBee <onboarding@resend.dev>
```

- **免費方案**寄件者請用 `onboarding@resend.dev`（Resend 提供），不需驗證網域。
- 若已驗證自己的網域，可改為 `AcadeBee <noreply@你的網域.com>`。

### 雲端（Render）

1. Render → 你的 **Backend 服務** → **Environment**。
2. 新增：
   - **Key**: `RESEND_API_KEY`
   - **Value**: 貼上你的 Resend API Key（`re_...`）
3. 若有自訂寄件者，可設 **MAIL_FROM**（否則會用 `AcadeBee <onboarding@resend.dev>`）。
4. 儲存後 **Redeploy** 後端。

---

## 三、優先順序

後端寄信邏輯為：

1. 若有設定 **RESEND_API_KEY** → 使用 Resend 寄信。
2. 否則若有設定 **SMTP_USER** + **SMTP_PASS** → 使用 Gmail SMTP（本機較適合）。
3. 都沒有 → 不寄信，驗證碼只會印在後端 log（開發用）。

雲端部署建議只設 **RESEND_API_KEY**（可不必設 SMTP），即可穩定寄出驗證信。

---

## 四、檢查是否生效

- 在註冊頁輸入信箱、點「發送驗證碼」，或到個人資料頁點「發送驗證碼至信箱」。
- 到該信箱收信（可先看垃圾信匣）。寄件者會顯示為 `AcadeBee <onboarding@resend.dev>` 或你設的 MAIL_FROM。

---

## 五、常見錯誤與排除

### 畫面顯示「發送失敗」或「無法連線至伺服器」

1. **本機開發時**  
   - 確認後端已啟動：在專案目錄執行 `npm run server`（預設 port 5000）。  
   - 確認前端有設 API 位址：在專案根目錄建立或編輯 `.env`，加入  
     `VITE_API_BASE_URL=http://localhost:5000`  
     （依你實際後端 port 修改）。重啟前端（`npm run dev`）後再試。

2. **雲端部署時**  
   - 確認 Render 後端的 **Environment** 已設 `RESEND_API_KEY` 且已 **Redeploy**。  
   - 確認前端的 **Vercel 環境變數** 有設 `VITE_API_BASE_URL` 指到 Render 後端網址（例如 `https://你的後端.onrender.com`）。

### 畫面顯示「寄送驗證信失敗：…」或後端回傳 detail

- 多為 **Resend API** 問題，請看 `detail` 內容：  
  - 若為 **domain / from** 相關：免費方案寄件者請用 `onboarding@resend.dev`；自訂網域需在 Resend 後台驗證後再設 `MAIL_FROM`。  
  - 若為 **rate limit**：稍後再試或升級方案。  
  - 若為 **invalid API key**：到 Resend 後台確認 API Key 正確並重新貼到 `RESEND_API_KEY`。

### 沒有錯誤但收不到信

- 先到信箱的**垃圾郵件**查看。  
- 使用 `onboarding@resend.dev` 時，Resend 免費方案**僅能寄給你在 Resend 帳號中設定的信箱**；要寄給任意使用者需在 Resend 驗證自己的網域並設定 MAIL_FROM。
