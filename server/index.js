import crypto from 'crypto'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import pkg from 'pg'
import { getAcademicFieldLabelBySlug } from '../src/data/academicFields.js'

dotenv.config()

const { Pool } = pkg

const app = express()
const port = process.env.PORT || 5000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// 將已過期的 open 任務標記為 expired（避免未設定排程時狀態不更新）
async function expireOpenTasks(clientOrPool = pool) {
  try {
    await clientOrPool.query(
      `UPDATE tasks
       SET status = 'expired', updated_at = CURRENT_TIMESTAMP
       WHERE status = 'open' AND deadline < CURRENT_DATE`,
    )
  } catch (err) {
    console.warn('Expire tasks failed (non-critical):', err.message)
  }
}

// 新增期限提醒狀態欄位（若尚未存在）
async function ensureTaskDeadlineReminderColumns(clientOrPool = pool) {
  try {
    await clientOrPool.query(`
      ALTER TABLE tasks
        ADD COLUMN IF NOT EXISTS deadline_reminder_1d_sent BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS deadline_reminder_due_sent BOOLEAN DEFAULT FALSE
    `)
  } catch (err) {
    console.warn('Ensure deadline reminder columns failed (non-critical):', err.message)
  }
}

// 新增「平台聲明同意」欄位（若尚未存在）
async function ensurePaymentPolicyConsentColumns(clientOrPool = pool) {
  try {
    await clientOrPool.query(`
      ALTER TABLE tasks
        ADD COLUMN IF NOT EXISTS publisher_terms_accepted BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS publisher_terms_accepted_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS publisher_terms_policy_version VARCHAR(50);

      ALTER TABLE bids
        ADD COLUMN IF NOT EXISTS bidder_terms_accepted BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS bidder_terms_accepted_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS bidder_terms_policy_version VARCHAR(50),
        ADD COLUMN IF NOT EXISTS publisher_terms_accepted BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS publisher_terms_accepted_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS publisher_terms_policy_version VARCHAR(50);
    `)
  } catch (err) {
    console.warn('Ensure payment policy consent columns failed (non-critical):', err.message)
  }
}

// 寄送「到期前一天」與「到期當天」通知（避免重複寄送）
async function sendDeadlineReminders(clientOrPool = pool) {
  try {
    await ensureTaskDeadlineReminderColumns(clientOrPool)

    // 1) 到期前一天（deadline = 明天）
    const tomorrowRows = await clientOrPool.query(
      `SELECT
         t.id AS task_id,
         t.title,
         t.deadline,
         pub.email AS publisher_email,
         pub.display_name AS publisher_name
       FROM tasks t
       JOIN users pub ON pub.id = t.publisher_id
       WHERE t.status = 'open'
         AND t.deadline = (CURRENT_DATE + INTERVAL '1 day')::date
         AND COALESCE(t.deadline_reminder_1d_sent, FALSE) = FALSE`,
    )

    for (const row of tomorrowRows.rows) {
      try {
        if (row.publisher_email) {
          await sendEmail({
            to: row.publisher_email,
            subject: '[AcadeBee] 任務即將到期（明天截止）',
            text: `您好${row.publisher_name ? ` ${row.publisher_name}` : ''}，\n\n您的任務「${row.title}」將於明天（${row.deadline}）截止。\n\n請登入平台查看任務詳情。`,
          })
        }
        await clientOrPool.query(
          `UPDATE tasks SET deadline_reminder_1d_sent = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [row.task_id],
        )
      } catch (mailErr) {
        console.warn('Send 1-day reminder failed (non-critical):', mailErr.message)
      }
    }

    // 2) 到期當天（deadline = 今天）
    const dueRows = await clientOrPool.query(
      `SELECT
         t.id AS task_id,
         t.title,
         t.deadline,
         pub.email AS publisher_email,
         pub.display_name AS publisher_name
       FROM tasks t
       JOIN users pub ON pub.id = t.publisher_id
       WHERE t.status = 'open'
         AND t.deadline = CURRENT_DATE
         AND COALESCE(t.deadline_reminder_due_sent, FALSE) = FALSE`,
    )

    for (const row of dueRows.rows) {
      try {
        if (row.publisher_email) {
          await sendEmail({
            to: row.publisher_email,
            subject: '[AcadeBee] 任務到期通知（今天截止）',
            text: `您好${row.publisher_name ? ` ${row.publisher_name}` : ''}，\n\n您的任務「${row.title}」今天（${row.deadline}）截止。\n\n請登入平台查看任務詳情。`,
          })
        }
        await clientOrPool.query(
          `UPDATE tasks SET deadline_reminder_due_sent = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [row.task_id],
        )
      } catch (mailErr) {
        console.warn('Send due reminder failed (non-critical):', mailErr.message)
      }
    }
  } catch (err) {
    console.warn('Send deadline reminders failed (non-critical):', err.message)
  }
}

// 學術信箱後綴：僅允許以下網域註冊，之後可擴充（如 .edu.tw、.ac.uk）
const ALLOWED_ACADEMIC_SUFFIXES = ['.edu']

function isAllowedAcademicEmail(email) {
  const domain = (email || '').trim().split('@')[1] || ''
  const lower = domain.toLowerCase()
  return ALLOWED_ACADEMIC_SUFFIXES.some((suffix) => lower.endsWith(suffix))
}

app.use(cors())
app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok' })
  } catch (err) {
    console.error('Health check failed:', err)
    res.status(500).json({ status: 'error' })
  }
})

app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name FROM skill_definitions ORDER BY name',
    )
    const list = result.rows.map((r) => r.name)
    res.json(list)
  } catch (err) {
    if (err.code === '42P01') {
      return res.json([])
    }
    console.error('Error fetching skills:', err)
    res.status(500).json({ error: '取得技能列表失敗' })
  }
})

