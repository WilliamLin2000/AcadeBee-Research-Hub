import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { categories } from '../data/mockTasks'
import './TaskDetailPage.css'

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem('currentUser')
    const user = raw ? JSON.parse(raw) : null
    setCurrentUser(user)

    const fetchTask = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/tasks/${id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '取得任務詳情失敗')
        }

        const cat = categories.find((c) => c.value === data.category)
        const enriched = {
          ...data,
          categoryLabel: cat ? cat.label : data.category,
        }

        setTask(enriched)
      } catch (err) {
        setError(err.message || '取得任務詳情失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id])

  const canEditOrDelete = currentUser && task && currentUser.id === task.publisherId

  const handleDelete = async () => {
    if (!canEditOrDelete || deleting) return
    if (!window.confirm('確定要刪除此任務嗎？此動作無法復原。')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/tasks/${id}`, {
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

        <div className="task-detail-actions">
          <button className="btn btn-primary btn-lg">承接此任務</button>
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
        </div>
      </div>
    </div>
  )
}
