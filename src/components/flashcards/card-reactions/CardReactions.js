import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiThumbsUp, FiHeart, FiAward } from 'react-icons/fi';
import './CardReactions.scss';

const CardReactions = ({ cardId, reactions, userReaction, onReact, currentUser }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const reactionTypes = [
    { type: 'like', icon: <FiThumbsUp />, label: 'Like', color: '#3b82f6' },
    { type: 'love', icon: <FiHeart />, label: 'Love', color: '#ef4444' },
    { type: 'insightful', icon: <FiAward />, label: 'Insightful', color: '#f59e0b' }
  ];

  const handleReactionClick = (type) => {
    if (userReaction?.type === type) {
      // Remove reaction if clicking the same one
      onReact(cardId, null);
    } else {
      // Add or change reaction
      onReact(cardId, type);
    }
    setShowReactionPicker(false);
  };

  const getTotalReactions = () => {
    if (!reactions) return 0;
    return Object.values(reactions).reduce((sum, count) => sum + count, 0);
  };

  const totalReactions = getTotalReactions();

  return (
    <div className="card-reactions">
      <div className="reactions-summary">
        {reactions && Object.keys(reactions).length > 0 && (
          <div className="reaction-counts">
            {reactionTypes.map((reaction) => {
              const count = reactions[reaction.type] || 0;
              if (count === 0) return null;
              return (
                <div key={reaction.type} className="reaction-count-item" style={{ color: reaction.color }}>
                  <span className="reaction-icon">{reaction.icon}</span>
                  <span className="reaction-number">{count}</span>
                </div>
              );
            })}
          </div>
        )}

        <button
          className={`reaction-button ${userReaction ? 'reacted' : ''}`}
          onClick={() => setShowReactionPicker(!showReactionPicker)}
        >
          {userReaction ? (
            <>
              {reactionTypes.find((r) => r.type === userReaction.type)?.icon}
              <span>{reactionTypes.find((r) => r.type === userReaction.type)?.label}</span>
            </>
          ) : (
            <>
              <FiThumbsUp />
              <span>React</span>
            </>
          )}
        </button>
      </div>

      {showReactionPicker && (
        <>
          <div className="reaction-picker-overlay" onClick={() => setShowReactionPicker(false)}></div>
          <div className="reaction-picker">
            {reactionTypes.map((reaction) => (
              <button
                key={reaction.type}
                className={`reaction-option ${userReaction?.type === reaction.type ? 'active' : ''}`}
                onClick={() => handleReactionClick(reaction.type)}
                style={{ color: reaction.color }}
              >
                <span className="reaction-option-icon">{reaction.icon}</span>
                <span className="reaction-option-label">{reaction.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {totalReactions > 0 && (
        <div className="reactions-text">
          {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
        </div>
      )}
    </div>
  );
};

CardReactions.propTypes = {
  cardId: PropTypes.string.isRequired,
  reactions: PropTypes.object,
  userReaction: PropTypes.shape({
    type: PropTypes.string,
    _id: PropTypes.string
  }),
  onReact: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};

export default CardReactions;