// 註冊前先發送「信箱」驗證碼（僅 6 碼寄至信箱），驗證通過後才可建立帳號
app.post('/api/send-registration-codes', async (req, res) => {
  const { email } = req.body || {}
  const emailTrim = (email || '').trim()

  if (!emailTrim) {
    return res.status(400).json({ error: '請填寫電子信箱' })
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [emailTrim],
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: '此 Email 已註冊過，請直接登入' })
    }

    const emailCode = String(crypto.randomInt(100000, 999999))
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 分鐘

    await pool.query(
      `INSERT INTO registration_codes (email, phone, email_code, email_code_expires, phone_code, phone_code_expires)
       VALUES ($1, NULL, $2, $3, NULL, NULL)
       ON CONFLICT (email) DO UPDATE SET
         email_code = $2,
         email_code_expires = $3,
         phone = NULL,
         phone_code = NULL,
         phone_code_expires = NULL`,
      [emailTrim, emailCode, expires],
    )

    const sent = await sendEmail({
      to: emailTrim,
      subject: '[AcadeBee] 註冊驗證碼',
      text: `您的註冊驗證碼：${emailCode}，10 分鐘內有效。\n\n若您未申請註冊，請忽略此信。`,
      html: `<p>您的註冊驗證碼：<strong>${emailCode}</strong></p><p>10 分鐘內有效。</p><p>若您未申請註冊，請忽略此信。</p>`,
    })
    if (!sent) console.log('[開發] 信箱驗證碼：', emailCode)

    res.json({
      message: '驗證碼已寄至您的信箱，請在 10 分鐘內於下方輸入 6 碼，並填寫其餘資料完成註冊。',
    })
  } catch (err) {
    if (err.code === '42P01') {
      return res.status(500).json({
        error: '請先執行 database/migrations/003_registration_codes.sql',
      })
    }
    if (err.code === '23502') {
      return res.status(500).json({
        error: '請先執行 database/migrations/004_registration_email_only.sql 將 phone 改為選填',
      })
    }
    console.error('Error sending registration codes:', err)
    res.status(500).json({ error: '發送驗證碼時發生錯誤，請稍後再試' })
  }
})

