import { Link } from 'react-router-dom'
import './TaskCard.css'

export default function TaskCard({ task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="task-card">
      <div className="task-card-header">
        <span className="task-card-category">{task.categoryLabel}</span>
        <span className="task-card-budget">NT$ {task.budget?.toLocaleString()}</span>
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
