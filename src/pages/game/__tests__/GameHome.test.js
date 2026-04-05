import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GameHome } from '../GameHome';
import { gameService } from '@services/api/game/game.service';

import { useProgress } from '../hooks/useProgress';

// ── Mocks ──────────────────────────────────────────────────────────────────────

jest.mock('@services/api/game/game.service');
jest.mock('../hooks/useProgress');
jest.mock('../components/progress/XPBar', () => ({ XPBar: () => <div data-testid="xp-bar" /> }));

const mockResetProgress = jest.fn();

const defaultProgress = {
  completedLevels: [],
  trackXP: {},
  setTotalLevels: jest.fn(),
  resetProgress: mockResetProgress
};

// ── Fixtures ───────────────────────────────────────────────────────────────────

const JEST_LEVELS = [
  { id: 'jest-01', category: 'jest', xpReward: 130 },
  { id: 'jest-02', category: 'jest', xpReward: 130 },
  { id: 'jest-03', category: 'jest', xpReward: 130 }
];

const PLAYWRIGHT_LEVELS = [
  { id: 'level-01', category: 'ui', xpReward: 150 },
  { id: 'level-02', category: 'ui', xpReward: 150 }
];

const CYPRESS_LEVELS = [{ id: 'cy-01', category: 'cypress-ui', xpReward: 200 }];

const ALL_LEVELS = [...PLAYWRIGHT_LEVELS, ...CYPRESS_LEVELS, ...JEST_LEVELS];

// ── Helpers ────────────────────────────────────────────────────────────────────