app.post('/api/register', async (req, res) => {
  const {
    name,
    email,
    password,
    institution,
    phone,
    orcid_id,
    skills,
    emailCode,
    job_title: jobTitle,
    field: fieldName,
  } = req.body || {}

  const emailTrim = (email || '').trim()
  const phoneTrim = (phone || '').trim() || null
  const institutionTrim = (institution || '').trim() || null
  const orcidTrim = (orcid_id || '').trim() || null
  const jobTitleTrim = (jobTitle || '').trim() || null
  const fieldTrim = (fieldName || '').trim() || null

  if (!emailTrim || !password) {
    return res.status(400).json({ error: 'Email 和密碼為必填' })
  }
  if (!name || !(name.trim())) {
    return res.status(400).json({ error: '請填寫真實姓名或暱稱' })
  }
  if (!institutionTrim) {
    return res.status(400).json({ error: '請填寫學校／機構名稱' })
  }
  if (!orcidTrim) {
    return res.status(400).json({ error: '請填寫 ORCID ID' })
  }
  if (!jobTitleTrim) {
    return res.status(400).json({ error: '請填寫職稱' })
  }
  if (!fieldTrim) {
    return res.status(400).json({ error: '請填寫領域' })
  }
  if (!emailCode || !String(emailCode).trim()) {
    return res.status(400).json({ error: '請先取得並輸入信箱的 6 碼驗證碼' })
  }

  try {
    const codeRow = await pool.query(
      'SELECT email, email_code, email_code_expires FROM registration_codes WHERE email = $1',
      [emailTrim],
    )
    if (codeRow.rows.length === 0) {
      return res.status(400).json({ error: '請先點擊「發送驗證碼」取得 6 碼後再註冊' })
    }
    const row = codeRow.rows[0]
    if (row.email_code !== String(emailCode).trim()) {
      return res.status(400).json({ error: '信箱驗證碼錯誤' })
    }
    if (new Date(row.email_code_expires) < new Date()) {
      return res.status(400).json({ error: '信箱驗證碼已過期，請重新取得' })
    }

    const institutional = isAllowedAcademicEmail(emailTrim)
    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (
         email, password_hash, display_name, institution,
         phone, phone_verified, email_verified, institutional_email,
         orcid_id, degree_verified, job_title, field
       )
       VALUES ($1, $2, $3, $4, $5, FALSE, TRUE, $6, $7, FALSE, $8, $9)
       RETURNING id, email, display_name, institution, created_at,
                 phone, institutional_email, email_verified, orcid_id, degree_verified, job_title, field`,
      [
        emailTrim,
        passwordHash,
        (name || '').trim(),
        institutionTrim,
        phoneTrim,
        institutional,
        orcidTrim,
        jobTitleTrim,
        fieldTrim,
      ],
    )

    const user = result.rows[0]
    const skillList = Array.isArray(skills)
      ? skills.filter((s) => s && String(s).trim())
      : []

    if (skillList.length > 0) {
      await pool.query(
        `INSERT INTO user_skills (user_id, skill_name)
         SELECT $1::uuid, unnest($2::text[])`,
        [user.id, skillList],
      )
    }

    await pool.query('DELETE FROM registration_codes WHERE email = $1', [emailTrim])

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.display_name,
      institution: user.institution,
      createdAt: user.created_at,
      phone: user.phone,
      institutionalEmail: user.institutional_email,
      emailVerified: true,
      phoneVerified: false,
      orcidId: user.orcid_id,
      degreeVerified: user.degree_verified,
      jobTitle: user.job_title,
      field: user.field,
    })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: '這個 Email 已經被註冊過了' })
    }
    console.error('Error during register:', err)
    if (err.code === '42P01' || err.code === '42703') {
      return res.status(500).json({
        error:
          '資料庫尚未更新。請依序執行 database/migrations/001_user_profiles_and_skills.sql 與 005_user_job_title_and_field.sql',
      })
    }

    res.status(500).json({ error: '伺服器錯誤，請稍後再試' })
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email 和密碼為必填' })
  }

  try {
    const result = await pool.query(
      `SELECT id, email, password_hash, display_name, institution, created_at,
              COALESCE(phone, '') AS phone,
              COALESCE(institutional_email, FALSE) AS institutional_email,
              COALESCE(email_verified, FALSE) AS email_verified,
              COALESCE(degree_verified, FALSE) AS degree_verified,
              orcid_id, job_title, field
       FROM users
       WHERE email = $1`,
      [email],
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email 或密碼不正確' })
    }

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password_hash)

    if (!match) {
      return res.status(401).json({ error: 'Email 或密碼不正確' })
    }

    let skills = []
    try {
      const sk = await pool.query(
        'SELECT skill_name FROM user_skills WHERE user_id = $1',
        [user.id],
      )
      skills = sk.rows.map((r) => r.skill_name)
    } catch {
      // user_skills 表可能尚未建立
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.display_name,
      institution: user.institution,
      createdAt: user.created_at,
      phone: user.phone,
      institutionalEmail: user.institutional_email,
      emailVerified: user.email_verified,
      degreeVerified: user.degree_verified,
      orcidId: user.orcid_id,
      jobTitle: user.job_title,
      field: user.field,
      skills,
    })
  } catch (err) {
    console.error('Error during login:', err)
    res.status(500).json({ error: '伺服器錯誤，請稍後再試' })
  }
})

// ---------- 信箱驗證 ----------
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const resendClient = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

function getMailTransporter() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

/** 寄信：優先 Resend（雲端穩定），其次 SMTP（本機），都沒有則只 log */
async function sendEmail({ to, subject, text, html }) {
  const from = process.env.MAIL_FROM || 'AcadeBee <onboarding@resend.dev>'
  if (resendClient) {
    const { error } = await resendClient.emails.send({
      from: from.includes('<') ? from : `AcadeBee <${from}>`,
      to: [to],
      subject,
      html: html || text?.replace(/\n/g, '<br>') || '',
    })
    if (error) throw new Error(error.message)
    return true
  }
  const transporter = getMailTransporter()
  if (transporter) {
    await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text, html })
    return true
  }
  console.log('[開發] 未設定 Resend 或 SMTP，驗證信內容：', { to, subject, text: text?.slice(0, 80) })
  return false
}

// 寄出驗證信（內含 6 碼驗證碼，與常見網站做法相同）
app.post('/api/send-verification-email', async (req, res) => {
  const { userId } = req.body || {}
  if (!userId) {
    return res.status(400).json({ error: '請提供 userId' })
  }

  try {
    const userResult = await pool.query(
      'SELECT id, email, display_name, email_verified FROM users WHERE id = $1',
      [userId],
    )
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到使用者' })
    }
    const user = userResult.rows[0]
    if (user.email_verified) {
      return res.status(400).json({ error: '此信箱已驗證' })
    }

    const code = String(crypto.randomInt(100000, 999999))
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 分鐘

    await pool.query(
      `UPDATE users
       SET email_verification_token = $1, email_verification_expires = $2
       WHERE id = $3`,
      [code, expires, userId],
    )

    let sent = false
    try {
      sent = await sendEmail({
        to: user.email,
        subject: '[AcadeBee] 您的信箱驗證碼',
        text: `您好${user.display_name ? ` ${user.display_name}` : ''}，您的驗證碼：${code}，10 分鐘內有效。請至網站個人資料頁輸入此驗證碼完成驗證。\n\n若您未申請驗證，請忽略此信。`,
        html: `<p>您好${user.display_name ? ` ${user.display_name}` : ''}，</p><p>您的驗證碼：<strong>${code}</strong></p><p>10 分鐘內有效，請至網站個人資料頁輸入此驗證碼完成驗證。</p><p>若您未申請驗證，請忽略此信。</p>`,
      })
    } catch (mailErr) {
      console.error('Send email error:', mailErr)
      return res.status(500).json({
        error: '寄送驗證信失敗',
        detail: mailErr.message || String(mailErr),
      })
    }
    if (!sent) console.log('[開發] 信箱驗證碼：', code)

    res.json({
      message: sent
        ? '驗證碼已寄至您的信箱，請在 10 分鐘內於下方輸入 6 碼完成驗證。'
        : '驗證碼已產生（開發模式未寄信），請至主機 log 查看 6 碼。',
    })
  } catch (err) {
    console.error('Error sending verification email:', err)
    res.status(500).json({
      error: '寄送驗證信時發生錯誤，請稍後再試',
      detail: err.message || String(err),
    })
  }
})

// 輸入 6 碼完成信箱驗證
app.post('/api/verify-email', async (req, res) => {
  const { userId, code } = req.body || {}
  if (!userId || !code) {
    return res.status(400).json({ error: '請提供 userId 與驗證碼' })
  }

  try {
    const result = await pool.query(
      `SELECT id, email_verification_token, email_verification_expires
       FROM users WHERE id = $1`,
      [userId],
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到使用者' })
    }
    const row = result.rows[0]
    if (!row.email_verification_token) {
      return res.status(400).json({ error: '請先取得驗證碼' })
    }
    if (row.email_verification_token !== String(code).trim()) {
      return res.status(400).json({ error: '驗證碼錯誤' })
    }
    if (
      !row.email_verification_expires ||
      new Date(row.email_verification_expires) < new Date()
    ) {
      return res.status(400).json({ error: '驗證碼已過期，請重新取得' })
    }

    await pool.query(
      `UPDATE users
       SET email_verified = TRUE,
           email_verification_token = NULL,
           email_verification_expires = NULL
       WHERE id = $1`,
      [userId],
    )

    res.json({ message: '信箱驗證成功' })
  } catch (err) {
    console.error('Error verifying email:', err)
    res.status(500).json({ error: '驗證時發生錯誤' })
  }
})

// 保留：點擊舊版驗證連結時仍可驗證（連結內為 6 碼時也適用）
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query
  if (!token) {
    return res.status(400).json({ error: '缺少驗證碼' })
  }

  try {
    const result = await pool.query(
      `SELECT id, email_verification_expires FROM users
       WHERE email_verification_token = $1`,
      [String(token).trim()],
    )
    if (result.rows.length === 0) {
      return res.status(400).json({ error: '驗證碼無效或已使用' })
    }
    const user = result.rows[0]
    if (
      !user.email_verification_expires ||
      new Date(user.email_verification_expires) < new Date()
    ) {
      return res.status(400).json({ error: '驗證碼已過期，請重新申請' })
    }

    await pool.query(
      `UPDATE users
       SET email_verified = TRUE,
           email_verification_token = NULL,
           email_verification_expires = NULL
       WHERE id = $1`,
      [user.id],
    )

    res.json({ message: '信箱驗證成功' })
  } catch (err) {
    console.error('Error verifying email:', err)
    res.status(500).json({ error: '驗證時發生錯誤' })
  }
})

app.post('/api/tasks', async (req, res) => {
  const {
    title,
    category,
    budget,
    deadline,
    description,
    skills,
    publisherId,
    publisherTermsAccepted,
    publisherTermsPolicyVersion,
  } = req.body || {}

  if (!publisherId) {
    return res.status(401).json({ error: '請先登入後再刊登任務' })
  }

  if (!title || !category || !budget || !deadline || !description) {
    return res.status(400).json({ error: '請填寫所有必填欄位' })
  }

  if (!publisherTermsAccepted) {
    return res.status(400).json({ error: '請先閱讀並同意平台聲明書' })
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const taskResult = await client.query(
      `INSERT INTO tasks (publisher_id, title, category, description, budget, deadline, status,
                           publisher_terms_accepted, publisher_terms_accepted_at, publisher_terms_policy_version)
       VALUES ($1, $2, $3, $4, $5, $6, 'open',
               $7, CURRENT_TIMESTAMP, $8)
       RETURNING id, publisher_id, title, category, description, budget, deadline, status, created_at`,
      [publisherId, title, category, description, budget, deadline, publisherTermsAccepted, publisherTermsPolicyVersion],
    )

    const task = taskResult.rows[0]

    const skillNames =
      typeof skills === 'string'
        ? skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(skills)
          ? skills
          : []

    if (skillNames.length > 0) {
      const values = []
      const params = []
      let paramIndex = 1

      skillNames.forEach((skillName) => {
        values.push(`($1, $${paramIndex + 1})`)
        params.push(skillName)
        paramIndex += 1
      })

      await client.query(
        `INSERT INTO task_skills (task_id, skill_name)
         VALUES ${values.join(', ')}`,
        [task.id, ...params],
      )
    }

    await client.query('COMMIT')

    res.status(201).json({
      id: task.id,
      publisherId: task.publisher_id,
      title: task.title,
      category: task.category,
      description: task.description,
      budget: task.budget,
      deadline: task.deadline,
      status: task.status,
      createdAt: task.created_at,
      skills: skillNames,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error creating task:', err)
    res.status(500).json({ error: '刊登任務時發生錯誤，請稍後再試' })
  } finally {
    client.release()
  }
})

app.get('/api/tasks', async (req, res) => {
  const { category, field, search, budgetMin, budgetMax, userId, includeAll } = req.query
  try {
    await expireOpenTasks(pool)
    await sendDeadlineReminders(pool)
    let query = `
      SELECT
        t.id,
        t.publisher_id,
        t.title,
        t.category,
        t.description,
        t.budget,
        TO_CHAR(t.deadline, 'YYYY-MM-DD') AS deadline,
        t.status,
        t.worker_id,
        t.created_at,
        CASE
          WHEN $1::uuid IS NOT NULL THEN EXISTS (
            SELECT 1 FROM task_favorites f
            WHERE f.task_id = t.id AND f.user_id = $1::uuid
          )
          ELSE FALSE
        END AS is_favorite,
        COALESCE(
          ARRAY_AGG(ts.skill_name) FILTER (WHERE ts.skill_name IS NOT NULL),
          '{}'
        ) AS skills
      FROM tasks t
      LEFT JOIN task_skills ts ON ts.task_id = t.id
      WHERE 1=1`
    const params = [userId || null]
    let paramIndex = 2

    // 預設只顯示可承接的任務（open）；需要看全部狀態可帶 includeAll=1
    if (!includeAll || String(includeAll) !== '1') {
      query += ` AND t.status = 'open'`
    }

    if (category) {
      query += ` AND t.category = $${paramIndex}`
      params.push(category)
      paramIndex += 1
    }
    if (field && String(field).trim()) {
      const fieldLabel = getAcademicFieldLabelBySlug(String(field).trim())
      if (fieldLabel) {
        query += ` AND EXISTS (
          SELECT 1 FROM task_skills ts_discipline
          WHERE ts_discipline.task_id = t.id AND ts_discipline.skill_name = $${paramIndex}
        )`
        params.push(fieldLabel)
        paramIndex += 1
      }
    }
    if (search && search.trim()) {
      query += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`
      params.push(`%${search.trim()}%`)
      paramIndex += 1
    }
    if (budgetMin !== undefined && budgetMin !== '') {
      const min = parseInt(budgetMin, 10)
      if (!Number.isNaN(min)) {
        query += ` AND t.budget >= $${paramIndex}`
        params.push(min)
        paramIndex += 1
      }
    }
    if (budgetMax !== undefined && budgetMax !== '') {
      const max = parseInt(budgetMax, 10)
      if (!Number.isNaN(max)) {
        query += ` AND t.budget <= $${paramIndex}`
        params.push(max)
        paramIndex += 1
      }
    }

    query += ` GROUP BY t.id ORDER BY t.created_at DESC`

    const result = await pool.query(query, params)

    const tasks = result.rows.map((row) => ({
      id: row.id,
      publisherId: row.publisher_id,
      title: row.title,
      category: row.category,
      description: row.description,
      budget: row.budget,
      deadline: row.deadline,
      status: row.status,
      workerId: row.worker_id,
      createdAt: row.created_at,
      skills: row.skills,
      isFavorite: row.is_favorite,
    }))

    res.json(tasks)
  } catch (err) {
    if (err.code === '42P01' && String(err.message || '').includes('task_favorites')) {
      console.error('Error fetching tasks (missing task_favorites):', err)
      return res.status(500).json({
        error: '取得任務列表時發生錯誤，請先在資料庫執行 migrations/006_task_favorites.sql 建立 task_favorites 表。',
      })
    }
    console.error('Error fetching tasks:', err)
    res.status(500).json({ error: '取得任務列表時發生錯誤，請稍後再試' })
  }
})

