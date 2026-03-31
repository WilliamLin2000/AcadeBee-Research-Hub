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
      <h1>瀏覽任務</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="搜尋任務標題或描述..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-row">
          <label>預算範圍（NT$）：</label>
          <input
            type="number"
            placeholder="最低"
            min="0"
            className="budget-input"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
          />
          <span>～</span>
          <input
            type="number"
            placeholder="最高"
            min="0"
            className="budget-input"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
          />
        </div>
        <div className="filter-row filter-row-field">
          <label htmlFor="task-list-field">學術領域：</label>
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
        <div className="category-filters">
          <button
            className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            全部類型
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
    </div>
  )
}
