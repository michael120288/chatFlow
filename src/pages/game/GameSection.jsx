import { GameProvider } from './context/GameContext';
import { GameLayout } from './components/layout/GameLayout';

export function GameSection() {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}