app.get('/api/my-tasks', async (req, res) => {
  const { publisherId } = req.query

  if (!publisherId) {
    return res.status(400).json({ error: '缺少 publisherId' })
  }

  try {
    const result = await pool.query(
      `SELECT
         t.id,
         t.publisher_id,
         t.title,
         t.category,
         t.description,
         t.budget,
         TO_CHAR(t.deadline, 'YYYY-MM-DD') AS deadline,
         t.status,
         t.created_at,
         COALESCE(
           ARRAY_AGG(ts.skill_name) FILTER (WHERE ts.skill_name IS NOT NULL),
           '{}'
         ) AS skills
       FROM tasks t
       LEFT JOIN task_skills ts ON ts.task_id = t.id
       WHERE t.publisher_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [publisherId],
    )

    const tasks = result.rows.map((row) => ({
      id: row.id,
      publisherId: row.publisher_id,
      title: row.title,
      category: row.category,
      description: row.description,
      budget: row.budget,
      deadline: row.deadline,
      status: row.status,
      createdAt: row.created_at,
      skills: row.skills,
    }))

    res.json(tasks)
  } catch (err) {
    console.error('Error fetching my tasks:', err)
    res.status(500).json({ error: '取得我的任務時發生錯誤，請稍後再試' })
  }
})

// 使用者承接中的任務清單（接案者視角）
app.get('/api/my-assigned-tasks', async (req, res) => {
  const { workerId } = req.query

  if (!workerId) {
    return res.status(400).json({ error: '缺少 workerId' })
  }

  try {
    await expireOpenTasks(pool)
    await sendDeadlineReminders(pool)
    const result = await pool.query(
      `SELECT
         t.id,
         t.publisher_id,
         t.title,
         t.category,
         t.description,
         t.budget,
         TO_CHAR(t.deadline, 'YYYY-MM-DD') AS deadline,
         t.status,
         t.worker_id,
         t.created_at,
         pub.display_name AS publisher_name,
         COALESCE(
           ARRAY_AGG(ts.skill_name) FILTER (WHERE ts.skill_name IS NOT NULL),
           '{}'
         ) AS skills
       FROM tasks t
       LEFT JOIN task_skills ts ON ts.task_id = t.id
       LEFT JOIN users pub ON pub.id = t.publisher_id
       WHERE t.worker_id = $1
       GROUP BY t.id, pub.display_name
       ORDER BY t.updated_at DESC, t.created_at DESC`,
      [workerId],
    )

    const tasks = result.rows.map((row) => ({
      id: row.id,
      publisherId: row.publisher_id,
      publisherName: row.publisher_name,
      title: row.title,
      category: row.category,
      description: row.description,
      budget: row.budget,
      deadline: row.deadline,
      status: row.status,
      workerId: row.worker_id,
      createdAt: row.created_at,
      skills: row.skills,
    }))

    res.json(tasks)
  } catch (err) {
    console.error('Error fetching assigned tasks:', err)
    res.status(500).json({ error: '取得承接任務時發生錯誤，請稍後再試' })
  }
})

// 使用者收藏的任務清單
app.get('/api/my-favorites', async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' })
  }

  try {
    const result = await pool.query(
      `SELECT
         t.id,
         t.publisher_id,
         t.title,
         t.category,
         t.description,
         t.budget,
         TO_CHAR(t.deadline, 'YYYY-MM-DD') AS deadline,
         t.status,
         t.created_at,
         COALESCE(
           ARRAY_AGG(ts.skill_name) FILTER (WHERE ts.skill_name IS NOT NULL),
           '{}'
         ) AS skills
       FROM task_favorites f
       JOIN tasks t ON t.id = f.task_id
       LEFT JOIN task_skills ts ON ts.task_id = t.id
       WHERE f.user_id = $1
       GROUP BY t.id
       ORDER BY MAX(f.created_at) DESC`,
      [userId],
    )

    const tasks = result.rows.map((row) => ({
      id: row.id,
      publisherId: row.publisher_id,
      title: row.title,
      category: row.category,
      description: row.description,
      budget: row.budget,
      deadline: row.deadline,
      status: row.status,
      createdAt: row.created_at,
      skills: row.skills,
      isFavorite: true,
    }))

    res.json(tasks)
  } catch (err) {
    if (err.code === '42P01') {
      return res.status(500).json({
        error: '取得收藏任務時發生錯誤，請先在資料庫執行 migrations/006_task_favorites.sql 建立 task_favorites 表。',
      })
    }
    console.error('Error fetching favorite tasks:', err)
    res.status(500).json({ error: '取得收藏任務時發生錯誤，請稍後再試' })
  }
})

app.get('/api/tasks/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = req.query

  try {
    await expireOpenTasks(pool)
    await sendDeadlineReminders(pool)
    const result = await pool.query(
      `SELECT
         t.id,
         t.publisher_id,
         t.title,
         t.category,
         t.description,
         t.budget,
         TO_CHAR(t.deadline, 'YYYY-MM-DD') AS deadline,
         t.status,
         t.worker_id,
         t.created_at,
         pub.display_name AS publisher_name,
         pub.institution AS publisher_institution,
         COALESCE(pub.institutional_email, FALSE) AS publisher_institutional_email,
         COALESCE(pub.email_verified, FALSE) AS publisher_email_verified,
         pub.orcid_id AS publisher_orcid_id,
         worker.display_name AS worker_name,
         COALESCE(
           ARRAY_AGG(ts.skill_name) FILTER (WHERE ts.skill_name IS NOT NULL),
           '{}'
         ) AS skills
       FROM tasks t
       LEFT JOIN task_skills ts ON ts.task_id = t.id
       LEFT JOIN users pub ON pub.id = t.publisher_id
       LEFT JOIN users worker ON worker.id = t.worker_id
       WHERE t.id = $1
       GROUP BY
         t.id,
         t.publisher_id,
         t.title,
         t.category,
         t.description,
         t.budget,
         t.deadline,
         t.status,
         t.worker_id,
         t.created_at,
         pub.display_name,
         pub.institution,
         pub.institutional_email,
         pub.email_verified,
         pub.orcid_id,
         worker.display_name`,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到此任務' })
    }

    const row = result.rows[0]

    let isFavorite = false
    if (userId) {
      try {
        const fav = await pool.query(
          'SELECT 1 FROM task_favorites WHERE task_id = $1 AND user_id = $2',
          [id, userId],
        )
        isFavorite = fav.rows.length > 0
      } catch (favErr) {
        console.warn('Error checking favorites (non-critical):', favErr)
      }
    }

    const task = {
      id: row.id,
      publisherId: row.publisher_id,
      publisherName: row.publisher_name,
      publisherInstitution: row.publisher_institution,
      publisherInstitutionalEmail: row.publisher_institutional_email,
      publisherEmailVerified: row.publisher_email_verified,
      publisherOrcidId: row.publisher_orcid_id,
      title: row.title,
      category: row.category,
      description: row.description,
      budget: row.budget,
      deadline: row.deadline,
      status: row.status,
      workerId: row.worker_id,
      workerName: row.worker_name,
      createdAt: row.created_at,
      skills: row.skills,
      isFavorite,
    }

    res.json(task)
  } catch (err) {
    console.error('Error fetching task detail:', err)
    res.status(500).json({ error: '取得任務詳情時發生錯誤，請稍後再試' })
  }
})

// 取得任務對話訊息（僅刊登者與承接者可查看）
app.get('/api/tasks/:id/messages', async (req, res) => {
  const { id: taskId } = req.params
  const { userId } = req.query

  if (!userId) {
    return res.status(401).json({ error: '請先登入' })
  }

  try {
    const taskResult = await pool.query(
      'SELECT id, publisher_id, worker_id FROM tasks WHERE id = $1',
      [taskId],
    )
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到此任務' })
    }

    const task = taskResult.rows[0]
    const canAccess =
      task.worker_id &&
      (task.publisher_id === userId || task.worker_id === userId)

    if (!canAccess) {
      return res.status(403).json({ error: '目前無權限查看此任務對話' })
    }

    // 只要使用者打開對話，就把「別人傳給我」的訊息標記為已讀
    await pool.query(
      `UPDATE messages
       SET is_read = TRUE
       WHERE task_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
      [taskId, userId],
    )

    const result = await pool.query(
      `SELECT
         m.id,
         m.task_id,
         m.sender_id,
         m.receiver_id,
         m.content,
         m.is_read,
         m.created_at,
         sender.display_name AS sender_name,
         receiver.display_name AS receiver_name
       FROM messages m
       JOIN users sender ON sender.id = m.sender_id
       JOIN users receiver ON receiver.id = m.receiver_id
       WHERE m.task_id = $1
       ORDER BY m.created_at ASC`,
      [taskId],
    )

    const messages = result.rows.map((row) => ({
      id: row.id,
      taskId: row.task_id,
      senderId: row.sender_id,
      senderName: row.sender_name,
      receiverId: row.receiver_id,
      receiverName: row.receiver_name,
      content: row.content,
      isRead: row.is_read,
      createdAt: row.created_at,
    }))

    res.json(messages)
  } catch (err) {
    if (err.code === '42P01') {
      return res.status(500).json({
        error: '訊息功能尚未初始化，請重新啟動後端以建立 messages 表',
      })
    }
    console.error('Error fetching task messages:', err)
    res.status(500).json({ error: '取得任務對話時發生錯誤，請稍後再試' })
  }
})

