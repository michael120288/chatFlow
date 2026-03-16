import PropTypes from 'prop-types';
import { useState } from 'react';
import './EditorToolbar.scss';

export function EditorToolbar({ onRun, onReset, hints, loading, showingSolution }) {
  const [hintIndex, setHintIndex] = useState(-1);
  const [showHints, setShowHints] = useState(false);

  const handleHint = () => {
    if (!showHints) {
      setShowHints(true);
      setHintIndex(0);
    } else if (hintIndex < hints.length - 1) {
      setHintIndex((i) => i + 1);
    } else {
      setShowHints(false);
      setHintIndex(-1);
    }
  };

  return (
    <div className="editor-toolbar">
      <div className="toolbar-left">
        <button className="btn btn-run" onClick={onRun} disabled={loading} title="Run your code">
          {loading ? (
            <>
              <span className="spinner">⟳</span> Running...
            </>
          ) : (
            <>
              <span>▶</span> Run Code
            </>
          )}
        </button>
        <button className="btn btn-reset" onClick={onReset} title="Reset to starter code">
          ↺ {showingSolution ? 'Reset to Starter' : 'Reset'}
        </button>
        {showingSolution && <span className="solution-badge">✓ Your solution</span>}
      </div>

      <div className="toolbar-right">
        {hints && hints.length > 0 && (
          <button className="btn btn-hint" onClick={handleHint}>
            💡 {!showHints ? 'Hint' : hintIndex < hints.length - 1 ? 'Next Hint' : 'Hide Hints'}
          </button>
        )}
      </div>

      {showHints && hintIndex >= 0 && (
        <div className="hint-panel">
          <div className="hint-header">
            Hint {hintIndex + 1} of {hints.length}
          </div>
          <div className="hint-text">{hints[hintIndex]}</div>
        </div>
      )}
    </div>
  );
}

EditorToolbar.propTypes = {
  onRun: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  hints: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,
  showingSolution: PropTypes.bool
};
