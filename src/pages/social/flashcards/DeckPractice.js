import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PracticeCard from '@components/flashcards/practice-card/PracticeCard';
import ProgressStats from '@components/flashcards/progress-stats/ProgressStats';
import './DeckPractice.scss';

const DeckPractice = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [stats, setStats] = useState({
    totalCards: 0,
    studiedCards: 0,
    masteredCards: 0,
    cardsToReview: 0,
    currentStreak: 0
  });
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correct: 0,
    incorrect: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Mock data - will be replaced with API calls
  const mockDeck = {
    _id: deckId,
    name: 'React Fundamentals',
    category: 'React',
    cardsCount: 3
  };

  const mockCards = [
    {
      _id: '1',
      question: 'What is React?',
      answer: 'React is a JavaScript library for building user interfaces.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const App = () => <div>Hello</div>;',
      deckId: deckId
    },
    {
      _id: '2',
      question: 'What is useState?',
      answer: 'useState is a React Hook that lets you add state to function components.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const [count, setCount] = useState(0);',
      deckId: deckId
    },
    {
      _id: '3',
      question: 'What is useEffect?',
      answer: 'useEffect is a React Hook that lets you perform side effects in function components.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'useEffect(() => { /* side effect */ }, [deps]);',
      deckId: deckId
    }
  ];

  const mockStats = {
    totalCards: 50,
    studiedCards: 25,
    masteredCards: 10,
    cardsToReview: 8,
    currentStreak: 5
  };

  useEffect(() => {
    // Load deck and its cards - will be replaced with API call
    setTimeout(() => {
      setDeck(mockDeck);
      setCards(mockCards);
      setStats(mockStats);
      setIsLoading(false);
    }, 500);
  }, [deckId]);

  const handleAnswer = async (difficulty) => {
    console.log('Answered:', difficulty, 'for card:', cards[currentCardIndex]._id);

    // Update session stats
    const isCorrect = difficulty === 'good' || difficulty === 'easy';
    setSessionStats((prev) => ({
      cardsStudied: prev.cardsStudied + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1
    }));

    // Will implement actual API call here to update progress

    // Move to next card or end session
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setSessionStats({ cardsStudied: 0, correct: 0, incorrect: 0 });
    setSessionComplete(false);
  };

  const handleExit = () => {
    navigate(`/app/social/flashcards/deck/${deckId}`);
  };

  const handleBackToDecks = () => {
    navigate('/app/social/flashcards/my-decks');
  };

  if (isLoading) {
    return (
      <div className="deck-practice">
        <div className="practice-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading deck practice session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="deck-practice">
        <div className="practice-container">
          <div className="empty-state">
            <h2>No Cards in Deck</h2>
            <p>This deck doesn&apos;t have any cards yet. Add some cards to start practicing!</p>
            <div className="empty-actions">
              <button className="primary-button" onClick={handleExit}>
                Back to Deck
              </button>
              <button className="secondary-button" onClick={handleBackToDecks}>
                My Decks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy =
      sessionStats.cardsStudied > 0 ? Math.round((sessionStats.correct / sessionStats.cardsStudied) * 100) : 0;

    return (
      <div className="deck-practice">
        <div className="practice-container">
          <div className="session-complete">
            <div className="complete-icon">🎉</div>
            <h2>Deck Complete!</h2>
            <p>Great job! You&apos;ve reviewed all the cards in &quot;{deck.name}&quot;.</p>

            <div className="session-stats">
              <div className="stat-item">
                <div className="stat-value">{sessionStats.cardsStudied}</div>
                <div className="stat-label">Cards Studied</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{accuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{sessionStats.correct}</div>
                <div className="stat-label">Correct</div>
              </div>
            </div>

            <div className="complete-actions">
              <button className="primary-button" onClick={handleRestart}>
                Practice Again
              </button>
              <button className="secondary-button" onClick={handleExit}>
                Back to Deck
              </button>
              <button className="tertiary-button" onClick={handleBackToDecks}>
                My Decks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <div className="deck-practice">
      <div className="practice-container">
        <div className="practice-header">
          <button className="back-button" onClick={handleExit}>
            ← Exit Practice
          </button>
          <div className="deck-info">
            <h3 className="deck-name">{deck.name}</h3>
            <span className="deck-category">{deck.category}</span>
          </div>
          <div className="progress-indicator">
            <div className="progress-text">
              {currentCardIndex + 1} / {cards.length}
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <ProgressStats stats={stats} />

        <PracticeCard card={currentCard} onAnswer={handleAnswer} />

        <div className="practice-footer">
          <p className="tip">💡 Tip: Focus on understanding the concepts, not just memorizing answers!</p>
        </div>
      </div>
    </div>
  );
};

export default DeckPractice;
