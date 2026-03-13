import PropTypes from 'prop-types';
import './LevelHeader.scss';

export function LevelHeader({ level }) {
  return (
    <div className="level-header">
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
    order: PropTypes.number.isRequired,
    xpReward: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    objective: PropTypes.string.isRequired
  }).isRequired
};
