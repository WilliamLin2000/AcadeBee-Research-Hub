import { Link } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { mockTasks } from '../data/mockTasks'
import './HomePage.css'

export default function HomePage() {
  const featuredTasks = mockTasks.slice(0, 3)

  return (
    <div className="home-page">
      <section className="hero">
        <h1>AcadeBee | 學術小蜜蜂</h1>
        <p>刊登研究需求，或承接任務賺取外快。研究難題、程式設計、數據標註，一站完成。</p>
        <div className="hero-actions">
          <Link to="/tasks/new" className="btn btn-primary btn-lg">刊登任務</Link>
          <Link to="/tasks" className="btn btn-outline btn-lg">瀏覽任務</Link>
        </div>
      </section>

      <section className="categories">
        <h2>任務類型</h2>
        <div className="category-grid">
          <Link to="/tasks?category=data_analysis" className="category-card">
            <span className="category-icon">📊</span>
            <span>研究難題</span>
          </Link>
          <Link to="/tasks?category=data_cleaning" className="category-card">
            <span className="category-icon">🧹</span>
            <span>數據清理</span>
          </Link>
          <Link to="/tasks?category=programming" className="category-card">
            <span className="category-icon">💻</span>
            <span>程式設計</span>
          </Link>
          <Link to="/tasks?category=data_labeling" className="category-card">
            <span className="category-icon">🏷️</span>
            <span>數據標註</span>
          </Link>
        </div>
      </section>

      <section className="featured-tasks">
        <div className="section-header">
          <h2>熱門任務</h2>
          <Link to="/tasks" className="link-more">查看全部 →</Link>
        </div>
        <div className="task-grid">
          {featuredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  )
}
