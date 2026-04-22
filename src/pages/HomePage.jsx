import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { categories } from '../data/mockTasks'
import { academicFields } from '../data/academicFields'
import { articles, formatArticleDate, getCategoryLabel, getCategoryColor } from '../data/articles'
import { apiFetch } from '../apiClient'
import williamPhoto from '../assets/square img3.png'
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
  BookOpen,
  Users,
  ExternalLink,
  ArrowRight,
  Search,
} from 'lucide-react'
import './HomePage.css'

const FOUNDER_AVATAR_URL = williamPhoto

const HOW_IT_WORKS = [
  { step: '01', title: '刊登需求', desc: '免費刊登研究任務，說明預算、截止日與所需技能。', icon: FileText },
  { step: '02', title: '接案者報價', desc: '符合條件的接案者送出報價與簡短說明，可比較後選擇。', icon: MessageSquare },
  { step: '03', title: '選擇人選', desc: '接受報價後任務進入進行中，雙方可開始協作。', icon: Handshake },
  { step: '04', title: '完成合作', desc: '任務完成後，雙方可互相評價，建立長期信任。', icon: CheckCircle2 },
]

const TESTIMONIALS = [
  {
    quote:
      '在 AcadeBee 上很快找到能處理問卷分析的夥伴，溝通順暢、準時交件。平台的機構驗證讓我能安心把資料交出去。',
    author: '陳教授',
    role: '大學教師 · 研究計畫主持人',
    avatar: '陳',
    color: 'navy',
  },
  {
    quote:
      '接案流程清楚，刊登者會主動回覆報價。作為想兼職做研究的博士生，這個平台讓我可以選擇真正符合專長的題目。',
    author: '林同學',
    role: '博士生 · 生醫工程',
    avatar: '林',
    color: 'teal',
  },
  {
    quote:
      '我特別欣賞平台的報價追蹤機制，過去用 email 協調常常訊息散落，現在所有版本與報價都在一起，效率高很多。',
    author: '王博士',
    role: '博士後研究員 · 公共衛生',
    avatar: '王',
    color: 'gold',
  },
]

const STATS = [
  { num: '9 (更新中)', suf: '+', label: '已驗證學術成員' },
  { num: '3 (更新中)', suf: '+', label: '完成協作任務' },
  { num: '96', suf: '%', label: '準時交付率' },
  { num: '14 (更新中)', suf: '+', label: '合作研究機構' },
]

const TRUST_SIGNALS = [
  { label: '學術信箱驗證', icon: BadgeCheck },
  { label: 'ORCID 身分連結', icon: ShieldCheck },
  { label: '截止與狀態提醒', icon: BellRing },
  { label: '報價流程可追蹤', icon: History },
]

