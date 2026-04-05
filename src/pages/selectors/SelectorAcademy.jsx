import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHAPTERS, ALL_LESSONS } from './lessons';
import './SelectorAcademy.scss';

const STORAGE_KEY = 'css-selector-academy-progress';

function loadCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

export function SelectorAcademy() {
  // Global body has position:fixed + overflow:hidden + height:100vh — undo for this page
  useEffect(() => {
    const prev = {
      overflow: document.body.style.overflow,
      height: document.body.style.height,
      position: document.body.style.position
    };
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.height = prev.height;
      document.body.style.position = prev.position;
    };
  }, []);

  const navigate = useNavigate();

  const [currentId, setCurrentId] = useState(ALL_LESSONS[0].id);
  const [selectorValue, setSelectorValue] = useState('');
  const [completed, setCompleted] = useState(loadCompleted);
  const [matchCount, setMatchCount] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);
  const previewRef = useRef(null);

  const lesson = ALL_LESSONS.find((l) => l.id === currentId);
  const currentIdx = ALL_LESSONS.findIndex((l) => l.id === currentId);
  const prevLesson = ALL_LESSONS[currentIdx - 1] || null;
  const nextLesson = ALL_LESSONS[currentIdx + 1] || null;

  // Reset state when lesson changes
  useEffect(() => {
    setSelectorValue('');
    setMatchCount(null);
    setIsCorrect(false);
    setHasError(false);
  }, [currentId]);

  // Render HTML into preview container
  useEffect(() => {
    if (!previewRef.current || !lesson) return;
    previewRef.current.innerHTML = lesson.html;
  }, [lesson]);

  // Run querySelectorAll live as user types
  useEffect(() => {
    if (!previewRef.current || !lesson) return;

    // Clear previous highlights
    previewRef.current.querySelectorAll('.sa-hl').forEach((el) => el.classList.remove('sa-hl'));

    const sel = selectorValue.trim();
    if (!sel) {
      setMatchCount(null);
      setIsCorrect(false);
      setHasError(false);
      return;
    }

    try {
      const matched = previewRef.current.querySelectorAll(sel);
      matched.forEach((el) => el.classList.add('sa-hl'));
      setMatchCount(matched.length);
      setHasError(false);

      const correct = lesson.validate(matched, previewRef.current, sel);
      setIsCorrect(correct);

      if (correct && !completed.has(lesson.id)) {
        const next = new Set(completed);
        next.add(lesson.id);
        setCompleted(next);
        saveCompleted(next);
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 2000);
      }
    } catch {
      // Pseudo-elements (::before etc.) are invalid in querySelectorAll but
      // some lessons validate by raw selector text — try that path
      try {
        const correct = lesson.validate([], previewRef.current, sel);
        setIsCorrect(correct);
        setMatchCount(correct ? 1 : null);
        setHasError(!correct);
        if (correct && !completed.has(lesson.id)) {
          const next = new Set(completed);
          next.add(lesson.id);
          setCompleted(next);
          saveCompleted(next);
          setJustCompleted(true);
          setTimeout(() => setJustCompleted(false), 2000);
        }
      } catch {
        setMatchCount(null);
        setIsCorrect(false);
        setHasError(true);
      }
    }
  }, [selectorValue, lesson, completed]);

  const goToLesson = useCallback((id) => {
    setCurrentId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalLessons = ALL_LESSONS.length;
  const completedCount = completed.size;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className={`sa-page ${sidebarOpen ? 'sa-sidebar-open' : 'sa-sidebar-closed'}`}>
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="sa-sidebar">
        <div className="sa-sidebar-header">
          <div className="sa-sidebar-title">CSS Selectors</div>
          <div className="sa-sidebar-progress">
            <div className="sa-progress-bar">
              <div className="sa-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="sa-progress-label">
              {completedCount}/{totalLessons} done
            </span>
          </div>
        </div>

        <nav className="sa-nav">
          {CHAPTERS.map((chapter) => (
            <div key={chapter.id} className="sa-chapter">
              <div className="sa-chapter-title">
                <span>{chapter.icon}</span>
                <span>{chapter.title}</span>
              </div>
              <ul className="sa-lesson-list">
                {chapter.lessons.map((l) => (
                  <li key={l.id}>
                    <button
                      className={`sa-lesson-btn ${currentId === l.id ? 'active' : ''} ${
                        completed.has(l.id) ? 'done' : ''
                      }`}
                      onClick={() => goToLesson(l.id)}
                    >
                      <span className="sa-lesson-check">{completed.has(l.id) ? '✓' : ''}</span>
                      <span className="sa-lesson-name">{l.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="sa-main">
        <div className="sa-topbar">
          <button className="sa-toggle-btn" onClick={() => setSidebarOpen((o) => !o)} title="Toggle sidebar">
            ☰
          </button>
          <button className="sa-back-btn" onClick={() => navigate('/app/game')} title="Back to Game Home">
            ← Back
          </button>
          <div className="sa-breadcrumb">
            <span className="sa-breadcrumb-chapter">
              {lesson.chapterIcon} {lesson.chapterTitle}
            </span>
            <span className="sa-breadcrumb-sep">›</span>
            <span className="sa-breadcrumb-lesson">{lesson.title}</span>
          </div>
        </div>

        <div className={`sa-lesson-banner ${justCompleted ? 'sa-lesson-banner--flash' : ''}`}>
          <div className="sa-lesson-banner-meta">
            <span className="sa-lesson-banner-chapter">
              {lesson.chapterIcon} {lesson.chapterTitle}
            </span>
            <span className="sa-lesson-banner-num">
              {currentIdx + 1} / {ALL_LESSONS.length}
            </span>
          </div>
          <div className="sa-lesson-header">
            <h1 className="sa-lesson-title">{lesson.title}</h1>
            {completed.has(lesson.id) && <span className="sa-completed-badge">✓ Completed</span>}
          </div>
        </div>

        <div className="sa-content">
          {/* ── Explanation ────────────────────────────────── */}
          <section className="sa-section">
            <h2 className="sa-section-title">What is it?</h2>
            <div className="sa-explanation">
              {lesson.explanation.map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
            </div>
          </section>

          {/* ── Syntax box ─────────────────────────────────── */}
          <section className="sa-section">
            <h2 className="sa-section-title">Syntax</h2>
            <div className="sa-syntax-box">
              <code>{lesson.syntax}</code>
            </div>
          </section>

          {/* ── Examples ───────────────────────────────────── */}
          <section className="sa-section">
            <h2 className="sa-section-title">Examples</h2>
            <div className="sa-examples">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="sa-example-row">
                  <code className="sa-example-sel">{ex.selector}</code>
                  <span className="sa-example-arrow">→</span>
                  <span className="sa-example-meaning">{ex.meaning}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tip ────────────────────────────────────────── */}
          {lesson.tip && (
            <div className="sa-tip">
              <span className="sa-tip-icon">💡</span>
              <span>{lesson.tip}</span>
            </div>
          )}

          {/* ── Practice ───────────────────────────────────── */}
          <section className="sa-section sa-practice-section">
            <h2 className="sa-section-title">Try it yourself</h2>

            <div className="sa-task">
              <span className="sa-task-icon">🎯</span>
              <span>{lesson.task}</span>
            </div>

            <div className="sa-practice-layout">
              {/* HTML Preview */}
              <div className="sa-preview-wrap">
                <div className="sa-preview-label">HTML Preview</div>
                <div className="sa-browser">
                  <div className="sa-browser-chrome">
                    <span className="sa-browser-dot sa-browser-dot--red" />
                    <span className="sa-browser-dot sa-browser-dot--yellow" />
                    <span className="sa-browser-dot sa-browser-dot--green" />
                    <span className="sa-browser-url">preview</span>
                  </div>
                  <div className="sa-preview-box" ref={previewRef} />
                </div>
                <div className="sa-html-source">
                  <div className="sa-html-source-label">HTML Source</div>
                  <pre className="sa-html-pre">
                    <code>{lesson.html}</code>
                  </pre>
                </div>
              </div>

              {/* Input area */}
              <div className="sa-input-wrap">
                <div className="sa-input-label">Your selector</div>
                <div
                  className={`sa-input-row ${hasError ? 'error' : ''} ${
                    isCorrect ? 'correct' : matchCount !== null && matchCount >= 0 ? 'has-matches' : ''
                  }`}
                >
                  <span className="sa-input-prefix">▶</span>
                  <input
                    className="sa-selector-input"
                    type="text"
                    value={selectorValue}
                    onChange={(e) => setSelectorValue(e.target.value)}
                    placeholder="Type your selector here…"
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                </div>

                {/* Feedback */}
                <div className="sa-feedback">
                  {hasError && <div className="sa-feedback-error">✗ Invalid selector syntax</div>}
                  {!hasError && matchCount === 0 && <div className="sa-feedback-none">No elements matched</div>}
                  {!hasError && matchCount > 0 && !isCorrect && (
                    <div className="sa-feedback-partial">
                      {matchCount} element{matchCount !== 1 ? 's' : ''} matched — not quite right yet
                    </div>
                  )}
                  {isCorrect && <div className="sa-feedback-success">✓ {lesson.successMessage}</div>}
                </div>

                {/* Hint */}
                <details className="sa-hint">
                  <summary>Show hint</summary>
                  <p>{lesson.hint}</p>
                </details>
              </div>
            </div>
          </section>

          {/* ── Navigation ─────────────────────────────────── */}
          <div className="sa-nav-btns">
            {prevLesson ? (
              <button className="sa-nav-btn prev" onClick={() => goToLesson(prevLesson.id)}>
                ← {prevLesson.title}
              </button>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <button className="sa-nav-btn next" onClick={() => goToLesson(nextLesson.id)}>
                {nextLesson.title} →
              </button>
            ) : (
              <div className="sa-finished">🎉 You reached the end!</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
