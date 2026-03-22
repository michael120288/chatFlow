import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LevelHeader.scss';

/**
 * Renders explanation text that uses a simple markup convention:
 *   - Blocks wrapped in ``` ... ``` become <code> blocks
 *   - `inline` backtick text becomes <span class="explanation-inline-code">
 *   - Double newlines separate paragraphs
 */
function ExplanationRenderer({ text }) {
  const blocks = text.split(/```/);
  return blocks.map((block, i) => {
    if (i % 2 === 1) {
      // odd-indexed blocks are inside ``` fences → code block
      return (
        <code key={i} className="explanation-code">
          {block.trim()}
        </code>
      );
    }
    // even-indexed blocks are plain text paragraphs
    return block
      .split(/\n\n+/)
      .filter(Boolean)
      .map((para, j) => {
        // Render `inline code` within paragraphs
        const parts = para.split(/`([^`]+)`/);
        return (
          <p key={`${i}-${j}`} className="explanation-paragraph">
            {parts.map((part, k) =>
              k % 2 === 1 ? (
                <span key={k} className="explanation-inline-code">
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </p>
        );
      });
  });
}

ExplanationRenderer.propTypes = { text: PropTypes.string.isRequired };

export function LevelHeader({ level }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const trackCategory = level.category === 'ui' || level.category === 'api' ? 'playwright' : level.category;
  const backTo = `/app/game/track/${trackCategory}`;

  return (
    <div className="level-header">
      <Link to={backTo} className="level-back-link">
        ← Back to Track
      </Link>
      <div className="level-meta">
        <span className="level-number">Level {level.order}</span>
        <span className="level-xp">+{level.xpReward} XP</span>
        <div className="level-tags">
          {level.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <h2 className="level-title">{level.title}</h2>
      <p className="level-story">{level.story}</p>
      <div className="level-objective">
        <span className="objective-label">🎯 Objective:</span>
        <span className="objective-text">{level.objective}</span>
      </div>

      {level.explanation && (
        <div className="level-explanation">
          <button className="explanation-toggle" onClick={() => setShowExplanation((v) => !v)}>
            <span className={`toggle-arrow ${showExplanation ? 'open' : ''}`}>▶</span>
            📖 How it works
          </button>
          {showExplanation && (
            <div className="explanation-body">
              <ExplanationRenderer text={level.explanation} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

LevelHeader.propTypes = {
  level: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    xpReward: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    objective: PropTypes.string.isRequired,
    explanation: PropTypes.string
  }).isRequired
};
