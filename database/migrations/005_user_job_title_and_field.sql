-- ============================================
-- 使用者新增：職稱、領域（註冊必填用）
-- 執行方式：在 pgAdmin 對 academic_task_db 執行此檔
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS field VARCHAR(150);
