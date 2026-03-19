import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './LevelHeader.scss';

export function LevelHeader({ level }) {
  const trackCategory = level.category === 'ui' || level.category === 'api' ? 'playwright' : level.category;
  const backTo = `/app/game/track/${trackCategory}`;

  return (
    <div className="level-header">
      <Link to={backTo} className="level-back-link">
        ← Back to Track
      </Link>
      <div className="level-meta">
        <span className="level-number">Level {level.order}</span>
        <span className="level-xp">+{level.xpReward} XP</span>
        <div className="level-tags">
          {level.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <h2 className="level-title">{level.title}</h2>
      <p className="level-story">{level.story}</p>
      <div className="level-objective">
        <span className="objective-label">🎯 Objective:</span>
        <span className="objective-text">{level.objective}</span>
      </div>
    </div>
  );
}

LevelHeader.propTypes = {
  level: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    xpReward: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    objective: PropTypes.string.isRequired
  }).isRequired
};
