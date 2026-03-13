import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gameService } from '@services/api/game/game.service';
import { useProgress } from './hooks/useProgress';
import { XPBar } from './components/progress/XPBar';
import './Track.scss';

export function Track() {
  const { category } = useParams();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { completedLevels } = useProgress();

  useEffect(() => {
    gameService
      .getLevels()
      .then(setLevels)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const isUi = category === 'ui';
  const trackLevels = levels.filter((l) => l.category === category).sort((a, b) => a.order - b.order);

  const isUnlocked = (level) => {
    const idx = trackLevels.findIndex((l) => l.id === level.id);
    if (idx === 0) return true;
    return completedLevels.includes(trackLevels[idx - 1].id);
  };

  const doneLevels = trackLevels.filter((l) => completedLevels.includes(l.id));
  const totalXP = trackLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const earnedXP = doneLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const nextLevel = trackLevels.find((l) => !completedLevels.includes(l.id));

  return (
    <div className={`track-page track-${category}`}>
      <div className="track-header">
        <Link to="/app/game" className="back-link">
          ← Home
        </Link>
        <div className="track-header-inner">
          <div className="track-header-icon">{isUi ? '🖥️' : '🔌'}</div>
          <div>
            <h1 className="track-header-title">{isUi ? 'Playwright UI Testing' : 'Playwright API Testing'}</h1>
            <p className="track-header-desc">
              {isUi
                ? 'Master selectors, clicks, forms, keyboard, viewport, visual testing and more'
                : 'Master network interception, route mocking, request monitoring, headers and more'}
            </p>
          </div>
        </div>

        <div className="track-header-stats">
          <div className="th-stat">
            <div className="th-stat-n">
              {doneLevels.length}/{trackLevels.length}
            </div>
            <div className="th-stat-l">Levels</div>
          </div>
          <div className="th-stat">
            <div className="th-stat-n">{earnedXP.toLocaleString()}</div>
            <div className="th-stat-l">XP Earned</div>
          </div>
          <div className="th-stat">
            <div className="th-stat-n">{totalXP.toLocaleString()}</div>
            <div className="th-stat-l">Total XP</div>
          </div>
        </div>

        {!loading && nextLevel && (
          <Link to={`/app/game/${nextLevel.id}`} className="track-cta">
            {doneLevels.length === 0 ? 'Begin Track' : 'Continue Track'}
            <span>→</span>
          </Link>
        )}
      </div>

      <XPBar completedCount={doneLevels.length} totalCount={trackLevels.length} />

      <div className="track-body">
        {loading && <div className="track-loading">Loading levels...</div>}
        {error && <div className="track-error">Failed to load levels: {error}</div>}

        {!loading && !error && (
          <>
            <div className="track-progress-bar">
              <div
                className="track-progress-fill"
                style={{ width: `${trackLevels.length ? (doneLevels.length / trackLevels.length) * 100 : 0}%` }}
              />
            </div>

            <div className="track-grid">
              {trackLevels.map((level, idx) => {
                const done = completedLevels.includes(level.id);
                const unlocked = isUnlocked(level);
                return (
                  <Link
                    key={level.id}
                    to={unlocked ? `/app/game/${level.id}` : '#'}
                    className={`level-card ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                    onClick={(e) => !unlocked && e.preventDefault()}
                  >
                    <div className="card-order">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="card-status">{done ? '✓' : !unlocked ? '🔒' : '▶'}</div>
                    <div className="card-title">{level.title}</div>
                    <div className="card-tags">
                      {level.tags.slice(0, 2).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="card-xp">+{level.xpReward} XP</div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
