import PropTypes from 'prop-types';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gameService } from '@services/api/game/game.service';

const STORAGE_KEY = 'test-quest-progress';

const defaultState = {
  xp: 0,
  trackXP: {},
  completedLevels: [],
  currentLevelId: null,
  solutions: {}
};

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaultState;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const GameContext = createContext(undefined);

export function GameProvider({ children }) {
  const { token } = useSelector((state) => state.user);
  const isAuthenticated = !!token;
  const [state, setState] = useState(loadState);
  const [serverLoaded, setServerLoaded] = useState(false);
  const [totalLevels, setTotalLevels] = useState(59);

  useEffect(() => {
    if (!isAuthenticated) {
      setServerLoaded(false);
      return;
    }
    gameService
      .getProgress()
      .then(({ completedLevels, xp }) => {
        // Recompute trackXP from completed levels so stale localStorage data never bleeds across users
        gameService
          .getLevels()
          .then((levels) => {
            const trackXP = {};
            for (const id of completedLevels) {
              const lvl = levels.find((l) => l.id === id);
              if (lvl) trackXP[lvl.category] = (trackXP[lvl.category] ?? 0) + (lvl.xp ?? 0);
            }
            setTotalLevels(levels.length);
            setState((prev) => ({ ...prev, completedLevels, xp, trackXP }));
            setServerLoaded(true);
          })
          .catch(() => {
            setState((prev) => ({ ...prev, completedLevels, xp, trackXP: {} }));
            setServerLoaded(true);
          });
      })
      .catch(() => {
        setServerLoaded(true);
      });
  }, [isAuthenticated]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!isAuthenticated || !serverLoaded) return;
    gameService.saveProgress({ completedLevels: state.completedLevels, xp: state.xp }).catch((err) => { console.warn('Progress sync failed:', err?.message); });
  }, [state.completedLevels, state.xp, isAuthenticated, serverLoaded]);

  const addXP = useCallback((amount, track) => {
    setState((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      trackXP: track ? { ...prev.trackXP, [track]: (prev.trackXP[track] ?? 0) + amount } : prev.trackXP
    }));
  }, []);

  const completeLevel = useCallback((levelId) => {
    setState((prev) => ({
      ...prev,
      completedLevels: prev.completedLevels.includes(levelId)
        ? prev.completedLevels
        : [...prev.completedLevels, levelId]
    }));
  }, []);

  const setCurrentLevel = useCallback((levelId) => {
    setState((prev) => ({ ...prev, currentLevelId: levelId }));
  }, []);

  const isCompleted = useCallback((levelId) => state.completedLevels.includes(levelId), [state.completedLevels]);

  const saveSolution = useCallback((levelId, code) => {
    setState((prev) => ({
      ...prev,
      solutions: { ...prev.solutions, [levelId]: code }
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        totalLevels,
        setTotalLevels,
        addXP,
        completeLevel,
        setCurrentLevel,
        isCompleted,
        saveSolution,
        resetProgress
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

GameProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
