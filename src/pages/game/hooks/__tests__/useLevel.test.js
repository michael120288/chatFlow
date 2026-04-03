import { renderHook, waitFor } from '@testing-library/react';
import { useLevel } from '../useLevel';
import { gameService } from '@services/api/game/game.service';

jest.mock('@services/api/game/game.service');

const LEVEL = {
  id: 'jest-01',
  title: 'Hello Jest',
  category: 'jest',
  xpReward: 130,
  starterCode: 'test("hello", () => {})',
  hints: []
};

describe('useLevel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading=true while fetching', () => {
    gameService.getLevel.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useLevel('jest-01'));
    expect(result.current.loading).toBe(true);
    expect(result.current.level).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns level data on success', async () => {
    gameService.getLevel.mockResolvedValue(LEVEL);
    const { result } = renderHook(() => useLevel('jest-01'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.level).toEqual(LEVEL);
    expect(result.current.error).toBeNull();
  });

  it('returns error message on failure', async () => {
    gameService.getLevel.mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => useLevel('jest-01'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.level).toBeNull();
    expect(result.current.error).toBe('Not found');
  });

  it('uses fallback error message when error has no message', async () => {
    gameService.getLevel.mockRejectedValue({});
    const { result } = renderHook(() => useLevel('jest-01'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to load level');
  });

  it('does nothing when levelId is undefined', () => {
    const { result } = renderHook(() => useLevel(undefined));
    expect(result.current.loading).toBe(false);
    expect(result.current.level).toBeNull();
    expect(gameService.getLevel).not.toHaveBeenCalled();
  });

  it('refetches when levelId changes', async () => {
    const LEVEL_2 = { ...LEVEL, id: 'jest-02', title: 'Equality' };
    gameService.getLevel.mockResolvedValueOnce(LEVEL).mockResolvedValueOnce(LEVEL_2);

    const { result, rerender } = renderHook(({ id }) => useLevel(id), {
      initialProps: { id: 'jest-01' }
    });
    await waitFor(() => expect(result.current.level?.id).toBe('jest-01'));

    rerender({ id: 'jest-02' });
    await waitFor(() => expect(result.current.level?.id).toBe('jest-02'));
    expect(gameService.getLevel).toHaveBeenCalledTimes(2);
  });
});
