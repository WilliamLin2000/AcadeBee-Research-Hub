import { useMemo } from 'react'
import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { BookOpen, Clock, Eye, ArrowRight } from 'lucide-react'
import {
  articles,
  articleCategories,
  getCategoryLabel,
  getCategoryColor,
  formatArticleDate,
} from '../data/articles'
import { getStoredUser } from '../authStorage'
import './ArticleListPage.css'

export default function ArticleListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || ''

  const filtered = useMemo(() => {
    if (!selectedCategory) return articles
    return articles.filter((a) => a.category === selectedCategory)
  }, [selectedCategory])

  const featured = articles.find((a) => a.featured)
  const rest = filtered.filter((a) => a.id !== featured?.id)

  const handleCategoryClick = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('category', value)
    else next.delete('category')
    setSearchParams(next)
  }

  if (!getStoredUser()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="article-list-page">
      <header className="article-list-hero">
        <div className="article-list-hero-inner">
          <span className="article-list-eyebrow">
            <BookOpen size={14} /> 研究筆記
          </span>
          <h1>
            一位生醫博士生的研究心得、
            <span className="text-accent">方法論與產業觀察</span>
          </h1>
          <p className="article-list-subtitle">
            我是 William Lin，生醫工程博士生、AcadeBee 創辦人。
            這裡記錄我在做研究、帶學生、以及與企業合作過程中累積的反思——希望對同樣走在這條路上的你有幫助。
          </p>

          <div className="article-list-filters">
            <button
              type="button"
              className={`article-filter-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryClick('')}
            >
              全部文章
            </button>
            {articleCategories.map((c) => (
              <button
                type="button"
                key={c.value}
                className={`article-filter-btn ${selectedCategory === c.value ? 'active' : ''}`}
                onClick={() => handleCategoryClick(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="article-list-body">
        {!selectedCategory && featured && (
          <Link to={`/articles/${featured.id}`} className="article-featured-card">
            <div className={`article-featured-cover cover-${getCategoryColor(featured.category)} ${featured.coverImage ? 'has-image' : ''}`}>
              {featured.coverImage && (
                <img src={featured.coverImage} alt="" className="article-cover-img" />
              )}
              <span className="article-featured-badge">★ 精選文章</span>
              <div className="article-featured-meta-top">
                <span className={`article-tag tag-${getCategoryColor(featured.category)}`}>
                  {getCategoryLabel(featured.category)}
                </span>
              </div>
            </div>
            <div className="article-featured-body">
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="article-meta">
                <span>{formatArticleDate(featured.publishedAt)}</span>
                <span className="dot">·</span>
                <span><Clock size={13} /> {featured.readingTime}</span>
                {featured.views ? (
                  <>
                    <span className="dot">·</span>
                    <span><Eye size={13} /> {featured.views.toLocaleString()} 次閱讀</span>
                  </>
                ) : null}
              </div>
              <span className="article-read-more">
                閱讀全文 <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        )}

        <div className="article-grid">
          {(selectedCategory ? filtered : rest).map((a) => (
            <Link to={`/articles/${a.id}`} key={a.id} className="article-card">
              <div className={`article-card-cover cover-${getCategoryColor(a.category)} ${a.coverImage ? 'has-image' : ''}`}>
                {a.coverImage && (
                  <img src={a.coverImage} alt="" className="article-cover-img" />
                )}
                <span className={`article-tag tag-${getCategoryColor(a.category)}`}>
                  {getCategoryLabel(a.category)}
                </span>
              </div>
              <div className="article-card-body">
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <div className="article-meta">
                  <span>{formatArticleDate(a.publishedAt)}</span>
                  <span className="dot">·</span>
                  <span>{a.readingTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="article-empty">這個分類還沒有文章，敬請期待。</p>
        )}
      </section>

      <section className="article-list-cta">
        <div className="article-list-cta-inner">
          <div>
            <h3>加入 FB 學術研究社群</h3>
            <p>提供專業學者、研究者的討論空間，分享工具、方法與產業脈動。</p>
          </div>
          <a
            href="https://www.facebook.com/share/g/18HqkiYdnu/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-gold"
          >
            加入社群
          </a>
        </div>
      </section>
    </div>
  )
}
