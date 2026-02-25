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
