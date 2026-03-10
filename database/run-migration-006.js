/**
 * 執行 migration 006：建立 task_favorites 表
 * 用法：在專案根目錄執行
 *   set DATABASE_URL=你的連線字串
 *   node database/run-migration-006.js
 * 或直接：
 *   node database/run-migration-006.js
 * （會讀取 .env 的 DATABASE_URL，或可傳入環境變數）
 */
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('請設定 DATABASE_URL 環境變數（或 .env）')
  process.exit(1)
}

const sql = `
CREATE TABLE IF NOT EXISTS task_favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, task_id)
);
`

async function run() {
  const client = new pg.Client({ connectionString })
  try {
    await client.connect()
    await client.query(sql)
    console.log('task_favorites 表已建立成功')
  } catch (err) {
    console.error('執行失敗:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