export default function HomePage() {
  const [recentTasks, setRecentTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [founderAvatarLoadError, setFounderAvatarLoadError] = useState(false)
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')
  const [selectedField, setSelectedField] = useState('')

  const featuredArticle = articles.find((a) => a.featured) || articles[0]
  const sideArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 3)

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
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">
              <span className="dot" />已驗證學術機構 更新中+
            </span>
            <h1>
              讓研究計畫與
              <br />
              <span className="hero-accent">學術接案者</span>在同一個流程裡相遇
            </h1>
            <p className="hero-sub">
              AcadeBee 為研究人員量身打造的媒合平台與研究筆記社群。刊登任務、比較報價，以透明流程與學術身分驗證，建立可信任協作關係。
            </p>

            <div className="hero-cta-row">
              <Link to="/tasks/new" className="btn btn-primary btn-lg">
                刊登研究任務 <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
              <Link to="/tasks" className="btn btn-outline btn-lg">瀏覽任務</Link>
            </div>

            <form className="hero-search" onSubmit={handleHeroSearch}>
              <div className="hero-search-field">
                <label>關鍵字</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="例如：問卷分析、資料清理"
                  aria-label="關鍵字搜尋"
                />
              </div>
              <div className="hero-search-divider" />
              <div className="hero-search-field">
                <label>學術領域</label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  aria-label="學術領域"
                >
                  <option value="">全部領域</option>
                  {academicFields.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary hero-search-btn">
                <Search size={18} strokeWidth={2.2} />搜尋
              </button>
            </form>

            <div className="hero-trust">
              <span className="hero-trust-label">信任機制：</span>
              {TRUST_SIGNALS.map((item) => {
                const Icon = item.icon
                return (
                  <span key={item.label} className="hero-trust-item">
                    <Icon size={16} strokeWidth={2.2} />
                    <strong>{item.label}</strong>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Hero visual cards */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card hero-card-1">
              <div className="hero-card-title">機器學習模型訓練</div>
              <div className="hero-card-meta">生醫工程 · 台大醫院研究團隊</div>
              <div className="hero-card-row">
                <span className="hero-card-pill">數據分析</span>
                <span className="hero-card-budget">NT$ 45,000</span>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <div className="hero-card-title">本月活躍接案者</div>
              <div className="hero-card-row" style={{ marginTop: '0.8rem' }}>
                <div className="hero-card-avatars">
                  <div className="hero-card-avatar">W</div>
                  <div className="hero-card-avatar avatar-teal">L</div>
                  <div className="hero-card-avatar avatar-gold">C</div>
                  <div className="hero-card-avatar avatar-navy">+</div>
                </div>
                <span className="hero-card-budget">1,280 位</span>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <div className="hero-card-title">平均任務媒合時間</div>
              <div className="hero-card-stat-row">
                <span className="hero-card-stat">3.2</span>
                <span className="hero-card-stat-meta">天 · 比上季下降 18%</span>
              </div>
              <div className="hero-card-progress">
                <div className="hero-card-progress-bar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder strip */}
      <section className="founder-strip">
        <div className="founder-strip-inner">
          <div className="founder-avatar" aria-label="William Lin 頭像">
            {!founderAvatarLoadError ? (
              <img
                src={FOUNDER_AVATAR_URL}
                alt="William Lin"
                onError={() => setFounderAvatarLoadError(true)}
              />
            ) : (
              'W'
            )}
          </div>
          <div>
            <span className="founder-tag">● Founder&apos;s Notes</span>
            <div className="founder-text">
              由 <strong>William Lin</strong> 創辦 · 生醫工程博士生 · 持續在這裡發表
              <strong> 研究方法論、專案經驗、產業觀察</strong>
            </div>
          </div>
          <div className="founder-spacer" />
          <Link to="/articles" className="founder-link">閱讀最新研究筆記 →</Link>
        </div>
      </section>

      {/* Stats strip */}
      <section className="stats-strip">
        <div className="stats-strip-inner">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-num">
                {s.num}
                {s.suf && <span className="stat-num-suf">{s.suf}</span>}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-head">
            <span className="section-eyebrow">任務類型</span>
            <h2>依專長領域探索任務</h2>
            <p>從資料分析到文獻整理、從實驗輔助到程式開發，依您的專業領域快速找到合適的研究任務。</p>
          </div>
          <div className="category-grid">
            <Link to="/tasks?category=data_analysis" className="category-card">
              <div className="category-icon"><BarChart3 size={22} strokeWidth={2} /></div>
              <div><div className="category-title">數據分析</div><div className="category-meta">248 個任務</div></div>
            </Link>
            <Link to="/tasks?category=data_cleaning" className="category-card category-card-teal">
              <div className="category-icon"><Eraser size={22} strokeWidth={2} /></div>
              <div><div className="category-title">數據清理</div><div className="category-meta">162 個任務</div></div>
            </Link>
            <Link to="/tasks?category=programming" className="category-card category-card-gold">
              <div className="category-icon"><Code2 size={22} strokeWidth={2} /></div>
              <div><div className="category-title">程式設計</div><div className="category-meta">194 個任務</div></div>
            </Link>
            <Link to="/tasks?category=data_labeling" className="category-card category-card-coral">
              <div className="category-icon"><Tag size={22} strokeWidth={2} /></div>
              <div><div className="category-title">數據標註</div><div className="category-meta">86 個任務</div></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured tasks */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">近期任務</span>
              <h2 className="section-title">正在招募的研究協作</h2>
            </div>
            <Link to="/tasks" className="btn btn-outline btn-sm">查看全部任務 →</Link>
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
            <p className="section-empty">
              目前尚無任務，<Link to="/tasks/new">搶先刊登</Link>第一個任務。
            </p>
          )}
        </div>
      </section>

      {/* Research Notes */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Founder&apos;s Notes · 研究筆記</span>
              <h2 className="section-title">William 的研究筆記與產業觀察</h2>
              <p className="section-sub">
                從生醫工程博士的視角，分享方法論、專案經驗、產業趨勢與 FB 社群精選討論。
              </p>
            </div>
            <Link to="/articles" className="btn btn-outline btn-sm">瀏覽所有文章 →</Link>
          </div>

          {featuredArticle && (
            <div className="articles-featured">
              <Link
                to={`/articles/${featuredArticle.id}`}
                className={`article-card article-card-wide cover-${getCategoryColor(featuredArticle.category)}`}
              >
                <div className={`article-cover ${featuredArticle.coverImage ? 'has-image' : ''}`}>
                  {featuredArticle.coverImage && (
                    <img src={featuredArticle.coverImage} alt="" className="article-cover-img" />
                  )}
                  <span className="article-cover-tag">{getCategoryLabel(featuredArticle.category)}</span>
                </div>
                <div className="article-body">
                  <div className="article-date">
                    {formatArticleDate(featuredArticle.publishedAt)}
                    <span className="dot" />{featuredArticle.readingTime}閱讀
                    {featuredArticle.views ? (
                      <>
                        <span className="dot" />{featuredArticle.views.toLocaleString()} 次瀏覽
                      </>
                    ) : null}
                  </div>
                  <h3 className="article-title">{featuredArticle.title}</h3>
                  <p className="article-excerpt">{featuredArticle.excerpt}</p>
                  <div className="article-byline">
                    <div className="article-byline-avatar">
                      <img src={williamPhoto} alt="William Lin" />
                    </div>
                    <span className="article-byline-name">William Lin</span>
                    <span className="article-byline-meta">· 生醫工程博士生</span>
                  </div>
                </div>
              </Link>

              <div className="article-side-list">
                {sideArticles.map((a) => (
                  <Link key={a.id} to={`/articles/${a.id}`} className={`article-list-item thumb-${getCategoryColor(a.category)}`}>
                    <div className={`article-list-thumb ${a.coverImage ? 'has-image' : ''}`}>
                      {a.coverImage ? (
                        <img src={a.coverImage} alt="" className="article-list-thumb-img" />
                      ) : (
                        <BookOpen size={18} strokeWidth={2} />
                      )}
                    </div>
                    <div>
                      <div className="article-list-title">{a.title}</div>
                      <div className="article-list-meta">
                        <span>{getCategoryLabel(a.category)}</span>
                        <span>·</span>
                        <span>{formatArticleDate(a.publishedAt)}</span>
                        <span>·</span>
                        <span>{a.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="section-inner">
          <div className="section-head">
            <span className="section-eyebrow">運作流程</span>
            <h2>四個步驟，啟動學術協作</h2>
            <p>從刊登到完成，每一步都有透明的流程與身分驗證機制，協助雙方建立信任並安心交付成果。</p>
          </div>
          <div className="steps-grid">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.step} className={`step-card step-${i + 1}`}>
                  <div className="step-num">{item.step}</div>
                  <div className="step-icon"><Icon size={22} strokeWidth={2} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-head">
            <span className="section-eyebrow">使用者回饋</span>
            <h2>來自研究者與接案者的真實分享</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <blockquote key={i} className="testimonial-card">
                <p>{t.quote}</p>
                <footer>
                  <div className={`testimonial-avatar avatar-${t.color}`}>{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.author}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FB Community banner */}
      <section className="section community-section" id="community">
        <div className="section-inner">
          <div className="community-banner">
            <div className="community-banner-content">
              <span className="community-banner-eyebrow">● 加入社群</span>
              <h2>加入 William Lin 的 FB 學術社群</h2>
              <p>
                除了網站上的研究筆記，我在 FB 經營了一個專屬於生醫研究者的社群，每天有學術圈即時討論、工具資源分享、協作機會發布。歡迎加入，一起把台灣的學術合作做得更好。
              </p>
              <div className="community-stats">
                <div className="community-stat"><strong>歡迎</strong> 新成員</div>
                <div className="community-stat"><strong>每日</strong> 精選討論</div>
                <div className="community-stat"><strong>免費</strong> 加入</div>
              </div>
            </div>
            <div className="community-actions">
              <a
                href="https://www.facebook.com/share/g/18HqkiYdnu/"
                target="_blank"
                rel="noreferrer"
                className="community-btn"
              >
                <Users size={20} strokeWidth={2} />加入 FB 社群
              </a>
              <a
                href="https://www.instagram.com/morepublicationsinphd/?hl=zh-tw"
                target="_blank"
                rel="noreferrer"
                className="community-btn community-btn-secondary"
              >
                <ExternalLink size={18} strokeWidth={2} />其他｜Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-cta">
        <div className="section-inner">
          <div className="cta-banner">
            <div>
              <h2>準備好開始了嗎？</h2>
              <p>免費註冊 AcadeBee，用學術機構信箱驗證身分，立即刊登或承接您的第一個研究任務。</p>
            </div>
            <div className="cta-banner-actions">
              <Link to="/register" className="btn btn-gold btn-lg">免費註冊</Link>
              <Link to="/about" className="btn btn-outline btn-lg btn-outline-light">了解更多</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
