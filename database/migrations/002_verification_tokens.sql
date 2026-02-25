-- ============================================
-- 信箱驗證與簡訊驗證：token / 驗證碼欄位
-- 執行方式：在 pgAdmin 對 academic_task_db 執行此檔
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_expires TIMESTAMP;
