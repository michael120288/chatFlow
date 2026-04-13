import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLevel } from './hooks/useLevel';
import { useSubmission } from './hooks/useSubmission';
import { useGame } from './context/GameContext';
import { useLevelNavigation } from './hooks/useLevelNavigation';
import { EditorToolbar } from './components/editor/EditorToolbar';
import { TargetPreview } from './components/preview/TargetPreview';
import { ResultPanel } from './components/result/ResultPanel';
import { LevelHeader } from './components/level/LevelHeader';
import './Game.scss';

const CodeEditor = lazy(() => import('./components/editor/CodeEditor').then((m) => ({ default: m.CodeEditor })));

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

const CONFETTI_COLORS = ['#ffd700', '#4ecca3', '#a855f7', '#f87171', '#60a5fa', '#fb923c'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${((i * 7 + 3) * 2.618) % 100}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: `${((i * 0.07) % 0.6).toFixed(2)}s`,
        duration: `${(0.8 + (i % 5) * 0.12).toFixed(2)}s`,
        size: [10, 7, 5][i % 3]
      })),
    []
  );

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size
          }}
        />
      ))}
    </div>
  );
}

export function Game() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { level, loading: levelLoading, error: levelError } = useLevel(levelId);
  const { result, loading: submitting, error: submitError, submit, reset } = useSubmission();
  const { solutions } = useGame();
  const { prevId, nextId } = useLevelNavigation(levelId, level?.category);
  const [code, setCode] = useState('');

  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(45);
  const draggingRef = useRef(false);
  const splitRef = useRef(null);

  useEffect(() => {
    if (level) {
      setCode(solutions[level.id] ?? level.starterCode);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solutions is a static map; setCode is a stable state setter
  }, [level, reset]);

  // Navigate to complete screen on pass
  useEffect(() => {
    if (result?.passed) {
      const timer = setTimeout(() => {
        navigate(`/app/game/complete/${levelId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [result, levelId, navigate]);

  const handleRun = useCallback(async () => {
    if (!levelId) return;
    await submit(levelId, code, level?.category);
  }, [levelId, code, submit, level]);

  const hasSavedSolution = level && !!solutions[level.id];

  const handleReset = useCallback(() => {
    if (level) {
      setCode(level.starterCode);
      reset();
    }
  }, [level, reset]);

  // Keyboard shortcut: Cmd+Enter / Ctrl+Enter to run
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!submitting && level) handleRun();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [submitting, level, handleRun]);

  // Resizable drag divider
  const handleDividerMouseDown = useCallback(() => {
    draggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!draggingRef.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(Math.max(pct, 20), 75));
    };
    const onMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

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
      {result?.passed && <Confetti />}

      <LevelHeader level={level} prevId={prevId} nextId={nextId} />

      <div className="game-split" ref={splitRef}>
        <div className="split-left" style={{ flex: `0 0 ${leftWidth}%` }}>
          {level.targetUrl ? (
            <TargetPreview targetUrl={level.targetUrl} levelTitle={level.title} />
          ) : (
            <NoTargetPlaceholder tool={level.tool} />
          )}
        </div>

        <div className="split-divider" onMouseDown={handleDividerMouseDown} title="Drag to resize" />

        <div className="split-right">
          <EditorToolbar
            onRun={handleRun}
            onReset={handleReset}
            hints={level.hints}
            loading={submitting}
            showingSolution={hasSavedSolution}
          />
          <div className="editor-area">
            <Suspense fallback={<div>Loading editor...</div>}>
              <CodeEditor value={code} onChange={setCode} readOnly={submitting} />
            </Suspense>
          </div>
          <ResultPanel result={result} loading={submitting} error={submitError} />
        </div>
      </div>
    </div>
  );
}
