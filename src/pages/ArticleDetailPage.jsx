import { useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Clock, Eye, ArrowLeft, ArrowRight, Share2, Bookmark } from 'lucide-react'
import {
  articles,
  findArticle,
  getCategoryLabel,
  getCategoryColor,
  formatArticleDate,
} from '../data/articles'
import williamPhoto from '../assets/square img3.png'
import './ArticleDetailPage.css'

/** Bold through the first fullwidth colon（：）— labels like「角色 (Role)：」 */
function LeadingColonBold({ text }) {
  const i = text.indexOf('：')
  if (i === -1) return text
  return (
    <>
      <strong>{text.slice(0, i + 1)}</strong>
      {text.slice(i + 1)}
    </>
  )
}

export default function ArticleDetailPage() {
  const { id } = useParams()
  const article = findArticle(id)

  const related = useMemo(() => {
    if (!article) return []
    return articles
      .filter((a) => a.id !== article.id && a.category === article.category)
      .slice(0, 3)
  }, [article])

  if (!article) {
    return <Navigate to="/articles" replace />
  }

  const color = getCategoryColor(article.category)

  return (
    <article className="article-detail-page">
      <header className={`article-detail-hero cover-${color} ${article.coverImage ? 'has-image' : ''}`}>
        {article.coverImage && (
          <img src={article.coverImage} alt="" className="article-detail-hero-img" />
        )}
        <div className="article-detail-hero-inner">
          <Link to="/articles" className="article-back-link">
            <ArrowLeft size={15} /> 返回研究筆記
          </Link>

          <span className={`article-tag tag-${color} article-detail-tag`}>
            {getCategoryLabel(article.category)}
          </span>

          <h1>{article.title}</h1>
          {article.excerpt ? (
            <p className="article-detail-excerpt">{article.excerpt}</p>
          ) : null}

          <div className="article-detail-meta">
            <div className="article-detail-author">
              <span className="article-detail-avatar">
                <img src={williamPhoto} alt="William Lin" />
              </span>
              <div>
                <div className="article-detail-author-name">William Lin</div>
                <div className="article-detail-author-role">生醫工程博士生 · AcadeBee 創辦人</div>
              </div>
            </div>
            <div className="article-detail-meta-right">
              <span>{formatArticleDate(article.publishedAt)}</span>
              <span className="dot">·</span>
              <span><Clock size={13} /> {article.readingTime}</span>
              {article.views ? (
                <>
                  <span className="dot">·</span>
                  <span><Eye size={13} /> {article.views.toLocaleString()} 次閱讀</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="article-detail-body">
        {article.tableOfContents?.length > 0 && (
          <aside className="article-toc">
            <div className="article-toc-title">目錄</div>
            <ul>
              {article.tableOfContents.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.title}</a>
                </li>
              ))}
            </ul>
            <div className="article-toc-actions">
              <button type="button" className="toc-action-btn" title="分享">
                <Share2 size={15} /> 分享
              </button>
              <button type="button" className="toc-action-btn" title="收藏">
                <Bookmark size={15} /> 收藏
              </button>
            </div>
          </aside>
        )}

        <div className="article-detail-content">
          {article.content.map((block, idx) => {
            if (block.type === 'h2') {
              return (
                <h2 key={idx} id={block.id}>
                  {block.text}
                </h2>
              )
            }
            if (block.type === 'h3') {
              return <h3 key={idx}>{block.text}</h3>
            }
            if (block.type === 'p') {
              const isStepLine = /^Step \d+：/.test(block.text)
              return (
                <p key={idx}>
                  {isStepLine ? <LeadingColonBold text={block.text} /> : block.text}
                </p>
              )
            }
            if (block.type === 'list' && Array.isArray(block.items)) {
              return (
                <ul key={idx} className="article-detail-list">
                  {block.items.map((item, li) => (
                    <li key={li}>
                      <LeadingColonBold text={item} />
                    </li>
                  ))}
                </ul>
              )
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={idx}>
                  {block.text}
                </blockquote>
              )
            }
            if (block.type === 'callout') {
              return (
                <div key={idx} className="article-callout">
                  {block.text}
                </div>
              )
            }
            return null
          })}

          <div className="article-detail-author-card">
            <span className="article-detail-avatar large">
              <img src={williamPhoto} alt="William Lin" />
            </span>
            <div>
              <div className="article-detail-author-name large">William Lin</div>
              <p>
                生醫工程博士生，致力於 生物力學 / 醫學工程與人工智慧的整合應用。擅長跨領域合作，並與臨床、產業團隊處理資料分析及研究。
                AcadeBee 創辦人，致力於讓學術人的專業能被公平交換。
              </p>
              <div className="article-detail-author-actions">
                <Link to="/about" className="btn btn-outline btn-sm">關於我</Link>
                <a
                  href="https://www.facebook.com/share/g/18HqkiYdnu/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-gold btn-sm"
                >
                  加入 FB 社群
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="article-related">
          <div className="article-related-inner">
            <div className="article-related-header">
              <h2>延伸閱讀</h2>
              <Link to="/articles" className="article-related-more">
                看更多文章 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="article-related-grid">
              {related.map((a) => (
                <Link key={a.id} to={`/articles/${a.id}`} className="article-card">
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
          </div>
        </section>
      )}
    </article>
  )
}
