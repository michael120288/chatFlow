import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameService } from '@services/api/game/game.service';
import { XPBar } from './components/progress/XPBar';
import { useProgress } from './hooks/useProgress';
import './GameHome.scss';

export function GameHome() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { xp, completedLevels, trackXP, setTotalLevels, resetProgress } = useProgress();

  useEffect(() => {
    gameService
      .getLevels()
      .then((data) => {
        setLevels(data);
        setTotalLevels(data.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setTotalLevels]);

  const playwrightLevels = levels.filter((l) => l.category === 'ui' || l.category === 'api');
  const cypressLevels = levels.filter((l) => l.category === 'cypress-ui');
  const jestLevels = levels.filter((l) => l.category === 'jest');
  const vitestLevels = levels.filter((l) => l.category === 'vitest');
  const pythonLevels = levels.filter((l) => l.category === 'python-playwright');

  const playwrightDone = playwrightLevels.filter((l) => completedLevels.includes(l.id)).length;
  const cypressDone = cypressLevels.filter((l) => completedLevels.includes(l.id)).length;
  const jestDone = jestLevels.filter((l) => completedLevels.includes(l.id)).length;
  const vitestDone = vitestLevels.filter((l) => completedLevels.includes(l.id)).length;
  const pythonDone = pythonLevels.filter((l) => completedLevels.includes(l.id)).length;

  const playwrightTotalXP = playwrightLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const cypressTotalXP = cypressLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const jestTotalXP = jestLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const vitestTotalXP = vitestLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const pythonTotalXP = pythonLevels.reduce((sum, l) => sum + l.xpReward, 0);

  const playwrightXPEarned =
    trackXP.playwright ??
    playwrightLevels.filter((l) => completedLevels.includes(l.id)).reduce((sum, l) => sum + l.xpReward, 0);
  const cypressXPEarned =
    trackXP['cypress-ui'] ??
    cypressLevels.filter((l) => completedLevels.includes(l.id)).reduce((sum, l) => sum + l.xpReward, 0);
  const jestXPEarned =
    trackXP.jest ?? jestLevels.filter((l) => completedLevels.includes(l.id)).reduce((sum, l) => sum + l.xpReward, 0);
  const vitestXPEarned =
    trackXP.vitest ??
    vitestLevels.filter((l) => completedLevels.includes(l.id)).reduce((sum, l) => sum + l.xpReward, 0);
  const pythonXPEarned =
    trackXP['python-playwright'] ??
    pythonLevels.filter((l) => completedLevels.includes(l.id)).reduce((sum, l) => sum + l.xpReward, 0);

  const [pwOpen, setPwOpen] = useState(false);
  const [cyOpen, setCyOpen] = useState(false);
  const [jestOpen, setJestOpen] = useState(false);
  const [vitestOpen, setVitestOpen] = useState(false);
  const [pyOpen, setPyOpen] = useState(false);

  const xpTracks = [
    {
      label: 'Playwright',
      icon: '🎭',
      done: playwrightDone,
      total: playwrightLevels.length,
      xpEarned: playwrightXPEarned,
      color: '#818cf8'
    },
    {
      label: 'Cypress',
      icon: '🌲',
      done: cypressDone,
      total: cypressLevels.length,
      xpEarned: cypressXPEarned,
      color: '#22c55e'
    },
    {
      label: 'Jest',
      icon: '🃏',
      done: jestDone,
      total: jestLevels.length,
      xpEarned: jestXPEarned,
      color: '#f59e0b'
    },
    {
      label: 'Vitest',
      icon: '⚡',
      done: vitestDone,
      total: vitestLevels.length,
      xpEarned: vitestXPEarned,
      color: '#fb923c'
    },
    {
      label: 'Python Playwright',
      icon: '🐍',
      done: pythonDone,
      total: pythonLevels.length,
      xpEarned: pythonXPEarned,
      color: '#4ade80'
    }
  ];

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-icon">⚔️</div>
          <h1 className="hero-title">Test Quest</h1>
          <p className="hero-tagline">Learn Playwright through epic story-driven challenges</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-n">{loading ? '…' : levels.length}</div>
            <div className="stat-l">Levels</div>
          </div>
          <div className="stat-card">
            <div className="stat-n">{xp.toLocaleString()}</div>
            <div className="stat-l">Your XP</div>
          </div>
          <div className="stat-card">
            <div className="stat-n">5</div>
            <div className="stat-l">Tracks</div>
          </div>
        </div>
      </div>

      <XPBar tracks={loading ? [] : xpTracks} />

      <div className="home-body">
        {loading && <div className="loading-msg">Loading levels...</div>}
        {error && <div className="error-msg">Failed to load levels: {error}</div>}

        {!loading && !error && (
          <div className="tracks-row tracks-row--six">
            <Link to="/app/game/track/playwright" className="track-card track-playwright">
              <div className="tc-icon">🎭</div>
              <div className="tc-body">
                <h2 className="tc-title">Playwright Testing</h2>
                <p className="tc-desc">UI automation, network interception, API testing and advanced browser control</p>
                <div className="tc-meta">
                  <span className="tc-count">{playwrightLevels.length} Levels</span>
                  <span className="tc-xp">{playwrightTotalXP.toLocaleString()} XP</span>
                </div>
                <div className="tc-progress-track">
                  <div
                    className="tc-progress-fill"
                    style={{
                      width: `${playwrightLevels.length ? (playwrightDone / playwrightLevels.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="tc-done">
                  {playwrightDone} / {playwrightLevels.length} complete
                </span>
                <button
                  type="button"
                  className="tc-topics-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPwOpen((o) => !o);
                  }}
                  aria-expanded={pwOpen}
                >
                  What you&apos;ll learn <span className="tc-topics-chevron">{pwOpen ? '▲' : '▼'}</span>
                </button>
                {pwOpen && (
                  <ul className="tc-topics-list">
                    <li>Page navigation &amp; URL assertions</li>
                    <li>Locators — getByRole, getByTestId, getByText</li>
                    <li>Click, type, fill &amp; keyboard events</li>
                    <li>Network interception &amp; request mocking</li>
                    <li>API endpoint testing</li>
                    <li>Multi-tab, popups &amp; iframes</li>
                    <li>File upload &amp; download</li>
                    <li>Screenshots &amp; visual regression</li>
                  </ul>
                )}
              </div>
              <div className="tc-arrow">→</div>
            </Link>

            <Link to="/app/game/track/cypress-ui" className="track-card track-cypress">
              <div className="tc-icon">🌲</div>
              <div className="tc-body">
                <h2 className="tc-title">Cypress UI Testing</h2>
                <p className="tc-desc">cy.get, cy.type, cy.intercept, viewport, cookies, iframes, dialogs and more</p>
                <div className="tc-meta">
                  <span className="tc-count">{cypressLevels.length} Levels</span>
                  <span className="tc-xp">{cypressTotalXP.toLocaleString()} XP</span>
                </div>
                <div className="tc-progress-track">
                  <div
                    className="tc-progress-fill"
                    style={{ width: `${cypressLevels.length ? (cypressDone / cypressLevels.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="tc-done">
                  {cypressDone} / {cypressLevels.length} complete
                </span>
                <button
                  type="button"
                  className="tc-topics-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCyOpen((o) => !o);
                  }}
                  aria-expanded={cyOpen}
                >
                  What you&apos;ll learn <span className="tc-topics-chevron">{cyOpen ? '▲' : '▼'}</span>
                </button>
                {cyOpen && (
                  <ul className="tc-topics-list">
                    <li>cy.get / cy.contains / cy.find selectors</li>
                    <li>cy.type, cy.click, cy.check, cy.select</li>
                    <li>cy.intercept — stubbing &amp; spying on requests</li>
                    <li>Viewport &amp; responsive testing</li>
                    <li>Cookie &amp; localStorage management</li>
                    <li>iframe &amp; dialog handling</li>
                    <li>Custom commands &amp; aliases</li>
                    <li>Fixtures &amp; data management</li>
                  </ul>
                )}
              </div>
              <div className="tc-arrow">→</div>
            </Link>

            <Link to="/app/game/track/jest" className="track-card track-jest">
              <div className="tc-icon">🃏</div>
              <div className="tc-body">
                <h2 className="tc-title">Jest Unit Testing</h2>
                <p className="tc-desc">
                  Master unit testing with Jest — matchers, mocks, async testing, setup/teardown and more
                </p>
                <div className="tc-meta">
                  <span className="tc-count">{jestLevels.length} Levels</span>
                  <span className="tc-xp">{jestTotalXP.toLocaleString()} XP</span>
                </div>
                <div className="tc-progress-track">
                  <div
                    className="tc-progress-fill"
                    style={{ width: `${jestLevels.length ? (jestDone / jestLevels.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="tc-done">
                  {jestDone} / {jestLevels.length} complete
                </span>
                <button
                  type="button"
                  className="tc-topics-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setJestOpen((o) => !o);
                  }}
                  aria-expanded={jestOpen}
                >
                  What you&apos;ll learn <span className="tc-topics-chevron">{jestOpen ? '▲' : '▼'}</span>
                </button>
                {jestOpen && (
                  <ul className="tc-topics-list">
                    <li>Core matchers — toBe, toEqual, toContain</li>
                    <li>Mock functions &amp; spies (jest.fn())</li>
                    <li>Module mocking &amp; auto-mocking</li>
                    <li>Async / await &amp; Promise testing</li>
                    <li>beforeEach / afterEach / beforeAll lifecycle</li>
                    <li>Snapshot testing</li>
                    <li>Timer mocks (jest.useFakeTimers)</li>
                    <li>Code coverage reporting</li>
                  </ul>
                )}
              </div>
              <div className="tc-arrow">→</div>
            </Link>
            <Link to="/app/game/track/vitest" className="track-card track-vitest">
              <div className="tc-icon">⚡</div>
              <div className="tc-body">
                <h2 className="tc-title">Vitest Unit Testing</h2>
                <p className="tc-desc">
                  Master unit testing with Vitest — vi.fn(), vi.spyOn(), vi.mock(), snapshots, fixtures and more
                </p>
                <div className="tc-meta">
                  <span className="tc-count">{vitestLevels.length} Levels</span>
                  <span className="tc-xp">{vitestTotalXP.toLocaleString()} XP</span>
                </div>
                <div className="tc-progress-track">
                  <div
                    className="tc-progress-fill"
                    style={{ width: `${vitestLevels.length ? (vitestDone / vitestLevels.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="tc-done">
                  {vitestDone} / {vitestLevels.length} complete
                </span>
                <button
                  type="button"
                  className="tc-topics-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setVitestOpen((o) => !o);
                  }}
                  aria-expanded={vitestOpen}
                >
                  What you&apos;ll learn <span className="tc-topics-chevron">{vitestOpen ? '▲' : '▼'}</span>
                </button>
                {vitestOpen && (
                  <ul className="tc-topics-list">
                    <li>vi.fn() mock functions &amp; call tracking</li>
                    <li>vi.spyOn() — spy on methods and modules</li>
                    <li>vi.mock() — module mocking &amp; factories</li>
                    <li>vi.useFakeTimers() &amp; vi.setSystemTime()</li>
                    <li>test.extend fixtures &amp; test context</li>
                    <li>toMatchSnapshot &amp; toMatchInlineSnapshot</li>
                    <li>test.each &amp; describe.each</li>
                    <li>Coverage with v8 and istanbul providers</li>
                  </ul>
                )}
              </div>
              <div className="tc-arrow">→</div>
            </Link>

            <Link to="/app/game/track/python-playwright" className="track-card track-python">
              <div className="tc-icon">🐍</div>
              <div className="tc-body">
                <h2 className="tc-title">Python Playwright</h2>
                <p className="tc-desc">
                  Browser automation with Python — sync_playwright, locators, assertions, route mocking and more
                </p>
                <div className="tc-meta">
                  <span className="tc-count">{pythonLevels.length} Levels</span>
                  <span className="tc-xp">{pythonTotalXP.toLocaleString()} XP</span>
                </div>
                <div className="tc-progress-track">
                  <div
                    className="tc-progress-fill"
                    style={{ width: `${pythonLevels.length ? (pythonDone / pythonLevels.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="tc-done">
                  {pythonDone} / {pythonLevels.length} complete
                </span>
                <button
                  type="button"
                  className="tc-topics-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPyOpen((o) => !o);
                  }}
                  aria-expanded={pyOpen}
                >
                  What you&apos;ll learn <span className="tc-topics-chevron">{pyOpen ? '▲' : '▼'}</span>
                </button>
                {pyOpen && (
                  <ul className="tc-topics-list">
                    <li>sync_playwright &amp; browser lifecycle</li>
                    <li>Locators — locator(), get_by_role(), get_by_text()</li>
                    <li>Assertions — expect().to_have_text(), to_be_visible()</li>
                    <li>Route mocking &amp; response interception</li>
                    <li>Keyboard, hover, dialogs &amp; select</li>
                    <li>Screenshots, viewport &amp; scroll</li>
                    <li>iframes, contexts &amp; cookies</li>
                    <li>Multi-step automation flows</li>
                  </ul>
                )}
              </div>
              <div className="tc-arrow">→</div>
            </Link>

            <Link to="/css-selectors" className="track-card track-selectors">
              <div className="tc-icon">🎯</div>
              <div className="tc-body">
                <h2 className="tc-title">CSS Selectors</h2>
                <p className="tc-desc">
                  Master CSS selectors from scratch — tag, class, ID, combinators, pseudo-classes and more
                </p>
                <div className="tc-meta">
                  <span className="tc-count">42 Lessons</span>
                  <span className="tc-badge">Free</span>
                </div>
                <ul className="tc-topics-list">
                  <li>Tag, class and ID selectors</li>
                  <li>Descendant, child and sibling combinators</li>
                  <li>Attribute selectors</li>
                  <li>:nth-child, :not(), :has() and more</li>
                </ul>
              </div>
              <div className="tc-arrow">→</div>
            </Link>
          </div>
        )}
      </div>

      <div className="home-footer">
        <button
          className="reset-btn"
          onClick={() => {
            if (window.confirm('Reset all progress?')) resetProgress();
          }}
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
}
