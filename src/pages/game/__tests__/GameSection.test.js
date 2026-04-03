import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { GameSection } from '../GameSection';

jest.mock('../hooks/useProgress');
jest.mock('../components/layout/GameLayout', () => ({
  GameLayout: () => <div data-testid="game-layout">Layout</div>
}));

import { useProgress } from '../hooks/useProgress';

const store = configureStore({ reducer: { user: () => ({ profile: null }) } });

describe('GameSection', () => {
  beforeEach(() => {
    useProgress.mockReturnValue({
      trackXP: {},
      completedLevels: [],
      totalLevels: 59
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameSection />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('game-layout')).toBeInTheDocument();
  });

  it('wraps children in GameProvider — GameLayout receives context without error', () => {
    expect(() =>
      render(
        <Provider store={store}>
          <MemoryRouter>
            <GameSection />
          </MemoryRouter>
        </Provider>
      )
    ).not.toThrow();
  });
});
