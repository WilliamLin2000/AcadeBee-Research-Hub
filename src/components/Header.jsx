import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/square img1.png'
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
        <img src={logo} alt="AcadeBee | 學術小蜜蜂" className="header-logo-img" />
        </Link>
        <nav className="header-nav">
          <Link to="/tasks">瀏覽任務</Link>
          <Link to="/tasks/new">刊登任務</Link>
          <Link to="/dashboard">我的任務</Link>
        </nav>
        {user ? (
          <div className="header-actions">
            <Link to="/profile" className="header-user-pill">
              <span className="header-user-name">
                {displayName || '個人資料'}
              </span>
              {user.institutionalEmail && (
                <span className="header-badge" title="機構信箱">機構✓</span>
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
