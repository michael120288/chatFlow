import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiBookmark, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CardItem from '@components/flashcards/card-item/CardItem';
import './Bookmarks.scss';

const Bookmarks = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const [bookmarkedCards, setBookmarkedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data - will be replaced with API calls
  const mockBookmarkedCards = [
    {
      _id: '1',
      question: 'What is React?',
      answer: 'React is a JavaScript library for building user interfaces.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const App = () => <div>Hello</div>;',
      likesCount: 15,
      commentsCount: 3,
      bookmarksCount: 8,
      studyCount: 42,
      username: 'john_doe',
      avatarColor: '#9c27b0',
      createdAt: new Date()
    },
    {
      _id: '2',
      question: 'What is useState?',
      answer: 'useState is a React Hook that lets you add state to function components.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const [count, setCount] = useState(0);',
      likesCount: 23,
      commentsCount: 7,
      bookmarksCount: 12,
      studyCount: 67,
      username: 'jane_smith',
      avatarColor: '#f44336',
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    // Load bookmarked cards - will be replaced with API call
    setTimeout(() => {
      setBookmarkedCards(mockBookmarkedCards);
      setIsLoading(false);
      setTotalPages(1);
    }, 500);
  }, [currentPage]);

  const handleFlip = (cardId) => {
    console.log('Flipped card:', cardId);
  };

  const handleBookmark = (cardId) => {
    // Remove from bookmarks
    setBookmarkedCards((prev) => prev.filter((card) => card._id !== cardId));
    console.log('Removed bookmark:', cardId);
  };

  const handleLike = (cardId) => {
    console.log('Liked card:', cardId);
  };

  const handleComment = (cardId) => {
    console.log('Comment on card:', cardId);
  };

  const handleEdit = (cardId) => {
    console.log('Edit card:', cardId);
  };

  const handleDelete = (cardId) => {
    console.log('Delete card:', cardId);
  };

  const handleBackToCards = () => {
    navigate('/app/social/flashcards');
  };

  if (isLoading) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your bookmarked cards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <button className="back-button" onClick={handleBackToCards}>
            <FiArrowLeft />
            <span>Back to Cards</span>
          </button>
          <div className="header-content">
            <div className="header-icon">
              <FiBookmark />
            </div>
            <div className="header-text">
              <h1>Bookmarked Cards</h1>
              <p>Your saved cards for quick access</p>
            </div>
          </div>
        </div>

        {bookmarkedCards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FiBookmark />
            </div>
            <h2>No Bookmarked Cards</h2>
            <p>
              You haven&apos;t bookmarked any cards yet. Start exploring cards and bookmark the ones you want to save!
            </p>
            <button className="primary-button" onClick={handleBackToCards}>
              Browse Cards
            </button>
          </div>
        ) : (
          <>
            <div className="bookmarks-count">
              <span>
                {bookmarkedCards.length} bookmarked card{bookmarkedCards.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="bookmarks-list">
              {bookmarkedCards.map((card) => (
                <CardItem
                  key={card._id}
                  card={card}
                  onFlip={handleFlip}
                  onBookmark={handleBookmark}
                  onLike={handleLike}
                  onComment={handleComment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  currentUser={profile}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
