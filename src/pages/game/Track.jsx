import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gameService } from '@services/api/game/game.service';
import { useProgress } from './hooks/useProgress';
import { XPBar } from './components/progress/XPBar';
import './Track.scss';

export function Track() {
  const { category } = useParams();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { completedLevels } = useProgress();

  useEffect(() => {
    gameService
      .getLevels()
      .then(setLevels)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const trackMeta = {
    playwright: {
      icon: '🎭',
      title: 'Playwright Testing',
      desc: 'Master UI automation, network interception, API testing, and advanced browser control',
      sections: [
        {
          title: 'Foundations',
          icon: '🎯',
          desc: 'Core locators, basic actions, assertions, waiting and screenshots',
          orderRange: [1, 35]
        },
        {
          title: 'Browser Features',
          icon: '🌐',
          desc: 'Network routing, iframes, E2E flows, keyboard, dialogs, JS eval, viewport and cookies',
          orderRange: [36, 75]
        },
        {
          title: 'Advanced Interactions',
          icon: '⚡',
          desc: 'File uploads, drag & drop, popups, localStorage, multi-route mocking and boss battles',
          orderRange: [76, 125]
        },
        {
          title: 'Network & Navigation',
          icon: '🔌',
          desc: 'Double-click, DOM filtering, response interception, navigation, dark mode, clock and geolocation',
          orderRange: [126, 175]
        },
        {
          title: 'Locators, Events & Assertions',
          icon: '🔍',
          desc: 'Advanced locators, form assertions, route modification, console events, custom headers, scroll and mouse',
          orderRange: [176, 240]
        },
        {
          title: 'Master Challenges',
          icon: '🏆',
          desc: 'Mobile emulation, accessibility selectors, state checks, API testing, tracing and HAR recording',
          orderRange: [241, 295]
        },
        {
          title: 'File Downloads',
          icon: '⬇️',
          desc: 'page.waitForEvent("download"), download.saveAs(), download.path(), suggestedFilename and cancel',
          orderRange: [296, 300]
        },
        {
          title: 'WebSocket Monitoring',
          icon: '🔌',
          desc: 'page.on("websocket"), framesent/framereceived events, ws.url() and close monitoring',
          orderRange: [301, 305]
        },
        {
          title: 'Expose Functions',
          icon: '📡',
          desc: 'page.exposeFunction(), page.exposeBinding() and context.exposeFunction() — bridge Node.js into the browser',
          orderRange: [306, 310]
        },
        {
          title: 'Init Scripts',
          icon: '🚀',
          desc: 'page.addInitScript() and context.addInitScript() — inject code before any page script runs',
          orderRange: [311, 315]
        },
        {
          title: 'Page Content',
          icon: '📄',
          desc: 'page.content(), locator.innerHTML(), locator.innerText(), locator.textContent() and page.title()',
          orderRange: [316, 320]
        },
        {
          title: 'PDF Generation',
          icon: '🖨️',
          desc: 'page.pdf() — generate PDFs with custom format, margins, headers, footers and scale',
          orderRange: [321, 325]
        },
        {
          title: 'Offline Mode',
          icon: '📴',
          desc: 'context.setOffline() — simulate network offline, test graceful degradation and reconnection',
          orderRange: [326, 330]
        },
        {
          title: 'Locator State Checks',
          icon: '🔎',
          desc: 'locator.isHidden(), isDisabled(), isEditable(), isChecked() and isEnabled()',
          orderRange: [331, 335]
        },
        {
          title: 'All Text Contents',
          icon: '📋',
          desc: 'locator.allTextContents(), locator.allInnerTexts() and locator.all() — collect text from multiple elements',
          orderRange: [336, 340]
        },
        {
          title: 'Bounding Box',
          icon: '📐',
          desc: 'locator.boundingBox() — get element position and size, assert coordinates and detect overlaps',
          orderRange: [341, 345]
        },
        {
          title: 'Dispatch Events',
          icon: '⚡',
          desc: 'locator.dispatchEvent() — fire custom and native DOM events programmatically',
          orderRange: [346, 350]
        },
        {
          title: 'Press Sequentially',
          icon: '⌨️',
          desc: 'locator.pressSequentially(), locator.clear(), locator.blur() — fine-grained keyboard and focus control',
          orderRange: [351, 355]
        },
        {
          title: 'Evaluate Handle',
          icon: '🔬',
          desc: 'page.evaluateHandle(), JSHandle, elementHandle.getProperty() — interact with live JS objects in the browser',
          orderRange: [356, 360]
        },
        {
          title: 'Script & Style Tags',
          icon: '🏷️',
          desc: 'page.addScriptTag() and page.addStyleTag() — inject scripts and CSS into a live page',
          orderRange: [361, 365]
        }
      ]
    },
    'cypress-ui': {
      icon: '🌲',
      title: 'Cypress UI Testing',
      desc: 'Master cy.get, cy.type, cy.intercept, viewport, cookies, iframes, dialogs and more',
      sections: [
        {
          title: 'Core Cypress',
          icon: '🎯',
          desc: 'Selectors, clicks, forms, assertions, intercept, viewport and cookies',
          orderRange: [1, 75]
        },
        {
          title: 'Intermediate',
          icon: '⚡',
          desc: 'DOM traversal, aliases, fixtures, API requests, spies, stubs and sessions',
          orderRange: [76, 150]
        },
        {
          title: 'Advanced Topics',
          icon: '🔮',
          desc: 'Custom commands, test organization, retry-ability and cy.task()',
          orderRange: [151, 170]
        },
        {
          title: 'Component Testing',
          icon: '⚛️',
          desc: 'cy.mount(), props, state, forms, event spies, React Router, Redux, Context and custom mount commands',
          orderRange: [171, 215]
        },
        {
          title: 'End-to-End Journeys',
          icon: '🗺️',
          desc: 'Multi-page flows: authentication, shopping and multi-step forms',
          orderRange: [216, 230]
        },
        {
          title: 'Chai Assertions',
          icon: '⚗️',
          desc: 'Truthiness, equality, comparison, types, strings, properties, length and change',
          orderRange: [231, 275]
        },
        {
          title: 'Chai-jQuery DOM',
          icon: '🔍',
          desc: 'Attributes, CSS, content, form states, focus, DOM structure and visibility',
          orderRange: [276, 310]
        },
        {
          title: 'Sinon-Chai Spies',
          icon: '👁️',
          desc: 'Call counts, arguments, call order and return values with cy.spy() and cy.stub()',
          orderRange: [311, 325]
        },
        {
          title: 'Mocha Test Structure',
          icon: '🧪',
          desc: 'describe, context, before/after, beforeEach/afterEach, it.skip and aliases',
          orderRange: [326, 345]
        },
        {
          title: 'Lodash (Cypress._)',
          icon: '🔧',
          desc: 'filter, map, find, pick, omit, get, merge, sortBy, groupBy, chunk and more',
          orderRange: [346, 360]
        },
        {
          title: 'jQuery (Cypress.$)',
          icon: '💲',
          desc: 'Synchronous DOM queries, traversal, find, parent, closest, filter and siblings',
          orderRange: [361, 370]
        },
        {
          title: 'Minimatch, Promise, Blob & Buffer',
          icon: '📦',
          desc: 'Glob pattern matching, Bluebird promises, blob conversion and binary buffers',
          orderRange: [371, 395]
        },
        {
          title: 'Conditional Testing',
          icon: '🔀',
          desc: 'DOM conditionals, URL params, cookie state, server queries and stability testing',
          orderRange: [396, 420]
        },
        {
          title: 'Network Requests',
          icon: '🌐',
          desc: 'Request modification, response sculpting, network delays, GraphQL intercept and multi-request inspection',
          orderRange: [421, 465]
        },
        {
          title: 'Advanced Stubs, Spies & Clocks',
          icon: '🕰️',
          desc: 'withArgs branching, async resolves/rejects, freezing Date.now(), setInterval control and sinon matchers',
          orderRange: [466, 490]
        },
        {
          title: 'Cross-Origin Testing',
          icon: '🌍',
          desc: 'cy.origin() — visit and interact with pages on different domains, pass args, run assertions and manage cookies across origins',
          orderRange: [491, 495]
        },
        {
          title: 'System Commands',
          icon: '🖥️',
          desc: 'cy.exec() — run shell commands, check exit codes, read stdout/stderr and execute Node scripts during tests',
          orderRange: [496, 500]
        },
        {
          title: 'Reading Files',
          icon: '📖',
          desc: 'cy.readFile() — read fixture files, parse JSON, retry until files exist and specify encodings',
          orderRange: [501, 505]
        },
        {
          title: 'Writing Files',
          icon: '✍️',
          desc: 'cy.writeFile() — write strings and JSON, append to files, share state between tests and reset fixtures',
          orderRange: [506, 510]
        },
        {
          title: 'Environment & Config',
          icon: '⚙️',
          desc: 'Cypress.env() and Cypress.config() — read and set environment variables, use them in cy.visit() and access runtime configuration',
          orderRange: [511, 515]
        },
        {
          title: 'Storage Management',
          icon: '🗄️',
          desc: 'cy.clearAllCookies(), cy.clearAllLocalStorage(), cy.clearAllSessionStorage() and cy.getAllLocalStorage() — full storage control',
          orderRange: [516, 520]
        },
        {
          title: 'Logging',
          icon: '📝',
          desc: 'cy.log() — annotate the command log, log dynamic values, structure multi-step tests and log inside iterations',
          orderRange: [521, 525]
        },
        {
          title: 'Debugging',
          icon: '🔬',
          desc: 'cy.pause(), cy.debug() and .then() — pause execution, inspect subjects in the console and create custom log entries',
          orderRange: [526, 530]
        },
        {
          title: 'Browser Detection',
          icon: '🧭',
          desc: 'Cypress.browser and Cypress.isBrowser() — detect browser name, family, headless mode and write conditional cross-browser logic',
          orderRange: [531, 535]
        },
        {
          title: 'File Selection',
          icon: '📎',
          desc: '.selectFile() — attach real and virtual files, select multiple files, simulate drag-and-drop uploads and read the FileList',
          orderRange: [536, 540]
        },
        {
          title: 'Shadow DOM',
          icon: '👥',
          desc: '.shadow() — pierce shadow boundaries, find nested elements, click inside shadow DOM and use includeShadowDom option',
          orderRange: [541, 545]
        },
        {
          title: 'Focus Management',
          icon: '🎯',
          desc: 'cy.focused() and .blur() — get the focused element, assert focus, navigate with Tab and verify blur behaviour',
          orderRange: [546, 550]
        },
        {
          title: 'Array Spreading',
          icon: '📦',
          desc: '.spread() — destructure arrays into callback arguments, spread cookies, Promise.all results and DOM element collections',
          orderRange: [551, 555]
        },
        {
          title: 'DOM Root',
          icon: '🌳',
          desc: 'cy.root() — get the document root, use root inside .within() scopes, chain .find() from root and compare with cy.document()',
          orderRange: [556, 560]
        }
      ]
    }
  };
  const meta = trackMeta[category] || trackMeta.playwright;
  const trackLevels = (
    category === 'playwright'
      ? levels.filter((l) => l.category === 'ui' || l.category === 'api')
      : levels.filter((l) => l.category === category)
  ).sort((a, b) => a.order - b.order);

  const isUnlocked = (level) => {
    if (!meta.sections) {
      const idx = trackLevels.findIndex((l) => l.id === level.id);
      if (idx === 0) return true;
      return completedLevels.includes(trackLevels[idx - 1].id);
    }
    // sectioned track: first card of every section is always open
    const section = meta.sections.find((s) => level.order >= s.orderRange[0] && level.order <= s.orderRange[1]);
    if (!section || level.order === section.orderRange[0]) return true;
    const prevLevel = trackLevels.find((l) => l.order === level.order - 1);
    return prevLevel ? completedLevels.includes(prevLevel.id) : true;
  };

  const doneLevels = trackLevels.filter((l) => completedLevels.includes(l.id));
  const totalXP = trackLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const earnedXP = doneLevels.reduce((sum, l) => sum + l.xpReward, 0);
  const nextLevel = trackLevels.find((l) => !completedLevels.includes(l.id));

  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (!meta.sections) return;
    const observers = sectionRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(i);
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs && obs.disconnect());
  }, [meta.sections, loading]);

  const scrollToSection = (i) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`track-page track-${category}`}>
      <div className="track-header">
        <Link to="/app/game" className="back-link">
          ← Home
        </Link>
        <div className="track-header-inner">
          <div className="track-header-icon">{meta.icon}</div>
          <div>
            <h1 className="track-header-title">{meta.title}</h1>
            <p className="track-header-desc">{meta.desc}</p>
          </div>
        </div>

        <div className="track-header-stats">
          <div className="th-stat">
            <div className="th-stat-n">
              {doneLevels.length}/{trackLevels.length}
            </div>
            <div className="th-stat-l">Levels</div>
          </div>
          <div className="th-stat">
            <div className="th-stat-n">{earnedXP.toLocaleString()}</div>
            <div className="th-stat-l">XP Earned</div>
          </div>
          <div className="th-stat">
            <div className="th-stat-n">{totalXP.toLocaleString()}</div>
            <div className="th-stat-l">Total XP</div>
          </div>
        </div>

        {!loading && nextLevel && (
          <Link to={`/app/game/${nextLevel.id}`} className="track-cta">
            {doneLevels.length === 0 ? 'Begin Track' : 'Continue Track'}
            <span>→</span>
          </Link>
        )}
      </div>

      <XPBar completedCount={doneLevels.length} totalCount={trackLevels.length} />

      {meta.sections && !loading && (
        <div className="section-nav">
          {meta.sections.map((section, i) => (
            <button
              key={section.title}
              className={`section-nav-pill${activeSection === i ? ' active' : ''}`}
              onClick={() => scrollToSection(i)}
            >
              <span>{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>
      )}

      <div className="track-body">
        {loading && <div className="track-loading">Loading levels...</div>}
        {error && <div className="track-error">Failed to load levels: {error}</div>}

        {!loading && !error && (
          <>
            <div className="track-progress-bar">
              <div
                className="track-progress-fill"
                style={{ width: `${trackLevels.length ? (doneLevels.length / trackLevels.length) * 100 : 0}%` }}
              />
            </div>

            {meta.sections ? (
              meta.sections.map((section, sectionIdx) => {
                const sectionLevels = trackLevels.filter(
                  (l) => l.order >= section.orderRange[0] && l.order <= section.orderRange[1]
                );
                const doneSectionCount = sectionLevels.filter((l) => completedLevels.includes(l.id)).length;
                return (
                  <div
                    key={section.title}
                    className="track-section"
                    ref={(el) => (sectionRefs.current[sectionIdx] = el)}
                  >
                    <div className="section-header">
                      <span className="section-icon">{section.icon}</span>
                      <div className="section-header-text">
                        <div className="section-title">{section.title}</div>
                        <div className="section-desc">{section.desc}</div>
                      </div>
                      <div className="section-count">
                        {doneSectionCount}/{sectionLevels.length}
                      </div>
                    </div>
                    <div className="track-grid">
                      {sectionLevels.map((level) => {
                        const idx = trackLevels.findIndex((l) => l.id === level.id);
                        const done = completedLevels.includes(level.id);
                        const unlocked = isUnlocked(level);
                        return (
                          <Link
                            key={level.id}
                            to={unlocked ? `/app/game/${level.id}` : '#'}
                            className={`level-card ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                            onClick={(e) => !unlocked && e.preventDefault()}
                          >
                            <div className="card-order">{String(idx + 1).padStart(2, '0')}</div>
                            <div className="card-status">{done ? '✓' : !unlocked ? '🔒' : '▶'}</div>
                            <div className="card-title">{level.title}</div>
                            <div className="card-tags">
                              {level.tags.slice(0, 2).map((t) => (
                                <span key={t} className="tag">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="card-xp">+{level.xpReward} XP</div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="track-grid">
                {trackLevels.map((level, idx) => {
                  const done = completedLevels.includes(level.id);
                  const unlocked = isUnlocked(level);
                  return (
                    <Link
                      key={level.id}
                      to={unlocked ? `/app/game/${level.id}` : '#'}
                      className={`level-card ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                      onClick={(e) => !unlocked && e.preventDefault()}
                    >
                      <div className="card-order">{String(idx + 1).padStart(2, '0')}</div>
                      <div className="card-status">{done ? '✓' : !unlocked ? '🔒' : '▶'}</div>
                      <div className="card-title">{level.title}</div>
                      <div className="card-tags">
                        {level.tags.slice(0, 2).map((t) => (
                          <span key={t} className="tag">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="card-xp">+{level.xpReward} XP</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
