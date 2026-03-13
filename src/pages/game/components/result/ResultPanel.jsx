import PropTypes from 'prop-types';
import './ResultPanel.scss';

export function ResultPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div className="result-panel result-loading">
        <div className="loading-content">
          <div className="loading-spinner">⟳</div>
          <div className="loading-text">Running your code in sandbox...</div>
          <div className="loading-sub">Spinning up Docker container • Executing Playwright • Collecting results</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-panel result-error">
        <div className="result-badge badge-error">⚠ Error</div>
        <div className="result-message">{error}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-panel result-empty">
        <div className="empty-icon">▶</div>
        <div className="empty-text">
          Write your code above and click <strong>Run Code</strong> to test it.
        </div>
      </div>
    );
  }

  return (
    <div className={`result-panel ${result.passed ? 'result-pass' : 'result-fail'}`}>
      <div className="result-header">
        <div className={`result-badge ${result.passed ? 'badge-pass' : 'badge-fail'}`}>
          {result.passed ? '✓ LEVEL PASSED' : '✗ Not Quite Right'}
        </div>
        <div className="result-message">{result.message}</div>
        {result.passed && result.xpAwarded > 0 && <div className="xp-award">+{result.xpAwarded} XP</div>}
      </div>

      {result.stdout && (
        <div className="result-section">
          <div className="section-label">stdout</div>
          <pre className="output-block stdout">{result.stdout}</pre>
        </div>
      )}

      {result.stderr && (
        <div className="result-section">
          <div className="section-label">stderr</div>
          <pre className="output-block stderr">{result.stderr}</pre>
        </div>
      )}

      {result.screenshotBase64 && (
        <div className="result-section">
          <div className="section-label">Screenshot</div>
          <img
            src={`data:image/png;base64,${result.screenshotBase64}`}
            alt="Test screenshot"
            className="screenshot-img"
          />
        </div>
      )}

      <div className="result-meta">
        Exit code: <code>{result.exitCode}</code>
      </div>
    </div>
  );
}

ResultPanel.propTypes = {
  result: PropTypes.shape({
    passed: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    xpAwarded: PropTypes.number.isRequired,
    stdout: PropTypes.string,
    stderr: PropTypes.string,
    screenshotBase64: PropTypes.string,
    exitCode: PropTypes.number.isRequired
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};
