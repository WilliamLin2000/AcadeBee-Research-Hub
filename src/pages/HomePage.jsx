import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { categories } from '../data/mockTasks'
import { academicFields } from '../data/academicFields'
import { apiFetch } from '../apiClient'
import {
  BarChart3,
  Eraser,
  Code2,
  Tag,
  FileText,
  MessageSquare,
  Handshake,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  BellRing,
  History,
} from 'lucide-react'
import './HomePage.css'

const HOW_IT_WORKS = [
  {
    step: 1,
    title: '刊登需求',
    desc: '免費刊登研究任務，說明預算、截止日與所需技能。',
    icon: FileText,
  },
  {
    step: 2,
    title: '接案者報價',
    desc: '符合條件的接案者送出報價與簡短說明，您可比較後選擇。',
    icon: MessageSquare,
  },
  {
    step: 3,
    title: '選擇人選',
    desc: '接受其中一筆報價後，任務進入進行中，可開始協作。',
    icon: Handshake,
  },
  {
    step: 4,
    title: '完成合作',
    desc: '任務完成後，雙方可在平台上留下評價，建立信任。',
    icon: CheckCircle2,
  },
]

const TESTIMONIALS = [
  { quote: '在 AcadeBee 上很快找到能處理問卷分析的夥伴，溝通順暢、準時交件。', author: '研究計畫主持人', role: '大學教師' },
  { quote: '接案流程清楚，刊登者會主動回覆報價，適合想兼職做研究的學生。', author: '接案者', role: '碩士生' },
]

export default function HomePage() {
  const [recentTasks, setRecentTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')
  const [selectedField, setSelectedField] = useState('')

  const TRUST_SIGNALS = [
    { label: '學術信箱驗證', icon: BadgeCheck },
    { label: 'ORCID 身分連結', icon: ShieldCheck },
    { label: '截止與狀態提醒', icon: BellRing },
    { label: '報價流程可追蹤', icon: History },
  ]
  const STATS = [
    { value: '1,200+', label: '專業人才' },
    { value: '500+', label: '已完成任務' },
    { value: '4.8/5', label: '平均評價' },
    { value: '100%', label: '安全支付保障' },
  ]

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

  const handleHeroSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('search', keyword.trim())
    if (selectedField) params.set('field', selectedField)

    const qs = params.toString()
    navigate(qs ? `/tasks?${qs}` : '/tasks')
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>全台最專業的學術研究人才庫</h1>
          <p className="hero-sub">連結頂尖研究者與技術專家</p>

          <form className="hero-search" onSubmit={handleHeroSearch}>
            <div className="hero-search-field">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="關鍵字搜尋"
                aria-label="關鍵字搜尋"
              />
            </div>

            <div className="hero-search-field">
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                aria-label="學術領域下拉選單"
              >
                <option value="">學術領域（全部）</option>
                {academicFields.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
              搜尋
            </button>
          </form>

          <div className="trust-wall">
            <div className="trust-title">平台信任機制</div>
            <p className="trust-note">目前尚未使用任何機構官方授權標誌，以下為平台已上線之信任設計。</p>
            <div className="trust-signals">
              {TRUST_SIGNALS.map((item) => {
                const Icon = item.icon
                return (
                  <span key={item.label} className="trust-signal">
                    <Icon size={10} />
                    {item.label}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>如何運作</h2>
        <div className="steps-grid">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="step-card">
              {(() => {
                const Icon = item.icon
                return <Icon className="step-icon" size={34} />
              })()}
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
            <BarChart3 className="category-icon" size={34} />
            <span>數據分析</span>
          </Link>
          <Link to="/tasks?category=data_cleaning" className="category-card">
            <Eraser className="category-icon" size={34} />
            <span>數據清理</span>
          </Link>
          <Link to="/tasks?category=programming" className="category-card">
            <Code2 className="category-icon" size={34} />
            <span>程式設計</span>
          </Link>
          <Link to="/tasks?category=data_labeling" className="category-card">
            <Tag className="category-icon" size={34} />
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
          <Link to="/about">關於我們</Link>
          <Link to="/register">註冊</Link>
          <Link to="/login">登入</Link>
        </div>
        <p className="footer-copy">AcadeBee 學術任務媒合平台 · 研究需求與接案者的一站式媒合</p>
      </footer>
    </div>
  )
}