// 任務內發送訊息（僅刊登者與承接者可互傳）
app.post('/api/tasks/:id/messages', async (req, res) => {
  const { id: taskId } = req.params
  const { userId, content } = req.body || {}

  if (!userId) {
    return res.status(401).json({ error: '請先登入' })
  }

  const contentTrim = (content || '').trim()
  if (!contentTrim) {
    return res.status(400).json({ error: '請輸入訊息內容' })
  }
  if (contentTrim.length > 2000) {
    return res.status(400).json({ error: '訊息長度不可超過 2000 字元' })
  }

  try {
    const taskResult = await pool.query(
      'SELECT id, publisher_id, worker_id FROM tasks WHERE id = $1',
      [taskId],
    )
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到此任務' })
    }

    const task = taskResult.rows[0]
    if (!task.worker_id) {
      return res.status(400).json({ error: '任務尚未完成承接，暫時無法對話' })
    }

    let receiverId = null
    if (task.publisher_id === userId) {
      receiverId = task.worker_id
    } else if (task.worker_id === userId) {
      receiverId = task.publisher_id
    } else {
      return res.status(403).json({ error: '目前無權限在此任務發送訊息' })
    }

    const insertResult = await pool.query(
      `INSERT INTO messages (task_id, sender_id, receiver_id, content, is_read)
       VALUES ($1, $2, $3, $4, FALSE)
       RETURNING id, task_id, sender_id, receiver_id, content, is_read, created_at`,
      [taskId, userId, receiverId, contentTrim],
    )

    const row = insertResult.rows[0]
    res.status(201).json({
      id: row.id,
      taskId: row.task_id,
      senderId: row.sender_id,
      receiverId: row.receiver_id,
      content: row.content,
      isRead: row.is_read,
      createdAt: row.created_at,
    })
  } catch (err) {
    if (err.code === '42P01') {
      return res.status(500).json({
        error: '訊息功能尚未初始化，請重新啟動後端以建立 messages 表',
      })
    }
    console.error('Error creating task message:', err)
    res.status(500).json({ error: '送出訊息時發生錯誤，請稍後再試' })
  }
})

