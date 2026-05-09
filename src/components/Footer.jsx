import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStoredUser } from '../authStorage'
import './Footer.css'

export default function Footer() {
  const [user, setUser] = useState(() => getStoredUser())

  useEffect(() => {
    const sync = () => setUser(getStoredUser())
    window.addEventListener('user-changed', sync)
    return () => window.removeEventListener('user-changed', sync)
  }, [])

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-cols">
          <div className="footer-brand">
            <span className="footer-brand-badge">● 學術合作平台</span>
            <h4>
              <span className="footer-brand-acade">Acade</span>
              <span className="footer-brand-bee">Bee</span>
            </h4>
            <p>
              為研究人員而生的任務媒合平台與研究筆記。透過身分驗證與透明流程，讓研究計畫與專業接案者高效相遇。
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">平台</div>
            <ul>
              <li><Link to="/tasks">瀏覽任務</Link></li>
              <li><Link to="/tasks/new">刊登任務</Link></li>
              <li><Link to="/dashboard">我的任務</Link></li>
              <li><Link to="/profile">個人資料</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">內容與社群</div>
            <ul>
              {user ? (
                <>
                  <li><Link to="/articles">研究筆記</Link></li>
                  <li><Link to="/articles?category=method">方法論系列</Link></li>
                  <li><Link to="/articles?category=industry">產業觀察</Link></li>
                </>
              ) : (
                <li><Link to="/login">研究筆記（登入後瀏覽）</Link></li>
              )}
              <li><a href="#community">FB 學術社群</a></li>
              <li>
                <a href="https://www.instagram.com/morepublicationsinphd/?hl=zh-tw" target="_blank" rel="noreferrer">
                  其他（Instagram）
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">關於與支援</div>
            <ul>
              <li><Link to="/about">關於 AcadeBee</Link></li>
              <li><Link to="/about#founder">關於 William Lin</Link></li>
              <li><Link to="/register">註冊</Link></li>
              <li><Link to="/login">登入</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} AcadeBee · 學術任務媒合平台</div>
          <div className="footer-legal">
            <span>繁體中文</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
