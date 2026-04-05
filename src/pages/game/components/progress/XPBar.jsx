import PropTypes from 'prop-types';
import { useProgress } from '../../hooks/useProgress';
import './XPBar.scss';

const XP_PER_LEVEL = 500;

export function XPBar({ completedCount, totalCount, xpEarned, tracks }) {
  const { xp, completedLevels, totalLevels } = useProgress();

  const displayXP = xpEarned ?? xp;
  const displayCompleted = completedCount ?? completedLevels.length;
  const displayTotal = totalCount ?? totalLevels;
  const displayPercent = displayTotal > 0 ? Math.round((displayCompleted / displayTotal) * 100) : 0;

  const xpInCurrentLevel = displayXP % XP_PER_LEVEL;
  const xpBarPercent = displayTotal > 0 ? displayPercent : Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100);

  if (tracks) {
    return (
      <div className="xp-bar-container">
        <div className="xp-bar-info">
          <div className="xp-bar-left">
            <span className="xp-total">✨ {displayXP.toLocaleString()} XP</span>
            <span className="xp-label">Total earned</span>
          </div>
        </div>
        <div className="xp-tracks">
          {tracks.map((track) => {
            const pct = track.total > 0 ? Math.round((track.done / track.total) * 100) : 0;
            return (
              <div key={track.label} className="xp-track-row">
                <div className="xp-track-header">
                  <span className="xp-track-label" style={{ color: track.color }}>
                    {track.icon} {track.label}
                  </span>
                  <span className="xp-track-meta">
                    <span className="xp-track-done">
                      {track.done}/{track.total}
                    </span>
                    <span className="xp-track-xp" style={{ color: track.color }}>
                      {track.xpEarned.toLocaleString()} XP
                    </span>
                  </span>
                </div>
                <div className="xp-bar-track">
                  <div className="xp-bar-fill" style={{ width: `${pct}%`, background: track.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-info">
        <div className="xp-bar-left">
          <span className="xp-total">✨ {displayXP.toLocaleString()} XP</span>
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
  totalCount: PropTypes.number,
  xpEarned: PropTypes.number,
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      done: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      xpEarned: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  )
};
