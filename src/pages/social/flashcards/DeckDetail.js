import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiPlay, FiEdit2, FiTrash2, FiPlus, FiLock, FiGlobe, FiMoreVertical } from 'react-icons/fi';
import CardItem from '@components/flashcards/card-item/CardItem';
import DeckForm from '@components/flashcards/deck-form/DeckForm';
import './DeckDetail.scss';

const DeckDetail = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAddCards, setShowAddCards] = useState(false);
  const [availableCards, setAvailableCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  // Mock data - will be replaced with API calls
  const mockDeck = {
    _id: deckId,
    name: 'React Fundamentals',
    description: 'Core concepts of React including hooks, state, and lifecycle methods',
    category: 'React',
    privacy: 'public',
    cardsCount: 3,
    likesCount: 12,
    userId: profile?.userId,
    username: profile?.username,
    avatarColor: profile?.avatarColor,
    profilePicture: profile?.profilePicture,
    coverImgId: '',
    createdAt: new Date()
  };

  const mockCards = [
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
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      deckId,
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
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      deckId,
      createdAt: new Date()
    },
    {
      _id: '3',
      question: 'What is useEffect?',
      answer: 'useEffect is a React Hook that lets you perform side effects in function components.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'useEffect(() => { /* side effect */ }, [deps]);',
      likesCount: 18,
      commentsCount: 5,
      bookmarksCount: 10,
      studyCount: 55,
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      deckId,
      createdAt: new Date()
    }
  ];

  const mockAvailableCards = [
    {
      _id: '4',
      question: 'What is JSX?',
      answer: 'JSX is a syntax extension for JavaScript that looks similar to HTML.',
      category: 'React'
    },
    {
      _id: '5',
      question: 'What is a component?',
      answer: 'A component is a reusable piece of UI that can contain its own markup, styling, and logic.',
      category: 'React'
    }
  ];

  useEffect(() => {
    // Load deck and its cards - will be replaced with API call
    setTimeout(() => {
      setDeck(mockDeck);
      setCards(mockCards);
      setAvailableCards(mockAvailableCards);
      setIsLoading(false);
    }, 500);
  }, [deckId]);

  const isOwner = profile && deck && profile.userId === deck.userId;

  const handleUpdateDeck = (deckData) => {
    console.log('Updating deck:', deckData);
    setShowEditForm(false);
  };

  const handleDeleteDeck = () => {
    console.log('Deleting deck:', deckId);
    navigate('/app/social/flashcards/my-decks');
  };

  const handleRemoveCard = (cardId) => {
    console.log('Removing card from deck:', cardId);
    setCards((prev) => prev.filter((card) => card._id !== cardId));
  };

  const handlePracticeDeck = () => {
    navigate(`/app/social/flashcards/practice/deck/${deckId}`);
  };

  const handleAddCards = () => {
    console.log('Adding cards to deck:', selectedCards);
    setShowAddCards(false);
    setSelectedCards([]);
  };

  const toggleCardSelection = (cardId) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]));
  };

  const handleFlip = (cardId) => console.log('Flipped card:', cardId);
  const handleBookmark = (cardId) => console.log('Bookmarked card:', cardId);
  const handleLike = (cardId) => console.log('Liked card:', cardId);
  const handleComment = (cardId) => console.log('Comment on card:', cardId);
  const handleEdit = (cardId) => console.log('Edit card:', cardId);
  const handleDelete = (cardId) => console.log('Delete card:', cardId);

  if (isLoading) {
    return (
      <div className="deck-detail-page">
        <div className="deck-detail-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading deck...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="deck-detail-page">
        <div className="deck-detail-container">
          <div className="error-state">
            <h2>Deck Not Found</h2>
            <p>The deck you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
            <button className="primary-button" onClick={() => navigate('/app/social/flashcards/my-decks')}>
              Back to My Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="deck-detail-page">
      <div className="deck-detail-container">
        <button className="back-button" onClick={() => navigate('/app/social/flashcards/my-decks')}>
          <FiArrowLeft />
          <span>Back to Decks</span>
        </button>

        <div className="deck-header">
          <div className="deck-header-content">
            <div className="deck-title-row">
              <h1>{deck.name}</h1>
              <div className="deck-badges">
                <span className="category-badge" style={{ backgroundColor: '#61dafb' }}>
                  {deck.category}
                </span>
                <span className={`privacy-badge ${deck.privacy}`}>
                  {deck.privacy === 'private' ? (
                    <>
                      <FiLock /> Private
                    </>
                  ) : (
                    <>
                      <FiGlobe /> Public
                    </>
                  )}
                </span>
              </div>
            </div>

            {deck.description && <p className="deck-description">{deck.description}</p>}

            <div className="deck-meta">
              <div className="deck-author">
                <div className="author-avatar" style={{ backgroundColor: deck.avatarColor }}>
                  {deck.profilePicture ? (
                    <img src={deck.profilePicture} alt={deck.username} />
                  ) : (
                    <span>{deck.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="author-info">
                  <span className="author-name">{deck.username}</span>
                  <span className="author-label">Deck Creator</span>
                </div>
              </div>

              <div className="deck-stats">
                <div className="stat-item">
                  <span className="stat-value">{cards.length}</span>
                  <span className="stat-label">Cards</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{deck.likesCount}</span>
                  <span className="stat-label">Likes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="deck-actions">
            <button className="action-button primary" onClick={handlePracticeDeck} disabled={cards.length === 0}>
              <FiPlay />
              <span>Practice Deck</span>
            </button>

            {isOwner && (
              <>
                <button className="action-button secondary" onClick={() => setShowAddCards(true)}>
                  <FiPlus />
                  <span>Add Cards</span>
                </button>

                <div className="more-options">
                  <button className="action-button icon-only" onClick={() => setShowOptions(!showOptions)}>
                    <FiMoreVertical />
                  </button>

                  {showOptions && (
                    <>
                      <div className="options-overlay" onClick={() => setShowOptions(false)}></div>
                      <div className="options-menu">
                        <button
                          className="option-item"
                          onClick={() => {
                            setShowEditForm(true);
                            setShowOptions(false);
                          }}
                        >
                          <FiEdit2 />
                          <span>Edit Deck</span>
                        </button>
                        <button
                          className="option-item delete"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this deck?')) {
                              handleDeleteDeck();
                            }
                            setShowOptions(false);
                          }}
                        >
                          <FiTrash2 />
                          <span>Delete Deck</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {showEditForm && (
          <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <DeckForm deck={deck} onSubmit={handleUpdateDeck} onCancel={() => setShowEditForm(false)} />
            </div>
          </div>
        )}

        {showAddCards && (
          <div className="modal-overlay" onClick={() => setShowAddCards(false)}>
            <div className="modal-content add-cards-modal" onClick={(e) => e.stopPropagation()}>
              <div className="add-cards-header">
                <h2>Add Cards to Deck</h2>
                <button className="close-button" onClick={() => setShowAddCards(false)}>
                  ×
                </button>
              </div>
              <div className="add-cards-list">
                {availableCards.map((card, index) => (
                  <label key={card._id ?? `avail-${index}`} className="card-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCards.includes(card._id)}
                      onChange={() => toggleCardSelection(card._id)}
                    />
                    <div className="card-checkbox-content">
                      <span className="card-question">{card.question}</span>
                      <span className="card-category">{card.category}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="add-cards-footer">
                <button className="cancel-button" onClick={() => setShowAddCards(false)}>
                  Cancel
                </button>
                <button className="primary-button" onClick={handleAddCards} disabled={selectedCards.length === 0}>
                  Add {selectedCards.length} Card{selectedCards.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="deck-cards">
          <div className="cards-header">
            <h2>Cards in this Deck</h2>
            <span className="cards-count">{cards.length} cards</span>
          </div>

          {cards.length === 0 ? (
            <div className="empty-cards">
              <p>No cards in this deck yet.</p>
              {isOwner && (
                <button className="primary-button" onClick={() => setShowAddCards(true)}>
                  <FiPlus />
                  <span>Add Cards</span>
                </button>
              )}
            </div>
          ) : (
            <div className="cards-list">
              {cards.map((card, index) => (
                <div key={card._id ?? `card-${index}`} className="deck-card-wrapper">
                  <CardItem
                    card={card}
                    onFlip={handleFlip}
                    onBookmark={handleBookmark}
                    onLike={handleLike}
                    onComment={handleComment}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    currentUser={profile}
                  />
                  {isOwner && (
                    <button
                      className="remove-from-deck-button"
                      onClick={() => handleRemoveCard(card._id)}
                      title="Remove from deck"
                    >
                      <FiTrash2 />
                      <span>Remove from Deck</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckDetail;
