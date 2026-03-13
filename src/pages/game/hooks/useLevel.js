import { useState, useEffect } from 'react';
import { gameService } from '@services/api/game/game.service';

export function useLevel(levelId) {
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!levelId) return;
    setLoading(true);
    setError(null);
    gameService
      .getLevel(levelId)
      .then((data) => setLevel(data))
      .catch((err) => setError(err.message || 'Failed to load level'))
      .finally(() => setLoading(false));
  }, [levelId]);

  return { level, loading, error };
}
