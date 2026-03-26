import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { GameProvider, useGame } from '../GameContext';
import { gameService } from '@services/api/game/game.service';

jest.mock('@services/api/game/game.service');

// Build a minimal Redux store with a controllable token
const makeStore = (token = null) => configureStore({ reducer: { user: () => ({ token }) } });

const makeWrapper = (store) =>
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <GameProvider>{children}</GameProvider>
      </Provider>
    );
  };

describe('GameContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    gameService.getProgress.mockResolvedValue({ completedLevels: [], xp: 0 });
    gameService.getLevels.mockResolvedValue([]);
    gameService.saveProgress.mockResolvedValue(undefined);
  });

  // ── Default state ─────────────────────────────────────────────────────────

  it('provides default state', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    expect(result.current.xp).toBe(0);
    expect(result.current.completedLevels).toEqual([]);
    expect(result.current.solutions).toEqual({});
    expect(result.current.currentLevelId).toBeNull();
  });

  // ── addXP ─────────────────────────────────────────────────────────────────

  it('addXP increments xp', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => result.current.addXP(100));
    expect(result.current.xp).toBe(100);
    act(() => result.current.addXP(50));
    expect(result.current.xp).toBe(150);
  });

  it('addXP accumulates multiple calls', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => {
      result.current.addXP(200);
      result.current.addXP(300);
    });
    expect(result.current.xp).toBe(500);
  });

  // ── completeLevel ─────────────────────────────────────────────────────────

  it('completeLevel adds a level to completedLevels', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => result.current.completeLevel('cy-01'));
    expect(result.current.completedLevels).toContain('cy-01');
  });

  it('completeLevel does not add duplicates', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => result.current.completeLevel('cy-01'));
    act(() => result.current.completeLevel('cy-01'));
    expect(result.current.completedLevels.filter((id) => id === 'cy-01')).toHaveLength(1);
  });

  it('completeLevel handles multiple different levels', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => {
      result.current.completeLevel('cy-01');
      result.current.completeLevel('cy-02');
      result.current.completeLevel('cy-03');
    });
    expect(result.current.completedLevels).toEqual(['cy-01', 'cy-02', 'cy-03']);
  });

  // ── isCompleted ───────────────────────────────────────────────────────────

  it('isCompleted returns true for completed levels', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => result.current.completeLevel('cy-01'));
    expect(result.current.isCompleted('cy-01')).toBe(true);
  });

  it('isCompleted returns false for incomplete levels', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    expect(result.current.isCompleted('cy-99')).toBe(false);
  });

  // ── saveSolution ──────────────────────────────────────────────────────────

  it('saveSolution stores code keyed by levelId', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => result.current.saveSolution('cy-01', 'cy.visit("/");'));
    expect(result.current.solutions['cy-01']).toBe('cy.visit("/");');
  });

  it('saveSolution overwrites the previous solution for the same level', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => result.current.saveSolution('cy-01', 'old code'));
    act(() => result.current.saveSolution('cy-01', 'new code'));
    expect(result.current.solutions['cy-01']).toBe('new code');
  });

  it('saveSolution stores solutions for multiple levels independently', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => {
      result.current.saveSolution('cy-01', 'code A');
      result.current.saveSolution('cy-02', 'code B');
    });
    expect(result.current.solutions['cy-01']).toBe('code A');
    expect(result.current.solutions['cy-02']).toBe('code B');
  });

  // ── setCurrentLevel ───────────────────────────────────────────────────────

  it('setCurrentLevel updates currentLevelId', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => result.current.setCurrentLevel('cy-05'));
    expect(result.current.currentLevelId).toBe('cy-05');
  });

  // ── resetProgress ─────────────────────────────────────────────────────────

  it('resetProgress clears xp, completedLevels and solutions', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => {
      result.current.addXP(500);
      result.current.completeLevel('cy-01');
      result.current.saveSolution('cy-01', 'code');
    });
    act(() => result.current.resetProgress());
    expect(result.current.xp).toBe(0);
    expect(result.current.completedLevels).toEqual([]);
  });

  // ── localStorage persistence ──────────────────────────────────────────────

  it('persists state to localStorage', () => {
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    act(() => {
      result.current.addXP(250);
      result.current.completeLevel('cy-01');
    });
    const stored = JSON.parse(localStorage.getItem('test-quest-progress'));
    expect(stored.xp).toBe(250);
    expect(stored.completedLevels).toContain('cy-01');
  });

  it('loads persisted state from localStorage on mount', () => {
    localStorage.setItem(
      'test-quest-progress',
      JSON.stringify({ xp: 999, completedLevels: ['cy-10'], solutions: {}, currentLevelId: null })
    );
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore()) });
    expect(result.current.xp).toBe(999);
    expect(result.current.completedLevels).toContain('cy-10');
  });

  // ── Server sync ───────────────────────────────────────────────────────────

  it('loads server progress when authenticated', async () => {
    gameService.getProgress.mockResolvedValue({ completedLevels: ['cy-01', 'cy-02'], xp: 300 });
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore('token-abc')) });
    await act(async () => {});
    expect(result.current.xp).toBe(300);
    expect(result.current.completedLevels).toEqual(['cy-01', 'cy-02']);
  });

  it('does not call getProgress when not authenticated', async () => {
    const { result: _ } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore(null)) });
    await act(async () => {});
    expect(gameService.getProgress).not.toHaveBeenCalled();
  });

  it('falls back to local state when server request fails', async () => {
    gameService.getProgress.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useGame(), { wrapper: makeWrapper(makeStore('token')) });
    await act(async () => {});
    expect(result.current.xp).toBe(0); // local default still works
  });

  // ── useGame outside provider ──────────────────────────────────────────────

  it('throws when used outside GameProvider', () => {
    const { result } = renderHook(() => {
      try {
        return useGame();
      } catch (e) {
        return e;
      }
    });
    expect(result.current).toBeInstanceOf(Error);
    expect(result.current.message).toMatch(/GameProvider/);
  });
});
