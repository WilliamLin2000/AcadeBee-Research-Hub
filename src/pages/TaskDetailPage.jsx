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
  const [bidPrice, setBidPrice] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [acceptingBidId, setAcceptingBidId] = useState(null)

  const loadTask = async () => {
    const res = await apiFetch(`/api/tasks/${id}`)
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
        const [taskData, bidsData] = await Promise.all([loadTask(), loadBids()])
        setTask(taskData)
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

  const handleSubmitBid = async (e) => {
    e.preventDefault()
    if (!currentUser?.id || !task || submittingBid) return
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
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '送出報價失敗')
      setBidPrice('')
      setBidMessage('')
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
    setAcceptingBidId(bidId)
    setError('')
    try {
      const res = await apiFetch(`/api/tasks/${id}/bids/${bidId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: currentUser.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '接受報價失敗')
      const [taskData, bidsData] = await Promise.all([loadTask(), loadBids()])
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
          <span className="task-detail-budget">NT$ {task.budget?.toLocaleString()}</span>
        </div>
        <h1>{task.title}</h1>
        <div className="task-detail-meta">
          <span>截止日期：{task.deadline}</span>
          <span>刊登日期：{task.createdAt}</span>
        </div>

        <section className="task-detail-section">
          <h3>任務描述</h3>
          <p>{task.description}</p>
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
            <ul className="bids-list">
              {bids.map((b) => (
                <li key={b.id} className="bid-item">
                  <div>
                    <strong>{b.bidderName}</strong>
                    {b.bidderInstitution && <span className="bid-institution"> · {b.bidderInstitution}</span>}
                  </div>
                  <div>報價 NT$ {b.proposedPrice?.toLocaleString()}</div>
                  {b.message && <p className="bid-message">{b.message}</p>}
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
                      disabled={acceptingBidId !== null}
                    >
                      {acceptingBidId === b.id ? '處理中…' : '接受報價'}
                    </button>
                  )}
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
              <button type="submit" className="btn btn-primary" disabled={submittingBid}>
                {submittingBid ? '送出中…' : '送出報價'}
              </button>
            </form>
          </section>
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
