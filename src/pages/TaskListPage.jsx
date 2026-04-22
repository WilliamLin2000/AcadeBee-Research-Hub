import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { categories } from '../data/mockTasks'
import { academicFields } from '../data/academicFields'
import { apiFetch } from '../apiClient'
import './TaskListPage.css'

export default function TaskListPage() {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const fieldFromUrl = searchParams.get('field')
  const searchFromUrl = searchParams.get('search')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '')
  const [selectedField, setSelectedField] = useState(fieldFromUrl || '')
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || '')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const raw = window.localStorage.getItem('currentUser')
    const user = raw ? JSON.parse(raw) : null
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '')
    setSelectedField(searchParams.get('field') || '')
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.set('category', selectedCategory)
        if (selectedField) params.set('field', selectedField)
        if (searchQuery.trim()) params.set('search', searchQuery.trim())
        if (budgetMin.trim()) params.set('budgetMin', budgetMin.trim())
        if (budgetMax.trim()) params.set('budgetMax', budgetMax.trim())
        if (currentUser?.id) params.set('userId', currentUser.id)
        const qs = params.toString()
        const url = qs ? `/api/tasks?${qs}` : '/api/tasks'
        const res = await apiFetch(url)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || '取得任務列表失敗')
        }

        const enriched = data.map((task) => {
          const cat = categories.find((c) => c.value === task.category)
          return {
            ...task,
            categoryLabel: cat ? cat.label : task.category,
          }
        })

        setTasks(enriched)
      } catch (err) {
        setError(err.message || '取得任務列表失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [selectedCategory, selectedField, searchQuery, budgetMin, budgetMax, currentUser])

  const handleToggleFavorite = async (task) => {
    if (!currentUser?.id) return
    const method = task.isFavorite ? 'DELETE' : 'POST'
    try {
      const res = await apiFetch(`/api/tasks/${task.id}/favorite`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || '更新收藏狀態失敗')
      }
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, isFavorite: Boolean(data.favorite) } : t,
        ),
      )
    } catch (err) {
      setError(err.message || '更新收藏狀態失敗')
    }
  }

  return (
    <div className="task-list-page">
      <header className="task-list-hero">
        <div className="task-list-hero-inner">
          <span className="task-list-eyebrow">瀏覽任務</span>
          <h1>尋找下一個研究合作機會</h1>
          <p className="task-list-subtitle">
            篩選適合你專業背景的學術任務 — 從 生物力學、RNA-seq 分析、統計諮詢，到科普寫作與圖表設計，精選已驗證身分的研究需求。
          </p>
        </div>
      </header>

      <div className="task-list-body">
        <aside className="filters">
          <div className="filters-title">篩選條件</div>

          <div className="filter-group">
            <label className="filter-group-label" htmlFor="task-list-search">關鍵字搜尋</label>
            <input
              id="task-list-search"
              type="text"
              placeholder="搜尋任務標題或描述..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-row">
              <label>預算範圍（NT$）</label>
              <input
                type="number"
                placeholder="最低"
                min="0"
                className="budget-input"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />
              <input
                type="number"
                placeholder="最高"
                min="0"
                className="budget-input"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group filter-row-field">
            <label className="filter-group-label" htmlFor="task-list-field">學術領域</label>
            <select
              id="task-list-field"
              className="task-list-field-select"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <option value="">全部領域</option>
              {academicFields.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-group-label">任務類型</span>
            <div className="category-filters">
              <button
                className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="task-list-results">
          <div className="task-list-results-header">
            <div className="task-list-count">
              共 <strong>{tasks.length}</strong> 個任務
              {selectedCategory && categories.find((c) => c.value === selectedCategory)
                ? ` · ${categories.find((c) => c.value === selectedCategory).label}`
                : ''}
            </div>
          </div>

          <div className="task-list">
            {loading && <p className="no-results">載入中…</p>}
            {error && !loading && <p className="no-results">{error}</p>}
            {!loading && !error && (
              <>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      currentUser={currentUser}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))
                ) : (
                  <p className="no-results">目前沒有符合條件的任務</p>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
