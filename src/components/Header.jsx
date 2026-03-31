import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/square img0.png'
import './Header.css'

export default function Header() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = () => {
      try {
        const raw = window.localStorage.getItem('currentUser')
        setUser(raw ? JSON.parse(raw) : null)
      } catch {
        setUser(null)
      }
    }

    loadUser()

    const handleUserChange = () => {
      loadUser()
    }

    window.addEventListener('user-changed', handleUserChange)

    return () => {
      window.removeEventListener('user-changed', handleUserChange)
    }
  }, [])

  const displayName = user?.name || user?.email

  const handleLogout = () => {
    window.localStorage.removeItem('currentUser')
    window.dispatchEvent(new Event('user-changed'))
    window.location.href = '/'
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="header-logo-img-mark"
          />
          <span className="header-logo-text" aria-label="AcadeBee">
            <span className="header-logo-acade">Acade</span>
            <span className="header-logo-bee">Bee</span>
          </span>
        </Link>
        <nav className="header-nav">
          <Link to="/tasks">瀏覽任務</Link>
          <Link to="/tasks/new">刊登任務</Link>
          <Link to="/dashboard">我的任務</Link>
          <Link to="/about">關於我們</Link>
        </nav>
        {user ? (
          <div className="header-actions">
            <Link to="/profile" className="header-user-pill">
              <span className="header-user-name">
                {displayName || '個人資料'}
              </span>
              {user.institutionalEmail && user.emailVerified && (
                <span className="header-badge" title="學術機構信箱已驗證">機構✓</span>
              )}
            </Link>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              登出
            </button>
          </div>
        ) : (
          <div className="header-actions">
            <Link to="/login" className="btn btn-outline">登入</Link>
            <Link to="/register" className="btn btn-primary">註冊</Link>
          </div>
        )}
      </div>
    </header>
  )
}
