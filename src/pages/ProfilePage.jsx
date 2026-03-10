import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../apiClient'
import './DashboardPage.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const raw = window.localStorage.getItem('currentUser')
  const user = raw ? JSON.parse(raw) : null

  const [emailSending, setEmailSending] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [emailVerifyMessage, setEmailVerifyMessage] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const refreshUser = (updates) => {
    if (!user) return
    const next = { ...user, ...updates }
    window.localStorage.setItem('currentUser', JSON.stringify(next))
    window.dispatchEvent(new Event('user-changed'))
  }

  const handleSendVerificationEmail = async () => {
    if (!user?.id) return
    setEmailMessage('')
    setEmailVerifyMessage('')
    setEmailSending(true)
    try {
      const res = await apiFetch('/api/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const contentType = res.headers.get('content-type')
      const data = contentType?.includes('application/json')
        ? await res.json()
        : { error: `伺服器回傳異常 (${res.status})` }
      if (res.ok) {
        setEmailMessage(data.message || '驗證碼已寄至信箱，請輸入下方 6 碼。')
      } else {
        const msg = data.error || '發送失敗'
        setEmailMessage(data.detail ? `${msg}：${data.detail}` : msg)
      }
    } catch (err) {
      const msg = err.message || '發送失敗，請稍後再試'
      setEmailMessage(
        msg.includes('Failed to fetch') || msg.includes('NetworkError')
          ? '無法連線至伺服器，請確認後端已啟動且 .env 中 VITE_API_BASE_URL 指到正確位址（例如 http://localhost:5000）。'
          : msg
      )
    } finally {
      setEmailSending(false)
    }
  }

  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    if (!user?.id || !emailCode.trim()) return
    setEmailVerifyMessage('')
    setEmailVerifying(true)
    try {
      const res = await apiFetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, code: emailCode.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setEmailVerifyMessage('信箱驗證成功')
        setEmailCode('')
        setEmailMessage('')
        refreshUser({ emailVerified: true })
      } else {
        setEmailVerifyMessage(data.error || '驗證失敗')
      }
    } catch (err) {
      setEmailVerifyMessage('驗證失敗，請稍後再試')
    } finally {
      setEmailVerifying(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>個人資料</h1>
        <p>這些資料來自您在本平台註冊時所填寫的資訊。</p>
      </div>

      <div className="dashboard-section">
        <div className="task-card profile-card">
          <h2>{user.name || user.email}</h2>

          <div className="profile-badges">
            {user.institutionalEmail && user.emailVerified && (
              <span className="badge badge-institutional" title="學術機構信箱已驗證">
                學術機構信箱驗證
              </span>
            )}
            {user.orcidId && (
              <span className="badge badge-orcid" title="已填寫 ORCID">
                ORCID 已連結 <img src="/orcid-badge.png" alt="ORCID" className="badge-orcid-icon" />
              </span>
            )}
            {user.degreeVerified && (
              <span className="badge badge-degree" title="學位已驗證">
                學位已驗證
              </span>
            )}
          </div>

          <p><strong>Email：</strong>{user.email}</p>
          {user.phone && (
            <p><strong>手機：</strong>{user.phone}</p>
          )}
          {user.institution && (
            <p><strong>學校／機構：</strong>{user.institution}</p>
          )}
          {user.orcidId && (
            <p className="profile-orcid-row">
              <strong>ORCID ID： <img src="/orcid-badge.png" alt="ORCID" className="orcid-icon-inline" /></strong>
              {' '}{user.orcidId}
            </p>
          )}
          {Array.isArray(user.skills) && user.skills.length > 0 && (
            <p>
              <strong>技能：</strong>
              <span className="profile-skills">
                {user.skills.map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </span>
            </p>
          )}
          <p><strong>註冊時間：</strong>{new Date(user.createdAt).toLocaleString()}</p>

          {/* 信箱驗證（6 碼驗證碼，與常見網站相同） */}
          <div className="profile-verify-block">
            <h3>信箱驗證</h3>
            {user.emailVerified ? (
              <p className="text-muted">此信箱已完成驗證</p>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleSendVerificationEmail}
                  disabled={emailSending}
                >
                  {emailSending ? '寄送中…' : '發送驗證碼至信箱'}
                </button>
                {emailMessage && (
                  <p className="auth-success">{emailMessage}</p>
                )}
                <form onSubmit={handleVerifyEmail} className="verify-phone-form">
                  <input
                    type="text"
                    placeholder="請輸入信中的 6 碼驗證碼"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="verify-code-input"
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={emailVerifying}>
                    {emailVerifying ? '驗證中…' : '確認驗證碼'}
                  </button>
                </form>
                {emailVerifyMessage && (
                  <p className={emailVerifyMessage === '信箱驗證成功' ? 'auth-success' : 'auth-error'}>
                    {emailVerifyMessage}
                  </p>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
