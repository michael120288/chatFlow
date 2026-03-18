import { useGame } from '../context/GameContext';

export function useProgress() {
  const {
    xp,
    trackXP,
    completedLevels,
    totalLevels,
    setTotalLevels,
    addXP,
    completeLevel,
    isCompleted,
    resetProgress
  } = useGame();
  const progressPercent = totalLevels > 0 ? Math.round((completedLevels.length / totalLevels) * 100) : 0;

  return {
    xp,
    trackXP,
    completedLevels,
    totalLevels,
    setTotalLevels,
    progressPercent,
    addXP,
    completeLevel,
    isCompleted,
    resetProgress
  };
}
