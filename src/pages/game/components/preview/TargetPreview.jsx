import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import './TargetPreview.scss';

export function TargetPreview({ targetUrl, levelTitle }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [source, setSource] = useState(null);
  const [sourceLoading, setSourceLoading] = useState(false);

  // In development, strip the host so CRA's dev proxy forwards /pages/* to the backend.
  // In production, replace localhost with the actual API URL.
  const apiBase = process.env.REACT_APP_API_URL || '';
  const iframeSrc = apiBase
    ? targetUrl.replace(/https?:\/\/localhost:\d+/, apiBase)
    : targetUrl.replace(/https?:\/\/localhost:\d+/, '');

  useEffect(() => {
    // Reset tab when level changes
    setActiveTab('preview');
    setSource(null);
  }, [targetUrl]);

  const handleSourceTab = () => {
    setActiveTab('source');
    if (!source) {
      setSourceLoading(true);
      fetch(iframeSrc)
        .then((r) => r.text())
        .then((html) => setSource(html))
        .catch(() => setSource('// Failed to load source'))
        .finally(() => setSourceLoading(false));
    }
  };

  return (
    <div className="target-preview">
      <div className="preview-header">
        <span className="preview-icon">🎯</span>
        <span className="preview-title">Target Page — {levelTitle}</span>
        <div className="preview-tabs">
          <button
            className={`preview-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button className={`preview-tab ${activeTab === 'source' ? 'active' : ''}`} onClick={handleSourceTab}>
            Source
          </button>
        </div>
        <a
          href={iframeSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="preview-open-btn"
          title="Open in new tab"
        >
          ↗
        </a>
      </div>

      <div className="preview-frame-container">
        {activeTab === 'preview' ? (
          <iframe
            src={iframeSrc}
            title={`Target: ${levelTitle}`}
            className="preview-frame"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <div className="source-view">
            {sourceLoading ? (
              <div className="source-loading">Loading source…</div>
            ) : (
              <pre className="source-code">{source}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

TargetPreview.propTypes = {
  targetUrl: PropTypes.string.isRequired,
  levelTitle: PropTypes.string.isRequired
};
