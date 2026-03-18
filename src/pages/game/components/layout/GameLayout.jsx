import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProgress } from '../../hooks/useProgress';
import './GameLayout.scss';

export function GameLayout() {
  const { trackXP, completedLevels, totalLevels } = useProgress();
  const { profile } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="game-layout">
      <nav className="top-nav">
        <Link to="/app/game" className="nav-brand">
          <span className="brand-icon">⚔️</span>
          <span className="brand-text">Test Quest</span>
        </Link>

        <div className="nav-center">
          {location.pathname !== '/app/game' && location.pathname !== '/app/game/' && (
            <Link to="/app/game" className="nav-link">
              Level Map
            </Link>
          )}
        </div>

        <div className="nav-right">
          <button className="home-btn" onClick={() => navigate('/')}>
            🏠 Home
          </button>
          <div className="xp-chip">
            <span className="xp-icon">🎭</span>
            <span className="xp-value">{(trackXP.playwright ?? 0).toLocaleString()} XP</span>
          </div>
          <div className="xp-chip xp-chip--cypress">
            <span className="xp-icon">🌲</span>
            <span className="xp-value">{(trackXP['cypress-ui'] ?? 0).toLocaleString()} XP</span>
          </div>
          <div className="progress-chip">
            <span>
              {completedLevels.length}/{totalLevels}
            </span>
            <span className="progress-label">Levels</span>
          </div>

          {profile && (
            <div className="auth-section">
              <div className="avatar-circle" style={{ background: profile.avatarColor }}>
                {profile.username ? profile.username[0].toUpperCase() : '?'}
              </div>
              <span className="nav-username">{profile.username}</span>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
