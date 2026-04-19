import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { categories } from '../data/mockTasks'
import { apiFetch } from '../apiClient'
import './TaskDetailPage.css'

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [bidPrice, setBidPrice] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [acceptingBidId, setAcceptingBidId] = useState(null)
  const PLATFORM_DECLARATION_VERSION = 'v1_platform_matchmaking_disclaimer'
  const platformDeclarationText =
    '我已了解本平台宗旨為學術任務媒合，平台僅提供資訊刊登與雙方媒合服務。任務履約、付款安排、溝通爭議與其他衍生風險，均由合作雙方自行協調並負責，與平台無涉。'
  const [bidderTermsAccepted, setBidderTermsAccepted] = useState(false)
  const [publisherTermsAccepted, setPublisherTermsAccepted] = useState(false)

  const loadTask = async (userId) => {
    const q = userId ? `?userId=${userId}` : ''
    const res = await apiFetch(`/api/tasks/${id}${q}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '取得任務詳情失敗')
    const cat = categories.find((c) => c.value === data.category)
    return { ...data, categoryLabel: cat ? cat.label : data.category }
  }

  const loadBids = async () => {
    const raw = window.localStorage.getItem('currentUser')
    const user = raw ? JSON.parse(raw) : null
    const q = user?.id ? `?userId=${user.id}` : ''
    const res = await apiFetch(`/api/tasks/${id}/bids${q}`)
    const data = await res.json()
    if (!res.ok) return []
    return Array.isArray(data) ? data : []
  }

  useEffect(() => {
    const raw = window.localStorage.getItem('currentUser')
    const user = raw ? JSON.parse(raw) : null
    setCurrentUser(user)

    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const [taskData, bidsData] = await Promise.all([loadTask(user?.id), loadBids()])
        setTask(taskData)
        setIsFavorite(Boolean(taskData.isFavorite))
        setBids(bidsData)
      } catch (err) {
        setError(err.message || '取得任務詳情失敗')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [id])

  const canEditOrDelete = currentUser && task && currentUser.id === task.publisherId
  const isPublisher = canEditOrDelete
  const myBid = currentUser && bids.find((b) => b.bidderId === currentUser.id)
  const canBid = currentUser && task && task.status === 'open' && !isPublisher
  const isClosed = task && task.status !== 'open'

  const handleSubmitBid = async (e) => {
    e.preventDefault()
    if (!currentUser?.id || !task || submittingBid) return

    if (!bidderTermsAccepted) {
      setError('請先閱讀並同意平台聲明書，才能送出報價')
      return
    }

    const price = parseInt(bidPrice, 10)
    if (Number.isNaN(price) || price < 0) {
      setError('請輸入有效的報價金額')
      return
    }
    setSubmittingBid(true)
    setError('')
    try {
      const res = await apiFetch(`/api/tasks/${id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidderId: currentUser.id,
          proposedPrice: price,
          message: bidMessage.trim() || undefined,
          bidderTermsAccepted,
          bidderTermsPolicyVersion: PLATFORM_DECLARATION_VERSION,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '送出報價失敗')
      setBidPrice('')
      setBidMessage('')
      setBidderTermsAccepted(false)
      const newBids = await loadBids()
      setBids(newBids)
    } catch (err) {
      setError(err.message || '送出報價失敗')
    } finally {
      setSubmittingBid(false)
    }
  }

  const handleAcceptBid = async (bidId) => {
    if (!currentUser?.id || !task || acceptingBidId) return

    if (!publisherTermsAccepted) {
      setError('請先閱讀並同意平台聲明書，才能接受報價')
      return
    }

    setAcceptingBidId(bidId)
    setError('')
    try {
      const res = await apiFetch(`/api/tasks/${id}/bids/${bidId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publisherId: currentUser.id,
          publisherTermsAccepted,
          publisherTermsPolicyVersion: PLATFORM_DECLARATION_VERSION,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '接受報價失敗')
      const [taskData, bidsData] = await Promise.all([loadTask(currentUser?.id), loadBids()])
      setTask(taskData)
      setBids(bidsData)
    } catch (err) {
      setError(err.message || '接受報價失敗')
    } finally {
      setAcceptingBidId(null)
    }
  }

  const handleDelete = async () => {
    if (!canEditOrDelete || deleting) return
    if (!window.confirm('確定要刪除此任務嗎？此動作無法復原。')) return

    setDeleting(true)
    try {
      const res = await apiFetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publisherId: currentUser.id }),
      })

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || '刪除任務失敗')
      }

      navigate('/tasks')
    } catch (err) {
      // 簡單顯示在畫面上
      setError(err.message || '刪除任務失敗')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!task || favoriteLoading) return
    if (!currentUser?.id) {
      navigate('/login')
      return
    }

    setFavoriteLoading(true)
    setError('')
    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await apiFetch(`/api/tasks/${id}/favorite`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '更新收藏狀態失敗')
      setIsFavorite(Boolean(data.favorite))
    } catch (err) {
      setError(err.message || '更新收藏狀態失敗')
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="task-detail-page">
        <p>載入中…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="task-detail-page">
        <p>{error}</p>
        <Link to="/tasks">返回任務列表</Link>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="task-detail-page">
        <p>找不到此任務</p>
        <Link to="/tasks">返回任務列表</Link>
      </div>
    )
  }

  return (
    <div className="task-detail-page">
      <div className="task-detail-card">
        <div className="task-detail-header">
          <span className="task-detail-category">{task.categoryLabel}</span>
          <div className="task-detail-header-right">
            <button
              type="button"
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              aria-label={isFavorite ? '取消收藏此任務' : '收藏此任務'}
              title={currentUser ? (isFavorite ? '取消收藏' : '加入收藏清單') : '請先登入後才能收藏任務'}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
            <span className="task-detail-budget">NT$ {task.budget?.toLocaleString()}</span>
          </div>
        </div>
        <h1>{task.title}</h1>
        <div className="task-detail-meta">
          <span>截止日期：{task.deadline}</span>
          <span>刊登日期：{task.createdAt}</span>
        </div>

        {task.status === 'open' && (() => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const deadlineDate = new Date(`${task.deadline}T00:00:00`)
          const diffDays = Math.round((deadlineDate - today) / 86400000)
          if (diffDays === 1) {
            return <p className="text-muted">此任務將於明天截止，建議把握時程。</p>
          }
          if (diffDays === 0) {
            return <p className="text-muted">此任務今日截止，請儘快完成承接與溝通。</p>
          }
          return null
        })()}

        <section className="task-detail-section">
          <h3>任務描述</h3>
          <p>{task.description}</p>
        </section>

        <section className="task-detail-section task-publisher">
          <h3>刊登者</h3>
          <p>
            <strong>{task.publisherName || '使用者'}</strong>
            {task.publisherInstitution && (
              <span className="publisher-institution"> · {task.publisherInstitution}</span>
            )}
          </p>
          <div className="publisher-badges">
            {task.publisherInstitutionalEmail && task.publisherEmailVerified && (
              <span className="badge badge-institutional" title="學術機構信箱已驗證">
                學術機構信箱驗證
              </span>
            )}
            {task.publisherOrcidId && (
              <span className="badge badge-orcid" title="ORCID 已連結">
                ORCID <img src="/orcid-badge.png" alt="ORCID" className="badge-orcid-icon" />
              </span>
            )}
          </div>
        </section>

        <section className="task-detail-section">
          <h3>所需技能</h3>
          <div className="skill-tags">
            {task.skills?.map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        {task.workerId && (
          <p className="task-detail-worker">
            已由 <strong>{task.workerName || '接案者'}</strong> 承接
          </p>
        )}

        {isPublisher && bids.length > 0 && task.status === 'open' && (
          <section className="task-detail-section task-bids-section">
            <h3>收到的報價</h3>
            <div className="terms-check-row">
              <p className="terms-check-note">
                {platformDeclarationText}
              </p>
              <label className="terms-check">
                <input
                  type="checkbox"
                  checked={publisherTermsAccepted}
                  onChange={(e) => setPublisherTermsAccepted(e.target.checked)}
                  required
                />
                <span>我已閱讀並同意平台聲明</span>
              </label>
            </div>
            <ul className="bids-list">
              {bids.map((b) => (
                <li key={b.id} className="expert-card">
                  <div className="expert-card-header">
                    <div className="expert-card-name-row">
                      <strong className="expert-card-name">{b.bidderName}</strong>
                      {b.bidderInstitution && (
                        <span className="expert-card-institution"> · {b.bidderInstitution}</span>
                      )}
                    </div>

                    <div className="expert-card-badges-row">
                      {b.bidderJobTitle && (
                        <span className="expert-card-badge expert-card-badge-edu" title="最高學歷">
                          最高學歷：{b.bidderJobTitle}
                        </span>
                      )}
                      {b.bidderField && (
                        <span className="expert-card-badge expert-card-badge-field" title="研究領域">
                          研究領域：{b.bidderField}
                        </span>
                      )}
                    </div>

                    <div className="bidder-badges expert-card-verification-badges">
                      {b.bidderInstitutionalEmail && b.bidderEmailVerified && (
                        <span className="badge badge-institutional" title="學術機構信箱已驗證">
                          學術機構信箱驗證
                        </span>
                      )}
                      {b.bidderOrcidId && (
                        <span className="badge badge-orcid" title="ORCID 已連結">
                          ORCID <img src="/orcid-badge.png" alt="ORCID" className="badge-orcid-icon" />
                        </span>
                      )}
                    </div>
                  </div>

                  {Array.isArray(b.bidderSkills) && b.bidderSkills.length > 0 && (
                    <div className="expert-card-skills">
                      {b.bidderSkills.slice(0, 5).map((skill) => (
                        <span key={skill} className="skill-tag expert-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {b.message && <p className="bid-message">{b.message}</p>}

                  <div className="expert-card-actions">
                    <span className={`bid-status bid-status-${b.status}`}>
                      {b.status === 'pending' && '審核中'}
                      {b.status === 'accepted' && '已接受'}
                      {b.status === 'rejected' && '已拒絕'}
                    </span>
                    {b.status === 'pending' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAcceptBid(b.id)}
                        disabled={acceptingBidId !== null || !publisherTermsAccepted}
                      >
                        {acceptingBidId === b.id ? '處理中…' : '接受報價'}
                      </button>
                    )}
                  </div>

                  <div className="expert-card-bottom">
                    <div className="expert-card-rate">
                      NT$ {b.proposedPrice != null ? b.proposedPrice.toLocaleString() : '-'} / hr
                    </div>
                    <a
                      href="#"
                      className="expert-card-view-file"
                      onClick={(e) => {
                        e.preventDefault()
                      }}
                    >
                      查看檔案
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {canBid && !myBid && (
          <section className="task-detail-section">
            <h3>承接此任務</h3>
            <form onSubmit={handleSubmitBid} className="bid-form">
              <div className="form-group">
                <label htmlFor="bid-price">您的報價（NT$）*</label>
                <input
                  id="bid-price"
                  type="number"
                  min="0"
                  placeholder="例如：5000"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bid-message">簡短說明（選填）</label>
                <textarea
                  id="bid-message"
                  rows={3}
                  placeholder="可說明經驗或預計做法"
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>平台聲明書 *</label>
                <p className="form-hint" style={{ marginBottom: '0.6rem' }}>
                  {platformDeclarationText}
                </p>
                <label className="terms-check">
                  <input
                    type="checkbox"
                    checked={bidderTermsAccepted}
                    onChange={(e) => setBidderTermsAccepted(e.target.checked)}
                    required
                  />
                  <span>我已閱讀並同意上述聲明</span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingBid}>
                {submittingBid ? '送出中…' : '送出報價'}
              </button>
            </form>
          </section>
        )}

        {isClosed && !isPublisher && (
          <p className="text-muted">
            {task.status === 'in_progress' && '此任務已被承接，暫時無法再送出報價。'}
            {task.status === 'expired' && '此任務已到期，無法再送出報價。'}
            {task.status !== 'in_progress' && task.status !== 'expired' && '此任務目前無法承接。'}
          </p>
        )}

        {canBid && myBid && (
          <p className="task-detail-mybid">
            您已送出報價 NT$ {myBid.proposedPrice?.toLocaleString()}，
            狀態：{myBid.status === 'pending' && '審核中'}
            {myBid.status === 'accepted' && '已接受'}
            {myBid.status === 'rejected' && '已拒絕'}
          </p>
        )}

        <div className="task-detail-actions">
          <Link to="/tasks" className="btn btn-outline btn-lg">返回列表</Link>
          {canEditOrDelete && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => navigate(`/tasks/${id}/edit`)}
              >
                編輯任務
              </button>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? '刪除中…' : '刪除任務'}
              </button>
            </>
          )}
          {!currentUser && task?.status === 'open' && (
            <Link to="/login" className="btn btn-primary btn-lg">登入後承接任務</Link>
          )}
        </div>
      </div>
    </div>
  )
}
