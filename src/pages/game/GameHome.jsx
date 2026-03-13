import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameService } from '@services/api/game/game.service';
import { XPBar } from './components/progress/XPBar';
import { useProgress } from './hooks/useProgress';
import './GameHome.scss';

export function GameHome() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { completedLevels, resetProgress } = useProgress();

  useEffect(() => {
    gameService
      .getLevels()
      .then(setLevels)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const uiLevels = levels.filter((l) => l.category === 'ui');
  const apiLevels = levels.filter((l) => l.category === 'api');

  const uiDone = uiLevels.filter((l) => completedLevels.includes(l.id)).length;
  const apiDone = apiLevels.filter((l) => completedLevels.includes(l.id)).length;

  const uiTotalXP = uiLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const apiTotalXP = apiLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const grandTotalXP = uiTotalXP + apiTotalXP;

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-icon">⚔️</div>
          <h1 className="hero-title">Test Quest</h1>
          <p className="hero-tagline">Learn Playwright through epic story-driven challenges</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-n">{loading ? '…' : levels.length}</div>
            <div className="stat-l">Levels</div>
          </div>
          <div className="stat-card">
            <div className="stat-n">{loading ? '…' : grandTotalXP.toLocaleString()}</div>
            <div className="stat-l">Total XP</div>
          </div>
          <div className="stat-card">
            <div className="stat-n">2</div>
            <div className="stat-l">Tracks</div>
          </div>
        </div>
      </div>

      <XPBar />

      <div className="home-body">
        {loading && <div className="loading-msg">Loading levels...</div>}
        {error && <div className="error-msg">Failed to load levels: {error}</div>}

        {!loading && !error && (
          <div className="tracks-row">
            <Link to="/app/game/track/ui" className="track-card track-ui">
              <div className="tc-icon">🖥️</div>
              <div className="tc-body">
                <h2 className="tc-title">Playwright UI Testing</h2>
                <p className="tc-desc">
                  Selectors, clicks, forms, keyboard, viewport, screenshots, drag &amp; drop, iframes and more
                </p>
                <div className="tc-meta">
                  <span className="tc-count">{uiLevels.length} Levels</span>
                  <span className="tc-xp">{uiTotalXP.toLocaleString()} XP</span>
                </div>
                <div className="tc-progress-track">
                  <div
                    className="tc-progress-fill"
                    style={{ width: `${uiLevels.length ? (uiDone / uiLevels.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="tc-done">
                  {uiDone} / {uiLevels.length} complete
                </span>
              </div>
              <div className="tc-arrow">→</div>
            </Link>

            <Link to="/app/game/track/api" className="track-card track-api">
              <div className="tc-icon">🔌</div>
              <div className="tc-body">
                <h2 className="tc-title">Playwright API Testing</h2>
                <p className="tc-desc">
                  Network interception, route mocking, request &amp; response monitoring, headers and more
                </p>
                <div className="tc-meta">
                  <span className="tc-count">{apiLevels.length} Levels</span>
                  <span className="tc-xp">{apiTotalXP.toLocaleString()} XP</span>
                </div>
                <div className="tc-progress-track">
                  <div
                    className="tc-progress-fill"
                    style={{ width: `${apiLevels.length ? (apiDone / apiLevels.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="tc-done">
                  {apiDone} / {apiLevels.length} complete
                </span>
              </div>
              <div className="tc-arrow">→</div>
            </Link>
          </div>
        )}
      </div>

      <div className="home-footer">
        <button
          className="reset-btn"
          onClick={() => {
            if (window.confirm('Reset all progress?')) resetProgress();
          }}
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
}
