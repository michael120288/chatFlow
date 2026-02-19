import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PracticeCard from '@components/flashcards/practice-card/PracticeCard';
import ProgressStats from '@components/flashcards/progress-stats/ProgressStats';
import './PracticeMode.scss';

const PracticeMode = () => {
  const navigate = useNavigate();
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
  const mockCards = [
    {
      _id: '1',
      question: 'What is React?',
      answer: 'React is a JavaScript library for building user interfaces.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const App = () => <div>Hello</div>;'
    },
    {
      _id: '2',
      question: 'What is useState?',
      answer: 'useState is a React Hook that lets you add state to function components.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const [count, setCount] = useState(0);'
    },
    {
      _id: '3',
      question: 'What is the DOM?',
      answer: 'The Document Object Model (DOM) is a programming interface for web documents.',
      category: 'JavaScript',
      questionCodeSnippet: '',
      answerCodeSnippet: 'document.getElementById("app");'
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
    // Load cards due for review - will be replaced with API call
    setTimeout(() => {
      setCards(mockCards);
      setStats(mockStats);
      setIsLoading(false);
    }, 500);
  }, []);

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
    navigate('/app/social/flashcards');
  };

  if (isLoading) {
    return (
      <div className="practice-mode">
        <div className="practice-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your practice session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="practice-mode">
        <div className="practice-container">
          <div className="empty-state">
            <h2>No Cards to Practice</h2>
            <p>You don&apos;t have any cards due for review right now. Come back later or create new cards!</p>
            <button className="primary-button" onClick={handleExit}>
              Back to Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy =
      sessionStats.cardsStudied > 0 ? Math.round((sessionStats.correct / sessionStats.cardsStudied) * 100) : 0;

    return (
      <div className="practice-mode">
        <div className="practice-container">
          <div className="session-complete">
            <div className="complete-icon">🎉</div>
            <h2>Session Complete!</h2>
            <p>Great job! You&apos;ve reviewed all the cards in this session.</p>

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
                Back to Cards
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
    <div className="practice-mode">
      <div className="practice-container">
        <div className="practice-header">
          <button className="back-button" onClick={handleExit}>
            ← Exit Practice
          </button>
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
          <p className="tip">💡 Tip: Be honest with your self-assessment for better learning!</p>
        </div>
      </div>
    </div>
  );
};

export default PracticeMode;
