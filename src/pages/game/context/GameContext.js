import PropTypes from 'prop-types';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gameService } from '@services/api/game/game.service';

const STORAGE_KEY = 'test-quest-progress';

const defaultState = {
  xp: 0,
  completedLevels: [],
  currentLevelId: null
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

  useEffect(() => {
    if (!isAuthenticated) {
      setServerLoaded(false);
      return;
    }
    gameService
      .getProgress()
      .then(({ completedLevels, xp }) => {
        setState((prev) => ({ ...prev, completedLevels, xp }));
        setServerLoaded(true);
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
    gameService.saveProgress({ completedLevels: state.completedLevels, xp: state.xp }).catch(() => {});
  }, [state.completedLevels, state.xp, isAuthenticated, serverLoaded]);

  const addXP = useCallback((amount) => {
    setState((prev) => ({ ...prev, xp: prev.xp + amount }));
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

  const resetProgress = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <GameContext.Provider value={{ ...state, addXP, completeLevel, setCurrentLevel, isCompleted, resetProgress }}>
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
