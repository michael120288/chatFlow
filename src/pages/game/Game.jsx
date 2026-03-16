import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLevel } from './hooks/useLevel';
import { useSubmission } from './hooks/useSubmission';
import { useGame } from './context/GameContext';
import { CodeEditor } from './components/editor/CodeEditor';
import { EditorToolbar } from './components/editor/EditorToolbar';
import { TargetPreview } from './components/preview/TargetPreview';
import { ResultPanel } from './components/result/ResultPanel';
import { LevelHeader } from './components/level/LevelHeader';
import './Game.scss';

const TOOL_META = {
  'cypress-component': {
    icon: '⚛️',
    label: 'Component Test',
    desc: 'This level mounts a React component in isolation. No target page — the component renders inside Cypress.'
  },
  cypress: {
    icon: '🌲',
    label: 'Cypress API Test',
    desc: 'This level tests the server API directly. No browser page is loaded.'
  }
};

function NoTargetPlaceholder({ tool }) {
  const meta = TOOL_META[tool] || {
    icon: '🔌',
    label: 'No Target Page',
    desc: 'This level does not use a target page.'
  };
  return (
    <div className="no-target-placeholder">
      <div className="no-target-icon">{meta.icon}</div>
      <div className="no-target-label">{meta.label}</div>
      <div className="no-target-desc">{meta.desc}</div>
    </div>
  );
}

NoTargetPlaceholder.propTypes = {
  tool: PropTypes.string
};

export function Game() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { level, loading: levelLoading, error: levelError } = useLevel(levelId);
  const { result, loading: submitting, error: submitError, submit, reset } = useSubmission();
  const { solutions } = useGame();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (level) {
      setCode(solutions[level.id] ?? level.starterCode);
      reset();
    }
  }, [level, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (result?.passed) {
      const timer = setTimeout(() => {
        navigate(`/app/game/complete/${levelId}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result, levelId, navigate]);

  const handleRun = useCallback(async () => {
    if (!levelId) return;
    await submit(levelId, code);
  }, [levelId, code, submit]);

  const hasSavedSolution = level && !!solutions[level.id];

  const handleReset = useCallback(() => {
    if (level) {
      setCode(level.starterCode);
      reset();
    }
  }, [level, reset]);

  if (levelLoading) {
    return (
      <div className="game-loading">
        <div className="loading-spinner">⟳</div>
        <div>Loading level...</div>
      </div>
    );
  }

  if (levelError || !level) {
    return (
      <div className="game-error">
        <div className="error-icon">⚠</div>
        <div>{levelError || 'Level not found'}</div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <LevelHeader level={level} />

      <div className="game-split">
        <div className="split-left">
          {level.targetUrl ? (
            <TargetPreview targetUrl={level.targetUrl} levelTitle={level.title} />
          ) : (
            <NoTargetPlaceholder tool={level.tool} />
          )}
        </div>

        <div className="split-right">
          <EditorToolbar
            onRun={handleRun}
            onReset={handleReset}
            hints={level.hints}
            loading={submitting}
            showingSolution={hasSavedSolution}
          />
          <div className="editor-area">
            <CodeEditor value={code} onChange={setCode} readOnly={submitting} />
          </div>
          <ResultPanel result={result} loading={submitting} error={submitError} />
        </div>
      </div>
    </div>
  );
}
