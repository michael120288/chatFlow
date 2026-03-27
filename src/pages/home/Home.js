import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearUser, addUser } from '@redux/reducers/user/user.reducer';
import { userService } from '@services/api/user/user.service';
import '@pages/home/Home.scss';

const features = [
  {
    id: 'qa',
    icon: '🧪',
    title: 'QA Practice',
    description:
      '39 interactive scenarios covering forms, drag-and-drop, WebSocket, virtual scroll, and more — built for Playwright automation practice.',
    cta: 'Start Practising',
    path: '/qa-practice',
    accent: '#667eea'
  },
  {
    id: 'chat',
    icon: '💬',
    title: 'Social Chat',
    description:
      'Real-time messaging, social feeds, reactions, photo & video sharing, followers, and notifications — a full social platform to automate.',
    cta: 'Open Chat',
    path: null,
    accent: '#11998e'
  },
  {
    id: 'game',
    icon: '⚔️',
    title: 'Test Quest',
    description:
      'Level-based Playwright learning game. Write real test code, run it against live targets, earn XP, and progress through tracks.',
    cta: 'Play Now',
    path: '/app/game',
    accent: '#f7b124'
  }
];

const stats = [
  { number: '1,180', label: 'Coding Challenges' },
  { number: '39', label: 'QA Scenarios' },
  { number: '3', label: 'Test Tracks' },
  { number: '1', label: 'Platform' }
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, token } = useSelector((state) => state.user);
  const isLoggedIn = !!(profile && token);

  useEffect(() => {
    if (!token) {
      userService
        .checkCurrentUser()
        .then((res) => {
          if (res.data.token) {
            dispatch(addUser({ token: res.data.token, profile: res.data.user }));
          }
        })
        .catch(() => {
          // Not authenticated — stay on home with Sign In
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    try {
      await userService.logoutUser();
    } catch {
      // ignore API errors
    }
    dispatch(clearUser());
  };

  const handleFeatureClick = (feature) => {
    if (!feature.path) {
      navigate(profile && token ? '/app/social/chat/messages' : '/auth');
      return;
    }
    if (feature.path === '/app/game' && !(profile && token)) {
      navigate('/auth');
      return;
    }
    navigate(feature.path);
  };

  return (
    <div className="home-landing">
      {/* Navbar */}
      <nav className="home-landing-nav">
        <div className="home-landing-brand">
          <span className="home-landing-brand-dot" />
          QA Hub
        </div>
        <div className="home-landing-nav-actions">
          {isLoggedIn ? (
            <button className="home-landing-nav-btn home-landing-nav-btn--ghost" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <button className="home-landing-nav-btn home-landing-nav-btn--primary" onClick={() => navigate('/auth')}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="home-landing-hero">
        <div className="home-landing-hero-bg">
          <div className="home-landing-orb home-landing-orb--1" />
          <div className="home-landing-orb home-landing-orb--2" />
          <div className="home-landing-orb home-landing-orb--3" />
        </div>
        <div className="home-landing-hero-content">
          <span className="home-landing-badge">Playwright & Cypress Testing Platform</span>
          <h1 className="home-landing-title">
            Master QA Automation
            <br />
            <span className="home-landing-title-accent">One Scenario at a Time</span>
          </h1>
          <p className="home-landing-subtitle">
            A hands-on playground with 39 real UI scenarios, a social platform to automate, and 1,180 coding challenges
            across Playwright, Cypress &amp; Jest learning tracks — all in one place.
          </p>
          <div className="home-landing-actions">
            <button
              className="home-landing-hero-btn home-landing-hero-btn--primary"
              onClick={() => navigate('/qa-practice')}
            >
              Start Practising →
            </button>
            {isLoggedIn ? (
              <button className="home-landing-hero-btn home-landing-hero-btn--ghost" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <button className="home-landing-hero-btn home-landing-hero-btn--ghost" onClick={() => navigate('/auth')}>
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="home-landing-stats">
          {stats.map((s) => (
            <div key={s.label} className="home-landing-stat">
              <span className="home-landing-stat-number">{s.number}</span>
              <span className="home-landing-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="home-landing-features">
        <h2 className="home-landing-features-title">Everything You Need to Practice</h2>
        <div className="home-landing-cards">
          {features.map((f) => (
            <div key={f.id} className="home-landing-card" style={{ '--card-accent': f.accent }}>
              <div className="home-landing-card-icon">{f.icon}</div>
              <h3 className="home-landing-card-title">{f.title}</h3>
              <p className="home-landing-card-desc">{f.description}</p>
              <button className="home-landing-card-btn" onClick={() => handleFeatureClick(f)}>
                {f.cta} <span className="home-landing-card-btn-arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-landing-footer">
        <span>Built for QA engineers learning Playwright automation</span>
      </footer>
    </div>
  );
};

export default Home;
