import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { categories } from '../data/mockTasks'
import { apiFetch } from '../apiClient'
import './TaskListPage.css'

export default function TaskListPage() {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await apiFetch('/api/tasks')
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
  }, [])

  const filteredTasks = tasks.filter((task) => {
    const matchCategory = !selectedCategory || task.category === selectedCategory
    const matchSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

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

      <div className="task-list">
        {loading && <p className="no-results">載入中…</p>}
        {error && !loading && <p className="no-results">{error}</p>}
        {!loading && !error && (
          <>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <p className="no-results">目前沒有符合條件的任務</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
