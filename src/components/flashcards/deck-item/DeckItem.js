import PropTypes from 'prop-types';
import { FiBookOpen, FiPlay, FiEdit2, FiTrash2, FiMoreVertical, FiLock, FiGlobe } from 'react-icons/fi';
import { useState } from 'react';
import './DeckItem.scss';

const DeckItem = ({ deck, onView, onPractice, onEdit, onDelete, currentUser }) => {
  const [showOptions, setShowOptions] = useState(false);

  const isOwner = currentUser && currentUser.userId === deck.userId;

  const getCategoryColor = (category) => {
    const colors = {
      JavaScript: '#f7df1e',
      React: '#61dafb',
      'Node.js': '#68a063',
      Python: '#3776ab',
      'System Design': '#764ba2'
    };
    return colors[category] || '#667eea';
  };

  return (
    <div className="deck-item">
      <div
        className="deck-cover"
        style={{
          background: `linear-gradient(135deg, ${getCategoryColor(deck.category)}15 0%, ${getCategoryColor(
            deck.category
          )}30 100%)`
        }}
      >
        <div className="deck-privacy">
          {deck.privacy === 'private' ? (
            <>
              <FiLock />
              <span>Private</span>
            </>
          ) : (
            <>
              <FiGlobe />
              <span>Public</span>
            </>
          )}
        </div>

        {isOwner && (
          <div className="deck-options">
            <button className="options-toggle" onClick={() => setShowOptions(!showOptions)}>
              <FiMoreVertical />
            </button>

            {showOptions && (
              <>
                <div className="options-overlay" onClick={() => setShowOptions(false)}></div>
                <div className="options-menu">
                  <button
                    className="option-item"
                    onClick={() => {
                      onEdit(deck);
                      setShowOptions(false);
                    }}
                  >
                    <FiEdit2 />
                    <span>Edit</span>
                  </button>
                  <button
                    className="option-item delete"
                    onClick={() => {
                      onDelete(deck._id);
                      setShowOptions(false);
                    }}
                  >
                    <FiTrash2 />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="deck-stats-badge">
          <FiBookOpen />
          <span>{deck.cardsCount} cards</span>
        </div>
      </div>

      <div className="deck-content">
        <div className="deck-header">
          <h3 className="deck-name">{deck.name}</h3>
          <span className="deck-category" style={{ backgroundColor: getCategoryColor(deck.category) }}>
            {deck.category}
          </span>
        </div>

        {deck.description && <p className="deck-description">{deck.description}</p>}

        <div className="deck-meta">
          <div className="deck-author">
            <div className="author-avatar" style={{ backgroundColor: deck.avatarColor || '#9c27b0' }}>
              {deck.profilePicture ? (
                <img src={deck.profilePicture} alt={deck.username} />
              ) : (
                <span>{deck.username?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <span className="author-name">{deck.username}</span>
          </div>

          <div className="deck-likes">❤️ {deck.likesCount}</div>
        </div>

        <div className="deck-actions">
          <button className="action-button primary" onClick={() => onPractice(deck._id)}>
            <FiPlay />
            <span>Practice</span>
          </button>
          <button className="action-button secondary" onClick={() => onView(deck._id)}>
            <FiBookOpen />
            <span>View Cards</span>
          </button>
        </div>
      </div>
    </div>
  );
};

DeckItem.propTypes = {
  deck: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    privacy: PropTypes.string.isRequired,
    cardsCount: PropTypes.number.isRequired,
    likesCount: PropTypes.number,
    userId: PropTypes.string,
    username: PropTypes.string,
    avatarColor: PropTypes.string,
    profilePicture: PropTypes.string
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onPractice: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  currentUser: PropTypes.object
};

export default DeckItem;
