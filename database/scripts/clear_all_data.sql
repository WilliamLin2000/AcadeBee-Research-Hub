-- ============================================
-- 清除 academic_task_db 內「所有資料」（不刪表結構）
-- 執行方式：在 pgAdmin 對 academic_task_db 開啟 Query Tool，執行此檔
-- 注意：此操作無法復原，請確認後再執行
-- ============================================

-- 依外鍵順序刪除，避免違反 FK
DELETE FROM reviews;
DELETE FROM messages;
DELETE FROM bids;
DELETE FROM task_skills;
DELETE FROM user_skills;
DELETE FROM tasks;
DELETE FROM users;

-- 註冊驗證暫存（僅在該表存在時刪除，未執行 003 也不會報錯）
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'registration_codes') THEN
    DELETE FROM registration_codes;
  END IF;
END $$;

-- 若使用 SERIAL 的 id 要從 1 重新開始，可執行（選用）：
-- ALTER SEQUENCE task_skills_id_seq RESTART WITH 1;
