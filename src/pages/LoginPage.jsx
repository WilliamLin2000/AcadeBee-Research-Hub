import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '登入失敗，請稍後再試')
      }

      // 簡單做法：把使用者基本資訊存在 localStorage，之後可用於顯示暱稱等
      window.localStorage.setItem('currentUser', JSON.stringify(data))

      // 通知 header 等元件更新登入狀態
      window.dispatchEvent(new Event('user-changed'))

      navigate('/dashboard')
    } catch (err) {
      setError(err.message || '登入失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>登入</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password">密碼</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="請輸入密碼"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '登入中…' : '登入'}
            </button>
            <Link to="/register" className="btn btn-outline">前往註冊</Link>
          </div>
        </form>

        <p className="auth-hint">
          還沒有帳號？<Link to="/register">立即註冊</Link>
        </p>
      </div>
    </div>
  )
}

