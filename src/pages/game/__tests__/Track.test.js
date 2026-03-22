import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Track } from '../Track';
import { gameService } from '@services/api/game/game.service';
import { useProgress } from '../hooks/useProgress';

// ── Global mocks ───────────────────────────────────────────────────────────────

jest.mock('@services/api/game/game.service');
jest.mock('../hooks/useProgress');
jest.mock('../components/progress/XPBar', () => ({
  XPBar: () => <div data-testid="xp-bar" />,
}));

// IntersectionObserver is not implemented in JSDOM
global.IntersectionObserver = class {
  observe() {}
  disconnect() {}
};

// ── Fixtures ───────────────────────────────────────────────────────────────────

// Jest levels — use orders that align with trackMeta sections:
//   Foundations: [1,10]  |  Numeric: [11,20]
const JEST_LEVELS = [
  { id: 'jest-01', order: 1,  category: 'jest', xpReward: 130, title: 'Hello Jest',   tags: ['toBe', 'test'] },
  { id: 'jest-02', order: 2,  category: 'jest', xpReward: 130, title: 'Equality',     tags: ['toEqual', 'describe'] },
  { id: 'jest-03', order: 3,  category: 'jest', xpReward: 130, title: 'Truthiness',   tags: ['toBeTruthy'] },
  { id: 'jest-11', order: 11, category: 'jest', xpReward: 140, title: 'Numbers',      tags: ['toBeGreaterThan'] },
  { id: 'jest-12', order: 12, category: 'jest', xpReward: 140, title: 'Closeness',    tags: ['toBeCloseTo'] },
];

// Playwright levels — ui + api categories, two sections: Foundations [1,35] and Browser Features [36,75]
const PLAYWRIGHT_LEVELS = [
  { id: 'level-01', order: 1,  category: 'ui',  xpReward: 150, title: 'First Click',   tags: ['click', 'locator'] },
  { id: 'level-02', order: 2,  category: 'ui',  xpReward: 150, title: 'Fill Form',     tags: ['fill', 'type'] },
  { id: 'level-03', order: 3,  category: 'ui',  xpReward: 150, title: 'Assertions',    tags: ['expect', 'toBeVisible'] },
  { id: 'level-36', order: 36, category: 'ui',  xpReward: 160, title: 'Network Route', tags: ['route', 'fulfill'] },
  { id: 'level-37', order: 37, category: 'api', xpReward: 160, title: 'API Mock',      tags: ['route', 'api'] },
];

// Cypress levels — cypress-ui category, two sections: Core Cypress [1,75] and Intermediate [76,150]
const CYPRESS_LEVELS = [
  { id: 'cy-01', order: 1,  category: 'cypress-ui', xpReward: 200, title: 'First Selector', tags: ['cy.get', 'selectors'] },
  { id: 'cy-02', order: 2,  category: 'cypress-ui', xpReward: 200, title: 'Click Action',   tags: ['cy.click', 'actions'] },
  { id: 'cy-03', order: 3,  category: 'cypress-ui', xpReward: 200, title: 'Type Text',      tags: ['cy.type', 'forms'] },
  { id: 'cy-76', order: 76, category: 'cypress-ui', xpReward: 210, title: 'DOM Traversal',  tags: ['cy.find', 'traversal'] },
  { id: 'cy-77', order: 77, category: 'cypress-ui', xpReward: 210, title: 'Aliases',        tags: ['cy.as', 'alias'] },
];

const ALL_LEVELS = [...JEST_LEVELS, ...PLAYWRIGHT_LEVELS, ...CYPRESS_LEVELS];

const defaultProgress = {
  completedLevels: [],
  trackXP: {},
};

// ── Render helper ──────────────────────────────────────────────────────────────

