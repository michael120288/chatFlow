import { useState } from 'react';
import PropTypes from 'prop-types';
import './PracticeCard.scss';

const PracticeCard = ({ card, onAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const formatCode = (code) => {
    if (!code) return null;
    return (
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    );
  };

  return (
    <div className="practice-card-wrapper">
      <div className={`practice-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="practice-card-inner">
          {/* Front - Question */}
          <div className="practice-card-face practice-card-front">
            <div className="card-category-badge">{card.category}</div>

            <div className="card-content">
              <div className="question-label">Question</div>
              <h2 className="question-text">{card.question}</h2>

              {card.questionImgId && (
                <div className="card-image">
                  <img
                    src={`https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v${card.questionImgVersion}/${card.questionImgId}`}
                    alt="Question"
                  />
                </div>
              )}

              {card.questionCodeSnippet && formatCode(card.questionCodeSnippet)}
            </div>

            <button className="flip-button" onClick={handleFlip}>
              Show Answer →
            </button>
          </div>

          {/* Back - Answer */}
          <div className="practice-card-face practice-card-back">
            <div className="card-category-badge">{card.category}</div>

            <div className="card-content">
              <div className="answer-label">Answer</div>
              <h2 className="answer-text">{card.answer}</h2>

              {card.answerImgId && (
                <div className="card-image">
                  <img
                    src={`https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v${card.answerImgVersion}/${card.answerImgId}`}
                    alt="Answer"
                  />
                </div>
              )}

              {card.answerCodeSnippet && formatCode(card.answerCodeSnippet)}
            </div>

            <button className="flip-button" onClick={handleFlip}>
              ← Back to Question
            </button>
          </div>
        </div>
      </div>

      {/* Show answer controls only after flipping */}
      {showAnswer && (
        <div className="practice-controls">
          <div className="controls-header">
            <p>How well did you know this?</p>
          </div>
          <div className="difficulty-buttons">
            <button
              className="difficulty-btn again"
              onClick={() => {
                onAnswer('again');
                setIsFlipped(false);
                setShowAnswer(false);
              }}
            >
              <span className="btn-label">Again</span>
              <span className="btn-time">&lt;1 day</span>
            </button>
            <button
              className="difficulty-btn hard"
              onClick={() => {
                onAnswer('hard');
                setIsFlipped(false);
                setShowAnswer(false);
              }}
            >
              <span className="btn-label">Hard</span>
              <span className="btn-time">1-2 days</span>
            </button>
            <button
              className="difficulty-btn good"
              onClick={() => {
                onAnswer('good');
                setIsFlipped(false);
                setShowAnswer(false);
              }}
            >
              <span className="btn-label">Good</span>
              <span className="btn-time">2-4 days</span>
            </button>
            <button
              className="difficulty-btn easy"
              onClick={() => {
                onAnswer('easy');
                setIsFlipped(false);
                setShowAnswer(false);
              }}
            >
              <span className="btn-label">Easy</span>
              <span className="btn-time">4+ days</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

PracticeCard.propTypes = {
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    questionImgId: PropTypes.string,
    questionImgVersion: PropTypes.string,
    answerImgId: PropTypes.string,
    answerImgVersion: PropTypes.string,
    questionCodeSnippet: PropTypes.string,
    answerCodeSnippet: PropTypes.string
  }).isRequired,
  onAnswer: PropTypes.func.isRequired
};

export default PracticeCard;
