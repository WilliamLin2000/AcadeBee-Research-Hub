import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { categories } from '../data/mockTasks'
import { apiFetch } from '../apiClient'
import './DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [myPostedTasks, setMyPostedTasks] = useState([])
  const [favoriteTasks, setFavoriteTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const raw = window.localStorage.getItem('currentUser')
    const user = raw ? JSON.parse(raw) : null
    if (!user) {
      navigate('/login')
      return
    }
    setCurrentUser(user)

    const fetchMyTasks = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await apiFetch(`/api/my-tasks?publisherId=${user.id}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || '取得我的任務失敗')
        }

        const enriched = data.map((task) => {
          const cat = categories.find((c) => c.value === task.category)
          return {
            ...task,
            categoryLabel: cat ? cat.label : task.category,
          }
        })

        setMyPostedTasks(enriched)
      } catch (err) {
        setError(err.message || '取得我的任務失敗')
      } finally {
        setLoading(false)
      }
    }

    const fetchFavorites = async () => {
      try {
        const res = await apiFetch(`/api/my-favorites?userId=${user.id}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || '取得收藏任務失敗')
        }
        const enriched = data.map((task) => {
          const cat = categories.find((c) => c.value === task.category)
          return {
            ...task,
            categoryLabel: cat ? cat.label : task.category,
          }
        })
        setFavoriteTasks(enriched)
      } catch (err) {
        console.error(err)
      }
    }

    fetchMyTasks()
    fetchFavorites()
  }, [navigate])

  return (
    <div className="dashboard-page">
      <h1>我的研究儀表板</h1>

      <section className="dashboard-section">
        <h2>我刊登的任務</h2>
        <div className="dashboard-task-grid">
          {loading && <p className="empty-state">載入中…</p>}
          {error && !loading && <p className="empty-state">{error}</p>}
          {!loading && !error && (
            <>
              {myPostedTasks.length > 0 ? (
                myPostedTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <p className="empty-state">
                  尚未刊登任何任務。<Link to="/tasks/new">刊登第一個任務</Link>
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>我的收藏任務</h2>
        <div className="dashboard-task-grid">
          {favoriteTasks.length > 0 ? (
            favoriteTasks.map((task) => (
              <TaskCard key={task.id} task={task} currentUser={currentUser} />
            ))
          ) : (
            <p className="empty-state">尚未收藏任何任務。</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>快速操作</h2>
        <div className="quick-actions">
          <Link to="/tasks/new" className="quick-action-card">
            <span className="quick-action-icon">➕</span>
            <span>刊登新任務</span>
          </Link>
          <Link to="/tasks" className="quick-action-card">
            <span className="quick-action-icon">🔍</span>
            <span>瀏覽任務</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
