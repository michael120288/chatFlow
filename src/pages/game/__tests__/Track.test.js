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

// Playwright + Cypress levels — should never appear on the Jest track
const OTHER_LEVELS = [
  { id: 'level-01', order: 1, category: 'ui',         xpReward: 150, title: 'PW Level', tags: ['click'] },
  { id: 'cy-01',    order: 1, category: 'cypress-ui', xpReward: 200, title: 'CY Level', tags: ['cy.get'] },
];

const ALL_LEVELS = [...JEST_LEVELS, ...OTHER_LEVELS];

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
      expect(screen.queryByText('PW Level')).not.toBeInTheDocument();
    });

    it('does not show Cypress levels on the jest track', async () => {
      renderTrack();
      await screen.findByText('Hello Jest');
      expect(screen.queryByText('CY Level')).not.toBeInTheDocument();
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
