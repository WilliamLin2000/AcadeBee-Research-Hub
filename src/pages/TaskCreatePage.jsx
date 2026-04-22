import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data/mockTasks'
import { academicFields, mergeSkillsWithAcademicFields } from '../data/academicFields'
import { apiFetch } from '../apiClient'
import './TaskCreatePage.css'

export default function TaskCreatePage() {
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
  const PLATFORM_DECLARATION_VERSION = 'v1_platform_matchmaking_disclaimer'
  const [academicSlugs, setAcademicSlugs] = useState([])
  const [selectedAcademicSlug, setSelectedAcademicSlug] = useState('')
  const [publisherTermsAccepted, setPublisherTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const raw = window.localStorage.getItem('currentUser')
    const user = raw ? JSON.parse(raw) : null
    setCurrentUser(user)
    if (!user) {
      navigate('/login')
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAcademicField = () => {
    if (!selectedAcademicSlug) return
    setAcademicSlugs((prev) =>
      prev.includes(selectedAcademicSlug) ? prev : [...prev, selectedAcademicSlug],
    )
    setSelectedAcademicSlug('')
  }

  const handleRemoveAcademicField = (slug) => {
    setAcademicSlugs((prev) => prev.filter((s) => s !== slug))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentUser) {
      setError('請先登入後再刊登任務')
      return
    }

    if (!publisherTermsAccepted) {
      setError('請先閱讀並同意平台聲明書，才能刊登任務')
      return
    }

    setLoading(true)

    try {
      const res = await apiFetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          budget: Number(form.budget),
          deadline: form.deadline,
          description: form.description,
          skills: mergeSkillsWithAcademicFields(form.skills, academicSlugs),
          publisherId: currentUser.id,
          publisherTermsAccepted,
          publisherTermsPolicyVersion: PLATFORM_DECLARATION_VERSION,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '刊登任務失敗，請稍後再試')
      }

      setSuccess('任務已成功刊登！')
      setForm({
        title: '',
        category: '',
        budget: '',
        deadline: '',
        description: '',
        skills: '',
      })
      setAcademicSlugs([])
      setSelectedAcademicSlug('')
      setPublisherTermsAccepted(false)
    } catch (err) {
      setError(err.message || '刊登任務失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-create-page">
      <h1>刊登任務</h1>
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
          <label>學術領域（可複選，將一併列入任務關鍵字）</label>
          <p className="form-hint">與任務類型分開標示，方便領域相近的人搜尋到此任務。</p>
          <div className="academic-field-picker">
            <select
              value={selectedAcademicSlug}
              onChange={(e) => setSelectedAcademicSlug(e.target.value)}
              aria-label="選擇學術領域"
            >
              <option value="">請選擇學術領域</option>
              {academicFields
                .filter((f) => !academicSlugs.includes(f.value))
                .map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleAddAcademicField}
              disabled={!selectedAcademicSlug}
            >
              新增
            </button>
          </div>
          <div className="academic-field-chips">
            {academicSlugs.length === 0 ? (
              <span className="academic-field-empty">尚未選擇學術領域</span>
            ) : (
              academicSlugs.map((slug) => {
                const label = academicFields.find((f) => f.value === slug)?.label || slug
                return (
                  <span key={slug} className="academic-field-chip">
                    {label}
                    <button
                      type="button"
                      className="academic-field-chip-remove"
                      onClick={() => handleRemoveAcademicField(slug)}
                      aria-label={`移除 ${label}`}
                    >
                      ×
                    </button>
                  </span>
                )
              })
            )}
          </div>
        </div>

        <div className="form-group">
          <label>其他所需技能（以逗號分隔）</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="例如：Python, Pandas, 統計分析"
          />
        </div>

        <div className="form-group">
          <label>平台聲明書 *</label>
          <p className="form-hint">
            我已了解本平台宗旨為學術任務媒合，平台僅提供資訊刊登與雙方媒合服務。任務履約、付款安排、
            溝通爭議與其他衍生風險，均由合作雙方自行協調並負責，平台不承擔相關責任。
          </p>
          <label className="terms-check">
            <input
              type="checkbox"
              checked={publisherTermsAccepted}
              onChange={(e) => setPublisherTermsAccepted(e.target.checked)}
              required
            />
            <span>我已閱讀並同意上述聲明</span>
          </label>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '刊登中…' : '刊登任務'}
          </button>
          <button type="button" className="btn btn-outline btn-lg">
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
