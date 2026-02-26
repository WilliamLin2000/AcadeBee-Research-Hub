import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../apiClient'
import './AuthPage.css'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    phone: '',
    orcid_id: '',
    job_title: '',
    field: '',
    skills: [],
  })
  const [emailCode, setEmailCode] = useState('')
  const [codesSent, setCodesSent] = useState(false)
  const [sendingCodes, setSendingCodes] = useState(false)
  const [codeMessage, setCodeMessage] = useState('')
  const [skillOptions, setSkillOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await apiFetch('/api/skills')
        const list = await res.json()
        setSkillOptions(Array.isArray(list) ? list : [])
      } catch {
        setSkillOptions([])
      } finally {
        setLoadingSkills(false)
      }
    }
    fetchSkills()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillToggle = (skill) => {
    setForm((prev) => {
      const next = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
      return { ...prev, skills: next }
    })
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    const emailTrim = form.email.trim()
    if (!emailTrim) {
      setCodeMessage('請先填寫電子信箱')
      return
    }
    setCodeMessage('')
    setSendingCodes(true)
    try {
      const res = await apiFetch('/api/send-registration-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrim }),
      })
      const data = await res.json()
      if (res.ok) {
        setCodesSent(true)
        setCodeMessage(data.message || '驗證碼已寄至信箱，請輸入下方 6 碼。')
      } else {
        setCodeMessage(data.error || '發送失敗')
      }
    } catch (err) {
      setCodeMessage('發送失敗，請稍後再試')
    } finally {
      setSendingCodes(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await apiFetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          institution: form.institution.trim() || undefined,
          phone: form.phone.trim() || undefined,
          orcid_id: form.orcid_id.trim() || undefined,
          job_title: form.job_title.trim() || undefined,
          field: form.field.trim() || undefined,
          skills: form.skills,
          emailCode: emailCode.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '註冊失敗，請稍後再試')
      }

      setSuccess(
        '註冊成功！信箱已完成驗證。您可以使用此帳號登入。' +
          (data.institutionalEmail ? ' 您使用機構信箱，已獲得機構驗證標章。' : ''),
      )
      setForm({
        name: '',
        email: '',
        password: '',
        institution: '',
        phone: '',
        orcid_id: '',
        job_title: '',
        field: '',
        skills: [],
      })
      setEmailCode('')
      setCodesSent(false)
      setCodeMessage('')
    } catch (err) {
      setError(err.message || '註冊失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>註冊</h1>
        <p className="auth-hint auth-hint-top">
          請先填寫信箱並取得驗證碼，完成信箱驗證後再填寫其餘資料。使用 .edu / 學校信箱可獲得「機構信箱」標章。
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">電子信箱 *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="建議使用 .edu 或學校信箱"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="register-codes-row">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleSendCode}
              disabled={sendingCodes}
            >
              {sendingCodes ? '發送中…' : '發送驗證碼'}
            </button>
          </div>
          {codeMessage && (
            <p className={codeMessage.startsWith('驗證碼已') ? 'auth-success' : 'auth-error'}>
              {codeMessage}
            </p>
          )}

          {codesSent && (
            <div className="form-single-code">
              <label htmlFor="emailCode">信箱驗證碼 (6 碼) *</label>
              <input
                id="emailCode"
                type="text"
                placeholder="請輸入信中的 6 碼"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="verify-code-input"
              />
            </div>
          )}

          <hr className="form-divider" />

          <div>
            <label htmlFor="name">真實姓名 / 暱稱 *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="平台顯示用，建議實名制"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="institution">學校 / 機構名稱 *</label>
            <input
              id="institution"
              name="institution"
              type="text"
              required
              placeholder="例如：國立學術蜜蜂大學 資工系"
              value={form.institution}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="field">領域 *</label>
            <input
              id="field"
              name="field"
              type="text"
              required
              placeholder="例如：資訊工程、統計、生醫"
              value={form.field}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="orcid_id">ORCID ID *</label>
            <input
              id="orcid_id"
              name="orcid_id"
              type="text"
              required
              placeholder="請填寫您的 ORCID 識別碼"
              value={form.orcid_id}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="job_title">職稱 *</label>
            <input
              id="job_title"
              name="job_title"
              type="text"
              required
              placeholder="例如：教授、博士生、研究員"
              value={form.job_title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="phone">手機號碼（選填）</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="選填，用於聯絡"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {!loadingSkills && skillOptions.length > 0 && (
            <div className="form-group-skills">
              <label>技能標籤（選填，利於任務媒合）</label>
              <div className="skill-chips">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-chip ${form.skills.includes(skill) ? 'active' : ''}`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password">密碼 *</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="至少 8 碼"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '建立中…' : '建立帳號'}
            </button>
            <Link to="/login" className="btn btn-outline">
              返回登入
            </Link>
          </div>
        </form>

        <p className="auth-hint">
          已經有帳號？<Link to="/login">直接登入</Link>
        </p>
      </div>
    </div>
  )
}
