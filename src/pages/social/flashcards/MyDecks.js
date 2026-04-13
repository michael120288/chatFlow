import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPlus, FiBookOpen, FiLayers, FiTrendingUp } from 'react-icons/fi';
import DeckItem from '@components/flashcards/deck-item/DeckItem';
import DeckForm from '@components/flashcards/deck-form/DeckForm';
import './MyDecks.scss';

const MyDecks = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeckForm, setShowDeckForm] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    averageProgress: 0
  });

  // Mock data - will be replaced with API calls
  const mockDecks = [
    {
      _id: '1',
      name: 'React Fundamentals',
      description: 'Core concepts of React including hooks, state, and lifecycle',
      category: 'React',
      privacy: 'public',
      cardsCount: 25,
      likesCount: 12,
      userId: profile?.userId,
      username: profile?.username,
      coverImgId: '',
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'JavaScript ES6+',
      description: 'Modern JavaScript features and best practices',
      category: 'JavaScript',
      privacy: 'public',
      cardsCount: 18,
      likesCount: 8,
      userId: profile?.userId,
      username: profile?.username,
      coverImgId: '',
      createdAt: new Date()
    },
    {
      _id: '3',
      name: 'System Design Patterns',
      description: 'Common patterns used in distributed systems',
      category: 'System Design',
      privacy: 'private',
      cardsCount: 32,
      likesCount: 15,
      userId: profile?.userId,
      username: profile?.username,
      coverImgId: '',
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    // Load user's decks - will be replaced with API call
    setTimeout(() => {
      setDecks(mockDecks);
      setStats({
        totalDecks: mockDecks.length,
        totalCards: mockDecks.reduce((sum, deck) => sum + deck.cardsCount, 0),
        averageProgress: 68
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreateDeck = (deckData) => {
    console.log('Creating deck:', deckData);
    // API call to create deck
    setShowDeckForm(false);
  };

  const handleUpdateDeck = (deckData) => {
    console.log('Updating deck:', deckData);
    // API call to update deck
    setEditingDeck(null);
  };

  const handleDeleteDeck = (deckId) => {
    console.log('Deleting deck:', deckId);
    setDecks((prev) => prev.filter((deck) => deck._id !== deckId));
  };

  const handleViewDeck = (deckId) => {
    navigate(`/app/social/flashcards/deck/${deckId}`);
  };

  const handlePracticeDeck = (deckId) => {
    navigate(`/app/social/flashcards/practice/deck/${deckId}`);
  };

  const handleEditDeck = (deck) => {
    setEditingDeck(deck);
  };

  if (isLoading) {
    return (
      <div className="my-decks-page">
        <div className="my-decks-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your decks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-decks-page">
      <div className="my-decks-container">
        <div className="page-header">
          <div className="header-content">
            <h1>My Decks</h1>
            <p>Organize your cards into decks for focused learning</p>
          </div>
          <button className="create-deck-button" onClick={() => setShowDeckForm(true)}>
            <FiPlus />
            <span>Create Deck</span>
          </button>
        </div>

        {(showDeckForm || editingDeck) && (
          <div
            className="deck-form-overlay"
            onClick={() => (editingDeck ? setEditingDeck(null) : setShowDeckForm(false))}
          >
            <div className="deck-form-modal" onClick={(e) => e.stopPropagation()}>
              <DeckForm
                deck={editingDeck}
                onSubmit={editingDeck ? handleUpdateDeck : handleCreateDeck}
                onCancel={() => (editingDeck ? setEditingDeck(null) : setShowDeckForm(false))}
              />
            </div>
          </div>
        )}

        <div className="decks-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <FiLayers />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalDecks}</div>
              <div className="stat-label">Total Decks</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <FiBookOpen />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalCards}</div>
              <div className="stat-label">Total Cards</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.averageProgress}%</div>
              <div className="stat-label">Avg Progress</div>
            </div>
          </div>
        </div>

        {decks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FiLayers />
            </div>
            <h2>No Decks Yet</h2>
            <p>Create your first deck to organize your flashcards and start learning!</p>
            <button className="primary-button" onClick={() => setShowDeckForm(true)}>
              <FiPlus />
              <span>Create Your First Deck</span>
            </button>
          </div>
        ) : (
          <div className="decks-grid">
            {decks.map((deck, index) => (
              <DeckItem
                key={deck._id ?? `deck-${index}`}
                deck={deck}
                onView={handleViewDeck}
                onPractice={handlePracticeDeck}
                onEdit={handleEditDeck}
                onDelete={handleDeleteDeck}
                currentUser={profile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDecks;
