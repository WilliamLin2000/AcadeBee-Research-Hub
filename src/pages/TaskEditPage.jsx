import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { categories } from '../data/mockTasks'
import './TaskCreatePage.css'

export default function TaskEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [form, setForm] = useState({
    title: '',
    category: '',
    budget: '',
    deadline: '',
    description: '',
    skills: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const raw = window.localStorage.getItem('currentUser')
    const user = raw ? JSON.parse(raw) : null
    if (!user) {
      navigate('/login')
      return
    }
    setCurrentUser(user)

    const fetchTask = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/tasks/${id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '取得任務資料失敗')
        }

        if (data.publisherId !== user.id) {
          throw new Error('您沒有權限編輯此任務')
        }

        setForm({
          title: data.title || '',
          category: data.category || '',
          budget: String(data.budget ?? ''),
          deadline: data.deadline || '',
          description: data.description || '',
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        })
      } catch (err) {
        setError(err.message || '取得任務資料失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentUser) {
      setError('請先登入後再編輯任務')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          budget: Number(form.budget),
          deadline: form.deadline,
          description: form.description,
          skills: form.skills,
          publisherId: currentUser.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '更新任務失敗，請稍後再試')
      }

      setSuccess('任務已更新')
      navigate(`/tasks/${id}`)
    } catch (err) {
      setError(err.message || '更新任務失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-create-page">
      <h1>編輯任務</h1>
      <form className="task-create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>任務標題 *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="簡短描述您的需求"
            required
          />
        </div>

        <div className="form-group">
          <label>任務類型 *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">請選擇</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>預算 (NT$) *</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="例如：5000"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>截止日期 *</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>任務描述 *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="詳細說明任務內容、資料量、預期產出等"
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>所需技能（以逗號分隔）</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="例如：Python, Pandas, 統計分析"
          />
        </div>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '儲存中…' : '儲存變更'}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-lg"
            onClick={() => navigate(`/tasks/${id}`)}
            disabled={loading}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

