import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiMessageCircle, FiSend, FiEdit2, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import { ProfanityFilter } from '@services/utils/profanity-filter.service';
import './CardComments.scss';

const CardComments = ({ cardId, comments, onAddComment, onEditComment, onDeleteComment, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showOptions, setShowOptions] = useState(null);
  const [profanityError, setProfanityError] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (ProfanityFilter.containsProfanity(commentText)) {
      setProfanityError('Your comment contains inappropriate language.');
      return;
    }
    setProfanityError('');
    onAddComment(cardId, commentText);
    setCommentText('');
  };

  const handleEditSubmit = (commentId) => {
    if (!editText.trim()) return;
    if (ProfanityFilter.containsProfanity(editText)) {
      setProfanityError('Your comment contains inappropriate language.');
      return;
    }
    setProfanityError('');
    onEditComment(commentId, editText);
    setEditingCommentId(null);
    setEditText('');
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.comment);
    setShowOptions(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const formatTime = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <div className="card-comments">
      <div className="comments-header">
        <FiMessageCircle />
        <h3>
          Comments {comments && comments.length > 0 && <span className="comment-count">({comments.length})</span>}
        </h3>
      </div>

      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-avatar" style={{ backgroundColor: comment.avatarColor }}>
                {comment.profilePicture ? (
                  <img src={comment.profilePicture} alt={comment.username} />
                ) : (
                  <span>{comment.username.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.username}</span>
                  <span className="comment-time">{formatTime(comment.createdAt)}</span>

                  {currentUser && currentUser.username === comment.username && (
                    <div className="comment-options">
                      <button
                        className="options-button"
                        onClick={() => setShowOptions(showOptions === comment._id ? null : comment._id)}
                      >
                        <FiMoreHorizontal />
                      </button>

                      {showOptions === comment._id && (
                        <>
                          <div className="options-overlay" onClick={() => setShowOptions(null)}></div>
                          <div className="options-menu">
                            <button className="option-item" onClick={() => handleStartEdit(comment)}>
                              <FiEdit2 />
                              <span>Edit</span>
                            </button>
                            <button
                              className="option-item delete"
                              onClick={() => {
                                onDeleteComment(comment._id);
                                setShowOptions(null);
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
                </div>

                {editingCommentId === comment._id ? (
                  <div className="comment-edit-form">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Edit your comment..."
                      rows="2"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button className="cancel-button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                      <button className="save-button" onClick={() => handleEditSubmit(comment._id)}>
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.comment}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>

      {profanityError && <p className="profanity-error">{profanityError}</p>}
      <form className="comment-form" onSubmit={handleSubmitComment}>
        <div className="form-avatar" style={{ backgroundColor: currentUser?.avatarColor || '#9c27b0' }}>
          {currentUser?.profilePicture ? (
            <img src={currentUser.profilePicture} alt={currentUser.username} />
          ) : (
            <span>{currentUser?.username?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>

        <div className="form-input-wrapper">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows="1"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <button type="submit" className="submit-button" disabled={!commentText.trim()}>
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

CardComments.propTypes = {
  cardId: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      avatarColor: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
      comment: PropTypes.string.isRequired,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
    })
  ),
  onAddComment: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};

export default CardComments;
