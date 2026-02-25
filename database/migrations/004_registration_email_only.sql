-- ============================================
-- 改為僅信箱驗證：phone / phone_code 改為選填（nullable）
-- 執行方式：在 pgAdmin 對 academic_task_db 執行此檔
-- ============================================

ALTER TABLE registration_codes ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE registration_codes ALTER COLUMN phone_code DROP NOT NULL;
ALTER TABLE registration_codes ALTER COLUMN phone_code_expires DROP NOT NULL;
