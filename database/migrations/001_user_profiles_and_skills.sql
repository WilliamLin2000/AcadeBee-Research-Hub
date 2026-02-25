-- ============================================
-- 用戶帳號與身份設計：擴充 users、預設技能、user_skills
-- 執行方式：在 pgAdmin 對 academic_task_db 執行此檔，或：
--   psql -U postgres -d academic_task_db -f database/migrations/001_user_profiles_and_skills.sql
-- ============================================

-- 使用者表擴充：手機、驗證狀態、機構信箱標記、ORCID、學位驗證
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS institutional_email BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS orcid_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS degree_verified BOOLEAN DEFAULT FALSE;

-- 預設技能定義（精準媒合用，限制選擇）
CREATE TABLE IF NOT EXISTS skill_definitions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- 使用者的技能標籤（多對多，應用層以 skill_definitions 檢查合法名稱）
CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (user_id, skill_name)
);

-- 預設技能種子（可依需求再增減）
INSERT INTO skill_definitions (name) VALUES
  ('SPSS分析'),
  ('LaTeX排版'),
  ('生醫論文編修'),
  ('Python'),
  ('Pandas'),
  ('統計分析'),
  ('R'),
  ('Excel'),
  ('VBA'),
  ('數據清理'),
  ('影像標註'),
  ('醫學影像'),
  ('LabelMe'),
  ('迴歸分析'),
  ('程式設計'),
  ('數據分析'),
  ('數據標註')
ON CONFLICT (name) DO NOTHING;

-- 若 skill_definitions 有 FK，user_skills 要參考 name；若無 FK 可改為僅存字串
-- 上面已設 FK，故需先有 skill_definitions。若遇 FK 問題可改為：
-- ALTER TABLE user_skills DROP CONSTRAINT IF EXISTS user_skills_skill_name_fkey;
-- 並改為 CHECK 或僅應用層檢查
