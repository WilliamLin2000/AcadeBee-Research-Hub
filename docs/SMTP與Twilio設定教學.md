# 驗證信設定教學

本平台支援兩種寄信方式：

- **Resend**（建議）：用 API 寄信，適合**雲端部署**（如 Render），免費額度約 3000 封/月。設定見 [Resend寄信設定.md](./Resend寄信設定.md)。
- **Gmail SMTP**：適合**本機開發**；在 Render 等雲端可能連線逾時。

以下為 Gmail SMTP 設定步驟（僅本機需用時可參考）。

---

## 一、Gmail SMTP（本機寄驗證信）

### 1. 開啟 Google 帳號兩步驟驗證

1. 開啟 [Google 帳戶](https://myaccount.google.com/) → **安全性**。
2. 在「登入 Google」區塊點 **兩步驟驗證**，依畫面完成設定（若已開啟可略過）。

### 2. 建立應用程式密碼

1. 在已登入 Google 的瀏覽器開啟：**[應用程式密碼頁面](https://myaccount.google.com/apppasswords)**（若選單裡找不到，用此直達連結最快）。
2. 選擇應用程式：**郵件**；裝置：**Windows 電腦**（或其它），按 **產生**。
3. 畫面上會顯示 **16 碼密碼**（如 `abcd efgh ijkl mnop`），請**複製下來**（可去掉空格成 `abcdefghijklmnop`）。

   **若開啟連結後顯示無法使用：** 可能是帳號啟用了「進階保護計畫」，或為學校/公司 Google 帳號被管理員關閉此功能，請改用個人 Gmail 或關閉進階保護。

### 3. 填寫 .env

在專案根目錄的 `.env` 新增或修改為（把值換成你的）：

```env
# 寄驗證信用（Gmail）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=你的Gmail信箱@gmail.com
SMTP_PASS=上一步產生的16碼應用程式密碼
MAIL_FROM=AcadeBee <你的Gmail信箱@gmail.com>
```

- `SMTP_USER`：用來登入 Gmail SMTP 的信箱（通常就是你的 Gmail）。
- `SMTP_PASS`：**必須是「應用程式密碼」**，不要用平常登入 Gmail 的密碼。
- `MAIL_FROM`：驗證信顯示的寄件者，可與 `SMTP_USER` 相同。

### 4. 重啟後端

儲存 `.env` 後，重新執行 `npm run server`，之後註冊或點「發送驗證碼至信箱」就會真的寄信到使用者信箱。

---

## 二、檢查是否生效

- 註冊新帳號或到個人資料頁點「發送驗證碼至信箱」，到該信箱收信（若沒收到可看垃圾信）。

若仍有問題，請檢查 `.env` 是否有打錯、多餘空格，以及後端終端機是否有錯誤訊息。