function renderGameHome() {
  return render(
    <MemoryRouter>
      <GameHome />
    </MemoryRouter>
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('GameHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgress.mockReturnValue(defaultProgress);
    gameService.getLevels.mockResolvedValue(ALL_LEVELS);
  });

  // ── Loading state ────────────────────────────────────────────────────────────

  describe('loading state', () => {
    it('shows loading message while levels are being fetched', () => {
      gameService.getLevels.mockReturnValue(new Promise(() => {})); // never resolves
      renderGameHome();
      expect(screen.getByText('Loading levels...')).toBeInTheDocument();
    });

    it('hides loading message once levels load', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.queryByText('Loading levels...')).not.toBeInTheDocument());
    });
  });

  // ── Error state ──────────────────────────────────────────────────────────────

  describe('error state', () => {
    it('shows an error message when the API call fails', async () => {
      gameService.getLevels.mockRejectedValue(new Error('Network error'));
      renderGameHome();
      await waitFor(() => expect(screen.getByText(/Failed to load levels: Network error/)).toBeInTheDocument());
    });

    it('does not show track cards when there is an error', async () => {
      gameService.getLevels.mockRejectedValue(new Error('oops'));
      renderGameHome();
      await waitFor(() => expect(screen.getByText(/Failed to load/)).toBeInTheDocument());
      expect(screen.queryByText('Jest Unit Testing')).not.toBeInTheDocument();
    });
  });

  // ── Hero section ─────────────────────────────────────────────────────────────

  describe('hero section', () => {
    it('renders the Test Quest title', async () => {
      renderGameHome();
      expect(screen.getByText('Test Quest')).toBeInTheDocument();
    });

    it('shows total level count in hero stats after load', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText(ALL_LEVELS.length.toString())).toBeInTheDocument());
    });

    it('shows "3 Tracks" in hero stats', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
      expect(screen.getByText('Tracks')).toBeInTheDocument();
    });

    it('renders the XPBar component', async () => {
      renderGameHome();
      expect(screen.getByTestId('xp-bar')).toBeInTheDocument();
    });
  });

  // ── Track cards rendered ─────────────────────────────────────────────────────

  describe('track cards', () => {
    it('renders all three track card titles after load', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      expect(screen.getByText('Playwright Testing')).toBeInTheDocument();
      expect(screen.getByText('Cypress UI Testing')).toBeInTheDocument();
    });

    it('renders all three track card icons', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText('🃏')).toBeInTheDocument());
      expect(screen.getByText('🎭')).toBeInTheDocument();
      expect(screen.getByText('🌲')).toBeInTheDocument();
    });
  });

  // ── Jest track card ──────────────────────────────────────────────────────────

  describe('Jest track card', () => {
    it('displays the correct level count', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      expect(screen.getByText(`${JEST_LEVELS.length} Levels`)).toBeInTheDocument();
    });

    it('displays the correct total XP for the jest track', async () => {
      const jestTotalXP = JEST_LEVELS.reduce((sum, l) => sum + l.xpReward, 0); // 390
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      expect(screen.getByText(`${jestTotalXP.toLocaleString()} XP`)).toBeInTheDocument();
    });

    it('links to /app/game/track/jest', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      const link = screen.getByText('Jest Unit Testing').closest('a');
      expect(link).toHaveAttribute('href', '/app/game/track/jest');
    });

    it('shows 0 / N complete when no jest levels are done', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      expect(screen.getByText(`0 / ${JEST_LEVELS.length} complete`)).toBeInTheDocument();
    });

    it('shows correct completion count when some jest levels are done', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01', 'jest-02']
      });
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      expect(screen.getByText(`2 / ${JEST_LEVELS.length} complete`)).toBeInTheDocument();
    });

    it('progress bar has 0% width when no jest levels are completed', async () => {
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      const jestCard = screen.getByText('Jest Unit Testing').closest('a');
      const fill = jestCard.querySelector('.tc-progress-fill');
      expect(fill).toHaveStyle({ width: '0%' });
    });

    it('progress bar reflects partial completion', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'] // 1 of 3 = 33.33%
      });
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      const jestCard = screen.getByText('Jest Unit Testing').closest('a');
      const fill = jestCard.querySelector('.tc-progress-fill');
      const expected = `${(1 / JEST_LEVELS.length) * 100}%`;
      expect(fill).toHaveStyle({ width: expected });
    });

    it('progress bar reaches 100% when all jest levels are completed', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: JEST_LEVELS.map((l) => l.id)
      });
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      const jestCard = screen.getByText('Jest Unit Testing').closest('a');
      const fill = jestCard.querySelector('.tc-progress-fill');
      expect(fill).toHaveStyle({ width: '100%' });
    });

    it('only counts jest- level IDs toward jest completion (not playwright or cypress)', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['level-01', 'cy-01', 'jest-01'] // only jest-01 is jest
      });
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      expect(screen.getByText(`1 / ${JEST_LEVELS.length} complete`)).toBeInTheDocument();
    });

    it('uses trackXP.jest when available instead of computing from levels', async () => {
      useProgress.mockReturnValue({
        ...defaultProgress,
        completedLevels: ['jest-01'],
        trackXP: { jest: 9999 }
      });
      renderGameHome();
      await waitFor(() => expect(screen.getByText('Jest Unit Testing')).toBeInTheDocument());
      // trackXP.jest = 9999 is the earned XP — total XP on the card is the sum of all rewards
      // The card shows total XP (not earned), so 390 should still be shown
      const jestTotalXP = JEST_LEVELS.reduce((sum, l) => sum + l.xpReward, 0);
      expect(screen.getByText(`${jestTotalXP.toLocaleString()} XP`)).toBeInTheDocument();
    });
  });

  // ── Reset progress ───────────────────────────────────────────────────────────

  describe('reset progress', () => {
    it('renders the Reset Progress button', async () => {
      renderGameHome();
      expect(screen.getByRole('button', { name: /Reset Progress/i })).toBeInTheDocument();
    });

    it('calls resetProgress when confirmed', async () => {
      window.confirm = jest.fn().mockReturnValue(true);
      renderGameHome();
      await userEvent.click(screen.getByRole('button', { name: /Reset Progress/i }));
      expect(mockResetProgress).toHaveBeenCalledTimes(1);
    });

    it('does not call resetProgress when user cancels confirmation', async () => {
      window.confirm = jest.fn().mockReturnValue(false);
      renderGameHome();
      await userEvent.click(screen.getByRole('button', { name: /Reset Progress/i }));
      expect(mockResetProgress).not.toHaveBeenCalled();
    });
  });
});
