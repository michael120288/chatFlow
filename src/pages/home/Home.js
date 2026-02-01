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

  return (
    <div className="home-container">
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
