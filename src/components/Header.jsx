import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu, X } from 'lucide-react'
import logo from '../assets/square img0.png'
import { apiFetch } from '../apiClient'
import './Header.css'

export default function Header() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

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

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) {
        setUnreadCount(0)
        return
      }
      try {
        const res = await apiFetch(`/api/messages/unread-count?userId=${user.id}`)
        const data = await res.json()
        if (!res.ok) return
        setUnreadCount(Number(data.unreadCount) || 0)
      } catch {
        // 未讀提醒失敗不阻斷主流程
      }
    }

    fetchUnreadCount()

    const handleMessagesUpdated = () => {
      fetchUnreadCount()
    }

    window.addEventListener('messages-updated', handleMessagesUpdated)
    const timer = window.setInterval(fetchUnreadCount, 30000)

    return () => {
      window.removeEventListener('messages-updated', handleMessagesUpdated)
      window.clearInterval(timer)
    }
  }, [user?.id, location.pathname])

  const displayName = user?.name || user?.email

  const handleLogout = () => {
    window.localStorage.removeItem('currentUser')
    window.dispatchEvent(new Event('user-changed'))
    window.location.href = '/'
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header-top-bar">
        <div className="header-top-bar-inner">
          <span>學術合作 · 媒合研究任務與專業接案者</span>
          <span className="header-top-bar-links">
            <Link to="/articles">研究文章</Link>
            <span className="sep">·</span>
            <a href="https://www.facebook.com/share/g/18HqkiYdnu/" target="_blank" rel="noreferrer">FB 社群</a>
            <span className="sep">·</span>
            <a href="https://www.instagram.com/morepublicationsinphd/?hl=zh-tw" target="_blank" rel="noreferrer">其他（IG）</a>
          </span>
        </div>
      </div>
      <div className="header-inner">
        <Link to="/" className="header-logo" onClick={closeMenu}>
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
        <button
          type="button"
          className="header-menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation header-actions-panel"
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
        >
          {menuOpen ? <X size={22} strokeWidth={2} aria-hidden /> : <Menu size={22} strokeWidth={2} aria-hidden />}
        </button>
        <nav
          id="primary-navigation"
          className={`header-nav ${menuOpen ? 'header-nav-open' : ''}`}
        >
          <Link to="/tasks" onClick={closeMenu}>
            瀏覽任務
          </Link>
          <Link to="/tasks/new" onClick={closeMenu}>
            刊登任務
          </Link>
          <Link to="/articles" onClick={closeMenu}>
            研究文章
          </Link>
          <Link to="/dashboard" onClick={closeMenu}>
            我的任務
            {unreadCount > 0 && (
              <span className="header-unread-dot" title={`有 ${unreadCount} 則未讀訊息`}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          <Link to="/about" onClick={closeMenu}>
            關於我們
          </Link>
        </nav>
        {user ? (
          <div
            id="header-actions-panel"
            className={`header-actions ${menuOpen ? 'header-actions-open' : ''}`}
          >
            <Link to="/profile" className="header-user-pill" onClick={closeMenu}>
              {unreadCount > 0 && (
                <span className="header-chat-alert" title={`有 ${unreadCount} 則未讀訊息`}>
                  <Bell size={14} strokeWidth={2.2} aria-hidden />
                  <strong>{unreadCount > 99 ? '99+' : unreadCount}</strong>
                </span>
              )}
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
          <div
            id="header-actions-panel"
            className={`header-actions ${menuOpen ? 'header-actions-open' : ''}`}
          >
            <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
              登入
            </Link>
            <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
              註冊
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
