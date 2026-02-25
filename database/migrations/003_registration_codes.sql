-- ============================================
-- 註冊前驗證：暫存信箱與手機驗證碼（註冊時先驗證再建立帳號）
-- 執行方式：在 pgAdmin 對 academic_task_db 執行此檔
-- ============================================

CREATE TABLE IF NOT EXISTS registration_codes (
  email VARCHAR(255) PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  email_code VARCHAR(10) NOT NULL,
  email_code_expires TIMESTAMP NOT NULL,
  phone_code VARCHAR(10) NOT NULL,
  phone_code_expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