// 未讀訊息提醒（Header / Dashboard 可用）
app.get('/api/messages/unread-count', async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' })
  }

  try {
    const totalResult = await pool.query(
      `SELECT COUNT(*)::int AS unread_count
       FROM messages
       WHERE receiver_id = $1 AND is_read = FALSE`,
      [userId],
    )

    const byTaskResult = await pool.query(
      `SELECT task_id, COUNT(*)::int AS unread_count
       FROM messages
       WHERE receiver_id = $1 AND is_read = FALSE
       GROUP BY task_id`,
      [userId],
    )

    res.json({
      unreadCount: totalResult.rows[0]?.unread_count || 0,
      tasks: byTaskResult.rows.map((row) => ({
        taskId: row.task_id,
        unreadCount: row.unread_count,
      })),
    })
  } catch (err) {
    if (err.code === '42P01') {
      return res.status(500).json({
        error: '訊息功能尚未初始化，請重新啟動後端以建立 messages 表',
      })
    }
    console.error('Error fetching unread message count:', err)
    res.status(500).json({ error: '取得未讀訊息時發生錯誤，請稍後再試' })
  }
})

// 收藏任務
app.post('/api/tasks/:id/favorite', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body || {}

  if (!userId) {
    return res.status(401).json({ error: '請先登入後再收藏任務' })
  }

  try {
    await pool.query(
      `INSERT INTO task_favorites (user_id, task_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, task_id) DO NOTHING`,
      [userId, id],
    )
    res.json({ favorite: true })
  } catch (err) {
    if (err.code === '42P01') {
      return res.status(500).json({
        error: '加入收藏時發生錯誤，請先在資料庫執行 migrations/006_task_favorites.sql 建立 task_favorites 表。',
      })
    }
    console.error('Error adding favorite:', err)
    res.status(500).json({ error: '加入收藏時發生錯誤，請稍後再試' })
  }
})

// 取消收藏任務
app.delete('/api/tasks/:id/favorite', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body || {}

  if (!userId) {
    return res.status(401).json({ error: '請先登入後再取消收藏' })
  }

  try {
    await pool.query(
      'DELETE FROM task_favorites WHERE user_id = $1 AND task_id = $2',
      [userId, id],
    )
    res.json({ favorite: false })
  } catch (err) {
    if (err.code === '42P01') {
      return res.status(500).json({
        error: '取消收藏時發生錯誤，請先在資料庫執行 migrations/006_task_favorites.sql 建立 task_favorites 表。',
      })
    }
    console.error('Error removing favorite:', err)
    res.status(500).json({ error: '取消收藏時發生錯誤，請稍後再試' })
  }
})

