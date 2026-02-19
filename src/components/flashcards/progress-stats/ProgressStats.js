import PropTypes from 'prop-types';
import { FiBookOpen, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import './ProgressStats.scss';

const ProgressStats = ({ stats }) => {
  const { totalCards, studiedCards, masteredCards, cardsToReview, currentStreak } = stats;

  const studiedPercentage = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;
  const masteredPercentage = studiedCards > 0 ? Math.round((masteredCards / studiedCards) * 100) : 0;

  return (
    <div className="progress-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FiBookOpen />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {studiedCards}/{totalCards}
            </div>
            <div className="stat-label">Cards Studied</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${studiedPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon mastered">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{masteredCards}</div>
            <div className="stat-label">Mastered</div>
            {studiedCards > 0 && <div className="stat-subtext">{masteredPercentage}% of studied</div>}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon due">
            <FiClock />
          </div>
          <div className="stat-content">
            <div className="stat-value">{cardsToReview}</div>
            <div className="stat-label">Due for Review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon streak">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <div className="stat-value">{currentStreak}</div>
            <div className="stat-label">Day Streak</div>
            {currentStreak > 0 && <div className="stat-subtext">🔥 Keep it up!</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

ProgressStats.propTypes = {
  stats: PropTypes.shape({
    totalCards: PropTypes.number.isRequired,
    studiedCards: PropTypes.number.isRequired,
    masteredCards: PropTypes.number.isRequired,
    cardsToReview: PropTypes.number.isRequired,
    currentStreak: PropTypes.number.isRequired
  }).isRequired
};

export default ProgressStats;
