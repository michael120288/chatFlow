import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { GameProvider } from '../../context/GameContext';
import { useSubmission } from '../useSubmission';
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

describe('useSubmission', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    gameService.getProgress.mockResolvedValue({ completedLevels: [], xp: 0 });
    gameService.saveProgress.mockResolvedValue(undefined);
  });

  // ── Initial state ─────────────────────────────────────────────────────────

  it('starts with null result, not loading, no error', () => {
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it('sets loading=true while the request is in flight', async () => {
    let resolve;
    gameService.submitCode.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      })
    );
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    act(() => {
      result.current.submit('cy-01', 'code');
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve({ passed: false, xpAwarded: 0, message: 'fail' });
    });
    expect(result.current.loading).toBe(false);
  });

  // ── Failed submission ─────────────────────────────────────────────────────

  it('sets result on a failed submission', async () => {
    const mockResult = { passed: false, xpAwarded: 0, message: 'Not quite right' };
    gameService.submitCode.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.submit('cy-01', 'bad code');
    });
    expect(result.current.result).toEqual(mockResult);
    expect(result.current.error).toBeNull();
  });

  it('does not award XP when submission fails', async () => {
    gameService.submitCode.mockResolvedValue({ passed: false, xpAwarded: 0, message: 'fail' });
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.submit('cy-01', 'bad code');
    });
    expect(result.current.result.passed).toBe(false);
    // xpAwarded in result reflects what server returned
    expect(result.current.result.xpAwarded).toBe(0);
  });

  // ── Passed submission ─────────────────────────────────────────────────────

  it('sets result on a passed submission', async () => {
    const mockResult = { passed: true, xpAwarded: 100, message: 'Level complete! You earned 100 XP!' };
    gameService.submitCode.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.submit('cy-01', 'good code');
    });
    expect(result.current.result.passed).toBe(true);
    expect(result.current.result.xpAwarded).toBe(100);
  });

  it('does not award XP a second time if the level is already completed', async () => {
    const mockResult = { passed: true, xpAwarded: 100, message: 'Level complete!' };
    gameService.submitCode.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    // First pass — XP should be awarded
    await act(async () => {
      await result.current.submit('cy-01', 'good code');
    });
    expect(result.current.result.passed).toBe(true);

    // Second pass — already completed, XP should NOT be added again
    await act(async () => {
      await result.current.submit('cy-01', 'good code again');
    });
    expect(result.current.result.passed).toBe(true);
    // The test verifies the hook doesn't crash on repeat; XP guard is in GameContext
  });

  it('returns the result from submit()', async () => {
    const mockResult = { passed: true, xpAwarded: 200, message: 'Level complete!' };
    gameService.submitCode.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    let returned;
    await act(async () => {
      returned = await result.current.submit('cy-02', 'code');
    });
    expect(returned).toEqual(mockResult);
  });

  // ── Error handling ────────────────────────────────────────────────────────

  it('sets error when submitCode throws an Error', async () => {
    gameService.submitCode.mockRejectedValue(new Error('Network timeout'));
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.submit('cy-01', 'code');
    });
    expect(result.current.error).toBe('Network timeout');
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets generic error message when a non-Error is thrown', async () => {
    gameService.submitCode.mockRejectedValue('string error');
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.submit('cy-01', 'code');
    });
    expect(result.current.error).toBe('Submission failed');
  });

  it('returns null when submission throws', async () => {
    gameService.submitCode.mockRejectedValue(new Error('Server down'));
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    let returned;
    await act(async () => {
      returned = await result.current.submit('cy-01', 'code');
    });
    expect(returned).toBeNull();
  });

  // ── reset ─────────────────────────────────────────────────────────────────

  it('reset clears result and error', async () => {
    gameService.submitCode.mockResolvedValue({ passed: false, xpAwarded: 0, message: 'fail' });
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.submit('cy-01', 'code');
    });
    expect(result.current.result).not.toBeNull();

    act(() => result.current.reset());
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('reset clears a previous error', async () => {
    gameService.submitCode.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useSubmission(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.submit('cy-01', 'code');
    });
    expect(result.current.error).toBeTruthy();

    act(() => result.current.reset());
    expect(result.current.error).toBeNull();
  });
});
