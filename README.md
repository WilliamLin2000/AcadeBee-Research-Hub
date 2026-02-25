# 學術研究任務平台

學術研究人員可在此平台刊登研究需求（數據分析、數據清理、程式設計、數據標註等），或承接任務賺取外快。

## 技術棧

- **前端**: React 18 + Vite + React Router
- **後端**: 待實作 (建議 Python FastAPI)
- **資料庫**: PostgreSQL (Schema 已設計於 `database/`)

## 專案結構

```
academic-task-platform/
├── src/
│   ├── components/     # 共用元件 (Header, Layout, TaskCard)
│   ├── pages/          # 頁面元件
│   ├── data/           # Mock 資料 (之後替換為 API)
│   ├── App.jsx
│   └── main.jsx
├── database/
│   ├── schema.sql      # 資料庫 Schema
│   └── README.md       # 資料庫設計說明
├── index.html
├── package.json
└── vite.config.js
```

## 開發順序建議

1. **資料庫** → 設計 Schema（已完成）
2. **後端 API** → 實作 CRUD、認證
3. **前端串接** → 將 mock 資料替換為 API 呼叫

## 快速開始

```bash
cd academic-task-platform
npm install
npm run dev
```

瀏覽器開啟 http://localhost:5173

## 頁面一覽

| 路徑 | 說明 |
|------|------|
| `/` | 首頁、熱門任務、分類入口 |
| `/tasks` | 任務列表、搜尋、篩選 |
| `/tasks/:id` | 任務詳情 |
| `/tasks/new` | 刊登任務表單 |
| `/dashboard` | 我的儀表板（刊登/承接的任務） |