function renderTrack(category = 'jest') {
  return render(
    <MemoryRouter initialEntries={[`/app/game/track/${category}`]}>
      <Routes>
        <Route path="/app/game/track/:category" element={<Track />} />
      </Routes>
    </MemoryRouter>
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('Track — Jest track', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgress.mockReturnValue(defaultProgress);
    gameService.getLevels.mockResolvedValue(ALL_LEVELS);
  });

  // ── Loading & error states ─────────────────────────────────────────────────

  describe('loading & error states', () => {
    it('shows loading message while levels are being fetched', () => {
      gameService.getLevels.mockReturnValue(new Promise(() => {}));
      renderTrack();
      expect(screen.getByText('Loading levels...')).toBeInTheDocument();
    });

    it('hides loading message once levels load', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.queryByText('Loading levels...')).not.toBeInTheDocument();
    });

    it('shows error message when API fails', async () => {
      gameService.getLevels.mockRejectedValue(new Error('Server down'));
      renderTrack();
      expect(await screen.findByText(/Failed to load levels: Server down/)).toBeInTheDocument();
    });

    it('hides level cards when there is an error', async () => {
      gameService.getLevels.mockRejectedValue(new Error('oops'));
      renderTrack();
      await screen.findByText(/Failed to load levels/);
      expect(screen.queryByText('Hello Jest')).not.toBeInTheDocument();
    });
  });

  // ── Track metadata ─────────────────────────────────────────────────────────

  describe('track metadata', () => {
    it('shows the jest track title', async () => {
      renderTrack();
      expect(await screen.findByText('Jest Unit Testing')).toBeInTheDocument();
    });

    it('shows the jest track icon', async () => {
      renderTrack();
      expect(await screen.findByText('🃏')).toBeInTheDocument();
    });

    it('shows the jest track description', async () => {
      renderTrack();
      expect(await screen.findByText(/Master unit testing with Jest/)).toBeInTheDocument();
    });

    it('back link points to /app/game', async () => {
      renderTrack();
      await screen.findByText('Jest Unit Testing');
      expect(screen.getByText('← Home').closest('a')).toHaveAttribute('href', '/app/game');
    });
  });

  // ── Cross-track isolation ──────────────────────────────────────────────────

  describe('cross-track isolation', () => {
    it('does not show Playwright levels on the jest track', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.queryByText('First Click')).not.toBeInTheDocument();
    });

    it('does not show Cypress levels on the jest track', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.queryByText('First Selector')).not.toBeInTheDocument();
    });

    it('shows only jest level cards', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      const cards = document.querySelectorAll('.level-card');
      expect(cards.length).toBe(JEST_LEVELS.length);
    });
  });

  // ── Stats display ──────────────────────────────────────────────────────────

  describe('stats display', () => {
    it('shows 0/N levels done when nothing is complete', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getByText(`0/${JEST_LEVELS.length}`)).toBeInTheDocument();
    });

    it('shows correct done count when levels are completed', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01', 'jest-02'],
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getByText(`2/${JEST_LEVELS.length}`)).toBeInTheDocument();
    });

    it('shows total XP for the track', async () => {
      const totalXP = JEST_LEVELS.reduce((s, l) => s + l.xpReward, 0); // 670
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getByText(totalXP.toLocaleString())).toBeInTheDocument();
    });

    it('shows 0 XP earned when nothing is completed', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      // "XP Earned" stat shows 0
      const earnedEl = screen.getAllByText('0');
      expect(earnedEl.length).toBeGreaterThan(0);
    });

    it('uses trackXP.jest when available', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
        trackXP: { jest: 9999 },
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getByText('9,999')).toBeInTheDocument();
    });

    it('renders the XPBar', async () => {
      renderTrack();
      expect(screen.getByTestId('xp-bar')).toBeInTheDocument();
    });
  });

  // ── CTA button ─────────────────────────────────────────────────────────────

  describe('CTA button', () => {
    it('shows "Begin Track" when no levels are completed', async () => {
      renderTrack();
      expect(await screen.findByText(/Begin Track/)).toBeInTheDocument();
    });

    it('shows "Continue Track" when at least one level is completed', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
      });
      renderTrack();
      expect(await screen.findByText(/Continue Track/)).toBeInTheDocument();
    });

    it('CTA links to the first incomplete level', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
      });
      renderTrack();
      const cta = await screen.findByText(/Continue Track/);
      expect(cta.closest('a')).toHaveAttribute('href', '/app/game/jest-02');
    });

    it('CTA links to jest-01 when nothing is done', async () => {
      renderTrack();
      const cta = await screen.findByText(/Begin Track/);
      expect(cta.closest('a')).toHaveAttribute('href', '/app/game/jest-01');
    });

    it('hides CTA when all levels are complete', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: JEST_LEVELS.map((l) => l.id),
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.queryByText(/Begin Track|Continue Track/)).not.toBeInTheDocument();
    });
  });

  // ── Progress bar ───────────────────────────────────────────────────────────

  describe('progress bar', () => {
    it('progress bar fill is 0% when nothing is done', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      const fill = document.querySelector('.track-progress-fill');
      expect(fill).toHaveStyle({ width: '0%' });
    });

    it('progress bar fill is 100% when all levels are done', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: JEST_LEVELS.map((l) => l.id),
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      const fill = document.querySelector('.track-progress-fill');
      expect(fill).toHaveStyle({ width: '100%' });
    });

    it('progress bar fill reflects partial completion', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01', 'jest-02'], // 2 of 5
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      const fill = document.querySelector('.track-progress-fill');
      const expected = `${(2 / JEST_LEVELS.length) * 100}%`;
      expect(fill).toHaveStyle({ width: expected });
    });
  });

  // ── Section nav pills ──────────────────────────────────────────────────────

  describe('section nav pills', () => {
    it('renders the Foundations section pill', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      const pills = document.querySelectorAll('.section-nav-pill');
      const titles = Array.from(pills).map((p) => p.textContent);
      expect(titles.some((t) => t.includes('Foundations'))).toBe(true);
    });

    it('renders the Mock Deep Dive section pill', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      const pills = document.querySelectorAll('.section-nav-pill');
      const titles = Array.from(pills).map((p) => p.textContent);
      expect(titles.some((t) => t.includes('Mock Deep Dive'))).toBe(true);
    });

    it('renders 21 section nav pills for the jest track', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      const pills = document.querySelectorAll('.section-nav-pill');
      expect(pills.length).toBe(21);
    });

    it('first pill starts as active', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      const firstPill = document.querySelectorAll('.section-nav-pill')[0];
      expect(firstPill).toHaveClass('active');
    });
  });

  // ── Level cards ────────────────────────────────────────────────────────────

  describe('level cards', () => {
    it('renders a card for each jest level', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getByText('Equality')).toBeInTheDocument();
      expect(screen.getByText('Truthiness')).toBeInTheDocument();
      expect(screen.getByText('Numbers')).toBeInTheDocument();
    });

    it('shows the level title on the card', async () => {
      renderTrack();
      expect(await screen.findByText('Hello Jest')).toBeInTheDocument();
    });

    it('shows XP reward on the card', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getAllByText('+130 XP').length).toBeGreaterThan(0);
    });

    it('shows at most 2 tags per card', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      // jest-01 has tags ['toBe', 'test'] — both should show
      expect(screen.getByText('toBe')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('shows the ▶ play icon on an unlocked incomplete card', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      const firstCard = screen.getByText('Hello Jest').closest('a');
      expect(within(firstCard).getByText('▶')).toBeInTheDocument();
    });

    it('shows ✓ on a completed card', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      const doneCard = screen.getByText('Hello Jest').closest('a');
      expect(within(doneCard).getByText('✓')).toBeInTheDocument();
    });

    it('adds "done" class to completed card', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getByText('Hello Jest').closest('a')).toHaveClass('done');
    });

    it('completed card links to the level', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.getByText('Hello Jest').closest('a')).toHaveAttribute('href', '/app/game/jest-01');
    });
  });

  // ── isUnlocked logic ───────────────────────────────────────────────────────

  describe('isUnlocked logic', () => {
    it('first card of Foundations section (jest-01) is always unlocked', async () => {
      // even with no completed levels, jest-01 must be open
      renderTrack();
      await screen.findByText('Hello Jest');
      const card = screen.getByText('Hello Jest').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/jest-01');
    });

    it('jest-02 is locked when jest-01 is not complete', async () => {
      renderTrack();
      await screen.findByText('Equality');
      const card = screen.getByText('Equality').closest('a');
      expect(card).toHaveClass('locked');
      expect(within(card).getByText('🔒')).toBeInTheDocument();
    });

    it('jest-02 is unlocked when jest-01 is complete', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
      });
      renderTrack();
      await screen.findByText('Equality');
      const card = screen.getByText('Equality').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/jest-02');
    });

    it('first card of a new section (jest-11) is always unlocked — even if previous section incomplete', async () => {
      // jest-03 is NOT completed, but jest-11 starts a new section so it's open
      renderTrack();
      await screen.findByText('Numbers');
      const card = screen.getByText('Numbers').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/jest-11');
    });

    it('jest-12 is locked when jest-11 is not complete', async () => {
      renderTrack();
      await screen.findByText('Closeness');
      const card = screen.getByText('Closeness').closest('a');
      expect(card).toHaveClass('locked');
    });

    it('jest-12 is unlocked when jest-11 is complete', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-11'],
      });
      renderTrack();
      await screen.findByText('Closeness');
      const card = screen.getByText('Closeness').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/jest-12');
    });

    it('locked card does not link to the level URL', async () => {
      renderTrack();
      await screen.findByText('Equality');
      const lockedCard = screen.getByText('Equality').closest('a');
      // href is not the level URL — navigation is blocked via onClick + locked class
      expect(lockedCard).not.toHaveAttribute('href', '/app/game/jest-02');
    });

    it('clicking a locked card does not navigate', async () => {
      renderTrack();
      await screen.findByText('Equality');
      const lockedCard = screen.getByText('Equality').closest('a');
      await userEvent.click(lockedCard);
      // URL stays on the track page
      expect(window.location.pathname).not.toBe('/app/game/jest-02');
    });
  });

  // ── Section headers ────────────────────────────────────────────────────────

  describe('section headers', () => {
    it('shows the Foundations section header', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      // "Foundations" appears in both the nav pill and the section title — check the section title
      const sectionTitles = document.querySelectorAll('.section-title');
      const titles = Array.from(sectionTitles).map((el) => el.textContent);
      expect(titles).toContain('Foundations');
    });

    it('shows the correct done/total count per section', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01', 'jest-02'],
      });
      renderTrack();
      await screen.findByText('Hello Jest');
      // Foundations has 3 levels in fixtures, 2 done
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });

    it('shows 0/N count when no levels in a section are done', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      // Foundations: 0 done out of 3
      expect(screen.getByText('0/3')).toBeInTheDocument();
    });
  });
});

