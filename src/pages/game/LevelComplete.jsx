import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLevel } from './hooks/useLevel';
import { useProgress } from './hooks/useProgress';
import './LevelComplete.scss';

export function LevelComplete() {
  const { levelId } = useParams();
  const { level } = useLevel(levelId);
  const { xp, completedLevels } = useProgress();
  const [animXP, setAnimXP] = useState(0);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    if (!level) return;
    const target = level.xpReward;
    const step = Math.ceil(target / 40);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setAnimXP(current);
      if (current >= target) clearInterval(interval);
    }, 30);
    const starTimer = setTimeout(() => setShowStars(true), 300);
    return () => {
      clearInterval(interval);
      clearTimeout(starTimer);
    };
  }, [level]);

  if (!level) return null;

  const isJest = level.id.startsWith('jest-');
  const isCypress = level.id.startsWith('cy-');

  const trackConfig = isJest
    ? { total: 255, label: 'Jest', master: 'Jest Master' }
    : isCypress
    ? { total: 560, label: 'Cypress', master: 'Cypress Master' }
    : { total: 365, label: 'Playwright', master: 'Playwright Master' };

  const nextOrder = level.order + 1;
  const isLastLevel = level.order >= trackConfig.total;

  const nextId = isJest
    ? `jest-${String(nextOrder).padStart(2, '0')}`
    : isCypress
    ? `cy-${String(nextOrder).padStart(3, '0')}`
    : `level-${String(nextOrder).padStart(2, '0')}`;

  const trackLevelsCompleted = completedLevels.filter((id) =>
    isJest ? id.startsWith('jest-') : isCypress ? id.startsWith('cy-') : id.startsWith('level-')
  ).length;

  return (
    <div className="complete-page">
      <div className="complete-card">
        <div className={`stars-row ${showStars ? 'visible' : ''}`}>
          <span className="star" style={{ animationDelay: '0ms' }}>
            ⭐
          </span>
          <span className="star big" style={{ animationDelay: '150ms' }}>
            ⭐
          </span>
          <span className="star" style={{ animationDelay: '300ms' }}>
            ⭐
          </span>
        </div>

        <div className="complete-badge">LEVEL {level.order} COMPLETE!</div>
        <h1 className="complete-title">{level.title}</h1>
        <p className="complete-story">You have mastered this challenge!</p>

        <div className="xp-reward-display">
          <div className="xp-amount">+{animXP}</div>
          <div className="xp-unit">XP EARNED</div>
        </div>

        <div className="total-xp">Total XP: {xp.toLocaleString()}</div>
        <div className="levels-done">
          {trackLevelsCompleted} / {trackConfig.total} {trackConfig.label} Levels Complete
        </div>

        <div className="complete-actions">
          {!isLastLevel ? (
            <Link to={`/app/game/${nextId}`} className="btn btn-next">
              Next Level → Level {nextOrder}
            </Link>
          ) : (
            <div className="final-victory">🏆 You have completed ALL levels! True {trackConfig.master}!</div>
          )}
          <Link to="/app/game" className="btn btn-map">
            Level Map
          </Link>
          <Link to={`/app/game/${levelId}`} className="btn btn-retry">
            Play Again
          </Link>
        </div>
      </div>
    </div>
  );
}