// 取得任務的報價列表（刊登者看全部，接案者看自己的）
app.get('/api/tasks/:id/bids', async (req, res) => {
  const { id: taskId } = req.params
  const { userId } = req.query

  try {
    await expireOpenTasks(pool)
    await sendDeadlineReminders(pool)
    const taskResult = await pool.query(
      'SELECT id, publisher_id, status FROM tasks WHERE id = $1',
      [taskId],
    )
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到此任務' })
    }
    const task = taskResult.rows[0]
    const isPublisher = userId && task.publisher_id === userId

    const result = await pool.query(
      `SELECT b.id, b.task_id, b.bidder_id, b.proposed_price, b.message, b.status, b.created_at,
              u.display_name AS bidder_name, u.institution AS bidder_institution,
              u.job_title AS bidder_job_title, u.field AS bidder_field,
              COALESCE(u.institutional_email, FALSE) AS bidder_institutional_email,
              COALESCE(u.email_verified, FALSE) AS bidder_email_verified,
              u.orcid_id AS bidder_orcid_id,
              COALESCE(
                (
                  SELECT json_agg(us.skill_name ORDER BY us.skill_name)
                  FROM user_skills us
                  WHERE us.user_id = u.id
                ),
                '[]'::json
              ) AS bidder_skills
       FROM bids b
       JOIN users u ON u.id = b.bidder_id
       WHERE b.task_id = $1
       ${!isPublisher && userId ? ' AND b.bidder_id = $2' : ''}
       ORDER BY b.created_at DESC`,
      isPublisher ? [taskId] : [taskId, userId],
    )

    const bids = result.rows.map((row) => ({
      id: row.id,
      taskId: row.task_id,
      bidderId: row.bidder_id,
      bidderName: row.bidder_name,
      bidderInstitution: row.bidder_institution,
      bidderJobTitle: row.bidder_job_title || null,
      bidderField: row.bidder_field || null,
      bidderInstitutionalEmail: row.bidder_institutional_email,
      bidderEmailVerified: row.bidder_email_verified,
      bidderOrcidId: row.bidder_orcid_id || null,
      bidderSkills: Array.isArray(row.bidder_skills) ? row.bidder_skills : [],
      proposedPrice: row.proposed_price,
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
    }))

    res.json(bids)
  } catch (err) {
    console.error('Error fetching bids:', err)
    res.status(500).json({ error: '取得報價列表時發生錯誤' })
  }
})

// 對任務送出報價（承接）
app.post('/api/tasks/:id/bids', async (req, res) => {
  const { id: taskId } = req.params
  const { bidderId, proposedPrice, message, bidderTermsAccepted, bidderTermsPolicyVersion } = req.body || {}

  if (!bidderId) {
    return res.status(401).json({ error: '請先登入後再送出報價' })
  }
  if (proposedPrice === undefined || proposedPrice === null || proposedPrice === '') {
    return res.status(400).json({ error: '請填寫報價金額' })
  }
  const price = parseInt(proposedPrice, 10)
  if (Number.isNaN(price) || price < 0) {
    return res.status(400).json({ error: '報價金額須為有效數字' })
  }

  if (!bidderTermsAccepted) {
    return res.status(400).json({ error: '請先閱讀並同意平台聲明書' })
  }

  try {
    await expireOpenTasks(pool)
    await sendDeadlineReminders(pool)
    const taskResult = await pool.query(
      'SELECT id, publisher_id, status FROM tasks WHERE id = $1',
      [taskId],
    )
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到此任務' })
    }
    const task = taskResult.rows[0]
    if (task.publisher_id === bidderId) {
      return res.status(400).json({ error: '無法對自己刊登的任務報價' })
    }
    if (task.status !== 'open') {
      return res.status(400).json({ error: '此任務已截止或已承接' })
    }

    await pool.query(
      `INSERT INTO bids (task_id, bidder_id, proposed_price, message, status,
                          bidder_terms_accepted, bidder_terms_accepted_at, bidder_terms_policy_version)
       VALUES ($1, $2, $3, $4, 'pending', $5, CURRENT_TIMESTAMP, $6)
       ON CONFLICT (task_id, bidder_id) DO UPDATE SET
         proposed_price = $3,
         message = $4,
         bidder_terms_accepted = $5,
         bidder_terms_accepted_at = CURRENT_TIMESTAMP,
         bidder_terms_policy_version = $6,
         created_at = CURRENT_TIMESTAMP`,
      [taskId, bidderId, price, (message || '').trim() || null, bidderTermsAccepted, bidderTermsPolicyVersion],
    )

    // 寄送「提出報價」通知（不影響主流程）
    try {
      const notifyRows = await pool.query(
        `SELECT
           t.title AS task_title,
           pub.email AS publisher_email,
           pub.display_name AS publisher_name,
           bidder.email AS bidder_email,
           bidder.display_name AS bidder_name
         FROM tasks t
         JOIN users pub ON pub.id = t.publisher_id
         JOIN users bidder ON bidder.id = $2
         WHERE t.id = $1`,
        [taskId, bidderId],
      )

      const d = notifyRows.rows[0]
      if (d?.publisher_email) {
        await sendEmail({
          to: d.publisher_email,
          subject: '[AcadeBee] 有新的報價提出',
          text: `您好${d.publisher_name ? ` ${d.publisher_name}` : ''}，\n\n您的任務「${d.task_title}」收到新的報價。\n\n請登入平台查看任務詳情並回覆。\n`,
        })
      }
      if (d?.bidder_email) {
        await sendEmail({
          to: d.bidder_email,
          subject: '[AcadeBee] 報價已送出，請等待回覆',
          text: `您好${d.bidder_name ? ` ${d.bidder_name}` : ''}，\n\n您已成功送出對任務「${d.task_title}」的報價，刊登者將審核並回覆。\n\n請登入平台查看任務狀態。\n`,
        })
      }
    } catch (mailErr) {
      console.warn('Send bid notification failed (non-critical):', mailErr.message)
    }

    res.status(201).json({ message: '報價已送出，請等待刊登者回覆' })
  } catch (err) {
    if (err.code === '23503') {
      return res.status(404).json({ error: '任務或使用者不存在' })
    }
    console.error('Error creating bid:', err)
    res.status(500).json({ error: '送出報價時發生錯誤，請稍後再試' })
  }
})

