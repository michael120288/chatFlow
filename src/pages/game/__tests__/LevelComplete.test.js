import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LevelComplete } from '../LevelComplete';

import { useLevel } from '../hooks/useLevel';
import { useProgress } from '../hooks/useProgress';

jest.mock('../hooks/useLevel');
jest.mock('../hooks/useProgress');

const JEST_LEVEL = {
  id: 'jest-02',
  title: 'Equality',
  order: 2,
  xpReward: 130,
  category: 'jest'
};

const PLAYWRIGHT_LEVEL = {
  id: 'level-05',
  title: 'Fill Form',
  order: 5,
  xpReward: 150,
  category: 'ui'
};

const CYPRESS_LEVEL = {
  id: 'cy-003',
  title: 'First Selector',
  order: 3,
  xpReward: 200,
  category: 'cypress-ui'
};

const defaultProgress = {
  xp: 520,
  completedLevels: ['jest-01', 'jest-02']
};

function renderComplete(levelId = 'jest-02') {
  return render(
    <MemoryRouter initialEntries={[`/app/game/complete/${levelId}`]}>
      <Routes>
        <Route path="/app/game/complete/:levelId" element={<LevelComplete />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LevelComplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useProgress.mockReturnValue(defaultProgress);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Null guard ─────────────────────────────────────────────────────────────

  it('renders nothing when level is null', () => {
    useLevel.mockReturnValue({ level: null });
    const { container } = renderComplete();
    expect(container).toBeEmptyDOMElement();
  });

  // ── Badge and title ────────────────────────────────────────────────────────

  it('shows the level order in the badge', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    expect(screen.getByText('LEVEL 2 COMPLETE!')).toBeInTheDocument();
  });

  it('shows the level title', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    expect(screen.getByText('Equality')).toBeInTheDocument();
  });

  // ── XP display ────────────────────────────────────────────────────────────

  it('shows total XP from progress', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    expect(screen.getByText('Total XP: 520')).toBeInTheDocument();
  });

  it('XP animates to the reward value over time', async () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    // Advance all timers so the interval runs to completion
    act(() => jest.runAllTimers());
    expect(screen.getByText(`+${JEST_LEVEL.xpReward}`)).toBeInTheDocument();
  });

  // ── Stars ─────────────────────────────────────────────────────────────────

  it('stars become visible after 300ms', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    expect(document.querySelector('.stars-row')).not.toHaveClass('visible');
    act(() => jest.advanceTimersByTime(300));
    expect(document.querySelector('.stars-row')).toHaveClass('visible');
  });

  // ── Track progress line ────────────────────────────────────────────────────

  it('shows jest levels completed count', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    // 2 jest levels completed out of 255
    expect(screen.getByText('2 / 255 Jest Levels Complete')).toBeInTheDocument();
  });

  it('shows playwright levels completed count', () => {
    useProgress.mockReturnValue({ xp: 150, completedLevels: ['level-01'] });
    useLevel.mockReturnValue({ level: PLAYWRIGHT_LEVEL });
    renderComplete('level-05');
    expect(screen.getByText('1 / 365 Playwright Levels Complete')).toBeInTheDocument();
  });

  it('shows cypress levels completed count', () => {
    useProgress.mockReturnValue({ xp: 200, completedLevels: ['cy-001', 'cy-002', 'cy-003'] });
    useLevel.mockReturnValue({ level: CYPRESS_LEVEL });
    renderComplete('cy-003');
    expect(screen.getByText('3 / 560 Cypress Levels Complete')).toBeInTheDocument();
  });

  // ── Navigation links ───────────────────────────────────────────────────────

  it('shows Next Level link when not the last level', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    expect(screen.getByText(/Next Level/)).toBeInTheDocument();
  });

  it('Next Level link points to the next jest level', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    // jest-02 → next is jest-03
    expect(screen.getByText(/Next Level/).closest('a')).toHaveAttribute('href', '/app/game/jest-03');
  });

  it('Next Level for playwright points to the correct next id', () => {
    useProgress.mockReturnValue({ xp: 150, completedLevels: ['level-01'] });
    useLevel.mockReturnValue({ level: PLAYWRIGHT_LEVEL });
    renderComplete('level-05');
    // level-05 → next is level-06
    expect(screen.getByText(/Next Level/).closest('a')).toHaveAttribute('href', '/app/game/level-06');
  });

  it('Next Level for cypress uses cy-NNN format', () => {
    useProgress.mockReturnValue({ xp: 200, completedLevels: [] });
    useLevel.mockReturnValue({ level: CYPRESS_LEVEL });
    renderComplete('cy-003');
    // cy-003 → next is cy-004
    expect(screen.getByText(/Next Level/).closest('a')).toHaveAttribute('href', '/app/game/cy-004');
  });

  it('shows final victory message for last jest level', () => {
    useLevel.mockReturnValue({ level: { ...JEST_LEVEL, order: 255 } });
    renderComplete();
    expect(screen.getByText(/True Jest Master/)).toBeInTheDocument();
    expect(screen.queryByText(/Next Level/)).not.toBeInTheDocument();
  });

  it('shows Level Map link', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete();
    expect(screen.getByText('Level Map').closest('a')).toHaveAttribute('href', '/app/game');
  });

  it('shows Play Again link pointing to current level', () => {
    useLevel.mockReturnValue({ level: JEST_LEVEL });
    renderComplete('jest-02');
    expect(screen.getByText('Play Again').closest('a')).toHaveAttribute('href', '/app/game/jest-02');
  });
});