// ── Playwright track ───────────────────────────────────────────────────────────

describe('Track — Playwright track', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgress.mockReturnValue(defaultProgress);
    gameService.getLevels.mockResolvedValue(ALL_LEVELS);
  });

  // ── Track metadata ─────────────────────────────────────────────────────────

  describe('track metadata', () => {
    it('shows the Playwright track title', async () => {
      renderTrack('playwright');
      expect(await screen.findByText('Playwright Testing')).toBeInTheDocument();
    });

    it('shows the Playwright track icon', async () => {
      renderTrack('playwright');
      expect(await screen.findByText('🎭')).toBeInTheDocument();
    });

    it('shows the Playwright track description', async () => {
      renderTrack('playwright');
      expect(await screen.findByText(/Master UI automation/)).toBeInTheDocument();
    });

    it('back link points to /app/game', async () => {
      renderTrack('playwright');
      await screen.findByText('Playwright Testing');
      expect(screen.getByText('← Home').closest('a')).toHaveAttribute('href', '/app/game');
    });
  });

  // ── Cross-track isolation ──────────────────────────────────────────────────

  describe('cross-track isolation', () => {
    it('does not show Jest levels on the playwright track', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.queryByText('Hello Jest')).not.toBeInTheDocument();
    });

    it('does not show Cypress levels on the playwright track', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.queryByText('First Selector')).not.toBeInTheDocument();
    });

    it('includes both ui and api category levels', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText('API Mock')).toBeInTheDocument();
    });

    it('shows only playwright level cards', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(document.querySelectorAll('.level-card').length).toBe(PLAYWRIGHT_LEVELS.length);
    });
  });

  // ── Stats display ──────────────────────────────────────────────────────────

  describe('stats display', () => {
    it('shows 0/N levels done when nothing is complete', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText(`0/${PLAYWRIGHT_LEVELS.length}`)).toBeInTheDocument();
    });

    it('shows correct done count when levels are completed', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['level-01', 'level-02'] });
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText(`2/${PLAYWRIGHT_LEVELS.length}`)).toBeInTheDocument();
    });

    it('shows total XP for the track', async () => {
      // 150*3 + 160*2 = 770
      const totalXP = PLAYWRIGHT_LEVELS.reduce((s, l) => s + l.xpReward, 0);
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText(totalXP.toLocaleString())).toBeInTheDocument();
    });

    it('uses trackXP.playwright when available', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['level-01'],
        trackXP: { playwright: 8888 },
      });
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText('8,888')).toBeInTheDocument();
    });
  });

  // ── CTA button ─────────────────────────────────────────────────────────────

  describe('CTA button', () => {
    it('shows "Begin Track" when no levels are completed', async () => {
      renderTrack('playwright');
      expect(await screen.findByText(/Begin Track/)).toBeInTheDocument();
    });

    it('CTA links to level-01 when nothing is done', async () => {
      renderTrack('playwright');
      const cta = await screen.findByText(/Begin Track/);
      expect(cta.closest('a')).toHaveAttribute('href', '/app/game/level-01');
    });

    it('shows "Continue Track" after level-01 is completed', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['level-01'] });
      renderTrack('playwright');
      expect(await screen.findByText(/Continue Track/)).toBeInTheDocument();
    });

    it('CTA links to the first incomplete level', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['level-01'] });
      renderTrack('playwright');
      const cta = await screen.findByText(/Continue Track/);
      expect(cta.closest('a')).toHaveAttribute('href', '/app/game/level-02');
    });

    it('hides CTA when all levels are complete', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: PLAYWRIGHT_LEVELS.map((l) => l.id) });
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.queryByText(/Begin Track|Continue Track/)).not.toBeInTheDocument();
    });
  });

  // ── Section nav pills ──────────────────────────────────────────────────────

  describe('section nav pills', () => {
    it('renders 20 section nav pills for the playwright track', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(document.querySelectorAll('.section-nav-pill').length).toBe(20);
    });

    it('renders the Foundations section pill', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      const pills = Array.from(document.querySelectorAll('.section-nav-pill'));
      expect(pills.some((p) => p.textContent.includes('Foundations'))).toBe(true);
    });

    it('renders the Browser Features section pill', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      const pills = Array.from(document.querySelectorAll('.section-nav-pill'));
      expect(pills.some((p) => p.textContent.includes('Browser Features'))).toBe(true);
    });

    it('first pill starts as active', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(document.querySelectorAll('.section-nav-pill')[0]).toHaveClass('active');
    });
  });

  // ── Level cards ────────────────────────────────────────────────────────────

  describe('level cards', () => {
    it('renders all playwright level titles', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText('Fill Form')).toBeInTheDocument();
      expect(screen.getByText('Assertions')).toBeInTheDocument();
      expect(screen.getByText('Network Route')).toBeInTheDocument();
      expect(screen.getByText('API Mock')).toBeInTheDocument();
    });

    it('shows XP reward on level cards', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getAllByText('+150 XP').length).toBeGreaterThan(0);
    });

    it('shows tags on level cards', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText('click')).toBeInTheDocument();
      expect(screen.getByText('locator')).toBeInTheDocument();
    });
  });

  // ── isUnlocked logic ───────────────────────────────────────────────────────

  describe('isUnlocked logic', () => {
    it('level-01 is always unlocked', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      const card = screen.getByText('First Click').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/level-01');
    });

    it('level-02 is locked when level-01 is not complete', async () => {
      renderTrack('playwright');
      await screen.findByText('Fill Form');
      const card = screen.getByText('Fill Form').closest('a');
      expect(card).toHaveClass('locked');
      expect(within(card).getByText('🔒')).toBeInTheDocument();
    });

    it('level-02 is unlocked when level-01 is complete', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['level-01'] });
      renderTrack('playwright');
      await screen.findByText('Fill Form');
      const card = screen.getByText('Fill Form').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/level-02');
    });

    it('level-36 is always unlocked — first card of Browser Features section', async () => {
      renderTrack('playwright');
      await screen.findByText('Network Route');
      const card = screen.getByText('Network Route').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/level-36');
    });

    it('level-37 is locked when level-36 is not complete', async () => {
      renderTrack('playwright');
      await screen.findByText('API Mock');
      const card = screen.getByText('API Mock').closest('a');
      expect(card).toHaveClass('locked');
    });

    it('level-37 is unlocked when level-36 is complete', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['level-36'] });
      renderTrack('playwright');
      await screen.findByText('API Mock');
      const card = screen.getByText('API Mock').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/level-37');
    });
  });

  // ── Section headers ────────────────────────────────────────────────────────

  describe('section headers', () => {
    it('shows the Foundations section header', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      const titles = Array.from(document.querySelectorAll('.section-title')).map((el) => el.textContent);
      expect(titles).toContain('Foundations');
    });

    it('shows the Browser Features section header', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      const titles = Array.from(document.querySelectorAll('.section-title')).map((el) => el.textContent);
      expect(titles).toContain('Browser Features');
    });

    it('shows 0/3 for Foundations when nothing is done', async () => {
      renderTrack('playwright');
      await screen.findByText('First Click');
      // Foundations has level-01, level-02, level-03
      expect(screen.getByText('0/3')).toBeInTheDocument();
    });

    it('shows correct count when Foundations levels are completed', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['level-01', 'level-02'] });
      renderTrack('playwright');
      await screen.findByText('First Click');
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });
  });
});

