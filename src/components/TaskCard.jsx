import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import './TaskCard.css'

export default function TaskCard({ task, currentUser, onToggleFavorite }) {
  const navigate = useNavigate()

  const handleCardClick = (e) => {
    // 若點擊的是收藏按鈕，不導向詳情頁
    if (e.target.closest('.task-card-fav-btn')) {
      e.preventDefault()
      return
    }
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUser?.id) {
      navigate('/login')
      return
    }
    if (onToggleFavorite) {
      onToggleFavorite(task)
    }
  }

  return (
    <Link to={`/tasks/${task.id}`} className="task-card" onClick={handleCardClick}>
      <div className="task-card-header">
        <span className="task-card-category">{task.categoryLabel}</span>
        <div className="task-card-header-right">
          {onToggleFavorite && (
            <button
              type="button"
              className={`task-card-fav-btn ${task.isFavorite ? 'active' : ''}`}
              aria-label={task.isFavorite ? '取消收藏此任務' : '收藏此任務'}
              title={currentUser ? (task.isFavorite ? '取消收藏' : '加入收藏清單') : '請先登入後才能收藏任務'}
              onClick={handleFavoriteClick}
            >
              <Heart
                size={18}
                strokeWidth={task.isFavorite ? 0 : 2}
                fill={task.isFavorite ? 'currentColor' : 'none'}
                aria-hidden
              />
            </button>
          )}
          <span className="task-card-budget">NT$ {task.budget?.toLocaleString()}</span>
        </div>
      </div>
      <h3 className="task-card-title">{task.title}</h3>
      <p className="task-card-desc">{task.description}</p>
      <div className="task-card-footer">
        <div className="task-card-skills">
          {task.skills?.slice(0, 3).map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
        <span className="task-card-deadline">截止：{task.deadline}</span>
      </div>
    </Link>
  )
}
