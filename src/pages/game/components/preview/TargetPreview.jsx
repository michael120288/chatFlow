import PropTypes from 'prop-types';
import './TargetPreview.scss';

export function TargetPreview({ targetUrl, levelTitle }) {
  // Proxy strips the host so /pages/* is forwarded to the backend by CRA's dev server
  const iframeSrc = targetUrl.replace(/https?:\/\/localhost:\d+/, '');

  return (
    <div className="target-preview">
      <div className="preview-header">
        <span className="preview-icon">🎯</span>
        <span className="preview-title">Target Page — {levelTitle}</span>
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
        <iframe
          src={iframeSrc}
          title={`Target: ${levelTitle}`}
          className="preview-frame"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}

TargetPreview.propTypes = {
  targetUrl: PropTypes.string.isRequired,
  levelTitle: PropTypes.string.isRequired
};
