import { renderHook, waitFor } from '@testing-library/react';
import { useLevelNavigation } from '../useLevelNavigation';
import { gameService } from '@services/api/game/game.service';

jest.mock('@services/api/game/game.service');

// The module caches the first getLevels() call. We control the cache by
// controlling gameService.getLevels and letting each test set up its own mock.
// jest.isolateModules is NOT used because it re-imports React and breaks hooks.

const LEVELS = [
  { id: 'jest-01', category: 'jest', order: 1 },
  { id: 'jest-02', category: 'jest', order: 2 },
  { id: 'jest-03', category: 'jest', order: 3 },
  { id: 'level-01', category: 'ui', order: 1 },
  { id: 'level-02', category: 'ui', order: 2 }
];

describe('useLevelNavigation', () => {
  // The module-level cache persists across tests in this suite. We seed it once
  // via the first mock and all subsequent tests reuse the cached LEVELS array.
  beforeEach(() => {
    jest.clearAllMocks();
    gameService.getLevels.mockResolvedValue(LEVELS);
  });

  it('returns null/null initially before fetch resolves', () => {
    gameService.getLevels.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useLevelNavigation('jest-01', 'jest'));
    expect(result.current.prevId).toBeNull();
    expect(result.current.nextId).toBeNull();
  });

  // Error test must run before any successful fetch populates the module-level cache.
  // The previous test uses a never-resolving promise so the cache is still null here.
  it('prev/next remain null when fetch errors', async () => {
    gameService.getLevels.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useLevelNavigation('jest-01', 'jest'));
    await new Promise((r) => setTimeout(r, 100));
    expect(result.current.prevId).toBeNull();
    expect(result.current.nextId).toBeNull();
  });

  it('returns null prevId for the first level in track', async () => {
    const { result } = renderHook(() => useLevelNavigation('jest-01', 'jest'));
    await waitFor(() => expect(result.current.nextId).toBe('jest-02'));
    expect(result.current.prevId).toBeNull();
  });

  it('returns correct prev and next for a middle level', async () => {
    const { result } = renderHook(() => useLevelNavigation('jest-02', 'jest'));
    await waitFor(() => expect(result.current.prevId).toBe('jest-01'));
    expect(result.current.nextId).toBe('jest-03');
  });

  it('returns null nextId for the last level in track', async () => {
    const { result } = renderHook(() => useLevelNavigation('jest-03', 'jest'));
    await waitFor(() => expect(result.current.prevId).toBe('jest-02'));
    expect(result.current.nextId).toBeNull();
  });

  it('filters by category — playwright levels are separate from jest', async () => {
    const { result } = renderHook(() => useLevelNavigation('level-01', 'ui'));
    await waitFor(() => expect(result.current.nextId).toBe('level-02'));
    expect(result.current.prevId).toBeNull();
  });

  it('does nothing when levelId is null', async () => {
    const { result } = renderHook(() => useLevelNavigation(null, 'jest'));
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current.prevId).toBeNull();
    expect(result.current.nextId).toBeNull();
  });

  it('does nothing when category is null', async () => {
    const { result } = renderHook(() => useLevelNavigation('jest-01', null));
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current.prevId).toBeNull();
    expect(result.current.nextId).toBeNull();
  });

});