// 刊登者接受某筆報價
app.post('/api/tasks/:taskId/bids/:bidId/accept', async (req, res) => {
  const { taskId, bidId } = req.params
  const { publisherId, publisherTermsAccepted, publisherTermsPolicyVersion } = req.body || {}

  if (!publisherId) {
    return res.status(401).json({ error: '請先登入' })
  }

  if (!publisherTermsAccepted) {
    return res.status(400).json({ error: '請先閱讀並同意平台聲明書' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await expireOpenTasks(client)

    const taskRow = await client.query(
      'SELECT id, publisher_id, status FROM tasks WHERE id = $1',
      [taskId],
    )
    if (taskRow.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: '找不到此任務' })
    }
    const task = taskRow.rows[0]
    if (task.publisher_id !== publisherId) {
      await client.query('ROLLBACK')
      return res.status(403).json({ error: '只有刊登者可以接受報價' })
    }
    if (task.status !== 'open') {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: '此任務已承接或已截止' })
    }

    const bidRow = await client.query(
      'SELECT id, bidder_id FROM bids WHERE id = $1 AND task_id = $2 AND status = $3',
      [bidId, taskId, 'pending'],
    )
    if (bidRow.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: '找不到該報價或已被處理' })
    }
    const bid = bidRow.rows[0]

    await client.query(
      `UPDATE bids
       SET status = $1,
           publisher_terms_accepted = $4,
           publisher_terms_accepted_at = CURRENT_TIMESTAMP,
           publisher_terms_policy_version = $5
       WHERE task_id = $2 AND id = $3`,
      ['accepted', taskId, bidId, publisherTermsAccepted, publisherTermsPolicyVersion],
    )
    await client.query(
      'UPDATE bids SET status = $1 WHERE task_id = $2 AND id != $3',
      ['rejected', taskId, bidId],
    )
    await client.query(
      'UPDATE tasks SET worker_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [bid.bidder_id, 'in_progress', taskId],
    )

    // 取得寄信資訊（交易內查詢，避免資料不一致）
    const detailRow = await client.query(
      `SELECT
         t.title,
         pub.email AS publisher_email,
         pub.display_name AS publisher_name,
         bidder.email AS bidder_email,
         bidder.display_name AS bidder_name
       FROM tasks t
       JOIN users pub ON pub.id = t.publisher_id
       JOIN users bidder ON bidder.id = $2
       WHERE t.id = $1`,
      [taskId, bid.bidder_id],
    )

    await client.query('COMMIT')
    res.json({ message: '已接受此報價，任務進行中' })

    // 寄信通知（不影響主流程）
    try {
      const d = detailRow.rows[0]
      if (d?.publisher_email) {
        await sendEmail({
          to: d.publisher_email,
          subject: '[AcadeBee] 任務已確認承接',
          text: `您好${d.publisher_name ? ` ${d.publisher_name}` : ''}，\n\n您的任務「${d.title}」已接受承接者${d.bidder_name ? ` ${d.bidder_name}` : ''}的報價，任務已進入進行中。\n\n請登入平台查看任務詳情。`,
        })
      }
      if (d?.bidder_email) {
        await sendEmail({
          to: d.bidder_email,
          subject: '[AcadeBee] 您的報價已被接受',
          text: `您好${d.bidder_name ? ` ${d.bidder_name}` : ''}，\n\n您對任務「${d.title}」的報價已被接受，任務已進入進行中。\n\n請登入平台查看任務詳情。`,
        })
      }
    } catch (mailErr) {
      console.warn('Send accept notification failed (non-critical):', mailErr.message)
    }
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error accepting bid:', err)
    res.status(500).json({ error: '接受報價時發生錯誤，請稍後再試' })
  } finally {
    client.release()
  }
})

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params
  const { title, category, budget, deadline, description, skills, publisherId } = req.body || {}

  if (!publisherId) {
    return res.status(401).json({ error: '請先登入後再編輯任務' })
  }

  if (!title || !category || !budget || !deadline || !description) {
    return res.status(400).json({ error: '請填寫所有必填欄位' })
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const updateResult = await client.query(
      `UPDATE tasks
       SET title = $1,
           category = $2,
           description = $3,
           budget = $4,
           deadline = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
         AND publisher_id = $7
       RETURNING id, publisher_id, title, category, description, budget,
                 TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
                 status, created_at`,
      [title, category, description, budget, deadline, id, publisherId],
    )

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(403).json({ error: '您沒有權限編輯此任務或任務不存在' })
    }

    const task = updateResult.rows[0]

    await client.query('DELETE FROM task_skills WHERE task_id = $1', [id])

    const skillNames =
      typeof skills === 'string'
        ? skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(skills)
          ? skills
          : []

    if (skillNames.length > 0) {
      const values = []
      const params = []
      let paramIndex = 1

      skillNames.forEach((skillName) => {
        values.push(`($1, $${paramIndex + 1})`)
        params.push(skillName)
        paramIndex += 1
      })

      await client.query(
        `INSERT INTO task_skills (task_id, skill_name)
         VALUES ${values.join(', ')}`,
        [id, ...params],
      )
    }

    await client.query('COMMIT')

    res.json({
      id: task.id,
      publisherId: task.publisher_id,
      title: task.title,
      category: task.category,
      description: task.description,
      budget: task.budget,
      deadline: task.deadline,
      status: task.status,
      createdAt: task.created_at,
      skills: skillNames,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error updating task:', err)
    res.status(500).json({ error: '更新任務時發生錯誤，請稍後再試' })
  } finally {
    client.release()
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params
  const { publisherId } = req.body || {}

  if (!publisherId) {
    return res.status(401).json({ error: '請先登入後再刪除任務' })
  }

  try {
    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
         AND publisher_id = $2`,
      [id, publisherId],
    )

    if (result.rowCount === 0) {
      return res.status(403).json({ error: '您沒有權限刪除此任務或任務不存在' })
    }

    res.status(204).send()
  } catch (err) {
    console.error('Error deleting task:', err)
    res.status(500).json({ error: '刪除任務時發生錯誤，請稍後再試' })
  }
})

// 啟動時自動建立 task_favorites 表（若不存在），避免雲端 DB 未執行 migration 006
async function ensureTaskFavoritesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_favorites (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, task_id)
      )
    `)
    console.log('task_favorites table ready')
  } catch (err) {
    console.error('Failed to ensure task_favorites:', err.message)
  }
}

// 啟動時自動建立 messages 表（若不存在）
async function ensureMessagesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await pool.query(
      'CREATE INDEX IF NOT EXISTS idx_messages_task_created ON messages(task_id, created_at)',
    )
    console.log('messages table ready')
  } catch (err) {
    console.error('Failed to ensure messages table:', err.message)
  }
}

ensureTaskFavoritesTable().then(() => {
  ensureMessagesTable().then(() => {
    ensurePaymentPolicyConsentColumns(pool)
      .then(() =>
        ensureTaskDeadlineReminderColumns(pool).finally(() => {
          app.listen(port, () => {
            console.log(`API server listening on http://localhost:${port}`)
          })
        }),
      )
  })
})

