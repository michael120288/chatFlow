import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '@pages/home/Home.scss';

const Home = () => {
  const navigate = useNavigate();
  const { profile, token } = useSelector((state) => state.user);

  const handleChatClick = () => {
    if (profile && token) {
      navigate('/app/social/chat/messages');
    } else {
      navigate('/auth');
    }
  };

  const handleQAPracticeClick = () => {
    // Navigate to QA Practice page
    navigate('/qa-practice');
  };

  // const handleFlashcardsClick = () => {
  //   if (profile && token) {
  //     navigate('/app/social/flashcards');
  //   } else {
  //     navigate('/auth');
  //   }
  // };

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="navbar-brand">QA</div>
      </nav>
      <div className="home-layout">
        <aside className="home-sidebar">
          <div className="sidebar-header">
            <h2>Navigation</h2>
          </div>
          <nav className="sidebar-nav">
            <button className="sidebar-link active" onClick={() => navigate('/')}>
              <span className="sidebar-icon">🏠</span>
              <span className="sidebar-text">Home</span>
            </button>
            <button className="sidebar-link" onClick={handleChatClick}>
              <span className="sidebar-icon">💬</span>
              <span className="sidebar-text">Chat</span>
            </button>
            <button className="sidebar-link" onClick={handleQAPracticeClick}>
              <span className="sidebar-icon">🧪</span>
              <span className="sidebar-text">QA Practice</span>
            </button>
            <button
              className="sidebar-link"
              onClick={() => {
                const token = localStorage.getItem('tq_sso_token');
                window.location.href = token
                  ? `http://localhost:5173/sso?token=${encodeURIComponent(token)}`
                  : 'http://localhost:5173';
              }}
            >
              <span className="sidebar-icon">⚔️</span>
              <span className="sidebar-text">Test Quest</span>
            </button>
            {/* <button className="sidebar-link" onClick={handleFlashcardsClick}>
              <span className="sidebar-icon">🎴</span>
              <span className="sidebar-text">Flashcards</span>
            </button> */}
          </nav>
        </aside>
        <div className="home-content">
          <h1 className="home-title">Welcome to QA page</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
