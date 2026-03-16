import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { GameProvider } from '../../context/GameContext';
import { useProgress } from '../useProgress';
import { gameService } from '@services/api/game/game.service';

jest.mock('@services/api/game/game.service');

const store = configureStore({ reducer: { user: () => ({ token: null }) } });

function Wrapper({ children }) {
  return (
    <Provider store={store}>
      <GameProvider>{children}</GameProvider>
    </Provider>
  );
}

// Match the hardcoded constant in useProgress.js
const TOTAL_LEVELS = 59;

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    gameService.getProgress.mockResolvedValue({ completedLevels: [], xp: 0 });
    gameService.saveProgress.mockResolvedValue(undefined);
  });

  // ── Initial state ─────────────────────────────────────────────────────────

  it('returns zero xp and empty completedLevels initially', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    expect(result.current.xp).toBe(0);
    expect(result.current.completedLevels).toEqual([]);
  });

  it('returns progressPercent of 0 with no completed levels', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    expect(result.current.progressPercent).toBe(0);
  });

  it('exposes totalLevels as the hardcoded constant', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    expect(result.current.totalLevels).toBe(TOTAL_LEVELS);
  });

  // ── progressPercent ───────────────────────────────────────────────────────

  it('calculates progressPercent correctly after completing a level', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    act(() => result.current.completeLevel('cy-01'));
    const expected = Math.round((1 / TOTAL_LEVELS) * 100);
    expect(result.current.progressPercent).toBe(expected);
  });

  it('reaches 100% when all levels are completed', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    // Complete exactly TOTAL_LEVELS unique levels
    act(() => {
      for (let i = 1; i <= TOTAL_LEVELS; i++) {
        result.current.completeLevel(`level-${i}`);
      }
    });
    expect(result.current.progressPercent).toBe(100);
  });

  it('rounds progressPercent to the nearest integer', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    act(() => {
      result.current.completeLevel('cy-01');
      result.current.completeLevel('cy-02');
    });
    const expected = Math.round((2 / TOTAL_LEVELS) * 100);
    expect(result.current.progressPercent).toBe(expected);
    expect(Number.isInteger(result.current.progressPercent)).toBe(true);
  });

  // ── XP passthrough ────────────────────────────────────────────────────────

  it('reflects xp changes from addXP', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    act(() => result.current.addXP(500));
    expect(result.current.xp).toBe(500);
  });

  // ── Exposed functions ─────────────────────────────────────────────────────

  it('exposes addXP, completeLevel, isCompleted and resetProgress', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    expect(typeof result.current.addXP).toBe('function');
    expect(typeof result.current.completeLevel).toBe('function');
    expect(typeof result.current.isCompleted).toBe('function');
    expect(typeof result.current.resetProgress).toBe('function');
  });

  it('isCompleted returns correct boolean', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    act(() => result.current.completeLevel('cy-05'));
    expect(result.current.isCompleted('cy-05')).toBe(true);
    expect(result.current.isCompleted('cy-06')).toBe(false);
  });

  it('resetProgress resets completedLevels and xp to zero', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: Wrapper });
    act(() => {
      result.current.addXP(1000);
      result.current.completeLevel('cy-01');
      result.current.completeLevel('cy-02');
    });
    act(() => result.current.resetProgress());
    expect(result.current.xp).toBe(0);
    expect(result.current.completedLevels).toEqual([]);
    expect(result.current.progressPercent).toBe(0);
  });
});
