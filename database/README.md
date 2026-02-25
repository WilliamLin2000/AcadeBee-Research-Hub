# 資料庫設計說明

## 開發順序建議

```
1. 資料庫 Schema (你現在在這裡)
       ↓
2. 後端 API (Python FastAPI 或 Node.js Express)
       ↓
3. 前端串接 API (替換 mock 資料)
```

## 實體關係 (ER 概念)

```
users (使用者)
  ├── 1:N → tasks (刊登的任務)
  ├── 1:N → bids (提出的報價)
  ├── 1:N → messages (發送的訊息)
  └── 1:N → reviews (給予的評價)

tasks (任務)
  ├── N:1 → users (刊登者)
  ├── N:1 → users (承接者 worker)
  ├── 1:N → task_skills (所需技能)
  ├── 1:N → bids (報價申請)
  ├── 1:N → messages (相關訊息)
  └── 1:N → reviews (評價)
```

## 主要表格說明

| 表格 | 用途 |
|------|------|
| `users` | 使用者帳號、機構、驗證狀態 |
| `tasks` | 任務基本資訊、預算、截止日、狀態 |
| `task_skills` | 任務所需技能 (一任務多技能) |
| `bids` | 接案者對任務的報價/申請 |
| `messages` | 需求方與接案者之間的訊息 |
| `reviews` | 任務完成後的評分與評論 |

## 使用方式

1. 安裝 PostgreSQL
2. 建立資料庫：`CREATE DATABASE academic_task_platform;`
3. 執行 schema：`psql -d academic_task_platform -f schema.sql`

## 後續擴充建議

- 金流紀錄表 (payments)
- 爭議申訴表 (disputes)
- 使用者收藏/關注任務 (favorites)