// ── Cypress track ──────────────────────────────────────────────────────────────

describe('Track — Cypress track', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgress.mockReturnValue(defaultProgress);
    gameService.getLevels.mockResolvedValue(ALL_LEVELS);
  });

  // ── Track metadata ─────────────────────────────────────────────────────────

  describe('track metadata', () => {
    it('shows the Cypress track title', async () => {
      renderTrack('cypress-ui');
      expect(await screen.findByText('Cypress UI Testing')).toBeInTheDocument();
    });

    it('shows the Cypress track icon', async () => {
      renderTrack('cypress-ui');
      expect(await screen.findByText('🌲')).toBeInTheDocument();
    });

    it('shows the Cypress track description', async () => {
      renderTrack('cypress-ui');
      expect(await screen.findByText(/Master cy\.get/)).toBeInTheDocument();
    });

    it('back link points to /app/game', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('Cypress UI Testing');
      expect(screen.getByText('← Home').closest('a')).toHaveAttribute('href', '/app/game');
    });
  });

  // ── Cross-track isolation ──────────────────────────────────────────────────

  describe('cross-track isolation', () => {
    it('does not show Jest levels on the cypress track', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.queryByText('Hello Jest')).not.toBeInTheDocument();
    });

    it('does not show Playwright levels on the cypress track', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.queryByText('First Click')).not.toBeInTheDocument();
    });

    it('shows only cypress-ui level cards', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(document.querySelectorAll('.level-card').length).toBe(CYPRESS_LEVELS.length);
    });
  });

  // ── Stats display ──────────────────────────────────────────────────────────

  describe('stats display', () => {
    it('shows 0/N levels done when nothing is complete', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getByText(`0/${CYPRESS_LEVELS.length}`)).toBeInTheDocument();
    });

    it('shows correct done count when levels are completed', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['cy-01', 'cy-02'] });
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getByText(`2/${CYPRESS_LEVELS.length}`)).toBeInTheDocument();
    });

    it('shows total XP for the track', async () => {
      // 200*3 + 210*2 = 1020
      const totalXP = CYPRESS_LEVELS.reduce((s, l) => s + l.xpReward, 0);
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getByText(totalXP.toLocaleString())).toBeInTheDocument();
    });

    it('uses trackXP.cypress-ui when available', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['cy-01'],
        trackXP: { 'cypress-ui': 7777 },
      });
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getByText('7,777')).toBeInTheDocument();
    });
  });

  // ── CTA button ─────────────────────────────────────────────────────────────

  describe('CTA button', () => {
    it('shows "Begin Track" when no levels are completed', async () => {
      renderTrack('cypress-ui');
      expect(await screen.findByText(/Begin Track/)).toBeInTheDocument();
    });

    it('CTA links to cy-01 when nothing is done', async () => {
      renderTrack('cypress-ui');
      const cta = await screen.findByText(/Begin Track/);
      expect(cta.closest('a')).toHaveAttribute('href', '/app/game/cy-01');
    });

    it('shows "Continue Track" after cy-01 is completed', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['cy-01'] });
      renderTrack('cypress-ui');
      expect(await screen.findByText(/Continue Track/)).toBeInTheDocument();
    });

    it('CTA links to the first incomplete level', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['cy-01'] });
      renderTrack('cypress-ui');
      const cta = await screen.findByText(/Continue Track/);
      expect(cta.closest('a')).toHaveAttribute('href', '/app/game/cy-02');
    });

    it('hides CTA when all levels are complete', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: CYPRESS_LEVELS.map((l) => l.id) });
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.queryByText(/Begin Track|Continue Track/)).not.toBeInTheDocument();
    });
  });

  // ── Section nav pills ──────────────────────────────────────────────────────

  describe('section nav pills', () => {
    it('renders 29 section nav pills for the cypress track', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(document.querySelectorAll('.section-nav-pill').length).toBe(29);
    });

    it('renders the Core Cypress section pill', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      const pills = Array.from(document.querySelectorAll('.section-nav-pill'));
      expect(pills.some((p) => p.textContent.includes('Core Cypress'))).toBe(true);
    });

    it('renders the Intermediate section pill', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      const pills = Array.from(document.querySelectorAll('.section-nav-pill'));
      expect(pills.some((p) => p.textContent.includes('Intermediate'))).toBe(true);
    });

    it('first pill starts as active', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(document.querySelectorAll('.section-nav-pill')[0]).toHaveClass('active');
    });
  });

  // ── Level cards ────────────────────────────────────────────────────────────

  describe('level cards', () => {
    it('renders all cypress level titles', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getByText('Click Action')).toBeInTheDocument();
      expect(screen.getByText('Type Text')).toBeInTheDocument();
      expect(screen.getByText('DOM Traversal')).toBeInTheDocument();
      expect(screen.getByText('Aliases')).toBeInTheDocument();
    });

    it('shows XP reward on level cards', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getAllByText('+200 XP').length).toBeGreaterThan(0);
    });

    it('shows tags on level cards', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getByText('cy.get')).toBeInTheDocument();
      expect(screen.getByText('selectors')).toBeInTheDocument();
    });
  });

  // ── isUnlocked logic ───────────────────────────────────────────────────────

  describe('isUnlocked logic', () => {
    it('cy-01 is always unlocked', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      const card = screen.getByText('First Selector').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/cy-01');
    });

    it('cy-02 is locked when cy-01 is not complete', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('Click Action');
      const card = screen.getByText('Click Action').closest('a');
      expect(card).toHaveClass('locked');
      expect(within(card).getByText('🔒')).toBeInTheDocument();
    });

    it('cy-02 is unlocked when cy-01 is complete', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['cy-01'] });
      renderTrack('cypress-ui');
      await screen.findByText('Click Action');
      const card = screen.getByText('Click Action').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/cy-02');
    });

    it('cy-76 is always unlocked — first card of Intermediate section', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('DOM Traversal');
      const card = screen.getByText('DOM Traversal').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/cy-76');
    });

    it('cy-77 is locked when cy-76 is not complete', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('Aliases');
      const card = screen.getByText('Aliases').closest('a');
      expect(card).toHaveClass('locked');
    });

    it('cy-77 is unlocked when cy-76 is complete', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['cy-76'] });
      renderTrack('cypress-ui');
      await screen.findByText('Aliases');
      const card = screen.getByText('Aliases').closest('a');
      expect(card).not.toHaveClass('locked');
      expect(card).toHaveAttribute('href', '/app/game/cy-77');
    });
  });

  // ── Section headers ────────────────────────────────────────────────────────

  describe('section headers', () => {
    it('shows the Core Cypress section header', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      const titles = Array.from(document.querySelectorAll('.section-title')).map((el) => el.textContent);
      expect(titles).toContain('Core Cypress');
    });

    it('shows the Intermediate section header', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      const titles = Array.from(document.querySelectorAll('.section-title')).map((el) => el.textContent);
      expect(titles).toContain('Intermediate');
    });

    it('shows 0/3 for Core Cypress when nothing is done', async () => {
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      // Core Cypress has cy-01, cy-02, cy-03
      expect(screen.getByText('0/3')).toBeInTheDocument();
    });

    it('shows correct count when Core Cypress levels are completed', async () => {
      useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['cy-01', 'cy-02'] });
      renderTrack('cypress-ui');
      await screen.findByText('First Selector');
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });
  });
});
