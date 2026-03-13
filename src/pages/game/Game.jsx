import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLevel } from './hooks/useLevel';
import { useSubmission } from './hooks/useSubmission';
import { CodeEditor } from './components/editor/CodeEditor';
import { EditorToolbar } from './components/editor/EditorToolbar';
import { TargetPreview } from './components/preview/TargetPreview';
import { ResultPanel } from './components/result/ResultPanel';
import { LevelHeader } from './components/level/LevelHeader';
import './Game.scss';

export function Game() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { level, loading: levelLoading, error: levelError } = useLevel(levelId);
  const { result, loading: submitting, error: submitError, submit, reset } = useSubmission();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (level) {
      setCode(level.starterCode);
      reset();
    }
  }, [level, reset]);

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
          <TargetPreview targetUrl={level.targetUrl} levelTitle={level.title} />
        </div>

        <div className="split-right">
          <EditorToolbar onRun={handleRun} onReset={handleReset} hints={level.hints} loading={submitting} />
          <div className="editor-area">
            <CodeEditor value={code} onChange={setCode} readOnly={submitting} />
          </div>
          <ResultPanel result={result} loading={submitting} error={submitError} />
        </div>
      </div>
    </div>
  );
}
