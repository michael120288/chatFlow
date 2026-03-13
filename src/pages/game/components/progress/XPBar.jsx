import PropTypes from 'prop-types';
import { useProgress } from '../../hooks/useProgress';
import './XPBar.scss';

const XP_PER_LEVEL = 500;

export function XPBar({ completedCount, totalCount }) {
  const { xp, completedLevels, totalLevels } = useProgress();

  const displayCompleted = completedCount ?? completedLevels.length;
  const displayTotal = totalCount ?? totalLevels;
  const displayPercent = displayTotal > 0 ? Math.round((displayCompleted / displayTotal) * 100) : 0;

  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const xpBarPercent = Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100);

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-info">
        <div className="xp-bar-left">
          <span className="xp-total">✨ {xp.toLocaleString()} XP</span>
          <span className="xp-label">Total earned</span>
        </div>
        <div className="xp-bar-right">
          <span className="levels-complete">
            {displayCompleted}/{displayTotal} Levels
          </span>
          <span className="levels-label">{displayPercent}% Complete</span>
        </div>
      </div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${xpBarPercent}%` }} />
      </div>
    </div>
  );
}

XPBar.propTypes = {
  completedCount: PropTypes.number,
  totalCount: PropTypes.number
};
