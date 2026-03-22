import { useState, useEffect } from 'react';
import { gameService } from '@services/api/game/game.service';

// Module-level cache so we only fetch the full level list once per session
let _cachedLevels = null;

async function getLevelsOnce() {
  if (!_cachedLevels) {
    _cachedLevels = await gameService.getLevels();
  }
  return _cachedLevels;
}

export function useLevelNavigation(levelId, category) {
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    if (!levelId || !category) return;
    getLevelsOnce()
      .then((levels) => {
        const track = levels.filter((l) => l.category === category).sort((a, b) => a.order - b.order);
        const idx = track.findIndex((l) => l.id === levelId);
        setPrevId(idx > 0 ? track[idx - 1].id : null);
        setNextId(idx < track.length - 1 ? track[idx + 1].id : null);
      })
      .catch(() => {});
  }, [levelId, category]);

  return { prevId, nextId };
}
