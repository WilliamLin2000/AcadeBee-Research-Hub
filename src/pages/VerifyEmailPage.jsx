import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import './AuthPage.css'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('缺少驗證碼，請從信箱點擊完整連結。')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}`)
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage(data.message || '信箱驗證成功')
        } else {
          setStatus('error')
          setMessage(data.error || '驗證失敗')
        }
      } catch (err) {
        setStatus('error')
        setMessage('連線錯誤，請稍後再試')
      }
    }

    verify()
  }, [token])

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>信箱驗證</h1>
        {status === 'loading' && <p>驗證中…</p>}
        {status === 'success' && (
          <>
            <p className="auth-success">{message}</p>
            <p className="auth-hint">
              <Link to="/profile">前往個人資料</Link> 或 <Link to="/">回首頁</Link>
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="auth-error">{message}</p>
            <p className="auth-hint">
              <Link to="/profile">個人資料</Link> 可重新發送驗證信。
            </p>
          </>
        )}
      </div>
    </div>
  )
}
