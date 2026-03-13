import { useState, useCallback } from 'react';
import { gameService } from '@services/api/game/game.service';
import { useGame } from '../context/GameContext';

export function useSubmission() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addXP, completeLevel } = useGame();

  const submit = useCallback(
    async (levelId, code) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const res = await gameService.submitCode(levelId, code);
        setResult(res);
        if (res.passed && res.xpAwarded > 0) {
          addXP(res.xpAwarded);
          completeLevel(levelId);
        }
        return res;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Submission failed';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [addXP, completeLevel]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, submit, reset };
}
