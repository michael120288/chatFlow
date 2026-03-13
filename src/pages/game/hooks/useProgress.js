import { useGame } from '../context/GameContext';

const TOTAL_LEVELS = 59;

export function useProgress() {
  const { xp, completedLevels, addXP, completeLevel, isCompleted, resetProgress } = useGame();
  const progressPercent = Math.round((completedLevels.length / TOTAL_LEVELS) * 100);

  return {
    xp,
    completedLevels,
    totalLevels: TOTAL_LEVELS,
    progressPercent,
    addXP,
    completeLevel,
    isCompleted,
    resetProgress
  };
}
