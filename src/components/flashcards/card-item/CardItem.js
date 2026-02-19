import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiThumbsUp, FiMessageCircle, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import './CardItem.scss';

const CardItem = ({ card, onFlip, onBookmark, onLike, onComment, onEdit, onDelete, currentUser }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip(card._id);
  };

  const isOwner = currentUser && currentUser.userId === card.userId;

  return (
    <div className={`card-item ${isFlipped ? 'flipped' : ''}`}>
      <div className="card-inner">
        {/* Front - Question Side */}
        <div className="card-face card-front">
          <div className="card-header">
            <div className="card-author">
              <div className="author-avatar" style={{ backgroundColor: card.avatarColor }}>
                {card.profilePicture ? (
                  <img src={card.profilePicture} alt={card.username} />
                ) : (
                  <span>{card.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="author-name">{card.username}</span>
            </div>
            <div className="card-badges">
              <span className="category-badge">{card.category}</span>
              {card.difficulty && <span className="difficulty-badge">{card.difficulty}</span>}
            </div>
          </div>

          <div className="card-content">
            <div className="question-label">Question</div>
            <h3 className="question-text">{card.question}</h3>
            {card.questionCodeSnippet && (
              <pre className="code-block">
                <code>{card.questionCodeSnippet}</code>
              </pre>
            )}
          </div>

          <button className="flip-button" onClick={handleFlip}>
            Show Answer →
          </button>

          {isOwner && (
            <div className="card-menu">
              <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>
                <FiMoreHorizontal />
              </button>
              {showMenu && (
                <>
                  <div className="menu-overlay" onClick={() => setShowMenu(false)}></div>
                  <div className="menu-dropdown">
                    <button
                      onClick={() => {
                        onEdit(card);
                        setShowMenu(false);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(card._id);
                        setShowMenu(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Back - Answer Side */}
        <div className="card-face card-back">
          <div className="card-header">
            <div className="card-author">
              <div className="author-avatar" style={{ backgroundColor: card.avatarColor }}>
                {card.profilePicture ? (
                  <img src={card.profilePicture} alt={card.username} />
                ) : (
                  <span>{card.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="author-name">{card.username}</span>
            </div>
            <div className="card-badges">
              <span className="category-badge">{card.category}</span>
              {card.difficulty && <span className="difficulty-badge">{card.difficulty}</span>}
            </div>
          </div>

          <div className="card-content">
            <div className="answer-label">Answer</div>
            <p className="answer-text">{card.answer}</p>
            {card.answerCodeSnippet && (
              <pre className="code-block">
                <code>{card.answerCodeSnippet}</code>
              </pre>
            )}
          </div>

          <button className="flip-button" onClick={handleFlip}>
            ← Back to Question
          </button>
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button className="action-button" onClick={() => onLike(card._id)}>
          <FiThumbsUp />
          <span>{card.likesCount}</span>
        </button>
        <button className="action-button" onClick={() => onComment(card._id)}>
          <FiMessageCircle />
          <span>{card.commentsCount}</span>
        </button>
        <button className="action-button" onClick={() => onBookmark(card._id)}>
          <FiBookmark />
          <span>{card.bookmarksCount}</span>
        </button>
      </div>
    </div>
  );
};

CardItem.propTypes = {
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatarColor: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string,
    questionCodeSnippet: PropTypes.string,
    answerCodeSnippet: PropTypes.string,
    likesCount: PropTypes.number,
    commentsCount: PropTypes.number,
    bookmarksCount: PropTypes.number,
    userId: PropTypes.string
  }).isRequired,
  onFlip: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  currentUser: PropTypes.object
};

export default CardItem;
