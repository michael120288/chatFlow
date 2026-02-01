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

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="navbar-brand">Chatty</div>
        <div className="navbar-buttons">
          <button onClick={handleChatClick} className="navbar-button">
            Chat
          </button>
          <button onClick={handleQAPracticeClick} className="navbar-button">
            QA Practice
          </button>
        </div>
      </nav>
      <div className="home-content">
        <h1 className="home-title">Welcome to Chatty</h1>
        <p className="home-description">Connect with friends and start chatting</p>
        <div className="home-links">
          <button onClick={handleChatClick} className="home-link chat-link">
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
