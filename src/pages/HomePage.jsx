import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { categories } from '../data/mockTasks'
import { apiFetch } from '../apiClient'
import './HomePage.css'

const HOW_IT_WORKS = [
  { step: 1, title: '刊登需求', desc: '免費刊登研究任務，說明預算、截止日與所需技能。', icon: '📝' },
  { step: 2, title: '接案者報價', desc: '符合條件的接案者送出報價與簡短說明，您可比較後選擇。', icon: '💬' },
  { step: 3, title: '選擇人選', desc: '接受其中一筆報價後，任務進入進行中，可開始協作。', icon: '🤝' },
  { step: 4, title: '完成合作', desc: '任務完成後，雙方可在平台上留下評價，建立信任。', icon: '✅' },
]

const TESTIMONIALS = [
  { quote: '在 AcadeBee 上很快找到能處理問卷分析的夥伴，溝通順暢、準時交件。', author: '研究計畫主持人', role: '大學教師' },
  { quote: '接案流程清楚，刊登者會主動回覆報價，適合想兼職做研究的學生。', author: '接案者', role: '碩士生' },
]

export default function HomePage() {
  const [recentTasks, setRecentTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiFetch('/api/tasks')
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          const enriched = data.slice(0, 6).map((task) => {
            const cat = categories.find((c) => c.value === task.category)
            return { ...task, categoryLabel: cat ? cat.label : task.category }
          })
          setRecentTasks(enriched)
        }
      } catch {
        setRecentTasks([])
      } finally {
        setTasksLoading(false)
      }
    }
    fetchTasks()
  }, [])

  return (
    <div className="home-page">
      <section className="hero">
        <h1>AcadeBee 學術任務媒合平台</h1>
        <p className="hero-sub">
          刊登研究需求，或承接任務。數據分析、程式設計、數據標註，一站完成。
        </p>
        <div className="hero-actions">
          <Link to="/tasks/new" className="btn btn-primary btn-lg">刊登任務</Link>
          <Link to="/tasks" className="btn btn-outline btn-lg">瀏覽任務</Link>
        </div>
        <p className="hero-trust">免費刊登 · 信箱驗證 · 安全媒合</p>
      </section>

      <section className="how-it-works">
        <h2>如何運作</h2>
        <div className="steps-grid">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="step-card">
              <span className="step-icon">{item.icon}</span>
              <span className="step-num">步驟 {item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="categories">
        <h2>任務類型</h2>
        <div className="category-grid">
          <Link to="/tasks?category=data_analysis" className="category-card">
            <span className="category-icon">📊</span>
            <span>數據分析</span>
          </Link>
          <Link to="/tasks?category=data_cleaning" className="category-card">
            <span className="category-icon">🧹</span>
            <span>數據清理</span>
          </Link>
          <Link to="/tasks?category=programming" className="category-card">
            <span className="category-icon">💻</span>
            <span>程式設計</span>
          </Link>
          <Link to="/tasks?category=data_labeling" className="category-card">
            <span className="category-icon">🏷️</span>
            <span>數據標註</span>
          </Link>
        </div>
      </section>

      <section className="featured-tasks">
        <div className="section-header">
          <h2>近期任務</h2>
          <Link to="/tasks" className="link-more">查看全部 →</Link>
        </div>
        {tasksLoading ? (
          <p className="section-loading">載入中…</p>
        ) : recentTasks.length > 0 ? (
          <div className="task-grid">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="section-empty">目前尚無任務，<Link to="/tasks/new">搶先刊登</Link>第一個任務。</p>
        )}
      </section>

      <section className="testimonials">
        <h2>使用者回饋</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <blockquote key={i} className="testimonial-card">
              <p>「{t.quote}」</p>
              <footer>— {t.author}，{t.role}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-links">
          <Link to="/tasks">瀏覽任務</Link>
          <Link to="/tasks/new">刊登任務</Link>
          <Link to="/register">註冊</Link>
          <Link to="/login">登入</Link>
        </div>
        <p className="footer-copy">AcadeBee 學術任務媒合平台 · 研究需求與接案者的一站式媒合</p>
      </footer>
    </div>
  )
}
